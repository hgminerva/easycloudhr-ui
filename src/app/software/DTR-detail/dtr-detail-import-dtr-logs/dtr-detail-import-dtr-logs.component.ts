import { Component, OnInit, Inject, ViewChild } from '@angular/core';

import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackBarTemplate } from '../../shared/snack-bar-template';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DatePipe, DecimalPipe } from '@angular/common';
import * as XLSX from 'xlsx';
import { Subject } from 'rxjs';
import { CollectionView, ObservableArray } from '@grapecity/wijmo';
import * as wjcGrid from '@grapecity/wijmo.grid';

import { DtrDetailImportDtrLogsService } from './dtr-detail-import-dtr-logs.service';
import { DTRLogs } from './../dtr-line.model';
import { analyzeAndValidateNgModules } from '@angular/compiler';

@Component({
  selector: 'app-dtr-detail-import-dtr-logs',
  templateUrl: './dtr-detail-import-dtr-logs.component.html',
  styleUrls: ['./dtr-detail-import-dtr-logs.component.css']
})
export class DtrDetailImportDtrLogsComponent implements OnInit {

  constructor(
    public _dtrDetailImportDtrLogsService: DtrDetailImportDtrLogsService,
    private _snackBar: MatSnackBar,
    private _snackBarTemplate: SnackBarTemplate,
    public _matDialogRef: MatDialogRef<DtrDetailImportDtrLogsComponent>,
    @Inject(MAT_DIALOG_DATA) public _caseData: any,
    private _decimalPipe: DecimalPipe,
    private datePipe: DatePipe,
  ) { }

  // DTR Logs Data List
  private _newDTRLines: any;
  private _employeeList: any;
  private _yearDateList: any;
  private _shiftLineList: any;
  private _changeShiftList: any;

  // Upload DTR File Logs
  private _dtrLogsUploadedData: any;

  public file: File;
  public arrayBuffer: any;
  public fileList: any

  // Class properties
  public _listDTRLineObservableArray: ObservableArray = new ObservableArray();
  public _listDTRLineCollectionView: CollectionView = new CollectionView(this._listDTRLineObservableArray);
  public _listPageIndex: number = 15;

  public _isDTRLineProgressBarHidden = false;
  public _isDTRLineDataLoaded: boolean = false;

  @ViewChild('flexDTRLine') flexDTRLine: wjcGrid.FlexGrid;


  // DTR Log Post Properties
  public dtrEmployeeDetailSubscription: any;

  private postDTRLogsSubscription: any;
  private counter = 0;
  public isPostButtonHidden: boolean = true;

  // Row Number List Drop Down
  public _createCboShowNumberOfRows: ObservableArray = new ObservableArray();

