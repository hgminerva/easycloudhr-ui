import { Component, OnInit, Inject, ViewChild } from '@angular/core';

import * as wjcGrid from '@grapecity/wijmo.grid';
import { CollectionView, ObservableArray } from '@grapecity/wijmo';

import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackBarTemplate } from '../../shared/snack-bar-template';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';

import { ShiftModel } from './../shift-code-model';
import { ShiftCodeDetailService } from './../shift-code-detail.service';
import { ActivatedRoute } from '@angular/router';
import { ShiftLineModel } from '../shift-code-line.model';
import { DeleteDialogBoxComponent } from '../../shared/delete-dialog-box/delete-dialog-box.component';
import { ShiftCodeDetialShiftLineComponent } from './../shift-code-detial-shift-line/shift-code-detial-shift-line.component';

@Component({
  selector: 'app-shift-code-detail',
  templateUrl: './shift-code-detail.component.html',
  styleUrls: ['./shift-code-detail.component.css']
})
export class ShiftCodeDetailComponent implements OnInit {

  constructor(private shiftCodeDetailService: ShiftCodeDetailService,
    private activatedRoute: ActivatedRoute,
    private snackBar: MatSnackBar,
    private snackBarTemplate: SnackBarTemplate,
    public shiftLineDetailDialog: MatDialog,
    public deleteShiftLineDetailDialog: MatDialog,

    // public _ShiftLineDetailDialogRef: MatDialogRef<ShiftCodeDetailComponent>,
    // @Inject(MAT_DIALOG_DATA) public caseData: any
  ) { }

  public title = '';
  public event = 'Close';

  ngOnInit(): void {
    this.GetShiftDetail();
    // this.title = this.caseData.objDialogTitle;
    // this.GetShiftDetail(this.caseData.objShiftCodeId);
  }

  public shiftModel: ShiftModel = {
    Id: 0,
    ShiftCode: "",
    Shift: "",
    Particulars: "",
    CreatedByUserId: 0,
    CreatedByUser: "",
    CreatedDateTime: new Date(),
    UpdatedByUserId: 0,
    UpdatedByUser: "",
    UpdatedDateTime: new Date(),
    IsLocked: false
  }

  public isDataLoaded: boolean = false;
  public isProgressBarHidden: boolean = false;

  private shiftDetailSubscription: any;
  private saveShiftDetailSubscription: any;
  private lockShiftDetailSubscription: any;
  private unlockShiftDetailSubscription: any;

  public btnSaveDisabled: boolean = true;
  public btnLockisabled: boolean = true;
  public btnUnlockDisabled: boolean = true;

  public isLocked: boolean = false;
  public isComponentsShown: boolean = false;

  public _listShiftLineObservableArray: ObservableArray = new ObservableArray();
  public _listShiftLineCollectionView: CollectionView = new CollectionView(this._listShiftLineObservableArray);
  public _listPageIndex: number = 15;

  public _isShiftLineProgressBarHidden = false;
  public _isDataLoaded: boolean = false;

  private _shiftLineListSubscription: any;
  private _addShiftLineSubscription: any;
  private _deleteShiftLineSubscription: any;

  public _btnAddShiftLineDisabled: boolean = false;

  // DOM declaration
  @ViewChild('flexShiftLine') flexShiftLine: wjcGrid.FlexGrid;

  public ShiftLineModel: ShiftLineModel = {
    Id: 0,
    ShiftId: 0,
    ShiftDate: '',
    TimeIn1: '',
    TimeOut1: '',
    TimeIn2: '',
    TimeOut2: '',
    IsRestDay: false,
    TotalNumberOfHours: '0',
    NightDifferentialHours: '0',
    IsFlexible: false,
    FixibilityHoursLimit: '0',
    Remarks: '',
  }

  private async GetShiftDetail() {
    let id = 0;
    this.activatedRoute.params.subscribe(params => { id = params["id"]; });
    this.disableButtons();
    this.isComponentsShown = false;
    this.shiftDetailSubscription = (await this.shiftCodeDetailService.ShiftDetail(id)).subscribe(
      (response: any) => {
        let result = response;
        console.log(result);
        if (result != null) {
          this.shiftModel = result;
          this.ShiftLineModel.ShiftId = result["Id"];
          this.shiftModel.IsLocked = result["IsLocked"];
          console.log(result["IsLocked"]);
        }
        this.GetShiftLineListData();

        this.loadComponent(result["IsLocked"]);
        this.isDataLoaded = true;
        this.isComponentsShown = true;
        if (this.shiftDetailSubscription !== null) this.shiftDetailSubscription.unsubscribe();
      },
      error => {
        this.snackBarTemplate.snackBarError(this.snackBar, error.error + " " + " Status Code: " + error.status);
        if (this.shiftDetailSubscription !== null) this.shiftDetailSubscription.unsubscribe();
      }
    );
  }

