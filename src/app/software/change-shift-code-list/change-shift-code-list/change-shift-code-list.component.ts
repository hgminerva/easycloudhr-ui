import { Component, OnInit, ViewChild } from '@angular/core';
import * as wjcGrid from '@grapecity/wijmo.grid';
import { CollectionView, ObservableArray } from '@grapecity/wijmo';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackBarTemplate } from '../../shared/snack-bar-template';

import { DeleteDialogBoxComponent } from '../../shared/delete-dialog-box/delete-dialog-box.component';
import { ChangeShiftCodeListService } from './../change-shift-code-list.service';
@Component({
  selector: 'app-change-shift-code-list',
  templateUrl: './change-shift-code-list.component.html',
  styleUrls: ['./change-shift-code-list.component.css']
})
export class ChangeShiftCodeListComponent implements OnInit {

  constructor(
    private shiftCodeListService: ChangeShiftCodeListService,
    private router: Router,
    private _snackBar: MatSnackBar,
    private _snackBarTemplate: SnackBarTemplate,
    public _matDialog: MatDialog,
  ) {
  }

  async ngOnInit() {
    await this.GetChangeShiftCodeListData();
  }

  public _listChangeShiftCodeObservableArray: ObservableArray = new ObservableArray();
  public _listChangeShiftCodeCollectionView: CollectionView = new CollectionView(this._listChangeShiftCodeObservableArray);
  public _listPageIndex: number = 15;
  @ViewChild('flexShiftCode') flexShiftCode: wjcGrid.FlexGrid;
  public _isProgressBarHidden = false;
  public _isDataLoaded: boolean = false;

  private _changeShiftCodeListSubscription: any;
  private _addChangeShiftCodeSubscription: any;
  private _deleteChangeShiftCodeSubscription: any;

  public _buttonDisabled: boolean = false;

  private async GetChangeShiftCodeListData() {
    this._listChangeShiftCodeObservableArray = new ObservableArray();
    this._listChangeShiftCodeCollectionView = new CollectionView(this._listChangeShiftCodeObservableArray);
    this._listChangeShiftCodeCollectionView.pageSize = 15;
    this._listChangeShiftCodeCollectionView.trackChanges = true;
    await this._listChangeShiftCodeCollectionView.refresh();
    await this.flexShiftCode.refresh();

    this._isProgressBarHidden = true;

    this._changeShiftCodeListSubscription = await (await this.shiftCodeListService.ShiftCodeList()).subscribe(
      (response: any) => {
        var results = response;
        console.log("Response:", results);

        if (results["length"] > 0) {
          this._listChangeShiftCodeCollectionView = results;
          this._listChangeShiftCodeCollectionView = new CollectionView(this._listChangeShiftCodeCollectionView);
          this._listChangeShiftCodeCollectionView.pageSize = 15;
          this._listChangeShiftCodeCollectionView.trackChanges = true;
          this._listChangeShiftCodeCollectionView.refresh();
          this.flexShiftCode.refresh();
        }

        this._isDataLoaded = true;
        this._isProgressBarHidden = false;
        if (this._changeShiftCodeListSubscription != null) this._changeShiftCodeListSubscription.unsubscribe();
      },
      error => {
        if (error.status == "401") {
          location.reload();
        } else {
          this._snackBarTemplate.snackBarError(this._snackBar, error.error.Message + " " + " Status Code: " + error.status);
          if (this._changeShiftCodeListSubscription != null) this._changeShiftCodeListSubscription.unsubscribe();
        }
      }
    );
  }

  public async AddChangeShiftCode() {
    this._buttonDisabled = true;
    if (this._isDataLoaded == true) {
      this._isDataLoaded = false;
      this._addChangeShiftCodeSubscription = await (await this.shiftCodeListService.AddShiftCode()).subscribe(
        (response: any) => {
          this._buttonDisabled = false;
          this._isDataLoaded = true;
          this.GetChangeShiftCodeListData();
          this._snackBarTemplate.snackBarSuccess(this._snackBar, "Added Successfully");
          this.router.navigate(['/software/change-shift-code-detail/' + response]);
        },
        error => {
          this._buttonDisabled = false;
          this._isDataLoaded = true;
          this._snackBarTemplate.snackBarError(this._snackBar, error.error + " " + " Status Code: " + error.status);
          if (this._addChangeShiftCodeSubscription != null) this._addChangeShiftCodeSubscription.unsubscribe();
        }
      );
    }
  }

  public EditChangeShiftCode() {
    let currentShiftCode = this._listChangeShiftCodeCollectionView.currentItem;
    this.router.navigate(['/software/change-shift-code-detail/' + currentShiftCode.Id]);
  }

  public async DeleteChangeShiftCode() {
    if (this._isDataLoaded == true) {
      this._isDataLoaded = false;
      let currentShiftCode = this._listChangeShiftCodeCollectionView.currentItem;
      this._isProgressBarHidden = true;

      this._deleteChangeShiftCodeSubscription = await (await this.shiftCodeListService.DeleteShiftCode(currentShiftCode.Id)).subscribe(
        response => {
          this._snackBarTemplate.snackBarSuccess(this._snackBar, "Delete Successfully");
          this.GetChangeShiftCodeListData();
          this._isProgressBarHidden = false;
          this._isDataLoaded = true;
        },
        error => {
          this._isDataLoaded = true;
          this._snackBarTemplate.snackBarError(this._snackBar, error.error + " " + error.status);
          if (this._deleteChangeShiftCodeSubscription != null) this._deleteChangeShiftCodeSubscription.unsubscribe();
        }
      );
    }
  }

  public ComfirmDeleteChangeShiftCode(): void {
    let currentChangeShiftCode = this._listChangeShiftCodeCollectionView.currentItem;
    const userRegistrationlDialogRef = this._matDialog.open(DeleteDialogBoxComponent, {
      width: '500px',
      data: {
        objDialogTitle: "Delete Change Shift",
        objComfirmationMessage: `Delete this ${currentChangeShiftCode.CSNumber}?`,
      },
      disableClose: true
    });

    userRegistrationlDialogRef.afterClosed().subscribe(result => {
      if (result.message == "Yes") {
        this.DeleteChangeShiftCode();
      }
    });
  }

  ngOnDestroy() {
    if (this._changeShiftCodeListSubscription != null) this._changeShiftCodeListSubscription.unsubscribe();
  }
}
