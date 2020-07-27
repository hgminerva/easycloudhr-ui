import { Injectable } from '@angular/core';
import { AppSettings } from 'src/app/app-settings';
import { HttpClient } from '@angular/common/http';
import { CompanyModel } from './company.model';

@Injectable({
  providedIn: 'root'
})
export class CompanyDetialService {

  constructor(
    private appSettings: AppSettings,
    private httpClient: HttpClient
  ) { }

  public async CompanyDetail(id: number) {
    return this.httpClient.get(this.appSettings.defaultAPIURLHost + '/api/company/detail/' + id, this.appSettings.defaultOptions);
  }

  public async SaveCompany(id: number, objCompany: CompanyModel) {
    return this.httpClient.put(this.appSettings.defaultAPIURLHost + '/api/company/save/' + id, JSON.stringify(objCompany), this.appSettings.defaultOptions);
  }

  public async LockCompany(id: number, objCompany: CompanyModel) {
    return this.httpClient.put(this.appSettings.defaultAPIURLHost + '/api/company/lock/' + id, JSON.stringify(objCompany), this.appSettings.defaultOptions);
  }

  public async UnlockCompany(id: number) {
    return this.httpClient.put(this.appSettings.defaultAPIURLHost + '/api/company/unlock/' + id, "", this.appSettings.defaultOptions);
  }
}