  public async SaveShiftDetail() {
    this.disableButtons();
    if (this.isDataLoaded == true) {
      this.isDataLoaded = false;
      this.saveShiftDetailSubscription = await (await this.shiftCodeDetailService.SaveShift(this.shiftModel.Id, this.shiftModel)).subscribe(
        response => {
          this.event = "Save";
          this.isDataLoaded = true;
          this.loadComponent(this.shiftModel.IsLocked);
          this.snackBarTemplate.snackBarSuccess(this.snackBar, "Save Successfully.");
          if (this.saveShiftDetailSubscription !== null) this.saveShiftDetailSubscription.unsubscribe();
        },
        error => {
          this.loadComponent(this.shiftModel.IsLocked);
          this.btnUnlockDisabled = true;
          this.snackBarTemplate.snackBarError(this.snackBar, error.error + " " + " Status Code: " + error.status);
          if (this.saveShiftDetailSubscription !== null) this.saveShiftDetailSubscription.unsubscribe();
        }
      );
    }
  }

  public async LockShiftDetail() {
    this.disableButtons();

    if (this.isDataLoaded == true) {
      this.isDataLoaded = false;
      this.lockShiftDetailSubscription = await (await this.shiftCodeDetailService.LockShift(this.shiftModel.Id, this.shiftModel)).subscribe(
        response => {
          this.event = "Lock";
          this.loadComponent(true);
          this.isDataLoaded = true;
          this.snackBarTemplate.snackBarSuccess(this.snackBar, "Lock Successfully.");
          if (this.lockShiftDetailSubscription !== null) this.lockShiftDetailSubscription.unsubscribe();
        },
        error => {
          this.isDataLoaded = true;
          this.loadComponent(false);
          this.snackBarTemplate.snackBarError(this.snackBar, error.error + " " + " Status Code: " + error.status);
          if (this.lockShiftDetailSubscription !== null) this.lockShiftDetailSubscription.unsubscribe();
        }
      );
    }
  }

