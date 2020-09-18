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
import { MatSelectChange } from '@angular/material/select';
import { MatOption } from '@angular/material/core';
import { DatePipe } from '@angular/common';
import { SoftwareSecurityService, UserModule } from '../../software-security/software-security.service';
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
    private datePipe: DatePipe,
    private _softwareSecurityService: SoftwareSecurityService,
  ) { }

  private _userRightsSubscription: any;

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
    this._userRightsSubscription = await (await this._softwareSecurityService.PageModuleRights("Overtime Application Detail")).subscribe(
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
  async ngOnInit() {
    await this.Get_userRights();
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
    OTDate: '',
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

  public UIOTDate = new Date();

  public _overtimeApplicationLineModel: OvertimeApplicationLineModel = {
    Id: 0,
    OTId: 0,
    EmployeeId: 0,
    Employee: '',
    OTDate: this.datePipe.transform(new Date(), 'yyyy-MM-dd'),
    OTHours: '0',
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
          this.UIOTDate = new Date(result["OTDate"]);
          this._overtimeApplicationLineModel.OTId = result["Id"];
        }

        this.loadComponent(result["IsLocked"]);
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

  public GetUIDATEOTDate() {
    this._overtimeApplicationModel.OTDate = this.datePipe.transform(this.UIOTDate, 'yyyy-MM-dd');
    console.log(this._overtimeApplicationModel.OTDate);
  }

  public async SaveOvertimeApplicationDetail() {
    this.DisableButtons();
    if (this._isDataLoaded == true) {
      this._isDataLoaded = false;
      console.log(this._overtimeApplicationModel);;
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

    if (this._userRights.CanEdit === false) {
      this._isLocked = true;
    } else {
      this._isLocked = isDisable;
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
        objPayrollGroup: this._overtimeApplicationModel.PayrollGroup,
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

  selectedCheckedByUser(event: MatSelectChange) {
    const selectedData = {
      text: (event.source.selected as MatOption).viewValue,
      value: event.source.value
    };

    this._overtimeApplicationModel.CheckedByUserId = event.source.value;
    this._overtimeApplicationModel.CheckedByUser = (event.source.selected as MatOption).viewValue;
  }

  selectedApprovedByUser(event: MatSelectChange) {
    const selectedData = {
      text: (event.source.selected as MatOption).viewValue,
      value: event.source.value
    };

    this._overtimeApplicationModel.ApprovedByUserId = event.source.value;
    this._overtimeApplicationModel.ApprovedByUser = (event.source.selected as MatOption).viewValue;
  }

  public btnCSVClick(): void {
    var fileName = "";

    fileName = "overtime-application.csv";

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

    data = 'Overtime Applicaiton' + '\r\n\n';
    collection = this._listOvertimeApplicationLineCollectionView;
    fileName = "overtime-application.csv";

    if (data != "") {
      var label = '"' + 'Overtime Applicaiont ID' + '",'
        + '"' + 'OTNumber' + '",'
        + '"' + 'OTDate' + '",'
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
          var row = '"' + this._overtimeApplicationModel.Id + '",'
            + '"' + this._overtimeApplicationModel.OTNumber + '",'
            + '"' + this._overtimeApplicationModel.OTDate + '",'
            + '"' + this._overtimeApplicationModel.PayrollGroup + '",'
            + '"' + this._overtimeApplicationModel.Year + '",'
            + '"' + this._overtimeApplicationModel.Remarks + '",'
            + '"' + this._overtimeApplicationModel.PreparedByUser + '",'
            + '"' + this._overtimeApplicationModel.CheckedByUser + '",'
            + '"' + this._overtimeApplicationModel.ApprovedByUser + '",';

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
