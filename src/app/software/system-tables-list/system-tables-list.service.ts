import { Injectable } from '@angular/core';
import {AppSettings} from './../software-appsettings';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SystemTablesListService {

  constructor(
    private appSettings: AppSettings,
    private httpClient: HttpClient
  ) { }

  public async TaxExemptionList() {
    return this.httpClient.get(this.appSettings.defaultAPIURLHost + '/api/tax/exemption/list', this.appSettings.defaultOptions);
  }

  public async AddTaxExemption(objTaxExemption: any) {
    return this.httpClient.post(this.appSettings.defaultAPIURLHost + '/api/tax/exemption/create', JSON.stringify(objTaxExemption), this.appSettings.defaultOptions);
  }

  public async SaveTaxExemption(objTaxExemption: any) {
    return this.httpClient.put(this.appSettings.defaultAPIURLHost + '/api/tax/exemption/update/' + objTaxExemption.Id, JSON.stringify(objTaxExemption), this.appSettings.defaultOptions);
  }

  public async DeleteTaxExemption(id: number) {
    return this.httpClient.delete(this.appSettings.defaultAPIURLHost + '/api/tax/exemption/delete/' + id, this.appSettings.defaultOptions);
  }

  public async CodeTableList() {
    return this.httpClient.get(this.appSettings.defaultAPIURLHost + '/api/code/table/list', this.appSettings.defaultOptions);
  }

  public async AddCodeTable(objTableCode: any) {
    return this.httpClient.post(this.appSettings.defaultAPIURLHost + '/api/code/table/create', JSON.stringify(objTableCode), this.appSettings.defaultOptions);
  }

  public async SaveCodeTable(objTableCode: any) {
    return this.httpClient.put(this.appSettings.defaultAPIURLHost + '/api/code/table/update/' + objTableCode.Id, JSON.stringify(objTableCode), this.appSettings.defaultOptions);
  }

  public async DeleteCodeTable(id: number) {
    return this.httpClient.delete(this.appSettings.defaultAPIURLHost + '/api/code/table/delete/' + id, this.appSettings.defaultOptions);
  }
}
