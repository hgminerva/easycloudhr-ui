import { Component, OnInit, ViewChild } from '@angular/core';

import * as wjcGrid from '@grapecity/wijmo.grid';
import { CollectionView, ObservableArray } from '@grapecity/wijmo';

import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackBarTemplate } from '../../shared/snack-bar-template';
import { Router } from '@angular/router';

import { DeleteDialogBoxComponent } from '../../shared/delete-dialog-box/delete-dialog-box.component';
import { PayrollListService } from './../payroll-list.service';


@Component({
  selector: 'app-payroll-list',
  templateUrl: './payroll-list.component.html',
  styleUrls: ['./payroll-list.component.css']
})
export class PayrollListComponent implements OnInit {

  // Constructor and overrides
  constructor(private _payrollListService: PayrollListService,
    private _snackBar: MatSnackBar,
    private _snackBarTemplate: SnackBarTemplate,
    public _matDialogRef: MatDialog,
    private _router: Router) {
  }

  // Class properties
  public _listPayrollObservableArray: ObservableArray = new ObservableArray();
  public _listPayrollCollectionView: CollectionView = new CollectionView(this._listPayrollObservableArray);
  public _listPageIndex: number = 15;

  public _isProgressBarHidden = false;
  public _isDataLoaded: boolean = false;

  private _payrollListSubscription: any;
  private _addPayrollSubscription: any;
  private _deletePayrollSubscription: any;

  public _btnAddDisabled: boolean = false;

  // DOM declaration
  @ViewChild('flexPayroll') _flexPayroll: wjcGrid.FlexGrid;

  private _payrollGroupDropdownSubscription: any;
  public _payrollGroupListDropdown: any = [];
  public _filterPayrollGroup = '';

  ngOnInit(): void {
    this._isProgressBarHidden = true;
    this.GetPayrollGroupDropdownListData();
    this.CreateCboShowNumberOfRows();
  }
  // ========================
  // EmployeePayroll Dropdown
  // ========================

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
    this._listPayrollCollectionView.pageSize = this._listPageIndex;
    this._listPayrollCollectionView.refresh();
    this._listPayrollCollectionView.refresh();
  }

  private async GetPayrollGroupDropdownListData() {
    this._payrollGroupDropdownSubscription = (await this._payrollListService.PayrollGroupList()).subscribe(
      response => {
        var results = response;
        if (results["length"] > 0) {
          for (var i = 0; i < results["length"]; i++) {
            this._payrollGroupListDropdown.push(results[i]);
          }
        }
        this._filterPayrollGroup = this._payrollGroupListDropdown[0].Value;
        this.GetPayrollListData();
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
    this.GetPayrollListData();
  }

  private async GetPayrollListData() {
    try {
      this._listPayrollObservableArray = await new ObservableArray();
      this._listPayrollCollectionView = await new CollectionView(this._listPayrollObservableArray);
      this._listPayrollCollectionView.pageSize = await 15;
      this._listPayrollCollectionView.trackChanges = true;
      await this._listPayrollCollectionView.refresh();
      await this._flexPayroll.refresh();


      this._payrollListSubscription = (await this._payrollListService.PayrollList(this._filterPayrollGroup)).subscribe(
        (response: any) => {
          var results = response;
          if (results["length"] > 0) {
            this._listPayrollObservableArray = results;
            this._listPayrollCollectionView = new CollectionView(this._listPayrollObservableArray);
            this._listPayrollCollectionView.pageSize = 15;
            this._listPayrollCollectionView.trackChanges = true;
            this._listPayrollCollectionView.refresh();
            this._flexPayroll.refresh();
          }

          this._isDataLoaded = true;
          this._isProgressBarHidden = false;

          if (this._payrollListSubscription != null) this._payrollListSubscription.unsubscribe();
        },
        error => {
          this._snackBarTemplate.snackBarError(this._snackBar, error.error.Message + " " + error.status);
          if (this._payrollListSubscription !== null) this._payrollListSubscription.unsubscribe();
        }
      );
    }
    catch (e) {
      console.log(e);
    }
  }

  public async AddPayroll() {
    this._btnAddDisabled = true;
    if (this._isDataLoaded == true) {
      this._isDataLoaded = false;
      this._addPayrollSubscription = (await this._payrollListService.AddPayroll(this._filterPayrollGroup)).subscribe(
        (response: any) => {
          this._btnAddDisabled = false;
          this._isDataLoaded = true;
          this._router.navigate(['/software/payroll-detail/' + response]);

          this.GetPayrollListData();
          this._snackBarTemplate.snackBarSuccess(this._snackBar, "Added Successfully");
        },
        error => {
          this._btnAddDisabled = false;
          this._isDataLoaded = true;
          this._snackBarTemplate.snackBarError(this._snackBar, error.error + " " + " Status Code: " + error.status);
          if (this._addPayrollSubscription != null) this._addPayrollSubscription.unsubscribe();
        }
      );
    }
  }

  public EditPayroll() {
    let currentPayroll = this._listPayrollCollectionView.currentItem;
    this._router.navigate(['/software/payroll-detail/' + currentPayroll.Id]);
  }

  public async DeletePayroll() {
    let currentPayroll = this._listPayrollCollectionView.currentItem;
    this._isProgressBarHidden = true;

    if (this._isDataLoaded == true) {
      this._isDataLoaded = false;
      this._deletePayrollSubscription = (await this._payrollListService.DeletePayroll(currentPayroll.Id)).subscribe(
        response => {
          this._snackBarTemplate.snackBarSuccess(this._snackBar, "Delete Successfully");
          this.GetPayrollListData();
          this._isProgressBarHidden = false;
          this._isDataLoaded = true;
        },
        error => {
          this._isDataLoaded = true;
          this._isProgressBarHidden = false;
          this._snackBarTemplate.snackBarError(this._snackBar, error.error + " " + error.status);
          if (this._deletePayrollSubscription != null) this._deletePayrollSubscription.unsubscribe();
        }
      );
    }
  }

  public ComfirmDeletePayroll(): void {
    let currentPayroll = this._listPayrollCollectionView.currentItem;
    const userRegistrationlDialogRef = this._matDialogRef.open(DeleteDialogBoxComponent, {
      width: '500px',
      data: {
        objDialogTitle: "Delete Payroll",
        objComfirmationMessage: ` Delete ${currentPayroll.PAYNumber}?`,
      },
      disableClose: true
    });

    userRegistrationlDialogRef.afterClosed().subscribe(result => {
      if (result.message == "Yes") {
        this.DeletePayroll();
      }
    });
  }

  ngOnDestroy() {
    if (this._payrollGroupDropdownSubscription !== null) this._payrollGroupDropdownSubscription.unsubscribe();
  }

}
