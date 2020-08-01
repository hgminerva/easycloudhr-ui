import { Injectable } from '@angular/core';
import { AppSettings } from 'src/app/app-settings';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class EmployeeListService {

  constructor(
    private appSettings: AppSettings,
    private httpClient: HttpClient
  ) { }

  public async EmployeeList(payrollGroup: string) {
    console.log(payrollGroup);
    return this.httpClient.get(this.appSettings.defaultAPIURLHost + '/api/employee/list/filteredBy/' + payrollGroup, this.appSettings.defaultOptions);
  }

  public async AddEmployee() {
    return this.httpClient.post(this.appSettings.defaultAPIURLHost + '/api/employee/create', "", this.appSettings.defaultOptions);
  }

  public async DeleteEmployee(id: number) {
    return this.httpClient.delete(this.appSettings.defaultAPIURLHost + '/api/employee/delete/' + id, this.appSettings.defaultOptions);
  }

  public async PayrollGroupList() {
    return this.httpClient.get(this.appSettings.defaultAPIURLHost + '/api/employee/payroll/group/list', this.appSettings.defaultOptions);
  }

}
