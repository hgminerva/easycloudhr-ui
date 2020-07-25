import { Injectable } from '@angular/core';
import { AppSettings } from 'src/app/app-settings';
import { HttpClient } from '@angular/common/http';
import { UserModel } from './user.model';

@Injectable({
  providedIn: 'root'
})
export class UserDetailService {

  constructor(
    private appSettings: AppSettings,
    private httpClient: HttpClient
  ) { }

  public async RegisterUser(objUser: UserModel) {
    return this.httpClient.post(this.appSettings.defaultAPIURLHost + '/api/user/create/register', JSON.stringify(objUser), this.appSettings.defaultOptions);
  }

  public async UserDetail(id: number) {
    return this.httpClient.get(this.appSettings.defaultAPIURLHost + '/api/user/detail/' + id, this.appSettings.defaultOptions);
  }

  public async SaveUser(id: number, objUser: UserModel) {
    return this.httpClient.post(this.appSettings.defaultAPIURLHost + '/api/user/save/' + id, JSON.stringify(objUser), this.appSettings.defaultOptions);
  }

  public async LockUser(id: number, objUser: UserModel) {
    return this.httpClient.post(this.appSettings.defaultAPIURLHost + '/api/user/lock/' + id, JSON.stringify(objUser), this.appSettings.defaultOptions);
  }

  public async UnlockUser(id: number) {
    return this.httpClient.post(this.appSettings.defaultAPIURLHost + '/api/user/unlock/' + id, "", this.appSettings.defaultOptions);
  }
}
