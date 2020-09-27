import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import * as wjcGrid from '@grapecity/wijmo.grid';
import { CollectionView, ObservableArray } from '@grapecity/wijmo';
import * as wjcCore from '@grapecity/wijmo';

import { PortalEmployeeService } from '../portal-employee.service';
import { SnackBarTemplate } from '../../shared/snack-bar-template';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PortalEmployeeOvertimeApplicationLineAddDialogComponent } from './portal-employee-overtime-application-line-add-dialog/portal-employee-overtime-application-line-add-dialog.component';

@Component({
  selector: 'app-portal-employee-overtime-application-dialog',
  templateUrl: './portal-employee-overtime-application-dialog.component.html',
  styleUrls: ['./portal-employee-overtime-application-dialog.component.css']
})
export class PortalEmployeeOvertimeApplicationDialogComponent implements OnInit {

  constructor(
    public _dialogRef: MatDialogRef<PortalEmployeeOvertimeApplicationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public caseData: any,
    public _matDialog: MatDialog,
    private _portalEmployeeService: PortalEmployeeService,
    private _snackBar: MatSnackBar,
    private _snackBarTemplate: SnackBarTemplate,
  ) { }

  public title = '';

  ngOnInit(): void {
    this.title = this.caseData.objDialogTitle;
    this.LoadOvertimeApplication();
  }

  public overtimeApplication: any;
  public _isComponentHidden: boolean = true;
  public _btnAddOvertimeApplicationLineDisabled: boolean = false;
  public _editButtonDisabled: boolean = true;
  public _deleteButtonDisabled: boolean = true;

  // OT Application
  public _listOvertimeApplicationLineObservableArray: ObservableArray = new ObservableArray();
  public _listOvertimeApplicationLineCollectionView: CollectionView = new CollectionView(this._listOvertimeApplicationLineObservableArray);
  public _listOvertimeApplicationLinePageIndex: number = 15;

  public _isOvertimeApplicationLineProgressBarHidden = false;
  public _isOvertimeApplicationLineDataLoaded: boolean = false;

  private _overtimeApplicationLineSubscription: any;
  private _addOvertimeApplicationDetailSubscription: any;

  @ViewChild('flexOvertimeApplicationLine') flexOvertimeApplicationLine: wjcGrid.FlexGrid;

  private LoadOvertimeApplication() {

    this.overtimeApplication = this.caseData.objDataOTApplication;
    console.log("OT: ", this.overtimeApplication);

    setTimeout(() => {
      this.GetOvertimeApplicationDetail();
    }, 100);

  }

  public _overtimeApplicationDetailSubscription: any;

  private async GetOvertimeApplicationDetail() {
    this._isComponentHidden = true;
    this._overtimeApplicationDetailSubscription = await (await this._portalEmployeeService.OvertimeApplicationDetail(this.caseData.objDataOTApplication.Id)).subscribe(
      (response: any) => {
        let result = response;
        if (result != null) {
          this.overtimeApplication = result;
          console.log(result);
          this.loadComponent(result["IsLocked"]);
        }

        this.GetOvertimeApplicationLineListData();
        this._isComponentHidden = false;
        if (this._overtimeApplicationDetailSubscription !== null) this._overtimeApplicationDetailSubscription.unsubscribe();
      },
      error => {
        this._snackBarTemplate.snackBarError(this._snackBar, error.error.Message + " " + error.status);
        if (this._overtimeApplicationDetailSubscription !== null) this._overtimeApplicationDetailSubscription.unsubscribe();
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

    this._overtimeApplicationLineSubscription = await (await this._portalEmployeeService.OvertimeApplicationLineList(this.caseData.objDataEmployeeId, this.caseData.objDataOTApplication.Id)).subscribe(
      (response: any) => {
        if (response["length"] > 0) {
          this._listOvertimeApplicationLineObservableArray = response;
          this._listOvertimeApplicationLineCollectionView = new CollectionView(this._listOvertimeApplicationLineObservableArray);
          this._listOvertimeApplicationLineCollectionView.pageSize = 15;
          this._listOvertimeApplicationLineCollectionView.trackChanges = true;
          this._listOvertimeApplicationLineCollectionView.refresh();
          this.flexOvertimeApplicationLine.refresh();
        }

        this._isOvertimeApplicationLineDataLoaded = true;
        this._isOvertimeApplicationLineProgressBarHidden = false;
        this._isComponentHidden = false;

        if (this._overtimeApplicationLineSubscription !== null) this._overtimeApplicationLineSubscription.unsubscribe();
      },
      error => {
        this._isOvertimeApplicationLineProgressBarHidden = false;
        this._snackBarTemplate.snackBarError(this._snackBar, error.error.Message + " " + error.status);
        if (this._overtimeApplicationLineSubscription !== null) this._overtimeApplicationLineSubscription.unsubscribe();
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

  public async AddOvertimeApplicationLine() {
    const dialogRef = this._matDialog.open(PortalEmployeeOvertimeApplicationLineAddDialogComponent, {
      width: '600px',
      data: {
        objDialogTitle: "Overtime Application",
        objDataOTId: this.overtimeApplication.Id,
        objDataEmployeeId: this.caseData.objDataEmployeeId,
      },
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result.event !== 'Close') {
        this.AddOvertimeApplicationDetail(result.data);
      }
    });
  }

  public async AddOvertimeApplicationDetail(overtimeApplicationLine: any) {
    if (this._isOvertimeApplicationLineDataLoaded == true) {
      this._isOvertimeApplicationLineDataLoaded = false;
      this._addOvertimeApplicationDetailSubscription = (await this._portalEmployeeService.AddOvertimeApplicationLine(overtimeApplicationLine)).subscribe(
        response => {
          this.GetOvertimeApplicationLineListData();
          this._isOvertimeApplicationLineDataLoaded = true;
          this._snackBarTemplate.snackBarSuccess(this._snackBar, "Save Successfully.");
          if (this._addOvertimeApplicationDetailSubscription !== null) this._addOvertimeApplicationDetailSubscription.unsubscribe();
        },
        error => {
          this._isOvertimeApplicationLineDataLoaded = true;
          this._snackBarTemplate.snackBarError(this._snackBar, error.error.Message + " " + error.status);
          if (this._addOvertimeApplicationDetailSubscription !== null) this._addOvertimeApplicationDetailSubscription.unsubscribe();
        }
      );
    }
  }

  EditOvertimeApplicationLine() { }
  ComfirmDeleteOvertimeApplicationLine() { }


  gridClick(s, e) {
    if (wjcCore.hasClass(e.target, 'button-edit')) {
      this.EditOvertimeApplicationLine();
    }

    if (wjcCore.hasClass(e.target, 'button-delete')) {
      this.ComfirmDeleteOvertimeApplicationLine();
    }
  }
  
  private loadComponent(isDisable) {
    this._btnAddOvertimeApplicationLineDisabled = isDisable;
    this._editButtonDisabled = isDisable;
    this._deleteButtonDisabled = isDisable;
  }

}
