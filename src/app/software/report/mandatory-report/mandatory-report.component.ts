import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackBarTemplate } from '../../shared/snack-bar-template';
import { ReportService } from '../report.service';

@Component({
  selector: 'app-mandatory-report',
  templateUrl: './mandatory-report.component.html',
  styleUrls: ['./mandatory-report.component.css']
})
export class MandatoryReportComponent implements OnInit {

  constructor(
    private reportService: ReportService,
    private _snackBar: MatSnackBar,
    private _snackBarTemplate: SnackBarTemplate,
  ) { }

  ngOnInit(): void {
    this.GetPeriodDropdownListData();
  }

  public periodId: number = 0;
  public companyId: number = 0;
  public monthNumber: number = 0;
  public mondatory: string = ''

  public _periodListDropdownList: any;
  public _periodListDropdownListSubscription: any;

  public _companyListDropdownList: any;
  public _companyListDropdownListSubscription: any;

  public monthNumberData: any = [];
  public mondatoryData: any = [];

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
    this.GetMondatoryDropdownListData();
  }

  private GetMonthNumberDropdownListData() {
    this.monthNumberData = this.reportService.MonthDropdownList();
    this.monthNumber = this.monthNumberData[0].Id;
  }

  private GetMondatoryDropdownListData() {
    this.mondatoryData = this.reportService.MandatoryDropdownList();
    this.mondatory = this.mondatoryData[0].Code;
  }

  public _mandatoryReportSubscription: any;
  public pdfUrl: string = '';

  public _isProgressBarHidden: boolean = false;

  public async printCaseDTR() {
    this._isProgressBarHidden = true;
    this._mandatoryReportSubscription = (await this.reportService.MandatoryReport(this.mondatory, this.periodId, 0, this.monthNumber, this.companyId)).subscribe(
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
