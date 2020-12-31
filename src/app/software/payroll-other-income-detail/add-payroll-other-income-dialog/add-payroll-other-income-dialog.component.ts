import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackBarTemplate } from '../../shared/snack-bar-template';

import { EmployeeListPickDialogComponent } from './../../shared/employee-list-pick-dialog/employee-list-pick-dialog.component';
import { DatePipe, DecimalPipe } from '@angular/common';
import { PayrollOtherIncomeLineModel, PayrollOtherIncomeLines } from '../payroll-other-income-line.model';
import { PayrollOtherIncomeDetailService } from './../payroll-other-income-detail.service';

import * as wjcGrid from '@grapecity/wijmo.grid';
import { CollectionView, ObservableArray } from '@grapecity/wijmo';

@Component({
  selector: 'app-add-payroll-other-income-dialog',
  templateUrl: './add-payroll-other-income-dialog.component.html',
  styleUrls: ['./add-payroll-other-income-dialog.component.css']
})
export class AddPayrollOtherIncomeDialogComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<AddPayrollOtherIncomeDialogComponent>,
    private _payrollOtherIncomeDetailService: PayrollOtherIncomeDetailService,
    @Inject(MAT_DIALOG_DATA) public caseData: any,
    private _snackBar: MatSnackBar,
    private _snackBarTemplate: SnackBarTemplate,
    public _matDialog: MatDialog,
    private decimalPipe: DecimalPipe,
  ) { }

  ngOnInit(): void {
    this.title = this.caseData.objDialogTitle;
    this.OtherIncomeListData();
  }

  public _payrollOtherIncomeLineModel: PayrollOtherIncomeLineModel = {
    Id: 0,
    PIId: 0,
    EmployeeId: 0,
    Employee: '',
    OtherIncomeId: 0,
    OtherIncome: '',
    Amount: '',
    Particulars: ''
  }

  public title = '';
  public inputTypeAmount = '';

  public isComponentHidden: boolean = true;

  public _otherIncomeDropdownSubscription: any;
  public _otherIncomeListDropdown: any = [];

  public _listBranchesObservableArray: ObservableArray = new ObservableArray();
  public _listBranchesCollectionView: CollectionView = new CollectionView(this._listBranchesObservableArray);
  @ViewChild('flexBranches') flexBranches: wjcGrid.FlexGrid;
  public _isProgressBarHidden = false;
  public _isDataLoaded: boolean = false;
  public _listBranchesViewSize: number = 0;
  public _branches: any;

  private async OtherIncomeListData() {
    this._otherIncomeDropdownSubscription = (await this._payrollOtherIncomeDetailService.OtherIncomeList()).subscribe(
      response => {
        this._otherIncomeListDropdown = response;
        this._payrollOtherIncomeLineModel.OtherIncomeId = this._otherIncomeListDropdown[0].Id;
        if (this._otherIncomeDropdownSubscription !== null) this._otherIncomeDropdownSubscription.unsubscribe();
      },
      error => {
        this._snackBarTemplate.snackBarError(this._snackBar, error.error.Message + " " + error.status);
        if (this._otherIncomeDropdownSubscription !== null) this._otherIncomeDropdownSubscription.unsubscribe();
      }
    );
    this.loadShiftLineDetail();
  }

  private loadShiftLineDetail() {
    this._payrollOtherIncomeLineModel.Id = this.caseData.objPayrollOtherIncomeLine.Id;
    this._payrollOtherIncomeLineModel.PIId = this.caseData.objPayrollOtherIncomeLine.PIId;
    this._payrollOtherIncomeLineModel.EmployeeId = this.caseData.objPayrollOtherIncomeLine.EmployeeId;
    this._payrollOtherIncomeLineModel.Employee = this.caseData.objPayrollOtherIncomeLine.Employee;
    this._payrollOtherIncomeLineModel.OtherIncome = this.caseData.objPayrollOtherIncomeLine.OtherIncome;
    this._payrollOtherIncomeLineModel.Amount = this.decimalPipe.transform(this.caseData.objPayrollOtherIncomeLine.Amount, "1.2-2");
    this._payrollOtherIncomeLineModel.Particulars = this.caseData.objPayrollOtherIncomeLine.Particulars;

    if (this._payrollOtherIncomeLineModel.Id != 0) {
      this._payrollOtherIncomeLineModel.OtherIncomeId = this.caseData.objPayrollOtherIncomeLine.OtherIncomeId;
    }
    this.isComponentHidden = false;

    setTimeout(() => {
      this.GetEmployeeData();
    }, 300);
  }

  public Close(): void {
    this.dialogRef.close(null);
  }

  public EmployeeListDialog() {
    const matDialogRef = this._matDialog.open(EmployeeListPickDialogComponent, {
      width: '900px',
      height: '500',
      data: {
        objDialogTitle: "Employee List",
        objPayrollGroup: this.caseData.objPayrollGroup
      },
      disableClose: true
    });

    matDialogRef.afterClosed().subscribe((data: any) => {
      if (data.event === "Pick") {
        this._payrollOtherIncomeLineModel.EmployeeId = data.employee.Id;
        this._payrollOtherIncomeLineModel.Employee = data.employee.Value;
      }
    });
  }

  public RemoveComma(value: string): string {
    return value.toString().replace(/,/g, '');
  }

  formatValueAmount() {
    this.inputTypeAmount = 'text';

    if (this._payrollOtherIncomeLineModel.Amount == '') {
      this._payrollOtherIncomeLineModel.Amount = this.decimalPipe.transform(0, "1.2-2");
    } else {
      this._payrollOtherIncomeLineModel.Amount = this.decimalPipe.transform(this._payrollOtherIncomeLineModel.Amount, "1.2-2");
    }
  }

  AmountToNumberType() {
    this._payrollOtherIncomeLineModel.Amount = this.RemoveComma(this._payrollOtherIncomeLineModel.Amount);
    this.inputTypeAmount = 'number';
  }

  public _cboShowNumberOfRows: ObservableArray = new ObservableArray();
  public _listPageIndex: number = 15;

  public Create_cboShowNumberOfRows(): void {
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

      this._cboShowNumberOfRows.push({
        rowNumber: rows,
        rowString: rowsString
      });
    }
  }

  public CboShowNumberOfRowsOnSelectedIndexChanged(): void {
    this._listEmployeeCollectionView.pageSize = this._listPageIndex;
    this._listEmployeeCollectionView.refresh();
    this._listEmployeeCollectionView.refresh();
  }

  // =============
  // Employee List
  // =============

  public _listEmployeeObservableArray: ObservableArray = new ObservableArray();
  public _listEmployeeCollectionView: CollectionView = new CollectionView(this._listEmployeeObservableArray);
  @ViewChild('flexEmployees') flexEmployees: wjcGrid.FlexGrid;
  public _isEmployeeListAuthorized: boolean = false;
  public _listEmployeeCollectionViewSize: number = 0;
  public _employees: any;

  private _employeeListSubscription: any;

  private async GetEmployeeData() {
    this._listEmployeeObservableArray = new ObservableArray();
    this._listEmployeeCollectionView = new CollectionView(this._listEmployeeObservableArray);
    this._listEmployeeCollectionView.pageSize = 8;

    this._listEmployeeCollectionView.trackChanges = true;
    await this._listEmployeeCollectionView.refresh();
    await this.flexEmployees.refresh();

    this._isProgressBarHidden = true;

    this._employeeListSubscription = await (await this._payrollOtherIncomeDetailService.EmployeeList(this.caseData.objPayrollGroup)).subscribe(
      (response: any) => {
        var results = response;
        console.log(results);
        if (results["length"] > 0) {
          this._employees = results;
          this._listEmployeeObservableArray = results;
          this._listEmployeeCollectionView = new CollectionView(this._listEmployeeObservableArray);
          this._listEmployeeCollectionView.trackChanges = true;
          this._listEmployeeCollectionView.refresh();
          this.flexEmployees.refresh();
        }
        this._isDataLoaded = true;
        this._isProgressBarHidden = false;
        if (this._employeeListSubscription != null) this._employeeListSubscription.unsubscribe();
      },
      error => {
        this._snackBarTemplate.snackBarError(this._snackBar, error.error.Message + " " + error.status);
        if (this._employeeListSubscription != null) this._employeeListSubscription.unsubscribe();
      }
    );
  }

  headerClick() {
    // console.log("Select all");
  }

  topLeftClicked(e) {
    let val = e.target.checked;
    this.flexEmployees.beginUpdate();
    for (let i = 0; i < this.flexEmployees.rows.length; i++) {
      this.flexEmployees.rows[i].isSelected = val;
    }
    this.flexEmployees.endUpdate();
  }

  rowHeaderClicked(e) {
    let val = e.target.checked;
    let selectedRowCnt = this._getTotalSelectedRows(this.flexEmployees);
    let checked = selectedRowCnt > 0;
    let indeterminate = (selectedRowCnt > 0 && this.flexEmployees.rows.length > selectedRowCnt);
    let cb = this.flexEmployees.topLeftCells.getCellElement(0, 0).querySelector("input") as HTMLInputElement;
    cb.checked = checked;
    cb.indeterminate = indeterminate;
  }

  _getTotalSelectedRows(grid: wjcGrid.FlexGrid) {
    let cnt = 0;
    for (let i = 0; i < grid.rows.length; i++) {
      if (grid.rows[i].isSelected) {
        cnt++;
      }
    }
    return cnt;
  }

  selectRow() {
    let selectedRowCnt = this._getTotalSelectedRows(this.flexEmployees);
    let checked = selectedRowCnt > 0;
    let indeterminate = (selectedRowCnt > 0 && this.flexEmployees.rows.length > selectedRowCnt);
    let cb = this.flexEmployees.topLeftCells.getCellElement(0, 0).querySelector("input") as HTMLInputElement;
    cb.checked = checked;
    cb.indeterminate = indeterminate;
  }

  public selectRows() {
    var collection;
    collection = this._listEmployeeCollectionView;
    for (var p = 0; p < collection.pageCount; p++) {
      for (var i = 0; i < collection.items.length; i++) {
        var row = '';
        collection.items[i].isSelected = true;
      }
    }
  }

  public _isPayrollOtherIncomeLineProgressBarHidden: boolean = false;

  public async Save() {

    let payrollOtherIncomeLines: PayrollOtherIncomeLines = {
      PayrollOtherIncome: this._payrollOtherIncomeLineModel,
      EmployeeList: this.flexEmployees.selectedItems
    };

    this._isPayrollOtherIncomeLineProgressBarHidden = true;

    (await this._payrollOtherIncomeDetailService.AddPayrollOtherIncomeLine(payrollOtherIncomeLines)).subscribe(
      response => {
        this._isPayrollOtherIncomeLineProgressBarHidden = false;
        this.dialogRef.close(200);
        this._snackBarTemplate.snackBarSuccess(this._snackBar, "Save Successfully");
      },
      error => {
        this._isPayrollOtherIncomeLineProgressBarHidden = false;
        this._snackBarTemplate.snackBarError(this._snackBar, error.error + " " + " Status Code: " + error.status);
      }
    );
  }
}

