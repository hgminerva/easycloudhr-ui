import { Component, OnInit, Inject } from '@angular/core';

import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackBarTemplate } from '../../shared/snack-bar-template';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { DecimalPipe } from '@angular/common';
import { PayrollLineModel } from '../payroll-line.model';
import { PayrollDetailService } from '../payroll-detail.service';
import { EmployeeListPickDialogComponent } from '../../shared/employee-list-pick-dialog/employee-list-pick-dialog.component';

@Component({
  selector: 'app-payroll-line-detail-dialog',
  templateUrl: './payroll-line-detail-dialog.component.html',
  styleUrls: ['./payroll-line-detail-dialog.component.css']
})
export class PayrollLineDetailDialogComponent implements OnInit {

  constructor(
    public _payrollDetailService: PayrollDetailService,
    private _snackBar: MatSnackBar,
    private _snackBarTemplate: SnackBarTemplate,
    public _matDialogRef: MatDialogRef<PayrollLineDetailDialogComponent>,
    public _matDialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public _caseData: any,
    private _decimalPipe: DecimalPipe,
  ) { }

  async ngOnInit() {
    this._title = await this._caseData.objDialogTitle;
    this.loadPayrollLineDetail();
  }

  public _title = '';
  public _event = 'Close';
  public _isComponentsHidden: boolean = true;
  public _isDataLoaded: boolean = true;

  public _payrollLineModel: PayrollLineModel = {
    Id: 0,
    PAYId: 0,
    EmployeeId: 0,
    Employee: '',
    PayrollRate: '0',
    TotalDailyPay: '0',
    TotalPremiumPay: '0',
    TotalHolidayPay: '0',
    TotalOvertimePay: '0',
    TotalNightDifferentialPay: '0',
    TotalCOLA: '0',
    TotalAdditionalAllowance: '0',
    TotalLateDeduction: '0',
    TotalUndertimeDeduction: '0',
    Income: '0',
    TotalOtherIncomeNotTaxable: '0',
    TotalOtherIncomeTaxable: '0',
    GrossIncome: '0',
    SSSContribution: '0',
    PHICContribution: '0',
    HDMFContribution: '0',
    IncomeTaxAmount: '0',
    TotalOtherDeduction: '0',
    NetIncome: '0',
    SSSEmployerContribution: '0',
    SSSEC: '0',
    PHICEmployerContribution: '0',
    HDMFEmployerContribution: '0'
  }

  public _isProgressBarHidden = false;

  public _yesOrNoChoices: any = [{ Value: false, Display: "NO" }, { Value: true, Display: "YES" }];

  public _isPayrollLineDataLoaded: boolean = true;

  private _computePayrollLineSubscription: any;

  public _employeeDropdownSubscription: any;
  public _employeeListDropdown: any = [];

  public _dateTypeDropdownSubscription: any;
  public _dateTypeListDropdown: any = [];

  public _branchDropdownSubscription: any;
  public _branchListDropdown: any = [];

  public _shiftsDropdownSubscription: any;
  public _shiftsListDropdown: any = [];

  private _savePayrollLineSubscription: any;
  private _payrollLineDetailSubscription: any;

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

