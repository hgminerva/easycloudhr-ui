import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-mandatory-tables-detail-mandatory-phic-detail',
  templateUrl: './mandatory-tables-detail-mandatory-phic-detail.component.html',
  styleUrls: ['./mandatory-tables-detail-mandatory-phic-detail.component.css']
})
export class MandatoryTablesDetailMandatoryPhicDetailComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<MandatoryTablesDetailMandatoryPhicDetailComponent>,
    @Inject(MAT_DIALOG_DATA) public caseData: any,
    private _decimalPipe: DecimalPipe,
  ) { }

  public title = '';

  public _mandatoryPHIC: any = [];

  public inputTypeAmountStart = 'text';
  public inputTypeAmountEnd = 'text';
  public inputTypeEmployeeContributionValue = 'text';
  public inputTypeEmployerContributionValue = 'text';

  async ngOnInit() {
    this.title = this.caseData.objDialogTitle;
    this._mandatoryPHIC.Id = this.caseData.objData.Id;
    this._mandatoryPHIC.AmountStart = this._decimalPipe.transform(this.caseData.objData.AmountStart, "1.2-2");
    this._mandatoryPHIC.AmountEnd = this._decimalPipe.transform(this.caseData.objData.AmountEnd, "1.2-2");
    this._mandatoryPHIC.EmployeeContributionValue = this._decimalPipe.transform(this.caseData.objData.EmployeeContributionValue, "1.2-2");
    this._mandatoryPHIC.EmployerContributionValue = this._decimalPipe.transform(this.caseData.objData.EmployerContributionValue, "1.2-2");
    this._mandatoryPHIC.Remarks = this.caseData.objData.Remarks;
  }

  public Close(): void {
    this.dialogRef.close({ event: 'Close' });
  }

  public Save(): void {
    if (this.title == 'Add Mandatory PHIC') {
      this.dialogRef.close({ event: 'Add', objData: this._mandatoryPHIC });
    } else {
      this.dialogRef.close({ event: 'Edit', objData: this._mandatoryPHIC });
    }
  }

  public RemoveComma(value: string): string {
    return value.toString().replace(/,/g, '');
  }

  AmountStartToNumberType() {
    this._mandatoryPHIC.AmountStart = this.RemoveComma(this._mandatoryPHIC.AmountStart);
    this.inputTypeAmountStart = 'number';
  }

  AmountStartFormatValue() {
    this.inputTypeAmountStart = 'text';

    if (this._mandatoryPHIC.AmountStart === '') {
      this._mandatoryPHIC.AmountStart = this._decimalPipe.transform(0, "1.2-2");
    } else {
      this._mandatoryPHIC.AmountStart = this._decimalPipe.transform(this._mandatoryPHIC.AmountStart, "1.2-2");
    }
  }

  AmountEndToNumberType() {
    this._mandatoryPHIC.AmountEnd = this.RemoveComma(this._mandatoryPHIC.AmountEnd);

    this.inputTypeAmountEnd = 'number';
  }

  async AmountEndFormatValue() {
    this.inputTypeAmountEnd = await 'text';

    if (this._mandatoryPHIC.AmountEnd === '') {
      this._mandatoryPHIC.AmountEnd = this._decimalPipe.transform(0, "1.2-2");
    } else {
      this._mandatoryPHIC.AmountEnd = this._decimalPipe.transform(this._mandatoryPHIC.AmountEnd, "1.2-2");
    }
  }

  EmployeeContributionValueToNumberType() {
    this._mandatoryPHIC.EmployeeContributionValue = this.RemoveComma(this._mandatoryPHIC.EmployeeContributionValue);

    this.inputTypeEmployeeContributionValue = 'number';
  }

  EmployeeContributionValueFormatValue() {
    this.inputTypeEmployeeContributionValue = 'text';

    if (this._mandatoryPHIC.EmployeeContributionValue === '') {
      this._mandatoryPHIC.EmployeeContributionValue = this._decimalPipe.transform(0, "1.2-2");
    } else {
      this._mandatoryPHIC.EmployeeContributionValue = this._decimalPipe.transform(this._mandatoryPHIC.EmployeeContributionValue, "1.2-2");
    }
  }

  EmployerContributionValueToNumberType() {
    this._mandatoryPHIC.EmployerContributionValue = this.RemoveComma(this._mandatoryPHIC.EmployerContributionValue);

    this.inputTypeEmployerContributionValue = 'number';
  }

  EmployerContributionValueFormatValue() {
    this.inputTypeEmployerContributionValue = 'text';

    if (this._mandatoryPHIC.EmployerContributionValue === '') {
      this._mandatoryPHIC.EmployerContributionValue = this._decimalPipe.transform(0, "1.2-2");
    } else {
      this._mandatoryPHIC.EmployerContributionValue = this._decimalPipe.transform(this._mandatoryPHIC.EmployerContributionValue, "1.2-2");
    }
  }


}
