import { Injectable } from '@angular/core';
import { AppSettings } from './../software-appsettings';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class OvertimeApplicationListService {

  constructor(
    private appSettings: AppSettings,
    private httpClient: HttpClient
  ) { }

  public async OvertimeApplicationList(payrollGroup: string) {
    console.log(payrollGroup);
    return this.httpClient.get(this.appSettings.defaultAPIURLHost + '/api/overtime//application/list/' + payrollGroup, this.appSettings.defaultOptions);
  }

  public async AddOvertimeApplication(payrollGroup: string) {
    return this.httpClient.post(this.appSettings.defaultAPIURLHost + '/api/overtime//application/create/' + payrollGroup, "", this.appSettings.defaultOptions);
  }

  public async DeleteOvertimeApplication(id: number) {
    return this.httpClient.delete(this.appSettings.defaultAPIURLHost + '/api/overtime//application/delete/' + id, this.appSettings.defaultOptions);
  }

  public async PayrollGroupList() {
    return await this.httpClient.get(this.appSettings.defaultAPIURLHost + '/api/overtime//application/payroll/group/list', this.appSettings.defaultOptions);
  }
}
