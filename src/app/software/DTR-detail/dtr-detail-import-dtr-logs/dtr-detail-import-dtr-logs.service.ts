import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppSettings } from '../../software-appsettings';

import { DTRLogs } from '../dtr-line.model';

@Injectable({
  providedIn: 'root'
})
export class DtrDetailImportDtrLogsService {

  constructor(
    private appSettings: AppSettings,
    private httpClient: HttpClient,
  ) { }

  public async DTRLineEmployeeDetail(dtrId: number, payrollGroup: string) {
    return this.httpClient.get(this.appSettings.defaultAPIURLHost + '/api/dtr/line/dtr/lines/employees/detail/' + dtrId + '/' + payrollGroup, this.appSettings.defaultOptions);
  }

  public async PostDTRLogs(objDTRLogs: DTRLogs) {
    return this.httpClient.post(this.appSettings.defaultAPIURLHost + '/api/dtr/line/create/lines/dtr/logs/', JSON.stringify(objDTRLogs), this.appSettings.defaultOptions);
  }

  public async DeleteDTRLines(id: number) {
    return await this.httpClient.delete(this.appSettings.defaultAPIURLHost + '/api/dtr/line/delete/dtr/lines/on/import/' + id, this.appSettings.defaultOptions);
  }
}
