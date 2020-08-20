import { Injectable } from '@angular/core';
import { AppSettings } from 'src/app/app-settings';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class PayrollOtherIncomeService {

  constructor(
    private appSettings: AppSettings,
    private httpClient: HttpClient
  ) { }

  public async PayrollOtherIncomeList(payrollGroup: string) {
    return this.httpClient.get(this.appSettings.defaultAPIURLHost + '/api/payroll/other/income/list/' + payrollGroup, this.appSettings.defaultOptions);
  }

  public async AddPayrollOtherIncome(payrollGroup: string) {
    console.log(payrollGroup);

    return this.httpClient.post(this.appSettings.defaultAPIURLHost + '/api/payroll/other/income/create/' + payrollGroup, "", this.appSettings.defaultOptions);
  }

  public async DeletePayrollOtherIncome(id: number) {
    return this.httpClient.delete(this.appSettings.defaultAPIURLHost + '/api/payroll/other/income/delete/' + id, this.appSettings.defaultOptions);
  }

  public async PayrollGroupList() {
    return await this.httpClient.get(this.appSettings.defaultAPIURLHost + '/api/payroll/other/income/payroll/group/list', this.appSettings.defaultOptions);
  }
}
