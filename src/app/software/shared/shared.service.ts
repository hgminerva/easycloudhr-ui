import { Injectable } from '@angular/core';
import { AppSettings } from './../software-appsettings';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CollectionView, ObservableArray } from '@grapecity/wijmo';
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

  // =============
  // Dropdown List
  // =============
  public async DropdownList(type: string, filter: any) {

    if (type == 'Employee') {
      return await this.httpClient.get(this.appSettings.defaultAPIURLHost + '/api/employee/dropdown/list/' + filter, this.appSettings.defaultOptions);
    }

    if (type == 'City') {
      return await this.httpClient.get(this.appSettings.defaultAPIURLHost + '/api/employee/city/list/', this.appSettings.defaultOptions);
    }

    if (type == 'Copy Rights') {
      return await this.httpClient.get(this.appSettings.defaultAPIURLHost + '/api/user/module/user/list/', this.appSettings.defaultOptions);
    }
  }

  // =======
  // Payslip
  // =======
  public async PDFPayslip(employeeId: number, payId: number) {
    let printCaseOptions: any = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('access_token')
      }),
      responseType: "blob"
    };

    return await this.httpClient.get(this.appSettings.defaultAPIURLHost + '/api/pdf/payslip/' + employeeId + '/' + payId,
      printCaseOptions);
  }

  // =======
  // DTR PDF
  // =======
  public async PDFDTR(dtrId: number) {
    let printCaseOptions: any = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('access_token')
      }),
      responseType: "blob"
    };

    return await this.httpClient.get(this.appSettings.defaultAPIURLHost + '/api/pdf/dtr/' + dtrId,
      printCaseOptions);
  }

  // ==============
  // Work Sheet PDF
  // ==============
  public async PDFWorkSheet(payId: number) {
    let printCaseOptions: any = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('access_token')
      }),
      responseType: "blob"
    };

    return await this.httpClient.get(this.appSettings.defaultAPIURLHost + '/api/pdf/payroll/work/sheet/' + payId,
      printCaseOptions);
  }

  // ============
  // Generate CSV
  // ============
  public generateCSV(collectionView: CollectionView, title: string, fileName: string): void {

    var data = "";
    var collection;

    data = title + '\r\n\n';
    collection = collectionView;

    if (data != "") {
      var label = '';
      for (var s in collection.items[0]) {
        label += s + ',';
      }

      label = label.slice(0, -1);

      data += label + '\r\n';

      collection.moveToFirstPage();
      for (var p = 0; p < collection.pageCount; p++) {
        for (var i = 0; i < collection.items.length; i++) {
          var row = '';
          for (var s in collection.items[i]) {
            row += '"' + collection.items[i][s] + '",';
          }
          row.slice(0, row.length - 1);
          data += row + '\r\n';
        }
        collection.moveToNextPage();
      }
    }

    var csvURL = window.URL.createObjectURL(new Blob([data], { type: 'text/csv;charset=utf-8;' }));
    var tempLink = document.createElement('a');

    tempLink.href = csvURL;
    tempLink.setAttribute('download', fileName);
    tempLink.click();
  }
}
