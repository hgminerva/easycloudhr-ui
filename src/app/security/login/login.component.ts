import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from './login.service';
import { LoginModel } from './login.model';
import { AppSetting } from './../../app-settings';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(
    private loginService: LoginService,
    private router: Router,
    public appSettings: AppSetting,
    public snackBar: MatSnackBar
  ) { }

  public loginSubscribe: any;
  public loginModel: LoginModel = {
    UserName: "",
    Password: ""
  };
  public loginDisabled: boolean = false;

  public login(): void {
    this.loginDisabled = true;

    if (this.loginModel.UserName === "" || this.loginModel.Password === "") {

    } else {
      this.loginService.login(this.loginModel);
      this.loginSubscribe = this.loginService.loginObservable.subscribe(
        data => {
          if (data[0]) {
            this.appSettings.snackBarSuccess(this.snackBar, "Login Successful");

            setTimeout(() => {
              this.router.navigate(['/software']);
            }, 500);
          } else {
            this.appSettings.snackBarError(this.snackBar, data[1]);
            this.loginDisabled = false;
          }

          if (this.loginSubscribe != null) this.loginSubscribe.unsubscribe();
        }
      );
    }
  }

  ngOnInit(): void {

  }

  ngOnDestroy() {
    if (this.loginSubscribe != null) this.loginSubscribe.unsubscribe();
  }
}
