import { Injectable } from '@angular/core';
import { AppSettings } from './../software-appsettings';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PayrollOtherDeductionListService {

  constructor(
    private appSettings: AppSettings,
    private httpClient: HttpClient
  ) { }

  public async PayrollOtherDeductionList(payrollGroup: string) {
    return this.httpClient.get(this.appSettings.defaultAPIURLHost + '/api/payroll/other/deduction/list/' + payrollGroup, this.appSettings.defaultOptions);
  }

  public async AddPayrollOtherDeduction(payrollGroup: string) {
    return this.httpClient.post(this.appSettings.defaultAPIURLHost + '/api/payroll/other/deduction/create/' + payrollGroup, "", this.appSettings.defaultOptions);
  }

  public async DeletePayrollOtherDeduction(id: number) {
    return this.httpClient.delete(this.appSettings.defaultAPIURLHost + '/api/payroll/other/deduction/delete/' + id, this.appSettings.defaultOptions);
  }

  public async PayrollGroupList() {
    return await this.httpClient.get(this.appSettings.defaultAPIURLHost + '/api/payroll/other/deduction/payroll/group/list', this.appSettings.defaultOptions);
  }
}
