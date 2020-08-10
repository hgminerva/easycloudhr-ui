import { Component, OnInit, ViewChild } from '@angular/core';

import * as wjcGrid from '@grapecity/wijmo.grid';
import { CollectionView, ObservableArray } from '@grapecity/wijmo';

import { ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackBarTemplate } from '../../shared/snack-bar-template';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { DeleteDialogBoxComponent } from '../../shared/delete-dialog-box/delete-dialog-box.component';
import { OvertimeApplicationDetailService } from './../overtime-application-detail.service';
import { OvertimeApplicationModel } from '../overtime-application.model';
import { OvertimeApplicationLineModel } from '../overtime-application-line.model';
import { OvertimeApplicationLineDialogComponent } from '../overtime-application-line-dialog/overtime-application-line-dialog.component';
@Component({
  selector: 'app-overtime-application-detail',
  templateUrl: './overtime-application-detail.component.html',
  styleUrls: ['./overtime-application-detail.component.css']
})
export class OvertimeApplicationDetailComponent implements OnInit {

  constructor(
    private _overtimeApplicationDetailService: OvertimeApplicationDetailService,
    private _activatedRoute: ActivatedRoute,
    private _snackBar: MatSnackBar,
    private _snackBarTemplate: SnackBarTemplate,
    public _matDialog: MatDialog,
  ) { }

  async ngOnInit() {
    await this.PayrollGroupListData();
  }

  public _isProgressBarHidden: boolean = false;
  public _isComponentsHidden: boolean = true;

  public _btnSaveDisabled: boolean = true;
  public _btnLockDisabled: boolean = true;
  public _btnUnlockDisabled: boolean = true;

  public _isDataLoaded: boolean = false;
  public _isLocked: boolean = false;

  public _payrollGroupDropdownSubscription: any;
  public _payrollGroupListDropdown: any = [];

  public _yearDropdownSubscription: any;
  public _yearListDropdown: any = [];

  public _userDropdownSubscription: any;
  public _userListDropdown: any = [];

  public _overtimeApplicationDetailSubscription: any;
  public _saveOvertimeApplicationDetailSubscription: any;
  public _lockOvertimeApplicationDetailSubscription: any;
  public _unlockOvertimeApplicationDetailSubscription: any;

