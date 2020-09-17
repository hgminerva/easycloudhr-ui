import { Injectable } from '@angular/core';
import {AppSettings} from './../software-appsettings';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ShiftCodeListService {

  constructor(
    private appSettings: AppSettings,
    private httpClient: HttpClient
  ) { }

  public async ShiftCodeList() {
    return this.httpClient.get(this.appSettings.defaultAPIURLHost + '/api/shift/list', this.appSettings.defaultOptions);
  }

  public async AddShiftCode() {
    return this.httpClient.post(this.appSettings.defaultAPIURLHost + '/api/shift/create', "", this.appSettings.defaultOptions);
  }

  public async DeleteShiftCode(id: number) {
    return this.httpClient.delete(this.appSettings.defaultAPIURLHost + '/api/shift/delete/' + id, this.appSettings.defaultOptions);
  }
}
