import { Injectable } from '@angular/core';
import { AppSettings } from '../../../app/app-settings';
import { HttpClient, HttpHeaders } from '@angular/common/http';
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
    let url = this.appSettings.defaultAPIURLHost + '/Token';
    let body = "username=" + loginModel.UserName + "&password=" + loginModel.Password + "&grant_type=password";
    let options = this.appSettings.URLEncodedOptions;

    this.httpClient.post(url, body, options).subscribe(
      response => {
        localStorage.setItem('access_token', response["access_token"]);
        localStorage.setItem('expires_in', response["expires_in"]);
        localStorage.setItem('token_type', response["token_type"]);
        localStorage.setItem('username', response["userName"]);

        this.getUserRights(response["userName"]);

        this.loginSubject.next([true, "Login Successful."]);
      },
      error => {
        this.loginSubject.next([false, error.error["error_description"]]);
      }
    )
  }

  public async getUserRights(username: string) {

    let url = this.appSettings.defaultAPIURLHost;
    let options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + await localStorage.getItem('access_token')
      })
    };

    let userRights = new Array();

    await this.httpClient.get(url + "/api/user/module/user/rights/list/" + username, options).subscribe(
      response => {
        var results = response;
        if (results["length"] > 0) {
          for (var i = 0; i <= results["length"] - 1; i++) {
            userRights.push({
              Id: results[i].Id,
              UserId: results[i].UserId,
              ModuleId: results[i].ModuleId,
              Module: results[i].Module,
              CanAdd: results[i].CanAdd,
              CanEdit: results[i].CanEdit,
              CanDelete: results[i].CanDelete,
              CanLock: results[i].CanLock,
              CanUnlock: results[i].CanUnlock,
              CanCancel: results[i].CanCancel,
              CanPrint: results[i].CanPrint
            });
          }
          localStorage.setItem('userRights', JSON.stringify(userRights));
        }
      }
    );
  }
}
