import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-mandatory-tables-detail-mandatory-sss-detail',
  templateUrl: './mandatory-tables-detail-mandatory-sss-detail.component.html',
  styleUrls: ['./mandatory-tables-detail-mandatory-sss-detail.component.css']
})
export class MandatoryTablesDetailMandatorySssDetailComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<MandatoryTablesDetailMandatorySssDetailComponent>,
    @Inject(MAT_DIALOG_DATA) public caseData: any,
    private _decimalPipe: DecimalPipe,
  ) { }

  public title = '';
  public _mandatorySSS: any = [];

  public inputTypeAmountStart = 'text';
  public inputTypeAmountEnd = 'text';
  public inputTypeEmployeeContributionValue = 'text';
  public inputTypeEmployerContributionValue = 'text';

  async ngOnInit() {
    this.title = this.caseData.objDialogTitle;
    this._mandatorySSS.Id = this.caseData.objData.Id;
    this._mandatorySSS.AmountStart = this._decimalPipe.transform(this.caseData.objData.AmountStart, "1.2-2");
    this._mandatorySSS.AmountEnd = this._decimalPipe.transform(this.caseData.objData.AmountEnd, "1.2-2");
    this._mandatorySSS.EmployeeContributionValue = this._decimalPipe.transform(this.caseData.objData.EmployeeContributionValue, "1.2-2");
    this._mandatorySSS.EmployerContributionValue = this._decimalPipe.transform(this.caseData.objData.EmployerContributionValue, "1.2-2");
    this._mandatorySSS.Remarks = this._mandatorySSS.Remarks
    console.log(this._mandatorySSS);
  }

  public Close(): void {
    this.dialogRef.close({ event: 'Close' });
  }

  public Save(): void {
    if (this.title == 'Add Mandatory BIR') {
      this.dialogRef.close({ event: 'Add', objData: this._mandatorySSS });
    } else {
      this.dialogRef.close({ event: 'Edit', objData: this._mandatorySSS });
    }
  }

  AmountStartFormatValue() {
    this.inputTypeAmountStart = 'text';

    if (this._mandatorySSS.AmountStart == '') {
      this._mandatorySSS.AmountStart = this._decimalPipe.transform(0, "1.2-2");
    } else {
      this._mandatorySSS.AmountStart = this._decimalPipe.transform(this._mandatorySSS.AmountStart, "1.2-2");
    }
  }

  AmountStartToNumberType() {
    this.inputTypeAmountStart = 'number';
  }

  AmountEndFormatValue() {
    this.inputTypeAmountEnd = 'text';

    if (this._mandatorySSS.AmountEnd == '') {
      this._mandatorySSS.AmountEnd = this._decimalPipe.transform(0, "1.2-2");
    } else {
      this._mandatorySSS.AmountEnd = this._decimalPipe.transform(this._mandatorySSS.AmountEnd, "1.2-2");
    }
  }

  AmountEndToNumberType() {
    this.inputTypeAmountEnd = 'number';
  }

  EmployeeContributionValueFormatValue() {
    this.inputTypeEmployeeContributionValue = 'text';

    if (this._mandatorySSS.EmployeeContributionValue == '') {
      this._mandatorySSS.EmployeeContributionValue = this._decimalPipe.transform(0, "1.2-2");
    } else {
      this._mandatorySSS.EmployeeContributionValue = this._decimalPipe.transform(this._mandatorySSS.EmployeeContributionValue, "1.2-2");
    }
  }

  EmployeeContributionValueToNumberType() {
    this.inputTypeEmployeeContributionValue = 'number';
  }

  EmployerContributionValueFormatValue() {
    this.inputTypeEmployerContributionValue = 'text';

    if (this._mandatorySSS.EmployerContributionValue == '') {
      this._mandatorySSS.EmployerContributionValue = this._decimalPipe.transform(0, "1.2-2");
    } else {
      this._mandatorySSS.EmployerContributionValue = this._decimalPipe.transform(this._mandatorySSS.EmployerContributionValue, "1.2-2");
    }
  }

  EmployerContributionValueToNumberType() {
    this.inputTypeEmployerContributionValue = 'number';
  }
 
}
