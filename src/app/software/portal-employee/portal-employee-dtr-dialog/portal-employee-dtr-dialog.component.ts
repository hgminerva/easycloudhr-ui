import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import * as wjcGrid from '@grapecity/wijmo.grid';
import { CollectionView, ObservableArray } from '@grapecity/wijmo';
import { PortalEmployeeService } from '../portal-employee.service';
import { SnackBarTemplate } from '../../shared/snack-bar-template';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PdfDialogComponent } from '../../shared/pdf-dialog/pdf-dialog.component';
import { SharedService } from '../../shared/shared.service';

@Component({
  selector: 'app-portal-employee-dtr-dialog',
  templateUrl: './portal-employee-dtr-dialog.component.html',
  styleUrls: ['./portal-employee-dtr-dialog.component.css']
})
export class PortalEmployeeDtrDialogComponent implements OnInit {

  constructor(
    public _dialogRef: MatDialogRef<PortalEmployeeDtrDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public caseData: any,
    public _matDialog: MatDialog,
    private _portalEmployeeService: PortalEmployeeService,
    private _snackBar: MatSnackBar,
    private _snackBarTemplate: SnackBarTemplate,
    private _sharedService: SharedService
  ) { }

  public title = '';

  ngOnInit(): void {
    this.title = this.caseData.objDialogTitle;
    this.GetDTRLineListData();
  }

  public overtimeApplication: any;
  public _isComponentHidden: boolean = true;
  public _btnAddDTRLineDisabled: boolean = false;

  // OT Application
  public _listDTRLineObservableArray: ObservableArray = new ObservableArray();
  public _listDTRLineCollectionView: CollectionView = new CollectionView(this._listDTRLineObservableArray);
  public _listDTRLinePageIndex: number = 15;

  public _isDTRLineProgressBarHidden = false;
  public _isDTRLineDataLoaded: boolean = false;

  private _DTRLineSubscription: any;

  @ViewChild('flexDTRLine') flexDTRLine: wjcGrid.FlexGrid;

  private async GetDTRLineListData() {

    this._listDTRLineObservableArray = new ObservableArray();
    this._listDTRLineCollectionView = new CollectionView(this._listDTRLineObservableArray);
    this._listDTRLineCollectionView.pageSize = 10;
    this._listDTRLineCollectionView.trackChanges = true;
    await this._listDTRLineCollectionView.refresh();
    await this.flexDTRLine.refresh();

    this._isDTRLineProgressBarHidden = true;
    console.log('DTR Id: ', this.caseData.objDataDTR.Id);
    this._DTRLineSubscription = await (await this._portalEmployeeService.DTRLineList(this.caseData.objDataEmployeeId, this.caseData.objDataDTR.Id)).subscribe(
      (response: any) => {
        if (response["length"] > 0) {
          this._listDTRLineObservableArray = response;
          this._listDTRLineCollectionView = new CollectionView(this._listDTRLineObservableArray);
          this._listDTRLineCollectionView.pageSize = 10;
          this._listDTRLineCollectionView.trackChanges = true;
          this._listDTRLineCollectionView.refresh();
          this.flexDTRLine.refresh();
        }

        this._isDTRLineDataLoaded = true;
        this._isDTRLineProgressBarHidden = false;
        this._isComponentHidden = false;

        if (this._DTRLineSubscription !== null) this._DTRLineSubscription.unsubscribe();
      },
      error => {
        this._isDTRLineProgressBarHidden = false;
        this._snackBarTemplate.snackBarError(this._snackBar, error.error.Message + " " + error.status);
        if (this._DTRLineSubscription !== null) this._DTRLineSubscription.unsubscribe();
      }
    );
  }

  public async Print() {
    const matDialogRef = this._matDialog.open(PdfDialogComponent, {
      width: '900px',
      data: {
        objDialogTitle: "DTR",
        objData: { EmployeeId: this.caseData.objDataEmployeeId, TransactionId: this.caseData.objDataDTR.Id }
      },
      disableClose: true
    });

    matDialogRef.afterClosed().subscribe(result => {
      if (result.message == "Yes") {
      }
    });
  }

  public Close(): void {
    this._dialogRef.close({ event: 'Close' });
  }

  public btnCSVListClick() {
    this._sharedService.generateCSVSpecifiedColumn(this._listDTRLineCollectionView, "DTR Logs", "dtr-list.csv", 25);
  }
}
