import { Injectable } from '@angular/core';
import { AppSettings } from './../software-appsettings';
import { HttpClient } from '@angular/common/http';

import { PayrollOtherIncomeModel } from './payroll-other-income.model';
import { PayrollOtherIncomeLineModel } from './payroll-other-income-line.model';
@Injectable({
  providedIn: 'root'
})
export class PayrollOtherIncomeDetailService {

  constructor(
    private appSettings: AppSettings,
    private httpClient: HttpClient
  ) { }

  // PayrollOtherIncome DROPDOWN
  public async PayrollGroupList() {
    return await this.httpClient.get(this.appSettings.defaultAPIURLHost + '/api/payroll/other/income/payroll/group/list', this.appSettings.defaultOptions);
  }

  // PayrollOtherIncome DROPDOWN
  public async OtherIncomeList() {
    return await this.httpClient.get(this.appSettings.defaultAPIURLHost + '/api/payroll/other/income/line/income/list', this.appSettings.defaultOptions);
  }


  public async YearList() {
    return await this.httpClient.get(this.appSettings.defaultAPIURLHost + '/api/payroll/other/income/year/list', this.appSettings.defaultOptions);
  }

  public async UserList() {
    return await this.httpClient.get(this.appSettings.defaultAPIURLHost + '/api/payroll/other/income/user/list', this.appSettings.defaultOptions);
  }

  // PayrollOtherIncome
  public async PayrollOtherIncomeDetail(id: number) {
    return await this.httpClient.get(this.appSettings.defaultAPIURLHost + '/api/payroll/other/income/detail/' + id, this.appSettings.defaultOptions);
  }

  public async SavePayrollOtherIncome(id: number, objPayrollOtherIncome: PayrollOtherIncomeModel) {
    return await this.httpClient.put(this.appSettings.defaultAPIURLHost + '/api/payroll/other/income/save/' + id, JSON.stringify(objPayrollOtherIncome), this.appSettings.defaultOptions);
  }

  public async LockPayrollOtherIncome(id: number, objPayrollOtherIncome: PayrollOtherIncomeModel) {
    return await this.httpClient.put(this.appSettings.defaultAPIURLHost + '/api/payroll/other/income/lock/' + id, JSON.stringify(objPayrollOtherIncome), this.appSettings.defaultOptions);
  }

  public async UnlockPayrollOtherIncome(id: number) {
    return await this.httpClient.put(this.appSettings.defaultAPIURLHost + '/api/payroll/other/income/unlock/' + id, "", this.appSettings.defaultOptions);
  }

  // PayrollOtherIncome LINE
  public async PayrollOtherIncomeLineList(PayrollOtherIncomeId: number) {
    return await this.httpClient.get(this.appSettings.defaultAPIURLHost + '/api/payroll/other/income/line/list/' + PayrollOtherIncomeId, this.appSettings.defaultOptions);
  }

  public async AddPayrollOtherIncomeLine(objPayrollOtherIncomeLine: PayrollOtherIncomeLineModel) {
    return await this.httpClient.post(this.appSettings.defaultAPIURLHost + '/api/payroll/other/income/line/create/', JSON.stringify(objPayrollOtherIncomeLine), this.appSettings.defaultOptions);
  }

  public async UpdatePayrollOtherIncomeLine(id: number, objPayrollOtherIncomeLine: PayrollOtherIncomeLineModel) {
    return await this.httpClient.put(this.appSettings.defaultAPIURLHost + '/api/payroll/other/income/line/update/' + id, JSON.stringify(objPayrollOtherIncomeLine), this.appSettings.defaultOptions);
  }

  public async DeletePayrollOtherIncomeLine(id: number) {
    return await this.httpClient.delete(this.appSettings.defaultAPIURLHost + '/api/payroll/other/income/line/delete/' + id, this.appSettings.defaultOptions);
  }

  // Change Shift Line DROPDOWN
  public async EmployeeList() {
    return await this.httpClient.get(this.appSettings.defaultAPIURLHost + '/api/payroll/other/income/line/employee/list', this.appSettings.defaultOptions);
  }

  public async ShiftsList() {
    return await this.httpClient.get(this.appSettings.defaultAPIURLHost + '/api/payroll/other/income/line/shift/list', this.appSettings.defaultOptions);
  }

  public async BranchList() {
    return await this.httpClient.get(this.appSettings.defaultAPIURLHost + '/api/payroll/other/income/line/branch/list', this.appSettings.defaultOptions);
  }
}
