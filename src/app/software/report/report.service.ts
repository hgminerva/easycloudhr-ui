import { Injectable } from '@angular/core';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppSettings } from '../software-appsettings';

@Injectable({
  providedIn: 'root'
})
export class ReportService {

  
  constructor(
    private appSettings: AppSettings,
    private httpClient: HttpClient
  ) { }

   public async DemographicsReport(companyId: number) {

    let printCaseOptions: any = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('access_token')
      }),
      responseType: "blob"
    };

    return await this.httpClient.get(this.appSettings.defaultAPIURLHost + '/api/pdf/demographics/report/' + companyId, printCaseOptions);
  }

  public async MandatoryReport(mandatory: string, periodId: number, quarter: number, monthnumber: number, companyId: number) {

    let printCaseOptions: any = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('access_token')
      }),
      responseType: "blob"
    };

    return await this.httpClient.get(this.appSettings.defaultAPIURLHost + '/api/pdf/mandatory/report/' + mandatory + '/' + periodId + '/' + quarter + '/' + monthnumber + '/' + companyId, printCaseOptions);
  }

  // period List
  public async PeriodDropdownList() {
    return await this.httpClient.get(this.appSettings.defaultAPIURLHost + '/api/pdf/period/dropdown/list', this.appSettings.defaultOptions);
  }

  // Company List
  public async CompanyDropdownList() {
    return await this.httpClient.get(this.appSettings.defaultAPIURLHost + '/api/pdf/company/dropdown/list', this.appSettings.defaultOptions);
  }

  // Month List
  public MonthDropdownList() {
    let monthnumbers = [
      { Id: 1, Value: 'January' },
      { Id: 2, Value: 'Febuary' },
      { Id: 3, Value: 'March' },
      { Id: 4, Value: 'April' },
      { Id: 5, Value: 'May' },
      { Id: 6, Value: 'June' },
      { Id: 7, Value: 'July' },
      { Id: 8, Value: 'August' },
      { Id: 9, Value: 'September' },
      { Id: 10, Value: 'October' },
      { Id: 11, Value: 'November' },
      { Id: 12, Value: 'December' },
    ];
    return monthnumbers;
  }

  // Month List
  public MandatoryDropdownList() {
    return [
      { Code: 'sss', Value: 'SSS' },
      { Code: 'phic', Value: 'PHIC' },
      { Code: 'hdmf', Value: 'HDMF' },
    ];
  }
}
