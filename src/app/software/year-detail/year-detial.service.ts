import { Injectable } from '@angular/core';
import { AppSettings } from './../software-appsettings';
import { HttpClient } from '@angular/common/http';

import { YearModel } from './year.model';
import { YearDateList, YearDateModel } from './year-date.model';
import { YearLeaveCreditsModel } from './year-leave-credits.model';

@Injectable({
  providedIn: 'root'
})
export class YearDetialService {

  constructor(
    private appSettings: AppSettings,
    private httpClient: HttpClient
  ) { }

  public async YearDetail(id: number) {
    return this.httpClient.get(this.appSettings.defaultAPIURLHost + '/api/year/detail/' + id, this.appSettings.defaultOptions);
  }

  public async SaveYear(id: number, objYear: YearModel) {
    return this.httpClient.put(this.appSettings.defaultAPIURLHost + '/api/year/save/' + id, JSON.stringify(objYear), this.appSettings.defaultOptions);
  }

  public async LockYear(id: number, objYear: YearModel) {
    return this.httpClient.put(this.appSettings.defaultAPIURLHost + '/api/year/lock/' + id, JSON.stringify(objYear), this.appSettings.defaultOptions);
  }

  public async UnlockYear(id: number) {
    return this.httpClient.put(this.appSettings.defaultAPIURLHost + '/api/year/unlock/' + id, "", this.appSettings.defaultOptions);
  }

  public async YearDateList(yearId: number) {
    return await this.httpClient.get(this.appSettings.defaultAPIURLHost + '/api/year/date/list/' + yearId, this.appSettings.defaultOptions);
  }

  public async AddYearDate(objYearDates: YearDateModel) {
    return await this.httpClient.post(this.appSettings.defaultAPIURLHost + '/api/year/date/create', JSON.stringify(objYearDates), this.appSettings.defaultOptions);
  }

  public async AddYearDateToBranches(objYearDateLines: YearDateList) {
    return await this.httpClient.post(this.appSettings.defaultAPIURLHost + '/api/year/date/create/branches', JSON.stringify(objYearDateLines), this.appSettings.defaultOptions);
  }

  public async Updatedate(id: number, objYearDate: YearDateModel) {
    return await this.httpClient.put(this.appSettings.defaultAPIURLHost + '/api/year/date/update/' + id, JSON.stringify(objYearDate), this.appSettings.defaultOptions);
  }

  public async DeleteYearDate(id: number) {
    return await this.httpClient.delete(this.appSettings.defaultAPIURLHost + '/api/year/date/delete/' + id, this.appSettings.defaultOptions);
  }

  public async DayTypeDropdown() {
    return this.httpClient.get(this.appSettings.defaultAPIURLHost + '/api/year/date/date/type/dropdown', this.appSettings.defaultOptions);
  }

  public async BranchDropdown() {
    return this.httpClient.get(this.appSettings.defaultAPIURLHost + '/api/year/date/branch/dropdown', this.appSettings.defaultOptions);
  }

  public async YearLeaveCreditsList(yearId: number) {
    console.log('Fire');
    return await this.httpClient.get(this.appSettings.defaultAPIURLHost + '/api/mst/year/leave/credits/list/' + yearId, this.appSettings.defaultOptions);
  }

  public async AddYearLeaveCredits(yearId: number, objYearLeaveCreditss: YearLeaveCreditsModel) {
    return await this.httpClient.post(this.appSettings.defaultAPIURLHost + '/api/mst/year/leave/credits/create/' + yearId, JSON.stringify(objYearLeaveCreditss), this.appSettings.defaultOptions);
  }

  public async UpdateYearLeaveCredits(id: number, objYearLeaveCredits: YearLeaveCreditsModel) {
    return await this.httpClient.put(this.appSettings.defaultAPIURLHost + '/api/mst/year/leave/credits/update/' + id, JSON.stringify(objYearLeaveCredits), this.appSettings.defaultOptions);
  }

  public async DeleteYearLeaveCredits(id: number) {
    return await this.httpClient.delete(this.appSettings.defaultAPIURLHost + '/api/mst/year/leave/credits/delete/' + id, this.appSettings.defaultOptions);
  }
}