  public CreateCboShowNumberOfRows(): void {
    for (var i = 0; i <= 4; i++) {
      var rows = 0;
      var rowsString = "";
      if (i == 0) {
        rows = 10;
        rowsString = "Show 10";
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

    this.GetDTREmployeeDetail();
  }

  public CboShowNumberOfRowsOnSelectedIndexChanged(): void {
    this._listDTRLineCollectionView.pageSize = this._listPageIndex;
    this._listDTRLineCollectionView.refresh();
    this._listDTRLineCollectionView.refresh();
  }

  onFileChange(evt: any) {
    this._isDTRLineProgressBarHidden = true;
    let dtrFileUpload: any;
    this.file = evt.target.files[0];
    let fileReader = new FileReader();
    fileReader.readAsArrayBuffer(this.file);

    fileReader.onload = (e) => {

      this.arrayBuffer = fileReader.result;
      var data = new Uint8Array(this.arrayBuffer);
      var arr = new Array();

      for (var i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i]);

      var bstr = arr.join("");
      var workbook = XLSX.read(bstr, { type: "binary" });
      var first_sheet_name = workbook.SheetNames[0];
      var worksheet = workbook.Sheets[first_sheet_name];
      var arraylist = XLSX.utils.sheet_to_json(worksheet, { raw: true });
      dtrFileUpload = arraylist;

      let employeesDTRLogs = new ObservableArray();
      // Format date logs to MM/dd/yyyy
      for (var i = 0; i < dtrFileUpload["length"]; i++) {
        employeesDTRLogs.push({
          BiometricId: dtrFileUpload[i].EmployeeName,
          Date: new Date(dtrFileUpload[i].Att_Time),
          Time: new Date(dtrFileUpload[i].Att_Time)
        });

      }

      this._dtrLogsUploadedData = employeesDTRLogs;

      this.CreateDtrLines();
    }

  }

  public CreateDtrLines() {
    try {

      this._listDTRLineObservableArray = new ObservableArray();
      this._listDTRLineCollectionView = new CollectionView(this._listDTRLineObservableArray);
      this._listDTRLineCollectionView.pageSize = 15;
      this._listDTRLineCollectionView.trackChanges = true;
      this._listDTRLineCollectionView.refresh();
      this.flexDTRLine.refresh();

      let employeeList = this._employeeList;
      let shiftLineList = this._shiftLineList;
      let changeShiftLineList = this._changeShiftList;

      let employeesDTRLineLogs = new ObservableArray();

      // Loop to Employees List
      for (var employeeIndex = 0; employeeIndex < employeeList["length"]; employeeIndex++) {

        // Filter Uploaded DTR Logs BiometricIdNumber
        let employeeDateLogs = this._dtrLogsUploadedData.filter(x => x.BiometricId == this._employeeList[employeeIndex].BiometricIdNumber);

        if (employeeDateLogs["length"] > 0) {

          // DTR Start Date and End Date
          let startDate = new Date(this._caseData.objDTRData.DateStart);
          let endDate = new Date(this._caseData.objDTRData.DateEnd);

          let shiftId = this._employeeList[employeeIndex].DefaultShiftId;

          for (var date = startDate; date <= endDate; date.setDate(date.getDate() + 1)) {

            let SIN1, SOUT1, SIN2, SOUT2;
            let DIN1, DOUT1, DIN2, DOUT2;

            let isRestDay = false;
            let dateLog = this.datePipe.transform(date, 'MM/dd/yyyy');
            let dateType = "REGULAR";

            // Date Type
            let yearDate = this._yearDateList.filter(x => x.YearId == this._caseData.objDTRData.YearId && x.YearDate == this.datePipe.transform(date, 'MM/dd/yyyy'));

            if (yearDate["length"] != 0) {
              dateType = yearDate[0].DateType;
            }

            // Change Shift
            let changeShift = changeShiftLineList.filter(x => x.CSId == this._caseData.objDTRData.CSId == this._employeeList[employeeIndex].Id && x.ShiftDate == this.datePipe.transform(date, 'MM/dd/yyyy'));

            if (changeShift["length"] != 0) {
              shiftId = changeShift[0].ShiftId;
            }

            // Employee Shift
            var days = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
            let numberofSwipes = 4;

            let shift = shiftLineList.filter(x => x.ShiftId == shiftId && x.ShiftDate == days[date.getDay()]);

            if (shift["length"] != 0) {

              if (shift[0].TimeOut1 === '' && shift[0].TimeIn2 === '') {
                numberofSwipes = 2
              }

              isRestDay = shift[0].IsRestDay;

              let dateString = this.datePipe.transform(date, 'MM/dd/yyyy');
              SIN1 = new Date(dateString + ' ' + shift[0].TimeIn1);
              SOUT1 = new Date(dateString + ' ' + shift[0].TimeOut1);
              SIN2 = new Date(dateString + ' ' + shift[0].TimeIn2);
              SOUT2 = new Date(dateString + ' ' + shift[0].TimeOut2);

            }

            let dayLogs = employeeDateLogs.filter(x => this.datePipe.transform(x.Date, 'MM/dd/yyyy') === this.datePipe.transform(date, 'MM/dd/yyyy'));
            // console.log(this.datePipe.transform(employeeDateLogs[0].Date, 'MM/dd/yyyy'), this.datePipe.transform(date, 'MM/dd/yyyy'));

            if (dayLogs["length"] > 0) {

              if (numberofSwipes == 2) {

                // 2 Swipes

                let timelog1 = this.convert24HrTo12Hr(dayLogs[0].Time);

                DIN1 = timelog1;
                DOUT1 = '';
                DIN2 = '';
                DOUT2 = '';

                if (dayLogs[0].Time >= SOUT2) {

                  DIN1 = '';

                  DOUT2 = timelog1;

                }

                for (var i = 1; i < dayLogs["length"]; i++) {
                  let timelog2 = this.convert24HrTo12Hr(dayLogs[1].Time);
                  DOUT2 = timelog2;
                }

              }
              else {

                // 4 Swipes

                let timelog1 = this.convert24HrTo12Hr(dayLogs[0].Time);

                DIN1 = timelog1;
                DOUT1 = '';
                DIN2 = '';
                DOUT2 = '';

                if (dayLogs[0].Time >= SOUT1) {

                  DIN1 = '';

                  DOUT1 = timelog1;

                }

                if (dayLogs[0].Time >= SIN2) {

                  DIN1 = '';

                  DIN2 = timelog1;

                }

                if (dayLogs[0].Time >= SOUT2) {

                  DIN1 = '';

                  DOUT2 = timelog1;

                }

                for (var i = 1; i < dayLogs["length"]; i++) {

                  let timelog = this.convert24HrTo12Hr(dayLogs[1].Time);

                  if (dayLogs[0].Time >= SOUT1) {

                    if (dayLogs[0].Time >= SIN2) {

                      if (dayLogs[0].Time >= SOUT2) {

                        if (dayLogs[0].Time >= SOUT2) {

                          DOUT2 = timelog;

                        }

                      } else {

                        DIN2 = timelog;

                      }

                    } else {

                      DOUT1 = timelog;

                    }

                  }

                }

              }

              employeesDTRLineLogs.push({
                DTRId: this._caseData.objDTRData.Id,
                EmployeeId: this._employeeList[employeeIndex].Id,
                Employee: this._employeeList[employeeIndex].FullName,
                DTRDate: dateLog,
                DateType: dateType,
                IsRestDay: isRestDay,
                ShiftId: shiftId,
                Branch: this._employeeList[employeeIndex].Branch,
                TimeIn1: DIN1,
                TimeOut1: DOUT1,
                TimeIn2: DIN2,
                TimeOut2: DOUT2,

                IsOnLeave: false,
                IsOnLeaveHalfDay: false,
                IsOnOfficialBusiness: false,
                IsOnOfficialBusinessHalfDay: false,
                IsAbsent: false,
                IsAbsentHalfDay: false,

                NumberOfHoursWorked: 0,
                OvertimeHours: 0,
                NightDifferentialHours: 0,
                LateHours: 0,
                UndertimeHours: 0,

                DailyPay: 0,
                PremiumPay: 0,
                HolidayPay: 0,
                OvertimePay: 0,
                NightDifferentialPay: 0,
                COLA: 0,
                AdditionalAllowance: 0,
                LateDeduction: 0,
                UndertimeDeduction: 0,
                AbsentDeduction: 0,
                DailyNetPay: 0,

                Remarks: "NA"
              });
            }
            else {
              employeesDTRLineLogs.push({
                DTRId: this._caseData.objDTRData.Id,
                EmployeeId: this._employeeList[employeeIndex].Id,
                Employee: this._employeeList[employeeIndex].FullName,
                DTRDate: dateLog,
                DateType: dateType,
                IsRestDay: isRestDay,
                ShiftId: shiftId,
                Branch: this._employeeList[employeeIndex].Branch,
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

                NumberOfHoursWorked: 0,
                OvertimeHours: 0,
                NightDifferentialHours: 0,
                LateHours: 0,
                UndertimeHours: 0,

                DailyPay: 0,
                PremiumPay: 0,
                HolidayPay: 0,
                OvertimePay: 0,
                NightDifferentialPay: 0,
                COLA: 0,
                AdditionalAllowance: 0,
                LateDeduction: 0,
                UndertimeDeduction: 0,
                AbsentDeduction: 0,
                DailyNetPay: 0,

                Remarks: "NA"
              });
            }

          }
        }
      }

      this._newDTRLines = employeesDTRLineLogs;
      this.isPostButtonHidden = this._newDTRLines["length"] == 0 ? true : false;
      this.ShowDTRLogs(employeesDTRLineLogs);

    }
    catch (e) {
      console.error(e);
    }

  }

  public async ShowDTRLogs(employeesDTRLineLogs: ObservableArray) {

    this._listDTRLineObservableArray = await employeesDTRLineLogs;
    this._listDTRLineCollectionView = await new CollectionView(this._listDTRLineObservableArray);
    this._listDTRLineCollectionView.pageSize = 10;
    this._listDTRLineCollectionView.trackChanges = true;
    this._listDTRLineCollectionView.refresh();
    this.flexDTRLine.refresh();
    this._isDTRLineProgressBarHidden = false;

  }

  private async GetDTREmployeeDetail() {

    this.dtrEmployeeDetailSubscription = (await this._dtrDetailImportDtrLogsService.DTRLineEmployeeDetail(this._caseData.objDTRData.Id, this._caseData.objDTRData.PayrollGroup)).subscribe(
      data => {
        let result = data;
        if (result !== null) {

          this._employeeList = result["EmployeeList"];
          this._yearDateList = result["YearDateList"];
          this._shiftLineList = result["ShiftLineList"];
          this._changeShiftList = result["ChangeShiftineList"];

        }
        if (this.dtrEmployeeDetailSubscription != null) this.dtrEmployeeDetailSubscription.unsubscribe();
      },
      error => {
        this._snackBarTemplate.snackBarError(this._snackBar, error.error + " " + " Status Code: " + error.status);
        if (this.dtrEmployeeDetailSubscription != null) this.dtrEmployeeDetailSubscription.unsubscribe();
      }
    );

  }

  private _deleteDTRLineSubscription: any;

  public async Post() {
    this.deleteDTRLinesOnPost();
  }

  private async deleteDTRLinesOnPost() {
    this._deleteDTRLineSubscription = await (await this._dtrDetailImportDtrLogsService.DeleteDTRLines(this._caseData.objDTRData.Id)).subscribe(
      response => {
        this.PostDTRLogs();
        if (this._deleteDTRLineSubscription != null) this._deleteDTRLineSubscription.unsubscribe();
      },
      error => {
        this._snackBarTemplate.snackBarError(this._snackBar, error.error + " " + error.status);
        if (this._deleteDTRLineSubscription != null) this._deleteDTRLineSubscription.unsubscribe();
      }
    );
  }

  public async PostDTRLogs() {

    this._isDTRLineProgressBarHidden = true;

    let employeeList = this._employeeList;

    let objDTRLogs: DTRLogs = {
      DailyTimeRecord: this._caseData.objDTRData,
      DailyTimeRecordLineList: [{}]
    };

    for (var employeeIndex = 0; employeeIndex < employeeList["length"]; employeeIndex++) {

      var employeeDtrLog = this._newDTRLines.filter(e => e.EmployeeId == employeeList[employeeIndex].Id);
      objDTRLogs.DailyTimeRecord = this._caseData.objDTRData;

      if (employeeDtrLog["length"] > 0) {

        this.counter += employeeDtrLog["length"];

        objDTRLogs.DailyTimeRecordLineList = employeeDtrLog;

        await this.PostEmployeeLogs(objDTRLogs, employeeDtrLog[0].Employee);
      }

    }
  }

  private async PostEmployeeLogs(DTRLogs: DTRLogs, employee: string) {

    this.postDTRLogsSubscription = (await this._dtrDetailImportDtrLogsService.PostDTRLogs(DTRLogs)).subscribe(
      data => {

        let result = data;

        if (this.counter === this._newDTRLines["length"]) {
          this._isDTRLineProgressBarHidden = false;
          this._matDialogRef.close({ event: 'Post' });
        }

        if (this.postDTRLogsSubscription != null) this.postDTRLogsSubscription.unsubscribe();
      },
      error => {
        this._snackBarTemplate.snackBarError(this._snackBar, error.error + " " + " Status Code: " + error.status);
        if (this.postDTRLogsSubscription != null) this.postDTRLogsSubscription.unsubscribe();
      }
    );

  }

  public Close(): void {
    this._matDialogRef.close({ event: 'Close' });
  }

  fillLeadingZeroes(number: number, length: number) {
    let result = number.toString();
    let pad = length - result.length;
    while (pad > 0) { result = '0' + result; pad--; }

    return result;
  }

  convert24HrTo12Hr(time: Date) {
    let hours = time.getHours();
    let minutes = time.getMinutes();

    let AMPM = hours < 12 ? 'AM' : 'PM';
    let newHours = hours % 12 || 12;

    return `${this.fillLeadingZeroes(newHours, 2)}:${this.fillLeadingZeroes(minutes, 2)} ${AMPM}`;
  }

  async ngOnInit() {
    this.CreateCboShowNumberOfRows();
  }

}
