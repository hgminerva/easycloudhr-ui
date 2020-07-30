import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackBarTemplate } from '../../shared/snack-bar-template';

import { UserDetailService } from '../user-detail.service';
import { UserModel } from '../user.model'
import { FormGroup, FormControl, Validators } from '@angular/forms';

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

  public isDataLoaded: boolean = false;
  public isProgressBarHidden: boolean = false;


  private userDetailSubscription: any;
  private saveUserDetailSubscription: any;
  private lockUserDetailSubscription: any;
  private unlockUserDetailSubscription: any;

  public btnSaveDisabled: boolean = true;
  public btnLockisabled: boolean = true;
  public btnUnlockDisabled: boolean = true;

  public isLocked: boolean = false;;


  async ngOnInit() {
    await this.GetUserDetail();
  }

  private async GetUserDetail() {
    this.disableButtons();
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
          console.log(result["IsLocked"]);
        }

        this.loadComponent(result["IsLocked"]);
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

  public async passwordIconClick() {
    if (!this.isLocked) {
      this.hide = await !this.hide;
    }
  }

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
}
