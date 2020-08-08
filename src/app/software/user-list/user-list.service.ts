import { Injectable } from '@angular/core';
import { AppSettings } from 'src/app/app-settings';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserListService {

  constructor(
    private appSettings: AppSettings,
    private httpClient: HttpClient
  ) { }

  public async UserList() {
    return this.httpClient.get(this.appSettings.defaultAPIURLHost + '/api/user/list', this.appSettings.defaultOptions);
  }

  public async RegisterUser(objUser: any) {
    return this.httpClient.post(this.appSettings.defaultAPIURLHost + '/api/user/register', JSON.stringify(objUser), this.appSettings.defaultOptions);
  }

  public async Test() {
    return this.httpClient.get(this.appSettings.defaultAPIURLHost + '/api/user/test', this.appSettings.defaultOptions);
  }
}
