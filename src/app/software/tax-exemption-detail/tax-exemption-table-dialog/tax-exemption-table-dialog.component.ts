import { DecimalPipe } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackBarTemplate } from '../../shared/snack-bar-template';
import { TaxExemptionDetailService } from '../tax-exemption-detail.service';
import { TaxExemptionTableModel } from '../tax-exemption-table.model';

@Component({
  selector: 'app-tax-exemption-table-dialog',
  templateUrl: './tax-exemption-table-dialog.component.html',
  styleUrls: ['./tax-exemption-table-dialog.component.css']
})
export class TaxExemptionTableDialogComponent implements OnInit {

  constructor(
    public _taxExemptionDetailService: TaxExemptionDetailService,
    private _snackBar: MatSnackBar,
    private _snackBarTemplate: SnackBarTemplate,
    public _matDialogRef: MatDialogRef<TaxExemptionTableDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public _caseData: any,
    private _decimalPipe: DecimalPipe
  ) { }

  ngOnInit(): void {
    this.TaxTableListData();
  }

  public _taxExemptionTable: TaxExemptionTableModel = {
    Id: 0,
    TaxExemptionId: 0,
    Type: '',
    Amount: '0',
    Tax: '0',
    Percentage: '0'
  }

  public _title = '';
  public _isComponentsShown: boolean = false;
  public _taxtableDropdownSubscription: any;
  public _taxtableListDropdown: any = [];

  private async TaxTableListData() {
    this._taxtableDropdownSubscription = await (await this._taxExemptionDetailService.TaxTableDropdownList()).subscribe(
      response => {
        this._taxtableListDropdown = response;
        this._taxExemptionTable.Type = this._taxtableListDropdown[0].Value;
        if (this._taxtableDropdownSubscription !== null) this._taxtableDropdownSubscription.unsubscribe();
      },
      error => {
        this._snackBarTemplate.snackBarError(this._snackBar, error.error.Message + " " + error.status);
        if (this._taxtableDropdownSubscription !== null) this._taxtableDropdownSubscription.unsubscribe();
      }
    );

    await this.loadComponents();
  }

  public RemoveComma(value: string): string {
    return value.toString().replace(/,/g, '');
  }

  public inputAmount = 'text';
  public inputTax = 'text';
  public inputPercentage = 'text';

  AmountFormatValueFocusOut() {
    this.inputAmount = 'text';

    if (this._taxExemptionTable.Amount == '') {
      this._taxExemptionTable.Amount = this._decimalPipe.transform(0, "1.2-2");
    } else {
      this._taxExemptionTable.Amount = this._decimalPipe.transform(this._taxExemptionTable.Amount, "1.2-2");
    }
  }

  AmountToNumberTypeFocus() {
    this._taxExemptionTable.Amount = this.RemoveComma(this._taxExemptionTable.Amount);
    this.inputAmount = 'number';
  }

  TaxFormatValueFocusOut() {
    this.inputTax = 'text';

    if (this._taxExemptionTable.Tax == '') {
      this._taxExemptionTable.Tax = this._decimalPipe.transform(0, "1.2-2");
    } else {
      this._taxExemptionTable.Tax = this._decimalPipe.transform(this._taxExemptionTable.Tax, "1.2-2");
    }
  }

  TaxToNumberTypeFocus() {
    this._taxExemptionTable.Tax = this.RemoveComma(this._taxExemptionTable.Tax);
    this.inputTax = 'number';
  }

  PercentageFormatValueFocusOut() {
    this.inputPercentage = 'text';

    if (this._taxExemptionTable.Percentage == '') {
      this._taxExemptionTable.Percentage = this._decimalPipe.transform(0, "1.2-2");
    } else {
      this._taxExemptionTable.Percentage = this._decimalPipe.transform(this._taxExemptionTable.Percentage, "1.2-2");
    }
  }

  PercentageToNumberTypeFocus() {
    this._taxExemptionTable.Percentage = this.RemoveComma(this._taxExemptionTable.Percentage);
    this.inputPercentage = 'number';
  }

  public loadComponents(): void {

    setTimeout(() => {

      this._title = this._caseData.objDialogTitle;
      this._taxExemptionTable.Id = this._caseData.objData.Id;
      this._taxExemptionTable.TaxExemptionId = this._caseData.objData.TaxExemptionId;
      this._taxExemptionTable.Amount = this._decimalPipe.transform(this._caseData.objData.Amount, "1.2-2");
      this._taxExemptionTable.Tax = this._decimalPipe.transform(this._caseData.objData.Tax, "1.2-2");
      this._taxExemptionTable.Percentage = this._decimalPipe.transform(this._caseData.objData.Percentage, "1.2-2");
      this._isComponentsShown = true;

      if (this._taxExemptionTable.Id != 0) {
        this._taxExemptionTable.Type = this._caseData.objData.Type;
      }

    }, 300);

  }

  public CloseOnSave(): void {
    if (this._title == 'Add Tax Exemption Table') {
      this._matDialogRef.close({ event: 'Add', data: this._taxExemptionTable });
    } else {
      this._matDialogRef.close({ event: 'Edit', data: this._taxExemptionTable });
    }
  }


  public Close(): void {
    this._matDialogRef.close({ event: 'Close' });
  }

  public Save(): void {

  }

}
