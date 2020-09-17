import { Injectable } from '@angular/core';
import { AppSettings } from './../software-appsettings';
import { HttpClient } from '@angular/common/http';

import { OtherDeductionModel } from './other-deduction.model';

@Injectable({
  providedIn: 'root'
})
export class OtherDeductionsService {

  constructor(
    private appSettings: AppSettings,
    private httpClient: HttpClient
  ) { }

  public async OtherDeductionList() {
    return this.httpClient.get(this.appSettings.defaultAPIURLHost + '/api/other/deduction/list',
                               this.appSettings.defaultOptions);
  }

  public async OtherDeductionDetail(id: number) {
    return this.httpClient.get(this.appSettings.defaultAPIURLHost + '/api/other/deduction/detail/' + id,
                               this.appSettings.defaultOptions);
  }

  public async AddOtherDeduction() {
    return this.httpClient.post(this.appSettings.defaultAPIURLHost + '/api/other/deduction/create', "",
                                this.appSettings.defaultOptions);
  }

  public async SaveOtherDeduction(id: number, objOtherDeduction: OtherDeductionModel) {
    return this.httpClient.put(this.appSettings.defaultAPIURLHost + '/api/other/deduction/save/' + id, JSON.stringify(objOtherDeduction), this.appSettings.defaultOptions);
  }

  public async LockOtherDeduction(id: number, objOtherDeduction: OtherDeductionModel) {
    return this.httpClient.put(this.appSettings.defaultAPIURLHost + '/api/other/deduction/lock/' + id, JSON.stringify(objOtherDeduction), this.appSettings.defaultOptions);
  }

  public async UnlockOtherDeduction(id: number) {
    return this.httpClient.put(this.appSettings.defaultAPIURLHost + '/api/other/deduction/unlock/' + id, "", this.appSettings.defaultOptions);
  }

  public async DeleteOtherDeduction(id: number) {
    return this.httpClient.delete(this.appSettings.defaultAPIURLHost + '/api/other/deduction/delete/' + id,
                                  this.appSettings.defaultOptions);
  }
}
