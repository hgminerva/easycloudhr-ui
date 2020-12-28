import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { SnackBarTemplate } from '../../shared/snack-bar-template';
import { ReportService } from '../report.service';

@Component({
  selector: 'app-company-journal-voucher',
  templateUrl: './company-journal-voucher.component.html',
  styleUrls: ['./company-journal-voucher.component.css']
})
export class CompanyJournalVoucherComponent implements OnInit {

  constructor(
    private reportService: ReportService,
    private _snackBar: MatSnackBar,
    private _snackBarTemplate: SnackBarTemplate,
    private _activatedRoute: ActivatedRoute,
  ) { }

  public payrollId: number = 0;
  public companyId: number = 0;

  public _payrollListDropdownList: any;
  public _payrollListDropdownListSubscription: any;

  public _companyListDropdownList: any;
  public _companyListDropdownListSubscription: any;

  public _companyJournalVoucherReportSubscription: any;
  public pdfUrl: string = '';

  public _isProgressBarHidden: boolean = false;

  private async GetPayrollDropdownListData() {
    this._payrollListDropdownListSubscription = await (await this.reportService.PayrollDropdownList()).subscribe(
      response => {
        this._payrollListDropdownList = response;
        this.payrollId = this._payrollListDropdownList[0].Id;
        if (this._payrollListDropdownListSubscription !== null) this._payrollListDropdownListSubscription.unsubscribe();
      },
      error => {
        this._snackBarTemplate.snackBarError(this._snackBar, error.error.Message + " " + error.status);
        if (this._payrollListDropdownListSubscription !== null) this._payrollListDropdownListSubscription.unsubscribe();
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
  }

  public async printCaseDTR() {
    this._isProgressBarHidden = true;
    this._companyJournalVoucherReportSubscription = (await this.reportService.CompanyJournalVourcer(this.payrollId, this.companyId )).subscribe(
      data => {
        var binaryData = [];

        binaryData.push(data);
        this._isProgressBarHidden = false;
        this.pdfUrl = URL.createObjectURL(new Blob(binaryData, { type: "application/pdf" }));
        if (this._companyJournalVoucherReportSubscription != null) this._companyJournalVoucherReportSubscription.unsubscribe();
      },
      error => {
        this._isProgressBarHidden = false;

        this._snackBarTemplate.snackBarError(this._snackBar, error.error + " " + error.status);
        console.log(error);
        if (this._companyJournalVoucherReportSubscription != null) this._companyJournalVoucherReportSubscription.unsubscribe();
      }
    );
  }

  ngOnInit(): void {
    this.GetPayrollDropdownListData();
  }


}
