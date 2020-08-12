import { Component, OnInit, ViewChild } from '@angular/core';
import * as wjcGrid from '@grapecity/wijmo.grid';
import { CollectionView, ObservableArray } from '@grapecity/wijmo';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackBarTemplate } from '../../shared/snack-bar-template';

import { DeleteDialogBoxComponent } from '../../shared/delete-dialog-box/delete-dialog-box.component';
import { LeaveApplicationListService } from './../leave-application-list.service';

@Component({
  selector: 'app-leave-application-list',
  templateUrl: './leave-application-list.component.html',
  styleUrls: ['./leave-application-list.component.css']
})
export class LeaveApplicationListComponent implements OnInit {

  constructor(
    private leaveApplicationListService: LeaveApplicationListService,
    private router: Router,
    private _snackBar: MatSnackBar,
    private _snackBarTemplate: SnackBarTemplate,
    public _matDialog: MatDialog,
  ) {
  }

  async ngOnInit() {
    await this.GetPayrollGroupDropdownListData();
    await this.CreateCboShowNumberOfRows();
  }

  private _payrollGroupDropdownSubscription: any;
  public _payrollGroupListDropdown: any = [];
  public _filterPayrollGroup = '';

  public _listLeaveApplicationObservableArray: ObservableArray = new ObservableArray();
  public _listLeaveApplicationCollectionView: CollectionView = new CollectionView(this._listLeaveApplicationObservableArray);
  public _listPageIndex: number = 15;
  @ViewChild('flexLeaveApplication') flexLeaveApplication: wjcGrid.FlexGrid;
  public _isProgressBarHidden = false;
  public _isDataLoaded: boolean = false;

  private _leaveApplicationListSubscription: any;
  private _addLeaveApplicationSubscription: any;
  private _deleteLeaveApplicationSubscription: any;

  public _buttonDisabled: boolean = false;

  public _createCboShowNumberOfRows: ObservableArray = new ObservableArray();

  public CreateCboShowNumberOfRows(): void {
    for (var i = 0; i <= 4; i++) {
      var rows = 0;
      var rowsString = "";
      if (i == 0) {
        rows = 15;
        rowsString = "Show 15";
      } else if (i == 1) {
        rows = 50;
        rowsString = "Show 50";
      } else if (i == 2) {
        rows = 100;
        rowsString = "Show 100";
      } else if (i == 3) {
        rows = 150;
        rowsString = "Show 150";
      } else {
        rows = 200;
        rowsString = "Show 200";
      }

      this._createCboShowNumberOfRows.push({
        rowNumber: rows,
        rowString: rowsString
      });
    }
  }

  public CboShowNumberOfRowsOnSelectedIndexChanged(): void {
    this._listLeaveApplicationCollectionView.pageSize = this._listPageIndex;
    this._listLeaveApplicationCollectionView.refresh();
    this._listLeaveApplicationCollectionView.refresh();
  }

  private async GetPayrollGroupDropdownListData() {
    this._payrollGroupDropdownSubscription = await (await this.leaveApplicationListService.PayrollGroupList()).subscribe(
      response => {
        var results = response;
        if (results["length"] > 0) {
          for (var i = 0; i < results["length"]; i++) {
            this._payrollGroupListDropdown.push(results[i]);
          }
        }
        this._filterPayrollGroup = this._payrollGroupListDropdown[0].Value;

        this.GetLeaveApplicationListData();
        if (this._payrollGroupDropdownSubscription !== null) this._payrollGroupDropdownSubscription.unsubscribe();
      },
      error => {
        if (error.status == "401") {
          location.reload();
        } else {
          this._snackBarTemplate.snackBarError(this._snackBar, error.error.Message + " " + " Status Code: " + error.status);
        }
      }
    );
  }

  public PayrollGroupSelectionChange() {
    this.GetLeaveApplicationListData();
  }

