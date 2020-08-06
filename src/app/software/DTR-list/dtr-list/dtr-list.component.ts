import { Component, OnInit, ViewChild } from '@angular/core';

import * as wjcGrid from '@grapecity/wijmo.grid';
import { CollectionView, ObservableArray } from '@grapecity/wijmo';

import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackBarTemplate } from '../../shared/snack-bar-template';

import { DTRListService } from './../dtr-list.service';
import { DeleteDialogBoxComponent } from '../../shared/delete-dialog-box/delete-dialog-box.component';
import { Router } from '@angular/router';
@Component({
  selector: 'app-dtr-list',
  templateUrl: './dtr-list.component.html',
  styleUrls: ['./dtr-list.component.css']
})
export class DTRListComponent implements OnInit {
  // Class properties
  public _listDTRObservableArray: ObservableArray = new ObservableArray();
  public _listDTRCollectionView: CollectionView = new CollectionView(this._listDTRObservableArray);
  public _listPageIndex: number = 15;

  public _isProgressBarHidden = false;
  public _isDataLoaded: boolean = false;

  private _dTRListSubscription: any;
  private _addDTRSubscription: any;
  private _deleteDTRSubscription: any;

  public _btnAddDisabled: boolean = false;

  // DOM declaration
  @ViewChild('flexDTR') flexDTR: wjcGrid.FlexGrid;

  // Constructor and overrides
  constructor(private _dTRListService: DTRListService,
    public _DTRRegistrationlDialog: MatDialog,
    private _snackBar: MatSnackBar,
    private _snackBarTemplate: SnackBarTemplate,
    public _matDialogRef: MatDialog,
    private _router: Router) {
  }

  ngOnInit(): void {
    this.GetPayrollGroupDropdownListData();
    this.CreateCboShowNumberOfRows();
  }
  // ========================
  // EmployeePayroll Dropdown
  // ========================

  public _createCboShowNumberOfRows: ObservableArray = new ObservableArray();

  public CreateCboShowNumberOfRows(): void {
    for (var i = 0; i <= 4; i++) {
      var rows = 0;
      var rowsString = "";
      if (i == 0) {
        rows = 15;
        rowsString = "Show 15";
      } else if (i == 1) {
        rows = 50;
        rowsString = "Show 50";
      } else if (i == 2) {
        rows = 100;
        rowsString = "Show 100";
      } else if (i == 3) {
        rows = 150;
        rowsString = "Show 150";
      } else {
        rows = 200;
        rowsString = "Show 200";
      }

      this._createCboShowNumberOfRows.push({
        rowNumber: rows,
        rowString: rowsString
      });
    }
  }

  public CboShowNumberOfRowsOnSelectedIndexChanged(): void {
    this._listDTRCollectionView.pageSize = this._listPageIndex;
    this._listDTRCollectionView.refresh();
    this._listDTRCollectionView.refresh();
  }

  private _payrollGroupDropdownSubscription: any;
  public _payrollGroupListDropdown: any = [];
  public _filterPayrollGroup = '';

  private async GetPayrollGroupDropdownListData() {
    this._payrollGroupDropdownSubscription = await (await this._dTRListService.PayrollGroupList()).subscribe(
      response => {
        var results = response;
        if (results["length"] > 0) {
          for (var i = 0; i < results["length"]; i++) {
            this._payrollGroupListDropdown.push(results[i]);
          }
        }
        this._filterPayrollGroup = this._payrollGroupListDropdown[0].Value;

        this.GetDTRListData();
        if (this._payrollGroupDropdownSubscription !== null) this._payrollGroupDropdownSubscription.unsubscribe();
      },
      error => {
        this._snackBarTemplate.snackBarError(this._snackBar, error.error.Message + " " + error.status);
        if (this._payrollGroupDropdownSubscription !== null) this._payrollGroupDropdownSubscription.unsubscribe();
      }
    );
  }

