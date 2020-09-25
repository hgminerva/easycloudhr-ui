import { Injectable } from '@angular/core';
import { AppSettings } from './../software-appsettings';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  constructor(
    private appSettings: AppSettings,
    private httpClient: HttpClient
  ) { }

  public async EmployeeList(payrollGroup: string) {
    return await this.httpClient.get(this.appSettings.defaultAPIURLHost + '/api/employee/dropdown/list/' + payrollGroup, this.appSettings.defaultOptions);
  }
  
  public async CityDropdownList() {
    return await this.httpClient.get(this.appSettings.defaultAPIURLHost + '/api/employee/city/list/', this.appSettings.defaultOptions);
  }
}
