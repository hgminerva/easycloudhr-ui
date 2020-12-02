import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import * as wjcCore from '@grapecity/wijmo';
import * as wjcGrid from '@grapecity/wijmo.grid';
import { CollectionView, ObservableArray } from '@grapecity/wijmo';
import { PortalEmployeeService } from '../portal-employee.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SnackBarTemplate } from '../../shared/snack-bar-template';
import { SharedService } from '../../shared/shared.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PortalEmployeeOvertimeApplicationDialogComponent } from '../portal-employee-overtime-application-dialog/portal-employee-overtime-application-dialog.component';
import { PortalEmployeeLeaveApplicationDialogComponent } from '../portal-employee-leave-application-dialog/portal-employee-leave-application-dialog.component';

@Component({
  selector: 'app-portal-employee-approver-dialog',
  templateUrl: './portal-employee-approver-dialog.component.html',
  styleUrls: ['./portal-employee-approver-dialog.component.css']
})
export class PortalEmployeeApproverDialogComponent implements OnInit {

  constructor(
    public _dialogRef: MatDialogRef<PortalEmployeeApproverDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public caseData: any,
    private _portalEmployeeService: PortalEmployeeService,
    private _snackBarTemplate: SnackBarTemplate,
    private _snackBar: MatSnackBar,
    public _matDialog: MatDialog,
  ) { }

  public dialogTitle: string = this.caseData.objDialogTitle;
  public dialogData: any = this.caseData.objData;
  public dialogType: any = this.caseData.objType;
  public dialogYearId: any = this.caseData.objYearId;
  // Class properties
  public _listLeaveApplicationLineObservableArray: ObservableArray = new ObservableArray();
  public _listLeaveApplicationLineCollectionView: CollectionView = new CollectionView(this._listLeaveApplicationLineObservableArray);

  public _isLeaveApplicationLineProgressBarHidden = false;
  public _isLeaveApplicationLineDataLoaded: boolean = false;

  private _leaveApplicationLineSubscription: any;

  @ViewChild('flexLeaveApplicationLine') flexLeaveApplicationLine: wjcGrid.FlexGrid;

  public _listOvertimeApplicationLineObservableArray: ObservableArray = new ObservableArray();
  public _listOvertimeApplicationLineCollectionView: CollectionView = new CollectionView(this._listOvertimeApplicationLineObservableArray);

  public _isOvertimeApplicationLineProgressBarHidden = false;
  public _isOvertimeApplicationLineDataLoaded: boolean = false;

  public _listPageIndex: number = 15;

  private _overtimeApplicationLineSubscription: any;

  public isOTLineHidden: boolean = true;
  public isLALineHidden: boolean = true;

  @ViewChild('flexOvertimeApplicationLine') flexOvertimeApplicationLine: wjcGrid.FlexGrid;

  private loadApplicationLines() {
    setTimeout(() => {

      console.log(this.dialogType);
      this.isOTLineHidden = true;
      this.isLALineHidden = true;

      if (this.dialogType == "LA") {
        this.GetLeaveApplicationLineListData();
      } else if (this.dialogType == "OT") {
        this.GetOvertimeApplicationLineListData();
      }

    }, 500);
  }

  private async GetLeaveApplicationLineListData() {

    this._listLeaveApplicationLineObservableArray = new ObservableArray();
    this._listLeaveApplicationLineCollectionView = new CollectionView(this._listLeaveApplicationLineObservableArray);
    this._listLeaveApplicationLineCollectionView.pageSize = 15;
    this._listLeaveApplicationLineCollectionView.trackChanges = true;
    await this._listLeaveApplicationLineCollectionView.refresh();
    await this.flexLeaveApplicationLine.refresh();

    this._isLeaveApplicationLineProgressBarHidden = true;

    this._leaveApplicationLineSubscription = await (await this._portalEmployeeService.ApproverLeaveApplicationLineList(this.dialogData)).subscribe(
      (response: any) => {
        if (response["length"] > 0) {
          this._listLeaveApplicationLineObservableArray = response;
          this._listLeaveApplicationLineCollectionView = new CollectionView(this._listLeaveApplicationLineObservableArray);
          this._listLeaveApplicationLineCollectionView.pageSize = 15;
          this._listLeaveApplicationLineCollectionView.trackChanges = true;
          this._listLeaveApplicationLineCollectionView.refresh();
          this.flexLeaveApplicationLine.refresh();
        }

        this.isOTLineHidden = true;
        this.isLALineHidden = false;

        this._isLeaveApplicationLineDataLoaded = true;
        this._isLeaveApplicationLineProgressBarHidden = false;
        if (this._leaveApplicationLineSubscription !== null) this._leaveApplicationLineSubscription.unsubscribe();
      },
      error => {
        this._isLeaveApplicationLineProgressBarHidden = false;
        this._snackBarTemplate.snackBarError(this._snackBar, error.error.Message + " " + error.status);
        if (this._leaveApplicationLineSubscription !== null) this._leaveApplicationLineSubscription.unsubscribe();
      }
    );
  }

