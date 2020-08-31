import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackBarTemplate } from '../../shared/snack-bar-template';

import { EmployeeListPickDialogComponent } from './../../shared/employee-list-pick-dialog/employee-list-pick-dialog.component';
import { DatePipe, DecimalPipe } from '@angular/common';
import { PayrollOtherDeductionLineModel } from './../payroll-other-deduction-line.model';
import { PayrollOtherDeductionDetailService } from './../payroll-other-deduction-detail.service'

@Component({
  selector: 'app-payroll-other-deduction-line-dialog',
  templateUrl: './payroll-other-deduction-line-dialog.component.html',
  styleUrls: ['./payroll-other-deduction-line-dialog.component.css']
})
export class PayrollOtherDeductionLineDialogComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<PayrollOtherDeductionLineDialogComponent>,
    private _payrollOtherDeductionDetailService: PayrollOtherDeductionDetailService,
    @Inject(MAT_DIALOG_DATA) public caseData: any,
    private _snackBar: MatSnackBar,
    private _snackBarTemplate: SnackBarTemplate,
    public _matDialog: MatDialog,
    private decimalPipe: DecimalPipe,
  ) { }

  ngOnInit(): void {
    this.title = this.caseData.objDialogTitle;
    this.OtherDeductionListData();
  }

  public _payrollOtherDeductionLineModel: PayrollOtherDeductionLineModel = {
    Id: 0,
    PDId: 0,
    EmployeeId: 0,
    Employee: '',
    OtherDeductionId: 0,
    OtherDeduction: '',
    LNId: 0,
    Loan: '',
    Amount: '',
    Particulars: ''
  }

  public title = '';
  public inputTypeAmount = '';

  public isComponentHidden: boolean = true;

  public _payrollOtherDeductionDropdownSubscription: any;
  public _payrollOtherDeductionListDropdown: any = [];

  public _loanDropdownSubscription: any;
  public _loanListDropdown: any = [];

  private async OtherDeductionListData() {
    this._payrollOtherDeductionDropdownSubscription = (await this._payrollOtherDeductionDetailService.OtherDeductionList()).subscribe(
      response => {
        this._payrollOtherDeductionListDropdown = response;
        this._payrollOtherDeductionLineModel.OtherDeductionId = this._payrollOtherDeductionListDropdown[0].Id;
        if (this._payrollOtherDeductionDropdownSubscription !== null) this._payrollOtherDeductionDropdownSubscription.unsubscribe();
      },
      error => {
        this._snackBarTemplate.snackBarError(this._snackBar, error.error.Message + " " + error.status);
        if (this._payrollOtherDeductionDropdownSubscription !== null) this._payrollOtherDeductionDropdownSubscription.unsubscribe();
      }
    );
    this.LoanListData();
  }

  private async LoanListData() {
    this._loanDropdownSubscription = (await this._payrollOtherDeductionDetailService.LoanList()).subscribe(
      response => {
        this._loanListDropdown = response;
        this._payrollOtherDeductionLineModel.LNId = this._loanListDropdown[0].Id;
        if (this._loanDropdownSubscription !== null) this._loanDropdownSubscription.unsubscribe();
      },
      error => {
        this._snackBarTemplate.snackBarError(this._snackBar, error.error.Message + " " + error.status);
        if (this._loanDropdownSubscription !== null) this._loanDropdownSubscription.unsubscribe();
      }
    );
    this.loadPayrollOtherDeductionLineDetail();
  }

  private loadPayrollOtherDeductionLineDetail() {
    setTimeout(() => {
      this._payrollOtherDeductionLineModel.Id = this.caseData.objPayrollOtherDeductionLine.Id;
      this._payrollOtherDeductionLineModel.PDId = this.caseData.objPayrollOtherDeductionLine.PDId;
      this._payrollOtherDeductionLineModel.EmployeeId = this.caseData.objPayrollOtherDeductionLine.EmployeeId;
      this._payrollOtherDeductionLineModel.Employee = this.caseData.objPayrollOtherDeductionLine.Employee;
      this._payrollOtherDeductionLineModel.OtherDeduction = this.caseData.objPayrollOtherDeductionLine.OtherDeduction;
      this._payrollOtherDeductionLineModel.Loan = this.caseData.objPayrollOtherDeductionLine.Loan;
      this._payrollOtherDeductionLineModel.Amount = this.decimalPipe.transform(this.caseData.objPayrollOtherDeductionLine.Amount, "1.2-2");
      this._payrollOtherDeductionLineModel.Particulars = this.caseData.objPayrollOtherDeductionLine.Particulars;

      if (this._payrollOtherDeductionLineModel.Id != 0) {
        this._payrollOtherDeductionLineModel.OtherDeductionId = this.caseData.objPayrollOtherDeductionLine.OtherDeductionId;
        this._payrollOtherDeductionLineModel.LNId = this.caseData.objPayrollOtherDeductionLine.LNId;
      }

      this.isComponentHidden = false;
    }, 100);
  }

  public Close(): void {
    this.dialogRef.close({ event: 'Close' });
  }

  public async Save() {
    console.log(this._payrollOtherDeductionLineModel);
    if (this._payrollOtherDeductionLineModel.EmployeeId != 0) {
      await this.dialogRef.close({ event: this.title, data: this._payrollOtherDeductionLineModel });
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
        this._payrollOtherDeductionLineModel.EmployeeId = data.employee.Id;
        this._payrollOtherDeductionLineModel.Employee = data.employee.Value;
      }
    });
  }

  public RemoveComma(value: string): string {
    return value.toString().replace(/,/g, '');
  }

  formatValueAmount() {
    this.inputTypeAmount = 'text';

    if (this._payrollOtherDeductionLineModel.Amount == '') {
      this._payrollOtherDeductionLineModel.Amount = this.decimalPipe.transform(0, "1.2-2");
    } else {
      this._payrollOtherDeductionLineModel.Amount = this.decimalPipe.transform(this._payrollOtherDeductionLineModel.Amount, "1.2-2");
    }
  }

  AmountToNumberType() {
    this._payrollOtherDeductionLineModel.Amount = this.RemoveComma(this._payrollOtherDeductionLineModel.Amount);
    this.inputTypeAmount = 'number';
  }

}
