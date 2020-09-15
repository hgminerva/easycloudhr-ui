import { Component, OnInit, Inject, ViewChild } from '@angular/core';

import * as wjcGrid from '@grapecity/wijmo.grid';
import { CollectionView, ObservableArray } from '@grapecity/wijmo';

import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackBarTemplate } from '../../shared/snack-bar-template';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';

import { YearModel } from './../year.model';
import { YearDateModel } from './../year-date.model';
import { YearDetialService } from './../year-detial.service';
import { DeleteDialogBoxComponent } from '../../shared/delete-dialog-box/delete-dialog-box.component';
import { YearDateDialogComponent } from '../year-date-dialog/year-date-dialog.component';
import { DatePipe } from '@angular/common';
import { YearDateAddToBranchesDialogComponent } from '../year-date-add-to-branches-dialog/year-date-add-to-branches-dialog.component';

@Component({
  selector: 'app-year-detial',
  templateUrl: './year-detial.component.html',
  styleUrls: ['./year-detial.component.css']
})
export class YearDetialComponent implements OnInit {

  constructor(private _yearDetialService: YearDetialService,
    private _activatedRoute: ActivatedRoute,
    private _snackBar: MatSnackBar,
    private _snackBarTemplate: SnackBarTemplate,
    public YearDateDetailDialog: MatDialog,
    public deleteYearDateDetailDialog: MatDialog,
    private datePipe: DatePipe
  ) { }

  public title = '';
  public event = 'Close';

  ngOnInit(): void {
    this.GetYearDetail();
  }

  public isDataLoaded: boolean = false;
  public isProgressBarHidden: boolean = false;

  private _yearDetailSubscription: any;
  private _saveYearDetailSubscription: any;
  private _lockYearDetailSubscription: any;
  private _unlockYearDetailSubscription: any;

  public _btnSaveDisabled: boolean = true;
  public _btnLockIsabled: boolean = true;
  public _btnUnlockDisabled: boolean = true;

  public _isLocked: boolean = false;
  public _isComponentsShown: boolean = false;

  public _listYearDateObservableArray: ObservableArray = new ObservableArray();
  public _listYearDateCollectionView: CollectionView = new CollectionView(this._listYearDateObservableArray);
  public _listPageIndex: number = 15;

  public _isYearDateProgressBarHidden = false;
  public _isDataLoaded: boolean = false;

  private _yearDateListSubscription: any;
  private _addYearDateSubscription: any;
  private _deleteYearDateSubscription: any;

  public _btnAddYearDateDisabled: boolean = false;

  // DOM declaration
  @ViewChild('flexYearDate') flexYearDate: wjcGrid.FlexGrid;

  public _yearModel: YearModel = {
    Id: 0,
    YearCode: '',
    Year: '',
    DateStart: '',
    DateEnd: '',
    IsClose: false,
    CreatedByUserId: 0,
    CreatedByUser: '',
    CreatedDateTime: new Date(),
    UpdatedByUserId: 0,
    UpdatedByUser: '',
    UpdatedDateTime: new Date(),
    IsLocked: false
  }

  public UIDateStart = new Date();
  public UIDateEnd = new Date();

  public _yearDateModel: YearDateModel = {
    Id: 0,
    YearId: 0,
    YearDate: '',
    Branch: '',
    DateType: this.datePipe.transform(new Date(), 'yyyy-MM-dd'),
    Remarks: 'NA',
  }

  private async GetYearDetail() {
    let id = 0;
    this._activatedRoute.params.subscribe(params => { id = params["id"]; });
    this.disableButtons();
    this._isComponentsShown = false;
    this._yearDetailSubscription = (await this._yearDetialService.YearDetail(id)).subscribe(
      (response: any) => {
        let result = response;
        if (result != null) {
          this._yearModel = result;
          this._yearDateModel.YearId = result["Id"];
          this._yearModel.IsLocked = result["IsLocked"];
          this.UIDateStart = new Date(result["DateStart"]);
          this.UIDateEnd = new Date(result["DateEnd"]);
        }

        this.GetYearDateListData();

        this.loadComponent(result["IsLocked"]);
        this.isDataLoaded = true;
        this._isComponentsShown = true;
        if (this._yearDetailSubscription !== null) this._yearDetailSubscription.unsubscribe();
      },
      error => {
        this._snackBarTemplate.snackBarError(this._snackBar, error.error + " " + " Status Code: " + error.status);
        if (this._yearDetailSubscription !== null) this._yearDetailSubscription.unsubscribe();
      }
    );
  }

  public GetUIDATEDateStart() {
    this._yearModel.DateStart = this.datePipe.transform(this.UIDateStart, 'yyyy-MM-dd');
    console.log(this._yearModel.DateStart);
  }

  public GetUIDATEDateEnd() {
    this._yearModel.DateEnd = this.datePipe.transform(this.UIDateEnd, 'yyyy-MM-dd');
    console.log(this._yearModel.DateEnd);
  }

