import { Injectable } from '@angular/core';
import { AppSettings } from 'src/app/app-settings';
import { HttpClient } from '@angular/common/http';

import { PayrollOtherDeductionModel } from './payroll-other-deduction.model';
import { PayrollOtherDeductionLineModel } from './payroll-other-deduction-line.model';
@Injectable({
  providedIn: 'root'
})
export class PayrollOtherDeductionDetailService {

  constructor(
    private appSettings: AppSettings,
    private httpClient: HttpClient
  ) { }

  // PayrollOtherDeduction DROPDOWN
  public async PayrollGroupList() {
    return await this.httpClient.get(this.appSettings.defaultAPIURLHost + '/api/payroll/other/deduction/payroll/group/list', this.appSettings.defaultOptions);
  }

  // PayrollOtherDeduction DROPDOWN
  public async OtherDeductionList() {
    return await this.httpClient.get(this.appSettings.defaultAPIURLHost + '/api/payroll/other/deduction/line/deduction/list', this.appSettings.defaultOptions);
  }

  // PayrollOtherDeduction DROPDOWN
  public async LoanList() {
    return await this.httpClient.get(this.appSettings.defaultAPIURLHost + '/api/payroll/other/deduction/line/loan/list', this.appSettings.defaultOptions);
  }


  public async YearList() {
    return await this.httpClient.get(this.appSettings.defaultAPIURLHost + '/api/payroll/other/deduction/year/list', this.appSettings.defaultOptions);
  }

  public async UserList() {
    return await this.httpClient.get(this.appSettings.defaultAPIURLHost + '/api/payroll/other/deduction/user/list', this.appSettings.defaultOptions);
  }

  // PayrollOtherDeduction
  public async PayrollOtherDeductionDetail(id: number) {
    return await this.httpClient.get(this.appSettings.defaultAPIURLHost + '/api/payroll/other/deduction/detail/' + id, this.appSettings.defaultOptions);
  }

  public async SavePayrollOtherDeduction(id: number, objPayrollOtherDeduction: PayrollOtherDeductionModel) {
    return await this.httpClient.put(this.appSettings.defaultAPIURLHost + '/api/payroll/other/deduction/save/' + id, JSON.stringify(objPayrollOtherDeduction), this.appSettings.defaultOptions);
  }

  public async LockPayrollOtherDeduction(id: number, objPayrollOtherDeduction: PayrollOtherDeductionModel) {
    return await this.httpClient.put(this.appSettings.defaultAPIURLHost + '/api/payroll/other/deduction/lock/' + id, JSON.stringify(objPayrollOtherDeduction), this.appSettings.defaultOptions);
  }

  public async UnlockPayrollOtherDeduction(id: number) {
    return await this.httpClient.put(this.appSettings.defaultAPIURLHost + '/api/payroll/other/deduction/unlock/' + id, "", this.appSettings.defaultOptions);
  }

  // PayrollOtherDeduction LINE
  public async PayrollOtherDeductionLineList(PayrollOtherDeductionId: number) {
    return await this.httpClient.get(this.appSettings.defaultAPIURLHost + '/api/payroll/other/deduction/line/list/' + PayrollOtherDeductionId, this.appSettings.defaultOptions);
  }

  public async AddPayrollOtherDeductionLine(PDID: number, objPayrollOtherDeductionLine: PayrollOtherDeductionLineModel) {
    return await this.httpClient.post(this.appSettings.defaultAPIURLHost + '/api/payroll/other/deduction/line/create/' + PDID, JSON.stringify(objPayrollOtherDeductionLine), this.appSettings.defaultOptions);
  }

  public async UpdatePayrollOtherDeductionLine(id: number, objPayrollOtherDeductionLine: PayrollOtherDeductionLineModel) {
    return await this.httpClient.put(this.appSettings.defaultAPIURLHost + '/api/payroll/other/deduction/line/update/' + id, JSON.stringify(objPayrollOtherDeductionLine), this.appSettings.defaultOptions);
  }

  public async DeletePayrollOtherDeductionLine(id: number) {
    return await this.httpClient.delete(this.appSettings.defaultAPIURLHost + '/api/payroll/other/deduction/line/delete/' + id, this.appSettings.defaultOptions);
  }

  // Change Shift Line DROPDOWN
  public async EmployeeList() {
    return await this.httpClient.get(this.appSettings.defaultAPIURLHost + '/api/payroll/other/deduction/line/employee/list', this.appSettings.defaultOptions);
  }

  public async ShiftsList() {
    return await this.httpClient.get(this.appSettings.defaultAPIURLHost + '/api/payroll/other/deduction/line/shift/list', this.appSettings.defaultOptions);
  }

  public async BranchList() {
    return await this.httpClient.get(this.appSettings.defaultAPIURLHost + '/api/payroll/other/deduction/line/branch/list', this.appSettings.defaultOptions);
  }
}
