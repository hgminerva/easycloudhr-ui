import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DatePipe } from '@angular/common';
import { SnackBarTemplate } from 'src/app/software/shared/snack-bar-template';
import { PortalEmployeeService } from '../portal-employee.service';
import { SoftwareSecurityService } from '../../software-security/software-security.service';


@Component({
  selector: 'app-portal-employee-leave-application-dialog',
  templateUrl: './portal-employee-leave-application-dialog.component.html',
  styleUrls: ['./portal-employee-leave-application-dialog.component.css']
})
export class PortalEmployeeLeaveApplicationDialogComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<PortalEmployeeLeaveApplicationDialogComponent>,
    private _portalEmployeeService: PortalEmployeeService,
    private softwareSecurityService: SoftwareSecurityService,
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
    IsApproved: false,
    Remarks: 'NA'
  }
  public isCompanyApprover: boolean = false;
  public isCompanyApproverSubscription: any;
  private _leaveApplicationDropdownListSubscription: any;
  public leaveApplicationDropdownList: any;

  public UILADate = new Date();
  public title = '';
  public isComponentHidden: boolean = false;
  public isDisabled: boolean = true;

  ngOnInit(): void {
    this.title = this.caseData.objDialogTitle;

    this.getCompanyApprover();
  }

  private async getCompanyApprover() {
    this.isCompanyApproverSubscription = await (await this.softwareSecurityService.CompanyApprover()).subscribe(
      (result: any) => {
        this.isCompanyApprover = result;
      }
    );

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
    console.log(this.caseData.objData.Id);
    this._leaveApplicationLine.Id = this.caseData.objData.Id;
    this._leaveApplicationLine.EmployeeId = this.caseData.objData.EmployeeId;
    this._leaveApplicationLine.LAId = this.caseData.objData.LAId;
    this._leaveApplicationLine.Employee = this.caseData.objData.Employee;
    this._leaveApplicationLine.LADate = this.caseData.objData.LADate;
    this._leaveApplicationLine.IsHalfDay = this.caseData.objData.IsHalfDay;
    this._leaveApplicationLine.IsWithPay = this.caseData.objData.IsWithPay;
    this._leaveApplicationLine.IsApproved = this.caseData.objData.IsApproved;
    this._leaveApplicationLine.Remarks = this.caseData.objData.Remarks;

    if (this.caseData.objData.Id == 0) {
      this.UILADate = new Date(this.caseData.objData.LADate);
    }

    setTimeout(() => {
      this.isComponentHidden = false;
    }, 100);

  }

  public GetUIDATELADate() {
    this._leaveApplicationLine.LADate = this.datePipe.transform(this.UILADate, 'yyyy-MM-dd');
    console.log(this._leaveApplicationLine.LADate);
  }

  public saveLeaveApplicationSubscription: any;

  public async SaveLeaveApplication() {

    console.log(this._leaveApplicationLine);

    if (this._leaveApplicationLine.Id == 0) {
      this.saveLeaveApplicationSubscription = (await this._portalEmployeeService.AddLeaveApplicationLine(this._leaveApplicationLine)).subscribe(
        response => {
          this.Save();
          if (this.saveLeaveApplicationSubscription !== null) this.saveLeaveApplicationSubscription.unsubscribe();
        },
        error => {
          this._snackBarTemplate.snackBarError(this._snackBar, error.error.Message + " " + error.status);
          if (this.saveLeaveApplicationSubscription !== null) this.saveLeaveApplicationSubscription.unsubscribe();
        }
      );
    }
    else {
      this.saveLeaveApplicationSubscription = (await this._portalEmployeeService.UpdateLeaveApplicationLine(this._leaveApplicationLine.Id, this._leaveApplicationLine)).subscribe(
        response => {
          this.Save();
          if (this.saveLeaveApplicationSubscription !== null) this.saveLeaveApplicationSubscription.unsubscribe();
        },
        error => {
          this._snackBarTemplate.snackBarError(this._snackBar, error.error.Message + " " + error.status);
          if (this.saveLeaveApplicationSubscription !== null) this.saveLeaveApplicationSubscription.unsubscribe();
        }
      );
    }
  }

  public Save() {
    this.dialogRef.close({ event: this.title, data: this._leaveApplicationLine });
  }

  public Close(): void {
    this.dialogRef.close({ event: 'Close' });
  }
}
