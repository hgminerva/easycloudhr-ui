import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackBarTemplate } from '../../shared/snack-bar-template';
import { PortalEmployeeService } from '../portal-employee.service';

@Component({
  selector: 'app-portal-employee-pdf-dialog',
  templateUrl: './portal-employee-pdf-dialog.component.html',
  styleUrls: ['./portal-employee-pdf-dialog.component.css']
})
export class PortalEmployeePdfDialogComponent implements OnInit {

  constructor(
    public _dialogRef: MatDialogRef<PortalEmployeePdfDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public caseData: any,
    private _snackBar: MatSnackBar,
    private _snackBarTemplate: SnackBarTemplate,
    private _portalEmployeeService: PortalEmployeeService,
  ) { }

  ngOnInit(): void {
    this.printCase();
  }

  public _printPaySlisSubscription: any;
  public pdfUrl: string = '';

  public _isProgressBarHidden: boolean = false;

  public async printCase() {
    this._printPaySlisSubscription = (await this._portalEmployeeService.Payslip(this.caseData.objDataEmployeeId, this.caseData.objDataPayrollLineId)).subscribe(
      data => {
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
