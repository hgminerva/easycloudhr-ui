import { Component, OnInit, Inject } from '@angular/core';
import { DTRLineModel } from '../dtr-line.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackBarTemplate } from '../../shared/snack-bar-template';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DtrDetialService } from './../dtr-detial.service';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-dtr-detial-dtr-line-detail-dialog',
  templateUrl: './dtr-detial-dtr-line-detail-dialog.component.html',
  styleUrls: ['./dtr-detial-dtr-line-detail-dialog.component.css']
})
export class DtrDetialDtrLineDetailDialogComponent implements OnInit {

  constructor(
    public _dtrDetialService: DtrDetialService,
    private _snackBar: MatSnackBar,
    private _snackBarTemplate: SnackBarTemplate,
    public _companyDetailDialogRef: MatDialogRef<DtrDetialDtrLineDetailDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public _caseData: any,
    private _decimalPipe: DecimalPipe

  ) { }



  async ngOnInit() {
    this._title = await this._caseData.objDialogTitle;
    this.EmployeeListData();

  }
  public _title = '';
  public _isComponentsShown: boolean = true;

  public _dTRLineModel: DTRLineModel = {
    Id: 0,
    DTRId: 0,
    EmployeeId: 0,
    Employee: '',
    DTRDate: new Date(),
    DateType: '',
    IsRestDay: false,
    ShiftId: 0,
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

  public _isDTRLineDataLoaded: boolean = true;

  private _addDTRLineSubscription: any;
  private _saveDTRLineSubscription: any;

  public _employeeDropdownSubscription: any;
  public _employeeListDropdown: any = [];

  public _dateTypeDropdownSubscription: any;
  public _dateTypeListDropdown: any = [];

  public _branchDropdownSubscription: any;
  public _branchListDropdown: any = [];

  public _shiftsDropdownSubscription: any;
  public _shiftsListDropdown: any = [];

  private async EmployeeListData() {
    this._isComponentsShown = true;
    this._employeeDropdownSubscription = await (await this._dtrDetialService.EmployeeList()).subscribe(
      response => {
        this._employeeListDropdown = response;
        this._dTRLineModel.EmployeeId = response[0].Id;
        this.DateTypeListData();
        if (this._employeeDropdownSubscription !== null) this._employeeDropdownSubscription.unsubscribe();
      },
      error => {
        this._snackBarTemplate.snackBarError(this._snackBar, error.error.Message + " " + error.status);
        if (this._employeeDropdownSubscription !== null) this._employeeDropdownSubscription.unsubscribe();
      }
    );
  }

  private async DateTypeListData() {
    this._dateTypeDropdownSubscription = await (await this._dtrDetialService.DateTypeList()).subscribe(
      response => {
        this._dateTypeListDropdown = response;
        this._dTRLineModel.DateType = response[0].Value;
        this.BranchListData();

        if (this._dateTypeDropdownSubscription !== null) this._dateTypeDropdownSubscription.unsubscribe();
      },
      error => {
        this._snackBarTemplate.snackBarError(this._snackBar, error.error.Message + " " + error.status);
        if (this._dateTypeDropdownSubscription !== null) this._dateTypeDropdownSubscription.unsubscribe();
      }
    );
  }

  private async BranchListData() {
    this._branchDropdownSubscription = await (await this._dtrDetialService.BranchList()).subscribe(
      response => {
        this._branchListDropdown = response;
        this._dTRLineModel.Branch = response[0].Value;
        this.ShiftListData();
        if (this._branchDropdownSubscription !== null) this._branchDropdownSubscription.unsubscribe();
      },
      error => {
        this._snackBarTemplate.snackBarError(this._snackBar, error.error.Message + " " + error.status);
        if (this._branchDropdownSubscription !== null) this._branchDropdownSubscription.unsubscribe();
      }
    );
  }

  private async ShiftListData() {
    this._shiftsDropdownSubscription = await (await this._dtrDetialService.ShiftsList()).subscribe(
      response => {
        this._shiftsListDropdown = response;
        this._dTRLineModel.ShiftId = response[0].Id;
        this.loadDTRLineDetail();
        if (this._shiftsDropdownSubscription !== null) this._shiftsDropdownSubscription.unsubscribe();
      },
      error => {
        this._snackBarTemplate.snackBarError(this._snackBar, error.error.Message + " " + error.status);
        if (this._shiftsDropdownSubscription !== null) this._shiftsDropdownSubscription.unsubscribe();
      }
    );
  }

  public async SaveDTRLine() {
    if (this._isDTRLineDataLoaded == true) {
      this._isDTRLineDataLoaded = false;
      this._addDTRLineSubscription = await (await this._dtrDetialService.ADDTRLine(this._dTRLineModel)).subscribe(
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

  public async UpdateDTRLine() {
    if (this._isDTRLineDataLoaded == true) {
      this._isDTRLineDataLoaded = false;
      this._saveDTRLineSubscription = (await this._dtrDetialService.UpdateTRLine(this._dTRLineModel.Id, this._dTRLineModel)).subscribe(
        (response: any) => {
          this._isDTRLineDataLoaded = true;
          this._snackBarTemplate.snackBarSuccess(this._snackBar, "Save Successfully");
          this.CloseOnSave("Update");
          if (this._saveDTRLineSubscription != null) this._saveDTRLineSubscription.unsubscribe();
        },
        error => {
          this._isDTRLineDataLoaded = true;
          this._snackBarTemplate.snackBarError(this._snackBar, error.error + " " + " Status Code: " + error.status);
          if (this._saveDTRLineSubscription != null) this._saveDTRLineSubscription.unsubscribe();
        }
      );
    }
  }

  public Close(): void {
    this._companyDetailDialogRef.close({ event: "Close" });
  }

  public CloseOnSave(state: string): void {
    this._companyDetailDialogRef.close({ event: state });

  }

  public Save(): void {
    if (this._title == "Add DTR Line") {
      this.SaveDTRLine();
    }

    if (this._title == "Edit DTR Line Detail") {
      this.UpdateDTRLine();
    }
  }

  convertTime2(time12h) {
    const [time, modifier] = time12h.split(' ');

    let [hours, minutes] = time.split(':');

    if (hours === '12') {
      hours = '00';
    }

    if (modifier === 'PM') {
      hours = parseInt(hours, 10) + 12;
    }

    return `${hours}:${minutes}`;
  }

  convertTime1(time12h) {
    const [time, modifier] = time12h.split(' ');

    let [hours, minutes] = time.split(':');

    if (hours === '12') {
      hours = '00';
    }

    if (modifier === 'PM') {
      hours = parseInt(hours, 10) + 12;
    }

    return `${hours}:${minutes}`;
  }

  restrictNumeric(e) {
    let input;
    if (e.key == '') {
      return 0.00;
    }
    if (e.metaKey || e.ctrlKey) {
      return true;
    }
    if (e.which === 32) {
      return false;
    }
    if (e.which === 0) {
      return true;
    }
    if (e.which < 33) {
      return true;
    }
    if (e.which < 33) {
      return true;
    }
    input = String.fromCharCode(e.which);
    return !!/^[0-9.,]+$/.test(input);
  }

  formatValueNumberOfHoursWorked() {
    if (this._dTRLineModel.NumberOfHoursWorked == '') {
      this._dTRLineModel.NumberOfHoursWorked = this._decimalPipe.transform(0, "1.2-2");
    } else {
      this._dTRLineModel.NumberOfHoursWorked = this._decimalPipe.transform(this._dTRLineModel.NumberOfHoursWorked, "1.2-2");
    }
  }

  formatValueOvertimeHours() {
    if (this._dTRLineModel.OvertimeHours == '') {
      this._dTRLineModel.OvertimeHours = this._decimalPipe.transform(0, "1.2-2");
    } else {
      this._dTRLineModel.OvertimeHours = this._decimalPipe.transform(this._dTRLineModel.OvertimeHours, "1.2-2");
    }
  }

  formatValueNightDifferentialHours() {
    if (this._dTRLineModel.NightDifferentialHours == '') {
      this._dTRLineModel.NightDifferentialHours = this._decimalPipe.transform(0, "1.2-2");
    } else {
      this._dTRLineModel.NightDifferentialHours = this._decimalPipe.transform(this._dTRLineModel.NightDifferentialHours, "1.2-2");
    }
  }

  formatValueLateHours() {
    if (this._dTRLineModel.LateHours == '') {
      this._dTRLineModel.LateHours = this._decimalPipe.transform(0, "1.2-2");
    } else {
      this._dTRLineModel.LateHours = this._decimalPipe.transform(this._dTRLineModel.LateHours, "1.2-2");
    }
  }

  formatValueUndertimeHours() {
    if (this._dTRLineModel.UndertimeHours == '') {
      this._dTRLineModel.UndertimeHours = this._decimalPipe.transform(0, "1.2-2");
    } else {
      this._dTRLineModel.UndertimeHours = this._decimalPipe.transform(this._dTRLineModel.UndertimeHours, "1.2-2");
    }
  }

  formatValueDailyPay() {
    if (this._dTRLineModel.DailyPay == '') {
      this._dTRLineModel.DailyPay = this._decimalPipe.transform(0, "1.2-2");
    } else {
      this._dTRLineModel.DailyPay = this._decimalPipe.transform(this._dTRLineModel.DailyPay, "1.2-2");
    }
  }

  formatValueRestdayPay() {
    if (this._dTRLineModel.RestdayPay == '') {
      this._dTRLineModel.RestdayPay = this._decimalPipe.transform(0, "1.2-2");
    } else {
      this._dTRLineModel.RestdayPay = this._decimalPipe.transform(this._dTRLineModel.RestdayPay, "1.2-2");
    }
  }

  formatValueHolidayPay() {
    if (this._dTRLineModel.HolidayPay == '') {
      this._dTRLineModel.HolidayPay = this._decimalPipe.transform(0, "1.2-2");
    } else {
      this._dTRLineModel.HolidayPay = this._decimalPipe.transform(this._dTRLineModel.HolidayPay, "1.2-2");
    }
  }

  formatValueOvertimePay() {
    if (this._dTRLineModel.OvertimePay == '') {
      this._dTRLineModel.OvertimePay = this._decimalPipe.transform(0, "1.2-2");
    } else {
      this._dTRLineModel.OvertimePay = this._decimalPipe.transform(this._dTRLineModel.OvertimePay, "1.2-2");
    }
  }

  formatValueNightDifferentialPay() {
    if (this._dTRLineModel.NightDifferentialPay == '') {
      this._dTRLineModel.NightDifferentialPay = this._decimalPipe.transform(0, "1.2-2");
    } else {
      this._dTRLineModel.NightDifferentialPay = this._decimalPipe.transform(this._dTRLineModel.NightDifferentialPay, "1.2-2");
    }
  }

  formatValueLateDeduction() {
    if (this._dTRLineModel.LateDeduction == '') {
      this._dTRLineModel.LateDeduction = this._decimalPipe.transform(0, "1.2-2");
    } else {
      this._dTRLineModel.LateDeduction = this._decimalPipe.transform(this._dTRLineModel.LateDeduction, "1.2-2");
    }
  }

  formatValueUndertimeDeduction() {
    if (this._dTRLineModel.UndertimeDeduction == '') {
      this._dTRLineModel.UndertimeDeduction = this._decimalPipe.transform(0, "1.2-2");
    } else {
      this._dTRLineModel.UndertimeDeduction = this._decimalPipe.transform(this._dTRLineModel.UndertimeDeduction, "1.2-2");
    }
  }

  formatValueAbsentDeduction() {
    if (this._dTRLineModel.AbsentDeduction == '') {
      this._dTRLineModel.AbsentDeduction = this._decimalPipe.transform(0, "1.2-2");
    } else {
      this._dTRLineModel.AbsentDeduction = this._decimalPipe.transform(this._dTRLineModel.AbsentDeduction, "1.2-2");
    }
  }

  formatValueDailyNetPay() {
    if (this._dTRLineModel.DailyNetPay == '') {
      this._dTRLineModel.DailyNetPay = this._decimalPipe.transform(0, "1.2-2");
    } else {
      this._dTRLineModel.DailyNetPay = this._decimalPipe.transform(this._dTRLineModel.DailyNetPay, "1.2-2");
    }
  }

  async loadDTRLineDetail() {
    if (this._title == "Edit DTR Line Detail") {
      this._dTRLineModel = await this._caseData.objDTRLine;
    }
    this._dTRLineModel.DTRId = await this._caseData.objDTRLine.DTRId;
    this._dTRLineModel.TimeIn1 = await this.convertTime1(this._caseData.objDTRLine.TimeIn1);
    this._dTRLineModel.TimeOut1 = await this.convertTime1(this._caseData.objDTRLine.TimeOut1);
    this._dTRLineModel.TimeIn2 = await this.convertTime2(this._caseData.objDTRLine.TimeIn2);
    this._dTRLineModel.TimeOut2 = await this.convertTime2(this._caseData.objDTRLine.TimeOut2);
    this._dTRLineModel.DTRDate = await new Date(this._caseData.objDTRLine.DTRDate);
    this._dTRLineModel.NumberOfHoursWorked = this._decimalPipe.transform(this._dTRLineModel.NumberOfHoursWorked, "1.2-2");
    this._dTRLineModel.OvertimeHours = this._decimalPipe.transform(this._dTRLineModel.NumberOfHoursWorked, "1.2-2");
    this._dTRLineModel.NightDifferentialHours = this._decimalPipe.transform(this._dTRLineModel.NumberOfHoursWorked, "1.2-2");
    this._dTRLineModel.LateHours = this._decimalPipe.transform(this._dTRLineModel.NumberOfHoursWorked, "1.2-2");
    this._dTRLineModel.UndertimeHours = this._decimalPipe.transform(this._dTRLineModel.NumberOfHoursWorked, "1.2-2");
    this._dTRLineModel.DailyPay = this._decimalPipe.transform(this._dTRLineModel.NumberOfHoursWorked, "1.2-2");
    this._dTRLineModel.RestdayPay = this._decimalPipe.transform(this._dTRLineModel.NumberOfHoursWorked, "1.2-2");
    this._dTRLineModel.HolidayPay = this._decimalPipe.transform(this._dTRLineModel.NumberOfHoursWorked, "1.2-2");
    this._dTRLineModel.OvertimePay = this._decimalPipe.transform(this._dTRLineModel.NumberOfHoursWorked, "1.2-2");
    this._dTRLineModel.NightDifferentialPay = this._decimalPipe.transform(this._dTRLineModel.NumberOfHoursWorked, "1.2-2");
    this._dTRLineModel.LateDeduction = this._decimalPipe.transform(this._dTRLineModel.NumberOfHoursWorked, "1.2-2");
    this._dTRLineModel.UndertimeDeduction = this._decimalPipe.transform(this._dTRLineModel.NumberOfHoursWorked, "1.2-2");
    this._dTRLineModel.AbsentDeduction = this._decimalPipe.transform(this._dTRLineModel.NumberOfHoursWorked, "1.2-2");
    this._dTRLineModel.DailyNetPay = this._decimalPipe.transform(this._dTRLineModel.NumberOfHoursWorked, "1.2-2");

    this._isComponentsShown = false;
  }

}
