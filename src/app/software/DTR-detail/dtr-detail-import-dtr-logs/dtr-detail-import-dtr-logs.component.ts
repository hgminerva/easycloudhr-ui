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

  private _newDTRLines: any;
  private _employeeList: any;
  private _yearDateList: any;
  private _changeShiftList: any;


  data: [][];
  dtrLines: any;

  file: File;
  arrayBuffer: any;
  fileList: any

  onFileChange(evt: any) {
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
      // console.log(XLSX.utils.sheet_to_json(worksheet, { raw: true }));
      var arraylist = XLSX.utils.sheet_to_json(worksheet, { raw: true });
      this.dtrLines = arraylist;
      console.log('Import logs: ', arraylist);
      this.fileList = [];
      this.CreateDtrLines();
    }
  }

  public async CreateDtrLines() {
    try {
      let employeesDTRLogs = new ObservableArray();
      let employeesDTRLineLogs = new ObservableArray();
      // 02/04/2018 9:44:00 AM
      let startDate = new Date(this._caseData.objDTRData.DateStart);
      let endDate = new Date(this._caseData.objDTRData.DateEnd);

      for (var i = 0; i < this.dtrLines["length"]; i++) {
        let words = this.dtrLines[i].Att_Time.split(/\W+/).filter(x => x.length);
        // let date = words[2] + '-' + words[1] + '-' + words[0];
        let date = '2020' + '-' + this.fillLeadingZeroes('9', 2) + '-' + words[0];
        let time = this.fillLeadingZeroes(words[3], 2) + ':' + this.fillLeadingZeroes(words[4], 2) + ':' + this.fillLeadingZeroes(words[5], 2) + ' ' + words[6];
        // console.log(date, time);

        employeesDTRLogs.push({
          BiometricId: this.dtrLines[i].Name,
          Date: date,
          Time: date + ' ' + time
        });
      }

      for (var date = startDate; date <= endDate; date.setDate(date.getDate() + 1)) {
        // console.log(this.datePipe.transform(date, 'yyyy-MM-dd'));

        let currentEmployeeLogs = employeesDTRLogs.filter(x => x.BiometricId === '0436');
        // console.log("currentEmployeeLogs : ", currentEmployeeLogs);
        // console.log("Date : ", this.datePipe.transform(date, 'yyyy-MM-dd'));

        let dayLogs = currentEmployeeLogs.filter(x => x.Date === this.datePipe.transform(date, 'yyyy-MM-dd'));
        // console.log("Day log: ", dayLogs);

        if (dayLogs["length"] == 2) {
          employeesDTRLineLogs.push({
            DTRId: this._caseData.objDTRData.Id,
            EmployeeId: this._employeeList[i].Id,
            DTRDate: "date",
            DateType: "",
            IsRestDay: false,
            ShiftId: 0,
            Branch: this._employeeList[i].Branch,
            TimeIn1: dayLogs[0].Time,
            TimeOut1: '',
            TimeIn2: '',
            TimeOut2: dayLogs[1].Time,

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

        if (dayLogs["length"] == 3) {
          let time1, time2, time3;
          // let minuteInterval = this.diff_minutes(dayLogs[0].Time, dayLogs[1].Time);
          console.log("minuteInterval", dayLogs);

          // employeesDTRLineLogs.push({
          //   DTRId: this._caseData.objDTRData.Id,
          //   EmployeeId: this._employeeList[i].Id,
          //   DTRDate: "date",
          //   DateType: "",
          //   IsRestDay: false,
          //   ShiftId: 0,
          //   Branch: this._employeeList[i].Branch,
          //   TimeIn1: dayLogs[0].Time,
          //   TimeOut1: '',
          //   TimeIn2: '',
          //   TimeOut2: dayLogs[1].Time,

          //   IsOnLeave: false,
          //   IsOnLeaveHalfDay: false,
          //   IsOnOfficialBusiness: false,
          //   IsOnOfficialBusinessHalfDay: false,
          //   IsAbsent: false,
          //   IsAbsentHalfDay: false,

          //   NumberOfHoursWorked: 0,
          //   OvertimeHours: 0,
          //   NightDifferentialHours: 0,
          //   LateHours: 0,
          //   UndertimeHours: 0,

          //   DailyPay: 0,
          //   PremiumPay: 0,
          //   HolidayPay: 0,
          //   OvertimePay: 0,
          //   NightDifferentialPay: 0,
          //   COLA: 0,
          //   AdditionalAllowance: 0,
          //   LateDeduction: 0,
          //   UndertimeDeduction: 0,
          //   AbsentDeduction: 0,
          //   DailyNetPay: 0,

          //   Remarks: "NA"
          // });
        }

        console.log("Initial Logs: ", employeesDTRLineLogs);
      }


      console.log(employeesDTRLogs);

    }
    catch (e) {
      console.error(e);
    }
  }

  diff_minutes(dt2, dt1) {
    let time1 = new Date(dt1);
    let time2 = new Date(dt2);
    var diff = (time2.getTime() - time1.getTime()) / 1000;
    diff /= 60;
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


  public dtrEmployeeDetailSubscription: any;


  private async GetDTREmployeeDetail() {
    this.dtrEmployeeDetailSubscription = (await this._dtrDetailImportDtrLogsService.DTRLineEmployeeDetail(this._caseData.objDTRData.Id, this._caseData.objDTRData.PayrollGroup)).subscribe(
      data => {
        let result = data;
        if (result !== null) {
          this._employeeList = result["EmployeeList"];
          this._yearDateList = result["YearDateList"];
          this._changeShiftList = result["ChangeShiftList"];
        }
      }
    );
  }

  async ngOnInit() {
    this.GetDTREmployeeDetail();
  }

}
