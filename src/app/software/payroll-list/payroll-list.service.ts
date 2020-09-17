import { Injectable } from '@angular/core';
import { AppSettings } from './../software-appsettings';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PayrollListService {

  constructor(
    private appSettings: AppSettings,
    private httpClient: HttpClient
  ) { }

  public async PayrollList(payrollGroup: string) {
    return this.httpClient.get(this.appSettings.defaultAPIURLHost + '/api/trn/payroll/list/' + payrollGroup,
      this.appSettings.defaultOptions);
  }

  public async AddPayroll(payrollGroup: string) {
    return this.httpClient.post(this.appSettings.defaultAPIURLHost + '/api/trn/payroll/create/' + payrollGroup, "",
      this.appSettings.defaultOptions);
  }

  public async DeletePayroll(id: number) {
    return this.httpClient.delete(this.appSettings.defaultAPIURLHost + '/api/trn/payroll/delete/' + id,
      this.appSettings.defaultOptions);
  }

  public async PayrollGroupList() {
    return this.httpClient.get(this.appSettings.defaultAPIURLHost + '/api/trn/payroll/payroll/group/list',
      this.appSettings.defaultOptions);
  }
}
