import { Injectable } from '@angular/core';
import { AppSettings } from 'src/app/app-settings';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CompanyListService {

  constructor(
    private appSettings: AppSettings,
    private httpClient: HttpClient
  ) { }

  public async CompanyList() {
    return this.httpClient.get(this.appSettings.defaultAPIURLHost + '/api/company/list',
                               this.appSettings.defaultOptions);
  }

  public async AddCompany() {
    return this.httpClient.post(this.appSettings.defaultAPIURLHost + '/api/company/create', "",
                                this.appSettings.defaultOptions);
  }

  public async DeleteCompany(id: number) {
    return this.httpClient.delete(this.appSettings.defaultAPIURLHost + '/api/company/delete/' + id,
                                  this.appSettings.defaultOptions);
  }
}
