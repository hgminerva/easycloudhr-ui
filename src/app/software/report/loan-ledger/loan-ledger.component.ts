import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackBarTemplate } from '../../shared/snack-bar-template';
import { ReportService } from '../report.service';

@Component({
  selector: 'app-loan-ledger',
  templateUrl: './loan-ledger.component.html',
  styleUrls: ['./loan-ledger.component.css']
})
export class LoanLedgerComponent implements OnInit {

  constructor(
    private reportService: ReportService,
    private _snackBar: MatSnackBar,
    private _snackBarTemplate: SnackBarTemplate,
  ) { }

  public _loanId: number = 0;

  public _loadListDropdownList: any;
  public _loadListDropdownListSubscription: any;

  public _loanLedgerReportSubscription: any;
  public pdfUrl: string = '';

  public _isProgressBarHidden: boolean = false;

  private async GetLoanDropdownListData() {
    this._loadListDropdownListSubscription = await (await this.reportService.PayrollDropdownList()).subscribe(
      response => {
        let result = response;
        if (response["length"] > 0) {
          this._loadListDropdownList = response;
          this._loanId = this._loadListDropdownList[0].Id;
        }
        else {
          this._snackBarTemplate.snackBarInfo(this._snackBar, "Missing Payroll");
        }

        if (this._loadListDropdownListSubscription !== null) this._loadListDropdownListSubscription.unsubscribe();
      },
      error => {
        this._snackBarTemplate.snackBarError(this._snackBar, error.error.Message + " " + error.status);
        if (this._loadListDropdownListSubscription !== null) this._loadListDropdownListSubscription.unsubscribe();
      }
    );
  }

  public async printCaseDTR() {
    this._isProgressBarHidden = true;
    this._loanLedgerReportSubscription = (await this.reportService.PayslipReport(this._loanId)).subscribe(
      data => {
        var binaryData = [];

        binaryData.push(data);
        this._isProgressBarHidden = false;
        this.pdfUrl = URL.createObjectURL(new Blob(binaryData, { type: "application/pdf" }));
        if (this._loanLedgerReportSubscription != null) this._loanLedgerReportSubscription.unsubscribe();
      },
      error => {
        this._isProgressBarHidden = false;

        this._snackBarTemplate.snackBarError(this._snackBar, error.error + " " + error.status);
        console.log(error);
        if (this._loanLedgerReportSubscription != null) this._loanLedgerReportSubscription.unsubscribe();
      }
    );
  }

  ngOnInit(): void {
    this.GetLoanDropdownListData();
  }
}
