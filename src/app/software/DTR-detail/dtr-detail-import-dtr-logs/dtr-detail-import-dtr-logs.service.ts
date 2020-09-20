import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppSettings } from '../../software-appsettings';

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
}
