import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SharedService } from '../../shared/shared.service';
import { SnackBarTemplate } from '../../shared/snack-bar-template';
import { ReportService } from '../report.service';

@Component({
  selector: 'app-demographics',
  templateUrl: './demographics.component.html',
  styleUrls: ['./demographics.component.css']
})
export class DemographicsComponent implements OnInit {

  constructor(
    private reportService: ReportService,
    private _snackBar: MatSnackBar,
    private _snackBarTemplate: SnackBarTemplate,
    private _sharedService: SharedService
  ) { }

  ngOnInit(): void {
    this.GetCompanyDropdownListData();
  }

  public companyId: number = 0;

  public _companyListDropdownList: any;
  public _companyListDropdownListSubscription: any;
  public payrollGroupDropdownSubscription: any;

  
  public payrollGroupListDropdown: any = [];
  public filterPayrollGroup = '';

  public _demographicsReportSubscription: any;
  public pdfUrl: string = '';

  public _isProgressBarHidden: boolean = false;

  public _branchListDropdownList: any = [];
  public _branchListDropdownListSubscription: any;
  public branch: string = "";

  private async GetCompanyDropdownListData() {
    this._companyListDropdownListSubscription = await (await this.reportService.CompanyDropdownList()).subscribe(
      response => {
        this._companyListDropdownList = response;
        this.companyId = this._companyListDropdownList[0].Id;
        this.GetPayrollGroupDropdownListData();
        if (this._companyListDropdownListSubscription !== null) this._companyListDropdownListSubscription.unsubscribe();
      },
      error => {
        this._snackBarTemplate.snackBarError(this._snackBar, error.error.Message + " " + error.status);
        if (this._companyListDropdownListSubscription !== null) this._companyListDropdownListSubscription.unsubscribe();
      }
    );

    await this.GetBranchDropdownListData();
  }

  private async GetBranchDropdownListData() {
    this._branchListDropdownListSubscription = await (await this.reportService.BranchList()).subscribe(
      response => {
        let results = response;
        console.log("branch",results);
        this._branchListDropdownList.push({
          Id: 0,
          Value: "ALL"
        });

        this.branch = "ALL";

        for(var i =0 ; i < results["length"]; i++){
          this._branchListDropdownList.push(results[i]);
        }
      },
      error => {
        this._snackBarTemplate.snackBarError(this._snackBar, error.error.Message + " " + error.status);
      }
    );
  }


  private async GetPayrollGroupDropdownListData() {
    this.payrollGroupDropdownSubscription = await (await this.reportService.PayrollGroupList()).subscribe(
      response => {
        var results = response;
        this.payrollGroupListDropdown.push({ Id: 0, Value: 'ALL'});

        if (results["length"] > 0) {
          for (var i = 0; i < results["length"]; i++) {
            this.payrollGroupListDropdown.push(results[i]);
          }
        }
        this.filterPayrollGroup = this.payrollGroupListDropdown[0].Value;
        if (this._companyListDropdownListSubscription !== null) this._companyListDropdownListSubscription.unsubscribe();
      },
      error => {
        this._snackBarTemplate.snackBarError(this._snackBar, error.error.Message + " " + error.status);
        if (this._companyListDropdownListSubscription !== null) this._companyListDropdownListSubscription.unsubscribe();
      }
    );
  }


  public async printCase() {
    this._demographicsReportSubscription = (await this.reportService.DemographicsReports(this.companyId, this.filterPayrollGroup, this.branch )).subscribe(
      data => {
        var binaryData = [];
        binaryData.push(data);
        this._isProgressBarHidden = false;
        this.pdfUrl = URL.createObjectURL(new Blob(binaryData, { type: "application/pdf" }));
        if (this._demographicsReportSubscription != null) this._demographicsReportSubscription.unsubscribe();
      },
      error => {

        this._snackBarTemplate.snackBarError(this._snackBar, error.error + " " + error.status);
        console.log(error);
        if (this._demographicsReportSubscription != null) this._demographicsReportSubscription.unsubscribe();
      }
    );
  }

  public async printCaseCSV() {
    this._isProgressBarHidden = true;
    (await this.reportService.DemographicsCSVReport(this.companyId, this.filterPayrollGroup, this.branch)).subscribe(
      data => {
        this._sharedService.generateDemographicsCSV(data, "Demographics", "demographics-report.csv");
        this._isProgressBarHidden = false;
      },
      error => {
        this._isProgressBarHidden = false;

        this._snackBarTemplate.snackBarError(this._snackBar, error.error + " " + error.status);
        console.log(error);
      }
    );
  }

}
