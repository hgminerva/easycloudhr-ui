import { Component, OnInit, ViewChild } from '@angular/core';

import * as wjcGrid from '@grapecity/wijmo.grid';
import { CollectionView, ObservableArray } from '@grapecity/wijmo';

import { ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackBarTemplate } from '../../shared/snack-bar-template';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { ChangeShiftCodeDetailService } from './../change-shift-code-detail.service';
import { ChangeShiftModel } from '../change-shift-code.model';
import { ChangeShiftLineModel } from '../change-shift-code-line.model';
import { DeleteDialogBoxComponent } from '../../shared/delete-dialog-box/delete-dialog-box.component';
import { ChangeShiftCodeLineDetailComponent } from './../change-shift-code-line-detail/change-shift-code-line-detail.component';

@Component({
  selector: 'app-change-shift-code-detail',
  templateUrl: './change-shift-code-detail.component.html',
  styleUrls: ['./change-shift-code-detail.component.css']
})
export class ChangeShiftCodeDetailComponent implements OnInit {

  constructor(
    private _changeShiftCodeDetailService: ChangeShiftCodeDetailService,
    private _activatedRoute: ActivatedRoute,
    private _snackBar: MatSnackBar,
    private _snackBarTemplate: SnackBarTemplate,
    public _matDialog: MatDialog,
  ) { }

  async ngOnInit() {
    await this.PayrollGroupListData();
  }

  public _isProgressBarHidden: boolean = false;
  public _isComponentsShown: boolean = true;

  public _btnSaveDisabled: boolean = true;
  public _btnLockisabled: boolean = true;
  public _btnUnlockDisabled: boolean = true;

  public _isDataLoaded: boolean = false;
  public _isLocked: boolean = false;

  public _payrollGroupDropdownSubscription: any;
  public _payrollGroupListDropdown: any = [];

  public _yearDropdownSubscription: any;
  public _yearListDropdown: any = [];

  public _userDropdownSubscription: any;
  public _userListDropdown: any = [];

  public _changeShiftCodeDetailSubscription: any;
  public _saveChangeShiftCodeDetailSubscription: any;
  public _lockchangeShiftCodeDetailSubscription: any;
  public _unlockchangeShiftCodeDetailSubscription: any;

  public _changeShiftModel: ChangeShiftModel = {
    Id: 0,
    CSNumber: '',
    CSDate: new Date(),
    PayrollGroup: '',
    YearId: 0,
    Year: '',
    Remarks: '',
    PreparedByUserId: 0,
    CheckedByUserId: 0,
    ApprovedByUserId: 0,
    CreatedByUserId: 0,
    CreatedByUser: '',
    CreatedDateTime: new Date(),
    UpdatedByUserId: 0,
    UpdatedByUser: '',
    UpdatedDateTime: new Date(),
    IsLocked: false
  };

  public _changeShiftLineModel: ChangeShiftLineModel = {
    Id: 0,
    CSId: 0,
    EmployeeId: 0,
    Employee: '',
    ShiftDate: new Date(),
    ShiftId: 0,
    Branch: '',
    Remarks: ''
  }

  // Class properties
  public _listChangeShiftLineObservableArray: ObservableArray = new ObservableArray();
  public _listChangeShiftLineCollectionView: CollectionView = new CollectionView(this._listChangeShiftLineObservableArray);
  public _listPageIndex: number = 15;

  @ViewChild('flexChangeShiftLine') flexChangeShiftLine: wjcGrid.FlexGrid;

  public _isChangeShiftLineProgressBarHidden = false;
  public _isChangeShiftLineDataLoaded: boolean = false;

  private _changeShiftLineListSubscription: any;
  private _saveChangeShiftLineSubscription: any;
  private _updateChangeShiftLineSubscription: any;
  private _deleteChangeShiftLineSubscription: any;

  public _btnAddChangeShiftLineDisabled: boolean = false;


  private async PayrollGroupListData() {
    this._payrollGroupDropdownSubscription = (await this._changeShiftCodeDetailService.PayrollGroupList()).subscribe(
      response => {
        this._payrollGroupListDropdown = response;
        this.YearCodeListData();
        if (this._payrollGroupDropdownSubscription !== null) this._payrollGroupDropdownSubscription.unsubscribe();
      },
      error => {
        this._snackBarTemplate.snackBarError(this._snackBar, error.error.Message + " " + error.status);
        if (this._payrollGroupDropdownSubscription !== null) this._payrollGroupDropdownSubscription.unsubscribe();
      }
    );
  }