  public async loadPayrollLineDetail() {
    this._payrollLineModel.Id = this._caseData.objPayrollLine.Id;
    this._payrollLineModel.PAYId = this._caseData.objPayrollLine.PAYId;
    this._payrollLineModel.EmployeeId = this._caseData.objPayrollLine.EmployeeId;
    this._payrollLineModel.Employee = this._caseData.objPayrollLine.Employee;
    this._payrollLineModel.PayrollRate = this._decimalPipe.transform(this._caseData.objPayrollLine.PayrollRate, "1.2-2");
    this._payrollLineModel.TotalDailyPay = this._decimalPipe.transform(this._caseData.objPayrollLine.TotalDailyPay, "1.2-2");
    this._payrollLineModel.TotalPremiumPay = this._decimalPipe.transform(this._caseData.objPayrollLine.TotalPremiumPay, "1.2-2");
    this._payrollLineModel.TotalHolidayPay = this._decimalPipe.transform(this._caseData.objPayrollLine.TotalHolidayPay, "1.2-2");
    this._payrollLineModel.TotalOvertimePay = this._decimalPipe.transform(this._caseData.objPayrollLine.TotalOvertimePay, "1.2-2");
    this._payrollLineModel.TotalNightDifferentialPay = this._decimalPipe.transform(this._caseData.objPayrollLine.TotalNightDifferentialPay, "1.2-2");
    this._payrollLineModel.TotalCOLA = this._decimalPipe.transform(this._caseData.objPayrollLine.TotalCOLA, "1.2-2");
    this._payrollLineModel.TotalAdditionalAllowance = this._decimalPipe.transform(this._caseData.objPayrollLine.TotalAdditionalAllowance, "1.2-2");
    this._payrollLineModel.TotalLateDeduction = this._decimalPipe.transform(this._payrollLineModel.TotalLateDeduction, "1.2-2");
    this._payrollLineModel.TotalUndertimeDeduction = this._decimalPipe.transform(this._caseData.objPayrollLine.TotalUndertimeDeduction, "1.2-2");
    this._payrollLineModel.Income = this._decimalPipe.transform(this._caseData.objPayrollLine.Income, "1.2-2");
    this._payrollLineModel.TotalOtherIncomeNotTaxable = this._decimalPipe.transform(this._caseData.objPayrollLine.TotalOtherIncomeNotTaxable, "1.2-2");
    this._payrollLineModel.TotalOtherIncomeTaxable = this._decimalPipe.transform(this._caseData.objPayrollLine.TotalOtherIncomeTaxable, "1.2-2");
    this._payrollLineModel.GrossIncome = this._decimalPipe.transform(this._caseData.objPayrollLine.GrossIncome, "1.2-2");
    this._payrollLineModel.SSSContribution = this._decimalPipe.transform(this._caseData.objPayrollLine.SSSContribution, "1.2-2");
    this._payrollLineModel.PHICContribution = this._decimalPipe.transform(this._caseData.objPayrollLine.PHICContribution, "1.2-2");
    this._payrollLineModel.HDMFContribution = this._decimalPipe.transform(this._caseData.objPayrollLine.HDMFContribution, "1.2-2");
    this._payrollLineModel.IncomeTaxAmount = this._decimalPipe.transform(this._caseData.objPayrollLine.IncomeTaxAmount, "1.2-2");
    this._payrollLineModel.TotalOtherDeduction = this._decimalPipe.transform(this._caseData.objPayrollLine.TotalOtherDeduction, "1.2-2");
    this._payrollLineModel.NetIncome = this._decimalPipe.transform(this._caseData.objPayrollLine.NetIncome, "1.2-2");
    this._payrollLineModel.SSSEmployerContribution = this._decimalPipe.transform(this._caseData.objPayrollLine.SSSEmployerContribution, "1.2-2");
    this._payrollLineModel.SSSEC = this._decimalPipe.transform(this._caseData.objPayrollLine.SSSEC, "1.2-2");
    this._payrollLineModel.PHICEmployerContribution = this._decimalPipe.transform(this._caseData.objPayrollLine.PHICEmployerContribution, "1.2-2");
    this._payrollLineModel.HDMFEmployerContribution = this._decimalPipe.transform(this._caseData.objPayrollLine.HDMFEmployerContribution, "1.2-2");
    this._isComponentsHidden = false;
  }

  public EmployeeListDialog() {
    const matDialogRef = this._matDialog.open(EmployeeListPickDialogComponent, {
      width: '900px',
      height: '500',
      data: {
        objDialogTitle: "Employee List",
        objPayrollGroup: this._caseData.objPayrollGroup
      },
      disableClose: true
    });

    matDialogRef.afterClosed().subscribe((data: any) => {
      if (data.event === "Pick") {
        this._payrollLineModel.EmployeeId = data.employee.Id;
        this._payrollLineModel.Employee = data.employee.Value;
      }
    });
  }

