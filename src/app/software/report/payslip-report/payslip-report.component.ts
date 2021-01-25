import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackBarTemplate } from '../../shared/snack-bar-template';
import { ReportService } from '../report.service';

@Component({
  selector: 'app-payslip-report',
  templateUrl: './payslip-report.component.html',
  styleUrls: ['./payslip-report.component.css']
})
export class PayslipReportComponent implements OnInit {

  constructor(
    private reportService: ReportService,
    private _snackBar: MatSnackBar,
    private _snackBarTemplate: SnackBarTemplate,
  ) { }

  public payrollId: number = 0;

  public _payrollListDropdownList: any;
  public _payrollListDropdownListSubscription: any;

  public branch: string = "";

  public _branchListDropdownList: any;
  public _branchListDropdownListSubscription: any;

  public _demographicsReportSubscription: any;
  public pdfUrl: string = '';

  public _isProgressBarHidden: boolean = false;

  private async GetPayrollDropdownListData() {
    this._payrollListDropdownListSubscription = await (await this.reportService.PayrollDropdownList()).subscribe(
      response => {
        let result = response;
        if (response["length"] > 0) {
          this._payrollListDropdownList = response;
          this.payrollId = this._payrollListDropdownList[0].Id;
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

  private async GetBranchDropdownListData() {
    this._branchListDropdownListSubscription = (await this.reportService.BranchList()).subscribe(
      response => {
        let result = response;
        console.log(result);
        if (result["length"] > 0) {
          this._branchListDropdownList = result;
          this.branch = this._branchListDropdownList[0].Value;
        }
        else {
          this._snackBarTemplate.snackBarInfo(this._snackBar, "Missing Branch");
        }

        if (this._branchListDropdownListSubscription !== null) this._branchListDropdownListSubscription.unsubscribe();
      },
      error => {
        this._snackBarTemplate.snackBarError(this._snackBar, error.error.Message + " " + error.status);
        if (this._branchListDropdownListSubscription !== null) this._branchListDropdownListSubscription.unsubscribe();
      }
    );
  }

  public async printCaseDTR() {
    this._isProgressBarHidden = true;
    this._demographicsReportSubscription = (await this.reportService.PayslipReport(this.payrollId, this.branch)).subscribe(
      data => {
        var binaryData = [];

        binaryData.push(data);
        this._isProgressBarHidden = false;
        this.pdfUrl = URL.createObjectURL(new Blob(binaryData, { type: "application/pdf" }));
        if (this._demographicsReportSubscription != null) this._demographicsReportSubscription.unsubscribe();
      },
      error => {
        this._isProgressBarHidden = false;

        this._snackBarTemplate.snackBarError(this._snackBar, error.error + " " + error.status);
        console.log(error);
        if (this._demographicsReportSubscription != null) this._demographicsReportSubscription.unsubscribe();
      }
    );
  }

  async ngOnInit() {
    await this.GetPayrollDropdownListData();
    await this.GetBranchDropdownListData();
  }

}
