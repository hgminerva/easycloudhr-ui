import { Injectable } from '@angular/core';
import { AppSettings } from 'src/app/app-settings';
import { HttpClient } from '@angular/common/http';

import { LoanModel } from './loan.model';

@Injectable({
  providedIn: 'root'
})
export class LoanListService {

  constructor(
    private appSettings: AppSettings,
    private httpClient: HttpClient
  ) { }

  public async LoanList() {
    return this.httpClient.get(this.appSettings.defaultAPIURLHost + '/api/loan/list',
      this.appSettings.defaultOptions);
  }

  public async UserList() {
    return await this.httpClient.get(this.appSettings.defaultAPIURLHost + '/api/loan/user/list', this.appSettings.defaultOptions);
  }

  public async OtherDeductionList() {
    return this.httpClient.get(this.appSettings.defaultAPIURLHost + '/api/loan/other/deduction/dropdown/list',
      this.appSettings.defaultOptions);
  }

  public async EmployeeList() {
    return await this.httpClient.get(this.appSettings.defaultAPIURLHost + '/api/change/shift/line/employee/list', this.appSettings.defaultOptions);
  }

  public async LoanDetail(id: number) {
    return this.httpClient.get(this.appSettings.defaultAPIURLHost + '/api/loan/detail/' + id,
      this.appSettings.defaultOptions);
  }

  public async AddLoan() {
    return this.httpClient.post(this.appSettings.defaultAPIURLHost + '/api/loan/create', "",
      this.appSettings.defaultOptions);
  }

  public async SaveLoan(id: number, objLoan: LoanModel) {
    return this.httpClient.put(this.appSettings.defaultAPIURLHost + '/api/loan/save/' + id, JSON.stringify(objLoan), this.appSettings.defaultOptions);
  }

  public async LockLoan(id: number, objLoan: LoanModel) {
    return this.httpClient.put(this.appSettings.defaultAPIURLHost + '/api/loan/lock/' + id, JSON.stringify(objLoan), this.appSettings.defaultOptions);
  }

  public async UnlockLoan(id: number) {
    return this.httpClient.put(this.appSettings.defaultAPIURLHost + '/api/loan/unlock/' + id, "", this.appSettings.defaultOptions);
  }

  public async DeleteLoan(id: number) {
    return this.httpClient.delete(this.appSettings.defaultAPIURLHost + '/api/loan/delete/' + id,
      this.appSettings.defaultOptions);
  }
}
