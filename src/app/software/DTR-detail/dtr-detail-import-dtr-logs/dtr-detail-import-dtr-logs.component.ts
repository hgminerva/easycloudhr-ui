import { Component, OnInit, Inject } from '@angular/core';

import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackBarTemplate } from '../../shared/snack-bar-template';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DatePipe, DecimalPipe } from '@angular/common';
import * as XLSX from 'xlsx';
import { Subject } from 'rxjs';
import { CollectionView, ObservableArray } from '@grapecity/wijmo';

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

  fillLeadingZeroes(number: string, length: number) {
    let result = number;
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
    let dt1 = new Date("October 13, 2014 08:11:00");
    let dt2 = new Date("October 13, 2014 08:11:05");

    console.log("dt1: ", dt1);
    console.log("dt2: ", dt2);

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

        const [day, month, year, hr, min, sec, ampm] = dtrFileUpload[i].Att_Time.split(/\W+/).filter(x => x.length);
        let _dateLog = month + '/' + day + '/' + year;
        let _timeLog = hr + ':' + min + ':' + sec + ' ' + ampm;

        employeesDTRLogs.push({
          BiometricId: dtrFileUpload[i].Name,
          Date: _dateLog,
          Time: _dateLog + ' ' + _timeLog
        });

      }

      this._dtrLogsUploadedData = employeesDTRLogs;

      this.CreateDtrLines();
    }

  }

  public async CreateDtrLines() {
    try {

      let employeeList = this._employeeList;
      let employeesDTRLogs = new ObservableArray();

      let shiftLineList = this._shiftLineList;
      let changeShiftLineList = this._changeShiftList;
      console.log(" Logs: ", this._dtrLogsUploadedData);

      for (var employeeIndex = 0; employeeIndex < this._employeeList["length"]; employeeIndex++) {

        let employeesDTRLineLogs = new ObservableArray();
        console.log("BiometricId: ", this._employeeList[employeeIndex].BiometricIdNumber);

        let employeeDateLogs = this._dtrLogsUploadedData.filter(x => x.BiometricId == this._employeeList[employeeIndex].BiometricIdNumber);
        // let employeeDateLogs = this._dtrLogsUploadedData.filter(x => x.BiometricId === "0436");

        console.log("Fire");

        // DTR Start Date and End Date
        let startDate = new Date(this._caseData.objDTRData.DateStart);
        let endDate = new Date(this._caseData.objDTRData.DateEnd);

        let shiftId = this._employeeList[employeeIndex].DefaultShiftId;

        for (var date = startDate; date <= endDate; date.setDate(date.getDate() + 1)) {

          let dayLogs = employeeDateLogs.filter(x => x.Date === this.datePipe.transform(date, 'MM/dd/yyyy'));
          if (employeeDateLogs["length"] > 0) {
            console.log(date, " Logs: ", employeeDateLogs["length"]);
          }

          let timeIn1, timeOut1, timeIn2, timeOut2;
          let dateLog;
          let dateType = "REGULAR";


          // Date Type
          let yearDate = this._yearDateList.filter(x => x.YearId == this._caseData.objDTRData.YearId && x.YearDate == this.datePipe.transform(date, 'MM/dd/yyyy'));
          // console.log("yearDate: ", yearDate);
          if (yearDate != 0) {
            dateType = yearDate[0].DateType;
          }

          let changeShift = changeShiftLineList.filter(x => x.CSId == this._employeeList[employeeIndex].DefaultShiftId && x.EmployeeId == this._employeeList[employeeIndex].Id);
          // console.log("changeShift: ", changeShift);
          if (changeShift != 0) {
            shiftId = changeShift[0].ShiftId;
          }

          // Employee Shift
          let shift = shiftLineList.filter(x => x.ShiftId == shiftId && x.EmployeeId == this._employeeList[employeeIndex].Id && x.ShiftDate == date.getDay());
          if (shift != 0) {
            timeIn1 = shift[0].TimeIn1;
            timeOut1 = shift[0].TimeOut1;
            timeIn2 = shift[0].TimeIn2;
            timeOut2 = shift[0].TimeOut2;
          }


          if (dayLogs["length"] > 0) {

            dateLog = this.datePipe.transform(date, 'MM/dd/yyyy');

            if (dayLogs["length"] == 2) {
              timeIn1 = await dayLogs[0].Time;
              timeOut2 = await dayLogs[1].Time;
            }

            if (dayLogs["length"] == 3) {
              for (var i = 0; i < dayLogs["length"]; i++) {
                let nextIndex = ++i;
                if (nextIndex < dayLogs["length"]) {
                  let timeInterval = this.diff_minutes(dayLogs[i].Time, dayLogs[nextIndex].Time);
                  console.log("timeInterval ", timeInterval);
                }
              }
            }

            employeesDTRLineLogs.push({
              DTRId: this._caseData.objDTRData.Id,
              EmployeeId: this._employeeList[employeeIndex].Id,
              DTRDate: dateLog,
              DateType: dateType,
              IsRestDay: false,
              ShiftId: shiftId,
              Branch: this._employeeList[employeeIndex].Branch,
              TimeIn1: timeIn1,
              TimeOut1: timeOut1,
              TimeIn2: timeIn2,
              TimeOut2: timeOut2,

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
          console.log("Employee: ", this._employeeList);
          // console.log("Year: ", this._yearDateList);
          // console.log("Shift: ", this._shiftLineList);
          // console.log("Change Shift: ", this._changeShiftList);
        }
      }
    );
  }

  public Close(): void {
    // this.DefaultValues();
    this._matDialogRef.close({ event: 'Close' });
  }

}
