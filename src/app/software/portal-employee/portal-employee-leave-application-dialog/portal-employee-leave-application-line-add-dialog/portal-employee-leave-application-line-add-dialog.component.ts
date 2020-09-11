import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DatePipe } from '@angular/common';
import { SnackBarTemplate } from 'src/app/software/shared/snack-bar-template';
import { PortalEmployeeService } from '../../portal-employee.service';

@Component({
  selector: 'app-portal-employee-leave-application-line-add-dialog',
  templateUrl: './portal-employee-leave-application-line-add-dialog.component.html',
  styleUrls: ['./portal-employee-leave-application-line-add-dialog.component.css']
})
export class PortalEmployeeLeaveApplicationLineAddDialogComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<PortalEmployeeLeaveApplicationLineAddDialogComponent>,
    private _portalEmployeeService: PortalEmployeeService,
    @Inject(MAT_DIALOG_DATA) public caseData: any,
    private _snackBar: MatSnackBar,
    private _snackBarTemplate: SnackBarTemplate,
    public _matDialog: MatDialog,
    private datePipe: DatePipe
  ) { }


  public _leaveApplicationLine: any = {
    Id: 0,
    LAId: 0,
    EmployeeId: 0,
    Employee: '',
    LADate: this.datePipe.transform(new Date(), 'yyyy-MM-dd'),
    IsHalfDay: false,
    IsWithPay: false,
    Remarks: ''
  }

  public UILADate = new Date();
  public title = '';
  public isComponentHidden: boolean = false;

  ngOnInit(): void {
    this.title = this.caseData.objDialogTitle;
    this._leaveApplicationLine.LAId = this.caseData.objDataLAId;
    this._leaveApplicationLine.EmployeeId = this.caseData.objDataEmployeeId;
    this.loadLeaveApplicationLineDetail();
  }

  private loadLeaveApplicationLineDetail() {
    console.log(this._leaveApplicationLine);
    setTimeout(() => {
      this.isComponentHidden = false;
    }, 100);
  }

  public Close(): void {
    this.dialogRef.close({ event: 'Close' });
  }

  public GetUIDATELADate() {
    this._leaveApplicationLine.LADate = this.datePipe.transform(this.UILADate, 'yyyy-MM-dd');
    console.log(this._leaveApplicationLine.LADate);
  }

  public async Save() {
    await this.dialogRef.close({ event: this.title, data: this._leaveApplicationLine });
  }
}