  public async ComputePayrollLine() {
    this._event = 'Compute';
    this._isProgressBarHidden = true;
    console.log(this._payrollLineModel.Id);
    this._computePayrollLineSubscription = (await this._payrollDetailService.ComputePayrollLine(this._payrollLineModel.Id)).subscribe(
      (response: any) => {
        let result = response;
        console.log(result);
        this._payrollLineModel.EmployeeId = result.EmployeeId;
        this._payrollLineModel.Employee = result.Employee;
        this._payrollLineModel.PayrollRate = this._decimalPipe.transform(result.PayrollRate, "1.2-2");
        this._payrollLineModel.TotalDailyPay = this._decimalPipe.transform(result.TotalDailyPay, "1.2-2");
        this._payrollLineModel.TotalPremiumPay = this._decimalPipe.transform(result.TotalPremiumPay, "1.2-2");
        this._payrollLineModel.TotalHolidayPay = this._decimalPipe.transform(result.TotalHolidayPay, "1.2-2");
        this._payrollLineModel.TotalOvertimePay = this._decimalPipe.transform(result.TotalOvertimePay, "1.2-2");
        this._payrollLineModel.TotalNightDifferentialPay = this._decimalPipe.transform(result.TotalNightDifferentialPay, "1.2-2");
        this._payrollLineModel.TotalCOLA = this._decimalPipe.transform(result.TotalCOLA, "1.2-2");
        this._payrollLineModel.TotalAdditionalAllowance = this._decimalPipe.transform(result.TotalAdditionalAllowance, "1.2-2");
        this._payrollLineModel.TotalLateDeduction = this._decimalPipe.transform(result.TotalLateDeduction, "1.2-2");
        this._payrollLineModel.TotalUndertimeDeduction = this._decimalPipe.transform(result.TotalUndertimeDeduction, "1.2-2");
        this._payrollLineModel.Income = this._decimalPipe.transform(result.Income, "1.2-2");
        this._payrollLineModel.TotalOtherIncomeNotTaxable = this._decimalPipe.transform(result.TotalOtherIncomeNotTaxable, "1.2-2");
        this._payrollLineModel.TotalOtherIncomeTaxable = this._decimalPipe.transform(result.TotalOtherIncomeTaxable, "1.2-2");
        this._payrollLineModel.GrossIncome = this._decimalPipe.transform(result.GrossIncome, "1.2-2");
        this._payrollLineModel.SSSContribution = this._decimalPipe.transform(result.SSSContribution, "1.2-2");
        this._payrollLineModel.PHICContribution = this._decimalPipe.transform(result.PHICContribution, "1.2-2");
        this._payrollLineModel.HDMFContribution = this._decimalPipe.transform(result.HDMFContribution, "1.2-2");
        this._payrollLineModel.IncomeTaxAmount = this._decimalPipe.transform(result.IncomeTaxAmount, "1.2-2");
        this._payrollLineModel.TotalOtherDeduction = this._decimalPipe.transform(result.TotalOtherDeduction, "1.2-2");
        this._payrollLineModel.NetIncome = this._decimalPipe.transform(result.NetIncome, "1.2-2");
        this._payrollLineModel.SSSEmployerContribution = this._decimalPipe.transform(result.SSSEmployerContribution, "1.2-2");
        this._payrollLineModel.SSSEC = this._decimalPipe.transform(result.SSSEC, "1.2-2");
        this._payrollLineModel.PHICEmployerContribution = this._decimalPipe.transform(result.PHICEmployerContribution, "1.2-2");
        this._payrollLineModel.HDMFEmployerContribution = this._decimalPipe.transform(result.HDMFEmployerContribution, "1.2-2");
        this._isProgressBarHidden = false;

        this._snackBarTemplate.snackBarSuccess(this._snackBar, "Compute Successfully!");
        if (this._computePayrollLineSubscription !== null) this._computePayrollLineSubscription.unsubscribe();
      },
      error => {
        this._snackBarTemplate.snackBarError(this._snackBar, error.error.Message + " " + error.status);
        if (this._computePayrollLineSubscription !== null) this._computePayrollLineSubscription.unsubscribe();
      }
    );
  }

