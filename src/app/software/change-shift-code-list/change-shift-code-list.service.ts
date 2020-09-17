import { Injectable } from '@angular/core';
import { AppSettings } from './../software-appsettings';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ChangeShiftCodeListService {

  constructor(
    private appSettings: AppSettings,
    private httpClient: HttpClient
  ) { }

  public async ChangeShiftCodeList(payrollGroup: string) {
    return this.httpClient.get(this.appSettings.defaultAPIURLHost + '/api/change/shift/list/' + payrollGroup, this.appSettings.defaultOptions);
  }

  public async AddChangeShiftCode(payrollGroup: string) {
    console.log(payrollGroup);

    return this.httpClient.post(this.appSettings.defaultAPIURLHost + '/api/change/shift/create/' + payrollGroup, "", this.appSettings.defaultOptions);
  }

  public async DeleteChangeShiftCode(id: number) {
    return this.httpClient.delete(this.appSettings.defaultAPIURLHost + '/api/change/shift/delete/' + id, this.appSettings.defaultOptions);
  }

  public async PayrollGroupList() {
    return await this.httpClient.get(this.appSettings.defaultAPIURLHost + '/api/change/shift/payroll/group/list', this.appSettings.defaultOptions);
  }
}
