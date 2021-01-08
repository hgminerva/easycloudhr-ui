import { Injectable } from '@angular/core';
import { AppSettings } from './../software-appsettings';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SystemTablesListService {

  constructor(
    private appSettings: AppSettings,
    private httpClient: HttpClient
  ) { }

  public async CategoryDropdownList() {
    return this.httpClient.get(this.appSettings.defaultAPIURLHost + '/mst/api/code/table/category/dropdown/list', this.appSettings.defaultOptions);
  }

  public async CodeTableList(category: string) {
    console.log(category);
    return this.httpClient.get(this.appSettings.defaultAPIURLHost + '/mst/api/code/table/list/' + category, this.appSettings.defaultOptions);
  }

  public async AddCodeTable(objTableCode: any) {
    return this.httpClient.post(this.appSettings.defaultAPIURLHost + '/mst/api/code/table/create', JSON.stringify(objTableCode), this.appSettings.defaultOptions);
  }

  public async SaveCodeTable(objTableCode: any) {
    return this.httpClient.put(this.appSettings.defaultAPIURLHost + '/mst/api/code/table/update/' + objTableCode.Id, JSON.stringify(objTableCode), this.appSettings.defaultOptions);
  }

  public async DeleteCodeTable(id: number) {
    return this.httpClient.delete(this.appSettings.defaultAPIURLHost + '/mst/api/code/table/delete/' + id, this.appSettings.defaultOptions);
  }

  // Labels
  public async LabelList() {
    return this.httpClient.get(this.appSettings.defaultAPIURLHost + '/mst/api/labels/list', this.appSettings.defaultOptions);
  }

  public async AddLabel(objLabel: any) {
    return this.httpClient.post(this.appSettings.defaultAPIURLHost + '/mst/api/labels/create', JSON.stringify(objLabel), this.appSettings.defaultOptions);
  }

  public async SaveLabel(objLabel: any) {
    return this.httpClient.put(this.appSettings.defaultAPIURLHost + '/mst/api/labels/update/' + objLabel.Id, JSON.stringify(objLabel), this.appSettings.defaultOptions);
  }

  public async DeleteLabel(id: number) {
    return this.httpClient.delete(this.appSettings.defaultAPIURLHost + '/mst/api/labels/delete/' + id, this.appSettings.defaultOptions);
  }

}