  private async GetPayrollDetailDetail(id) {
    this._payrollLineDetailSubscription = await (await this._payrollDetailService.PayrollLineDetail(id)).subscribe(
      (response: any) => {
        let result = response;
        if (result != null) {
          this._payrollLineModel = result;

          this._payrollLineModel.EmployeeId = result.EmployeeId;
          this._payrollLineModel.Employee = result.Employee;
          this._payrollLineModel.PayrollRate = this._decimalPipe.transform(result.PayrollRate, "1.2-2");
          this._payrollLineModel.TotalDailyPay = this._decimalPipe.transform(result.TotalDailyPay, "1.2-2");
          this._payrollLineModel.TotalPremiumPay = this._decimalPipe.transform(result.TotalPremiumPay, "1.2-2");
          this._payrollLineModel.TotalHolidayPay = this._decimalPipe.transform(result.TotalHolidayPay, "1.2-2");
          this._payrollLineModel.TotalOvertimePay = this._decimalPipe.transform(result.TotalOvertimePay, "1.2-2");
          this._payrollLineModel.TotalNightDifferentialPay = this._decimalPipe.transform(result.TotalNightDifferentialPay, "1.2-2");
          this._payrollLineModel.TotalCOLA = this._decimalPipe.transform(result.TotalCOLA, "1.2-2");
          this._payrollLineModel.TotalAdditionalAllowance = this._decimalPipe.transform(result.TotalAdditionalAllowance, "1.2-2");
          this._payrollLineModel.TotalLateDeduction = this._decimalPipe.transform(result.TotalLateDeduction, "1.2-2");
          this._payrollLineModel.TotalUndertimeDeduction = this._decimalPipe.transform(result.TotalUndertimeDeduction, "1.2-2");
          this._payrollLineModel.Income = this._decimalPipe.transform(result.Income, "1.2-2");
          this._payrollLineModel.TotalOtherIncomeNotTaxable = this._decimalPipe.transform(result.TotalOtherIncomeNotTaxable, "1.2-2");
          this._payrollLineModel.TotalOtherIncomeTaxable = this._decimalPipe.transform(result.TotalOtherIncomeTaxable, "1.2-2");
          this._payrollLineModel.GrossIncome = this._decimalPipe.transform(result.GrossIncome, "1.2-2");
          this._payrollLineModel.SSSContribution = this._decimalPipe.transform(result.SSSContribution, "1.2-2");
          this._payrollLineModel.PHICContribution = this._decimalPipe.transform(result.PHICContribution, "1.2-2");
          this._payrollLineModel.HDMFContribution = this._decimalPipe.transform(result.HDMFContribution, "1.2-2");
          this._payrollLineModel.IncomeTaxAmount = this._decimalPipe.transform(result.IncomeTaxAmount, "1.2-2");
          this._payrollLineModel.TotalOtherDeduction = this._decimalPipe.transform(result.TotalOtherDeduction, "1.2-2");
          this._payrollLineModel.NetIncome = this._decimalPipe.transform(result.NetIncome, "1.2-2");
          this._payrollLineModel.SSSEmployerContribution = this._decimalPipe.transform(result.SSSEmployerContribution, "1.2-2");
          this._payrollLineModel.SSSEC = this._decimalPipe.transform(result.SSSEC, "1.2-2");
          this._payrollLineModel.PHICEmployerContribution = this._decimalPipe.transform(result.PHICEmployerContribution, "1.2-2");
          this._payrollLineModel.HDMFEmployerContribution = this._decimalPipe.transform(result.HDMFEmployerContribution, "1.2-2");
        }

        this._isComponentsHidden = false;
        this._isProgressBarHidden = false;

        if (this._payrollLineDetailSubscription !== null) this._payrollLineDetailSubscription.unsubscribe();
      },
      error => {
        this._snackBarTemplate.snackBarError(this._snackBar, error.error.Message + " " + error.status);
        if (this._payrollLineDetailSubscription !== null) this._payrollLineDetailSubscription.unsubscribe();
      }
    );
  }

  public Close(): void {
    // this.DefaultValues();
    this._matDialogRef.close({ event: this._event });
  }

  // public CloseOnSave(): void {
  //   this._matDialogRef.close({ event: "Save", data: this._payrollLineModel });
  // }

  ngOnDestroy() {
  }

  public SavePayrollLine() {
    if (this._payrollLineModel.Id == 0) {
      this.AddPayrollLine();
    } else {
      this.UpdatePayrollLine();
    }
  }

  public async AddPayrollLine() {
    this._event = 'Update';
    this._isProgressBarHidden = true;
    if (this._isDataLoaded == true) {
      this._isDataLoaded = false;
      this._savePayrollLineSubscription = await (await this._payrollDetailService.AddPayrollLine(this._payrollLineModel.PAYId, this._payrollLineModel)).subscribe(
        (response: any) => {
          this._payrollLineModel.Id = response;
          this._isDataLoaded = true;
          this._isProgressBarHidden = false;
          this._snackBarTemplate.snackBarSuccess(this._snackBar, "Added Successfully");
          if (this._savePayrollLineSubscription != null) this._savePayrollLineSubscription.unsubscribe();
        },
        error => {
          this._isDataLoaded = true;
          this._isProgressBarHidden = false;
          this._snackBarTemplate.snackBarError(this._snackBar, error.error + " " + " Status Code: " + error.status);
          if (this._savePayrollLineSubscription != null) this._savePayrollLineSubscription.unsubscribe();
        }
      );
    }
  }

  public async UpdatePayrollLine() {
    this._event = 'Update';
    this._isProgressBarHidden = true;
    if (this._isDataLoaded == true) {
      this._isDataLoaded = false;
      this._savePayrollLineSubscription = await (await this._payrollDetailService.UpdatePayrollLine(this._payrollLineModel.Id, this._payrollLineModel)).subscribe(
        response => {
          this._isDataLoaded = true;
          this._isProgressBarHidden = false;
          this._snackBarTemplate.snackBarSuccess(this._snackBar, "Update Successfully");
          if (this._savePayrollLineSubscription != null) this._savePayrollLineSubscription.unsubscribe();
        },
        error => {
          this._isDataLoaded = true;
          this._isProgressBarHidden = false;
          this._snackBarTemplate.snackBarError(this._snackBar, error.error + " " + " Status Code: " + error.status);
          if (this._savePayrollLineSubscription != null) this._savePayrollLineSubscription.unsubscribe();
        }
      );
    }
  }

