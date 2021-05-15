import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackBarTemplate } from '../../shared/snack-bar-template';
import { LeaveApplicationDetailService } from '../leave-application-detail.service';
import { LeaveApplicationLineModel } from '../leave-application-line.model';
import { EmployeeListPickDialogComponent } from './../../shared/employee-list-pick-dialog/employee-list-pick-dialog.component';
import { DatePipe } from '@angular/common';
import { SystemTablesListService } from '../../system-tables-list/system-tables-list.service'
@Component({
  selector: 'app-leave-application-line-detail',
  templateUrl: './leave-application-line-detail.component.html',
  styleUrls: ['./leave-application-line-detail.component.css']
})
export class LeaveApplicationLineDetailComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<LeaveApplicationLineDetailComponent>,
    private _leaveApplicationDetailService: LeaveApplicationDetailService,
    @Inject(MAT_DIALOG_DATA) public caseData: any,
    private _snackBar: MatSnackBar,
    private _snackBarTemplate: SnackBarTemplate,
    public _matDialog: MatDialog,
    private datePipe: DatePipe,
    public systemTablesListService: SystemTablesListService
  ) { }

  ngOnInit(): void {
    this.title = this.caseData.objDialogTitle;
    this.leaveTypeSelectionChange();
    this.loadLeaveApplicationLineDetail();
  }

  public _leaveApplicationLine: LeaveApplicationLineModel = {
    Id: 0,
    LAId: 0,
    EmployeeId: 0,
    Employee: '',
    LADate: this.datePipe.transform(new Date(), 'yyyy-MM-dd'),
    IsHalfDay: false,
    IsWithPay: false,
    IsApproved: false,
    LeaveType: '',
    Remarks: ''
  }

  public UILADate = new Date();
  public title = '';
  public isComponentHidden: boolean = false;

  private loadLeaveApplicationLineDetail() {
    this._leaveApplicationLine = this.caseData.objLeaveApplicationLine;
    this.UILADate = new Date(this.caseData.objLeaveApplicationLine.LADate);;

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
    if (this._leaveApplicationLine.EmployeeId != 0) {
      await this.dialogRef.close({ event: this.title, data: this._leaveApplicationLine });
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
        this._leaveApplicationLine.EmployeeId = data.employee.Id;
        this._leaveApplicationLine.Employee = data.employee.Value;
      }
    });
  }

  public leaveTypeListDropdown: any;
  public leaveTypeListDropdownSubscription: any;

  public async leaveTypeSelectionChange() {
    this.leaveTypeListDropdownSubscription = (await this.systemTablesListService.CodeTableList("LEAVE TYPE")).subscribe(
      (response: any) => {
        var results = response;
        if (results["length"] > 0) {
          this.leaveTypeListDropdown = results;
        }
      }
    );
  }
}
