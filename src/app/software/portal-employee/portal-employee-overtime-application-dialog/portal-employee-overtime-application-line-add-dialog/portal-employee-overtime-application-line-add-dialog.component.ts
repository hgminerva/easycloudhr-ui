import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DecimalPipe, DatePipe } from '@angular/common';
import { SnackBarTemplate } from 'src/app/software/shared/snack-bar-template';

@Component({
  selector: 'app-portal-employee-overtime-application-line-add-dialog',
  templateUrl: './portal-employee-overtime-application-line-add-dialog.component.html',
  styleUrls: ['./portal-employee-overtime-application-line-add-dialog.component.css']
})
export class PortalEmployeeOvertimeApplicationLineAddDialogComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<PortalEmployeeOvertimeApplicationLineAddDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public caseData: any,
    private _snackBar: MatSnackBar,
    private _snackBarTemplate: SnackBarTemplate,
    public _matDialog: MatDialog,
    private decimalPipe: DecimalPipe,
    private datePipe: DatePipe
  ) { }

  public isComponentHidden: boolean = false;
  public title = '';

  public _overtimeApplicationLineModel: any = {
    Id: 0,
    OTId: 0,
    EmployeeId: 0,
    Employee: '',
    OTDate: this.datePipe.transform(new Date(), 'yyyy-MM-dd'),
    OTHours: '00.0',
    Remarks: ''
  }

  public inputTypeOTHours = 'text';
  public UIOTDate = new Date();

  ngOnInit(): void {
    this.title = this.caseData.objDialogTitle;
    this.loadOvertimeApplicationLineDetail();
  }

  private loadOvertimeApplicationLineDetail() {
    this._overtimeApplicationLineModel.OTId = this.caseData.objDataOTId;
    this._overtimeApplicationLineModel.EmployeeId = this.caseData.objDataEmployeeId;

    console.log(this._overtimeApplicationLineModel);
    setTimeout(() => {
      this.isComponentHidden = false;
    }, 100);
  }

  public GetUIDATEOTDate() {
    this._overtimeApplicationLineModel.OTDate = this.datePipe.transform(this.UIOTDate, 'yyyy-MM-dd');
    console.log(this._overtimeApplicationLineModel.OTDate);
  }

  public Close(): void {
    this.dialogRef.close({ event: 'Close' });
  }

  OTHoursFormatValue() {
    this.inputTypeOTHours = 'text';

    if (this._overtimeApplicationLineModel.OTHours == '') {
      this._overtimeApplicationLineModel.OTHours = this.decimalPipe.transform(0, "1.2-2");
    } else {
      this._overtimeApplicationLineModel.OTHours = this.decimalPipe.transform(this._overtimeApplicationLineModel.OTHours, "1.2-2");
    }
  }

  OTHoursToNumberType() {
    this._overtimeApplicationLineModel.OTHours = this.RemoveComma(this._overtimeApplicationLineModel.OTHours);
    this.inputTypeOTHours = 'number';
  }

  public async Save() {
    if (this._overtimeApplicationLineModel.EmployeeId != 0) {
      await this.dialogRef.close({ event: 'Save', data: this._overtimeApplicationLineModel });
    } else {
      this._snackBarTemplate.snackBarError(this._snackBar, "Choose employee!");
    }
  }

  public RemoveComma(value: string): string {
    return value.toString().replace(/,/g, '');
  }

}