  public inputTypePayrollRate = 'text';
  public inputTypeTotalDailyPay = 'text';
  public inputTypeTotalPremiumPay = 'text';
  public inputTypeTotalHolidayPay = 'text';
  public inputTypeTotalOvertimePay = 'text';
  public inputTypeTotalNightDifferentialPay = 'text';
  public inputTypeTotalCOLA = 'text';
  public inputTypeTotalAdditionalAllowance = 'text';
  public inputTypeTotalLateDeduction = 'text';
  public inputTypeTotalUndertimeDeduction = 'text';
  public inputTypeIncome = 'text';
  public inputTypeTotalOtherIncomeNotTaxable = 'text';
  public inputTypeTotalOtherIncomeTaxable = 'text';
  public inputTypeGrossIncome = 'text';
  public inputTypeSSSContribution = 'text';
  public inputTypePHICContribution = 'text';
  public inputTypeHDMFContribution = 'text';
  public inputTypeIncomeTaxAmount = 'text';
  public inputTypeTotalOtherDeduction = 'text';
  public inputTypeNetIncome = 'text';
  public inputTypeSSSEmployerContribution = 'text';
  public inputTypeSSSEC = 'text';
  public inputTypePHICEmployerContribution = 'text';
  public inputTypeHDMFEmployerContribution = 'text';

  public RemoveComma(value: string): string {
    return value.toString().replace(/,/g, '');
  }

  PayrollRateFormatValueFocusOut() {
    this.inputTypePayrollRate = 'text';

    if (this._payrollLineModel.PayrollRate == '') {
      this._payrollLineModel.PayrollRate = this._decimalPipe.transform(0, "1.2-2");
    } else {
      this._payrollLineModel.PayrollRate = this._decimalPipe.transform(this._payrollLineModel.PayrollRate, "1.2-2");
    }
  }

  PayrollRateToNumberTypeFocus() {
    this._payrollLineModel.PayrollRate = this.RemoveComma(this._payrollLineModel.PayrollRate);
    this.inputTypePayrollRate = 'number';
  }



  TotalDailyPayFormatValueFocusOut() {
    this.inputTypeTotalDailyPay = 'text';

    if (this._payrollLineModel.TotalDailyPay == '') {
      this._payrollLineModel.TotalDailyPay = this._decimalPipe.transform(0, "1.2-2");
    } else {
      this._payrollLineModel.TotalDailyPay = this._decimalPipe.transform(this._payrollLineModel.TotalDailyPay, "1.2-2");
    }
  }

  TotalDailyPayToNumberTypeFocus() {
    this._payrollLineModel.TotalDailyPay = this.RemoveComma(this._payrollLineModel.TotalDailyPay);

    this.inputTypeTotalDailyPay = 'number';
  }

  TotalPremiumPayFormatValueFocusOut() {
    this.inputTypeTotalPremiumPay = 'text';

    if (this._payrollLineModel.TotalPremiumPay == '') {
      this._payrollLineModel.TotalPremiumPay = this._decimalPipe.transform(0, "1.2-2");
    } else {
      this._payrollLineModel.TotalPremiumPay = this._decimalPipe.transform(this._payrollLineModel.TotalPremiumPay, "1.2-2");
    }
  }

  TotalPremiumPayToNumberTypeFocus() {
    this._payrollLineModel.TotalPremiumPay = this.RemoveComma(this._payrollLineModel.TotalPremiumPay);
    this.inputTypeTotalPremiumPay = 'number';
  }

  TotalHolidayPayFormatValueFocusOut() {
    this.inputTypeTotalHolidayPay = 'text';

    if (this._payrollLineModel.TotalHolidayPay == '') {
      this._payrollLineModel.TotalHolidayPay = this._decimalPipe.transform(0, "1.2-2");
    } else {
      this._payrollLineModel.TotalHolidayPay = this._decimalPipe.transform(this._payrollLineModel.TotalHolidayPay, "1.2-2");
    }
  }

  TotalHolidayPayToNumberTypeFocus() {
    this._payrollLineModel.TotalHolidayPay = this.RemoveComma(this._payrollLineModel.TotalHolidayPay);
    this.inputTypeTotalHolidayPay = 'number';
  }

  TotalOvertimePayFormatValueFocusOut() {
    this.inputTypeTotalOvertimePay = 'text';

    if (this._payrollLineModel.TotalOvertimePay == '') {
      this._payrollLineModel.TotalOvertimePay = this._decimalPipe.transform(0, "1.2-2");
    } else {
      this._payrollLineModel.TotalOvertimePay = this._decimalPipe.transform(this._payrollLineModel.TotalOvertimePay, "1.2-2");
    }
  }