  private async YearCodeListData() {
    this._yearDropdownSubscription = (await this._changeShiftCodeDetailService.YearList()).subscribe(
      response => {
        this._yearListDropdown = response;
        this.UserListData();
        if (this._yearDropdownSubscription !== null) this._yearDropdownSubscription.unsubscribe();
      },
      error => {
        this._snackBarTemplate.snackBarError(this._snackBar, error.error.Message + " " + error.status);
        if (this._yearDropdownSubscription !== null) this._yearDropdownSubscription.unsubscribe();
      }
    );
  }

  private async UserListData() {
    this._userDropdownSubscription = await (await this._changeShiftCodeDetailService.UserList()).subscribe(
      response => {
        this._userListDropdown = response;
        this.GetChangeShiftCodeDetail();
        if (this._userDropdownSubscription !== null) this._userDropdownSubscription.unsubscribe();
      },
      error => {
        this._snackBarTemplate.snackBarError(this._snackBar, error.error.Message + " " + error.status);
        if (this._userDropdownSubscription !== null) this._userDropdownSubscription.unsubscribe();
      }
    );
  }

  private async GetChangeShiftCodeDetail() {
    let id = 0;
    this._activatedRoute.params.subscribe(params => { id = params["id"]; });
    this._isComponentsShown = true;
    this._isProgressBarHidden = true;

    this.DisableButtons();
    this._changeShiftCodeDetailSubscription = await (await this._changeShiftCodeDetailService.ChangeShiftCodeDetail(id)).subscribe(
      (response: any) => {
        let result = response;
        if (result != null) {
          this._changeShiftModel = result;

          this._changeShiftModel.CSDate = new Date(result["CSDate"]);
          this._changeShiftLineModel.CSId = result["Id"];
        }
        this.loadComponent(result["_isLocked"]);
        this.GetChangeShiftLineListData();
        this._isDataLoaded = true;
        this._isProgressBarHidden = false;
        this._isComponentsShown = false;
        if (this._changeShiftCodeDetailSubscription !== null) this._changeShiftCodeDetailSubscription.unsubscribe();
      },
      error => {
        this._snackBarTemplate.snackBarError(this._snackBar, error.error.Message + " " + error.status);
        if (this._changeShiftCodeDetailSubscription !== null) this._changeShiftCodeDetailSubscription.unsubscribe();
      }
    );
  }

  public async SaveChangeShiftCodeDetail() {
    this.DisableButtons();
    if (this._isDataLoaded == true) {
      this._isDataLoaded = false;
      this._saveChangeShiftCodeDetailSubscription = (await this._changeShiftCodeDetailService.SaveChangeShiftCode(this._changeShiftModel.Id, this._changeShiftModel)).subscribe(
        response => {
          this.loadComponent(this._changeShiftModel.IsLocked);
          this._isDataLoaded = true;
          this._snackBarTemplate.snackBarSuccess(this._snackBar, "Save Successfully.");
          if (this._saveChangeShiftCodeDetailSubscription !== null) this._saveChangeShiftCodeDetailSubscription.unsubscribe();
        },
        error => {
          this.loadComponent(this._changeShiftModel.IsLocked);
          this._isDataLoaded = true;
          this._snackBarTemplate.snackBarError(this._snackBar, error.error.Message + " " + error.status);
          if (this._saveChangeShiftCodeDetailSubscription !== null) this._saveChangeShiftCodeDetailSubscription.unsubscribe();
        }
      );
    }
  }

  public async LockchangeShiftCodeDetail() {
    this.DisableButtons();
    if (this._isDataLoaded == true) {
      this._isDataLoaded = false;
      this._lockchangeShiftCodeDetailSubscription = await (await this._changeShiftCodeDetailService.LockChangeShiftCode(this._changeShiftModel.Id, this._changeShiftModel)).subscribe(
        response => {
          this.loadComponent(true);
          this._isDataLoaded = true;
          this._snackBarTemplate.snackBarSuccess(this._snackBar, "Lock Successfully.");
          if (this._lockchangeShiftCodeDetailSubscription !== null) this._lockchangeShiftCodeDetailSubscription.unsubscribe();
        },
        error => {
          this.loadComponent(false);
          this._isDataLoaded = true;
          this._snackBarTemplate.snackBarError(this._snackBar, error.error.Message + " " + error.status);
          if (this._lockchangeShiftCodeDetailSubscription !== null) this._lockchangeShiftCodeDetailSubscription.unsubscribe();
        }
      );
    }
  }

