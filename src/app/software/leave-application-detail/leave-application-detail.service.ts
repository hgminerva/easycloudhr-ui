import { Injectable } from '@angular/core';
import { AppSettings } from './../software-appsettings';
import { HttpClient } from '@angular/common/http';

import {LeaveApplicationModel} from './leave-application.model';
import { LeaveApplicationLineModel} from './leave-application-line.model';

@Injectable({
  providedIn: 'root'
})
export class LeaveApplicationDetailService {

  constructor(
    private appSettings: AppSettings,
    private httpClient: HttpClient
  ) { }

  // LeaveApplication DROPDOWN
  public async PayrollGroupList() {
    return await this.httpClient.get(this.appSettings.defaultAPIURLHost + '/api/leave/application/payroll/group/list', this.appSettings.defaultOptions);
  }

  public async YearList() {
    return await this.httpClient.get(this.appSettings.defaultAPIURLHost + '/api/leave/application/year/list', this.appSettings.defaultOptions);
  }

  public async UserList() {
    return await this.httpClient.get(this.appSettings.defaultAPIURLHost + '/api/leave/application/user/list', this.appSettings.defaultOptions);
  }

  // LeaveApplication
  public async LeaveApplicationDetail(id: number) {
    return await this.httpClient.get(this.appSettings.defaultAPIURLHost + '/api/leave/application/detail/' + id, this.appSettings.defaultOptions);
  }

  public async SaveLeaveApplication(id: number, objLeaveApplication: LeaveApplicationModel) {
    return await this.httpClient.put(this.appSettings.defaultAPIURLHost + '/api/leave/application/save/' + id, JSON.stringify(objLeaveApplication), this.appSettings.defaultOptions);
  }

  public async LockLeaveApplication(id: number, objLeaveApplication: LeaveApplicationModel) {
    return await this.httpClient.put(this.appSettings.defaultAPIURLHost + '/api/leave/application/lock/' + id, JSON.stringify(objLeaveApplication), this.appSettings.defaultOptions);
  }

  public async UnlockLeaveApplication(id: number) {
    return await this.httpClient.put(this.appSettings.defaultAPIURLHost + '/api/leave/application/unlock/' + id, "", this.appSettings.defaultOptions);
  }

  // LeaveApplication LINE
  public async LeaveApplicationLineList(leaveApplicationId: number) {
    console.log(leaveApplicationId);
    return await this.httpClient.get(this.appSettings.defaultAPIURLHost + '/api/leave/application/line/list/' + leaveApplicationId, this.appSettings.defaultOptions);
  }

  public async AddLeaveApplicationLine(objLeaveApplicationLine: LeaveApplicationLineModel) {
    return await this.httpClient.post(this.appSettings.defaultAPIURLHost + '/api/leave/application/line/create', JSON.stringify(objLeaveApplicationLine), this.appSettings.defaultOptions);
  }

  public async UpdateTRLine(id: number, objLeaveApplicationLine: LeaveApplicationLineModel) {
    return await this.httpClient.put(this.appSettings.defaultAPIURLHost + '/api/leave/application/line/update/' + id, JSON.stringify(objLeaveApplicationLine), this.appSettings.defaultOptions);
  }

  public async DeleteLeaveApplicationLine(id: number) {
    return await this.httpClient.delete(this.appSettings.defaultAPIURLHost + '/api/leave/application/line/delete/' + id, this.appSettings.defaultOptions);
  }

  // Change Shift Line DROPDOWN
  public async EmployeeList() {
    return await this.httpClient.get(this.appSettings.defaultAPIURLHost + '/api/leave/application/line/employee/list', this.appSettings.defaultOptions);
  }

  public async ShiftsList() {
    return await this.httpClient.get(this.appSettings.defaultAPIURLHost + '/api/leave/application/line/shift/list', this.appSettings.defaultOptions);
  }

  public async BranchList() {
    return await this.httpClient.get(this.appSettings.defaultAPIURLHost + '/api/leave/application/line/branch/list', this.appSettings.defaultOptions);
  }
}