  private async GetLeaveApplicationListData() {
    this._listLeaveApplicationObservableArray = new ObservableArray();
    this._listLeaveApplicationCollectionView = new CollectionView(this._listLeaveApplicationObservableArray);
    this._listLeaveApplicationCollectionView.pageSize = 15;
    this._listLeaveApplicationCollectionView.trackChanges = true;
    await this._listLeaveApplicationCollectionView.refresh();
    await this.flexLeaveApplication.refresh();

    this._isProgressBarHidden = true;

    this._leaveApplicationListSubscription = await (await this.leaveApplicationListService.LeaveApplicationList(this._filterPayrollGroup)).subscribe(
      (response: any) => {
        var results = response;
        console.log("Response:", results);

        if (results["length"] > 0) {
          this._listLeaveApplicationCollectionView = results;
          this._listLeaveApplicationCollectionView = new CollectionView(this._listLeaveApplicationCollectionView);
          this._listLeaveApplicationCollectionView.pageSize = 15;
          this._listLeaveApplicationCollectionView.trackChanges = true;
          this._listLeaveApplicationCollectionView.refresh();
          this.flexLeaveApplication.refresh();
        }

        this._isDataLoaded = true;
        this._isProgressBarHidden = false;
        if (this._leaveApplicationListSubscription != null) this._leaveApplicationListSubscription.unsubscribe();
      },
      error => {
        if (error.status == "401") {
          location.reload();
        } else {
          this._snackBarTemplate.snackBarError(this._snackBar, error.error.Message + " " + " Status Code: " + error.status);
          if (this._leaveApplicationListSubscription != null) this._leaveApplicationListSubscription.unsubscribe();
        }
      }
    );
  }

  public async AddLeaveApplication() {
    this._buttonDisabled = true;
    if (this._isDataLoaded == true) {
      this._isDataLoaded = false;
      this._addLeaveApplicationSubscription = await (await this.leaveApplicationListService.AddLeaveApplication(this._filterPayrollGroup)).subscribe(
        (response: any) => {
          this._buttonDisabled = false;
          this._isDataLoaded = true;
          this.GetLeaveApplicationListData();
          this._snackBarTemplate.snackBarSuccess(this._snackBar, "Added Successfully");
          this.router.navigate(['/software/leave-application-detail/' + response]);
        },
        error => {
          this._buttonDisabled = false;
          this._isDataLoaded = true;
          this._snackBarTemplate.snackBarError(this._snackBar, error.error + " " + " Status Code: " + error.status);
          if (this._addLeaveApplicationSubscription != null) this._addLeaveApplicationSubscription.unsubscribe();
        }
      );
    }
  }

  public EditLeaveApplication() {
    let currentShiftCode = this._listLeaveApplicationCollectionView.currentItem;
    this.router.navigate(['/software/leave-application-detail/' + currentShiftCode.Id]);
  }

  public async DeleteLeaveApplication() {
    if (this._isDataLoaded == true) {
      this._isDataLoaded = false;
      let currentShiftCode = this._listLeaveApplicationCollectionView.currentItem;
      this._isProgressBarHidden = true;

      this._deleteLeaveApplicationSubscription = await (await this.leaveApplicationListService.DeleteLeaveApplication(currentShiftCode.Id)).subscribe(
        response => {
          this._snackBarTemplate.snackBarSuccess(this._snackBar, "Delete Successfully");
          this.GetLeaveApplicationListData();
          this._isProgressBarHidden = false;
          this._isDataLoaded = true;
        },
        error => {
          this._isDataLoaded = true;
          this._snackBarTemplate.snackBarError(this._snackBar, error.error + " " + error.status);
          if (this._deleteLeaveApplicationSubscription != null) this._deleteLeaveApplicationSubscription.unsubscribe();
        }
      );
    }
  }

  public ComfirmDeleteLeaveApplication(): void {
    let currentLeaveApplication = this._listLeaveApplicationCollectionView.currentItem;
    const userRegistrationlDialogRef = this._matDialog.open(DeleteDialogBoxComponent, {
      width: '500px',
      data: {
        objDialogTitle: "Delete Change Shift",
        objComfirmationMessage: `Delete ${currentLeaveApplication.LANumber}?`,
      },
      disableClose: true
    });

    userRegistrationlDialogRef.afterClosed().subscribe(result => {
      if (result.message == "Yes") {
        this.DeleteLeaveApplication();
      }
    });
  }

  ngOnDestroy() {
    if (this._leaveApplicationListSubscription != null) this._leaveApplicationListSubscription.unsubscribe();
  }

}
