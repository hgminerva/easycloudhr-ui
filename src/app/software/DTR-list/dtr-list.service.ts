import { Injectable } from '@angular/core';
import { AppSettings } from '../software-appsettings';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DTRListService {

  constructor(
    private appSettings: AppSettings,
    private httpClient: HttpClient
  ) { }

  public async DTRList(payrollGroup: string) {
    return this.httpClient.get(this.appSettings.defaultAPIURLHost + '/api/dtr/list/' + payrollGroup,
      this.appSettings.defaultOptions);
  }

  public async AddDTR(payrollGroup: string) {
    return this.httpClient.post(this.appSettings.defaultAPIURLHost + '/api/dtr/create/' + payrollGroup, "",
      this.appSettings.defaultOptions);
  }

  public async DeleteDTR(id: number) {
    return this.httpClient.delete(this.appSettings.defaultAPIURLHost + '/api/dtr/delete/' + id,
      this.appSettings.defaultOptions);
  }

  public async PayrollGroupList() {
    return this.httpClient.get(this.appSettings.defaultAPIURLHost + '/api/dtr/payroll/group/list',
      this.appSettings.defaultOptions);
  }
}
