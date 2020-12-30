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

  public async PDFMandatoryReport(mandatory: string, periodId: number, quarter: number, monthnumber: number, companyId: number) {

    let printCaseOptions: any = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('access_token')
      }),
      responseType: "blob"
    };

    return await this.httpClient.get(this.appSettings.defaultAPIURLHost + '/api/pdf/mandatory/report/' + mandatory + '/' + periodId + '/' + quarter + '/' + monthnumber + '/' + companyId, printCaseOptions);
  }

  public async CSVMandatoryReport(mandatory: string, periodId: number, quarter: number, monthnumber: number, companyId: number) {

    return await this.httpClient.get(this.appSettings.defaultAPIURLHost + '/api/report/csv/mandatory/' + mandatory + '/' + periodId + '/' + quarter + '/' + monthnumber + '/' + companyId, this.appSettings.defaultOptions);
  }

  // period List
  public async PeriodDropdownList() {
    return await this.httpClient.get(this.appSettings.defaultAPIURLHost + '/api/pdf/period/dropdown/list', this.appSettings.defaultOptions);
  }

  public async DepartmentDropdownList() {
    return await this.httpClient.get(this.appSettings.defaultAPIURLHost + '/api/pdf/department/dropdown/list', this.appSettings.defaultOptions);
  }

  public async PayrollDropdownList() {
    return await this.httpClient.get(this.appSettings.defaultAPIURLHost + '/api/pdf/payroll/dropdown/list', this.appSettings.defaultOptions);
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

  // ==============
  // Work Sheet PDF
  // ==============
  public async WorkSheetPerDepartment(payId: number, department: string) {
    let printCaseOptions: any = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('access_token')
      }),
      responseType: "blob"
    };

    return await this.httpClient.get(this.appSettings.defaultAPIURLHost + '/api/pdf/payroll/worksheet/per/department/' + payId + '/' + department,
      printCaseOptions);
  }

  // ====================
  // Payroll Other Income
  // ====================
  public async PayrollOtherDeduction(payId: number) {
    let printCaseOptions: any = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('access_token')
      }),
      responseType: "blob"
    };
    return await this.httpClient.get(this.appSettings.defaultAPIURLHost + '/api/pdf/payroll/other/deduction/report/' + payId,
      printCaseOptions);
  }

  // ========================
  // Whithholding Tax Monthly
  // ========================
  public async WithholdingTaxMonthyl(periodId: number, monthnumber: number, companyId: number) {
    let printCaseOptions: any = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('access_token')
      }),
      responseType: "blob"
    };
    return await this.httpClient.get(this.appSettings.defaultAPIURLHost + '/api/pdf/monthly/with-holding-tax/' + periodId + '/' + monthnumber + '/' + companyId,
      printCaseOptions);
  }

  // ====================
  // SSS Loan Report
  // ====================
  public async SSSLoan(periodId: number, monthnumber: number, companyId: number) {
    let printCaseOptions: any = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('access_token')
      }),
      responseType: "blob"
    };
    return await this.httpClient.get(this.appSettings.defaultAPIURLHost + '/api/pdf/sss/loan/report/' + periodId + '/' + monthnumber + '/' + companyId,
      printCaseOptions);
  }

  // =======================
  // Payroll Other Deduction
  // =======================
  public async PayrollOtherIncome(payId: number) {
    let printCaseOptions: any = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('access_token')
      }),
      responseType: "blob"
    };

    return await this.httpClient.get(this.appSettings.defaultAPIURLHost + '/api/pdf/payroll/other/income/report/' + payId,
      printCaseOptions);
  }

  // =======================
  // Company Journal Voucher
  // =======================
  public async CompanyJournalVourcer(payId: number, compnayId: number) {
    let printCaseOptions: any = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('access_token')
      }),
      responseType: "blob"
    };

    return await this.httpClient.get(this.appSettings.defaultAPIURLHost + '/api/pdf/journal/voucher/report/' + payId + '/' + compnayId,
      printCaseOptions);
  }

}