import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { SharedService } from '../../shared/shared.service';
import { SnackBarTemplate } from '../../shared/snack-bar-template';
import { ReportService } from '../report.service';

@Component({
  selector: 'app-monthly-withholding-tax',
  templateUrl: './monthly-withholding-tax.component.html',
  styleUrls: ['./monthly-withholding-tax.component.css']
})
export class MonthlyWithholdingTaxComponent implements OnInit {

  constructor(
    private reportService: ReportService,
    private _snackBar: MatSnackBar,
    private _snackBarTemplate: SnackBarTemplate,
    private _activatedRoute: ActivatedRoute,
    private _sharedService: SharedService
  ) { }

  public payrollId: number = 0;

  public _payrollListDropdownList: any;
  public _payrollListDropdownListSubscription: any;

  public _withHoldingTaxReportSubscription: any;
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
    this._withHoldingTaxReportSubscription = (await this.reportService.WithholdingTaxMonthy(this.periodId, this.monthNumber, this.companyId)).subscribe(
      data => {
        var binaryData = [];

        binaryData.push(data);
        this._isProgressBarHidden = false;
        this.pdfUrl = URL.createObjectURL(new Blob(binaryData, { type: "application/pdf" }));
        if (this._withHoldingTaxReportSubscription != null) this._withHoldingTaxReportSubscription.unsubscribe();
      },
      error => {
        this._isProgressBarHidden = false;

        this._snackBarTemplate.snackBarError(this._snackBar, error.error + " " + error.status);
        console.log(error);
        if (this._withHoldingTaxReportSubscription != null) this._withHoldingTaxReportSubscription.unsubscribe();
      }
    );
  }
  public _withHoldingTaxReportCSVSubscription: any;

  public async printCSV() {
    this._isProgressBarHidden = true;
    this._withHoldingTaxReportCSVSubscription = (await this.reportService.WithholdingTaxMonthyCSV(this.periodId, this.monthNumber, this.companyId)).subscribe(
      data => {
        let results = data;
        let csv_data: any = [];
        console.log(results);

        if (results["length"] > 0) {
          for (let i = 0; i < results["length"]; i++) {
            csv_data.push({
              EmployeeName: results[i].EmployeeName,
              TIN: results[i].TIN,
              PayrollNumber: results[i].PayrollNumber,
              TaxCode: results[i].TaxCode,
              NetSalary: results[i].NetSalary.toFixed(2),
              OtherIncome: results[i].OtherIncome.toFixed(2),
              Tax: results[i].Tax.toFixed(2),
            });
          }
        }


        this._sharedService.generateWithHoldingTaxCSV(csv_data, "Monthly Withholding Tax Report", "withholdin-tax-report.csv");
        this._isProgressBarHidden = false;
      },
      error => {
        this._isProgressBarHidden = false;
        this._snackBarTemplate.snackBarError(this._snackBar, error.error + " " + error.status);
      }
    );
  }

  ngOnInit(): void {
    this.GetCompanyDropdownListData();
  }
}
