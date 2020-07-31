import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UserDetailService } from './../user-detail.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackBarTemplate } from '../../shared/snack-bar-template';
import { UserPayrollGroupModel } from '../user-payroll-group.model'
@Component({
  selector: 'app-user-detail-user-payroll-group-dialog',
  templateUrl: './user-detail-user-payroll-group-dialog.component.html',
  styleUrls: ['./user-detail-user-payroll-group-dialog.component.css']
})
export class UserDetailUserPayrollGroupDialogComponent implements OnInit {

  constructor(
    private userDetailService: UserDetailService,
    private snackBar: MatSnackBar,
    private snackBarTemplate: SnackBarTemplate,
    private PayrollGroupDialogRef: MatDialogRef<UserDetailUserPayrollGroupDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public caseData: any
  ) { }

  public UserPayrollGroupModel: UserPayrollGroupModel = {
    Id: 0,
    UserId: 0,
    PayrollGroup: ''
  }

  public buttonSaveDisabled: boolean = false;
  public buttonCloseDisabled: boolean = false;

  public title = 'User Module';
  public confirmationMessage = 'Delete this item?';

  private payrollGroupDropdownSubscription: any;
  public payrollGroupListDropdown: any = [];

  private addUserPayrollGroupSubscription: any;
  private updateUserPayrollGroupSubscription: any;

  ngOnInit(): void {
    console.log(this.caseData.objUserPayrollGroupData);
    this.UserPayrollGroupModel.Id = this.caseData.objUserPayrollGroupData.Id;
    this.UserPayrollGroupModel.UserId = this.caseData.objUserId;
    this.UserPayrollGroupModel.PayrollGroup = this.caseData.objUserPayrollGroupData.PayrollGroup;

    this.title = this.caseData.objDialogTitle;
    this.GetPayrollGroupDropdownListData();
  }

  private async GetPayrollGroupDropdownListData() {
    this.payrollGroupDropdownSubscription = await (await this.userDetailService.PayrollGroupList()).subscribe(
      response => {
        this.payrollGroupListDropdown = response;
        if (this.payrollGroupDropdownSubscription !== null) this.payrollGroupDropdownSubscription.unsubscribe();
      },
      error => {
        this.snackBarTemplate.snackBarError(this.snackBar, error.error.Message + " " + error.status);
        if (this.payrollGroupDropdownSubscription !== null) this.payrollGroupDropdownSubscription.unsubscribe();
      }
    );
  }

  public async SavePayrollGroup() {
    this.disableButton();
    if (this.title === "Add User Payroll Group") {
      this.addUserPayrollGroupSubscription = await (await this.userDetailService.CreateUserPayrollGroup(this.UserPayrollGroupModel)).subscribe(
        response => {
          this.enableButton();
          this.CloseOnSavePayrollGroup();
          this.snackBarTemplate.snackBarSuccess(this.snackBar, "Save Successfully.");
          if (this.addUserPayrollGroupSubscription !== null) this.addUserPayrollGroupSubscription.unsubscribe();
        },
        error => {
          this.enableButton();
          this.snackBarTemplate.snackBarError(this.snackBar, error.error + " " + " Status Code: " + error.status);
          if (this.addUserPayrollGroupSubscription !== null) this.addUserPayrollGroupSubscription.unsubscribe();
        }
      );
    } else {
      this.updateUserPayrollGroupSubscription = await (await this.userDetailService.UpdateUserPayrollGroup(this.UserPayrollGroupModel.Id, this.UserPayrollGroupModel)).subscribe(
        response => {
          this.enableButton();
          this.CloseOnSavePayrollGroup();
          this.snackBarTemplate.snackBarSuccess(this.snackBar, "Updated Successfully.");
          if (this.updateUserPayrollGroupSubscription !== null) this.updateUserPayrollGroupSubscription.unsubscribe();
        },
        error => {
          this.enableButton();
          this.snackBarTemplate.snackBarError(this.snackBar, error.error + " " + " Status Code: " + error.status);
          if (this.updateUserPayrollGroupSubscription !== null) this.updateUserPayrollGroupSubscription.unsubscribe();
        }
      );
    }
  }

  public Close(): void {
    this.PayrollGroupDialogRef.close({ event: 'Close' });
  }

  public CloseOnSavePayrollGroup(): void {
    this.PayrollGroupDialogRef.close({ event: 'Save' });
  }

  disableButton() {
    this.buttonSaveDisabled = true;
    this.buttonCloseDisabled = true;
  }

  enableButton() {
    this.buttonSaveDisabled = false;
    this.buttonCloseDisabled = false;
  }

}
