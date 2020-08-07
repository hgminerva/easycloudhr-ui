import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { DtrDetialService } from '../dtr-detial.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackBarTemplate } from '../../shared/snack-bar-template';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DTRLineModel, DTRLines } from '../dtr-line.model';
import { DTRModel } from '../dtr-detial.model';

import * as wjcGrid from '@grapecity/wijmo.grid';
import { CollectionView, ObservableArray } from '@grapecity/wijmo';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

@Component({
  selector: 'app-dtr-detail-dtr-line-add-dialog',
  templateUrl: './dtr-detail-dtr-line-add-dialog.component.html',
  styleUrls: ['./dtr-detail-dtr-line-add-dialog.component.css']
})
export class DtrDetailDtrLineAddDialogComponent implements OnInit {

  constructor(
    public _dtrDetialService: DtrDetialService,
    private _snackBar: MatSnackBar,
    private _snackBarTemplate: SnackBarTemplate,
    public _matDialogRef: MatDialogRef<DtrDetailDtrLineAddDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public _caseData: any,
  ) { }

  public _dTRLines: DTRLines = {
    DailyTimeRecordModel: new DTRModel,
    EmployeeList: [],
    UseEmployeeDefaultShift: false,
    StartDate: new Date(),
    EndDate: new Date(),
    TimeIn1: '',
    TimeOut1: '',
    TimeIn2: '',
    TimeOut2: ''
  }

  public _dTRModel: DTRModel = {
    Id: 0,
    DTRNumber: '',
    DTRDate: new Date(),
    PayrollGroup: '',
    YearId: 0,
    Year: '',
    DateStart: new Date(),
    DateEnd: new Date(),
    OTId: 0,
    OT: '',
    LAId: 0,
    LA: '',
    CSId: 0,
    CS: '',
    Remarks: '',
    PreparedByUserId: 0,
    CheckedByUserId: 0,
    ApprovedByUserId: 0,
    CreatedByUserId: 0,
    CreatedByUser: '',
    CreatedDateTime: new Date(),
    UpdatedByUserId: 0,
    UpdatedByUser: '',
    UpdatedDateTime: new Date(),
    IsLocked: false
  };

  public _dTRLineModel: DTRLineModel = {
    Id: 0,
    DTRId: 0,
    EmployeeId: 0,
    Employee: '',
    DTRDate: new Date(),
    DateType: '',
    IsRestDay: false,
    ShiftId: 0,
    Shift: '',
    Branch: '',
    TimeIn1: '',
    TimeOut1: '',
    TimeIn2: '',
    TimeOut2: '',
    IsOnLeave: false,
    IsOnLeaveHalfDay: false,
    IsOnOfficialBusiness: false,
    IsOnOfficialBusinessHalfDay: false,
    IsAbsent: false,
    IsAbsentHalfDay: false,
    NumberOfHoursWorked: '',
    OvertimeHours: '',
    NightDifferentialHours: '',
    LateHours: '',
    UndertimeHours: '',
    DailyPay: '',
    RestdayPay: '',
    HolidayPay: '',
    OvertimePay: '',
    NightDifferentialPay: '',
    LateDeduction: '',
    UndertimeDeduction: '',
    AbsentDeduction: '',
    DailyNetPay: '',
    Remarks: ''
  }

  public _title = '';
  public _isComponentsShown: boolean = true;

  public _isDTRLineDataLoaded: boolean = true;

  private _addDTRLineSubscription: any;

  public _shiftsDropdownSubscription: any;
  public _useDefaultShift: any = [{ Value: false, Display: "NO" }, { Value: true, Display: "YES" }];
  public _isEployeeDefaultShift: boolean = false;

