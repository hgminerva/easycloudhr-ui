import { Injectable } from '@angular/core';
import { AppSettings } from 'src/app/app-settings';
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

  public async DeleteTaxExemption(id: number) {
    return this.httpClient.delete(this.appSettings.defaultAPIURLHost + '/api/tax/exemption/delete/' + id, this.appSettings.defaultOptions);
  }

  public async TaxCodeTableList() {
    return this.httpClient.get(this.appSettings.defaultAPIURLHost + '/api/code/table/list', this.appSettings.defaultOptions);
  }

  public async DeleteCodeTable(id: number) {
    return this.httpClient.delete(this.appSettings.defaultAPIURLHost + '/api/code/table/delete/' + id, this.appSettings.defaultOptions);
  }
}
