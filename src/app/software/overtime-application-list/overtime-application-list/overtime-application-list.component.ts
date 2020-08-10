import { Component, OnInit, ViewChild } from '@angular/core';
import * as wjcGrid from '@grapecity/wijmo.grid';
import { CollectionView, ObservableArray } from '@grapecity/wijmo';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackBarTemplate } from '../../shared/snack-bar-template';

import { DeleteDialogBoxComponent } from '../../shared/delete-dialog-box/delete-dialog-box.component';
import { OvertimeApplicationListService} from './../overtime-application-list.service';
@Component({
  selector: 'app-overtime-application-list',
  templateUrl: './overtime-application-list.component.html',
  styleUrls: ['./overtime-application-list.component.css']
})
export class OvertimeApplicationListComponent implements OnInit {

  constructor(
    private _overtimeApplicationListService: OvertimeApplicationListService,
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

  public _listOvertimeApplicationObservableArray: ObservableArray = new ObservableArray();
  public _listOvertimeApplicationCollectionView: CollectionView = new CollectionView(this._listOvertimeApplicationObservableArray);
  public _listPageIndex: number = 15;
  @ViewChild('flexOvertimeApplication') flexOvertimeApplication: wjcGrid.FlexGrid;
  public _isProgressBarHidden = false;
  public _isDataLoaded: boolean = false;

  private _overtimeListSubscription: any;
  private _addOvertimeApplicationSubscription: any;
  private _deleteOvertimeApplicationSubscription: any;

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
    this._listOvertimeApplicationCollectionView.pageSize = this._listPageIndex;
    this._listOvertimeApplicationCollectionView.refresh();
    this._listOvertimeApplicationCollectionView.refresh();
  }

  private async GetPayrollGroupDropdownListData() {
    this._payrollGroupDropdownSubscription = await (await this._overtimeApplicationListService.PayrollGroupList()).subscribe(
      response => {
        var results = response;
        if (results["length"] > 0) {
          for (var i = 0; i < results["length"]; i++) {
            this._payrollGroupListDropdown.push(results[i]);
          }
        }
        this._filterPayrollGroup = this._payrollGroupListDropdown[0].Value;

        this.GetOvertimeApplicationListData();
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
    this.GetOvertimeApplicationListData();
  }

  private async GetOvertimeApplicationListData() {
    this._listOvertimeApplicationObservableArray = new ObservableArray();
    this._listOvertimeApplicationCollectionView = new CollectionView(this._listOvertimeApplicationObservableArray);
    this._listOvertimeApplicationCollectionView.pageSize = 15;
    this._listOvertimeApplicationCollectionView.trackChanges = true;
    await this._listOvertimeApplicationCollectionView.refresh();
    await this.flexOvertimeApplication.refresh();

    this._isProgressBarHidden = true;

    this._overtimeListSubscription = await (await this._overtimeApplicationListService.OvertimeApplicationList(this._filterPayrollGroup)).subscribe(
      (response: any) => {
        var results = response;
        console.log("Response:", results);

        if (results["length"] > 0) {
          this._listOvertimeApplicationCollectionView = results;
          this._listOvertimeApplicationCollectionView = new CollectionView(this._listOvertimeApplicationCollectionView);
          this._listOvertimeApplicationCollectionView.pageSize = 15;
          this._listOvertimeApplicationCollectionView.trackChanges = true;
          this._listOvertimeApplicationCollectionView.refresh();
          this.flexOvertimeApplication.refresh();
        }

        this._isDataLoaded = true;
        this._isProgressBarHidden = false;
        if (this._overtimeListSubscription != null) this._overtimeListSubscription.unsubscribe();
      },
      error => {
        if (error.status == "401") {
          location.reload();
        } else {
          this._snackBarTemplate.snackBarError(this._snackBar, error.error.Message + " " + " Status Code: " + error.status);
          if (this._overtimeListSubscription != null) this._overtimeListSubscription.unsubscribe();
        }
      }
    );
  }

  public async AddOvertimeApplication() {
    this._buttonDisabled = true;
    if (this._isDataLoaded == true) {
      this._isDataLoaded = false;
      this._addOvertimeApplicationSubscription = await (await this._overtimeApplicationListService.AddOvertimeApplication(this._filterPayrollGroup)).subscribe(
        (response: any) => {
          this._buttonDisabled = false;
          this._isDataLoaded = true;
          this.GetOvertimeApplicationListData();
          this._snackBarTemplate.snackBarSuccess(this._snackBar, "Added Successfully");
          this.router.navigate(['/software/overtime-application-detail/' + response]);
        },
        error => {
          this._buttonDisabled = false;
          this._isDataLoaded = true;
          this._snackBarTemplate.snackBarError(this._snackBar, error.error + " " + " Status Code: " + error.status);
          if (this._addOvertimeApplicationSubscription != null) this._addOvertimeApplicationSubscription.unsubscribe();
        }
      );
    }
  }

  public EditOvertimeApplication() {
    let currentShiftCode = this._listOvertimeApplicationCollectionView.currentItem;
    this.router.navigate(['/software/overtime-application-detail/' + currentShiftCode.Id]);
  }

  public async DeleteOvertimeApplication() {
    if (this._isDataLoaded == true) {
      this._isDataLoaded = false;
      let currentShiftCode = this._listOvertimeApplicationCollectionView.currentItem;
      this._isProgressBarHidden = true;

      this._deleteOvertimeApplicationSubscription = await (await this._overtimeApplicationListService.DeleteOvertimeApplication(currentShiftCode.Id)).subscribe(
        response => {
          this._snackBarTemplate.snackBarSuccess(this._snackBar, "Delete Successfully");
          this.GetOvertimeApplicationListData();
          this._isProgressBarHidden = false;
          this._isDataLoaded = true;
        },
        error => {
          this._isDataLoaded = true;
          this._snackBarTemplate.snackBarError(this._snackBar, error.error + " " + error.status);
          if (this._deleteOvertimeApplicationSubscription != null) this._deleteOvertimeApplicationSubscription.unsubscribe();
        }
      );
    }
  }

  public ComfirmDeleteOvertimeApplication(): void {
    let currentChangeShiftCode = this._listOvertimeApplicationCollectionView.currentItem;
    const userRegistrationlDialogRef = this._matDialog.open(DeleteDialogBoxComponent, {
      width: '500px',
      data: {
        objDialogTitle: "Delete Change Shift",
        objComfirmationMessage: `Delete this ${currentChangeShiftCode.CSNumber}?`,
      },
      disableClose: true
    });

    userRegistrationlDialogRef.afterClosed().subscribe(result => {
      if (result.message == "Yes") {
        this.DeleteOvertimeApplication();
      }
    });
  }

  ngOnDestroy() {
    if (this._overtimeListSubscription != null) this._overtimeListSubscription.unsubscribe();
  }


}
