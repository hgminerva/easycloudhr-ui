import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UserDetailService } from './../user-detail.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackBarTemplate } from '../../shared/snack-bar-template';

export interface UserChangePassword {
  OldPassword: string;
  NewPassword: string;
  ConfirmPassword: string;
}
@Component({
  selector: 'app-user-detial-change-password',
  templateUrl: './user-detial-change-password.component.html',
  styleUrls: ['./user-detial-change-password.component.css']
})
export class UserDetialChangePasswordComponent implements OnInit {

  constructor(
    private userDetailService: UserDetailService,
    private snackBar: MatSnackBar,
    private snackBarTemplate: SnackBarTemplate,
    private matDialogRef: MatDialogRef<UserDetialChangePasswordComponent>,
    @Inject(MAT_DIALOG_DATA) public caseData: any
  ) { }

  public userChangePassword: UserChangePassword = {
    OldPassword: '',
    NewPassword: '',
    ConfirmPassword: ''
  }

  public title = '';
  public isDataLoaded: boolean = true;
  public buttonChangePasswordDisabled: boolean = false;
  public buttonCloseDisabled: boolean = false;
  public changePasswordSubscription: any;

  ngOnInit(): void {
    this.title = this.caseData.objDialogTitle;
  }

  public async ChangePassword() {
    this.disableButton();
    if (this.userChangePassword.NewPassword == this.userChangePassword.ConfirmPassword) {
      if (this.isDataLoaded == true) {
        this.isDataLoaded = false;
        this.changePasswordSubscription = await (await this.userDetailService.ChangePassword(this.caseData.objUserId, this.userChangePassword)).subscribe(
          response => {
            this.isDataLoaded = true;
            this.enableButton();
            this.CloseOnChangePassword();
            this.snackBarTemplate.snackBarSuccess(this.snackBar, "Change password Successfully.");
            if (this.changePasswordSubscription !== null) this.changePasswordSubscription.unsubscribe();
          },
          error => {
            this.isDataLoaded = true;
            this.enableButton();

            this.snackBarTemplate.snackBarError(this.snackBar, error.error + " " + " Status Code: " + error.status);
            if (this.changePasswordSubscription !== null) this.changePasswordSubscription.unsubscribe();
          }
        );
      }

    } else {
      this.snackBarTemplate.snackBarError(this.snackBar, "Password do not match!");
      this.enableButton();
    }


  }

  public Close(): void {
    this.matDialogRef.close({ event: 'Close' });
  }

  public CloseOnChangePassword(): void {
    this.matDialogRef.close({ event: 'Save' });
  }

  disableButton() {
    this.buttonChangePasswordDisabled = true;
    this.buttonCloseDisabled = true;
  }

  enableButton() {
    this.buttonChangePasswordDisabled = false;
    this.buttonCloseDisabled = false;
  }
}
