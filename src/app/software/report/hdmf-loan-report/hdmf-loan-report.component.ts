import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackBarTemplate } from '../../shared/snack-bar-template';
import { ReportService } from '../report.service';
import { CollectionView, ObservableArray } from '@grapecity/wijmo';
import { SharedService } from '../../shared/shared.service';

@Component({
  selector: 'app-hdmf-loan-report',
  templateUrl: './hdmf-loan-report.component.html',
  styleUrls: ['./hdmf-loan-report.component.css']
})
export class HdmfLoanReportComponent implements OnInit {

  constructor(
    private reportService: ReportService,
    private _snackBar: MatSnackBar,
    private _snackBarTemplate: SnackBarTemplate,
    private _sharedService: SharedService
  ) { }

  ngOnInit(): void {
    this.GetPeriodDropdownListData();
  }

  public periodId: number = 0;
  public companyId: number = 0;
  public monthNumber: number = 0;

  public _periodListDropdownList: any;
  public _periodListDropdownListSubscription: any;

  public _companyListDropdownList: any;
  public _companyListDropdownListSubscription: any;

  public monthNumberData: any = [];
  public mondatoryData: any = [];
    
  public _mandatoryReportSubscription: any;
  public pdfUrl: string = '';

  public _isProgressBarHidden: boolean = false;

  private async GetPeriodDropdownListData() {
    this._periodListDropdownListSubscription = await (await this.reportService.PeriodDropdownList()).subscribe(
      response => {
        this._periodListDropdownList = response;
        this.periodId = this._periodListDropdownList[0].Id;
        console.log(this._periodListDropdownList);
        if (this._periodListDropdownListSubscription !== null) this._periodListDropdownListSubscription.unsubscribe();
      },
      error => {
        this._snackBarTemplate.snackBarError(this._snackBar, error.error.Message + " " + error.status);
        if (this._periodListDropdownListSubscription !== null) this._periodListDropdownListSubscription.unsubscribe();
      }
    );
    this.GetCompanyDropdownListData();
  }

  private async GetCompanyDropdownListData() {
    this._companyListDropdownListSubscription = await (await this.reportService.CompanyDropdownList()).subscribe(
      response => {
        this._companyListDropdownList = response;
        this.companyId = this._companyListDropdownList[0].Id;

        if (this._companyListDropdownListSubscription !== null) this._companyListDropdownListSubscription.unsubscribe();
      },
      error => {
        this._snackBarTemplate.snackBarError(this._snackBar, error.error.Message + " " + error.status);
        if (this._companyListDropdownListSubscription !== null) this._companyListDropdownListSubscription.unsubscribe();
      }
    );
    this.GetMonthNumberDropdownListData();
  }

  private GetMonthNumberDropdownListData() {
    this.monthNumberData = this.reportService.MonthDropdownList();
    this.monthNumber = this.monthNumberData[0].Id;
  }

  public csvDataSubscription: any;

  public async downloadCSV() {
    this._isProgressBarHidden = true;
    let data_csv: any = [];
    this.csvDataSubscription = (await this.reportService.HDMFLoanData(this.periodId, this.monthNumber, this.companyId)).subscribe(
      (data: any) => {
        let results = data;
        if (results != null) {
          var data = results;
          if (data.length > 0) {
            for (let i = 0; i <= data.length - 1; i++) {
              data_csv.push({
                HDMFNumber: data[i].HDMFNumber,
                EmployeeName: data[i].EmployeeName,
                PayrollNumber: data[i].PayrollNumber,
                Amount: data[i].Amount == '' ? '' : parseFloat(data[i].Amount).toFixed(2),
                Penalty: data[i].Penalty == '' ? '' : parseFloat(data[i].Penalty).toFixed(2),
                Total: data[i].Total == '' ? '' : parseFloat(data[i].Total).toFixed(2)
              });
            }
          }
        }

        console.log(data_csv);
        this._sharedService.generateHDMFLoanCSV(data_csv, "HDMF Loan Report", "hdmf-loan-report.csv");
        this._isProgressBarHidden = false;
      },
      error => {
        this._isProgressBarHidden = false;
        this._snackBarTemplate.snackBarError(this._snackBar, error.error + " " + error.status);
        if (this.csvDataSubscription != null) this.csvDataSubscription.unsubscribe();
      }
    );
  }


  public async printCaseDTRPDF() {
    this._isProgressBarHidden = true;
    this._mandatoryReportSubscription = (await this.reportService.HDMFLoanReport(this.periodId, this.monthNumber, this.companyId)).subscribe(
      data => {
        var binaryData = [];

        binaryData.push(data);
        this._isProgressBarHidden = false;
        this.pdfUrl = URL.createObjectURL(new Blob(binaryData, { type: "application/pdf" }));
        if (this._mandatoryReportSubscription != null) this._mandatoryReportSubscription.unsubscribe();
      },
      error => {
        this._isProgressBarHidden = false;

        this._snackBarTemplate.snackBarError(this._snackBar, error.error + " " + error.status);
        console.log(error);
        if (this._mandatoryReportSubscription != null) this._mandatoryReportSubscription.unsubscribe();
      }
    );
  }

}
