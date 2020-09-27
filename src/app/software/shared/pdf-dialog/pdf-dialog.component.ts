import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackBarTemplate } from '../../shared/snack-bar-template';
import { SharedService } from '../shared.service';

@Component({
  selector: 'app-pdf-dialog',
  templateUrl: './pdf-dialog.component.html',
  styleUrls: ['./pdf-dialog.component.css']
})
export class PdfDialogComponent implements OnInit {

  constructor(
    public _dialogRef: MatDialogRef<PdfDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public caseData: any,
    private _snackBar: MatSnackBar,
    private _snackBarTemplate: SnackBarTemplate,
    private _portalEmployeeService: SharedService,
  ) { }

  ngOnInit(): void {
    if(this.caseData.objDialogTitle === 'Payslip') this.printCasePayslip();
    if(this.caseData.objDialogTitle === 'DTR') this.printCaseDTR();
    if(this.caseData.objDialogTitle === 'Payroll') this.printCasePayrollWorkSheet();
  }

  public _printPaySlisSubscription: any;
  public pdfUrl: string = '';

  public _isProgressBarHidden: boolean = false;

  public async printCasePayslip() {
    this._printPaySlisSubscription = (await this._portalEmployeeService.PDFPayslip(this.caseData.objData.EmployeeId, this.caseData.objData.TransactionId)).subscribe(
      data => {
        console.log(data);
        var binaryData = [];

        binaryData.push(data);
        this.pdfUrl = URL.createObjectURL(new Blob(binaryData, { type: "application/pdf" }));

        this._isProgressBarHidden = false;
        if (this._printPaySlisSubscription != null) this._printPaySlisSubscription.unsubscribe();
      },
      error => {
        this._isProgressBarHidden = false;

        this._snackBarTemplate.snackBarError(this._snackBar, error.error + " " + error.status);
        console.log(error);
        if (this._printPaySlisSubscription != null) this._printPaySlisSubscription.unsubscribe();
      }
    );
  }

  public async printCaseDTR() {
    this._printPaySlisSubscription = (await this._portalEmployeeService.PDFDTR(this.caseData.objData.TransactionId)).subscribe(
      data => {
        console.log(data);
        var binaryData = [];

        binaryData.push(data);
        this.pdfUrl = URL.createObjectURL(new Blob(binaryData, { type: "application/pdf" }));

        this._isProgressBarHidden = false;
        if (this._printPaySlisSubscription != null) this._printPaySlisSubscription.unsubscribe();
      },
      error => {
        this._isProgressBarHidden = false;

        this._snackBarTemplate.snackBarError(this._snackBar, error.error + " " + error.status);
        console.log(error);
        if (this._printPaySlisSubscription != null) this._printPaySlisSubscription.unsubscribe();
      }
    );
  }

  public async printCasePayrollWorkSheet() {
    this._printPaySlisSubscription = (await this._portalEmployeeService.PDFWorkSheet(this.caseData.objData.TransactionId)).subscribe(
      data => {
        console.log(data);
        var binaryData = [];

        binaryData.push(data);
        this.pdfUrl = URL.createObjectURL(new Blob(binaryData, { type: "application/pdf" }));

        this._isProgressBarHidden = false;
        if (this._printPaySlisSubscription != null) this._printPaySlisSubscription.unsubscribe();
      },
      error => {
        this._isProgressBarHidden = false;

        this._snackBarTemplate.snackBarError(this._snackBar, error.error + " " + error.status);
        console.log(error);
        if (this._printPaySlisSubscription != null) this._printPaySlisSubscription.unsubscribe();
      }
    );
  }

  public Close(): void {
    this._dialogRef.close({ event: 'Close' });
  }

}
