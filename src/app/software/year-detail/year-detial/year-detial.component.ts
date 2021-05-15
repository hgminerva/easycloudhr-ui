import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import * as wjcCore from '@grapecity/wijmo';
import * as wjcGrid from '@grapecity/wijmo.grid';
import { CollectionView, ObservableArray } from '@grapecity/wijmo';

import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackBarTemplate } from '../../shared/snack-bar-template';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';

import { YearModel } from './../year.model';
import { YearDateModel } from './../year-date.model';
import { YearDetialService } from './../year-detial.service';
import { YearDateDialogComponent } from '../year-date-dialog/year-date-dialog.component';
import { DatePipe } from '@angular/common';
import { YearDateAddToBranchesDialogComponent } from '../year-date-add-to-branches-dialog/year-date-add-to-branches-dialog.component';
import { SoftwareSecurityService, UserModule } from '../../software-security/software-security.service';
import { ComfirmMassageDialogComponent } from '../../shared/comfirm-massage-dialog/comfirm-massage-dialog.component';
import { YearLeaveCreditsModel } from '../year-leave-credits.model';
import { YearLeaveCreditsDialogComponent } from '../year-leave-credits-dialog/year-leave-credits-dialog.component';

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
    private datePipe: DatePipe,
    private _softwareSecurityService: SoftwareSecurityService,
  ) { }

  private _userRightsSubscription: any;
  public _canEdit: boolean = false;
  public _canDelete: boolean = false;

  public _userRights: UserModule = {
    Module: "",
    CanOpen: false,
    CanAdd: false,
    CanEdit: false,
    CanDelete: false,
    CanLock: false,
    CanUnlock: false,
    CanPrint: false,
  }

  private async Get_userRights() {
    this._userRightsSubscription = await (await this._softwareSecurityService.PageModuleRights("Year Detail")).subscribe(
      (response: any) => {
        let results = response;
        if (results !== null) {
          this._userRights.Module = results["Module"];
          this._userRights.CanOpen = results["CanOpen"];
          this._userRights.CanAdd = results["CanAdd"];
          this._userRights.CanEdit = results["CanEdit"];
          this._userRights.CanDelete = results["CanDelete"];
          this._userRights.CanLock = results["CanLock"];
          this._userRights.CanUnlock = results["CanUnlock"];
          this._userRights.CanPrint = results["CanPrint"];
        }

        if (this._userRightsSubscription !== null) this._userRightsSubscription.unsubscribe();
      },
      error => {
        this._snackBarTemplate.snackBarError(this._snackBar, error.error.Message + " " + error.status);
        if (this._userRightsSubscription !== null) this._userRightsSubscription.unsubscribe();
      }
    );

    await this.GetYearDetail();
  }

  public title = '';
  public event = 'Close';

  ngOnInit(): void {
    this.Get_userRights();
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

  public _btnAddDateDisabled: boolean = false;

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
          this.loadComponent(false);
          this._snackBarTemplate.snackBarSuccess(this._snackBar, "Save Successfully.");
          if (this._saveYearDetailSubscription !== null) this._saveYearDetailSubscription.unsubscribe();
        },
        error => {
          this.loadComponent(false);
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
    this._btnAddDateDisabled = isDisable;
    this._btnSaveDisabled = isDisable;
    this._btnLockIsabled = isDisable;
    this._btnUnlockDisabled = !isDisable;

    if (this._userRights.CanEdit === false) {
      this._canEdit = false;
      this._isLocked = true;
    } else {
      this._canEdit = !isDisable;
      this._isLocked = isDisable;
    }

    if (this._userRights.CanDelete === false) {
      this._canDelete = false;
    } else {
      this._canDelete = !isDisable;
    }

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

    this.GetYearLeaveCreditsListData();
  }

  gridClick(s, e) {
    if (wjcCore.hasClass(e.target, 'button-edit')) {
      if (this._userRights.CanEdit) {
        this.EditYearDate();
      }

    }

    if (wjcCore.hasClass(e.target, 'button-delete')) {
      if (this._userRights.CanDelete) {
        this.ComfirmDeleteYearDate();
      }
    }
  }

  public async AddYearDate(objYearDate: YearDateModel) {
    this._btnAddDateDisabled = true;
    if (this._isDataLoaded == true) {
      this._isDataLoaded = false;
      this._addYearDateSubscription = (await this._yearDetialService.AddYearDate(objYearDate)).subscribe(
        (response: any) => {
          this._btnAddDateDisabled = false;
          this._isDataLoaded = true;
          this.GetYearDateListData();
          this._snackBarTemplate.snackBarSuccess(this._snackBar, "Added Successfully");
        },
        error => {
          this._btnAddDateDisabled = false;
          this._isDataLoaded = true;
          this._snackBarTemplate.snackBarError(this._snackBar, error.error + " " + " Status Code: " + error.status);
          if (this._addYearDateSubscription != null) this._addYearDateSubscription.unsubscribe();
        }
      );
    }
  }

  public async UpdateYearDate(objYearDate: YearDateModel) {
    this._btnAddDateDisabled = true;
    if (this._isDataLoaded == true) {
      this._isDataLoaded = false;
      this._addYearDateSubscription = (await this._yearDetialService.Updatedate(objYearDate.Id, objYearDate)).subscribe(
        (response: any) => {
          this._btnAddDateDisabled = false;
          this._isDataLoaded = true;
          this.GetYearDateListData();
          this._snackBarTemplate.snackBarSuccess(this._snackBar, "Updated Successfully");
        },
        error => {
          this._btnAddDateDisabled = false;
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
    const userRegistrationlDialogRef = this.deleteYearDateDetailDialog.open(ComfirmMassageDialogComponent, {
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

  @ViewChild('tabGroup') tabGroup;

  Add() {
    if (this.tabGroup.selectedIndex == 0) {
      this.AddYearDateToBranches();
    }

    if (this.tabGroup.selectedIndex == 1) {
      this.AddYearLeaveCreditsDialog();
    }
  }

  activeTab() { }

  public _listYearLeaveCreditsObservableArray: ObservableArray = new ObservableArray();
  public _listYearLeaveCreditsCollectionView: CollectionView = new CollectionView(this._listYearLeaveCreditsObservableArray);
  public _listYearLeaveCreditsPageIndex: number = 15;

  public _isYearLeaveCreditsProgressBarHidden = false;
  public _isYearLeaveCreditsDataLoaded: boolean = false;

  private _yearLeaveCreditsListSubscription: any;
  private _addLeaveCreditsSubscription: any;
  private _deleteLeaveCreditsSubscription: any;

  @ViewChild('flexYearLeaveCredits') flexYearLeaveCredits: wjcGrid.FlexGrid;

  private async GetYearLeaveCreditsListData() {
    this._listYearLeaveCreditsObservableArray = new ObservableArray();
    this._listYearLeaveCreditsCollectionView = new CollectionView(this._listYearLeaveCreditsObservableArray);
    this._listYearLeaveCreditsCollectionView.pageSize = 15;
    this._listYearLeaveCreditsCollectionView.trackChanges = true;
    await this._listYearLeaveCreditsCollectionView.refresh();
    await this.flexYearLeaveCredits.refresh();

    this._isYearLeaveCreditsProgressBarHidden = true;

    this._yearLeaveCreditsListSubscription = (await this._yearDetialService.YearLeaveCreditsList(this._yearModel.Id)).subscribe(
      (response: any) => {
        var results = response;
        console.log(response);
        if (results["length"] > 0) {
          this._listYearLeaveCreditsObservableArray = results;
          this._listYearLeaveCreditsCollectionView = new CollectionView(this._listYearLeaveCreditsObservableArray);
          this._listYearLeaveCreditsCollectionView.pageSize = 15;
          this._listYearLeaveCreditsCollectionView.trackChanges = true;
          this._listYearLeaveCreditsCollectionView.refresh();
          this.flexYearLeaveCredits.refresh();
        }

        this._isYearLeaveCreditsDataLoaded = true;
        this._isYearLeaveCreditsProgressBarHidden = false;

        if (this._yearLeaveCreditsListSubscription != null) this._yearLeaveCreditsListSubscription.unsubscribe();
      },
      error => {
        this._snackBarTemplate.snackBarError(this._snackBar, error.error.Message + " " + error.status);
        if (this._yearLeaveCreditsListSubscription !== null) this._yearLeaveCreditsListSubscription.unsubscribe();
      }
    );
  }

  gridYearLeaveCreditsClick(s, e) {
    if (wjcCore.hasClass(e.target, 'lc-button-edit')) {
      if (this._userRights.CanEdit) {
        this.EditYearLeaveCredits();
      }

    }

    if (wjcCore.hasClass(e.target, 'lc-button-delete')) {
      if (this._userRights.CanDelete) {
        this.ComfirmDeleteYearLeaveCredits();
      }
    }
  }

  public async AddYearLeaveCredits(objearLeaveCredits: YearLeaveCreditsModel) {
    this._btnAddDateDisabled = true;
    if (this._isDataLoaded == true) {
      this._isYearLeaveCreditsDataLoaded = false;
      this._addLeaveCreditsSubscription = (await this._yearDetialService.AddYearLeaveCredits(this._yearModel.Id, objearLeaveCredits)).subscribe(
        (response: any) => {
          this._btnAddDateDisabled = false;
          this._isYearLeaveCreditsDataLoaded = true;
          this.GetYearLeaveCreditsListData();
          this._snackBarTemplate.snackBarSuccess(this._snackBar, "Added Successfully");
          if (this._addLeaveCreditsSubscription != null) this._addLeaveCreditsSubscription.unsubscribe();
        },
        error => {
          this._btnAddDateDisabled = false;
          this._isYearLeaveCreditsDataLoaded = true;
          this._snackBarTemplate.snackBarError(this._snackBar, error.error + " " + " Status Code: " + error.status);
          if (this._addLeaveCreditsSubscription != null) this._addLeaveCreditsSubscription.unsubscribe();
        }
      );
    }
  }

  public async UpdateYearLeaveCredits(objearLeaveCredits: YearLeaveCreditsModel) {
    this._btnAddDateDisabled = true;
    if (this._isYearLeaveCreditsDataLoaded == true) {
      this._isYearLeaveCreditsDataLoaded = false;
      this._deleteLeaveCreditsSubscription = (await this._yearDetialService.UpdateYearLeaveCredits(objearLeaveCredits.Id, objearLeaveCredits)).subscribe(
        (response: any) => {
          this._btnAddDateDisabled = false;
          this._isYearLeaveCreditsDataLoaded = true;
          this.GetYearLeaveCreditsListData();
          this._snackBarTemplate.snackBarSuccess(this._snackBar, "Updated Successfully");
          if (this._deleteLeaveCreditsSubscription != null) this._deleteLeaveCreditsSubscription.unsubscribe();
        },
        error => {
          this._btnAddDateDisabled = false;
          this._isYearLeaveCreditsDataLoaded = true;
          this._snackBarTemplate.snackBarError(this._snackBar, error.error + " " + " Status Code: " + error.status);
          if (this._deleteLeaveCreditsSubscription != null) this._deleteLeaveCreditsSubscription.unsubscribe();
        }
      );
    }
  }

  AddYearLeaveCreditsDialog() {
    let yearLeaveCreditsModel: YearLeaveCreditsModel = {
      Id: 0,
      YearId: 0,
      EmployeeId: 0,
      Employee: '',
      LeaveCredits: '0',
      Remarks: 'NA',
      DateEncoded: '',
      LeaveType: ''
    }
    this.DetailYearLeaveCredits(yearLeaveCreditsModel, "Add Year Leave Credits Detail");
  }

  public EditYearLeaveCredits() {
    let currentYearLeaveCredits = this._listYearLeaveCreditsCollectionView.currentItem;
    this.DetailYearLeaveCredits(currentYearLeaveCredits, "Edit Year Leave Credits Detail");
  }

  public async DeleteYearLeaveCredits() {
    let currentYearLeaveCredits = this._listYearLeaveCreditsCollectionView.currentItem;
    this._isYearDateProgressBarHidden = true;

    if (this._isDataLoaded == true) {
      this._isDataLoaded = false;
      this._deleteYearDateSubscription = (await this._yearDetialService.DeleteYearLeaveCredits(currentYearLeaveCredits.Id)).subscribe(
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

  public ComfirmDeleteYearLeaveCredits(): void {
    let currentYearLeaveCredits = this._listYearLeaveCreditsCollectionView.currentItem;
    const dialogRef = this.deleteYearDateDetailDialog.open(ComfirmMassageDialogComponent, {
      width: '500px',
      data: {
        objDialogTitle: "Delete Year Leave Credits",
        objComfirmationMessage: ` Delete ${currentYearLeaveCredits.Employee}?`,
      },
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result.message == "Yes") {
        this.DeleteYearLeaveCredits();
      }
    });
  }

  public DetailYearLeaveCredits(objYearLeaveCredits: YearLeaveCreditsModel, eventTitle: string): void {
    const dialogRef = this.YearDateDetailDialog.open(YearLeaveCreditsDialogComponent, {
      width: '700px',
      data: {
        objDialogTitle: eventTitle,
        objDialogData: objYearLeaveCredits,
      },
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result.event === "Add") {
        this.AddYearLeaveCredits(result.data);
      }
      if (result.event === "Edit") {
        this.UpdateYearLeaveCredits(result.data);
      }
    });
  }
}