  public _overtimeApplicationModel: OvertimeApplicationModel = {
    Id: 0,
    OTNumber: '',
    OTDate: new Date(),
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

  public _overtimeApplicationLineModel: OvertimeApplicationLineModel = {
    Id: 0,
    OTId: 0,
    EmployeeId: 0,
    Employee: '',
    OTDate: new Date(),
    OTHours: '',
    Remarks: ''
  }

  // Class properties
  public _listOvertimeApplicationLineObservableArray: ObservableArray = new ObservableArray();
  public _listOvertimeApplicationLineCollectionView: CollectionView = new CollectionView(this._listOvertimeApplicationLineObservableArray);
  public _listPageIndex: number = 15;

  public _isOvertimeApplicationLineProgressBarHidden = false;
  public _isOvertimeApplicationLineDataLoaded: boolean = false;

  private _overtimeApplicationLineSubscription: any;
  private _saveOvertimeApplicationLineSubscription: any;
  private _updateOvertimeApplicationLineSubscription: any;
  private _deleteOvertimeApplicationLineSubscription: any;

  public _btnAddOvertimeApplicationLineDisabled: boolean = false;

  @ViewChild('flexOvertimeApplicationLine') flexOvertimeApplicationLine: wjcGrid.FlexGrid;

  private async PayrollGroupListData() {
    this._payrollGroupDropdownSubscription = (await this._overtimeApplicationDetailService.PayrollGroupList()).subscribe(
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
    this._yearDropdownSubscription = (await this._overtimeApplicationDetailService.YearList()).subscribe(
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
    this._userDropdownSubscription = await (await this._overtimeApplicationDetailService.UserList()).subscribe(
      response => {
        this._userListDropdown = response;
        this.GetOvertimeApplicationDetail();
        if (this._userDropdownSubscription !== null) this._userDropdownSubscription.unsubscribe();
      },
      error => {
        this._snackBarTemplate.snackBarError(this._snackBar, error.error.Message + " " + error.status);
        if (this._userDropdownSubscription !== null) this._userDropdownSubscription.unsubscribe();
      }
    );
  }

  private async GetOvertimeApplicationDetail() {
    let id = 0;
    this._activatedRoute.params.subscribe(params => { id = params["id"]; });
    this._isComponentsHidden = true;
    this.DisableButtons();
    this._overtimeApplicationDetailSubscription = await (await this._overtimeApplicationDetailService.OvertimeApplicationDetail(id)).subscribe(
      (response: any) => {
        let result = response;
        console.log(result);
        if (result != null) {
          this._overtimeApplicationModel = result;
          this._overtimeApplicationModel.OTDate = new Date(result["LADate"]);
          this._overtimeApplicationLineModel.OTId = result["Id"];
        }

        this.loadComponent(result["_isLocked"]);
        this.GetOvertimeApplicationLineListData();
        this._isDataLoaded = true;
        this._isComponentsHidden = false;
        if (this._overtimeApplicationDetailSubscription !== null) this._overtimeApplicationDetailSubscription.unsubscribe();
      },
      error => {
        this._snackBarTemplate.snackBarError(this._snackBar, error.error.Message + " " + error.status);
        if (this._overtimeApplicationDetailSubscription !== null) this._overtimeApplicationDetailSubscription.unsubscribe();
      }
    );
  }

  public async SaveOvertimeApplicationDetail() {
    this.DisableButtons();
    if (this._isDataLoaded == true) {
      this._isDataLoaded = false;
      this._saveOvertimeApplicationDetailSubscription = (await this._overtimeApplicationDetailService.SaveOvertimeApplication(this._overtimeApplicationModel.Id, this._overtimeApplicationModel)).subscribe(
        response => {
          this.loadComponent(this._overtimeApplicationModel.IsLocked);
          this._isDataLoaded = true;
          this._snackBarTemplate.snackBarSuccess(this._snackBar, "Save Successfully.");
          if (this._saveOvertimeApplicationDetailSubscription !== null) this._saveOvertimeApplicationDetailSubscription.unsubscribe();
        },
        error => {
          this.loadComponent(this._overtimeApplicationModel.IsLocked);
          this._isDataLoaded = true;
          this._snackBarTemplate.snackBarError(this._snackBar, error.error.Message + " " + error.status);
          if (this._saveOvertimeApplicationDetailSubscription !== null) this._saveOvertimeApplicationDetailSubscription.unsubscribe();
        }
      );
    }
  }

  public async LockOvertimeApplicationDetail() {
    this.DisableButtons();
    if (this._isDataLoaded == true) {
      this._isDataLoaded = false;
      this._lockOvertimeApplicationDetailSubscription = await (await this._overtimeApplicationDetailService.LockOvertimeApplication(this._overtimeApplicationModel.Id, this._overtimeApplicationModel)).subscribe(
        response => {
          this.loadComponent(true);
          this._isDataLoaded = true;
          this._snackBarTemplate.snackBarSuccess(this._snackBar, "Lock Successfully.");
          if (this._lockOvertimeApplicationDetailSubscription !== null) this._lockOvertimeApplicationDetailSubscription.unsubscribe();
        },
        error => {
          this.loadComponent(false);
          this._isDataLoaded = true;
          this._snackBarTemplate.snackBarError(this._snackBar, error.error.Message + " " + error.status);
          if (this._lockOvertimeApplicationDetailSubscription !== null) this._lockOvertimeApplicationDetailSubscription.unsubscribe();
        }
      );
    }
  }

  public async UnlockOvertimeApplicationDetail() {
    this.DisableButtons();
    if (this._isDataLoaded == true) {
      this._isDataLoaded = false;
      this._unlockOvertimeApplicationDetailSubscription = await (await this._overtimeApplicationDetailService.UnlockOvertimeApplication(this._overtimeApplicationModel.Id)).subscribe(
        response => {
          this.loadComponent(false);
          this._isDataLoaded = true;
          this._snackBarTemplate.snackBarSuccess(this._snackBar, "Unlock Successfully.");
          if (this._unlockOvertimeApplicationDetailSubscription !== null) this._unlockOvertimeApplicationDetailSubscription.unsubscribe();
        },
        error => {
          this.loadComponent(true);
          this._isDataLoaded = true;
          this._snackBarTemplate.snackBarError(this._snackBar, error.error.Message + " " + error.status);
          if (this._unlockOvertimeApplicationDetailSubscription !== null) this._unlockOvertimeApplicationDetailSubscription.unsubscribe();
        }
      );
    }
  }

  private loadComponent(isDisable) {
    if (isDisable == true) {
      this._btnAddOvertimeApplicationLineDisabled = isDisable;
      this._btnSaveDisabled = isDisable;
      this._btnLockDisabled = isDisable;
      this._btnUnlockDisabled = !isDisable;
    } else {
      this._btnAddOvertimeApplicationLineDisabled = isDisable;
      this._btnSaveDisabled = isDisable;
      this._btnLockDisabled = isDisable;
      this._btnUnlockDisabled = !isDisable;
    }

    this._isLocked = isDisable;
    this._isProgressBarHidden = false;
  }

  private DisableButtons() {
    this._btnSaveDisabled = true;
    this._btnLockDisabled = true;
    this._btnUnlockDisabled = true;
    this._isProgressBarHidden = true;
  }

  activeTab() { }

  private async GetOvertimeApplicationLineListData() {

    this._listOvertimeApplicationLineObservableArray = new ObservableArray();
    this._listOvertimeApplicationLineCollectionView = new CollectionView(this._listOvertimeApplicationLineObservableArray);
    this._listOvertimeApplicationLineCollectionView.pageSize = 15;
    this._listOvertimeApplicationLineCollectionView.trackChanges = true;
    await this._listOvertimeApplicationLineCollectionView.refresh();
    await this.flexOvertimeApplicationLine.refresh();

    this._isOvertimeApplicationLineProgressBarHidden = true;

    this._overtimeApplicationLineSubscription = await (await this._overtimeApplicationDetailService.OvertimeApplicationLineList(this._overtimeApplicationModel.Id)).subscribe(
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
        if (this._overtimeApplicationLineSubscription !== null) this._overtimeApplicationLineSubscription.unsubscribe();
      },
      error => {
        this._isOvertimeApplicationLineProgressBarHidden = false;
        this._snackBarTemplate.snackBarError(this._snackBar, error.error.Message + " " + error.status);
        if (this._overtimeApplicationLineSubscription !== null) this._overtimeApplicationLineSubscription.unsubscribe();
      }
    );
  }

  public AddOvertimeApplicationLine() {
    this.DetailOvertimeApplicationLine(this._overtimeApplicationLineModel, "Add Overtime Application Line");
  }

  public EditOvertimeApplicationLine() {
    let currentOvertimeApplicationLine = this._listOvertimeApplicationLineCollectionView.currentItem;
    this.DetailOvertimeApplicationLine(currentOvertimeApplicationLine, "Edit Overtime Application Line Detail");
  }

  public async DeleteOvertimeApplicationLine() {
    let currentOvertimeApplicationLine = this._listOvertimeApplicationLineCollectionView.currentItem;
    this._isOvertimeApplicationLineProgressBarHidden = true;

    if (this._isOvertimeApplicationLineDataLoaded == true) {
      this._isOvertimeApplicationLineDataLoaded = false;
      this._deleteOvertimeApplicationLineSubscription = await (await this._overtimeApplicationDetailService.DeleteOvertimeApplicationLine(currentOvertimeApplicationLine.Id)).subscribe(
        response => {
          this._snackBarTemplate.snackBarSuccess(this._snackBar, "Delete Successfully");
          this.GetOvertimeApplicationLineListData();
          this._isOvertimeApplicationLineProgressBarHidden = false;
          this._isOvertimeApplicationLineDataLoaded = true;
        },
        error => {
          this._isOvertimeApplicationLineDataLoaded = true;
          this._isOvertimeApplicationLineProgressBarHidden = false;
          this._snackBarTemplate.snackBarError(this._snackBar, error.error + " " + error.status);
          if (this._deleteOvertimeApplicationLineSubscription != null) this._deleteOvertimeApplicationLineSubscription.unsubscribe();
        }
      );
    }
  }

  public ComfirmDeleteOvertimeApplicationLine(): void {
    let currentOvertimeApplicationLine = this._listOvertimeApplicationLineCollectionView.currentItem;
    const matDialogRef = this._matDialog.open(DeleteDialogBoxComponent, {
      width: '500px',
      data: {
        objDialogTitle: "Delete OvertimeApplicationLine",
        objComfirmationMessage: ` Delete ${currentOvertimeApplicationLine.Employee}?`,
      },
      disableClose: true
    });

    matDialogRef.afterClosed().subscribe(result => {
      if (result.message == "Yes") {
        this.DeleteOvertimeApplicationLine();
      }
    });
  }

  public DetailOvertimeApplicationLine(objOvertimeApplicationLine: OvertimeApplicationLineModel, eventTitle: string) {
    const matDialogRef = this._matDialog.open(OvertimeApplicationLineDialogComponent, {
      width: '1300px',
      data: {
        objDialogTitle: eventTitle,
        objOvertimeApplicationLine: objOvertimeApplicationLine,
      },
      disableClose: true
    });

    matDialogRef.afterClosed().subscribe((result: any) => {
      if (result.event === "Add Overtime Application Line") {
        this.AddSaveOvertimeApplicationLine(result["data"]);
      }
      if (result.event === "Edit Overtime Application Line Detail") {
        this.UpdateOvertimeApplicationLine(result["data"].Id, result["data"]);
      }
    });
  }

  public async AddSaveOvertimeApplicationLine(objOvertimeApplicationLine: OvertimeApplicationLineModel) {
    if (this._isOvertimeApplicationLineDataLoaded == true) {
      this._isOvertimeApplicationLineDataLoaded = false;
      this._saveOvertimeApplicationLineSubscription = await (await this._overtimeApplicationDetailService.AddOvertimeApplicationLine(objOvertimeApplicationLine)).subscribe(
        response => {
          this._isOvertimeApplicationLineDataLoaded = true;
          this._snackBarTemplate.snackBarSuccess(this._snackBar, "Save Successfully");
          this.GetOvertimeApplicationLineListData();
          if (this._saveOvertimeApplicationLineSubscription != null) this._saveOvertimeApplicationLineSubscription.unsubscribe();
        },
        error => {
          this._isOvertimeApplicationLineDataLoaded = true;
          this._snackBarTemplate.snackBarError(this._snackBar, error.error + " " + " Status Code: " + error.status);
          if (this._saveOvertimeApplicationLineSubscription != null) this._saveOvertimeApplicationLineSubscription.unsubscribe();
        }
      );
    }
  }

  public async UpdateOvertimeApplicationLine(id: number, objOvertimeApplicationLine: OvertimeApplicationLineModel) {
    if (this._isOvertimeApplicationLineDataLoaded == true) {
      this._isOvertimeApplicationLineDataLoaded = false;
      this._updateOvertimeApplicationLineSubscription = await (await this._overtimeApplicationDetailService.UpdateTRLine(id, objOvertimeApplicationLine)).subscribe(
        response => {
          this._isOvertimeApplicationLineDataLoaded = true;
          this._snackBarTemplate.snackBarSuccess(this._snackBar, "Update Successfully");
          this.GetOvertimeApplicationLineListData();
          if (this._updateOvertimeApplicationLineSubscription != null) this._updateOvertimeApplicationLineSubscription.unsubscribe();
        },
        error => {
          this._isOvertimeApplicationLineDataLoaded = true;
          this._snackBarTemplate.snackBarError(this._snackBar, error.error + " " + " Status Code: " + error.status);
          if (this._updateOvertimeApplicationLineSubscription != null) this._updateOvertimeApplicationLineSubscription.unsubscribe();
        }
      );
    }
  }

  ngOnDestroy() {
  }

}
