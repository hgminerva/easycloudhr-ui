import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DatePipe } from '@angular/common';
import { SnackBarTemplate } from 'src/app/software/shared/snack-bar-template';
import { PortalEmployeeService } from '../portal-employee.service';


@Component({
  selector: 'app-portal-employee-leave-application-dialog',
  templateUrl: './portal-employee-leave-application-dialog.component.html',
  styleUrls: ['./portal-employee-leave-application-dialog.component.css']
})
export class PortalEmployeeLeaveApplicationDialogComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<PortalEmployeeLeaveApplicationDialogComponent>,
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
    Remarks: 'NA'
  }

  private _leaveApplicationDropdownListSubscription: any;
  public leaveApplicationDropdownList: any;

  public UILADate = new Date();
  public title = '';
  public isComponentHidden: boolean = false;

  ngOnInit(): void {
    this.title = this.caseData.objDialogTitle;

    this.LeaveApplicationDropdownList();
  }

  private async LeaveApplicationDropdownList() {
    this._leaveApplicationDropdownListSubscription = await (await this._portalEmployeeService.LeaveApplicationDropdownList(this.caseData.objYearId)).subscribe(
      (result: any) => {
        this.leaveApplicationDropdownList = result;
        this._leaveApplicationLine.LAId = result[0].Id;
        if (this._leaveApplicationDropdownListSubscription !== null) this._leaveApplicationDropdownListSubscription.unsubscribe();
      },
      error => {
        this._snackBarTemplate.snackBarError(this._snackBar, error.error.Message + " " + error.status);
        if (this._leaveApplicationDropdownListSubscription !== null) this._leaveApplicationDropdownListSubscription.unsubscribe();
      }
    );

    this.loadLeaveApplicationLineDetail();

  }

  private loadLeaveApplicationLineDetail() {

    if (this.caseData.objData.Id != 0) {
      this._leaveApplicationLine.LAId = this.caseData.objData.LAId;
      this._leaveApplicationLine.Id = this.caseData.objData.Id;
      this._leaveApplicationLine.EmployeeId = this.caseData.objData.EmployeeId;
      this._leaveApplicationLine.Employee = this.caseData.objData.Employee;
      this._leaveApplicationLine.LADate = this.caseData.objData.LADate;
      this._leaveApplicationLine.IsHalfDay = this.caseData.objData.IsHalfDay;
      this._leaveApplicationLine.IsWithPay = this.caseData.objData.IsWithPay;
      this._leaveApplicationLine.Remarks = this.caseData.objData.Remarks;
    } else {
      this.UILADate = new Date(this.caseData.objData.LADate);
      this.UILADate = new Date();
    }

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
