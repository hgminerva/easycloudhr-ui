import { Injectable } from '@angular/core';
import { AppSettings } from './../software-appsettings';
import { HttpClient } from '@angular/common/http';

import {OvertimeApplicationModel} from './overtime-application.model';
import { OvertimeApplicationLineModel} from './overtime-application-line.model';

@Injectable({
  providedIn: 'root'
})
export class OvertimeApplicationDetailService {

  constructor(
    private appSettings: AppSettings,
    private httpClient: HttpClient
  ) { }

  // OvertimeApplication DROPDOWN
  public async PayrollGroupList() {
    return await this.httpClient.get(this.appSettings.defaultAPIURLHost + '/api/overtime/application/payroll/group/list', this.appSettings.defaultOptions);
  }

  public async YearList() {
    return await this.httpClient.get(this.appSettings.defaultAPIURLHost + '/api/overtime/application/year/list', this.appSettings.defaultOptions);
  }

  public async UserList() {
    return await this.httpClient.get(this.appSettings.defaultAPIURLHost + '/api/overtime/application/user/list', this.appSettings.defaultOptions);
  }

  // OvertimeApplication
  public async OvertimeApplicationDetail(id: number) {
    return await this.httpClient.get(this.appSettings.defaultAPIURLHost + '/api/overtime/application/detail/' + id, this.appSettings.defaultOptions);
  }

  public async SaveOvertimeApplication(id: number, objOvertimeApplication: OvertimeApplicationModel) {
    return await this.httpClient.put(this.appSettings.defaultAPIURLHost + '/api/overtime/application/save/' + id, JSON.stringify(objOvertimeApplication), this.appSettings.defaultOptions);
  }

  public async LockOvertimeApplication(id: number, objOvertimeApplication: OvertimeApplicationModel) {
    console.log(id);
    return await this.httpClient.put(this.appSettings.defaultAPIURLHost + '/api/overtime/application/lock/' + id, JSON.stringify(objOvertimeApplication), this.appSettings.defaultOptions);
  }

  public async UnlockOvertimeApplication(id: number) {
    return await this.httpClient.put(this.appSettings.defaultAPIURLHost + '/api/overtime/application/unlock/' + id, "", this.appSettings.defaultOptions);
  }

  // overtimeApplication LINE
  public async OvertimeApplicationLineList(overtimeApplicationId: number) {
    console.log(overtimeApplicationId);
    return await this.httpClient.get(this.appSettings.defaultAPIURLHost + '/api/overtime/application/line/list/' + overtimeApplicationId, this.appSettings.defaultOptions);
  }

  public async AddOvertimeApplicationLine(objovertimeApplicationLine: OvertimeApplicationLineModel) {
    return await this.httpClient.post(this.appSettings.defaultAPIURLHost + '/api/overtime/application/line/create', JSON.stringify(objovertimeApplicationLine), this.appSettings.defaultOptions);
  }

  public async UpdateTRLine(id: number, objovertimeApplicationLine: OvertimeApplicationLineModel) {
    return await this.httpClient.put(this.appSettings.defaultAPIURLHost + '/api/overtime/application/line/update/' + id, JSON.stringify(objovertimeApplicationLine), this.appSettings.defaultOptions);
  }

  public async DeleteOvertimeApplicationLine(id: number) {
    return await this.httpClient.delete(this.appSettings.defaultAPIURLHost + '/api/overtime/application/line/delete/' + id, this.appSettings.defaultOptions);
  }

  // Change Shift Line DROPDOWN
  public async EmployeeList() {
    return await this.httpClient.get(this.appSettings.defaultAPIURLHost + '/api/overtime/application/line/employee/list', this.appSettings.defaultOptions);
  }
}
