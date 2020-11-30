import { Injectable } from '@angular/core';
import { AppSettings } from './../software-appsettings';
import { HttpClient, HttpHeaders } from '@angular/common/http';

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
    return await this.httpClient.get(this.appSettings.defaultAPIURLHost + '/api/portal/employee/overtime/application/line/list/' + employeeId + '/' + yearId, this.appSettings.defaultOptions);
  }

  public async OvertimeApplicationDetail(id: number) {
    return await this.httpClient.get(this.appSettings.defaultAPIURLHost + '/api/portal/employee/overtime/application/detail/' + id, this.appSettings.defaultOptions);
  }

  // overtimeApplication LINE
  public async OvertimeApplicationDropdownList(yearId: number) {
    return await this.httpClient.get(this.appSettings.defaultAPIURLHost + '/api/portal/employee/overtime/application/dropdown/list/' + yearId, this.appSettings.defaultOptions);
  }

  public async OvertimeApplicationLineList(employeeId: number, ovartimeApplicationId: number) {
    return await this.httpClient.get(this.appSettings.defaultAPIURLHost + '/api/portal/employee/overtime/application/line/list/' + employeeId + '/' + ovartimeApplicationId, this.appSettings.defaultOptions);
  }

  public async AddOvertimeApplicationLine(objovertimeApplicationLine: any) {
    return await this.httpClient.post(this.appSettings.defaultAPIURLHost + '/api/portal/employee/overtime/application/line/create', JSON.stringify(objovertimeApplicationLine), this.appSettings.defaultOptions);
  }

  public async UpdateOvertimeApplicationLine(id: number, objOvertimeApplicationLine: any) {
    return await this.httpClient.put(this.appSettings.defaultAPIURLHost + '/api/portal/employee/overtime/application/line/update/' + id, JSON.stringify(objOvertimeApplicationLine), this.appSettings.defaultOptions);
  }

  public async DeleteOvertimeApplicationLine(id: any) {
    return await this.httpClient.delete(this.appSettings.defaultAPIURLHost + '/api/portal/employee/overtime/application/line/delete/' + id, this.appSettings.defaultOptions);
  }
  // =================
  // Leave Application
  // =================
  public async LeaveApplicationList(employeeId: number, yearId: number) {
    console.log("LA List");
    return await this.httpClient.get(this.appSettings.defaultAPIURLHost + '/api/portal/employee/leave/application/list/' + employeeId + '/' + yearId, this.appSettings.defaultOptions);
  }

  public async ApproverList(yearId: number) {
    return await this.httpClient.get(this.appSettings.defaultAPIURLHost + '/api/portal/employee/leave/ot/application/list/' + yearId, this.appSettings.defaultOptions);
  }

  public async LeaveApplicationDetail(id: number) {
    return await this.httpClient.get(this.appSettings.defaultAPIURLHost + '/api/portal/employee/leave/application/detail/' + id, this.appSettings.defaultOptions);
  }

  // ======================
  // Leave Application Line
  // ======================
  public async LeaveApplicationDropdownList(yearId: number) {
    return await this.httpClient.get(this.appSettings.defaultAPIURLHost + '/api/portal/employee/leave/application/dropdown/list/' + yearId, this.appSettings.defaultOptions);
  }

  public async LeaveApplicationLineList(employeeId: number, leaveApplicationId: number) {
    return await this.httpClient.get(this.appSettings.defaultAPIURLHost + '/api/portal/employee/leave/application/line/list/' + employeeId + '/' + leaveApplicationId, this.appSettings.defaultOptions);
  }

  public async AddLeaveApplicationLine(objLeaveApplicationLine: any) {
    return await this.httpClient.post(this.appSettings.defaultAPIURLHost + '/api/portal/employee/leave/application/line/create', JSON.stringify(objLeaveApplicationLine), this.appSettings.defaultOptions);
  }

  public async UpdateLeaveApplicationLine(id: number, objLeaveApplicationLine: any) {
    return await this.httpClient.put(this.appSettings.defaultAPIURLHost + '/api/portal/employee/leave/application/line/update/' + id, JSON.stringify(objLeaveApplicationLine), this.appSettings.defaultOptions);
  }

  public async DeleteLeaveApplicationLine(laId: any) {
    return await this.httpClient.delete(this.appSettings.defaultAPIURLHost + '/api/portal/employee/leave/application/line/delete/' + laId, this.appSettings.defaultOptions);
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

  public async PayrollLineList(employeeId: number, payrollId: number) {
    return await this.httpClient.get(this.appSettings.defaultAPIURLHost + '/api/portal/employee/payroll/line/list/' + employeeId + '/' + payrollId, this.appSettings.defaultOptions);
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

  // Payslip
  public async Payslip(employeeId: number, payId: number) {
    let printCaseOptions: any = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('access_token')
      }),
      responseType: "blob"
    };

    return await this.httpClient.get(this.appSettings.defaultAPIURLHost + '/api/portal/employee/payslip/' + employeeId + '/' + payId,
      printCaseOptions);
  }
  

  // LeaveApplication LINE
  public async ApproverLeaveApplicationLineList(leaveApplicationId: number) {
    console.log(leaveApplicationId);
    return await this.httpClient.get(this.appSettings.defaultAPIURLHost + '/api/portal/employee/approver/leave/application/list/' + leaveApplicationId, this.appSettings.defaultOptions);
  }

    // overtimeApplication LINE
    public async ApproverOvertimeApplicationLineList(overtimeApplicationId: number) {
      console.log(overtimeApplicationId);
      return await this.httpClient.get(this.appSettings.defaultAPIURLHost + '/api/portal/employee/approver/overtime/application/list//' + overtimeApplicationId, this.appSettings.defaultOptions);
    }
}
