import { Component, OnInit, ViewChild } from '@angular/core';

import * as wjcGrid from '@grapecity/wijmo.grid';
import { CollectionView, ObservableArray } from '@grapecity/wijmo';

import { ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackBarTemplate } from '../../shared/snack-bar-template';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { DeleteDialogBoxComponent } from '../../shared/delete-dialog-box/delete-dialog-box.component';

import { LeaveApplicationDetailService } from './../leave-application-detail.service';
import { LeaveApplicationModel } from '../leave-application.model';
import { LeaveApplicationLineModel } from '../leave-application-line.model';
import { LeaveApplicationLineDetailComponent } from '../leave-application-line-detail/leave-application-line-detail.component';

@Component({
  selector: 'app-leave-application-detail',
  templateUrl: './leave-application-detail.component.html',
  styleUrls: ['./leave-application-detail.component.css']
})
export class LeaveApplicationDetailComponent implements OnInit {

  constructor(
    private _leaveApplicationDetailService: LeaveApplicationDetailService,
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

  public _leaveApplicationDetailSubscription: any;
  public _saveLeaveApplicationDetailSubscription: any;
  public _lockcLeaveApplicationDetailSubscription: any;
  public _unlockLeaveApplicationDetailSubscription: any;

  public _leaveApplicationModel: LeaveApplicationModel = {
    Id: 0,
    LANumber: '',
    LADate: new Date(),
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

  public _leaveApplicationLineModel: LeaveApplicationLineModel = {
    Id: 0,
    LAId: 0,
    EmployeeId: 0,
    Employee: '',
    LADate: new Date(),
    IsHalfDay: false,
    IsWithPay: false,
    Remarks: ''
  }

  // Class properties
  public _listLeaveApplicationLineObservableArray: ObservableArray = new ObservableArray();
  public _listLeaveApplicationLineCollectionView: CollectionView = new CollectionView(this._listLeaveApplicationLineObservableArray);
  public _listPageIndex: number = 15;

  public _isLeaveApplicationLineProgressBarHidden = false;
  public _isLeaveApplicationLineDataLoaded: boolean = false;

  private _leaveApplicationLineSubscription: any;
  private _saveLeaveApplicationLineSubscription: any;
  private _updateLeaveApplicationLineSubscription: any;
  private _deleteLeaveApplicationLineSubscription: any;

  public _btnAddLeaveApplicationLineDisabled: boolean = false;

  @ViewChild('flexLeaveApplicationLine') flexLeaveApplicationLine: wjcGrid.FlexGrid;

  private async PayrollGroupListData() {
    this._payrollGroupDropdownSubscription = (await this._leaveApplicationDetailService.PayrollGroupList()).subscribe(
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
    this._yearDropdownSubscription = (await this._leaveApplicationDetailService.YearList()).subscribe(
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
    this._userDropdownSubscription = await (await this._leaveApplicationDetailService.UserList()).subscribe(
      response => {
        this._userListDropdown = response;
        this.GetLeaveApplicationDetail();
        if (this._userDropdownSubscription !== null) this._userDropdownSubscription.unsubscribe();
      },
      error => {
        this._snackBarTemplate.snackBarError(this._snackBar, error.error.Message + " " + error.status);
        if (this._userDropdownSubscription !== null) this._userDropdownSubscription.unsubscribe();
      }
    );
  }

  private async GetLeaveApplicationDetail() {
    let id = 0;
    this._activatedRoute.params.subscribe(params => { id = params["id"]; });
    this._isComponentsHidden = true;
    this.DisableButtons();
    this._leaveApplicationDetailSubscription = await (await this._leaveApplicationDetailService.LeaveApplicationDetail(id)).subscribe(
      (response: any) => {
        let result = response;
        console.log(result);
        if (result != null) {
          this._leaveApplicationModel = result;
          this._leaveApplicationModel.LADate = new Date(result["LADate"]);
          this._leaveApplicationLineModel.LAId = result["Id"];
        }

        this.loadComponent(result["_isLocked"]);
        this.GetLeaveApplicationLineListData();
        this._isDataLoaded = true;
        this._isComponentsHidden = false;
        if (this._leaveApplicationDetailSubscription !== null) this._leaveApplicationDetailSubscription.unsubscribe();
      },
      error => {
        this._snackBarTemplate.snackBarError(this._snackBar, error.error.Message + " " + error.status);
        if (this._leaveApplicationDetailSubscription !== null) this._leaveApplicationDetailSubscription.unsubscribe();
      }
    );
  }

  public async SaveLeaveApplicationDetail() {
    this.DisableButtons();
    if (this._isDataLoaded == true) {
      this._isDataLoaded = false;
      this._saveLeaveApplicationDetailSubscription = (await this._leaveApplicationDetailService.SaveLeaveApplication(this._leaveApplicationModel.Id, this._leaveApplicationModel)).subscribe(
        response => {
          this.loadComponent(this._leaveApplicationModel.IsLocked);
          this._isDataLoaded = true;
          this._snackBarTemplate.snackBarSuccess(this._snackBar, "Save Successfully.");
          if (this._saveLeaveApplicationDetailSubscription !== null) this._saveLeaveApplicationDetailSubscription.unsubscribe();
        },
        error => {
          this.loadComponent(this._leaveApplicationModel.IsLocked);
          this._isDataLoaded = true;
          this._snackBarTemplate.snackBarError(this._snackBar, error.error.Message + " " + error.status);
          if (this._saveLeaveApplicationDetailSubscription !== null) this._saveLeaveApplicationDetailSubscription.unsubscribe();
        }
      );
    }
  }

  public async LockLeaveApplicationDetail() {
    this.DisableButtons();
    if (this._isDataLoaded == true) {
      this._isDataLoaded = false;
      this._lockcLeaveApplicationDetailSubscription = await (await this._leaveApplicationDetailService.LockLeaveApplication(this._leaveApplicationModel.Id, this._leaveApplicationModel)).subscribe(
        response => {
          this.loadComponent(true);
          this._isDataLoaded = true;
          this._snackBarTemplate.snackBarSuccess(this._snackBar, "Lock Successfully.");
          if (this._lockcLeaveApplicationDetailSubscription !== null) this._lockcLeaveApplicationDetailSubscription.unsubscribe();
        },
        error => {
          this.loadComponent(false);
          this._isDataLoaded = true;
          this._snackBarTemplate.snackBarError(this._snackBar, error.error.Message + " " + error.status);
          if (this._lockcLeaveApplicationDetailSubscription !== null) this._lockcLeaveApplicationDetailSubscription.unsubscribe();
        }
      );
    }
  }

  public async UnlockLeaveApplicationDetail() {
    this.DisableButtons();
    if (this._isDataLoaded == true) {
      this._isDataLoaded = false;
      this._unlockLeaveApplicationDetailSubscription = await (await this._leaveApplicationDetailService.UnlockLeaveApplication(this._leaveApplicationModel.Id)).subscribe(
        response => {
          this.loadComponent(false);
          this._isDataLoaded = true;
          this._snackBarTemplate.snackBarSuccess(this._snackBar, "Unlock Successfully.");
          if (this._unlockLeaveApplicationDetailSubscription !== null) this._unlockLeaveApplicationDetailSubscription.unsubscribe();
        },
        error => {
          this.loadComponent(true);
          this._isDataLoaded = true;
          this._snackBarTemplate.snackBarError(this._snackBar, error.error.Message + " " + error.status);
          if (this._unlockLeaveApplicationDetailSubscription !== null) this._unlockLeaveApplicationDetailSubscription.unsubscribe();
        }
      );
    }
  }

  private loadComponent(isDisable) {
    if (isDisable == true) {
      this._btnAddLeaveApplicationLineDisabled = isDisable;
      this._btnSaveDisabled = isDisable;
      this._btnLockDisabled = isDisable;
      this._btnUnlockDisabled = !isDisable;
    } else {
      this._btnAddLeaveApplicationLineDisabled = isDisable;
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

  private async GetLeaveApplicationLineListData() {

    this._listLeaveApplicationLineObservableArray = new ObservableArray();
    this._listLeaveApplicationLineCollectionView = new CollectionView(this._listLeaveApplicationLineObservableArray);
    this._listLeaveApplicationLineCollectionView.pageSize = 15;
    this._listLeaveApplicationLineCollectionView.trackChanges = true;
    await this._listLeaveApplicationLineCollectionView.refresh();
    await this.flexLeaveApplicationLine.refresh();

    this._isLeaveApplicationLineProgressBarHidden = true;

    this._leaveApplicationLineSubscription = await (await this._leaveApplicationDetailService.LeaveApplicationLineList(this._leaveApplicationModel.Id)).subscribe(
      (response: any) => {
        if (response["length"] > 0) {
          this._listLeaveApplicationLineObservableArray = response;
          this._listLeaveApplicationLineCollectionView = new CollectionView(this._listLeaveApplicationLineObservableArray);
          this._listLeaveApplicationLineCollectionView.pageSize = 15;
          this._listLeaveApplicationLineCollectionView.trackChanges = true;
          this._listLeaveApplicationLineCollectionView.refresh();
          this.flexLeaveApplicationLine.refresh();
        }

        this._isLeaveApplicationLineDataLoaded = true;
        this._isLeaveApplicationLineProgressBarHidden = false;
        if (this._leaveApplicationLineSubscription !== null) this._leaveApplicationLineSubscription.unsubscribe();
      },
      error => {
        this._isLeaveApplicationLineProgressBarHidden = false;
        this._snackBarTemplate.snackBarError(this._snackBar, error.error.Message + " " + error.status);
        if (this._leaveApplicationLineSubscription !== null) this._leaveApplicationLineSubscription.unsubscribe();
      }
    );
  }

  public AddLeaveApplicationLine() {
    this.DetailLeaveApplicationLine(this._leaveApplicationLineModel, "Add Leave Application Line");
  }

  public EditLeaveApplicationLine() {
    let currentLeaveApplicationLine = this._listLeaveApplicationLineCollectionView.currentItem;
    this.DetailLeaveApplicationLine(currentLeaveApplicationLine, "Edit Leave Application Line Detail");
  }

  public async DeleteLeaveApplicationLine() {
    let currentLeaveApplicationLine = this._listLeaveApplicationLineCollectionView.currentItem;
    this._isLeaveApplicationLineProgressBarHidden = true;

    if (this._isLeaveApplicationLineDataLoaded == true) {
      this._isLeaveApplicationLineDataLoaded = false;
      this._deleteLeaveApplicationLineSubscription = await (await this._leaveApplicationDetailService.DeleteLeaveApplicationLine(currentLeaveApplicationLine.Id)).subscribe(
        response => {
          this._snackBarTemplate.snackBarSuccess(this._snackBar, "Delete Successfully");
          this.GetLeaveApplicationLineListData();
          this._isLeaveApplicationLineProgressBarHidden = false;
          this._isLeaveApplicationLineDataLoaded = true;
        },
        error => {
          this._isLeaveApplicationLineDataLoaded = true;
          this._isLeaveApplicationLineProgressBarHidden = false;
          this._snackBarTemplate.snackBarError(this._snackBar, error.error + " " + error.status);
          if (this._deleteLeaveApplicationLineSubscription != null) this._deleteLeaveApplicationLineSubscription.unsubscribe();
        }
      );
    }
  }

  public ComfirmDeleteLeaveApplicationLine(): void {
    let currentLeaveApplicationLine = this._listLeaveApplicationLineCollectionView.currentItem;
    const matDialogRef = this._matDialog.open(DeleteDialogBoxComponent, {
      width: '500px',
      data: {
        objDialogTitle: "Delete LeaveApplicationLine",
        objComfirmationMessage: ` Delete ${currentLeaveApplicationLine.Employee}?`,
      },
      disableClose: true
    });

    matDialogRef.afterClosed().subscribe(result => {
      if (result.message == "Yes") {
        this.DeleteLeaveApplicationLine();
      }
    });
  }

  public DetailLeaveApplicationLine(objLeaveApplicationLine: LeaveApplicationLineModel, eventTitle: string) {
    const matDialogRef = this._matDialog.open(LeaveApplicationLineDetailComponent, {
      width: '1300px',
      data: {
        objDialogTitle: eventTitle,
        objLeaveApplicationLine: objLeaveApplicationLine,
      },
      disableClose: true
    });

    matDialogRef.afterClosed().subscribe((result: any) => {
      if (result.event === "Add Leave Application Line") {
        this.AddSaveLeaveApplicationLine(result["data"]);
      }
      if (result.event === "Edit Leave Application Line Detail") {
        this.UpdateLeaveApplicationLine(result["data"].Id, result["data"]);
      }
    });
  }

  public async AddSaveLeaveApplicationLine(objLeaveApplicationLine: LeaveApplicationLineModel) {
    if (this._isLeaveApplicationLineDataLoaded == true) {
      this._isLeaveApplicationLineDataLoaded = false;
      this._saveLeaveApplicationLineSubscription = await (await this._leaveApplicationDetailService.AddLeaveApplicationLine(objLeaveApplicationLine)).subscribe(
        response => {
          this._isLeaveApplicationLineDataLoaded = true;
          this._snackBarTemplate.snackBarSuccess(this._snackBar, "Save Successfully");
          this.GetLeaveApplicationLineListData();
          if (this._saveLeaveApplicationLineSubscription != null) this._saveLeaveApplicationLineSubscription.unsubscribe();
        },
        error => {
          this._isLeaveApplicationLineDataLoaded = true;
          this._snackBarTemplate.snackBarError(this._snackBar, error.error + " " + " Status Code: " + error.status);
          if (this._saveLeaveApplicationLineSubscription != null) this._saveLeaveApplicationLineSubscription.unsubscribe();
        }
      );
    }
  }

  public async UpdateLeaveApplicationLine(id: number, objLeaveApplicationLine: LeaveApplicationLineModel) {
    if (this._isLeaveApplicationLineDataLoaded == true) {
      this._isLeaveApplicationLineDataLoaded = false;
      this._updateLeaveApplicationLineSubscription = await (await this._leaveApplicationDetailService.UpdateTRLine(id, objLeaveApplicationLine)).subscribe(
        response => {
          this._isLeaveApplicationLineDataLoaded = true;
          this._snackBarTemplate.snackBarSuccess(this._snackBar, "Update Successfully");
          this.GetLeaveApplicationLineListData();
          if (this._updateLeaveApplicationLineSubscription != null) this._updateLeaveApplicationLineSubscription.unsubscribe();
        },
        error => {
          this._isLeaveApplicationLineDataLoaded = true;
          this._snackBarTemplate.snackBarError(this._snackBar, error.error + " " + " Status Code: " + error.status);
          if (this._updateLeaveApplicationLineSubscription != null) this._updateLeaveApplicationLineSubscription.unsubscribe();
        }
      );
    }
  }

  ngOnDestroy() {
  }
}
