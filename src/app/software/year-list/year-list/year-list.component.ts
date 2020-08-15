import { Component, OnInit, ViewChild } from '@angular/core';

import * as wjcGrid from '@grapecity/wijmo.grid';
import { CollectionView, ObservableArray } from '@grapecity/wijmo';

import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackBarTemplate } from '../../shared/snack-bar-template';

import { YearListService } from './../year-list.service';
import { DeleteDialogBoxComponent } from '../../shared/delete-dialog-box/delete-dialog-box.component';
import { YearDetialComponent } from '../../year-detail/year-detial/year-detial.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-year-list',
  templateUrl: './year-list.component.html',
  styleUrls: ['./year-list.component.css']
})
export class YearListComponent implements OnInit {

  // Class properties
  public _listYearObservableArray: ObservableArray = new ObservableArray();
  public _listYearCollectionView: CollectionView = new CollectionView(this._listYearObservableArray);
  public _listPageIndex: number = 15;

  public _isProgressBarHidden = false;
  public _isDataLoaded: boolean = false;

  private _yearListSubscription: any;
  private _addYearSubscription: any;
  private _deleteYearSubscription: any;

  public _btnAddDisabled: boolean = false;

  // DOM declaration
  @ViewChild('flexYear') flexYear: wjcGrid.FlexGrid;

  // Constructor and overrides
  constructor(private _yearListService: YearListService,
    private _router: Router,
    private _snackBar: MatSnackBar,
    private _snackBarTemplate: SnackBarTemplate,
    public _matDialogRef: MatDialog) {
  }
  async ngOnInit() {
    await this.GetYearListData();
    await this.createCboShowNumberOfRows();
  }

  public cboShowNumberOfRows: ObservableArray = new ObservableArray();
  public listPageIndex: number = 15;

  public createCboShowNumberOfRows(): void {
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

      this.cboShowNumberOfRows.push({
        rowNumber: rows,
        rowString: rowsString
      });
    }
  }

  public cboShowNumberOfRowsOnSelectedIndexChanged(): void {
    this._listYearCollectionView.pageSize = this.listPageIndex;
    this._listYearCollectionView.refresh();
    this._listYearCollectionView.refresh();
  }

  // Methods
  private async GetYearListData() {
    this._listYearObservableArray = new ObservableArray();
    this._listYearCollectionView = new CollectionView(this._listYearObservableArray);
    this._listYearCollectionView.pageSize = 15;
    this._listYearCollectionView.trackChanges = true;
    await this._listYearCollectionView.refresh();
    await this.flexYear.refresh();

    this._isProgressBarHidden = true;

    this._yearListSubscription = (await this._yearListService.YearList()).subscribe(
      (response: any) => {
        var results = response;
        if (results["length"] > 0) {
          this._listYearObservableArray = results;
          this._listYearCollectionView = new CollectionView(this._listYearObservableArray);
          this._listYearCollectionView.pageSize = 15;
          this._listYearCollectionView.trackChanges = true;
          this._listYearCollectionView.refresh();
          this.flexYear.refresh();
        }

        this._isDataLoaded = true;
        this._isProgressBarHidden = false;

        if (this._yearListSubscription != null) this._yearListSubscription.unsubscribe();
      },
      error => {
        if (error.status == "401") {
          location.reload();
        } else {
          this._snackBarTemplate.snackBarError(this._snackBar, error.error.Message + " " + " Status Code: " + error.status);
          if (this._yearListSubscription != null) this._yearListSubscription.unsubscribe();

        }
      }
    );
  }

  public async AddYear() {
    this._btnAddDisabled = true;
    if (this._isDataLoaded == true) {
      this._isDataLoaded = false;
      this._addYearSubscription = (await this._yearListService.AddYear()).subscribe(
        (response: any) => {
          this._btnAddDisabled = false;
          this._isDataLoaded = true;
          this.GetYearListData();
          this._router.navigate(['/software/year-detail/' + response]);
          this._snackBarTemplate.snackBarSuccess(this._snackBar, "Added Successfully");
        },
        error => {
          this._btnAddDisabled = false;
          this._isDataLoaded = true;
          this._snackBarTemplate.snackBarError(this._snackBar, error.error + " " + " Status Code: " + error.status);
          if (this._addYearSubscription != null) this._addYearSubscription.unsubscribe();
        }
      );
    }
  }

  public EditYear() {
    let currentYear = this._listYearCollectionView.currentItem;
    this._router.navigate(['/software/year-detail/' + currentYear.Id]);
  }

  public async DeleteYear() {
    let currentYear = this._listYearCollectionView.currentItem;
    this._isProgressBarHidden = true;

    if (this._isDataLoaded == true) {
      this._isDataLoaded = false;
      this._deleteYearSubscription = (await this._yearListService.DeleteYear(currentYear.Id)).subscribe(
        response => {
          this._snackBarTemplate.snackBarSuccess(this._snackBar, "Delete Successfully");
          this.GetYearListData();
          this._isProgressBarHidden = false;
          this._isDataLoaded = true;
        },
        error => {
          this._isDataLoaded = true;
          this._isProgressBarHidden = false;
          this._snackBarTemplate.snackBarError(this._snackBar, error.error.Message + " Status " + error.status);
          if (this._deleteYearSubscription != null) this._deleteYearSubscription.unsubscribe();
        }
      );
    }
  }

  public ComfirmDeleteYear(): void {
    let currentYear = this._listYearCollectionView.currentItem;
    const userRegistrationlDialogRef = this._matDialogRef.open(DeleteDialogBoxComponent, {
      width: '500px',
      data: {
        objDialogTitle: "Delete Year",
        objComfirmationMessage: ` Delete ${currentYear.Year}?`,
      },
      disableClose: true
    });

    userRegistrationlDialogRef.afterClosed().subscribe(result => {
      if (result.message == "Yes") {
        this.DeleteYear();
      }
    });
  }

  public DetailYear(YearId: string, eventTitle: string): void {
    const userRegistrationlDialogRef = this._matDialogRef.open(YearDetialComponent, {
      width: '1200px',
      height: '550px',
      data: {
        objDialogTitle: eventTitle,
        objYearId: YearId,
      },
      disableClose: true
    });

    userRegistrationlDialogRef.afterClosed().subscribe(result => {
      if (result.event !== "Close") {
        this.GetYearListData();
      }
    });
  }

  ngOnDestroy() {
    if (this._yearListSubscription !== null) this._yearListSubscription.unsubscribe();
  }

}
