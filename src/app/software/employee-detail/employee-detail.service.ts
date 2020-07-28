import { Injectable } from '@angular/core';
import { AppSettings } from 'src/app/app-settings';
import { HttpClient } from '@angular/common/http';
import { EmployeeModel } from './employee.model';

@Injectable({
  providedIn: 'root'
})
export class EmployeeDetailService {

  constructor(
    private appSettings: AppSettings,
    private httpClient: HttpClient
  ) { }


  public async ZipCodeList() {
    return this.httpClient.get(this.appSettings.defaultAPIURLHost + '/api/employee/zip/code/list', this.appSettings.defaultOptions);
  }

  public async GenderList() {
    return this.httpClient.get(this.appSettings.defaultAPIURLHost + '/api/employee/sex/list', this.appSettings.defaultOptions);
  }

  public async CivilStatusList() {
    return this.httpClient.get(this.appSettings.defaultAPIURLHost + '/api/employee/civil/status/list', this.appSettings.defaultOptions);
  }

  public async CitizenshipList() {
    return this.httpClient.get(this.appSettings.defaultAPIURLHost + '/api/employee/citizenship/list', this.appSettings.defaultOptions);
  }

  public async BloodTypeList() {
    return this.httpClient.get(this.appSettings.defaultAPIURLHost + '/api/employee/blood/type/list', this.appSettings.defaultOptions);
  }

  public async UserList() {
    return this.httpClient.get(this.appSettings.defaultAPIURLHost + '/api/employee/user/list', this.appSettings.defaultOptions);
  }

  public async CompanyList() {
    return this.httpClient.get(this.appSettings.defaultAPIURLHost + '/api/employee/company/list', this.appSettings.defaultOptions);
  }

  public async EmployeeDetail(id: number) {
    return this.httpClient.get(this.appSettings.defaultAPIURLHost + '/api/employee/detail/' + id, this.appSettings.defaultOptions);
  }

  public async SaveEmployee(id: number, objEmployee: EmployeeModel) {
    return this.httpClient.put(this.appSettings.defaultAPIURLHost + '/api/employee/save/' + id, JSON.stringify(objEmployee), this.appSettings.defaultOptions);
  }

  public async LockEmployee(id: number, objEmployee: EmployeeModel) {
    return this.httpClient.put(this.appSettings.defaultAPIURLHost + '/api/employee/lock/' + id, JSON.stringify(objEmployee), this.appSettings.defaultOptions);
  }

  public async Unlockemployee(id: number) {
    return this.httpClient.put(this.appSettings.defaultAPIURLHost + '/api/employee/unlock/' + id, "", this.appSettings.defaultOptions);
  }
}
