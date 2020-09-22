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


  diff_minutes(dt2, dt1) {
    let time1 = new Date(dt1);
    let time2 = new Date(dt2);
    var diff = (time2.getTime() - time1.getTime()) / (1000 * 60);
    // diff /= 60;
    console.log("diff: ", diff);

    return Math.abs(Math.round(diff));
  }

  fillLeadingZeroes(number: number, length: number) {
    let result = number.toString();
    let pad = length - result.length;
    while (pad > 0) { result = '0' + result; pad--; }

    return result;
  }

  convertTime(time12h) {

    if (time12h == '') {
      return '';
    }

    const [time, modifier] = time12h.split(' ');

    let [hours, minutes] = time.split(':');

    if (hours === '12') {
      hours = '00';
    }

    if (modifier === 'PM') {
      hours = parseInt(hours, 10) + 12;
    }

    let hrs = this.fillLeadingZeroes(hours, 2);
    let mins = this.fillLeadingZeroes(minutes, 2);

    return `${hrs}:${mins}`;
  }

  async ngOnInit() {
    let dt1 = new Date("9/5/2020 5:10:00 PM");
    let dt2 = new Date("9/5/2020 5:00: PM");

    console.log(dt1 < dt2);
    console.log("dt2: ", dt2.getHours(), dt2.getMinutes(), this.fillLeadingZeroes(dt2.getSeconds(), 2));

    console.log("Test: ", this.diff_minutes(dt1, dt2));
    this.GetDTREmployeeDetail();
  }

  private _newDTRLines: any;
  private _employeeList: any;
  private _yearDateList: any;
  private _shiftLineList: any;
  private _changeShiftList: any;

  data: [][];
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

  // Upload DTR File Logs

  onFileChange(evt: any) {

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

        // const [day, month, year, hr, min, sec, ampm] = dtrFileUpload[i].Att_Time.split(/\W+/).filter(x => x.length);
        // let _dateLog = month + '/' + day + '/' + year;
        // let _timeLog = hr + ':' + min + ':' + sec + ' ' + ampm;

        // employeesDTRLogs.push({
        //   BiometricId: dtrFileUpload[i].EmployeeName,
        //   Date: _dateLog,
        //   Time: new Date(_dateLog + ' ' + _timeLog)
        // });

        const [day, month, year, hr, min, sec, ampm] = dtrFileUpload[i].Att_Time.split(/\W+/).filter(x => x.length);
        let _dateLog = month + '/' + day + '/' + year;
        let _timeLog = hr + ':' + min + ':' + sec + ' ' + ampm;

        employeesDTRLogs.push({
          BiometricId: dtrFileUpload[i].EmployeeName,
          Date: dtrFileUpload[i].Att_Time,
          Time: new Date(dtrFileUpload[i].Att_Time)
        });

      }

      this._dtrLogsUploadedData = employeesDTRLogs;

      this.CreateDtrLines();
    }

  }

  public async CreateDtrLines() {
    try {

      this._listDTRLineObservableArray = new ObservableArray();
      this._listDTRLineCollectionView = new CollectionView(this._listDTRLineObservableArray);
      this._listDTRLineCollectionView.pageSize = 15;
      this._listDTRLineCollectionView.trackChanges = true;
      await this._listDTRLineCollectionView.refresh();
      await this.flexDTRLine.refresh();

      let employeeList = this._employeeList;
      let employeesDTRLogs = new ObservableArray();

      let shiftLineList = this._shiftLineList;
      let changeShiftLineList = this._changeShiftList;
      // console.log(" Logs: ", this._dtrLogsUploadedData);

      let employeesDTRLineLogs = new ObservableArray();

      for (var employeeIndex = 0; employeeIndex < employeeList["length"]; employeeIndex++) {

        // console.log("BiometricId: ", this._employeeList[employeeIndex].BiometricIdNumber);

        let employeeDateLogs = this._dtrLogsUploadedData.filter(x => x.BiometricId == this._employeeList[employeeIndex].BiometricIdNumber);
        // let employeeDateLogs = this._dtrLogsUploadedData.filter(x => x.BiometricId === "0436");

        // console.log("Fire");

        // DTR Start Date and End Date
        let startDate = new Date(this._caseData.objDTRData.DateStart);
        let endDate = new Date(this._caseData.objDTRData.DateEnd);

        let shiftId = this._employeeList[employeeIndex].DefaultShiftId;

        for (var date = startDate; date <= endDate; date.setDate(date.getDate() + 1)) {

          let SIN1, SOUT1, SIN2, SOUT2;
          let DIN1, DOUT1, DIN2, DOUT2;

          let dateLog;
          let dateType = "REGULAR";

          // Date Type
          let yearDate = this._yearDateList.filter(x => x.YearId == this._caseData.objDTRData.YearId && x.YearDate == this.datePipe.transform(date, 'MM/dd/yyyy'));
          // console.log("yearDate: ", yearDate);

          if (yearDate["length"] != 0) {
            dateType = yearDate[0].DateType;
          }

          // Change Shift
          let changeShift = changeShiftLineList.filter(x => x.CSId == this._caseData.objDTRData.CSId == this._employeeList[employeeIndex].Id && x.ShiftDate == this.datePipe.transform(date, 'MM/dd/yyyy'));
          // console.log("changeShift: ", changeShift);

          if (changeShift["length"] != 0) {
            shiftId = changeShift[0].ShiftId;
          }

          // Employee Shift
          var days = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
          let numberofSwipes = 4;

          let shift = shiftLineList.filter(x => x.ShiftId == shiftId && x.ShiftDate == days[date.getDay()]);
          // console.log("shift: ", shift);

          if (shift["length"] != 0) {

            if (shift[0].TimeOut1 === '' && shift[0].TimeIn2 === '') {
              numberofSwipes = 2
            }

            SIN1 = new Date(date + ' ' + shift[0].TimeIn1);
            SOUT1 = new Date(date + ' ' + shift[0].TimeOut1);
            SIN2 = new Date(date + ' ' + shift[0].TimeIn2);
            SOUT2 = new Date(date + ' ' + shift[0].TimeOut2);
          }

          let dayLogs = employeeDateLogs.filter(x => this.datePipe.transform(x.Date, 'MM/dd/yyyy') === this.datePipe.transform(date, 'MM/dd/yyyy'));

          // console.log(" numberofSwipes ", numberofSwipes);
          // console.log(" length ", dayLogs["length"]);

          if (dayLogs["length"] > 0) {

            dateLog = this.datePipe.transform(date, 'MM/dd/yyyy');

            if (numberofSwipes == 2) {

              DIN1 = dayLogs[0].Time;
              DOUT1 = '';
              DIN2 = '';
              DOUT2 = '';

              if (dayLogs[0].Time >= SOUT2) {

                DIN1 = '';

                DOUT2 = dayLogs[0].Time;

              }
              else {

                DIN1 = dayLogs[0].Time;

              }

              for (var i = 1; i < dayLogs["length"]; i++) {

                DOUT2 = dayLogs[i].Time;

              }

              // console.log(" numberofSwipes ", numberofSwipes);

            }
            else {

              // console.log(" numberofSwipes ", numberofSwipes);

            }

            // console.log(date, " Logs ", dateLog);

            employeesDTRLineLogs.push({
              DTRId: this._caseData.objDTRData.Id,
              EmployeeId: this._employeeList[employeeIndex].Id,
              DTRDate: dateLog,
              DateType: dateType,
              IsRestDay: false,
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

        }

      }

      this._listDTRLineObservableArray = employeesDTRLineLogs;
      this._listDTRLineCollectionView = new CollectionView(this._listDTRLineObservableArray);
      this._listDTRLineCollectionView.pageSize = 15;
      this._listDTRLineCollectionView.trackChanges = true;
      this._listDTRLineCollectionView.refresh();
      this.flexDTRLine.refresh();

      console.log(date, " Logs: ", employeesDTRLineLogs);

    }
    catch (e) {
      console.error(e);
    }
  }

  public dtrEmployeeDetailSubscription: any;

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
      }
    );
  }

  public Close(): void {
    this._matDialogRef.close({ event: 'Close' });
  }

}
