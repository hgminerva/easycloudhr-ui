import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackBarTemplate } from '../../shared/snack-bar-template';

import { UserDetailService } from '../user-detail.service';
import { UserModel } from '../user.model'

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
    this.GetUserDetail();
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
  public isLocked: boolean = false;
  private userDetailSubscription: any;
  private saveUserDetailSubscription: any;
  private lockUserDetailSubscription: any;
  private unlockUserDetailSubscription: any;

  ngOnInit(): void {
  }

  private async GetUserDetail() {
    let id = 0;
    this.isProgressBarHidden = true;
    this.activatedRoute.params.subscribe(params => { id = params["id"]; });

    this.userDetailSubscription = await (await this.userDetailService.UserDetail(id)).subscribe(
      response => {
        let result = response;
        if (result != null) {
          this.userModel.Id = result["Id"];
          this.userModel.UserName = result["Username"];
          this.userModel.FullName = result["FullName"];
          this.userModel.Password = result["Password"];
          this.userModel.CreatedByUser = result["CreatedByUser"];
          this.userModel.CreatedDateTime = result["CreatedDateTime"];
          this.userModel.UpdatedByUser = result["UpdatedByUser"];
          this.userModel.UpdatedDateTime = result["UpdatedDateTime"];
          this.userModel.IsLocked = result["isLockeded"];
        }

        if (this.userModel.IsLocked == true) {
          this.isLocked = this.userModel.IsLocked;
        }
        this.isProgressBarHidden = false;
        this.isDataLoaded = true;
        if (this.userDetailSubscription !== null) this.userDetailSubscription.unsubscribe();
      },
      error => {
        this.snackBarTemplate.snackBarError(this.snackBar, error.error.Message + " " + error.status);
        if (this.userDetailSubscription !== null) this.userDetailSubscription.unsubscribe();
      }
    );
  }

  public async SaveUserDetail() {
    if (this.isDataLoaded == true) {
      this.isDataLoaded = false;
      this.saveUserDetailSubscription = await (await this.userDetailService.SaveUser(this.userModel.Id, this.userModel)).subscribe(
        response => {
          this.isDataLoaded = true;
          this.snackBarTemplate.snackBarSuccess(this.snackBar, "Save Successfully.");
          if (this.saveUserDetailSubscription !== null) this.saveUserDetailSubscription.unsubscribe();
        },
        error => {
          this.isDataLoaded = true;
          this.snackBarTemplate.snackBarError(this.snackBar, error.error.Message + " " + error.status);
          if (this.saveUserDetailSubscription !== null) this.saveUserDetailSubscription.unsubscribe();
        }
      );
    }
  }

  public async LockUserDetail() {
    if (this.isDataLoaded == true) {
      this.isDataLoaded = false;
      this.lockUserDetailSubscription = await (await this.userDetailService.LockUser(this.userModel.Id, this.userModel)).subscribe(
        response => {
          this.isLocked = true;
          this.isDataLoaded = true;
          this.snackBarTemplate.snackBarSuccess(this.snackBar, "Lock Successfully.");
          if (this.lockUserDetailSubscription !== null) this.lockUserDetailSubscription.unsubscribe();
        },
        error => {
          this.isDataLoaded = true;
          this.snackBarTemplate.snackBarError(this.snackBar, error.error.Message + " " + error.status);
          if (this.lockUserDetailSubscription !== null) this.lockUserDetailSubscription.unsubscribe();
        }
      );
    }

  }

  public async UnlockUserDetail() {
    if (this.isDataLoaded == true) {
      this.isDataLoaded = false;
      this.unlockUserDetailSubscription = await (await this.userDetailService.UnlockUser(this.userModel.Id)).subscribe(
        response => {
          this.isLocked = false;
          this.isDataLoaded = true;
          this.snackBarTemplate.snackBarSuccess(this.snackBar, "Unlock Successfully.");
          if (this.unlockUserDetailSubscription !== null) this.unlockUserDetailSubscription.unsubscribe();
        },
        error => {
          this.isDataLoaded = true;
          this.snackBarTemplate.snackBarError(this.snackBar, error.error.Message + " " + error.status);
          if (this.unlockUserDetailSubscription !== null) this.unlockUserDetailSubscription.unsubscribe();
        }
      );
    }
  }

  ngOnDestroy() {
  }
}
