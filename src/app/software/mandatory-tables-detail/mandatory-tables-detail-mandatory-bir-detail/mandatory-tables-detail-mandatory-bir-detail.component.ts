import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-mandatory-tables-detail-mandatory-bir-detail',
  templateUrl: './mandatory-tables-detail-mandatory-bir-detail.component.html',
  styleUrls: ['./mandatory-tables-detail-mandatory-bir-detail.component.css']
})
export class MandatoryTablesDetailMandatoryBirDetailComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<MandatoryTablesDetailMandatoryBirDetailComponent>,
    @Inject(MAT_DIALOG_DATA) public caseData: any,
    private _decimalPipe: DecimalPipe,
  ) { }

  public title = '';
  public _mandatoryBIR: any = [];

  public inputTypeAmountStart = 'text';
  public inputTypeAmountEnd = 'text';
  public inputTypeEmployeeTaxPercentage = 'text';
  public inputTypeEmployeeAdditionalAmount = 'text';
  public isComponentShow: boolean = false

  async ngOnInit() {
    setTimeout(() => {
      this.title = this.caseData.objDialogTitle;
      this._mandatoryBIR.Id = this.caseData.objData.Id;
      this._mandatoryBIR.AmountStart = this._decimalPipe.transform(this.caseData.objData.AmountStart, "1.2-2");
      this._mandatoryBIR.AmountEnd = this._decimalPipe.transform(this.caseData.objData.AmountEnd, "1.2-2");
      this._mandatoryBIR.EmployeeTaxPercentage = this._decimalPipe.transform(this.caseData.objData.EmployeeTaxPercentage, "1.2-2");
      this._mandatoryBIR.EmployeeAdditionalAmount = this._decimalPipe.transform(this.caseData.objData.EmployeeAdditionalAmount, "1.2-2");
      this.isComponentShow = true;
    }, 300);
  }

  public Close(): void {
    this.dialogRef.close({ event: 'Close' });
  }

  public Save(): void {
    if (this.title == 'Add Mandatory BIR') {
      this.dialogRef.close({ event: 'Add', objData: this._mandatoryBIR });
    } else {
      this.dialogRef.close({ event: 'Edit', objData: this._mandatoryBIR });
    }
  }

  public RemoveComma(value: string): string {
    return value.toString().replace(/,/g, '');
  }


  AmountStartToNumberType() {
    this._mandatoryBIR.AmountStart = this.RemoveComma(this._mandatoryBIR.AmountStart);
    this.inputTypeAmountStart = 'number';
  }

  AmountStartFormatValue() {
    this.inputTypeAmountStart = 'text';

    if (this._mandatoryBIR.AmountStart == '') {
      this._mandatoryBIR.AmountStart = this._decimalPipe.transform(0, "1.2-2");
    } else {
      this._mandatoryBIR.AmountStart = this._decimalPipe.transform(this._mandatoryBIR.AmountStart, "1.2-2");
    }
  }

  AmountEndToNumberType() {
    this._mandatoryBIR.AmountEnd = this.RemoveComma(this._mandatoryBIR.AmountEnd);
    this.inputTypeAmountEnd = 'number';
  }

  AmountEndFormatValue() {
    this.inputTypeAmountEnd = 'text';

    if (this._mandatoryBIR.AmountEnd == '') {
      this._mandatoryBIR.AmountEnd = this._decimalPipe.transform(0, "1.2-2");
    } else {
      this._mandatoryBIR.AmountEnd = this._decimalPipe.transform(this._mandatoryBIR.AmountEnd, "1.2-2");
    }
  }


  EmployeeTaxPercentageToNumberType() {
    this._mandatoryBIR.EmployeeTaxPercentage = this.RemoveComma(this._mandatoryBIR.EmployeeTaxPercentage);
    this.inputTypeEmployeeTaxPercentage = 'number';
  }

  EmployeeTaxPercentageFormatValue() {
    this.inputTypeEmployeeTaxPercentage = 'text';

    if (this._mandatoryBIR.EmployeeTaxPercentage == '') {
      this._mandatoryBIR.EmployeeTaxPercentage = this._decimalPipe.transform(0, "1.2-2");
    } else {
      this._mandatoryBIR.EmployeeTaxPercentage = this._decimalPipe.transform(this._mandatoryBIR.EmployeeTaxPercentage, "1.2-2");
    }
  }

  EmployeeAdditionalAmountToNumberType() {
    this._mandatoryBIR.EmployeeAdditionalAmount = this.RemoveComma(this._mandatoryBIR.EmployeeAdditionalAmount);
    this.inputTypeEmployeeAdditionalAmount = 'number';
  }

  EmployeeAdditionalAmountFormatValue() {
    this.inputTypeEmployeeAdditionalAmount = 'text';

    if (this._mandatoryBIR.EmployeeAdditionalAmount == '') {
      this._mandatoryBIR.EmployeeAdditionalAmount = this._decimalPipe.transform(0, "1.2-2");
    } else {
      this._mandatoryBIR.EmployeeAdditionalAmount = this._decimalPipe.transform(this._mandatoryBIR.EmployeeAdditionalAmount, "1.2-2");
    }
  }


}
