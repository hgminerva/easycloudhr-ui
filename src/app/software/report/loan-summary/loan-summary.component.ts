import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackBarTemplate } from '../../shared/snack-bar-template';
import { ReportService } from '../report.service';

@Component({
  selector: 'app-loan-summary',
  templateUrl: './loan-summary.component.html',
  styleUrls: ['./loan-summary.component.css']
})
export class LoanSummaryComponent implements OnInit {

  constructor(
    private reportService: ReportService,
    private _snackBar: MatSnackBar,
    private _snackBarTemplate: SnackBarTemplate,
    private datePipe: DatePipe,
  ) { }


  range = new FormGroup({
    start: new FormControl(),
    end: new FormControl()
  });

  public _loanSummaryReportSubscription: any;
  public pdfUrl: string = '';

  public _isProgressBarHidden: boolean = false;

  public async printCase() {
    let start = this.datePipe.transform(this.range.value.start, 'yyyy-MM-dd');
    let end = this.datePipe.transform(this.range.value.end, 'yyyy-MM-dd');

    console.log(start, end);
    this._isProgressBarHidden = true;
    this._loanSummaryReportSubscription = (await this.reportService.LoanSummaryReport(start, end)).subscribe(
      data => {
        console.log(data);
        var binaryData = [];

        binaryData.push(data);
        this._isProgressBarHidden = false;
        this.pdfUrl = URL.createObjectURL(new Blob(binaryData, { type: "application/pdf" }));
        if (this._loanSummaryReportSubscription != null) this._loanSummaryReportSubscription.unsubscribe();
      },
      error => {
        this._isProgressBarHidden = false;

        this._snackBarTemplate.snackBarError(this._snackBar, error.error + " " + error.status);
        console.log(error);
        if (this._loanSummaryReportSubscription != null) this._loanSummaryReportSubscription.unsubscribe();
      }
    );
  }

  ngOnInit(): void {
  }
}