  TotalOvertimePayToNumberTypeFocus() {
    this._payrollLineModel.TotalOvertimePay = this.RemoveComma(this._payrollLineModel.TotalOvertimePay);
    this.inputTypeTotalOvertimePay = 'number';
  }

  TotalNightDifferentialPayFormatValueFocusOut() {
    this.inputTypeTotalNightDifferentialPay = 'text';

    if (this._payrollLineModel.TotalNightDifferentialPay == '') {
      this._payrollLineModel.TotalNightDifferentialPay = this._decimalPipe.transform(0, "1.2-2");
    } else {
      this._payrollLineModel.TotalNightDifferentialPay = this._decimalPipe.transform(this._payrollLineModel.TotalNightDifferentialPay, "1.2-2");
    }
  }

  TotalNightDifferentialPayToNumberTypeFocus() {
    this._payrollLineModel.TotalNightDifferentialPay = this.RemoveComma(this._payrollLineModel.TotalNightDifferentialPay);
    this.inputTypeTotalNightDifferentialPay = 'number';
  }

  TotalCOLAFormatValueFocusOut() {
    this.inputTypeTotalCOLA = 'text';

    if (this._payrollLineModel.TotalCOLA == '') {
      this._payrollLineModel.TotalCOLA = this._decimalPipe.transform(0, "1.2-2");
    } else {
      this._payrollLineModel.TotalCOLA = this._decimalPipe.transform(this._payrollLineModel.TotalCOLA, "1.2-2");
    }
  }

  TotalCOLAToNumberTypeFocus() {
    this._payrollLineModel.TotalCOLA = this.RemoveComma(this._payrollLineModel.TotalCOLA);
    this.inputTypeTotalCOLA = 'number';
  }

  TotalAdditionalAllowanceFormatValueFocusOut() {
    this.inputTypeTotalAdditionalAllowance = 'text';

    if (this._payrollLineModel.TotalAdditionalAllowance == '') {
      this._payrollLineModel.TotalAdditionalAllowance = this._decimalPipe.transform(0, "1.2-2");
    } else {
      this._payrollLineModel.TotalAdditionalAllowance = this._decimalPipe.transform(this._payrollLineModel.TotalAdditionalAllowance, "1.2-2");
    }
  }

  TotalAdditionalAllowanceToNumberTypeFocus() {
    this._payrollLineModel.TotalAdditionalAllowance = this.RemoveComma(this._payrollLineModel.TotalAdditionalAllowance);
    this.inputTypeTotalAdditionalAllowance = 'number';
  }

  TotalLateDeductionFormatValueFocusOut() {
    this.inputTypeTotalLateDeduction = 'text';

    if (this._payrollLineModel.TotalLateDeduction == '') {
      this._payrollLineModel.TotalLateDeduction = this._decimalPipe.transform(0, "1.2-2");
    } else {
      this._payrollLineModel.TotalLateDeduction = this._decimalPipe.transform(this._payrollLineModel.TotalLateDeduction, "1.2-2");
    }
  }

  TotalLateDeductionToNumberTypeFocus() {
    this._payrollLineModel.TotalLateDeduction = this.RemoveComma(this._payrollLineModel.TotalLateDeduction);
    this.inputTypeTotalLateDeduction = 'number';
  }

  TotalUndertimeDeductionFormatValueFocusOut() {
    this.inputTypeTotalUndertimeDeduction = 'text';

    if (this._payrollLineModel.TotalUndertimeDeduction == '') {
      this._payrollLineModel.TotalUndertimeDeduction = this._decimalPipe.transform(0, "1.2-2");
    } else {
      this._payrollLineModel.TotalUndertimeDeduction = this._decimalPipe.transform(this._payrollLineModel.TotalUndertimeDeduction, "1.2-2");
    }
  }

  TotalUndertimeDeductionToNumberTypeFocus() {
    this._payrollLineModel.TotalUndertimeDeduction = this.RemoveComma(this._payrollLineModel.TotalUndertimeDeduction);
    this.inputTypeTotalUndertimeDeduction = 'number';
  }

  IncomeFormatValueFocusOut() {
    this.inputTypeIncome = 'text';

    if (this._payrollLineModel.Income == '') {
      this._payrollLineModel.Income = this._decimalPipe.transform(0, "1.2-2");
    } else {
      this._payrollLineModel.Income = this._decimalPipe.transform(this._payrollLineModel.Income, "1.2-2");
    }
  }

  IncomeToNumberTypeFocus() {
    this._payrollLineModel.Income = this.RemoveComma(this._payrollLineModel.Income);
    this.inputTypeIncome = 'number';
  }

