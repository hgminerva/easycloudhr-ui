import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-mandatory-tables-detail-mandatory-hdmf-detail',
  templateUrl: './mandatory-tables-detail-mandatory-hdmf-detail.component.html',
  styleUrls: ['./mandatory-tables-detail-mandatory-hdmf-detail.component.css']
})
export class MandatoryTablesDetailMandatoryHdmfDetailComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<MandatoryTablesDetailMandatoryHdmfDetailComponent>,
    @Inject(MAT_DIALOG_DATA) public caseData: any,
    private _decimalPipe: DecimalPipe,
  ) { }

  public title = '';
  public _mandatoryHDMF: any = [];

  public inputTypeAmountStart = 'text';
  public inputTypeAmountEnd = 'text';
  public inputTypeEmployeeContributionPercentage = 'text';
  public inputTypeEmployerContributionPercentage = 'text';
  public inputTypeEmployeeContributionValue = 'text';
  public inputTypeEmployerContributionValue = 'text';

  async ngOnInit() {
    this.title = this.caseData.objDialogTitle;
    this._mandatoryHDMF.Id = this.caseData.objData.Id;
    this._mandatoryHDMF.AmountStart = this._decimalPipe.transform(this._mandatoryHDMF.AmountStart, "1.2-2");
    this._mandatoryHDMF.AmountEnd = this._decimalPipe.transform(this._mandatoryHDMF.AmountEnd, "1.2-2");
    this._mandatoryHDMF.EmployeeContributionPercentage = this._decimalPipe.transform(this._mandatoryHDMF.EmployeeContributionPercentage, "1.2-2");
    this._mandatoryHDMF.EmployerContributionPercentage = this._decimalPipe.transform(this._mandatoryHDMF.EmployerContributionPercentage, "1.2-2");
    this._mandatoryHDMF.EmployeeContributionValue = this._decimalPipe.transform(this._mandatoryHDMF.EmployeeContributionValue, "1.2-2");
    this._mandatoryHDMF.EmployerContributionValue = this._decimalPipe.transform(this._mandatoryHDMF.EmployerContributionValue, "1.2-2");
    this._mandatoryHDMF.Remarks = this._decimalPipe.transform(this._mandatoryHDMF.Remarks, "1.2-2");
    console.log(this._mandatoryHDMF);
  }

  public Close(): void {
    this.dialogRef.close({ event: 'Close' });
  }

  public Save(): void {
    if (this.title == 'Add Mandatory BIR') {
      this.dialogRef.close({ event: 'Add', objData: this._mandatoryHDMF });
    } else {
      this.dialogRef.close({ event: 'Edit', objData: this._mandatoryHDMF });
    }
  }

  AmountStartFormatValue() {
    this.inputTypeAmountStart = 'text';

    if (this._mandatoryHDMF.AmountStart == '') {
      this._mandatoryHDMF.AmountStart = this._decimalPipe.transform(0, "1.2-2");
    } else {
      this._mandatoryHDMF.AmountStart = this._decimalPipe.transform(this._mandatoryHDMF.AmountStart, "1.2-2");
    }
  }

  AmountStartToNumberType() {
    this.inputTypeAmountStart = 'number';
  }

  AmountEndFormatValue() {
    this.inputTypeAmountEnd = 'text';

    if (this._mandatoryHDMF.AmountEnd == '') {
      this._mandatoryHDMF.AmountEnd = this._decimalPipe.transform(0, "1.2-2");
    } else {
      this._mandatoryHDMF.AmountEnd = this._decimalPipe.transform(this._mandatoryHDMF.AmountEnd, "1.2-2");
    }
  }

  AmountEndToNumberType() {
    this.inputTypeAmountEnd = 'number';
  }

  EmployeeContributionPercentageFormatValue() {
    this.inputTypeEmployeeContributionPercentage = 'text';

    if (this._mandatoryHDMF.EmployeeContributionPercentage == '') {
      this._mandatoryHDMF.EmployeeContributionPercentage = this._decimalPipe.transform(0, "1.2-2");
    } else {
      this._mandatoryHDMF.EmployeeContributionPercentage = this._decimalPipe.transform(this._mandatoryHDMF.EmployeeContributionPercentage, "1.2-2");
    }
  }

  EmployeeContributionPercentageToNumberType() {
    this.inputTypeEmployeeContributionPercentage = 'number';
  }

  EmployerContributionPercentageFormatValue() {
    this.inputTypeEmployerContributionPercentage= 'text';

    if (this._mandatoryHDMF.EmployerContributionPercentage == '') {
      this._mandatoryHDMF.EmployerContributionPercentage = this._decimalPipe.transform(0, "1.2-2");
    } else {
      this._mandatoryHDMF.EmployerContributionPercentage = this._decimalPipe.transform(this._mandatoryHDMF.EmployerContributionPercentage, "1.2-2");
    }
  }

  EmployerContributionPercentageToNumberType() {
    this.inputTypeEmployerContributionPercentage = 'number';
  }

  EmployeeContributionValueFormatValue() {
    this.inputTypeEmployerContributionPercentage= 'text';

    if (this._mandatoryHDMF.EmployeeContributionValue == '') {
      this._mandatoryHDMF.EmployeeContributionValue = this._decimalPipe.transform(0, "1.2-2");
    } else {
      this._mandatoryHDMF.EmployeeContributionValue = this._decimalPipe.transform(this._mandatoryHDMF.EmployeeContributionValue, "1.2-2");
    }
  }

  EmployeeContributionValueToNumberType() {
    this.inputTypeEmployeeContributionValue = 'number';
  }

  EmployerContributionValueFormatValue() {
    this.inputTypeEmployerContributionPercentage= 'text';

    if (this._mandatoryHDMF.EmployerContributionValue == '') {
      this._mandatoryHDMF.EmployerContributionValue = this._decimalPipe.transform(0, "1.2-2");
    } else {
      this._mandatoryHDMF.EmployerContributionValue = this._decimalPipe.transform(this._mandatoryHDMF.EmployerContributionValue, "1.2-2");
    }
  }

  EmployerContributionValueToNumberType() {
    this.inputTypeEmployerContributionValue = 'number';
  }
}
