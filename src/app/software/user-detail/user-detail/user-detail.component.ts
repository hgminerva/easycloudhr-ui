import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackBarTemplate } from '../../shared/snack-bar-template';
import { CollectionView, ObservableArray } from '@grapecity/wijmo';
import * as wjcGrid from '@grapecity/wijmo.grid';

import { UserDetailService } from '../user-detail.service';
import { UserModel } from '../user.model'
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { DeleteDialogBoxComponent } from '../../shared/delete-dialog-box/delete-dialog-box.component';
import { UserDetailUserModuleDialogComponent } from '../user-detail-user-module-dialog/user-detail-user-module-dialog.component';
import { UserModuleModel } from '../user-module.model';
import { UserPayrollGroupModel } from '../user-payroll-group.model';
import { UserDetailUserPayrollGroupDialogComponent } from '../user-detail-user-payroll-group-dialog/user-detail-user-payroll-group-dialog.component';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.css']
})
export class UserDetailComponent implements OnInit {

  constructor(
    private activatedRoute: ActivatedRoute,
    private snackBar: MatSnackBar,
    private snackBarTemplate: SnackBarTemplate,
    private userDetailService: UserDetailService,
    public DeleteConfirmDialog: MatDialog,
  ) {
  }

  public userModel: UserModel = {
    Id: 0,
    UserName: "",
    Password: "",
    ConfirmPassword: "",
    FullName: "",
    CreatedByUserId: 0,
    CreatedByUser: "",
    CreatedDateTime: new Date(),
    UpdatedByUserId: 0,
    UpdatedByUser: "",
    UpdatedDateTime: new Date(),
    IsLocked: false
  }

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
    CanPrint: true
  }

  public userPayrollGroupModel: UserPayrollGroupModel = {
    Id: 0,
    UserId: 0,
    PayrollGroup: ''
  }

  public isDataLoaded: boolean = false;
  public isProgressBarHidden: boolean = false;
  public isUserDetailLoaded: boolean = false;

  private userDetailSubscription: any;
  private saveUserDetailSubscription: any;
  private lockUserDetailSubscription: any;
  private unlockUserDetailSubscription: any;

  public btnSaveDisabled: boolean = true;
  public btnLockisabled: boolean = true;
  public btnUnlockDisabled: boolean = true;

  public isLocked: boolean = false;;

  @ViewChild('tabGroup') tabGroup;

  async ngOnInit() {
    await this.GetUserDetail();
  }

  private async GetUserDetail() {
    if (this.isUserDetailLoaded == false) {
      this.disableButtons();
    }
    let id = 0;
    this.activatedRoute.params.subscribe(params => { id = params["id"]; });

    this.userDetailSubscription = await (await this.userDetailService.UserDetail(id)).subscribe(
      response => {
        let result = response;
        console.log(result);
        if (result != null) {
          this.userModel.Id = result["Id"];
          this.userModel.UserName = result["Username"];
          this.userModel.FullName = result["FullName"];
          this.userModel.Password = result["Password"];
          this.userModel.CreatedByUser = result["CreatedByUser"];
          this.userModel.CreatedDateTime = result["CreatedDateTime"];
          this.userModel.UpdatedByUser = result["UpdatedByUser"];
          this.userModel.UpdatedDateTime = result["UpdatedDateTime"];
          this.userModel.IsLocked = result["IsLocked"];
        }

        if (this.isUserDetailLoaded == false) {
          this.GetUserModuleListData();
          this.isUserDetailLoaded = true;
          this.loadComponent(result["IsLocked"]);
        }


        this.isDataLoaded = true;
        if (this.userDetailSubscription !== null) this.userDetailSubscription.unsubscribe();
      },
      error => {
        this.snackBarTemplate.snackBarError(this.snackBar, error.error + " " + " Status Code: " + error.status);
        if (this.userDetailSubscription !== null) this.userDetailSubscription.unsubscribe();
      }
    );
  }

  public async SaveUserDetail() {
    this.disableButtons();
    if (this.isDataLoaded == true) {
      this.isDataLoaded = false;
      this.saveUserDetailSubscription = await (await this.userDetailService.SaveUser(this.userModel.Id, this.userModel)).subscribe(
        response => {
          this.isDataLoaded = true;
          this.GetUserDetail();
          this.loadComponent(this.userModel.IsLocked);
          this.snackBarTemplate.snackBarSuccess(this.snackBar, "Save Successfully.");
          if (this.saveUserDetailSubscription !== null) this.saveUserDetailSubscription.unsubscribe();
        },
        error => {
          this.loadComponent(this.userModel.IsLocked);
          this.btnUnlockDisabled = true;
          this.snackBarTemplate.snackBarError(this.snackBar, error.error + " " + " Status Code: " + error.status);
          if (this.saveUserDetailSubscription !== null) this.saveUserDetailSubscription.unsubscribe();
        }
      );
    }
  }

  public async LockUserDetail() {
    this.disableButtons();
    if (this.isDataLoaded == true) {
      this.isDataLoaded = false;
      this.lockUserDetailSubscription = await (await this.userDetailService.LockUser(this.userModel.Id, this.userModel)).subscribe(
        response => {
          this.loadComponent(true);
          this.GetUserDetail();
          this.isDataLoaded = true;
          this.snackBarTemplate.snackBarSuccess(this.snackBar, "Lock Successfully.");
          if (this.lockUserDetailSubscription !== null) this.lockUserDetailSubscription.unsubscribe();
        },
        error => {
          this.isDataLoaded = true;
          this.loadComponent(false);
          this.snackBarTemplate.snackBarError(this.snackBar, error.error + " " + " Status Code: " + error.status);
          if (this.lockUserDetailSubscription !== null) this.lockUserDetailSubscription.unsubscribe();
        }
      );
    }
  }

  public async UnlockUserDetail() {
    this.disableButtons();
    if (this.isDataLoaded == true) {
      this.isDataLoaded = false;
      this.unlockUserDetailSubscription = await (await this.userDetailService.UnlockUser(this.userModel.Id)).subscribe(
        response => {
          this.loadComponent(false);
          this.GetUserDetail();
          this.isDataLoaded = true;
          this.snackBarTemplate.snackBarSuccess(this.snackBar, "Unlock Successfully.");
          if (this.unlockUserDetailSubscription !== null) this.unlockUserDetailSubscription.unsubscribe();
        },
        error => {
          this.loadComponent(true);
          this.isDataLoaded = true;
          this.snackBarTemplate.snackBarError(this.snackBar, error.error + " " + " Status Code: " + error.status);
          if (this.unlockUserDetailSubscription !== null) this.unlockUserDetailSubscription.unsubscribe();
        }
      );
    }
  }

  ngOnDestroy() {
  }

  // ==================
  // Component Behavior
  // ==================
  passwordField: FormGroup = new FormGroup({
    password: new FormControl('')
  });

  public hide: boolean = true;
  get passwordInput() { return this.passwordField.get('password'); }

  private loadComponent(isDisable) {
    if (isDisable == true) {
      this.btnSaveDisabled = isDisable;
      this.btnLockisabled = isDisable;
      this.btnUnlockDisabled = !isDisable;
    } else {
      this.btnSaveDisabled = isDisable;
      this.btnLockisabled = isDisable;
      this.btnUnlockDisabled = !isDisable;
    }

    this.isLocked = isDisable;
    this.isProgressBarHidden = false;
  }

  private disableButtons() {
    this.btnSaveDisabled = true;
    this.btnLockisabled = true;
    this.btnUnlockDisabled = true;
    this.isProgressBarHidden = true;
  }

  async activeTab() {
  }

  // ===========
  // User Module
  // ===========
  public listUserModuleObservableArray: ObservableArray = new ObservableArray();
  public listUserModuleCollectionView: CollectionView = new CollectionView(this.listUserModuleObservableArray);
  public listUserModulePageIndex: number = 15;
  @ViewChild('flexUserModule') flexUserModule: wjcGrid.FlexGrid;
  public isUserModuleProgressBarHidden = false;
  public isDataLoaded: boolean = false;

  private userModuleListSubscription: any;
  private deleteUserModuleubscription: any;

  public buttonDisabled: boolean = false;

  private async GetUserModuleListData() {
    this.listUserModuleObservableArray = new ObservableArray();
    this.listUserModuleCollectionView = new CollectionView(this.listUserModuleObservableArray);
    this.listUserModuleCollectionView.pageSize = 15;
    this.listUserModuleCollectionView.trackChanges = true;
    await this.listUserModuleCollectionView.refresh();
    await this.flexUserModule.refresh();

    this.isUserModuleProgressBarHidden = true;
    this.userModuleListSubscription = await (await this.userDetailService.UserModuleList(this.userModel.Id)).subscribe(
      (response: any) => {
        var results = response;
        if (results["length"] > 0) {
          this.listUserModuleCollectionView = results;
          this.listUserModuleCollectionView = new CollectionView(this.listUserModuleCollectionView);
          this.listUserModuleCollectionView.pageSize = 15;
          this.listUserModuleCollectionView.trackChanges = true;
          this.listUserModuleCollectionView.refresh();
          this.flexUserModule.refresh();
        }

        this.isDataLoaded = true;
        this.isUserModuleProgressBarHidden = false;
        this.GetUserPayrollGroupListData();
        if (this.userModuleListSubscription != null) this.userModuleListSubscription.unsubscribe();
      },
      error => {
        this.isUserModuleProgressBarHidden = false;
        this.snackBarTemplate.snackBarError(this.snackBar, error.error.Message + " " + error.status);
        if (this.userModuleListSubscription !== null) this.userModuleListSubscription.unsubscribe();
      }
    );
  }

  public async DeleteUserModule() {
    if (this.isDataLoaded == true) {
      this.isDataLoaded = false;
      let currentUserModule = this.listUserModuleCollectionView.currentItem;
      this.isUserModuleProgressBarHidden = true;

      this.deleteUserModuleubscription = await (await this.userDetailService.DeleteUserModule(currentUserModule.Id, this.userModel.Id)).subscribe(
        response => {
          this.snackBarTemplate.snackBarSuccess(this.snackBar, "Delete Successfully");
          this.GetUserModuleListData();
          this.GetUserDetail();
          this.isUserModuleProgressBarHidden = false;
          this.isDataLoaded = true;
        },
        error => {
          this.isDataLoaded = true;
          this.isUserModuleProgressBarHidden = false;
          this.snackBarTemplate.snackBarError(this.snackBar, error.error + " " + error.status);
          if (this.deleteUserModuleubscription != null) this.deleteUserModuleubscription.unsubscribe();
        }
      );
    }
  }

  public async EditUserModule() {
    let currentUserModule = this.listUserModuleCollectionView.currentItem;
    this.UserModuleDetailDailog(currentUserModule, "Edit User Module");
  }

  public UserModuleDetailDailog(objUserModule: any, dialogHeader: string): void {
    const userRegistrationlDialogRef = this.DeleteConfirmDialog.open(UserDetailUserModuleDialogComponent, {
      width: '500px',
      height: '350px',
      data: {
        objDialogTitle: dialogHeader,
        objUserModuleData: objUserModule,
        objUserId: this.userModel.Id
      },
      disableClose: true
    });

    userRegistrationlDialogRef.afterClosed().subscribe(result => {
      if (result.event == "Save") {
        this.GetUserModuleListData();
        this.GetUserDetail();
      }
    });
  }

  public ComfirmDeleteUserModule(): void {
    let currentUserModule = this.listUserModuleCollectionView.currentItem;

    const userRegistrationlDialogRef = this.DeleteConfirmDialog.open(DeleteDialogBoxComponent, {
      width: '500px',
      data: {
        objDialogTitle: "Delete User Right",
        objComfirmationMessage: `Delete this ${currentUserModule.Module}?`,
      },
      disableClose: true
    });
    userRegistrationlDialogRef.afterClosed().subscribe(result => {
      if (result.message == "Yes") {
        this.DeleteUserModule();
      }
    });
  }

  // ===========
  // User Payroll
  // ===========
  public listUserPayrollGroupObservableArray: ObservableArray = new ObservableArray();
  public listUserPayrollGroupCollectionView: CollectionView = new CollectionView(this.listUserPayrollGroupObservableArray);
  public listUserPayrollGroupPageIndex: number = 15;
  @ViewChild('flexUserPayrollGroup') flexUserPayrollGroup: wjcGrid.FlexGrid;
  public isUserPayrollGroupProgressBarHidden = false;
  public isDataLoaded: boolean = false;

  private UserPayrollGroupListSubscription: any;
  private deleteUserPayrollGroupubscription: any;

  public buttonDisabled: boolean = false;

  private async GetUserPayrollGroupListData() {
    this.listUserPayrollGroupObservableArray = new ObservableArray();
    this.listUserPayrollGroupCollectionView = new CollectionView(this.listUserPayrollGroupObservableArray);
    this.listUserPayrollGroupCollectionView.pageSize = 15;
    this.listUserPayrollGroupCollectionView.trackChanges = true;
    await this.listUserPayrollGroupCollectionView.refresh();
    await this.flexUserPayrollGroup.refresh();

    this.isUserPayrollGroupProgressBarHidden = true;
    this.UserPayrollGroupListSubscription = await (await this.userDetailService.UserPayrollGroupList(this.userModel.Id)).subscribe(
      (response: any) => {
        var results = response;
        if (results["length"] > 0) {
          this.listUserPayrollGroupCollectionView = results;
          this.listUserPayrollGroupCollectionView = new CollectionView(this.listUserPayrollGroupCollectionView);
          this.listUserPayrollGroupCollectionView.pageSize = 15;
          this.listUserPayrollGroupCollectionView.trackChanges = true;
          this.listUserPayrollGroupCollectionView.refresh();
          this.flexUserPayrollGroup.refresh();
        }

        this.isDataLoaded = true;
        this.isUserPayrollGroupProgressBarHidden = false;
        if (this.UserPayrollGroupListSubscription != null) this.UserPayrollGroupListSubscription.unsubscribe();
      },
      error => {
        this.isUserPayrollGroupProgressBarHidden = false;
        this.snackBarTemplate.snackBarError(this.snackBar, error.error.Message + " " + error.status);
        if (this.UserPayrollGroupListSubscription !== null) this.UserPayrollGroupListSubscription.unsubscribe();
      }
    );
  }

  public async DeleteUserPayrollGroup() {
    if (this.isDataLoaded == true) {
      this.isDataLoaded = false;
      let currentUserPayrollGroup = this.listUserPayrollGroupCollectionView.currentItem;
      this.isUserPayrollGroupProgressBarHidden = true;

      this.deleteUserPayrollGroupubscription = await (await this.userDetailService.DeleteUserPayrollGroup(currentUserPayrollGroup.Id, this.userModel.Id)).subscribe(
        response => {
          this.snackBarTemplate.snackBarSuccess(this.snackBar, "Delete Successfully");
          this.GetUserPayrollGroupListData();
          this.GetUserDetail();
          this.isUserPayrollGroupProgressBarHidden = false;
          this.isDataLoaded = true;
        },
        error => {
          this.isDataLoaded = true;
          this.isUserPayrollGroupProgressBarHidden = false;
          this.snackBarTemplate.snackBarError(this.snackBar, error.error + " " + error.status);
          if (this.deleteUserPayrollGroupubscription != null) this.deleteUserPayrollGroupubscription.unsubscribe();
        }
      );
    }
  }

  public async EditUserPayrollGroup() {
    let currentUserPayrollGroup = this.listUserPayrollGroupCollectionView.currentItem;
    this.UserPayrollGroupDetailDailog(currentUserPayrollGroup, "Payroll Group");
  }

  public UserPayrollGroupDetailDailog(objUserPayrollGroup: any, dialogHeader: string): void {
    const userRegistrationlDialogRef = this.DeleteConfirmDialog.open(UserDetailUserPayrollGroupDialogComponent, {
      width: '500px',
      height: '250px',
      data: {
        objDialogTitle: dialogHeader,
        objUserPayrollGroupData: objUserPayrollGroup,
        objUserId: this.userModel.Id
      },
      disableClose: true
    });

    userRegistrationlDialogRef.afterClosed().subscribe(result => {
      if (result.event == "Save") {
        this.GetUserPayrollGroupListData();
      }
    });
  }

  public ComfirmDeleteUserPayrollGroup(): void {
    let currentUserPayrollGroup = this.listUserPayrollGroupCollectionView.currentItem;
    const userRegistrationlDialogRef = this.DeleteConfirmDialog.open(DeleteDialogBoxComponent, {
      width: '500px',
      data: {
        objDialogTitle: "Delete Payroll Group",
        objComfirmationMessage: `Delete this ${currentUserPayrollGroup.PayrollGroup}?`,
      },
      disableClose: true
    });
    userRegistrationlDialogRef.afterClosed().subscribe(result => {
      if (result.message == "Yes") {
        this.DeleteUserPayrollGroup();
        this.GetUserDetail();
      }
    });
  }

  // ==================
  // User Payroll Group
  // ==================
  public UserPayrollGroupDailog(objUserPayrollGroup: any, dialogHeader: string): void {
    const userRegistrationlDialogRef = this.DeleteConfirmDialog.open(UserDetailUserPayrollGroupDialogComponent, {
      width: '500px',
      data: {
        objDialogTitle: dialogHeader,
        objUserPayrollGroupData: objUserPayrollGroup,
        objUserId: this.userModel.Id
      },
      disableClose: true
    });

    userRegistrationlDialogRef.afterClosed().subscribe(result => {
      if (result.event == "Save") {
        this.snackBarTemplate.snackBarSuccess(this.snackBar, "Save Successfully");
        this.GetUserPayrollGroupListData();
      }
    });
  }


  public async AddUserTable() {
    if (this.tabGroup.selectedIndex == 0) {
      this.UserModuleDetailDailog(this.userModuleModel, "Add User Module");
    } else {
      this.UserPayrollGroupDetailDailog(this.userPayrollGroupModel, "Add Payroll Group");
    }
  }
}