  TotalOtherIncomeNotTaxableFormatValueFocusOut() {
    this.inputTypeTotalOtherIncomeNotTaxable = 'text';

    if (this._payrollLineModel.TotalOtherIncomeNotTaxable == '') {
      this._payrollLineModel.TotalOtherIncomeNotTaxable = this._decimalPipe.transform(0, "1.2-2");
    } else {
      this._payrollLineModel.TotalOtherIncomeNotTaxable = this._decimalPipe.transform(this._payrollLineModel.TotalOtherIncomeNotTaxable, "1.2-2");
    }
  }

  TotalOtherIncomeNotTaxableToNumberTypeFocus() {
    this._payrollLineModel.TotalOtherIncomeNotTaxable = this.RemoveComma(this._payrollLineModel.TotalOtherIncomeNotTaxable);
    this.inputTypeTotalOtherIncomeNotTaxable = 'number';
  }

  TotalOtherIncomeTaxableFormatValueFocusOut() {
    this.inputTypeTotalOtherIncomeTaxable = 'text';

    if (this._payrollLineModel.TotalOtherIncomeTaxable == '') {
      this._payrollLineModel.TotalOtherIncomeTaxable = this._decimalPipe.transform(0, "1.2-2");
    } else {
      this._payrollLineModel.TotalOtherIncomeTaxable = this._decimalPipe.transform(this._payrollLineModel.TotalOtherIncomeTaxable, "1.2-2");
    }
  }

  TotalOtherIncomeTaxableToNumberTypeFocus() {
    this._payrollLineModel.TotalOtherIncomeTaxable = this.RemoveComma(this._payrollLineModel.TotalOtherIncomeTaxable);
    this.inputTypeTotalOtherIncomeTaxable = 'number';
  }

  GrossIncomeFormatValueFocusOut() {
    this.inputTypeGrossIncome = 'text';

    if (this._payrollLineModel.GrossIncome == '') {
      this._payrollLineModel.GrossIncome = this._decimalPipe.transform(0, "1.2-2");
    } else {
      this._payrollLineModel.GrossIncome = this._decimalPipe.transform(this._payrollLineModel.GrossIncome, "1.2-2");
    }
  }

  GrossIncomeToNumberTypeFocus() {
    this._payrollLineModel.GrossIncome = this.RemoveComma(this._payrollLineModel.GrossIncome);
    this.inputTypeGrossIncome = 'number';
  }

  SSSContributionFormatValueFocusOut() {
    this.inputTypeSSSContribution = 'text';

    if (this._payrollLineModel.SSSContribution == '') {
      this._payrollLineModel.SSSContribution = this._decimalPipe.transform(0, "1.2-2");
    } else {
      this._payrollLineModel.SSSContribution = this._decimalPipe.transform(this._payrollLineModel.SSSContribution, "1.2-2");
    }
  }

  SSSContributionToNumberTypeFocus() {
    this._payrollLineModel.SSSContribution = this.RemoveComma(this._payrollLineModel.SSSContribution);
    this.inputTypeSSSContribution = 'number';
  }

  PHICContributionFormatValueFocusOut() {
    this.inputTypePHICContribution = 'text';

    if (this._payrollLineModel.PHICContribution == '') {
      this._payrollLineModel.PHICContribution = this._decimalPipe.transform(0, "1.2-2");
    } else {
      this._payrollLineModel.PHICContribution = this._decimalPipe.transform(this._payrollLineModel.PHICContribution, "1.2-2");
    }
  }

  PHICContributionToNumberTypeFocus() {
    this._payrollLineModel.PHICContribution = this.RemoveComma(this._payrollLineModel.PHICContribution);
    this.inputTypePHICContribution = 'number';
  }

  HDMFContributionFormatValueFocusOut() {
    this.inputTypeHDMFContribution = 'text';

    if (this._payrollLineModel.HDMFContribution == '') {
      this._payrollLineModel.HDMFContribution = this._decimalPipe.transform(0, "1.2-2");
    } else {
      this._payrollLineModel.HDMFContribution = this._decimalPipe.transform(this._payrollLineModel.HDMFContribution, "1.2-2");
    }
  }

  HDMFContributionToNumberTypeFocus() {
    this._payrollLineModel.HDMFContribution = this.RemoveComma(this._payrollLineModel.HDMFContribution);
    this.inputTypeHDMFContribution = 'number';
  }

  IncomeTaxAmountFormatValueFocusOut() {
    this.inputTypeIncomeTaxAmount = 'text';

    if (this._payrollLineModel.IncomeTaxAmount == '') {
      this._payrollLineModel.IncomeTaxAmount = this._decimalPipe.transform(0, "1.2-2");
    } else {
      this._payrollLineModel.IncomeTaxAmount = this._decimalPipe.transform(this._payrollLineModel.IncomeTaxAmount, "1.2-2");
    }
  }

