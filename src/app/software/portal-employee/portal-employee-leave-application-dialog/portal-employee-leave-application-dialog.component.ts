import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import * as wjcGrid from '@grapecity/wijmo.grid';
import { CollectionView, ObservableArray } from '@grapecity/wijmo';
import { PortalEmployeeService } from '../portal-employee.service';
import { SnackBarTemplate } from '../../shared/snack-bar-template';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PortalEmployeeLeaveApplicationLineAddDialogComponent } from './portal-employee-leave-application-line-add-dialog/portal-employee-leave-application-line-add-dialog.component';

@Component({
  selector: 'app-portal-employee-leave-application-dialog',
  templateUrl: './portal-employee-leave-application-dialog.component.html',
  styleUrls: ['./portal-employee-leave-application-dialog.component.css']
})
export class PortalEmployeeLeaveApplicationDialogComponent implements OnInit {

  constructor(
    public _dialogRef: MatDialogRef<PortalEmployeeLeaveApplicationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public caseData: any,
    public _matDialog: MatDialog,
    private _portalEmployeeService: PortalEmployeeService,
    private _snackBar: MatSnackBar,
    private _snackBarTemplate: SnackBarTemplate,
  ) { }

  public title = '';

  ngOnInit(): void {
    this.title = this.caseData.objDialogTitle;
    this.LoadLeaveApplication();
  }

  public leaveApplication: any;
  public _isComponentHidden: boolean = true;
  public _btnAddLeaveApplicationLineDisabled: boolean = false;

  // OT Application
  public _listLeaveApplicationLineObservableArray: ObservableArray = new ObservableArray();
  public _listLeaveApplicationLineCollectionView: CollectionView = new CollectionView(this._listLeaveApplicationLineObservableArray);
  public _listLeaveApplicationLinePageIndex: number = 15;

  public _isLeaveApplicationLineProgressBarHidden = false;
  public _isLeaveApplicationLineDataLoaded: boolean = false;

  private _leaveApplicationLineSubscription: any;
  private _addLeaveApplicationDetailSubscription: any;

  @ViewChild('flexLeaveApplicationLine') flexLeaveApplicationLine: wjcGrid.FlexGrid;

  private LoadLeaveApplication() {

    this.leaveApplication = this.caseData.objDataLAApplication;
    console.log("LA: ", this.leaveApplication);

    setTimeout(() => {
      this.GetLeaveApplicationDetail();
    }, 100);

  }

  public _leaveApplicationDetailSubscription: any;

  private async GetLeaveApplicationDetail() {
    this._isComponentHidden = true;
    this._leaveApplicationDetailSubscription = await (await this._portalEmployeeService.LeaveApplicationDetail(this.caseData.objDataLAApplication.Id)).subscribe(
      (response: any) => {
        let result = response;
        if (result != null) {
          this.leaveApplication = result;
          console.log(this.leaveApplication);
          this._btnAddLeaveApplicationLineDisabled = result["IsLocked"];
        }

        this.GetLeaveApplicationLineListData();
        this._isComponentHidden = false;
        if (this._leaveApplicationDetailSubscription !== null) this._leaveApplicationDetailSubscription.unsubscribe();
      },
      error => {
        this._snackBarTemplate.snackBarError(this._snackBar, error.error.Message + " " + error.status);
        if (this._leaveApplicationDetailSubscription !== null) this._leaveApplicationDetailSubscription.unsubscribe();
      }
    );
  }

  private async GetLeaveApplicationLineListData() {

    this._listLeaveApplicationLineObservableArray = new ObservableArray();
    this._listLeaveApplicationLineCollectionView = new CollectionView(this._listLeaveApplicationLineObservableArray);
    this._listLeaveApplicationLineCollectionView.pageSize = 15;
    this._listLeaveApplicationLineCollectionView.trackChanges = true;
    await this._listLeaveApplicationLineCollectionView.refresh();
    await this.flexLeaveApplicationLine.refresh();

    this._isLeaveApplicationLineProgressBarHidden = true;

    console.log(this.caseData.objDataEmployeeId," ", this.leaveApplication.Id);
    this._leaveApplicationLineSubscription = await (await this._portalEmployeeService.LeaveApplicationLineList(this.caseData.objDataEmployeeId, this.leaveApplication.Id)).subscribe(
      (response: any) => {
        if (response["length"] > 0) {
          this._listLeaveApplicationLineObservableArray = response;
          this._listLeaveApplicationLineCollectionView = new CollectionView(this._listLeaveApplicationLineObservableArray);
          this._listLeaveApplicationLineCollectionView.pageSize = 15;
          this._listLeaveApplicationLineCollectionView.trackChanges = true;
          this._listLeaveApplicationLineCollectionView.refresh();
          this.flexLeaveApplicationLine.refresh();
        }

        this._isLeaveApplicationLineDataLoaded = true;
        this._isLeaveApplicationLineProgressBarHidden = false;
        this._isComponentHidden = false;

        if (this._leaveApplicationLineSubscription !== null) this._leaveApplicationLineSubscription.unsubscribe();
      },
      error => {
        this._isLeaveApplicationLineProgressBarHidden = false;
        this._snackBarTemplate.snackBarError(this._snackBar, error.error.Message + " " + error.status);
        if (this._leaveApplicationLineSubscription !== null) this._leaveApplicationLineSubscription.unsubscribe();
      }
    );
  }

  public Close(): void {
    this._dialogRef.close({ event: 'Close' });
  }

  public async Save() {
    // if (this._payrollOtherIncomeLineModel.EmployeeId != 0) {
    //   await this._dialogRef.close({ event: this.title, data: this._payrollOtherIncomeLineModel });
    // } else {
    //   this._snackBarTemplate.snackBarError(this._snackBar, "Choose employee!");
    // }
  }

  public async AddLeaveApplicationLine() {
    const dialogRef = this._matDialog.open(PortalEmployeeLeaveApplicationLineAddDialogComponent, {
      width: '600px',
      data: {
        objDialogTitle: "Overtime Application",
        objDataLAId: this.leaveApplication.Id,
        objDataEmployeeId: this.caseData.objDataEmployeeId,
      },
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result.event !== 'Close') {
        this.AddLeaveApplicationDetail(result.data);
      }
    });
  }

  public async AddLeaveApplicationDetail(leaveApplicationLine: any) {
    if (this._isLeaveApplicationLineDataLoaded == true) {
      this._isLeaveApplicationLineDataLoaded = false;
      this._addLeaveApplicationDetailSubscription = (await this._portalEmployeeService.AddLeaveApplicationLine(leaveApplicationLine)).subscribe(
        response => {
          this.GetLeaveApplicationLineListData();
          this._isLeaveApplicationLineDataLoaded = true;
          this._snackBarTemplate.snackBarSuccess(this._snackBar, "Save Successfully.");
          if (this._addLeaveApplicationDetailSubscription !== null) this._addLeaveApplicationDetailSubscription.unsubscribe();
        },
        error => {
          this._isLeaveApplicationLineDataLoaded = true;
          this._snackBarTemplate.snackBarError(this._snackBar, error.error.Message + " " + error.status);
          if (this._addLeaveApplicationDetailSubscription !== null) this._addLeaveApplicationDetailSubscription.unsubscribe();
        }
      );
    }
  }

}
