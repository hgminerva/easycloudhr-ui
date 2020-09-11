import { Injectable } from '@angular/core';
import { AppSettings } from 'src/app/app-settings';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PortalEmployeeService {

  constructor(
    private appSettings: AppSettings,
    private httpClient: HttpClient
  ) { }

  // overtimeApplication LINE
  public async EmployeeDetail() {
    return await this.httpClient.get(this.appSettings.defaultAPIURLHost + '/api/portal/employee/detail/', this.appSettings.defaultOptions);
  }

  // Current Year
  public async CurrentYear() {
    return await this.httpClient.get(this.appSettings.defaultAPIURLHost + '/api/portal/employee/current/year', this.appSettings.defaultOptions);
  }

  // Year List
  public async YearList() {
    return await this.httpClient.get(this.appSettings.defaultAPIURLHost + '/api/portal/employee/year/dropdown/list', this.appSettings.defaultOptions);
  }

  // OvertimeApplication LINE
  public async OvertimeApplicationList(employeeId: number, yearId: number) {
    return await this.httpClient.get(this.appSettings.defaultAPIURLHost + '/api/portal/employee/overtime/application/list/' + employeeId + '/' + yearId, this.appSettings.defaultOptions);
  }

  public async OvertimeApplicationDetail(id: number) {
    return await this.httpClient.get(this.appSettings.defaultAPIURLHost + '/api/portal/employee/overtime/application/detail/' + id, this.appSettings.defaultOptions);
  }

  // overtimeApplication LINE
  public async OvertimeApplicationLineList(employeeId: number, ovartimeApplicationId: number) {
    return await this.httpClient.get(this.appSettings.defaultAPIURLHost + '/api/portal/employee/overtime/application/line/list/' + employeeId + '/' + ovartimeApplicationId, this.appSettings.defaultOptions);
  }

  public async AddOvertimeApplicationLine(objovertimeApplicationLine: any) {
    return await this.httpClient.post(this.appSettings.defaultAPIURLHost + '/api/portal/employee/overtime/application/line/create', JSON.stringify(objovertimeApplicationLine), this.appSettings.defaultOptions);
  }


  // =================
  // Leave Application
  // =================
  public async LeaveApplicationList(employeeId: number, yearId: number) {
    console.log("LA List");
    return await this.httpClient.get(this.appSettings.defaultAPIURLHost + '/api/portal/employee/leave/application/list/' + employeeId + '/' + yearId, this.appSettings.defaultOptions);
  }

  public async LeaveApplicationDetail(id: number) {
    return await this.httpClient.get(this.appSettings.defaultAPIURLHost + '/api/portal/employee/leave/application/detail/' + id, this.appSettings.defaultOptions);
  }

  // ======================
  // Leave Application Line
  // ======================
  public async LeaveApplicationLineList(employeeId: number, leaveApplicationId: number) {
    return await this.httpClient.get(this.appSettings.defaultAPIURLHost + '/api/portal/employee/leave/application/line/list/' + employeeId + '/' + leaveApplicationId, this.appSettings.defaultOptions);
  }

  public async AddLeaveApplicationLine(objovertimeApplicationLine: any) {
    return await this.httpClient.post(this.appSettings.defaultAPIURLHost + '/api/portal/employee/leave/application/line/create', JSON.stringify(objovertimeApplicationLine), this.appSettings.defaultOptions);
  }



  // DTR 
  public async DTRList(employeeId: number, yearId: number) {
    return this.httpClient.get(this.appSettings.defaultAPIURLHost + '/api/portal/employee/dtr/list/' + employeeId + '/' + yearId,
      this.appSettings.defaultOptions);
  }

  public async DTRLineList(employeeId: number, dtrId: number) {
    return await this.httpClient.get(this.appSettings.defaultAPIURLHost + '/api/portal/employee/dtr/line/list/' + employeeId + '/' + dtrId, this.appSettings.defaultOptions);
  }

  // Payroll 
  public async PayrollList(employeeId: number, yearId: number) {
    return this.httpClient.get(this.appSettings.defaultAPIURLHost + '/api/portal/employee/payroll/list/' + employeeId + '/' + yearId,
      this.appSettings.defaultOptions);
  }

  public async PayrollLineList(employeeId: number) {
    return await this.httpClient.get(this.appSettings.defaultAPIURLHost + '/api/portal/employee/payroll/line/list/' + employeeId, this.appSettings.defaultOptions);
  }

  // Loan
  public async LoanList(employeeId: number) {
    return this.httpClient.get(this.appSettings.defaultAPIURLHost + '/api/portal/employee/loan/list/' + employeeId,
      this.appSettings.defaultOptions);
  }

  public async LoanDetail(id: number) {
    return this.httpClient.get(this.appSettings.defaultAPIURLHost + '/api/portal/employee/detail/load/' + id,
      this.appSettings.defaultOptions);
  }

  public async LoanPayments(loanId: number) {
    return this.httpClient.get(this.appSettings.defaultAPIURLHost + '/api/portal/employee/loan/payment/' + loanId,
      this.appSettings.defaultOptions);
  }
}
