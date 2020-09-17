import { Injectable } from '@angular/core';
import { AppSettings } from './../software-appsettings';
import { HttpClient } from '@angular/common/http';
import { ShiftModel } from './shift-code-model';
import { ShiftLineModel } from './shift-code-line.model';

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

  public async ShiftLineList(shiftId: number) {
    return await this.httpClient.get(this.appSettings.defaultAPIURLHost + '/api/shift/line/list/' + shiftId, this.appSettings.defaultOptions);
  }

  public async AddShiftLine(objShiftLines: ShiftLineModel) {
    return await this.httpClient.post(this.appSettings.defaultAPIURLHost + '/api/shift/line/create', JSON.stringify(objShiftLines), this.appSettings.defaultOptions);
  }

  public async UpdateTRLine(id: number, objShiftLine: ShiftLineModel) {
    return await this.httpClient.put(this.appSettings.defaultAPIURLHost + '/api/shift/line/update/' + id, JSON.stringify(objShiftLine), this.appSettings.defaultOptions);
  }

  public async DeleteShiftLine(id: number) {
    return await this.httpClient.delete(this.appSettings.defaultAPIURLHost + '/api/shift/line/delete/' + id, this.appSettings.defaultOptions);
  }

  public async DayList() {
    return this.httpClient.get(this.appSettings.defaultAPIURLHost + '/api/shift/line/day/list', this.appSettings.defaultOptions);
  }

}
