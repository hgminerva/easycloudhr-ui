import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackBarTemplate } from '../../shared/snack-bar-template';
import { OvertimeApplicationDetailService } from '../overtime-application-detail.service';
import { OvertimeApplicationLineModel } from '../overtime-application-line.model';
import { EmployeeListPickDialogComponent } from './../../shared/employee-list-pick-dialog/employee-list-pick-dialog.component';
import { DecimalPipe, DatePipe } from '@angular/common';

@Component({
  selector: 'app-overtime-application-line-dialog',
  templateUrl: './overtime-application-line-dialog.component.html',
  styleUrls: ['./overtime-application-line-dialog.component.css']
})
export class OvertimeApplicationLineDialogComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<OvertimeApplicationLineDialogComponent>,
    private _overtimeApplicationDetailService: OvertimeApplicationDetailService,
    @Inject(MAT_DIALOG_DATA) public caseData: any,
    private _snackBar: MatSnackBar,
    private _snackBarTemplate: SnackBarTemplate,
    public _matDialog: MatDialog,
    private decimalPipe: DecimalPipe,
    private datePipe: DatePipe
  ) { }

  ngOnInit(): void {
    this.title = this.caseData.objDialogTitle;
    this.loadShiftLineDetail();
  }

  public _overtimeApplicationLineModel: OvertimeApplicationLineModel = {
    Id: 0,
    OTId: 0,
    EmployeeId: 0,
    Employee: '',
    OTDate: new Date(),
    OTHours: '',
    Remarks: ''
  }

  public title = '';
  public Employee = '';
  public inputTypeOTHours = 'text';

  public isComponentHidden: boolean = true;

  private loadShiftLineDetail() {
    this._overtimeApplicationLineModel.Id = this.caseData.objOvertimeApplicationLine.Id;
    this._overtimeApplicationLineModel.OTId = this.caseData.objOvertimeApplicationLine.OTId;
    this._overtimeApplicationLineModel.EmployeeId = this.caseData.objOvertimeApplicationLine.EmployeeId;
    this._overtimeApplicationLineModel.Employee = this.caseData.objOvertimeApplicationLine.Employee;
    this._overtimeApplicationLineModel.Remarks = this.caseData.objOvertimeApplicationLine.Remarks;
    this._overtimeApplicationLineModel.OTHours =  this.decimalPipe.transform(this.caseData.objOvertimeApplicationLine.OTHours, "1.2-2");
    this._overtimeApplicationLineModel.OTDate = new Date(this.caseData.objOvertimeApplicationLine.OTDate);

    if (this._overtimeApplicationLineModel.Id != 0) {
      this._overtimeApplicationLineModel.OTDate = new Date(this.caseData.objOvertimeApplicationLine.OTDate);
    }

    console.log(this._overtimeApplicationLineModel);
    setTimeout(() => {
      this.isComponentHidden = false;
    }, 100);
  }

  public Close(): void {
    this.dialogRef.close({ event: 'Close' });
  }

  public DateFormatedSelectedDate() {
    this._overtimeApplicationLineModel.OTDate = new Date(this.datePipe.transform( this._overtimeApplicationLineModel.OTDate, 'yyyy-MM-dd'));
  }

  public async Save() {
    this.DateFormatedSelectedDate();
    if (this._overtimeApplicationLineModel.EmployeeId != 0) {
      await this.dialogRef.close({ event: this.title, data: this._overtimeApplicationLineModel });
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
      console.log(data);
      if (data.event != "Close") {
        this._overtimeApplicationLineModel.EmployeeId = data.employee.Id;
        this._overtimeApplicationLineModel.Employee = data.employee.Value;
      }
    });
  }


  formatValueOTHours() {
    this.inputTypeOTHours= 'text';

    if (this._overtimeApplicationLineModel.OTHours == '') {
      this._overtimeApplicationLineModel.OTHours = this.decimalPipe.transform(0, "1.2-2");
    } else {
      this._overtimeApplicationLineModel.OTHours = this.decimalPipe.transform(this._overtimeApplicationLineModel.OTHours, "1.2-2");
    }
  }

  OTHoursToNumberType() {
    this.inputTypeOTHours= 'number';
  }


}
