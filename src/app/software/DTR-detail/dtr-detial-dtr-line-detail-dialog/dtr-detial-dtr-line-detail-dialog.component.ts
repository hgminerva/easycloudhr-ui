import { Component, OnInit, Inject } from '@angular/core';

import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackBarTemplate } from '../../shared/snack-bar-template';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DecimalPipe } from '@angular/common';

import { DtrDetialService } from './../dtr-detial.service';
import { DTRLineModel } from '../dtr-line.model';

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
    public _matDialogRef: MatDialogRef<DtrDetialDtrLineDetailDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public _caseData: any,
    private _decimalPipe: DecimalPipe

  ) { }

  async ngOnInit() {
    this._title = await this._caseData.objDialogTitle;
    console.log(this._caseData.objDTRLine);
    this.DateTypeListData();
  }

  public _title = '';
  public _isComponentsHidden: boolean = true;

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
    PremiumPay: '',
    HolidayPay: '',
    OvertimePay: '',
    NightDifferentialPay: '',
    COLA: '',
    AdditionalAllowance: '',
    LateDeduction: '',
    UndertimeDeduction: '',
    AbsentDeduction: '',
    DailyNetPay: '',
    Remarks: ''
  }

  public _isProgressBarHidden = false;

  public _yesOrNoChoices: any = [{ Value: false, Display: "NO" }, { Value: true, Display: "YES" }];

  public _isDTRLineDataLoaded: boolean = true;

  private _computeDTRLineSubscription: any;

  public _employeeDropdownSubscription: any;
  public _employeeListDropdown: any = [];

  public _dateTypeDropdownSubscription: any;
  public _dateTypeListDropdown: any = [];

  public _branchDropdownSubscription: any;
  public _branchListDropdown: any = [];

  public _shiftsDropdownSubscription: any;
  public _shiftsListDropdown: any = [];

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

  formatValuePremiumPay() {
    if (this._dTRLineModel.PremiumPay == '') {
      this._dTRLineModel.PremiumPay = this._decimalPipe.transform(0, "1.2-2");
    } else {
      this._dTRLineModel.PremiumPay = this._decimalPipe.transform(this._dTRLineModel.PremiumPay, "1.2-2");
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

  formatValueCOLA() {
    if (this._dTRLineModel.COLA == '') {
      this._dTRLineModel.COLA = this._decimalPipe.transform(0, "1.2-2");
    } else {
      this._dTRLineModel.COLA = this._decimalPipe.transform(this._dTRLineModel.COLA, "1.2-2");
    }
  }

  formatValueAdditionalAllowance() {
    if (this._dTRLineModel.AdditionalAllowance == '') {
      this._dTRLineModel.AdditionalAllowance = this._decimalPipe.transform(0, "1.2-2");
    } else {
      this._dTRLineModel.AdditionalAllowance = this._decimalPipe.transform(this._dTRLineModel.AdditionalAllowance, "1.2-2");
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

  public async loadDTRLineDetail() {
    console.log("Case Data", this._caseData.objDTRLine);
    this._dTRLineModel = await this._caseData.objDTRLine;
    this._dTRLineModel.DTRId = await this._caseData.objDTRLine.DTRId;
    this._dTRLineModel.TimeIn1 = await this.convertTime(this._caseData.objDTRLine.TimeIn1);
    this._dTRLineModel.TimeOut1 = await this.convertTime(this._caseData.objDTRLine.TimeOut1);
    this._dTRLineModel.TimeIn2 = await this.convertTime(this._caseData.objDTRLine.TimeIn2);
    this._dTRLineModel.TimeOut2 = await this.convertTime(this._caseData.objDTRLine.TimeOut2);
    this._dTRLineModel.DTRDate = this._caseData.objDTRLine.DTRDate;
    this._dTRLineModel.NumberOfHoursWorked = this._decimalPipe.transform(this._caseData.objDTRLine.NumberOfHoursWorked, "1.2-2");
    this._dTRLineModel.OvertimeHours = this._decimalPipe.transform(this._caseData.objDTRLine.OvertimeHours, "1.2-2");
    this._dTRLineModel.NightDifferentialHours = this._decimalPipe.transform(this._caseData.objDTRLine.NightDifferentialHours, "1.2-2");
    this._dTRLineModel.LateHours = this._decimalPipe.transform(this._caseData.objDTRLine.LateHours, "1.2-2");
    this._dTRLineModel.UndertimeHours = this._decimalPipe.transform(this._caseData.objDTRLine.UndertimeHours, "1.2-2");
    this._dTRLineModel.DailyPay = this._decimalPipe.transform(this._caseData.objDTRLine.DailyPay, "1.2-2");
    this._dTRLineModel.PremiumPay = this._decimalPipe.transform(this._caseData.objDTRLine.PremiumPay, "1.2-2");
    this._dTRLineModel.HolidayPay = this._decimalPipe.transform(this._caseData.objDTRLine.HolidayPay, "1.2-2");
    this._dTRLineModel.OvertimePay = this._decimalPipe.transform(this._dTRLineModel.OvertimePay, "1.2-2");
    this._dTRLineModel.NightDifferentialPay = this._decimalPipe.transform(this._caseData.objDTRLine.NightDifferentialPay, "1.2-2");
    this._dTRLineModel.COLA = this._decimalPipe.transform(this._caseData.objDTRLine.COLA, "1.2-2");
    this._dTRLineModel.AdditionalAllowance = this._decimalPipe.transform(this._caseData.objDTRLine.AdditionalAllowance, "1.2-2");
    this._dTRLineModel.LateDeduction = this._decimalPipe.transform(this._caseData.objDTRLine.LateDeduction, "1.2-2");
    this._dTRLineModel.UndertimeDeduction = this._decimalPipe.transform(this._caseData.objDTRLine.UndertimeDeduction, "1.2-2");
    this._dTRLineModel.AbsentDeduction = this._decimalPipe.transform(this._caseData.objDTRLine.AbsentDeduction, "1.2-2");
    this._dTRLineModel.DailyNetPay = this._decimalPipe.transform(this._caseData.objDTRLine.DailyNetPay, "1.2-2");
    this._isComponentsHidden = false;
  }

  public async ComputeDTRLine() {
    this._isProgressBarHidden = true;
    this._computeDTRLineSubscription = (await this._dtrDetialService.ComputeDTRLine(this._dTRLineModel.Id)).subscribe(
      (response: any) => {
        let result = response;
        if (result != null) {
          console.log("Compute Data", result);

          this._dTRLineModel = result;
          this._dTRLineModel.DTRId = result.DTRId;
          this._dTRLineModel.TimeIn1 = this.convertTime(result.TimeIn1);
          this._dTRLineModel.TimeOut1 = this.convertTime(result.TimeOut1);
          this._dTRLineModel.TimeIn2 = this.convertTime(result.TimeIn2);
          this._dTRLineModel.TimeOut2 = this.convertTime(result.TimeOut2);
          this._dTRLineModel.DTRDate = result.DTRDate;
          this._dTRLineModel.NumberOfHoursWorked = this._decimalPipe.transform(result.NumberOfHoursWorked, "1.2-2");
          this._dTRLineModel.OvertimeHours = this._decimalPipe.transform(result.OvertimeHours, "1.2-2");
          this._dTRLineModel.NightDifferentialHours = this._decimalPipe.transform(result.NightDifferentialHours, "1.2-2");
          this._dTRLineModel.LateHours = this._decimalPipe.transform(result.LateHours, "1.2-2");
          this._dTRLineModel.UndertimeHours = this._decimalPipe.transform(result.UndertimeHours, "1.2-2");
          this._dTRLineModel.DailyPay = this._decimalPipe.transform(result.DailyPay, "1.2-2");
          this._dTRLineModel.PremiumPay = this._decimalPipe.transform(result.PremiumPay, "1.2-2");
          this._dTRLineModel.HolidayPay = this._decimalPipe.transform(result.HolidayPay, "1.2-2");
          this._dTRLineModel.OvertimePay = this._decimalPipe.transform(result.OvertimePay, "1.2-2");
          this._dTRLineModel.NightDifferentialPay = this._decimalPipe.transform(result.NightDifferentialPay, "1.2-2");
          this._dTRLineModel.COLA = this._decimalPipe.transform(result.COLA, "1.2-2");
          this._dTRLineModel.AdditionalAllowance = this._decimalPipe.transform(result.AdditionalAllowance, "1.2-2");
          this._dTRLineModel.LateDeduction = this._decimalPipe.transform(result.LateDeduction, "1.2-2");
          this._dTRLineModel.UndertimeDeduction = this._decimalPipe.transform(result.UndertimeDeduction, "1.2-2");
          this._dTRLineModel.AbsentDeduction = this._decimalPipe.transform(result.AbsentDeduction, "1.2-2");
          this._dTRLineModel.DailyNetPay = this._decimalPipe.transform(result.DailyNetPay, "1.2-2");
        }
        this._isComponentsHidden = false;
        this._isProgressBarHidden = false;

        if (this._computeDTRLineSubscription !== null) this._computeDTRLineSubscription.unsubscribe();
      },
      error => {
        this._isComponentsHidden = false;
        this._snackBarTemplate.snackBarError(this._snackBar, error.error.Message + " " + error.status);
        if (this._computeDTRLineSubscription !== null) this._computeDTRLineSubscription.unsubscribe();
      }
    );
  }

  public Close(): void {
    this._matDialogRef.close({ event: "Close" });
  }

  public CloseOnSave(): void {
    this._matDialogRef.close({ event: "Save", data: this._dTRLineModel });
  }

  ngOnDestroy() {
  }
}
