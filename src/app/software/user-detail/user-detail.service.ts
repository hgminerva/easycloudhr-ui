import { Injectable } from '@angular/core';
import { AppSettings } from 'src/app/app-settings';
import { HttpClient } from '@angular/common/http';
import { UserModel } from './user.model';
import { UserModuleModel } from './user-module.model';
import { UserPayrollGroupModel } from './user-payroll-group.model'

@Injectable({
  providedIn: 'root'
})
export class UserDetailService {
  constructor(
    private appSettings: AppSettings,
    private httpClient: HttpClient
  ) { }

  // ====
  // User
  // ====
  public async UserDetail(id: number) {
    return this.httpClient.get(this.appSettings.defaultAPIURLHost + '/api/user/detail/' + id, this.appSettings.defaultOptions);
  }

  public async SaveUser(id: number, objUser: UserModel) {
    return this.httpClient.put(this.appSettings.defaultAPIURLHost + '/api/user/save/' + id, JSON.stringify(objUser), this.appSettings.defaultOptions);
  }

  public async LockUser(id: number, objUser: UserModel) {
    return this.httpClient.put(this.appSettings.defaultAPIURLHost + '/api/user/lock/' + id, JSON.stringify(objUser), this.appSettings.defaultOptions);
  }

  public async UnlockUser(id: number) {
    return this.httpClient.put(this.appSettings.defaultAPIURLHost + '/api/user/unlock/' + id, "", this.appSettings.defaultOptions);
  }

  // ===========
  // User Module
  // ===========
  public async UserModuleList(id: number) {
    return this.httpClient.get(this.appSettings.defaultAPIURLHost + '/api/user/module/list/' + id, this.appSettings.defaultOptions);
  }

  public async SysModuleList() {
    return this.httpClient.get(this.appSettings.defaultAPIURLHost + '/api/user/module/sys/module/list', this.appSettings.defaultOptions);
  }

  public async UserModuleDetial(id: number) {
    return this.httpClient.get(this.appSettings.defaultAPIURLHost + '/api/user/module/detail/' + id, this.appSettings.defaultOptions);
  }

  public async CreateUserModule(objUserModule: UserModuleModel) {
    return this.httpClient.post(this.appSettings.defaultAPIURLHost + '/api/user/module/create', JSON.stringify(objUserModule), this.appSettings.defaultOptions);
  }

  public async UpdateUserModule(id: number, objUserModule: UserModuleModel) {
    return this.httpClient.put(this.appSettings.defaultAPIURLHost + '/api/user/module/update/' + id, JSON.stringify(objUserModule), this.appSettings.defaultOptions);
  }

  public async DeleteUserModule(id: number, userId: number) {
    return this.httpClient.delete(this.appSettings.defaultAPIURLHost + '/api/user/module/delete/' + id + '/' + userId, this.appSettings.defaultOptions);
  }

  // ============
  // User Payroll
  // ============
  public async UserPayrollGroupList(id: number) {
    return this.httpClient.get(this.appSettings.defaultAPIURLHost + '/api/user/payroll/group/list/' + id, this.appSettings.defaultOptions);
  }

  public async PayrollGroupList() {
    return this.httpClient.get(this.appSettings.defaultAPIURLHost + '/api/user/payroll/group/payroll/group/list', this.appSettings.defaultOptions);
  }

  public async CreateUserPayrollGroup(objUserPayroll: UserPayrollGroupModel) {
    return this.httpClient.post(this.appSettings.defaultAPIURLHost + '/api/user/payroll/group/create', JSON.stringify(objUserPayroll), this.appSettings.defaultOptions);
  }

  public async UpdateUserPayrollGroup(id: number, objUserPayroll: UserPayrollGroupModel) {
    return this.httpClient.put(this.appSettings.defaultAPIURLHost + '/api/user/payroll/group/update/' + id, JSON.stringify(objUserPayroll), this.appSettings.defaultOptions);
  }

  public async DeleteUserPayrollGroup(id: number, userId: number) {
    return this.httpClient.delete(this.appSettings.defaultAPIURLHost + '/api/user/payroll/group/delete/' + id + '/' + userId, this.appSettings.defaultOptions);
  }

}