  public async UnlockchangeShiftCodeDetail() {
    this.DisableButtons();
    if (this._isDataLoaded == true) {
      this._isDataLoaded = false;
      this._unlockchangeShiftCodeDetailSubscription = await (await this._changeShiftCodeDetailService.UnlockChangeShiftCode(this._changeShiftModel.Id)).subscribe(
        response => {
          this.loadComponent(false);
          this._isDataLoaded = true;
          this._snackBarTemplate.snackBarSuccess(this._snackBar, "Unlock Successfully.");
          if (this._unlockchangeShiftCodeDetailSubscription !== null) this._unlockchangeShiftCodeDetailSubscription.unsubscribe();
        },
        error => {
          this.loadComponent(true);
          this._isDataLoaded = true;
          this._snackBarTemplate.snackBarError(this._snackBar, error.error.Message + " " + error.status);
          if (this._unlockchangeShiftCodeDetailSubscription !== null) this._unlockchangeShiftCodeDetailSubscription.unsubscribe();
        }
      );
    }
  }

  private loadComponent(isDisable) {
    if (isDisable == true) {
      this._btnAddChangeShiftLineDisabled = isDisable;
      this._btnSaveDisabled = isDisable;
      this._btnLockisabled = isDisable;
      this._btnUnlockDisabled = !isDisable;
    } else {
      this._btnAddChangeShiftLineDisabled = isDisable;
      this._btnSaveDisabled = isDisable;
      this._btnLockisabled = isDisable;
      this._btnUnlockDisabled = !isDisable;
    }

    this._isLocked = isDisable;
    this._isProgressBarHidden = false;
  }

  private DisableButtons() {
    this._btnSaveDisabled = true;
    this._btnLockisabled = true;
    this._btnUnlockDisabled = true;
    this._isProgressBarHidden = true;
  }

  activeTab() { }

  private async GetChangeShiftLineListData() {

    this._listChangeShiftLineObservableArray = new ObservableArray();
    this._listChangeShiftLineCollectionView = new CollectionView(this._listChangeShiftLineObservableArray);
    this._listChangeShiftLineCollectionView.pageSize = 15;
    this._listChangeShiftLineCollectionView.trackChanges = true;
    await this._listChangeShiftLineCollectionView.refresh();
    await this.flexChangeShiftLine.refresh();

    this._isChangeShiftLineProgressBarHidden = true;

    this._changeShiftLineListSubscription = await (await this._changeShiftCodeDetailService.ChangeShiftCodeLineList(this._changeShiftModel.Id)).subscribe(
      (response: any) => {
        if (response["length"] > 0) {
          this._listChangeShiftLineObservableArray = response;
          this._listChangeShiftLineCollectionView = new CollectionView(this._listChangeShiftLineObservableArray);
          this._listChangeShiftLineCollectionView.pageSize = 15;
          this._listChangeShiftLineCollectionView.trackChanges = true;
          this._listChangeShiftLineCollectionView.refresh();
          this.flexChangeShiftLine.refresh();
        }

        this._isChangeShiftLineDataLoaded = true;
        this._isChangeShiftLineProgressBarHidden = false;
        if (this._changeShiftLineListSubscription !== null) this._changeShiftLineListSubscription.unsubscribe();
      },
      error => {
        this._isChangeShiftLineProgressBarHidden = false;
        this._snackBarTemplate.snackBarError(this._snackBar, error.error.Message + " " + error.status);
        if (this._changeShiftLineListSubscription !== null) this._changeShiftLineListSubscription.unsubscribe();
      }
    );
  }

  public AddChangeShiftLine() {
    this.DetailChangeShiftLine(this._changeShiftLineModel, "Add Shift Line");
  }

  public EditChangeShiftLine() {
    let currentChangeShiftLine = this._listChangeShiftLineCollectionView.currentItem;
    this.DetailChangeShiftLine(currentChangeShiftLine, "Edit Shift Line Detail");
  }

