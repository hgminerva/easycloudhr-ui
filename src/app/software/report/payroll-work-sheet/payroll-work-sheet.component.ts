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

  public department: string = "";

  public _departmentListDropdownList: any;
  public _departmentListDropdownListSubscription: any;

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
          this.GetDepartmentDropdownListData();
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

  private async GetDepartmentDropdownListData() {
    this._departmentListDropdownListSubscription = await (await this.reportService.DepartmentDropdownList()).subscribe(
      response => {
        this._departmentListDropdownList = response;
        this.department = this._departmentListDropdownList[0].Value;
        this.GetCompanyDropdownListData();
        if (this._departmentListDropdownListSubscription !== null) this._departmentListDropdownListSubscription.unsubscribe();
      },
      error => {
        this._snackBarTemplate.snackBarError(this._snackBar, error.error.Message + " " + error.status);
        if (this._departmentListDropdownListSubscription !== null) this._departmentListDropdownListSubscription.unsubscribe();
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

  public async printCaseDTR() {
    this._isProgressBarHidden = true;
    this._demographicsReportSubscription = (await this.reportService.WorkSheetPerDepartment(this.payrollId, this.department, this.companyId)).subscribe(
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

  ngOnInit(): void {
    this.GetPayrollDropdownListData();
  }
}
