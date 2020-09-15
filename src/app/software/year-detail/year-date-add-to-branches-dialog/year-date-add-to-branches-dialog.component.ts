import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackBarTemplate } from '../../shared/snack-bar-template';
import { YearDetialService } from '../year-detial.service';
import { YearDateList, YearDateModel } from '../year-date.model';
import { DatePipe } from '@angular/common';

import * as wjcGrid from '@grapecity/wijmo.grid';
import { CollectionView, ObservableArray } from '@grapecity/wijmo';

@Component({
  selector: 'app-year-date-add-to-branches-dialog',
  templateUrl: './year-date-add-to-branches-dialog.component.html',
  styleUrls: ['./year-date-add-to-branches-dialog.component.css']
})
export class YearDateAddToBranchesDialogComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<YearDateAddToBranchesDialogComponent>,
    private _yearDetialService: YearDetialService,
    @Inject(MAT_DIALOG_DATA) public caseData: any,
    private _snackBar: MatSnackBar,
    private _snackBarTemplate: SnackBarTemplate,
    public _matDialog: MatDialog,
    private datePipe: DatePipe
  ) { }

  ngOnInit(): void {
    this.title = this.caseData.objDialogTitle;
    this._yearDateLines.YearId = this.caseData.objYearDate.YearId;
    console.log(this._yearDateLines.YearId);
    this.DateTypeListData();
  }

  public _yearDateLines: YearDateList = {
    Id: 0,
    YearId: 0,
    YearDate: this.datePipe.transform(new Date(), 'yyyy-MM-dd'),
    Branch: [],
    DateType: '',
    Remarks: 'NA'
  }
  public title = '';
  public isComponentHidden: boolean = true;

  public UIYearDate = new Date();

  public _branchListDropdownSubscription: any;
  public _branchListDropdown: any = [];

  public _dateTypeListDropdownSubscription: any;
  public _dateTypeListDropdown: any = [];

  public _listBranchesObservableArray: ObservableArray = new ObservableArray();
  public _listBranchesCollectionView: CollectionView = new CollectionView(this._listBranchesObservableArray);
  @ViewChild('flexBranches') flexBranches: wjcGrid.FlexGrid;
  public _isProgressBarHidden = false;
  public _isDataLoaded: boolean = false;
  public _listBranchesViewSize: number = 0;
  public _branches: any;

  private async DateTypeListData() {
    this._dateTypeListDropdownSubscription = (await this._yearDetialService.DayTypeDropdown()).subscribe(
      response => {
        this._dateTypeListDropdown = response;
        this._yearDateLines.DateType = this._dateTypeListDropdown[0].Value;
        this.BranchListData();
        if (this._dateTypeListDropdownSubscription !== null) this._dateTypeListDropdownSubscription.unsubscribe();
      },
      error => {
        this._snackBarTemplate.snackBarError(this._snackBar, error.error.Message + " " + error.status);
        if (this._dateTypeListDropdownSubscription !== null) this._dateTypeListDropdownSubscription.unsubscribe();
      }
    );
  }

  public GetUIDATEYearDate() {
    this._yearDateLines.YearDate = this.datePipe.transform(this.UIYearDate, 'yyyy-MM-dd');
  }

  // =============
  // Branches List
  // =============
  private async BranchListData() {
    this._listBranchesObservableArray = new ObservableArray();
    this._listBranchesCollectionView = new CollectionView(this._listBranchesObservableArray);
    this._listBranchesCollectionView.pageSize = 5;

    this._listBranchesCollectionView.trackChanges = true;
    await this._listBranchesCollectionView.refresh();
    await this.flexBranches.refresh();

    this._isProgressBarHidden = true;
    this.isComponentHidden = true;

    this._branchListDropdownSubscription = (await this._yearDetialService.BranchDropdown()).subscribe(
      (response: any) => {
        let results = response;
        if (results["length"] > 0) {
          this._branches = results;
          this._listBranchesObservableArray = results;
          this._listBranchesCollectionView = new CollectionView(this._listBranchesObservableArray);
          this._listBranchesCollectionView.trackChanges = true;
          this._listBranchesCollectionView.refresh();
          this.flexBranches.refresh();
        }
        this._isDataLoaded = true;
        this._isProgressBarHidden = false;
        this.isComponentHidden = false;

        if (this._branchListDropdownSubscription !== null) this._branchListDropdownSubscription.unsubscribe();
      },
      error => {
        this._snackBarTemplate.snackBarError(this._snackBar, error.error.Message + " " + error.status);
        if (this._branchListDropdownSubscription !== null) this._branchListDropdownSubscription.unsubscribe();
      }
    );
  }

  headerClick() {
    // console.log("Select all");
  }

  topLeftClicked(e) {
    let val = e.target.checked;
    this.flexBranches.beginUpdate();
    for (let i = 0; i < this.flexBranches.rows.length; i++) {
      this.flexBranches.rows[i].isSelected = val;
    }
    this.flexBranches.endUpdate();
  }

  rowHeaderClicked(e) {
    let val = e.target.checked;
    let selectedRowCnt = this._getTotalSelectedRows(this.flexBranches);
    let checked = selectedRowCnt > 0;
    let indeterminate = (selectedRowCnt > 0 && this.flexBranches.rows.length > selectedRowCnt);
    let cb = this.flexBranches.topLeftCells.getCellElement(0, 0).querySelector("input") as HTMLInputElement;
    cb.checked = checked;
    cb.indeterminate = indeterminate;
  }

  _getTotalSelectedRows(grid: wjcGrid.FlexGrid) {
    let cnt = 0;
    for (let i = 0; i < grid.rows.length; i++) {
      if (grid.rows[i].isSelected) {
        cnt++;
      }
    }
    return cnt;
  }

  public Save(): void {
    this.dialogRef.close({ event: 'Save' });
  }

  public Close(): void {
    this.dialogRef.close({ event: 'Close' });
  }

  public __addYearDateToBranchesSubscription: any;
  public disableComponentOnInsert: boolean = false;

  public async AddYearDateLines() {
    this._yearDateLines.YearDate = this.datePipe.transform(this.UIYearDate, 'yyyy-MM-dd');
    this._yearDateLines.Branch = this.flexBranches.selectedItems;

    if (this._isDataLoaded == true) {
      this._isDataLoaded = false;
      this.disableComponentOnInsert = true;

      this.__addYearDateToBranchesSubscription = (await this._yearDetialService.AddYearDateToBranches(this._yearDateLines)).subscribe(
        (response: any) => {
          this._isDataLoaded = true;
          this._snackBarTemplate.snackBarSuccess(this._snackBar, "Added Successfully");
          this.disableComponentOnInsert = false;
          this.Save();
        },
        error => {
          this.disableComponentOnInsert = false;
          this._isDataLoaded = true;
          this._snackBarTemplate.snackBarError(this._snackBar, error.error + " " + " Status Code: " + error.status);
          if (this.__addYearDateToBranchesSubscription != null) this.__addYearDateToBranchesSubscription.unsubscribe();
        }
      );
    }
  }
}