  public PayrollGroupSelectionChange() {
    this.GetDTRListData();
  }

  // Methods
  private async GetDTRListData() {
    this._listDTRObservableArray = new ObservableArray();
    this._listDTRCollectionView = new CollectionView(this._listDTRObservableArray);
    this._listDTRCollectionView.pageSize = 15;
    this._listDTRCollectionView.trackChanges = true;
    await this._listDTRCollectionView.refresh();
    await this.flexDTR.refresh();

    this._isProgressBarHidden = true;

    this._dTRListSubscription = (await this._dTRListService.DTRList(this._filterPayrollGroup)).subscribe(
      (response: any) => {
        var results = response;
        console.log("Response:", results);

        if (results["length"] > 0) {
          this._listDTRObservableArray = results;
          this._listDTRCollectionView = new CollectionView(this._listDTRObservableArray);
          this._listDTRCollectionView.pageSize = 15;
          this._listDTRCollectionView.trackChanges = true;
          this._listDTRCollectionView.refresh();
          this.flexDTR.refresh();
        }

        this._isDataLoaded = true;
        this._isProgressBarHidden = false;

        if (this._dTRListSubscription != null) this._dTRListSubscription.unsubscribe();
      },
      error => {
        this._snackBarTemplate.snackBarError(this._snackBar, error.error.Message + " " + error.status);
        if (this._dTRListSubscription !== null) this._dTRListSubscription.unsubscribe();
      }
    );
  }

  public async AddDTR() {

    this._btnAddDisabled = true;
    if (this._isDataLoaded == true) {
      this._isDataLoaded = false;
      this._addDTRSubscription = (await this._dTRListService.AddDTR()).subscribe(
        (response: any) => {
          this._btnAddDisabled = false;
          this._isDataLoaded = true;
          this._router.navigate(['/software/DTR-detail/' + response]);

          this.GetDTRListData();
          this._snackBarTemplate.snackBarSuccess(this._snackBar, "Added Successfully");
        },
        error => {
          this._btnAddDisabled = false;
          this._isDataLoaded = true;
          this._snackBarTemplate.snackBarError(this._snackBar, error.error + " " + " Status Code: " + error.status);
          if (this._addDTRSubscription != null) this._addDTRSubscription.unsubscribe();
        }
      );
    }
  }

  public EditDTR() {
    let currentDTR = this._listDTRCollectionView.currentItem;
    this._router.navigate(['/software/DTR-detail/' + currentDTR.Id]);

  }

  public async DeleteDTR() {
    let currentDTR = this._listDTRCollectionView.currentItem;
    this._isProgressBarHidden = true;

    if (this._isDataLoaded == true) {
      this._isDataLoaded = false;
      this._deleteDTRSubscription = (await this._dTRListService.DeleteDTR(currentDTR.Id)).subscribe(
        response => {
          this._snackBarTemplate.snackBarSuccess(this._snackBar, "Delete Successfully");
          this.GetDTRListData();
          this._isProgressBarHidden = false;
          this._isDataLoaded = true;
        },
        error => {
          this._isDataLoaded = true;
          this._isProgressBarHidden = false;
          this._snackBarTemplate.snackBarError(this._snackBar, error.error + " " + error.status);
          if (this._deleteDTRSubscription != null) this._deleteDTRSubscription.unsubscribe();
        }
      );
    }
  }

  public ComfirmDeleteDTR(): void {
    let currentDTR = this._listDTRCollectionView.currentItem;
    const userRegistrationlDialogRef = this._matDialogRef.open(DeleteDialogBoxComponent, {
      width: '500px',
      data: {
        objDialogTitle: "Delete DTR",
        objComfirmationMessage: ` Delete ${currentDTR.DTRNumber}?`,
      },
      disableClose: true
    });

    userRegistrationlDialogRef.afterClosed().subscribe(result => {
      if (result.message == "Yes") {
        this.DeleteDTR();
      }
    });
  }
}
