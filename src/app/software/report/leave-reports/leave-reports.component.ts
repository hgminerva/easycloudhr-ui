import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EmployeeListPickDialogComponent } from '../../shared/employee-list-pick-dialog/employee-list-pick-dialog.component';
import { SharedService } from '../../shared/shared.service';
import { SnackBarTemplate } from '../../shared/snack-bar-template';
import { ReportService } from '../report.service';

@Component({
  selector: 'app-leave-reports',
  templateUrl: './leave-reports.component.html',
  styleUrls: ['./leave-reports.component.css']
})
export class LeaveReportsComponent implements OnInit {

  constructor(
    private reportService: ReportService,
    private _snackBarTemplate: SnackBarTemplate,
    private _sharedService: SharedService,
    private _snackBar: MatSnackBar,
    private datePipe: DatePipe,
    public _matDialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.GetPayrollGroupDropdownListData();
    setTimeout(()=>{
      this.isShown = true;
    },1000);
  }

  public isShown: boolean = false;
  public leaveReports: any[] = ["Leave Ledger Summary", "Leave Ledger", "Leave Application Detail", "Leave Application Summary"]
  public leaveReport = "Leave Ledger Summary";

  public payrollGroupDropdownSubscription;
  public payrollGroupListDropdown: any = [];
  public filterPayrollGroup = '';

  public uiStartDate: Date = new Date();
  public startDate: string = this.datePipe.transform(this.uiStartDate, 'yyyy-MM-dd');
  public uiEndDate: Date = new Date();
  public endDate: string = this.datePipe.transform(this.uiEndDate, 'yyyy-MM-dd');
  
  public employee: string = "";
  public employeeId: number = 0;

  public _leaveReportSubscription: any;
  public pdfUrl: string = '';
  public _isProgressBarHidden: boolean = false;

  private async GetPayrollGroupDropdownListData() {
    this.payrollGroupDropdownSubscription = await (await this.reportService.PayrollGroupList()).subscribe(
      response => {
        var results = response;
        if (results["length"] > 0) {
          for (var i = 0; i < results["length"]; i++) {
            this.payrollGroupListDropdown.push(results[i]);
          }
        }
        this.filterPayrollGroup = this.payrollGroupListDropdown[0].Value;
      }
    );
  }

  public formatDate(dateField: string) {
    if (dateField == 'startDate') {
      this.startDate = this.datePipe.transform(this.uiStartDate, 'yyyy-MM-dd');
    }
    if (dateField == 'endDate') {
      this.endDate = this.datePipe.transform(this.uiEndDate, 'yyyy-MM-dd');
    }
  }

  public EmployeeListDialog() {
    const matDialogRef = this._matDialog.open(EmployeeListPickDialogComponent, {
      width: '900px',
      height: '500',
      data: {
        objDialogTitle: "Employee List",
        objPayrollGroup: null
      },
      disableClose: true
    });

    matDialogRef.afterClosed().subscribe((data: any) => {
      console.log(data);
      if (data.event != "Close") {
        this.employee = data.employee.Value;
        this.employeeId = data.employee.Id;

      }
    });
  }

  public async printCase() {
    if (this.leaveReport === "Leave Ledger Summary") {
      this._leaveReportSubscription = (await this.reportService.LeaveLedgerSummary(this.startDate, this.endDate, this.filterPayrollGroup)).subscribe(
        data => {
          var binaryData = [];
          binaryData.push(data);
          this._isProgressBarHidden = false;
          this.pdfUrl = URL.createObjectURL(new Blob(binaryData, { type: "application/pdf" }));
          if (this._leaveReportSubscription != null) this._leaveReportSubscription.unsubscribe();
        },
        error => {
          this._snackBarTemplate.snackBarError(this._snackBar, error.error + " " + error.status);
        }
      );
    } else if (this.leaveReport === "Leave Ledger") {
      this._leaveReportSubscription = (await this.reportService.LeaveLedger(this.startDate, this.endDate, this.employeeId)).subscribe(
        data => {
          var binaryData = [];
          binaryData.push(data);
          this._isProgressBarHidden = false;
          this.pdfUrl = URL.createObjectURL(new Blob(binaryData, { type: "application/pdf" }));
          if (this._leaveReportSubscription != null) this._leaveReportSubscription.unsubscribe();
        },
        error => {
          this._snackBarTemplate.snackBarError(this._snackBar, error.error + " " + error.status);
        }
      );
    } else if (this.leaveReport === "Leave Application Detail") {
      this._leaveReportSubscription = (await this.reportService.LeaveApplicationSummary(this.startDate, this.endDate, this.filterPayrollGroup)).subscribe(
        data => {
          var binaryData = [];
          binaryData.push(data);
          this._isProgressBarHidden = false;
          this.pdfUrl = URL.createObjectURL(new Blob(binaryData, { type: "application/pdf" }));
          if (this._leaveReportSubscription != null) this._leaveReportSubscription.unsubscribe();
        },
        error => {
          this._snackBarTemplate.snackBarError(this._snackBar, error.error + " " + error.status);
        }
      );
    } else if (this.leaveReport === "Leave Application Summary") {
      this._leaveReportSubscription = (await this.reportService.LeaveLedgerSummary(this.startDate, this.endDate, this.filterPayrollGroup)).subscribe(
        data => {
          var binaryData = [];
          binaryData.push(data);
          this._isProgressBarHidden = false;
          this.pdfUrl = URL.createObjectURL(new Blob(binaryData, { type: "application/pdf" }));
          if (this._leaveReportSubscription != null) this._leaveReportSubscription.unsubscribe();
        },
        error => {
          this._snackBarTemplate.snackBarError(this._snackBar, error.error + " " + error.status);
        }
      );
    }
  }

  ngOnDestroy() {
    if (this._leaveReportSubscription != null) this._leaveReportSubscription.unsubscribe();
  }

}