  public async SaveYearDetail() {
    this.disableButtons();
    if (this.isDataLoaded == true) {
      this.isDataLoaded = false;
      this._saveYearDetailSubscription = await (await this._yearDetialService.SaveYear(this._yearModel.Id, this._yearModel)).subscribe(
        response => {
          this.event = "Save";
          this.isDataLoaded = true;
          this.loadComponent(this._yearModel.IsLocked);
          this._snackBarTemplate.snackBarSuccess(this._snackBar, "Save Successfully.");
          if (this._saveYearDetailSubscription !== null) this._saveYearDetailSubscription.unsubscribe();
        },
        error => {
          this.loadComponent(this._yearModel.IsLocked);
          this._btnUnlockDisabled = true;
          this._snackBarTemplate.snackBarError(this._snackBar, error.error + " " + " Status Code: " + error.status);
          if (this._saveYearDetailSubscription !== null) this._saveYearDetailSubscription.unsubscribe();
        }
      );
    }
  }

  public async LockYearDetail() {
    this.disableButtons();

    if (this.isDataLoaded == true) {
      this.isDataLoaded = false;
      this._lockYearDetailSubscription = await (await this._yearDetialService.LockYear(this._yearModel.Id, this._yearModel)).subscribe(
        response => {
          this.event = "Lock";
          this.loadComponent(true);
          this.isDataLoaded = true;
          this._snackBarTemplate.snackBarSuccess(this._snackBar, "Lock Successfully.");
          if (this._lockYearDetailSubscription !== null) this._lockYearDetailSubscription.unsubscribe();
        },
        error => {
          this.isDataLoaded = true;
          this.loadComponent(false);
          this._snackBarTemplate.snackBarError(this._snackBar, error.error + " " + " Status Code: " + error.status);
          if (this._lockYearDetailSubscription !== null) this._lockYearDetailSubscription.unsubscribe();
        }
      );
    }
  }

  public async UnlockYearDetail() {
    this.disableButtons();

    if (this.isDataLoaded == true) {
      this.isDataLoaded = false;
      this._unlockYearDetailSubscription = await (await this._yearDetialService.UnlockYear(this._yearModel.Id)).subscribe(
        response => {
          this.event = "Unlock";
          this.loadComponent(false);
          this.isDataLoaded = true;
          this._snackBarTemplate.snackBarSuccess(this._snackBar, "Unlock Successfully.");
          if (this._unlockYearDetailSubscription !== null) this._unlockYearDetailSubscription.unsubscribe();
        },
        error => {
          this.loadComponent(true);
          this.isDataLoaded = true;
          this._snackBarTemplate.snackBarError(this._snackBar, error.error + " " + " Status Code: " + error.status);
          if (this._unlockYearDetailSubscription !== null) this._unlockYearDetailSubscription.unsubscribe();
        }
      );
    }
  }

  ngOnDestroy() {
  }

  // ==================
  // Component Behavior
  // ==================
  private loadComponent(isDisable) {
    if (isDisable == true) {
      this._btnAddYearDateDisabled = isDisable;
      this._btnSaveDisabled = isDisable;
      this._btnLockIsabled = isDisable;
      this._btnUnlockDisabled = !isDisable;
    } else {
      this._btnAddYearDateDisabled = isDisable;
      this._btnSaveDisabled = isDisable;
      this._btnLockIsabled = isDisable;
      this._btnUnlockDisabled = !isDisable;
    }

    this._isLocked = isDisable;
    this.isProgressBarHidden = false;
  }

  private disableButtons() {
    this._btnSaveDisabled = true;
    this._btnLockIsabled = true;
    this._btnUnlockDisabled = true;
    this.isProgressBarHidden = true;
  }

  // public Close(): void {
  //   this._YearDateDetailDialogRef.close({ event: this.event });
  // }

  // Class properties

  private async GetYearDateListData() {
    this._listYearDateObservableArray = new ObservableArray();
    this._listYearDateCollectionView = new CollectionView(this._listYearDateObservableArray);
    this._listYearDateCollectionView.pageSize = 15;
    this._listYearDateCollectionView.trackChanges = true;
    await this._listYearDateCollectionView.refresh();
    await this.flexYearDate.refresh();

    this._isYearDateProgressBarHidden = true;

    this._yearDateListSubscription = (await this._yearDetialService.YearDateList(this._yearModel.Id)).subscribe(
      (response: any) => {
        var results = response;
        if (results["length"] > 0) {
          this._listYearDateObservableArray = results;
          this._listYearDateCollectionView = new CollectionView(this._listYearDateObservableArray);
          this._listYearDateCollectionView.pageSize = 15;
          this._listYearDateCollectionView.trackChanges = true;
          this._listYearDateCollectionView.refresh();
          this.flexYearDate.refresh();
        }

        this._isDataLoaded = true;
        this._isYearDateProgressBarHidden = false;

        if (this._yearDateListSubscription != null) this._yearDateListSubscription.unsubscribe();
      },
      error => {
        this._snackBarTemplate.snackBarError(this._snackBar, error.error.Message + " " + error.status);
        if (this._yearDateListSubscription !== null) this._yearDateListSubscription.unsubscribe();
      }
    );
  }

