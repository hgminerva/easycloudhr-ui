import { Injectable } from '@angular/core';
import {AppSettings} from './../software-appsettings';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TaxExemptionListService {

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

}