  public async DeleteChangeShiftLine() {
    let currentChangeShiftLine = this._listChangeShiftLineCollectionView.currentItem;
    this._isChangeShiftLineProgressBarHidden = true;

    if (this._isChangeShiftLineDataLoaded == true) {
      this._isChangeShiftLineDataLoaded = false;
      this._deleteChangeShiftLineSubscription = await (await this._changeShiftCodeDetailService.DeleteChangeShiftCodeLine(currentChangeShiftLine.Id)).subscribe(
        response => {
          this._snackBarTemplate.snackBarSuccess(this._snackBar, "Delete Successfully");
          this.GetChangeShiftLineListData();
          this._isChangeShiftLineProgressBarHidden = false;
          this._isChangeShiftLineDataLoaded = true;
        },
        error => {
          this._isChangeShiftLineDataLoaded = true;
          this._isChangeShiftLineProgressBarHidden = false;
          this._snackBarTemplate.snackBarError(this._snackBar, error.error + " " + error.status);
          if (this._deleteChangeShiftLineSubscription != null) this._deleteChangeShiftLineSubscription.unsubscribe();
        }
      );
    }
  }

  public ComfirmDeleteChangeShiftLine(): void {
    let currentChangeShiftLine = this._listChangeShiftLineCollectionView.currentItem;
    const matDialogRef = this._matDialog.open(DeleteDialogBoxComponent, {
      width: '500px',
      data: {
        objDialogTitle: "",
        objComfirmationMessage: ` Delete ${currentChangeShiftLine.Employee}?`,
      },
      disableClose: true
    });

    matDialogRef.afterClosed().subscribe(result => {
      if (result.message == "Yes") {
        this.DeleteChangeShiftLine();
      }
    });
  }


  public DetailChangeShiftLine(objChangeShiftLine: ChangeShiftLineModel, eventTitle: string) {
    const matDialogRef = this._matDialog.open(ChangeShiftCodeLineDetailComponent, {
      width: '1300px',
      data: {
        objDialogTitle: eventTitle,
        objChangeShiftLine: objChangeShiftLine,
      },
      disableClose: true
    });

    matDialogRef.afterClosed().subscribe((result: any) => {
      if (result.event === "Add Shift Line") {
        this._isChangeShiftLineDataLoaded = true;

        this.AddSaveChangeShiftLine(result.data);
      }
      if (result.event === "Edit Shift Line Detail") {
        this._isChangeShiftLineDataLoaded = true;

        this.UpdateChangeShiftLine(result.data.Id, result.data);
      }
    });
  }

  ngOnDestroy() {
  }

  public async AddSaveChangeShiftLine(objChangeShiftLine: ChangeShiftLineModel) {
    this._isChangeShiftLineProgressBarHidden = true;

    if (this._isChangeShiftLineDataLoaded == true) {
      this._isChangeShiftLineDataLoaded = false;
      this._saveChangeShiftLineSubscription = await (await this._changeShiftCodeDetailService.AddChangeShiftCodeLine(objChangeShiftLine)).subscribe(
        response => {
          this._isChangeShiftLineDataLoaded = true;
          this._isChangeShiftLineProgressBarHidden = false;

          this._snackBarTemplate.snackBarSuccess(this._snackBar, "Save Successfully");
          this.GetChangeShiftLineListData();
          if (this._saveChangeShiftLineSubscription != null) this._saveChangeShiftLineSubscription.unsubscribe();
        },
        error => {
          this._isChangeShiftLineDataLoaded = true;
          this._snackBarTemplate.snackBarError(this._snackBar, error.error + " " + " Status Code: " + error.status);
          if (this._saveChangeShiftLineSubscription != null) this._saveChangeShiftLineSubscription.unsubscribe();
        }
      );
    }
  }

  public async UpdateChangeShiftLine(id: number, objChangeShiftLine: ChangeShiftLineModel) {
    this._isChangeShiftLineProgressBarHidden = true;

    if (this._isChangeShiftLineDataLoaded == true) {
      this._isChangeShiftLineDataLoaded = false;
      this._updateChangeShiftLineSubscription = await (await this._changeShiftCodeDetailService.UpdateTRLine(id, objChangeShiftLine)).subscribe(
        response => {
          this._isChangeShiftLineDataLoaded = true;
          this._isChangeShiftLineProgressBarHidden = false;

          this._snackBarTemplate.snackBarSuccess(this._snackBar, "Update Successfully");
          this.GetChangeShiftLineListData();
          if (this._updateChangeShiftLineSubscription != null) this._updateChangeShiftLineSubscription.unsubscribe();
        },
        error => {
          this._isChangeShiftLineDataLoaded = true;
          this._snackBarTemplate.snackBarError(this._snackBar, error.error + " " + " Status Code: " + error.status);
          if (this._updateChangeShiftLineSubscription != null) this._updateChangeShiftLineSubscription.unsubscribe();
        }
      );
    }
  }

}
