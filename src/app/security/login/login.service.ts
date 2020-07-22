import { Injectable } from '@angular/core';
import { AppSettings } from '../../../app/app-settings';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { LoginModel } from './login.model';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(
    private appSettings: AppSettings,
    private httpClient: HttpClient
  ) { }

  public loginSubject = new Subject<[boolean, string]>();
  public loginObservable = this.loginSubject.asObservable();

  public login(loginModel: LoginModel): void {
    let url = this.appSettings.defaultAPIURLHost + '/token';
    let body = "username=" + loginModel.UserName + "&password=" + loginModel.Password + "&grant_type=password";
    let options = this.appSettings.URLEncodedOptions;

    this.httpClient.post(url, body, options).subscribe(
      response => {
        localStorage.setItem('access_token', response["access_token"]);
        localStorage.setItem('expires_in', response["expires_in"]);
        localStorage.setItem('token_type', response["token_type"]);
        localStorage.setItem('username', response["userName"]);

        this.loginSubject.next([true, "Login Successful."]);
      },
      error => {
        this.loginSubject.next([false, error.message]);
      }
    )
  }
}