  IncomeTaxAmountToNumberTypeFocus() {
    this._payrollLineModel.IncomeTaxAmount = this.RemoveComma(this._payrollLineModel.IncomeTaxAmount);
    this.inputTypeIncomeTaxAmount = 'number';
  }

  TotalOtherDeductionFormatValueFocusOut() {
    this.inputTypeTotalOtherDeduction = 'text';

    if (this._payrollLineModel.TotalOtherDeduction == '') {
      this._payrollLineModel.TotalOtherDeduction = this._decimalPipe.transform(0, "1.2-2");
    } else {
      this._payrollLineModel.TotalOtherDeduction = this._decimalPipe.transform(this._payrollLineModel.TotalOtherDeduction, "1.2-2");
    }
  }

  TotalOtherDeductionToNumberTypeFocus() {
    this._payrollLineModel.TotalOtherDeduction = this.RemoveComma(this._payrollLineModel.TotalOtherDeduction);
    this.inputTypeTotalOtherDeduction = 'number';
  }

  NetIncomeFormatValueFocusOut() {
    this.inputTypeNetIncome = 'text';

    if (this._payrollLineModel.NetIncome == '') {
      this._payrollLineModel.NetIncome = this._decimalPipe.transform(0, "1.2-2");
    } else {
      this._payrollLineModel.NetIncome = this._decimalPipe.transform(this._payrollLineModel.NetIncome, "1.2-2");
    }
  }

  NetIncomeToNumberTypeFocus() {
    this._payrollLineModel.NetIncome = this.RemoveComma(this._payrollLineModel.NetIncome);
    this.inputTypeNetIncome = 'number';
  }

  SSSEmployerContributionFormatValueFocusOut() {
    this.inputTypeSSSEmployerContribution = 'text';

    if (this._payrollLineModel.SSSEmployerContribution == '') {
      this._payrollLineModel.SSSEmployerContribution = this._decimalPipe.transform(0, "1.2-2");
    } else {
      this._payrollLineModel.SSSEmployerContribution = this._decimalPipe.transform(this._payrollLineModel.SSSEmployerContribution, "1.2-2");
    }
  }

  SSSEmployerContributionToNumberTypeFocus() {
    this._payrollLineModel.SSSEmployerContribution = this.RemoveComma(this._payrollLineModel.SSSEmployerContribution);
    this.inputTypeSSSEmployerContribution = 'number';
  }

  SSSECFormatValueFocusOut() {
    this.inputTypeSSSEC = 'text';

    if (this._payrollLineModel.SSSEC == '') {
      this._payrollLineModel.SSSEC = this._decimalPipe.transform(0, "1.2-2");
    } else {
      this._payrollLineModel.SSSEC = this._decimalPipe.transform(this._payrollLineModel.SSSEC, "1.2-2");
    }
  }

  SSSECToNumberTypeFocus() {
    this._payrollLineModel.SSSEC = this.RemoveComma(this._payrollLineModel.SSSEC);
    this.inputTypeSSSEC = 'number';
  }

  PHICEmployerContributionFormatValueFocusOut() {
    this.inputTypePHICEmployerContribution = 'text';

    if (this._payrollLineModel.PHICEmployerContribution == '') {
      this._payrollLineModel.PHICEmployerContribution = this._decimalPipe.transform(0, "1.2-2");
    } else {
      this._payrollLineModel.PHICEmployerContribution = this._decimalPipe.transform(this._payrollLineModel.PHICEmployerContribution, "1.2-2");
    }
  }

  PHICEmployerContributionToNumberTypeFocus() {
    this._payrollLineModel.PHICEmployerContribution = this.RemoveComma(this._payrollLineModel.PHICEmployerContribution);
    this.inputTypePHICEmployerContribution = 'number';
  }

  HDMFEmployerContributionFormatValueFocusOut() {
    this.inputTypeHDMFEmployerContribution = 'text';

    if (this._payrollLineModel.HDMFEmployerContribution == '') {
      this._payrollLineModel.HDMFEmployerContribution = this._decimalPipe.transform(0, "1.2-2");
    } else {
      this._payrollLineModel.HDMFEmployerContribution = this._decimalPipe.transform(this._payrollLineModel.HDMFEmployerContribution, "1.2-2");
    }
  }

  HDMFEmployerContributionToNumberTypeFocus() {
    this._payrollLineModel.HDMFEmployerContribution = this.RemoveComma(this._payrollLineModel.HDMFEmployerContribution);
    this.inputTypeHDMFEmployerContribution = 'number';
  }
}
