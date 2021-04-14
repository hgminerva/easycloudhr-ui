import { Injectable } from '@angular/core';
import { AppSettings } from './../software-appsettings';
import { HttpClient } from '@angular/common/http';
import { OtherIncomeModel } from './other-income.model';

@Injectable({
  providedIn: 'root'
})
export class OtherIncomeService {

  constructor(
    private appSettings: AppSettings,
    private httpClient: HttpClient
  ) { }

  public async OtherIncomeList() {
    return this.httpClient.get(this.appSettings.defaultAPIURLHost + '/api/other/income/list',
      this.appSettings.defaultOptions);
  }

  public async OtherIncomeDetail(id: number) {
    return this.httpClient.get(this.appSettings.defaultAPIURLHost + '/api/other/income/detail/' + id,
      this.appSettings.defaultOptions);
  }

  public async AddOtherIncome() {
    return this.httpClient.post(this.appSettings.defaultAPIURLHost + '/api/other/income/create', "",
      this.appSettings.defaultOptions);
  }

  public async SaveOtherIncome(id: number, objOtherIncome: OtherIncomeModel) {
    return this.httpClient.put(this.appSettings.defaultAPIURLHost + '/api/other/income/save/' + id, JSON.stringify(objOtherIncome), this.appSettings.defaultOptions);
  }

  public async LockOtherIncome(id: number, objOtherIncome: OtherIncomeModel) {
    return this.httpClient.put(this.appSettings.defaultAPIURLHost + '/api/other/income/lock/' + id, JSON.stringify(objOtherIncome), this.appSettings.defaultOptions);
  }

  public async UnlockOtherIncome(id: number) {
    return this.httpClient.put(this.appSettings.defaultAPIURLHost + '/api/other/income/unlock/' + id, "", this.appSettings.defaultOptions);
  }

  public async DeleteOtherIncome(id: number) {
    return this.httpClient.delete(this.appSettings.defaultAPIURLHost + '/api/other/income/delete/' + id,
      this.appSettings.defaultOptions);
  }

  public async AccountList() {
    return this.httpClient.get(this.appSettings.defaultAPIURLHost + '/mst/api/account/list', this.appSettings.defaultOptions);
  }
}
