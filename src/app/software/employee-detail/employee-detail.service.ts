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

  public async EmployeeDetail(id: number) {
    return this.httpClient.get(this.appSettings.defaultAPIURLHost + '/api/employee/detail/' + id, this.appSettings.defaultOptions);
  }

  public async SaveEmployee(id: number, objEmployee: EmployeeModel) {
    return this.httpClient.put(this.appSettings.defaultAPIURLHost + '/api/employee/save/' + id, JSON.stringify(objEmployee), this.appSettings.defaultOptions);
  }

  public async Lockemployee(id: number, objEmployee: EmployeeModel) {
    return this.httpClient.put(this.appSettings.defaultAPIURLHost + '/api/employee/create/' + id, JSON.stringify(objEmployee), this.appSettings.defaultOptions);
  }

  public async Unlockemployee(id: number) {
    return this.httpClient.put(this.appSettings.defaultAPIURLHost + '/api/employee/create//' + id, "", this.appSettings.defaultOptions);
  }
}
