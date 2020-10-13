import { Injectable } from '@angular/core';
import { AppSettings } from './../software-appsettings';
import { HttpClient } from '@angular/common/http';

import { TaxExemptionModel } from './tax-exemption.model';
import { TaxExemptionTableModel } from './tax-exemption-table.model';

@Injectable({
  providedIn: 'root'
})
export class TaxExemptionDetailService {

  constructor(
    private appSettings: AppSettings,
    private httpClient: HttpClient
  ) { }

  public async TaxExemptionDetail(id: number) {
    return this.httpClient.get(this.appSettings.defaultAPIURLHost + '/api/mst/tax/exemption/detail/' + id, this.appSettings.defaultOptions);
  }

  public async SaveTaxExemption(id: number, objTaxExemption: TaxExemptionModel) {
    return this.httpClient.put(this.appSettings.defaultAPIURLHost + '/api/mst/tax/exemption/update/' + id, JSON.stringify(objTaxExemption), this.appSettings.defaultOptions);
  }

  public async TaxExemptionTableList(teId: number) {
    return await this.httpClient.get(this.appSettings.defaultAPIURLHost + '/api/mst/tax/exemption/table/list/' + teId, this.appSettings.defaultOptions);
  }

  public async TaxTableDropdownList() {
    return await this.httpClient.get(this.appSettings.defaultAPIURLHost + '/api/mst/tax/exemption/table/tax/table/dropdown', this.appSettings.defaultOptions);
  }

  public async AddTaxExemptionTable(teId: number, objTaxExemptionTable: TaxExemptionTableModel) {
    return await this.httpClient.post(this.appSettings.defaultAPIURLHost + '/api/mst/tax/exemption/table/create/' + teId, JSON.stringify(objTaxExemptionTable), this.appSettings.defaultOptions);
  }

  public async UpdateExemptionTable(id: number, objTaxExemptionLine: TaxExemptionTableModel) {
    return await this.httpClient.put(this.appSettings.defaultAPIURLHost + '/api/mst/tax/exemption/table/update/' + id, JSON.stringify(objTaxExemptionLine), this.appSettings.defaultOptions);
  }

  public async DeleteTaxExemptionTable(id: number) {
    return await this.httpClient.delete(this.appSettings.defaultAPIURLHost + '/api/mst/tax/exemption/table/delete/' + id, this.appSettings.defaultOptions);
  }

}
