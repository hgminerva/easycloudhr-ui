import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import * as wjcGrid from '@grapecity/wijmo.grid';
import { CollectionView, ObservableArray } from '@grapecity/wijmo';
import { PortalEmployeeService } from '../portal-employee.service';
import { SnackBarTemplate } from '../../shared/snack-bar-template';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PortalEmployeePdfDialogComponent } from '../portal-employee-pdf-dialog/portal-employee-pdf-dialog.component';

@Component({
  selector: 'app-portal-employee-payroll-dialog',
  templateUrl: './portal-employee-payroll-dialog.component.html',
  styleUrls: ['./portal-employee-payroll-dialog.component.css']
})
export class PortalEmployeePayrollDialogComponent implements OnInit {

  constructor(
    public _dialogRef: MatDialogRef<PortalEmployeePayrollDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public caseData: any,
    public _matDialog: MatDialog,
    private _portalEmployeeService: PortalEmployeeService,
    private _snackBar: MatSnackBar,
    private _snackBarTemplate: SnackBarTemplate,
  ) { }

  public title = '';

  ngOnInit(): void {
    this.title = this.caseData.objDialogTitle;
    this.GetPayrollLineListData();
  }

  public overtimeApplication: any;
  public _isComponentHidden: boolean = true;

  // OT Application
  public _listPayrollLineObservableArray: ObservableArray = new ObservableArray();
  public _listPayrollLineCollectionView: CollectionView = new CollectionView(this._listPayrollLineObservableArray);
  public _listPayrollLinePageIndex: number = 15;

  public _isPayrollLineProgressBarHidden = false;
  public _isPayrollLineDataLoaded: boolean = false;

  private _payrollLineSubscription: any;

  @ViewChild('flexPayrollLine') flexPayrollLine: wjcGrid.FlexGrid;

  private async GetPayrollLineListData() {

    this._listPayrollLineObservableArray = new ObservableArray();
    this._listPayrollLineCollectionView = new CollectionView(this._listPayrollLineObservableArray);
    this._listPayrollLineCollectionView.pageSize = 10;
    this._listPayrollLineCollectionView.trackChanges = true;
    await this._listPayrollLineCollectionView.refresh();
    await this.flexPayrollLine.refresh();

    this._isPayrollLineProgressBarHidden = true;
    this._payrollLineSubscription = await (await this._portalEmployeeService.PayrollLineList(this.caseData.objDataEmployeeId, this.caseData.objDataPayroll.Id)).subscribe(
      (response: any) => {
        if (response["length"] > 0) {
          this._listPayrollLineObservableArray = response;
          this._listPayrollLineCollectionView = new CollectionView(this._listPayrollLineObservableArray);
          this._listPayrollLineCollectionView.pageSize = 10;
          this._listPayrollLineCollectionView.trackChanges = true;
          this._listPayrollLineCollectionView.refresh();
          this.flexPayrollLine.refresh();
        }

        this._isPayrollLineDataLoaded = true;
        this._isPayrollLineProgressBarHidden = false;
        this._isComponentHidden = false;

        if (this._payrollLineSubscription !== null) this._payrollLineSubscription.unsubscribe();
      },
      error => {
        this._isPayrollLineProgressBarHidden = false;
        this._snackBarTemplate.snackBarError(this._snackBar, error.error.Message + " " + error.status);
        if (this._payrollLineSubscription !== null) this._payrollLineSubscription.unsubscribe();
      }
    );
  }

  public Close(): void {
    this._dialogRef.close({ event: 'Close' });
  }

  public async Print() {
    let currentPayrollLine = this._listPayrollLineCollectionView.currentItem;
    const matDialogRef = this._matDialog.open(PortalEmployeePdfDialogComponent, {
      width: '900px',
      data: {
        objDialogTitle: "Leave Application",
        objDataEmployeeId: this.caseData.objDataEmployeeId,
        objDataPayrollLineId: currentPayrollLine.Id
      },
      disableClose: true
    });

    matDialogRef.afterClosed().subscribe(result => {
      if (result.message == "Yes") {
      }
    });
  }
}
