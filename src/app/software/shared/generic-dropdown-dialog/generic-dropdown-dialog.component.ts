import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SnackBarTemplate } from 'src/app/software/shared/snack-bar-template';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CollectionView, ObservableArray } from '@grapecity/wijmo';
import * as wjcGrid from '@grapecity/wijmo.grid';

import { SharedService } from './../shared.service'

@Component({
  selector: 'app-generic-dropdown-dialog',
  templateUrl: './generic-dropdown-dialog.component.html',
  styleUrls: ['./generic-dropdown-dialog.component.css']
})
export class GenericDropdownDialogComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<GenericDropdownDialogComponent>,
    private _sharedService: SharedService,
    private _snackBar: MatSnackBar,
    private _snackBarTemplate: SnackBarTemplate,
    @Inject(MAT_DIALOG_DATA) public caseData: any
  ) { }

  title = "DropdownList List";

  ngOnInit(): void {
    this.title = this.caseData.objDialogTitle;
    this.GetDropdownListData( this.caseData.objDialogTitle,{});
    this.CreateCboShowNumberOfRows();
  }


  public _dropdownListObservableArray: ObservableArray = new ObservableArray();
  public _dropdownListCollectionView: CollectionView = new CollectionView(this._dropdownListObservableArray);
  public _listPageIndex: number = 30;

  @ViewChild('flexDropdownList') flexDropdownList: wjcGrid.FlexGrid;

  public _isDropdownListProgressBarHidden: boolean = false;

  public _dropdownLisSubscription: any;

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
    this._dropdownListCollectionView.pageSize = this._listPageIndex;
    this._dropdownListCollectionView.refresh();
    this._dropdownListCollectionView.refresh();
  }

  private async GetDropdownListData(type: string, filter: any) {
    this._dropdownListObservableArray = new ObservableArray();
    this._dropdownListCollectionView = new CollectionView(this._dropdownListObservableArray);
    this._dropdownListCollectionView.pageSize = 10;
    this._dropdownListCollectionView.trackChanges = true;
    await this._dropdownListCollectionView.refresh();
    await this.flexDropdownList.refresh();

    this._isDropdownListProgressBarHidden = true;

    this._dropdownLisSubscription = await (await this._sharedService.DropdownList(type, filter)).subscribe(
      (response: any) => {
        if (response["length"] > 0) {
          this._dropdownListObservableArray = response;
          this._dropdownListCollectionView = new CollectionView(this._dropdownListObservableArray);
          this._dropdownListCollectionView.pageSize = 10;
          this._dropdownListCollectionView.trackChanges = true;
          this._dropdownListCollectionView.refresh();
          this.flexDropdownList.refresh();
        }

        this._isDropdownListProgressBarHidden = false;
        if (this._dropdownLisSubscription !== null) this._dropdownLisSubscription.unsubscribe();
      },
      error => {
        this._isDropdownListProgressBarHidden = false;
        this._snackBarTemplate.snackBarError(this._snackBar, error.error.Message + " " + error.status);
        if (this._dropdownLisSubscription !== null) this._dropdownLisSubscription.unsubscribe();
      }
    );
  }

  Pick() {
    let objValue = this._dropdownListCollectionView.currentItem;
    this.dialogRef.close({ event: 'Pick', Value: objValue });
  }

  public Close(): void {
    this.dialogRef.close({ event: 'Close' });
  }



}
