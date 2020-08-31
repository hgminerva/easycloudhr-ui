import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackBarTemplate } from '../../shared/snack-bar-template';

import { EmployeeListPickDialogComponent } from './../../shared/employee-list-pick-dialog/employee-list-pick-dialog.component';
import { DatePipe, DecimalPipe } from '@angular/common';
import { PayrollOtherIncomeLineModel } from '../payroll-other-income-line.model';
import { PayrollOtherIncomeDetailService } from './../payroll-other-income-detail.service';

@Component({
  selector: 'app-payroll-other-income-line-dialog',
  templateUrl: './payroll-other-income-line-dialog.component.html',
  styleUrls: ['./payroll-other-income-line-dialog.component.css']
})
export class PayrollOtherIncomeLineDialogComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<PayrollOtherIncomeLineDialogComponent>,
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
  }

  public Close(): void {
    this.dialogRef.close({ event: 'Close' });
  }

  public async Save() {
    if (this._payrollOtherIncomeLineModel.EmployeeId != 0) {
      await this.dialogRef.close({ event: this.title, data: this._payrollOtherIncomeLineModel });
    } else {
      this._snackBarTemplate.snackBarError(this._snackBar, "Choose employee!");
    }
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

}
