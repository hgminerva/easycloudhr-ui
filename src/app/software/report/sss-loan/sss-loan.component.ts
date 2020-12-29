import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { SnackBarTemplate } from '../../shared/snack-bar-template';
import { ReportService } from '../report.service';

@Component({
  selector: 'app-sss-loan',
  templateUrl: './sss-loan.component.html',
  styleUrls: ['./sss-loan.component.css']
})
export class SssLoanComponent implements OnInit {

  constructor(
    private reportService: ReportService,
    private _snackBar: MatSnackBar,
    private _snackBarTemplate: SnackBarTemplate,
    private _activatedRoute: ActivatedRoute,
  ) { }

  public payrollId: number = 0;

  public _payrollListDropdownList: any;
  public _payrollListDropdownListSubscription: any;

  public _sssLoanReportSubscription: any;
  public pdfUrl: string = '';

  public _isProgressBarHidden: boolean = false;

  public _periodListDropdownList: any;
  public _periodListDropdownListSubscription: any;

  public _companyListDropdownList: any;
  public _companyListDropdownListSubscription: any;

  public periodId: number = 0;
  public companyId: number = 0;
  public monthNumber: number = 0;

  public monthNumberData: any = [];
  public mondatoryData: any = [];

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
    this.GetPeriodDropdownListData();
  }

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
    this.GetMonthNumberDropdownListData();
  }

  private GetMonthNumberDropdownListData() {
    this.monthNumberData = this.reportService.MonthDropdownList();
    this.monthNumber = this.monthNumberData[0].Id;
  }

  public async printCaseDTR() {
    this._isProgressBarHidden = true;
    this._sssLoanReportSubscription = (await this.reportService.SSSLoan(this.periodId, this.monthNumber, this.companyId)).subscribe(
      data => {
        var binaryData = [];

        binaryData.push(data);
        this._isProgressBarHidden = false;
        this.pdfUrl = URL.createObjectURL(new Blob(binaryData, { type: "application/pdf" }));
        if (this._sssLoanReportSubscription != null) this._sssLoanReportSubscription.unsubscribe();
      },
      error => {
        this._isProgressBarHidden = false;

        this._snackBarTemplate.snackBarError(this._snackBar, error.error + " " + error.status);
        console.log(error);
        if (this._sssLoanReportSubscription != null) this._sssLoanReportSubscription.unsubscribe();
      }
    );
  }

  ngOnInit(): void {
    this.GetCompanyDropdownListData();
  }

}
