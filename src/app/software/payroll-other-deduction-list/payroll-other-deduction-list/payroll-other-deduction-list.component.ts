import { Component, OnInit, ViewChild } from '@angular/core';
import * as wjcGrid from '@grapecity/wijmo.grid';
import { CollectionView, ObservableArray } from '@grapecity/wijmo';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackBarTemplate } from '../../shared/snack-bar-template';

import { DeleteDialogBoxComponent } from '../../shared/delete-dialog-box/delete-dialog-box.component';
import { PayrollOtherDeductionListService } from './../payroll-other-deduction-list.service';

@Component({
  selector: 'app-payroll-other-deduction-list',
  templateUrl: './payroll-other-deduction-list.component.html',
  styleUrls: ['./payroll-other-deduction-list.component.css']
})
export class PayrollOtherDeductionListComponent implements OnInit {

  constructor(
    private _payrollOtherDeductionListService: PayrollOtherDeductionListService,
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

  public _listPayrollOtherDeductionObservableArray: ObservableArray = new ObservableArray();
  public _listPayrollOtherDeductionCollectionView: CollectionView = new CollectionView(this._listPayrollOtherDeductionObservableArray);
  public _listPageIndex: number = 15;
  @ViewChild('flexPayrollOtherDeduction') _flexPayrollOtherDeduction: wjcGrid.FlexGrid;
  public _isProgressBarHidden = false;
  public _isDataLoaded: boolean = false;

  private _payrollOtherDeductionListSubscription: any;
  private _addPayrollOtherDeductionSubscription: any;
  private _deletePayrollOtherDeductionSubscription: any;

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
    this._listPayrollOtherDeductionCollectionView.pageSize = this._listPageIndex;
    this._listPayrollOtherDeductionCollectionView.refresh();
    this._listPayrollOtherDeductionCollectionView.refresh();
  }

  private async GetPayrollGroupDropdownListData() {
    this._payrollGroupDropdownSubscription = await (await this._payrollOtherDeductionListService.PayrollGroupList()).subscribe(
      response => {
        var results = response;
        if (results["length"] > 0) {
          for (var i = 0; i < results["length"]; i++) {
            this._payrollGroupListDropdown.push(results[i]);
          }
        }
        this._filterPayrollGroup = this._payrollGroupListDropdown[0].Value;

        this.GetPayrollOtherDeductionListData();
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
    this.GetPayrollOtherDeductionListData();
  }

  private async GetPayrollOtherDeductionListData() {
    this._listPayrollOtherDeductionObservableArray = new ObservableArray();
    this._listPayrollOtherDeductionCollectionView = new CollectionView(this._listPayrollOtherDeductionObservableArray);
    this._listPayrollOtherDeductionCollectionView.pageSize = 15;
    this._listPayrollOtherDeductionCollectionView.trackChanges = true;
    await this._listPayrollOtherDeductionCollectionView.refresh();
    await this._flexPayrollOtherDeduction.refresh();

    this._isProgressBarHidden = true;

    this._payrollOtherDeductionListSubscription = (await this._payrollOtherDeductionListService.PayrollOtherDeductionList(this._filterPayrollGroup)).subscribe(
      (response: any) => {
        var results = response;
        if (results["length"] > 0) {
          this._listPayrollOtherDeductionCollectionView = results;
          this._listPayrollOtherDeductionCollectionView = new CollectionView(this._listPayrollOtherDeductionCollectionView);
          this._listPayrollOtherDeductionCollectionView.pageSize = 15;
          this._listPayrollOtherDeductionCollectionView.trackChanges = true;
          this._listPayrollOtherDeductionCollectionView.refresh();
          this._flexPayrollOtherDeduction.refresh();
        }

        this._isDataLoaded = true;
        this._isProgressBarHidden = false;
        if (this._payrollOtherDeductionListSubscription != null) this._payrollOtherDeductionListSubscription.unsubscribe();
      },
      error => {
        this._isProgressBarHidden = false;
        if (error.status == "401") {
          location.reload();
        } else {
          this._snackBarTemplate.snackBarError(this._snackBar, error.error.Message + " " + " Status Code: " + error.status);
          if (this._payrollOtherDeductionListSubscription != null) this._payrollOtherDeductionListSubscription.unsubscribe();
        }
      }
    );
  }

  public async AddPayrollOtherDeduction() {
    this._buttonDisabled = true;
    if (this._isDataLoaded == true) {
      this._isDataLoaded = false;
      this._addPayrollOtherDeductionSubscription = (await this._payrollOtherDeductionListService.AddPayrollOtherDeduction(this._filterPayrollGroup)).subscribe(
        (response: any) => {
          this._buttonDisabled = false;
          this._isDataLoaded = true;
          this.GetPayrollOtherDeductionListData();
          this._snackBarTemplate.snackBarSuccess(this._snackBar, "Added Successfully");
          this.router.navigate(['/software/payroll-other-deduction-detail/' + response]);
        },
        error => {
          this._buttonDisabled = false;
          this._isDataLoaded = true;
          this._snackBarTemplate.snackBarError(this._snackBar, error.error + " " + " Status Code: " + error.status);
          if (this._addPayrollOtherDeductionSubscription != null) this._addPayrollOtherDeductionSubscription.unsubscribe();
        }
      );
    }
  }

  public EditPayrollOtherDeduction() {
    let currentPayrollOtherDeduction = this._listPayrollOtherDeductionCollectionView.currentItem;
    this.router.navigate(['/software/payroll-other-deduction-detail/' + currentPayrollOtherDeduction.Id]);
  }

  public async DeletePayrollOtherDeduction() {
    if (this._isDataLoaded == true) {
      this._isDataLoaded = false;
      let currentPayrollOtherDeduction = this._listPayrollOtherDeductionCollectionView.currentItem;
      this._isProgressBarHidden = true;

      this._deletePayrollOtherDeductionSubscription = (await this._payrollOtherDeductionListService.DeletePayrollOtherDeduction(currentPayrollOtherDeduction.Id)).subscribe(
        response => {
          this._snackBarTemplate.snackBarSuccess(this._snackBar, "Delete Successfully");
          this.GetPayrollOtherDeductionListData();
          this._isProgressBarHidden = false;
          this._isDataLoaded = true;
        },
        error => {
          this._isDataLoaded = true;
          this._snackBarTemplate.snackBarError(this._snackBar, error.error + " " + error.status);
          if (this._deletePayrollOtherDeductionSubscription != null) this._deletePayrollOtherDeductionSubscription.unsubscribe();
        }
      );
    }
  }

  public ComfirmDeletePayrollOtherDeduction(): void {
    let currentPayrollOtherDeduction = this._listPayrollOtherDeductionCollectionView.currentItem;
    const userRegistrationlDialogRef = this._matDialog.open(DeleteDialogBoxComponent, {
      width: '500px',
      data: {
        objDialogTitle: "Delete Payroll Other Deduction",
        objComfirmationMessage: `Delete ${currentPayrollOtherDeduction.PDNumber}?`,
      },
      disableClose: true
    });

    userRegistrationlDialogRef.afterClosed().subscribe(result => {
      if (result.message == "Yes") {
        this.DeletePayrollOtherDeduction();
      }
    });
  }

  ngOnDestroy() {
    if (this._payrollOtherDeductionListSubscription != null) this._payrollOtherDeductionListSubscription.unsubscribe();
  }

}
