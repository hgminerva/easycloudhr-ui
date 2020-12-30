import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SharedService } from '../../shared/shared.service';
import { SnackBarTemplate } from '../../shared/snack-bar-template';
import { ReportService } from '../report.service';

@Component({
  selector: 'app-atm-bank-report',
  templateUrl: './atm-bank-report.component.html',
  styleUrls: ['./atm-bank-report.component.css']
})
export class AtmBankReportComponent implements OnInit {

  constructor(
    private reportService: ReportService,
    private _snackBar: MatSnackBar,
    private _snackBarTemplate: SnackBarTemplate,
    private _sharedService: SharedService
  ) { }

  public companyId: number = 0;
  public payrollId: number = 0;

  public _payrollListDropdownList: any;
  public _payrollListDropdownListSubscription: any;

  public _companyListDropdownList: any;
  public _companyListDropdownListSubscription: any;

  public _atmBankReportListDropdownListSubscription: any;
  public pdfUrl: string = '';

  public _isProgressBarHidden: boolean = false;

  private async GetPayrollDropdownListData() {
    this._payrollListDropdownListSubscription = await (await this.reportService.PayrollDropdownList()).subscribe(
      response => {
        let result = response;
        if (response["length"] > 0) {
          this._payrollListDropdownList = response;
          this.payrollId = this._payrollListDropdownList[0].Id;
          this.GetCompanyDropdownListData();
        }
        else {
          this._snackBarTemplate.snackBarInfo(this._snackBar, "Missing Payroll");
        }

        if (this._payrollListDropdownListSubscription !== null) this._payrollListDropdownListSubscription.unsubscribe();
      },
      error => {
        this._snackBarTemplate.snackBarError(this._snackBar, error.error.Message + " " + error.status);
        if (this._payrollListDropdownListSubscription !== null) this._payrollListDropdownListSubscription.unsubscribe();
      }
    );
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
  }

  public async printCaseDTRCSV() {
    this._isProgressBarHidden = true;
    (await this.reportService.ATMBankReport(this.payrollId, this.companyId)).subscribe(
      data => {
        this._sharedService.generateATMReportCSV(data, "ATM Bank Report", "atm-bank-report.csv");
        this._isProgressBarHidden = false;
      },
      error => {
        this._isProgressBarHidden = false;

        this._snackBarTemplate.snackBarError(this._snackBar, error.error + " " + error.status);
        console.log(error);
      }
    );
  }

  ngOnInit(): void {
    this.GetPayrollDropdownListData();
  }

}