  public async UnlockShiftDetail() {
    this.disableButtons();

    if (this.isDataLoaded == true) {
      this.isDataLoaded = false;
      this.unlockShiftDetailSubscription = await (await this.shiftCodeDetailService.UnlockShift(this.shiftModel.Id)).subscribe(
        response => {
          this.event = "Unlock";
          this.loadComponent(false);
          this.isDataLoaded = true;
          this.snackBarTemplate.snackBarSuccess(this.snackBar, "Unlock Successfully.");
          if (this.unlockShiftDetailSubscription !== null) this.unlockShiftDetailSubscription.unsubscribe();
        },
        error => {
          this.loadComponent(true);
          this.isDataLoaded = true;
          this.snackBarTemplate.snackBarError(this.snackBar, error.error + " " + " Status Code: " + error.status);
          if (this.unlockShiftDetailSubscription !== null) this.unlockShiftDetailSubscription.unsubscribe();
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
      this._btnAddShiftLineDisabled = isDisable;
      this.btnSaveDisabled = isDisable;
      this.btnLockisabled = isDisable;
      this.btnUnlockDisabled = !isDisable;
    } else {
      this._btnAddShiftLineDisabled = isDisable;
      this.btnSaveDisabled = isDisable;
      this.btnLockisabled = isDisable;
      this.btnUnlockDisabled = !isDisable;
    }

    this.isLocked = isDisable;
    this.isProgressBarHidden = false;
  }

  private disableButtons() {
    this.btnSaveDisabled = true;
    this.btnLockisabled = true;
    this.btnUnlockDisabled = true;
    this.isProgressBarHidden = true;
  }

  // public Close(): void {
  //   this._ShiftLineDetailDialogRef.close({ event: this.event });
  // }

  // Class properties

  private async GetShiftLineListData() {
    this._listShiftLineObservableArray = new ObservableArray();
    this._listShiftLineCollectionView = new CollectionView(this._listShiftLineObservableArray);
    this._listShiftLineCollectionView.pageSize = 15;
    this._listShiftLineCollectionView.trackChanges = true;
    await this._listShiftLineCollectionView.refresh();
    await this.flexShiftLine.refresh();

    this._isShiftLineProgressBarHidden = true;

    this._shiftLineListSubscription = (await this.shiftCodeDetailService.ShiftLineList(this.shiftModel.Id)).subscribe(
      (response: any) => {
        var results = response;
        console.log("Response:", results);

        if (results["length"] > 0) {
          this._listShiftLineObservableArray = results;
          this._listShiftLineCollectionView = new CollectionView(this._listShiftLineObservableArray);
          this._listShiftLineCollectionView.pageSize = 15;
          this._listShiftLineCollectionView.trackChanges = true;
          this._listShiftLineCollectionView.refresh();
          this.flexShiftLine.refresh();
        }

        this._isDataLoaded = true;
        this._isShiftLineProgressBarHidden = false;

        if (this._shiftLineListSubscription != null) this._shiftLineListSubscription.unsubscribe();
      },
      error => {
        this.snackBarTemplate.snackBarError(this.snackBar, error.error.Message + " " + error.status);
        if (this._shiftLineListSubscription !== null) this._shiftLineListSubscription.unsubscribe();
      }
    );
  }

  public async AddShiftLine(objShiftline: ShiftLineModel) {
    this._btnAddShiftLineDisabled = true;
    if (this._isDataLoaded == true) {
      this._isDataLoaded = false;
      this._addShiftLineSubscription = (await this.shiftCodeDetailService.AddShiftLine(objShiftline)).subscribe(
        (response: any) => {
          this._btnAddShiftLineDisabled = false;
          this._isDataLoaded = true;
          this.GetShiftLineListData();
          this.snackBarTemplate.snackBarSuccess(this.snackBar, "Added Successfully");
        },
        error => {
          this._btnAddShiftLineDisabled = false;
          this._isDataLoaded = true;
          this.snackBarTemplate.snackBarError(this.snackBar, error.error + " " + " Status Code: " + error.status);
          if (this._addShiftLineSubscription != null) this._addShiftLineSubscription.unsubscribe();
        }
      );
    }
  }

  public async UpdateShiftLine(objShiftline: ShiftLineModel) {
    this._btnAddShiftLineDisabled = true;
    if (this._isDataLoaded == true) {
      this._isDataLoaded = false;
      this._addShiftLineSubscription = (await this.shiftCodeDetailService.UpdateTRLine(objShiftline.Id, objShiftline)).subscribe(
        (response: any) => {
          this._btnAddShiftLineDisabled = false;
          this._isDataLoaded = true;
          this.GetShiftLineListData();
          this.snackBarTemplate.snackBarSuccess(this.snackBar, "Updated Successfully");
        },
        error => {
          this._btnAddShiftLineDisabled = false;
          this._isDataLoaded = true;
          this.snackBarTemplate.snackBarError(this.snackBar, error.error + " " + " Status Code: " + error.status);
          if (this._addShiftLineSubscription != null) this._addShiftLineSubscription.unsubscribe();
        }
      );
    }
  }

  AddShiftLineDialog() {
    this.DetailShiftLine(this.ShiftLineModel, "Add ShiftLine Detail");
  }

  public EditShiftLine() {
    let currentShiftLine = this._listShiftLineCollectionView.currentItem;
    this.DetailShiftLine(currentShiftLine, "Edit ShiftLine Detail");
  }

  public async DeleteShiftLine() {
    let currentShiftLine = this._listShiftLineCollectionView.currentItem;
    this._isShiftLineProgressBarHidden = true;

    if (this._isDataLoaded == true) {
      this._isDataLoaded = false;
      this._deleteShiftLineSubscription = (await this.shiftCodeDetailService.DeleteShiftLine(currentShiftLine.Id)).subscribe(
        response => {
          this.snackBarTemplate.snackBarSuccess(this.snackBar, "Delete Successfully");
          this.GetShiftLineListData();
          this._isShiftLineProgressBarHidden = false;
          this._isDataLoaded = true;
        },
        error => {
          this._isDataLoaded = true;
          this._isShiftLineProgressBarHidden = false;
          this.snackBarTemplate.snackBarError(this.snackBar, error.error + " " + error.status);
          if (this._deleteShiftLineSubscription != null) this._deleteShiftLineSubscription.unsubscribe();
        }
      );
    }
  }

  public ComfirmDeleteShiftLine(): void {
    let currentShiftLine = this._listShiftLineCollectionView.currentItem;
    const userRegistrationlDialogRef = this.deleteShiftLineDetailDialog.open(DeleteDialogBoxComponent, {
      width: '500px',
      data: {
        objDialogTitle: "Delete ShiftLine",
        objComfirmationMessage: ` Delete this ${currentShiftLine.ShiftLine}?`,
      },
      disableClose: true
    });

    userRegistrationlDialogRef.afterClosed().subscribe(result => {
      if (result.message == "Yes") {
        this.DeleteShiftLine();
      }
    });
  }

  public DetailShiftLine(objShiftLine: ShiftLineModel, eventTitle: string): void {
    const userRegistrationlDialogRef = this.shiftLineDetailDialog.open(ShiftCodeDetialShiftLineComponent, {
      width: '900px',
      data: {
        objDialogTitle: eventTitle,
        objShiftLine: objShiftLine,
      },
      disableClose: true
    });

    userRegistrationlDialogRef.afterClosed().subscribe(result => {
      if (result.event === "Add") {
        console.log(result);
        this.AddShiftLine(result.data);
      }
      if (result.event === "Update") {
        console.log(result);
        this.UpdateShiftLine(result.data);
      }
    });
  }

  activeTab() { }
}
