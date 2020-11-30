import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DecimalPipe, DatePipe } from '@angular/common';
import { SnackBarTemplate } from 'src/app/software/shared/snack-bar-template';
import { PortalEmployeeService } from '../portal-employee.service';
import { SoftwareSecurityService } from '../../software-security/software-security.service';

@Component({
  selector: 'app-portal-employee-overtime-application-dialog',
  templateUrl: './portal-employee-overtime-application-dialog.component.html',
  styleUrls: ['./portal-employee-overtime-application-dialog.component.css']
})
export class PortalEmployeeOvertimeApplicationDialogComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<PortalEmployeeOvertimeApplicationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public caseData: any,
    private _portalEmployeeService: PortalEmployeeService,
    private softwareSecurityService: SoftwareSecurityService,
    private _snackBar: MatSnackBar,
    private _snackBarTemplate: SnackBarTemplate,
    public _matDialog: MatDialog,
    private decimalPipe: DecimalPipe,
    private datePipe: DatePipe
  ) { }

  public isCompanyApprover: boolean = false;
  public isCompanyApproverSubscription: any;
  public isComponentHidden: boolean = false;
  public title = '';

  public _overtimeApplicationDropdownListSubscription: any;
  public _overtimeApplicationDropdownList: any;
  public isDisabled: boolean = true;

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
    this._overtimeApplicationDropdownListSubscription = await (await this._portalEmployeeService.OvertimeApplicationDropdownList(this.caseData.objYearId)).subscribe(
      (result: any) => {
        this._overtimeApplicationDropdownList = result;
        this._overtimeApplicationLineModel.OTId = result[0].Id;
        if (this._overtimeApplicationDropdownListSubscription !== null) this._overtimeApplicationDropdownListSubscription.unsubscribe();
      },
      error => {
        this._snackBarTemplate.snackBarError(this._snackBar, error.error.Message + " " + error.status);
        if (this._overtimeApplicationDropdownListSubscription !== null) this._overtimeApplicationDropdownListSubscription.unsubscribe();
      }
    );

    this.loadOvertimeApplicationLineDetail();
  }

  private loadOvertimeApplicationLineDetail() {

    this._overtimeApplicationLineModel.Id = this.caseData.objData.Id;
    this._overtimeApplicationLineModel.OTId = this.caseData.objData.OTId;
    this._overtimeApplicationLineModel.EmployeeId = this.caseData.objData.EmployeeId;
    this._overtimeApplicationLineModel.OTDate = this.caseData.objData.OTDate;
    this._overtimeApplicationLineModel.OTHours = this.decimalPipe.transform(this.caseData.objData.OTHours, "1.2-2");
    this._overtimeApplicationLineModel.Remarks = this.caseData.objData.Remarks;

    if (this._overtimeApplicationLineModel.Id != 0) {
      this.UIOTDate = new Date(this.caseData.objData.OTDate);
    }

    console.log(this.caseData.objData.OTDate);

    setTimeout(() => {
      this.isComponentHidden = false;
    }, 300);
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

  public saveLeaveApplicationSubscription: any;

  public async SaveOvertimeApplication() {

    if (this._overtimeApplicationLineModel.Id == 0) {
      this.saveLeaveApplicationSubscription = (await this._portalEmployeeService.AddOvertimeApplicationLine(this._overtimeApplicationLineModel)).subscribe(
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
      this.saveLeaveApplicationSubscription = (await this._portalEmployeeService.UpdateOvertimeApplicationLine(this._overtimeApplicationLineModel.Id, this._overtimeApplicationLineModel)).subscribe(
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
}
