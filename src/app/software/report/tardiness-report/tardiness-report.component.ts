import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { SharedService } from '../../shared/shared.service';
import { SnackBarTemplate } from '../../shared/snack-bar-template';
import { SystemTablesListService } from '../../system-tables-list/system-tables-list.service';
import { ReportService } from '../report.service';

@Component({
  selector: 'app-tardiness-report',
  templateUrl: './tardiness-report.component.html',
  styleUrls: ['./tardiness-report.component.css']
})
export class TardinessReportComponent implements OnInit {

  constructor(
    private reportService: ReportService,
    private _snackBar: MatSnackBar,
    private _snackBarTemplate: SnackBarTemplate,
    public systemTablesListService: SystemTablesListService
  ) { }

  public dtrId: number = 0;

  public _dtrDropdownList: any;
  public _dtrDropdownListSubscription: any;

  public _tardinessReportSubscription: any;
  public pdfUrl: string = '';

  public _isProgressBarHidden: boolean = false;

  public payrollGroup: string = '';
  public leaveTypeListDropdown: any;
  public leaveTypeListDropdownSubscription: any;

  private async GetDTRDropdownListData() {
    this._dtrDropdownListSubscription = await (await this.reportService.DTRList()).subscribe(
      response => {
        this._dtrDropdownList = response;
        this.dtrId = this._dtrDropdownList[0].Id;
        if (this._dtrDropdownListSubscription !== null) this._dtrDropdownListSubscription.unsubscribe();
      },
      error => {
        this._snackBarTemplate.snackBarError(this._snackBar, error.error.Message + " " + error.status);
        if (this._dtrDropdownListSubscription !== null) this._dtrDropdownListSubscription.unsubscribe();
      }
    );

    await this.leaveTypeSelectionChange();
  }


  public async leaveTypeSelectionChange() {
    this.leaveTypeListDropdownSubscription = (await this.systemTablesListService.CodeTableList("PAYROLL GROUP")).subscribe(
      (response: any) => {
        var results = response;
        if (results["length"] > 0) {
          this.leaveTypeListDropdown = results;
        }
      }
    );
  }

  public async printCaseDTR() {
    this._isProgressBarHidden = true;
    this._tardinessReportSubscription = (await this.reportService.TardinessReport(this.dtrId, this.payrollGroup)).subscribe(
      data => {
        var binaryData = [];

        binaryData.push(data);
        this._isProgressBarHidden = false;
        this.pdfUrl = URL.createObjectURL(new Blob(binaryData, { type: "application/pdf" }));
        if (this._tardinessReportSubscription != null) this._tardinessReportSubscription.unsubscribe();
      },
      error => {
        this._isProgressBarHidden = false;

        this._snackBarTemplate.snackBarError(this._snackBar, error.error + " " + error.status);
        console.log(error);
        if (this._tardinessReportSubscription != null) this._tardinessReportSubscription.unsubscribe();
      }
    );
  }

  ngOnInit(): void {
    this.GetDTRDropdownListData();
  }
}
