import { Injectable } from '@angular/core';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppSettings } from '../software-appsettings';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReportService {


  constructor(
    private appSettings: AppSettings,
    private httpClient: HttpClient
  ) { }

  public async PayrollGroupList() {
    return this.httpClient.get(this.appSettings.defaultAPIURLHost + '/api/employee/payroll/group/list', this.appSettings.defaultOptions);
  }

  public async DTRList() {
    return this.httpClient.get(this.appSettings.defaultAPIURLHost + '/api/pdf/dtr/list', this.appSettings.defaultOptions);
  }

  public async DemographicsReport(companyId: number, payrollGroup: string) {

    if (payrollGroup == 'All') {
      let printCaseOptions: any = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + localStorage.getItem('access_token')
        }),
        responseType: "blob"
      };

      return await this.httpClient.get(this.appSettings.defaultAPIURLHost + '/api/pdf/demographics/report/' + companyId, printCaseOptions);
    }
    else {
      let printCaseOptions: any = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + localStorage.getItem('access_token')
        }),
        responseType: "blob"
      };

      return await this.httpClient.get(this.appSettings.defaultAPIURLHost + '/api/pdf/demographics/by-payroll-group/report/' + companyId + '/' + payrollGroup, printCaseOptions);
    }


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

  public async HDMFLoanReport(periodId: number, monthnumber: number, companyId: number) {

    let printCaseOptions: any = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('access_token')
      }),
      responseType: "blob"
    };

    return await this.httpClient.get(this.appSettings.defaultAPIURLHost + '/api/pdf/hdmf/loan/report/' + periodId + '/' + monthnumber + '/' + companyId, printCaseOptions);
  }

  public async CSVMandatoryReport(mandatory: string, periodId: number, quarter: number, monthnumber: number, companyId: number) {
    return await this.httpClient.get(
      this.appSettings.defaultAPIURLHost
      + '/api/report/csv/mandatory/'
      + mandatory + '/'
      + periodId + '/'
      + quarter + '/'
      + monthnumber + '/'
      + companyId,
      this.appSettings.defaultOptions);
  }

  // ===================
  // CSV ATM Bank Report
  // ===================
  public async ATMBankReport(payrollId: number, companyId: number) {
    return await this.httpClient.get(
      this.appSettings.defaultAPIURLHost
      + '/api/report/csv/employee/pay/'
      + payrollId + '/'
      + companyId,
      this.appSettings.defaultOptions);
  }

  // ===================
  // CSV ATM Bank Report
  // ===================
  public async DemographicsCSVReport(companyId: number) {
    return await this.httpClient.get(
      this.appSettings.defaultAPIURLHost
      + '/api/report/csv/demographics/report/'
      + companyId,
      this.appSettings.defaultOptions);
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

  public async BranchList() {
    return this.httpClient.get(this.appSettings.defaultAPIURLHost + '/api/pdf/branch/list', this.appSettings.defaultOptions);
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
  public async PayrollWorkSheetPDF(payId: number, branch: string, companyId: number) {
    let printCaseOptions: any = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('access_token')
      }),
      responseType: "blob"
    };

    return await this.httpClient.get(this.appSettings.defaultAPIURLHost + '/api/pdf/payroll/worksheet/per/department/' + payId + '/' + branch + '/' + companyId,
      printCaseOptions);
  }

  // ==============
  // Payslip Report
  // ==============
  public async PayslipReport(payId: number, branch: string) {
    let printCaseOptions: any = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('access_token')
      }),
      responseType: "blob"
    };

    return await this.httpClient.get(this.appSettings.defaultAPIURLHost + '/api/pdf/payslip-list/' + payId + '/' + branch,
      printCaseOptions);
  }

  // ===================
  // Loan Summary Report
  // ===================
  public async LoanSummaryReport(startDate: string, endDate: string) {
    let printCaseOptions: any = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('access_token')
      }),
      responseType: "blob"
    };

    return await this.httpClient.get(this.appSettings.defaultAPIURLHost + '/api/pdf/loan/summary/report/' + startDate + '/' + endDate,
      printCaseOptions);
  }

  // ==================
  // Loan Ledger Report
  // ==================
  public async LoanLedgerReport(loanId: number) {
    let printCaseOptions: any = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('access_token')
      }),
      responseType: "blob"
    };

    return await this.httpClient.get(this.appSettings.defaultAPIURLHost + '/api/pdf/loan/ledger/report/' + loanId,
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
  public async WithholdingTaxMonthy(periodId: number, monthnumber: number, companyId: number) {
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

  // ========================
  // Whithholding Tax Monthly
  // ========================
  public async WithholdingTaxMonthyCSV(periodId: number, monthnumber: number, companyId: number) {
    return await this.httpClient.get(this.appSettings.defaultAPIURLHost + '/api/report/csv/monthly/with-holding-tax/' + periodId + '/' + monthnumber + '/' + companyId,
      this.appSettings.defaultOptions);
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

  public async SSSLoanData(periodId: number, monthnumber: number, companyId: number) {
    return await this.httpClient.get(this.appSettings.defaultAPIURLHost + '/api/report/csv/sss/loan/report/' + periodId + '/' + monthnumber + '/' + companyId,
      this.appSettings.defaultOptions);
  }


  // public SSSLoanData(periodId: number, monthnumber: number, companyId: number): Observable<any> {
  //   return new Observable<any>((observer) => {
  //     let data_csv: any = {
  //       GrandTotal: 0,
  //       List: []
  //     };
  //     this.httpClient.get(this.appSettings.defaultAPIURLHost + '/api/report/csv/sss/loan/report/' + periodId + '/' + monthnumber + '/' + companyId,
  //     this.appSettings.defaultOptions).subscribe(
  //       (data: any) => {
  //         let results = data;
  //         data_csv.GrandTotal = results.GrandTotal.toFixed(2);

  //         if (results != null) {
  //           var data = results.SSSLoanList;

  //           if (data.length > 0) {
  //             for (let i = 0; i <= data.length - 1; i++) {
  //               data_csv.List.push({
  //                 SSSNumber: data[i].SSSNumber,
  //                 EmployeeName: data[i].EmployeeName,
  //                 PayrollNumber: data[i].PayrollNumber,
  //                 LoanAmount: data[i].LoanAmount.toFixed(2),
  //                 Penalty: data[i].Penalty.toFixed(2),
  //                 Total: data[i].Total.toFixed(2)
  //               });
  //             }
  //           }
  //         }

  //         observer.next(data_csv);
  //         observer.complete();
  //       },
  //       error => {
  //         observer.next([]);
  //         observer.complete();
  //       }
  //     );
  //   });
  // }

  // ====================
  // SSS Calamity Loan Report
  // ====================
  public async SSSCalamityLoan(periodId: number, monthnumber: number, companyId: number) {
    console.log(periodId, monthnumber, companyId);
    let printCaseOptions: any = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('access_token')
      }),
      responseType: "blob"
    };
    return await this.httpClient.get(this.appSettings.defaultAPIURLHost + '/api/pdf/sss/calamity/loan/report/' + periodId + '/' + monthnumber + '/' + companyId,
      printCaseOptions);
  }

  public async SSSCalamityLoanData(periodId: number, monthnumber: number, companyId: number) {
    return await this.httpClient.get(this.appSettings.defaultAPIURLHost + '/api/report/csv/sss/calamity/loan/report/' + periodId + '/' + monthnumber + '/' + companyId,
      this.appSettings.defaultOptions);
  }

  public async HDMFLoanData(periodId: number, monthnumber: number, companyId: number) {
    return await this.httpClient.get(this.appSettings.defaultAPIURLHost + '/api/report/csv/hdmf/loan/report/' + periodId + '/' + monthnumber + '/' + companyId,
      this.appSettings.defaultOptions);
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
  // Payroll Other Deduction
  // =======================
  public async PayrollOtherIncomePayslip(payId: number, branch: string) {
    let printCaseOptions: any = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('access_token')
      }),
      responseType: "blob"
    };

    return await this.httpClient.get(this.appSettings.defaultAPIURLHost + '/api/pdf/payroll/other/income/payslip/' + payId + '/' + branch,
      printCaseOptions);
  }

  // =====================
  // Loan Deduction Report
  // =====================
  public async LoanDeductionReport(payId: number) {
    let printCaseOptions: any = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('access_token')
      }),
      responseType: "blob"
    };

    return await this.httpClient.get(this.appSettings.defaultAPIURLHost + '/api/pdf/loan/deduction/report/' + payId,
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

  // ====================
  // Leave Ledger Summary
  // ====================
  public async LeaveLedgerSummary(startDate: string, endDate: string, payrollGroup: string) {
    let printCaseOptions: any = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('access_token')
      }),
      responseType: "blob"
    };

    return await this.httpClient.get(this.appSettings.defaultAPIURLHost + '/api/pdf/leave/ledger/summary/' + startDate + '/' + endDate + '/' + payrollGroup,
      printCaseOptions);
  }

  // ============
  // Leave Ledger
  // ============
  public async LeaveLedger(startDate: string, endDate: string, employeeId: number) {
    let printCaseOptions: any = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('access_token')
      }),
      responseType: "blob"
    };

    return await this.httpClient.get(this.appSettings.defaultAPIURLHost + '/api/pdf/leave/ledger/' + startDate + '/' + endDate + '/' + employeeId,
      printCaseOptions);
  }

  // ========================
  // Leave Application Detail
  // ========================
  public async LeaveApplicationDetail(startDate: string, endDate: string, payrollGroup: string) {
    let printCaseOptions: any = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('access_token')
      }),
      responseType: "blob"
    };

    return await this.httpClient.get(this.appSettings.defaultAPIURLHost + '/api/pdf/leave/application/detial/' + startDate + '/' + endDate + '/' + payrollGroup,
      printCaseOptions);
  }

  // =========================
  // Leave Application Summary
  // =========================
  public async LeaveApplicationSummary(startDate: string, endDate: string, payrollGroup: string) {
    let printCaseOptions: any = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('access_token')
      }),
      responseType: "blob"
    };

    return await this.httpClient.get(this.appSettings.defaultAPIURLHost + '/api/pdf/leave/application/summary/' + startDate + '/' + endDate + '/' + payrollGroup,
      printCaseOptions);
  }

  // ================
  // Tardiness Report
  // ================
  public async TardinessReport(dtrId: number, payrollGroup: string) {
    let printCaseOptions: any = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('access_token')
      }),
      responseType: "blob"
    };

    return await this.httpClient.get(this.appSettings.defaultAPIURLHost + '/api/pdf/tardiness/report/' + dtrId + '/' + payrollGroup,
      printCaseOptions);
  }

  // =============
  // Absent Report
  // =============
  public async AbsentReport(dtrId: number, payrollGroup: string) {
    let printCaseOptions: any = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('access_token')
      }),
      responseType: "blob"
    };

    return await this.httpClient.get(this.appSettings.defaultAPIURLHost + '/api/pdf/absent/report/' + dtrId + '/' + payrollGroup,
      printCaseOptions);
  }
}