  async ngOnInit() {
    this._title = await this._caseData.objDialogTitle;
    this._dTRModel = this._caseData.objData;
    this._dTRLines.StartDate = this._caseData.objData.DateStart;
    this._dTRLines.EndDate = this._caseData.objData.DateEnd;
    console.log(this._dTRModel);
    this.Create_cboShowNumberOfRows();
    this.GetEmployeeData();
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
  public _isProgressBarHidden = false;
  public _isDataLoaded: boolean = false;
  public _isEmployeeListAuthorized: boolean = false;
  public _listEmployeeCollectionViewSize: number = 0;
  public _employees: any;

  private _employeeListSubscription: any;

  private async GetEmployeeData() {
    this._listEmployeeObservableArray = new ObservableArray();
    this._listEmployeeCollectionView = new CollectionView(this._listEmployeeObservableArray);
    this._listEmployeeCollectionView.pageSize = 15;
    this._listEmployeeCollectionView.trackChanges = true;
    await this._listEmployeeCollectionView.refresh();
    await this.flexEmployees.refresh();

    this._isProgressBarHidden = true;

    this._employeeListSubscription = await (await this._dtrDetialService.EmployeeList(this._dTRModel.PayrollGroup)).subscribe(
      (response: any) => {
        var results = response;
        if (results["length"] > 0) {
          this._listEmployeeCollectionViewSize = results.length;
          this._employees = results;
          this._listEmployeeObservableArray = results;
          this._listEmployeeCollectionView = new CollectionView(this._listEmployeeObservableArray);
          this._listEmployeeCollectionView.pageSize = 15;
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

  topLeftClicked(e) {
    console.log("CC", this._listEmployeeCollectionViewSize);

    let val = e.target.checked;
    this.flexEmployees.beginUpdate();
    for (let i = 0; i < this.flexEmployees.rows.length; i++) {
      this.flexEmployees.rows[i].isSelected = val;
      console.log(this.flexEmployees.rows[i].isSelected);
    }
    this.flexEmployees.endUpdate();
  }

  public event: any;
  rowHeaderClicked(e) {
    this.event = e;
    let val = e.target.checked;
    let selectedRowCnt = this._getTotalSelectedRows(this.flexEmployees);
    let checked = selectedRowCnt > 0;
    let indeterminate = (selectedRowCnt > 0 && this.flexEmployees.rows.length > selectedRowCnt);
    console.log(this.flexEmployees.topLeftCells.getCellElement(0, 0))
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
    let val = this.event.checked;
    let selectedRowCnt = this._getTotalSelectedRows(this.flexEmployees);
    let checked = selectedRowCnt > 0;
    let indeterminate = (selectedRowCnt > 0 && this.flexEmployees.rows.length > selectedRowCnt);
    console.log(this.flexEmployees.topLeftCells.getCellElement(0, 0))
    let cb = this.flexEmployees.topLeftCells.getCellElement(0, 0).querySelector("input") as HTMLInputElement;
    cb.checked = checked;
    cb.indeterminate = indeterminate;
  }

  moveToFirstPage() {
    this._listEmployeeCollectionView.moveToFirstPage();
    this.selectRow();
  }

  moveToPreviousPage() {
    this._listEmployeeCollectionView.moveToPreviousPage();
    this.selectRow();
  }

  moveToNextPage() {
    this._listEmployeeCollectionView.moveToNextPage();
    this.selectRow();
  }

  moveToLastPage() {
    this._listEmployeeCollectionView.moveToLastPage();
    this.selectRow();
  }

  public Close(): void {
    this._matDialogRef.close({ event: "Close" });
  }

  public CloseOnSave(state: string): void {
    this._matDialogRef.close({ event: state });
  }

  public Save(): void {
    this._dTRLines.EmployeeList = this.flexEmployees.selectedItems;
    this._dTRLines.DailyTimeRecordModel = this._dTRModel;
    console.log(this._dTRLines);
    console.log("Employee List: ", this._dTRLines.EmployeeList);
    console.log("DTR: ", this._dTRLines.EmployeeList);
    console.log("DTR: ", this._dTRLines);

    this.SaveDTRLine();
  }

  public async SaveDTRLine() {
    if (this._isDTRLineDataLoaded == true) {
      this._isDTRLineDataLoaded = false;
      this._addDTRLineSubscription = await (await this._dtrDetialService.ADDTRLine(this._dTRLines)).subscribe(
        (response: any) => {
          this._isDTRLineDataLoaded = true;
          this._snackBarTemplate.snackBarSuccess(this._snackBar, "Added Successfully");
          this.CloseOnSave("Add");
          if (this._addDTRLineSubscription != null) this._addDTRLineSubscription.unsubscribe();
        },
        error => {
          this._isDTRLineDataLoaded = true;
          this._snackBarTemplate.snackBarError(this._snackBar, error.error + " " + " Status Code: " + error.status);
          if (this._addDTRLineSubscription != null) this._addDTRLineSubscription.unsubscribe();
        }
      );
    }
  }
}
