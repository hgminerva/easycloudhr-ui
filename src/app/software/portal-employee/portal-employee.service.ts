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

  // overtimeApplication LINE
  public async OvertimeApplicationLineList(employeeId: number) {
    return await this.httpClient.get(this.appSettings.defaultAPIURLHost + '/api/portal/employee/overtime/application/line/list/' + employeeId, this.appSettings.defaultOptions);
  }

  // Leave Application LINE
  public async LeaveApplicationLineList(employeeId: number) {
    return await this.httpClient.get(this.appSettings.defaultAPIURLHost + '/api/portal/employee/leave/application/line/list/' + employeeId, this.appSettings.defaultOptions);
  }

  // DTR LINE
  public async DTRLineList(employeeId: number) {
    return await this.httpClient.get(this.appSettings.defaultAPIURLHost + '/api/portal/employee/dtr/line/list/' + employeeId, this.appSettings.defaultOptions);
  }

  // Payroll LINE
  public async PayrollLineList(employeeId: number) {
    return await this.httpClient.get(this.appSettings.defaultAPIURLHost + '/api/portal/employee/payroll/line/list/' + employeeId, this.appSettings.defaultOptions);
  }

  // Loan
  public async LoanList(employeeId: number) {
    return this.httpClient.get(this.appSettings.defaultAPIURLHost + '/api/portal/employee/loan/list/' + employeeId,
      this.appSettings.defaultOptions);
  }
}
