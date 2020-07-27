import { Component, OnInit, Inject } from '@angular/core';
import { UserListService } from '../user-list.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackBarTemplate } from '../../shared/snack-bar-template';
import { Validators, FormBuilder } from '@angular/forms';
import { PasswordValidator } from './custom-validation';
import { from } from 'rxjs';
export interface UserModel {
  Id: number;
  UserName: string;
  Password: string;
  ConfirmPassword: string;
  FullName: string;
}

@Component({
  selector: 'app-user-registration-dialog',
  templateUrl: './user-registration-dialog.component.html',
  styleUrls: ['./user-registration-dialog.component.css']
})

export class UserRegistrationDialogComponent implements OnInit {

  constructor(private userListService: UserListService,
    private userRegistrationDialogRef: MatDialogRef<UserRegistrationDialogComponent>,
    private snackBar: MatSnackBar,
    private snackBarTemplate: SnackBarTemplate,
    private fb: FormBuilder
  ) { }

  public dialogTitle = "Register User"
  public newUserSubscription: any;
  
  public buttonDisable: boolean = false;
  public buttonCloseDisable: boolean = false;

  public userModel: UserModel = {
    Id: 0,
    FullName: '',
    UserName: '',
    Password: '',
    ConfirmPassword: '',
  }

  registrationForm = this.fb.group({
    FullName: ['', [Validators.required, Validators.minLength(5)]],
    UserName: ['', Validators.required],
    Password: ['', [Validators.required, Validators.minLength(5)]],
    ConfirmPassword: [''],
  }, { validator: PasswordValidator });

  ngOnInit(): void {
  }

  public async RegisterUser() {
    console.log(this.userModel)
    this.buttonDisable = false;
    this.buttonCloseDisable = true;

    this.newUserSubscription = await (await this.userListService.RegisterUser(this.userModel)).subscribe(
      response => {
        this.buttonDisable = true;
        this.snackBarTemplate.snackBarSuccess(this.snackBar, "Registered Successfully");
        this.userRegistrationDialogRef.close({ status: 200 });
      },
      error => {
        this.snackBarTemplate.snackBarError(this.snackBar, error.status);
        console.log(error);
        this.buttonDisable = true;
        this.buttonCloseDisable = false;

      }
    );
  }

  public CloseDialog() {
    this.userRegistrationDialogRef.close();
  }

  ValidateForm() {
    this.buttonDisable = this.registrationForm.valid;
    console.log(this.registrationForm.valid)
  }

}
