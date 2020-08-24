import { Injectable } from '@angular/core';
import { AppSettings } from 'src/app/app-settings';
import { HttpClient } from '@angular/common/http';

import { PayrollModel } from './payroll.model';
import { PayrollLineModel } from './payroll-line.model';

@Injectable({
  providedIn: 'root'
})
export class PayrollDetailService {

  constructor(
    private appSettings: AppSettings,
    private httpClient: HttpClient
  ) { }

  // Dropdown
  public async PayrollOtherIncomeList(payrollGroup: string) {
    return await this.httpClient.get(this.appSettings.defaultAPIURLHost + '/api/trn/payroll/payroll/other/income/list/' + payrollGroup, this.appSettings.defaultOptions);
  }

  public async PayrollOtherDeductionList(payrollGroup: string) {
    return await this.httpClient.get(this.appSettings.defaultAPIURLHost + '/api/trn/payroll/payroll/other/deduction/list/' + payrollGroup, this.appSettings.defaultOptions);
  }

  public async DTRList(payrollGroup: string) {
    return await this.httpClient.get(this.appSettings.defaultAPIURLHost + '/api/trn/payroll/dtr/list/' + payrollGroup, this.appSettings.defaultOptions);
  }

  public async UserList() {
    return await this.httpClient.get(this.appSettings.defaultAPIURLHost + '/api/trn/payroll/user/list', this.appSettings.defaultOptions);
  }


  // Payroll
  public async PayrollDetail(id: number) {
    return await this.httpClient.get(this.appSettings.defaultAPIURLHost + '/api/trn/payroll/detail/' + id, this.appSettings.defaultOptions);
  }

  public async SavePayroll(id: number, objPayroll: PayrollModel) {
    return await this.httpClient.put(this.appSettings.defaultAPIURLHost + '/api/trn/payroll/save/' + id, JSON.stringify(objPayroll), this.appSettings.defaultOptions);
  }

  public async LockPayroll(id: number, objPayroll: PayrollModel) {
    return await this.httpClient.put(this.appSettings.defaultAPIURLHost + '/api/trn/payroll/lock/' + id, JSON.stringify(objPayroll), this.appSettings.defaultOptions);
  }

  public async UnlockPayroll(id: number) {
    return await this.httpClient.put(this.appSettings.defaultAPIURLHost + '/api/trn/payroll/unlock/' + id, "", this.appSettings.defaultOptions);
  }


  // Payroll LINE
  public async PayrollLineList(payrollId: number) {
    return await this.httpClient.get(this.appSettings.defaultAPIURLHost + '/api/trn/payroll/line/list/' + payrollId, this.appSettings.defaultOptions);
  }

  public async ADPayrollLine(objPayrollLines: PayrollLineModel) {
    return await this.httpClient.post(this.appSettings.defaultAPIURLHost + '/api/trn/payroll/line/create/lines/', JSON.stringify(objPayrollLines), this.appSettings.defaultOptions);
  }

  public async UpdatePayrollLine(id: number, objPayrollLine: PayrollLineModel) {
    return await this.httpClient.put(this.appSettings.defaultAPIURLHost + '/api/trn/payroll/line/update/' + id, JSON.stringify(objPayrollLine), this.appSettings.defaultOptions);
  }

  public async ComputePayrollLine(id: number) {
    return await this.httpClient.get(this.appSettings.defaultAPIURLHost + '/api/trn/payroll/line/compute/' + id, this.appSettings.defaultOptions);
  }

  public async DeletePayrollLine(id: number) {
    return await this.httpClient.delete(this.appSettings.defaultAPIURLHost + '/api/trn/payroll/line/delete/' + id, this.appSettings.defaultOptions);
  }

  // Payroll LINE DROPDOWN
  public async EmployeeList(payrollGroup: string) {
    return await this.httpClient.get(this.appSettings.defaultAPIURLHost + '/api/trn/payroll/line/employee/filteredBy/' + payrollGroup, this.appSettings.defaultOptions);
  }
}
