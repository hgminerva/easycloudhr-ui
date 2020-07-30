import { Injectable } from '@angular/core';
import { AppSettings } from 'src/app/app-settings';
import { HttpClient } from '@angular/common/http';
import { ShiftModel } from './shift-code-model';
@Injectable({
  providedIn: 'root'
})
export class ShiftCodeDetailService {

  constructor(
    private appSettings: AppSettings,
    private httpClient: HttpClient
  ) { }


  public async ShiftDetail(id: number) {
    return this.httpClient.get(this.appSettings.defaultAPIURLHost + '/api/shift/detail/' + id, this.appSettings.defaultOptions);
  }

  public async SaveShift(id: number, objShift: ShiftModel) {
    return this.httpClient.put(this.appSettings.defaultAPIURLHost + '/api/shift/save/' + id, JSON.stringify(objShift), this.appSettings.defaultOptions);
  }

  public async LockShift(id: number, objShift: ShiftModel) {
    return this.httpClient.put(this.appSettings.defaultAPIURLHost + '/api/shift/lock/' + id, JSON.stringify(objShift), this.appSettings.defaultOptions);
  }

  public async UnlockShift(id: number) {
    return this.httpClient.put(this.appSettings.defaultAPIURLHost + '/api/shift/unlock/' + id, "", this.appSettings.defaultOptions);
  }
}
