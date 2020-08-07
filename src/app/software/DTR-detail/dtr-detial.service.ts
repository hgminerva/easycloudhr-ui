import { Injectable } from '@angular/core';
import { AppSettings } from 'src/app/app-settings';
import { HttpClient } from '@angular/common/http';

import { DTRModel } from './dtr-detial.model';
import { from, Subject } from 'rxjs';
import { DTRLineModel, DTRLines } from './dtr-line.model';

import * as wjcGrid from '@grapecity/wijmo.grid';
import { CollectionView, ObservableArray } from '@grapecity/wijmo';
@Injectable({
  providedIn: 'root'
})
export class DtrDetialService {

  constructor(
    private appSettings: AppSettings,
    private httpClient: HttpClient
  ) { }

  // DTR DROPDOWN
  public async PayrollGroupList() {
    return await this.httpClient.get(this.appSettings.defaultAPIURLHost + '/api/dtr/payroll/group/list', this.appSettings.defaultOptions);
  }

  public async YearList() {
    return await this.httpClient.get(this.appSettings.defaultAPIURLHost + '/api/dtr/year/list', this.appSettings.defaultOptions);
  }

  public async OTList() {
    return await this.httpClient.get(this.appSettings.defaultAPIURLHost + '/api/dtr/over/time/list', this.appSettings.defaultOptions);
  }

  public async LAList() {
    return await this.httpClient.get(this.appSettings.defaultAPIURLHost + '/api/dtr/leave/application/list', this.appSettings.defaultOptions);
  }

  public async CSList() {
    return await this.httpClient.get(this.appSettings.defaultAPIURLHost + '/api/dtr/change/shift/list', this.appSettings.defaultOptions);
  }

  public async UserList() {
    return await this.httpClient.get(this.appSettings.defaultAPIURLHost + '/api/dtr/user/list', this.appSettings.defaultOptions);
  }

  // DTR
  public async DTRDetail(id: number) {
    return await this.httpClient.get(this.appSettings.defaultAPIURLHost + '/api/dtr/detail/' + id, this.appSettings.defaultOptions);
  }

  public async SaveDTR(id: number, objDTR: DTRModel) {
    return await this.httpClient.put(this.appSettings.defaultAPIURLHost + '/api/DTR/save/' + id, JSON.stringify(objDTR), this.appSettings.defaultOptions);
  }

  public async LockDTR(id: number, objDTR: DTRModel) {
    return await this.httpClient.put(this.appSettings.defaultAPIURLHost + '/api/DTR/lock/' + id, JSON.stringify(objDTR), this.appSettings.defaultOptions);
  }

  public async UnlockDTR(id: number) {
    return await this.httpClient.put(this.appSettings.defaultAPIURLHost + '/api/DTR/unlock/' + id, "", this.appSettings.defaultOptions);
  }

  // DTR LINE
  public async DTRLineList(dTRId: number) {
    return await this.httpClient.get(this.appSettings.defaultAPIURLHost + '/api/dtr/line/list/' + dTRId, this.appSettings.defaultOptions);
  }

  public async ADDTRLine(objDTRLines: DTRLines) {
    return await this.httpClient.post(this.appSettings.defaultAPIURLHost + '/api/dtr/line/create/lines/', JSON.stringify(objDTRLines), this.appSettings.defaultOptions);
  }

  public async UpdateTRLine(id: number, objDTRLine: DTRLineModel) {
    return await this.httpClient.put(this.appSettings.defaultAPIURLHost + '/api/dtr/line/update/' + id, JSON.stringify(objDTRLine), this.appSettings.defaultOptions);
  }

  public async DeleteDTRLine(id: number) {
    return await this.httpClient.delete(this.appSettings.defaultAPIURLHost + '/api/dtr/line/delete/' + id, this.appSettings.defaultOptions);
  }

  // DTR LINE DROPDOWN
  public async EmployeeList(payrollGroup: string) {
    return await this.httpClient.get(this.appSettings.defaultAPIURLHost + '/api/dtr/line/employee/filteredBy/' + payrollGroup, this.appSettings.defaultOptions);
  }

  public async DateTypeList() {
    return await this.httpClient.get(this.appSettings.defaultAPIURLHost + '/api/dtr/line/date/type/list', this.appSettings.defaultOptions);
  }

  public async BranchList() {
    return await this.httpClient.get(this.appSettings.defaultAPIURLHost + '/api/dtr/line/branch/list', this.appSettings.defaultOptions);
  }

  public async ShiftsList() {
    return await this.httpClient.get(this.appSettings.defaultAPIURLHost + '/api/dtr/line/shift/list', this.appSettings.defaultOptions);
  }

  public listDTRLinesSubject = new Subject<ObservableArray>();
  public listDTRLinesObservable = this.listDTRLinesSubject.asObservable();

  public ListDTRLines(dTRId: number): void {
    let listDTRLinesObservableArray = new ObservableArray();
    this.listDTRLinesSubject.next(listDTRLinesObservableArray);

    this.httpClient.get(this.appSettings.defaultAPIURLHost + '/api/dtr/line/list/' + dTRId, this.appSettings.defaultOptions).subscribe(
      response => {
        var results = response;
        if (results["length"] > 0) {
          for (var i = 0; i <= results["length"] - 1; i++) {
            listDTRLinesObservableArray.push({
              Id: results[i].Id,
              DTRId: results[i].DTRId,
              EmployeeId: results[i].EmployeeId,
              Employee: results[i].Employee,
              DTRDate: results[i].DTRDate,
              DateType: results[i].DateType,
              IsRestDay: results[i].IsRestDay,
              ShiftId: results[i].ShiftId,
              Shift: results[i].Shift,
              Branch: results[i].Branch,
              TimeIn1: results[i].TimeIn1,
              TimeOut1: results[i].TimeOut1,
              TimeIn2: results[i].TimeIn2,
              TimeOut2: results[i].TimeOut2,
              IsOnLeave: results[i].IsOnLeave,
              IsOnLeaveHalfDay: results[i].IsOnLeaveHalfDay,
              IsOnOfficialBusiness: results[i].IsOnOfficialBusiness,
              IsOnOfficialBusinessHalfDay: results[i].IsOnOfficialBusinessHalfDay,
              IsAbsent: results[i].IsAbsent,
              IsAbsentHalfDay: results[i].IsAbsentHalfDay,
              NumberOfHoursWorked: results[i].NumberOfHoursWorked,
              OvertimeHours: results[i].OvertimeHours,
              NightDifferentialHours: results[i].NightDifferentialHours,
              LateHours: results[i].LateHours,
              UndertimeHours: results[i].UndertimeHours,
              DailyPay: results[i].DailyPay,
              RestdayPay: results[i].RestdayPay,
              HolidayPay: results[i].HolidayPay,
              OvertimePay: results[i].OvertimePay,
              NightDifferentialPay: results[i].NightDifferentialPay,
              LateDeduction: results[i].LateDeduction,
              UndertimeDeduction: results[i].UndertimeDeduction,
              AbsentDeduction: results[i].AbsentDeduction,
              DailyNetPay: results[i].DailyNetPay,
              Remarks: results[i].Remarks
            });
          }
        }
        this.listDTRLinesSubject.next(listDTRLinesObservableArray);
      }
    );
  }


}