  private async GetOvertimeApplicationLineListData() {

    this._listOvertimeApplicationLineObservableArray = new ObservableArray();
    this._listOvertimeApplicationLineCollectionView = new CollectionView(this._listOvertimeApplicationLineObservableArray);
    this._listOvertimeApplicationLineCollectionView.pageSize = 15;
    this._listOvertimeApplicationLineCollectionView.trackChanges = true;
    await this._listOvertimeApplicationLineCollectionView.refresh();
    await this.flexOvertimeApplicationLine.refresh();

    this._isOvertimeApplicationLineProgressBarHidden = true;

    this._overtimeApplicationLineSubscription = await (await this._portalEmployeeService.ApproverOvertimeApplicationLineList(this.dialogData)).subscribe(
      (response: any) => {
        console.log(response);
        if (response["length"] > 0) {
          this._listOvertimeApplicationLineObservableArray = response;
          this._listOvertimeApplicationLineCollectionView = new CollectionView(this._listOvertimeApplicationLineObservableArray);
          this._listOvertimeApplicationLineCollectionView.pageSize = 15;
          this._listOvertimeApplicationLineCollectionView.trackChanges = true;
          this._listOvertimeApplicationLineCollectionView.refresh();
          this.flexOvertimeApplicationLine.refresh();
        }

        this.isLALineHidden = true;
        this.isOTLineHidden = false;

        this._isOvertimeApplicationLineDataLoaded = true;
        this._isOvertimeApplicationLineProgressBarHidden = false;
        if (this._overtimeApplicationLineSubscription !== null) this._overtimeApplicationLineSubscription.unsubscribe();
      },
      error => {
        this._isOvertimeApplicationLineProgressBarHidden = false;
        this._snackBarTemplate.snackBarError(this._snackBar, error.error.Message + " " + error.status);
        if (this._overtimeApplicationLineSubscription !== null) this._overtimeApplicationLineSubscription.unsubscribe();
      }
    );
  }

  public RemoveComma(value: string): string {
    return value.toString().replace(/,/g, '');
  }

  gridOTClick(s, e) {
    if (wjcCore.hasClass(e.target, 'ot-button-edit')) {
      let currentOT = this._listOvertimeApplicationLineCollectionView.currentItem;
      console.log(currentOT);
      let _overtimeApplicationLine: any = {
        Id: currentOT.Id,
        OTId: currentOT.OTId,
        EmployeeId: currentOT.EmployeeId,
        Employee: currentOT.Employee,
        OTDate: currentOT.OTDate,
        OTHours: this.RemoveComma(currentOT.OTHours),
        Remarks: currentOT.Remarks,
      }

      const dialogRef = this._matDialog.open(PortalEmployeeOvertimeApplicationDialogComponent, {
        width: '600px',
        data: {
          objDialogTitle: "Overtime Application",
          objData: _overtimeApplicationLine,
          objYearId: this.dialogYearId
        },
        disableClose: true
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result.event !== 'Close') {
          this.GetOvertimeApplicationLineListData();
        }
      });
    }
  }

  gridLAClick(s, e) {
    if (wjcCore.hasClass(e.target, 'la-button-edit')) {
      let currentLA = this._listLeaveApplicationLineCollectionView.currentItem;

      let _leaveApplicationLine: any = {
        Id: currentLA.Id,
        LAId: currentLA.LAId,
        EmployeeId: currentLA.EmployeeId,
        Employee: currentLA.Employee,
        LADate: currentLA.LADate,
        IsHalfDay: currentLA.IsHalfDay,
        IsWithPay: currentLA.IsWithPay,
        IsApproved: currentLA.IsApproved,
        Remarks: currentLA.Remarks,
      }

      const dialogRef = this._matDialog.open(PortalEmployeeLeaveApplicationDialogComponent, {
        width: '600px',
        data: {
          objDialogTitle: "Leave Application",
          objData: _leaveApplicationLine,
          objYearId: this.dialogYearId
        },
        disableClose: true
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result.event !== 'Close') {
          this.GetLeaveApplicationLineListData();
        }
      });
    }
  }

  public Close() { }

  ngOnInit(): void {
    this.loadApplicationLines();
  }

}
