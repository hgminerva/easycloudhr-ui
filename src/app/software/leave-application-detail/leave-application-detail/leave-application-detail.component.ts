import { Component, OnInit, ViewChild } from '@angular/core';
import * as wjcCore from '@grapecity/wijmo';
import * as wjcGrid from '@grapecity/wijmo.grid';
import { CollectionView, ObservableArray } from '@grapecity/wijmo';

import { ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackBarTemplate } from '../../shared/snack-bar-template';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';


import { LeaveApplicationDetailService } from './../leave-application-detail.service';
import { LeaveApplicationModel } from '../leave-application.model';
import { LeaveApplicationLineModel } from '../leave-application-line.model';
import { LeaveApplicationLineDetailComponent } from '../leave-application-line-detail/leave-application-line-detail.component';
import { MatOption } from '@angular/material/core';
import { MatSelectChange } from '@angular/material/select';
import { DatePipe } from '@angular/common';
import { SoftwareSecurityService, UserModule } from '../../software-security/software-security.service';
import { ComfirmMassageDialogComponent } from '../../shared/comfirm-massage-dialog/comfirm-massage-dialog.component';

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
    private datePipe: DatePipe,
    private _softwareSecurityService: SoftwareSecurityService,
  ) { }

  async ngOnInit() {
    await this.Get_userRights();
  }

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
    this._userRightsSubscription = await (await this._softwareSecurityService.PageModuleRights("Leave Application Detail")).subscribe(
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
    LADate: '',
    PayrollGroup: '',
    YearId: 0,
    Year: '',
    Remarks: '',
    PreparedByUserId: 0,
    PreparedByUser: '',
    CheckedByUserId: 0,
    CheckedByUser: '',
    ApprovedByUserId: 0,
    ApprovedByUser: '',
    CreatedByUserId: 0,
    CreatedByUser: '',
    CreatedDateTime: new Date(),
    UpdatedByUserId: 0,
    UpdatedByUser: '',
    UpdatedDateTime: new Date(),
    IsLocked: false
  };

  public UILADate = new Date();

  public _leaveApplicationLineModel: LeaveApplicationLineModel = {
    Id: 0,
    LAId: 0,
    EmployeeId: 0,
    Employee: '',
    LADate: this.datePipe.transform(new Date(), 'yyyy-MM-dd'),
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
          this.UILADate = new Date(result["LADate"]);
          this._leaveApplicationLineModel.LAId = result["Id"];
        }

        this.loadComponent(result["IsLocked"]);
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

  public GetUIDATELADate() {
    this._leaveApplicationModel.LADate = this.datePipe.transform(this.UILADate, 'yyyy-MM-dd');
    console.log(this._leaveApplicationModel.LADate);
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

  gridClick(s, e) {
    if (wjcCore.hasClass(e.target, 'button-edit')) {
      if (this._userRights.CanEdit) {
        this.EditLeaveApplicationLine();
      }

    }

    if (wjcCore.hasClass(e.target, 'button-delete')) {
      if (this._userRights.CanDelete) {
        this.ComfirmDeleteLeaveApplicationLine();
      }
    }
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
    const matDialogRef = this._matDialog.open(ComfirmMassageDialogComponent, {
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
        objPayrollGroup: this._leaveApplicationModel.PayrollGroup,
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

  selectedCheckedByUser(event: MatSelectChange) {
    const selectedData = {
      text: (event.source.selected as MatOption).viewValue,
      value: event.source.value
    };

    this._leaveApplicationModel.CheckedByUserId = event.source.value;
    this._leaveApplicationModel.CheckedByUser = (event.source.selected as MatOption).viewValue;
  }

  selectedApprovedByUser(event: MatSelectChange) {
    const selectedData = {
      text: (event.source.selected as MatOption).viewValue,
      value: event.source.value
    };

    this._leaveApplicationModel.ApprovedByUserId = event.source.value;
    this._leaveApplicationModel.ApprovedByUser = (event.source.selected as MatOption).viewValue;
  }

  public btnCSVClick(): void {
    var fileName = "";

    fileName = "leave-application.csv";

    var csvData = this.generateCSV();
    var csvURL = window.URL.createObjectURL(csvData);
    var tempLink = document.createElement('a');

    tempLink.href = csvURL;
    tempLink.setAttribute('download', fileName);
    tempLink.click();
  }

  public generateCSV(): Blob {
    var data = "";
    var collection;
    var fileName = "";

    data = 'Leave Applicaiton' + '\r\n\n';
    collection = this._listLeaveApplicationLineCollectionView;
    fileName = "leave-application.csv";

    if (data != "") {
      var label = '"' + 'Leave Applicaiont ID' + '",'
        + '"' + 'LANumber' + '",'
        + '"' + 'LADate' + '",'
        + '"' + 'PayrollGroup' + '",'
        + '"' + 'Year' + '",'
        + '"' + 'Remarks' + '",'
        + '"' + 'PreparedByUser' + '",'
        + '"' + 'CheckedByUser' + '",'
        + '"' + 'ApprovedByUser' + '",';
      for (var s in collection.items[0]) {
        label += s + ',';
      }
      label = label.slice(0, -1);

      data += label + '\r\n';

      collection.moveToFirstPage();
      for (var p = 0; p < collection.pageCount; p++) {
        for (var i = 0; i < collection.items.length; i++) {
          var row = '"' + this._leaveApplicationModel.Id + '",'
            + '"' + this._leaveApplicationModel.LANumber + '",'
            + '"' + this._leaveApplicationModel.LADate + '",'
            + '"' + this._leaveApplicationModel.PayrollGroup + '",'
            + '"' + this._leaveApplicationModel.Year + '",'
            + '"' + this._leaveApplicationModel.Remarks + '",'
            + '"' + this._leaveApplicationModel.PreparedByUser + '",'
            + '"' + this._leaveApplicationModel.CheckedByUser + '",'
            + '"' + this._leaveApplicationModel.ApprovedByUser + '",';

          for (var s in collection.items[i]) {
            row += '"' + collection.items[i][s] + '",';
          }
          row.slice(0, row.length - 1);
          data += row + '\r\n';
        }
        collection.moveToNextPage();
      }
    }
    return new Blob([data], { type: 'text/csv;charset=utf-8;' });
  }

}
