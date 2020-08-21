import { Injectable } from '@angular/core';
import { AppSettings } from 'src/app/app-settings';
import { HttpClient } from '@angular/common/http';
import { ChangeShiftModel } from './change-shift-code.model';
import { ChangeShiftLineModel } from './change-shift-code-line.model';

@Injectable({
  providedIn: 'root'
})
export class ChangeShiftCodeDetailService {

  constructor(
    private appSettings: AppSettings,
    private httpClient: HttpClient
  ) { }

  // ChangeShiftCode DROPDOWN
  public async PayrollGroupList() {
    return await this.httpClient.get(this.appSettings.defaultAPIURLHost + '/api/change/shift/payroll/group/list', this.appSettings.defaultOptions);
  }

  public async YearList() {
    return await this.httpClient.get(this.appSettings.defaultAPIURLHost + '/api/change/shift/year/list', this.appSettings.defaultOptions);
  }

  public async UserList() {
    return await this.httpClient.get(this.appSettings.defaultAPIURLHost + '/api/change/shift/user/list', this.appSettings.defaultOptions);
  }

  // ChangeShiftCode
  public async ChangeShiftCodeDetail(id: number) {
    return await this.httpClient.get(this.appSettings.defaultAPIURLHost + '/api/change/shift/detail/' + id, this.appSettings.defaultOptions);
  }

  public async SaveChangeShiftCode(id: number, objChangeShiftCode: ChangeShiftModel) {
    return await this.httpClient.put(this.appSettings.defaultAPIURLHost + '/api/change/shift/save/' + id, JSON.stringify(objChangeShiftCode), this.appSettings.defaultOptions);
  }

  public async LockChangeShiftCode(id: number, objChangeShiftCode: ChangeShiftModel) {
    return await this.httpClient.put(this.appSettings.defaultAPIURLHost + '/api/change/shift/lock/' + id, JSON.stringify(objChangeShiftCode), this.appSettings.defaultOptions);
  }

  public async UnlockChangeShiftCode(id: number) {
    return await this.httpClient.put(this.appSettings.defaultAPIURLHost + '/api/change/shift/unlock/' + id, "", this.appSettings.defaultOptions);
  }

  // ChangeShiftCode LINE
  public async ChangeShiftCodeLineList(ChangeShiftCodeId: number) {
    return await this.httpClient.get(this.appSettings.defaultAPIURLHost + '/api/change/shift/line/list/' + ChangeShiftCodeId, this.appSettings.defaultOptions);
  }

  public async AddChangeShiftCodeLine(objChangeShiftCodeLine: ChangeShiftLineModel) {
    return await this.httpClient.post(this.appSettings.defaultAPIURLHost + '/api/change/shift/line/create/', JSON.stringify(objChangeShiftCodeLine), this.appSettings.defaultOptions);
  }

  public async UpdateTRLine(id: number, objChangeShiftCodeLine: ChangeShiftLineModel) {
    return await this.httpClient.put(this.appSettings.defaultAPIURLHost + '/api/change/shift/line/update/' + id, JSON.stringify(objChangeShiftCodeLine), this.appSettings.defaultOptions);
  }

  public async DeleteChangeShiftCodeLine(id: number) {
    return await this.httpClient.delete(this.appSettings.defaultAPIURLHost + '/api/change/shift/line/delete/' + id, this.appSettings.defaultOptions);
  }

  // Change Shift Line DROPDOWN
  public async EmployeeList() {
    return await this.httpClient.get(this.appSettings.defaultAPIURLHost + '/api/change/shift/line/employee/list', this.appSettings.defaultOptions);
  }

  public async ShiftsList() {
    return await this.httpClient.get(this.appSettings.defaultAPIURLHost + '/api/change/shift/line/shift/list', this.appSettings.defaultOptions);
  }

  public async BranchList() {
    return await this.httpClient.get(this.appSettings.defaultAPIURLHost + '/api/change/shift/line/branch/list', this.appSettings.defaultOptions);
  }
}
