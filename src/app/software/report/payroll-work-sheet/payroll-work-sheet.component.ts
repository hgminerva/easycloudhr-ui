import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackBarTemplate } from '../../shared/snack-bar-template';
import { ReportService } from '../report.service';

@Component({
  selector: 'app-payroll-work-sheet',
  templateUrl: './payroll-work-sheet.component.html',
  styleUrls: ['./payroll-work-sheet.component.css']
})
export class PayrollWorkSheetComponent implements OnInit {

  constructor(
    private reportService: ReportService,
    private _snackBar: MatSnackBar,
    private _snackBarTemplate: SnackBarTemplate,
  ) { }

  public payrollId: number = 0;
  public companyId: number = 0;
  
  public _payrollListDropdownList: any;
  public _payrollListDropdownListSubscription: any;

  public branch: string = "";

  public _branchListDropdownList: any = [];
  public _branchListDropdownListSubscription: any;

  public _demographicsReportSubscription: any;
  public pdfUrl: string = '';

  public _companyListDropdownList: any;
  public _companyListDropdownListSubscription: any;

  public _isProgressBarHidden: boolean = false;

  private async GetPayrollDropdownListData() {
    this._payrollListDropdownListSubscription = await (await this.reportService.PayrollDropdownList()).subscribe(
      response => {
        let result = response;
        if (response["length"] > 0) {
          this._payrollListDropdownList = response;
          this.payrollId = this._payrollListDropdownList[0].Id;
          this.GetBranchDropdownListData();
        }
        else {
          this._snackBarTemplate.snackBarInfo(this._snackBar, "Missing Payroll");
        }
      },
      error => {
        this._snackBarTemplate.snackBarError(this._snackBar, error.error.Message + " " + error.status);
      }
    );
  }

  private async GetBranchDropdownListData() {
    this._branchListDropdownListSubscription = await (await this.reportService.BranchList()).subscribe(
      response => {
        let results = response;
        this._branchListDropdownList.push({
          Id: 0,
          Value: "ALL"
        });

        this.branch = "ALL";

        for(var i =0 ; i < results["length"]; i++){
          this._branchListDropdownList.push(results[i]);
        }

        this.GetCompanyDropdownListData();
      },
      error => {
        this._snackBarTemplate.snackBarError(this._snackBar, error.error.Message + " " + error.status);
      }
    );
  }

  private async GetCompanyDropdownListData() {
    this._companyListDropdownListSubscription = await (await this.reportService.CompanyDropdownList()).subscribe(
      response => {
        this._companyListDropdownList = response;
        this.companyId = this._companyListDropdownList[0].Id;
      },
      error => {
        this._snackBarTemplate.snackBarError(this._snackBar, error.error.Message + " " + error.status);
      }
    );
  }

  public async printCaseDTR() {
    this._isProgressBarHidden = true;
    this._demographicsReportSubscription = (await this.reportService.PayrollWorkSheetPDF(this.payrollId, this.branch, this.companyId)).subscribe(
      data => {
        var binaryData = [];

        binaryData.push(data);
        this._isProgressBarHidden = false;
        this.pdfUrl = URL.createObjectURL(new Blob(binaryData, { type: "application/pdf" }));
      },
      error => {
        this._isProgressBarHidden = false;
        this._snackBarTemplate.snackBarError(this._snackBar, error.error + " " + error.status);
      }
    );
  }

  ngOnInit(): void {
    this.GetPayrollDropdownListData();
  }
}