  public async AddYearDate(objYearDate: YearDateModel) {
    this._btnAddYearDateDisabled = true;
    if (this._isDataLoaded == true) {
      this._isDataLoaded = false;
      this._addYearDateSubscription = (await this._yearDetialService.AddYearDate(objYearDate)).subscribe(
        (response: any) => {
          this._btnAddYearDateDisabled = false;
          this._isDataLoaded = true;
          this.GetYearDateListData();
          this._snackBarTemplate.snackBarSuccess(this._snackBar, "Added Successfully");
        },
        error => {
          this._btnAddYearDateDisabled = false;
          this._isDataLoaded = true;
          this._snackBarTemplate.snackBarError(this._snackBar, error.error + " " + " Status Code: " + error.status);
          if (this._addYearDateSubscription != null) this._addYearDateSubscription.unsubscribe();
        }
      );
    }
  }

  public async UpdateYearDate(objYearDate: YearDateModel) {
    this._btnAddYearDateDisabled = true;
    if (this._isDataLoaded == true) {
      this._isDataLoaded = false;
      this._addYearDateSubscription = (await this._yearDetialService.Updatedate(objYearDate.Id, objYearDate)).subscribe(
        (response: any) => {
          this._btnAddYearDateDisabled = false;
          this._isDataLoaded = true;
          this.GetYearDateListData();
          this._snackBarTemplate.snackBarSuccess(this._snackBar, "Updated Successfully");
        },
        error => {
          this._btnAddYearDateDisabled = false;
          this._isDataLoaded = true;
          this._snackBarTemplate.snackBarError(this._snackBar, error.error + " " + " Status Code: " + error.status);
          if (this._addYearDateSubscription != null) this._addYearDateSubscription.unsubscribe();
        }
      );
    }
  }

  AddYearDateDialog() {
    this.DetailYearDate(this._yearDateModel, "Add YearDate Detail");
  }

  public EditYearDate() {
    let currentYearDate = this._listYearDateCollectionView.currentItem;
    this.DetailYearDate(currentYearDate, "Edit YearDate Detail");
  }

  public async DeleteYearDate() {
    let currentYearDate = this._listYearDateCollectionView.currentItem;
    this._isYearDateProgressBarHidden = true;

    if (this._isDataLoaded == true) {
      this._isDataLoaded = false;
      this._deleteYearDateSubscription = (await this._yearDetialService.DeleteYearDate(currentYearDate.Id)).subscribe(
        response => {
          this._snackBarTemplate.snackBarSuccess(this._snackBar, "Delete Successfully");
          this.GetYearDateListData();
          this._isYearDateProgressBarHidden = false;
          this._isDataLoaded = true;
        },
        error => {
          this._isDataLoaded = true;
          this._isYearDateProgressBarHidden = false;
          this._snackBarTemplate.snackBarError(this._snackBar, error.error + " Status " + error.status);
          if (this._deleteYearDateSubscription != null) this._deleteYearDateSubscription.unsubscribe();
        }
      );
    }
  }

  public ComfirmDeleteYearDate(): void {
    let currentYearDate = this._listYearDateCollectionView.currentItem;
    const userRegistrationlDialogRef = this.deleteYearDateDetailDialog.open(DeleteDialogBoxComponent, {
      width: '500px',
      data: {
        objDialogTitle: "Delete Year Date",
        objComfirmationMessage: ` Delete ${currentYearDate.YearDate}?`,
      },
      disableClose: true
    });

    userRegistrationlDialogRef.afterClosed().subscribe(result => {
      if (result.message == "Yes") {
        this.DeleteYearDate();
      }
    });
  }

  public DetailYearDate(objYearDate: YearDateModel, eventTitle: string): void {
    const userRegistrationlDialogRef = this.YearDateDetailDialog.open(YearDateDialogComponent, {
      width: '900px',
      data: {
        objDialogTitle: eventTitle,
        objYearDate: objYearDate,
      },
      disableClose: true
    });

    userRegistrationlDialogRef.afterClosed().subscribe(result => {
      if (result.event === "Add") {
        this.AddYearDate(result.data);
      }
      if (result.event === "Update") {
        this.UpdateYearDate(result.data);
      }
    });
  }

  public AddYearDateToBranches(): void {
    const userRegistrationlDialogRef = this.YearDateDetailDialog.open(YearDateAddToBranchesDialogComponent, {
      width: '700px',
      data: {
        objDialogTitle: "Add Year Date to Branches",
        objYearDate: this._yearDateModel,
      },

      disableClose: true
    });

    userRegistrationlDialogRef.afterClosed().subscribe(result => {
      if (result.event !== "Close") {
        this.GetYearDateListData();
      }
    });
  }

  activeTab() { }

}
