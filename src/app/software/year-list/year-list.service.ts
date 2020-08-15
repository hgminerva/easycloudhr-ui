import { Injectable } from '@angular/core';
import { AppSettings } from 'src/app/app-settings';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class YearListService {

  constructor(
    private appSettings: AppSettings,
    private httpClient: HttpClient
  ) { }

  public async YearList() {
    return this.httpClient.get(this.appSettings.defaultAPIURLHost + '/api/year/list', this.appSettings.defaultOptions);
  }

  public async AddYear() {
    return this.httpClient.post(this.appSettings.defaultAPIURLHost + '/api/year/create', "",
      this.appSettings.defaultOptions);
  }

  public async DeleteYear(id: number) {
    return this.httpClient.delete(this.appSettings.defaultAPIURLHost + '/api/year/delete/' + id,
      this.appSettings.defaultOptions);
  }

}
