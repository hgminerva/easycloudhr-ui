import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UserDetailService } from './../user-detail.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackBarTemplate } from '../../shared/snack-bar-template';
import { UserModuleModel } from '../user-module.model';

@Component({
  selector: 'app-user-detail-user-module-dialog',
  templateUrl: './user-detail-user-module-dialog.component.html',
  styleUrls: ['./user-detail-user-module-dialog.component.css']
})
export class UserDetailUserModuleDialogComponent implements OnInit {

  constructor(
    private userDetailService: UserDetailService,
    private snackBar: MatSnackBar,
    private snackBarTemplate: SnackBarTemplate,
    private userModuleDialogRef: MatDialogRef<UserDetailUserModuleDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public caseData: any
  ) { }

  public userModuleModel: UserModuleModel = {
    Id: 0,
    UserId: 0,
    ModuleId: 0,
    Module: '',
    CanOpen: true,
    CanAdd: true,
    CanEdit: true,
    CanLock: true,
    CanUnlock: true,
    CanDelete: true,
    CanPrint: true,
  }

  public buttonSaveDisabled: boolean = false;
  public buttonCloseDisabled: boolean = false;

  public title = 'User Module';
  public confirmationMessage = 'Delete this item?';

  private userModuleDropdownSubscription: any;
  public sysModuleListDropdown: any = [];

  private addUserModuleSubscription: any;
  private updateUserModuleSubscription: any;

  ngOnInit(): void {
    this.userModuleModel.Id = this.caseData.objUserModuleData.Id;
    this.userModuleModel.UserId = this.caseData.objUserId;
    this.userModuleModel.ModuleId = this.caseData.objUserModuleData.ModuleId;
    this.userModuleModel.CanOpen = this.caseData.objUserModuleData.CanOpen;
    this.userModuleModel.CanAdd = this.caseData.objUserModuleData.CanAdd;
    this.userModuleModel.CanEdit = this.caseData.objUserModuleData.CanEdit;
    this.userModuleModel.CanLock = this.caseData.objUserModuleData.CanLock;
    this.userModuleModel.CanUnlock = this.caseData.objUserModuleData.CanUnlock;
    this.userModuleModel.CanDelete = this.caseData.objUserModuleData.CanDelete;
    this.userModuleModel.CanPrint = this.caseData.objUserModuleData.CanPrint;
    this.title = this.caseData.objDialogTitle;
    this.GetUserModuleDropdownListData();
  }

  private async GetUserModuleDropdownListData() {
    this.userModuleDropdownSubscription = await (await this.userDetailService.SysModuleList()).subscribe(
      response => {
        this.sysModuleListDropdown = response;
        if (this.userModuleDropdownSubscription !== null) this.userModuleDropdownSubscription.unsubscribe();
      },
      error => {
        this.snackBarTemplate.snackBarError(this.snackBar, error.error.Message + " " + error.status);
        if (this.userModuleDropdownSubscription !== null) this.userModuleDropdownSubscription.unsubscribe();
      }
    );
  }

  public async SaveUserModule() {
    this.disableButton();
    if (this.title === "Add User Medule") {
      this.addUserModuleSubscription = await (await this.userDetailService.CreateUserModule(this.userModuleModel)).subscribe(
        response => {
          this.enableButton();
          this.CloseOnSaveUserModule();
          this.snackBarTemplate.snackBarSuccess(this.snackBar, "Save Successfully.");
          if (this.addUserModuleSubscription !== null) this.addUserModuleSubscription.unsubscribe();
        },
        error => {
          this.enableButton();
          this.snackBarTemplate.snackBarError(this.snackBar, error.error + " " + " Status Code: " + error.status);
          if (this.addUserModuleSubscription !== null) this.addUserModuleSubscription.unsubscribe();
        }
      );
    } else {
      this.updateUserModuleSubscription = await (await this.userDetailService.UpdateUserModule(this.userModuleModel.Id, this.userModuleModel)).subscribe(
        response => {
          this.enableButton();
          this.CloseOnSaveUserModule();
          this.snackBarTemplate.snackBarSuccess(this.snackBar, "Updated Successfully.");
          if (this.updateUserModuleSubscription !== null) this.updateUserModuleSubscription.unsubscribe();
        },
        error => {
          this.enableButton();
          this.snackBarTemplate.snackBarError(this.snackBar, error.error + " " + " Status Code: " + error.status);
          if (this.updateUserModuleSubscription !== null) this.updateUserModuleSubscription.unsubscribe();
        }
      );
    }
  }

  public Close(): void {
    this.userModuleDialogRef.close({ event: 'Close' });
  }

  public CloseOnSaveUserModule(): void {
    this.userModuleDialogRef.close({ event: 'Save' });
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
