import { Injectable } from '@angular/core';
import { AppSettings } from 'src/app/app-settings';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class LeaveApplicationListService {

  constructor(
    private appSettings: AppSettings,
    private httpClient: HttpClient
  ) { }

  public async LeaveApplicationList(payrollGroup: string) {
    console.log(payrollGroup);
    return this.httpClient.get(this.appSettings.defaultAPIURLHost + '/api/leave/application/list/' + payrollGroup, this.appSettings.defaultOptions);
  }

  public async AddLeaveApplication(payrollGroup: string) {
    return this.httpClient.post(this.appSettings.defaultAPIURLHost + '/api/leave/application/create/' + payrollGroup, "", this.appSettings.defaultOptions);
  }

  public async DeleteLeaveApplication(id: number) {
    return this.httpClient.delete(this.appSettings.defaultAPIURLHost + '/api/leave/application/delete/' + id, this.appSettings.defaultOptions);
  }

  public async PayrollGroupList() {
    return await this.httpClient.get(this.appSettings.defaultAPIURLHost + '/api/leave/application/payroll/group/list', this.appSettings.defaultOptions);
  }
}
