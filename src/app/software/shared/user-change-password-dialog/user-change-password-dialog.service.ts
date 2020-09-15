import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppSettings } from 'src/app/app-settings';
import { UserChangePassword } from './user-change-password-dialog.component';

@Injectable({
  providedIn: 'root'
})
export class UserChangePasswordDialogService {

  constructor(
    private appSettings: AppSettings,
    private httpClient: HttpClient
  ) { }

  public async ChangePassword(id: number, objUserChangePassword: UserChangePassword) {
    return this.httpClient.put(this.appSettings.defaultAPIURLHost + '/api/user/change/password/' + id, JSON.stringify(objUserChangePassword), this.appSettings.defaultOptions);
  }

  public async EmployeeChangePassword(id: number, objUserChangePassword: UserChangePassword) {
    return this.httpClient.put(this.appSettings.defaultAPIURLHost + '/api/user/employee/change/password', JSON.stringify(objUserChangePassword), this.appSettings.defaultOptions);
  }
}
