import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-system-tables-tax-exemption-detail',
  templateUrl: './system-tables-tax-exemption-detail.component.html',
  styleUrls: ['./system-tables-tax-exemption-detail.component.css']
})
export class SystemTablesTaxExemptionDetailComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<SystemTablesTaxExemptionDetailComponent>,
    @Inject(MAT_DIALOG_DATA) public caseData: any,
    private decimalPipe: DecimalPipe
  ) { }

  public title = '';
  public taxExemption: any = [];

  async ngOnInit() {
    this.title = this.caseData.objDialogTitle;
    this.taxExemption = await this.caseData.objData;
    console.log(this.taxExemption);
  }

  public Close(): void {
    this.dialogRef.close({ event: 'Close' });
  }

  public Save(): void {
    if (this.title == 'Add Tax Exemption') {
      this.dialogRef.close({ event: 'Add', objData: this.taxExemption });
    } else {
      this.dialogRef.close({ event: 'Edit', objData: this.taxExemption });

    }
  }

  formatValueExemptionAmount() {
    if (this.taxExemption.ExemptionAmount == '') {
      this.taxExemption.ExemptionAmount = this.decimalPipe.transform(0, "1.2-2");
    } else {
      this.taxExemption.ExemptionAmount = this.decimalPipe.transform(this.taxExemption.ExemptionAmount, "1.2-2");
    }
  }

  formatValueDependentAmount() {
    if (this.taxExemption.DependentAmount == '') {
      this.taxExemption.DependentAmount = this.decimalPipe.transform(0, "1.2-2");
    } else {
      this.taxExemption.DependentAmount = this.decimalPipe.transform(this.taxExemption.DependentAmount, "1.2-2");
    }
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
}
