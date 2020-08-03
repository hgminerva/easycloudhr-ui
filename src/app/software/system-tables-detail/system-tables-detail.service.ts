import { Injectable } from '@angular/core';
import { AppSettings } from 'src/app/app-settings';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SystemTablesDetailService {

  constructor(
    private appSettings: AppSettings,
    private httpClient: HttpClient
  ) { }

  public async AddTaxExemption(objTaxExemption) {
    return this.httpClient.post(this.appSettings.defaultAPIURLHost + '/api/tax/exemption/create', JSON.stringify(objTaxExemption), this.appSettings.defaultOptions);
  }


  public async SaveTaxExemption(objTaxExemption: any, id: number) {
    return this.httpClient.post(this.appSettings.defaultAPIURLHost + '/api/tax/exemption/save/' + id, JSON.stringify(objTaxExemption), this.appSettings.defaultOptions);
  }

  public async AddCodeTable(objCodeTable: any) {
    return this.httpClient.post(this.appSettings.defaultAPIURLHost + '/api/code/table/create', JSON.stringify(objCodeTable), this.appSettings.defaultOptions);
  }

  public async SaveCodeTable(objCodeTable: any, id: number) {
    return this.httpClient.post(this.appSettings.defaultAPIURLHost + '/api/code/table/save/' + id, JSON.stringify(objCodeTable), this.appSettings.defaultOptions);
  }
}
