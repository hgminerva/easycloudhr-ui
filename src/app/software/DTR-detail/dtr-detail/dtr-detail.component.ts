import { Component, OnInit, ViewChild } from '@angular/core';

import * as wjcGrid from '@grapecity/wijmo.grid';
import { CollectionView, ObservableArray } from '@grapecity/wijmo';

import { ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackBarTemplate } from '../../shared/snack-bar-template';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { DtrDetialService } from './../dtr-detial.service';
import { DTRModel } from '../dtr-detial.model';
import { DTRLineModel } from '../dtr-line.model';
import { DeleteDialogBoxComponent } from '../../shared/delete-dialog-box/delete-dialog-box.component';
import { DtrDetialDtrLineDetailDialogComponent } from '../dtr-detial-dtr-line-detail-dialog/dtr-detial-dtr-line-detail-dialog.component';
import { DtrDetailDtrLineAddDialogComponent } from '../dtr-detail-dtr-line-add-dialog/dtr-detail-dtr-line-add-dialog.component';
import { MatSelectChange } from '@angular/material/select';
import { MatOption } from '@angular/material/core';
import { DatePipe } from '@angular/common';


@Component({
  selector: 'app-dtr-detail',
  templateUrl: './dtr-detail.component.html',
  styleUrls: ['./dtr-detail.component.css']
})
export class DTRDetailComponent implements OnInit {

  constructor(
    private _dtrDetialService: DtrDetialService,
    private _activatedRoute: ActivatedRoute,
    private _snackBar: MatSnackBar,
    private _snackBarTemplate: SnackBarTemplate,
    public _addDTRLinesatDialogRef: MatDialog,
    public _updateDTRLineDialogRef: MatDialog,
    public _deleteDTRLineDialogRef: MatDialog,
    private datePipe: DatePipe
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

  public _oTDropdownSubscription: any;
  public _oTListDropdown: any = [];

  public _lADropdownSubscription: any;
  public _lAListDropdown: any = [];

  public _prepareByDropdownSubscription: any;
  public _prepareByListDropdown: any = [];

  public _checkedByDropdownSubscription: any;
  public _checkedByListDropdown: any = [];

  public _approvedByDropdownSubscription: any;
  public _approvedByListDropdown: any = [];

  public _cSDropdownSubscription: any;
  public _cSListDropdown: any = [];

  public _userDropdownSubscription: any;
  public _userListDropdown: any = [];

  public _dTRDetailSubscription: any;
  public _saveDTRDetailSubscription: any;
  public _lockDTRDetailSubscription: any;
  public _unlockDTRDetailSubscription: any;

  public _dTRModel: DTRModel = {
    Id: 0,
    DTRNumber: '',
    DTRDate: new Date(),
    PayrollGroup: '',
    YearId: 0,
    Year: '',
    DateStart: new Date(),
    DateEnd: new Date(),
    OTId: 0,
    OT: '',
    LAId: 0,
    LA: '',
    CSId: 0,
    CS: '',
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

  public _dTRLineModel: DTRLineModel = {
    Id: 0,
    DTRId: 0,
    EmployeeId: 0,
    Employee: '',
    DTRDate: new Date(),
    DateType: '',
    IsRestDay: false,
    ShiftId: 0,
    Shift: '',
    Branch: '',
    TimeIn1: '0:00',
    TimeOut1: '0:00',
    TimeIn2: '0:00',
    TimeOut2: '0:00',
    IsOnLeave: false,
    IsOnLeaveHalfDay: false,
    IsOnOfficialBusiness: false,
    IsOnOfficialBusinessHalfDay: false,
    IsAbsent: false,
    IsAbsentHalfDay: false,
    NumberOfHoursWorked: '0.00',
    OvertimeHours: '0.00',
    NightDifferentialHours: '0.00',
    LateHours: '0.00',
    UndertimeHours: '0.00',
    DailyPay: '0.00',
    PremiumPay: '0.00',
    HolidayPay: '0.00',
    OvertimePay: '0.00',
    NightDifferentialPay: '0.00',
    COLA: '0.00',
    AdditionalAllowance: '0.00',
    LateDeduction: '0.00',
    UndertimeDeduction: '0.00',
    AbsentDeduction: '0.00',
    DailyNetPay: '0.00',
    Remarks: ''
  }

  // Class properties
  public _listDTRLineObservableArray: ObservableArray = new ObservableArray();
  public _listDTRLineCollectionView: CollectionView = new CollectionView(this._listDTRLineObservableArray);
  public _listPageIndex: number = 15;

  public _isDTRLineProgressBarHidden = false;
  public _isDTRLineDataLoaded: boolean = false;

  private _dTRLineListSubscription: any;
  private _saveDTRLineSubscription: any;
  private _deleteDTRLineSubscription: any;

  public _btnAddDTRLineDisabled: boolean = false;

  @ViewChild('flexDTRLine') flexDTRLine: wjcGrid.FlexGrid;

  private async PayrollGroupListData() {
    this._payrollGroupDropdownSubscription = (await this._dtrDetialService.PayrollGroupList()).subscribe(
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
    this._yearDropdownSubscription = (await this._dtrDetialService.YearList()).subscribe(
      response => {
        this._yearListDropdown = response;
        this.OTListData();
        if (this._yearDropdownSubscription !== null) this._yearDropdownSubscription.unsubscribe();
      },
      error => {
        this._snackBarTemplate.snackBarError(this._snackBar, error.error.Message + " " + error.status);
        if (this._yearDropdownSubscription !== null) this._yearDropdownSubscription.unsubscribe();
      }
    );
  }

  private async OTListData() {
    this._oTDropdownSubscription = await (await this._dtrDetialService.OTList()).subscribe(
      response => {
        this._oTListDropdown = response;
        this.LSListData();
        if (this._oTDropdownSubscription !== null) this._oTDropdownSubscription.unsubscribe();
      },
      error => {
        this._snackBarTemplate.snackBarError(this._snackBar, error.error.Message + " " + error.status);
        if (this._oTDropdownSubscription !== null) this._oTDropdownSubscription.unsubscribe();
      }
    );
  }

  private async LSListData() {
    this._lADropdownSubscription = await (await this._dtrDetialService.LAList()).subscribe(
      response => {
        this._lAListDropdown = response;
        this.CSListData();
        if (this._lADropdownSubscription !== null) this._lADropdownSubscription.unsubscribe();
      },
      error => {
        this._snackBarTemplate.snackBarError(this._snackBar, error.error.Message + " " + error.status);
        if (this._lADropdownSubscription !== null) this._lADropdownSubscription.unsubscribe();
      }
    );
  }

  private async CSListData() {
    this._cSDropdownSubscription = await (await this._dtrDetialService.CSList()).subscribe(
      response => {
        this._cSListDropdown = response;
        this.UserListData();
        if (this._cSDropdownSubscription !== null) this._cSDropdownSubscription.unsubscribe();
      },
      error => {
        this._snackBarTemplate.snackBarError(this._snackBar, error.error.Message + " " + error.status);
        if (this._cSDropdownSubscription !== null) this._cSDropdownSubscription.unsubscribe();
      }
    );
  }

  private async UserListData() {
    this._userDropdownSubscription = await (await this._dtrDetialService.UserList()).subscribe(
      response => {
        this._userListDropdown = response;
        this.GetDTRDetail();
        if (this._userDropdownSubscription !== null) this._userDropdownSubscription.unsubscribe();
      },
      error => {
        this._snackBarTemplate.snackBarError(this._snackBar, error.error.Message + " " + error.status);
        if (this._userDropdownSubscription !== null) this._userDropdownSubscription.unsubscribe();
      }
    );
  }

  private async GetDTRDetail() {
    let id = 0;
    this._activatedRoute.params.subscribe(params => { id = params["id"]; });
    this._isComponentsShown = true;
    this._isProgressBarHidden = true;

    this.DisableButtons();
    this._dTRDetailSubscription = await (await this._dtrDetialService.DTRDetail(id)).subscribe(
      (response: any) => {
        let result = response;
        if (result != null) {
          this._dTRModel = result;
          this._dTRModel.DTRDate = new Date(result["DTRDate"]);
          this._dTRModel.DateStart = new Date(result["DateStart"]);
          this._dTRModel.DateEnd = new Date(result["DateEnd"]);
          this._dTRLineModel.DTRId = result["Id"];
        }
        this.loadComponent(result["IsLocked"]);
        this.GetDTRLineListData();
        this._isDataLoaded = true;
        this._isProgressBarHidden = false;
        this._isComponentsShown = false;
        if (this._dTRDetailSubscription !== null) this._dTRDetailSubscription.unsubscribe();
      },
      error => {
        this._snackBarTemplate.snackBarError(this._snackBar, error.error.Message + " " + error.status);
        if (this._dTRDetailSubscription !== null) this._dTRDetailSubscription.unsubscribe();
      }
    );
  }

  public DateFormatedSelectedDate() {
    this._dTRModel.DTRDate = new Date(this.datePipe.transform(this._dTRModel.DTRDate, 'yyyy-MM-dd'));
    this._dTRModel.DateStart = new Date(this.datePipe.transform(this._dTRModel.DateStart, 'yyyy-MM-dd'));
    this._dTRModel.DateEnd = new Date(this.datePipe.transform(this._dTRModel.DateEnd, 'yyyy-MM-dd'));
  }

  public async SaveDTRDetail() {
    this.DisableButtons();
    if (this._isDataLoaded == true) {
      this._isDataLoaded = false;
      this.DateFormatedSelectedDate();
      this._saveDTRDetailSubscription = (await this._dtrDetialService.SaveDTR(this._dTRModel.Id, this._dTRModel)).subscribe(
        response => {
          this.loadComponent(this._dTRModel.IsLocked);
          this._isDataLoaded = true;
          this._snackBarTemplate.snackBarSuccess(this._snackBar, "Save Successfully.");
          if (this._saveDTRDetailSubscription !== null) this._saveDTRDetailSubscription.unsubscribe();
        },
        error => {
          this.loadComponent(this._dTRModel.IsLocked);
          this._isDataLoaded = true;
          this._snackBarTemplate.snackBarError(this._snackBar, error.error.Message + " " + error.status);
          if (this._saveDTRDetailSubscription !== null) this._saveDTRDetailSubscription.unsubscribe();
        }
      );
    }
  }

  public async LockDTRDetail() {
    this.DisableButtons();
    if (this._isDataLoaded == true) {
      this._isDataLoaded = false;
      this.DateFormatedSelectedDate();
      this._lockDTRDetailSubscription = await (await this._dtrDetialService.LockDTR(this._dTRModel.Id, this._dTRModel)).subscribe(
        response => {
          this.loadComponent(true);
          this._isDataLoaded = true;
          this._snackBarTemplate.snackBarSuccess(this._snackBar, "Lock Successfully.");
          if (this._lockDTRDetailSubscription !== null) this._lockDTRDetailSubscription.unsubscribe();
        },
        error => {
          this.loadComponent(false);
          this._isDataLoaded = true;
          this._snackBarTemplate.snackBarError(this._snackBar, error.error.Message + " " + error.status);
          if (this._lockDTRDetailSubscription !== null) this._lockDTRDetailSubscription.unsubscribe();
        }
      );
    }
  }

  public async UnlockDTRDetail() {
    this.DisableButtons();
    if (this._isDataLoaded == true) {
      this._isDataLoaded = false;
      this._unlockDTRDetailSubscription = await (await this._dtrDetialService.UnlockDTR(this._dTRModel.Id)).subscribe(
        response => {
          this.loadComponent(false);
          this._isDataLoaded = true;
          this._snackBarTemplate.snackBarSuccess(this._snackBar, "Unlock Successfully.");
          if (this._unlockDTRDetailSubscription !== null) this._unlockDTRDetailSubscription.unsubscribe();
        },
        error => {
          this.loadComponent(true);
          this._isDataLoaded = true;
          this._snackBarTemplate.snackBarError(this._snackBar, error.error.Message + " " + error.status);
          if (this._unlockDTRDetailSubscription !== null) this._unlockDTRDetailSubscription.unsubscribe();
        }
      );
    }
  }

  private loadComponent(isDisable) {
    if (isDisable == true) {
      this._btnAddDTRLineDisabled = isDisable;
      this._btnSaveDisabled = isDisable;
      this._btnLockisabled = isDisable;
      this._btnUnlockDisabled = !isDisable;
    } else {
      this._btnAddDTRLineDisabled = isDisable;
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

  private async GetDTRLineListData() {

    this._listDTRLineObservableArray = new ObservableArray();
    this._listDTRLineCollectionView = new CollectionView(this._listDTRLineObservableArray);
    this._listDTRLineCollectionView.pageSize = 15;
    this._listDTRLineCollectionView.trackChanges = true;
    await this._listDTRLineCollectionView.refresh();
    await this.flexDTRLine.refresh();

    this._isDTRLineProgressBarHidden = true;

    this._dTRLineListSubscription = await (await this._dtrDetialService.DTRLineList(this._dTRModel.Id)).subscribe(
      (response: any) => {
        if (response["length"] > 0) {
          this._listDTRLineObservableArray = response;
          this._listDTRLineCollectionView = new CollectionView(this._listDTRLineObservableArray);
          this._listDTRLineCollectionView.pageSize = 15;
          this._listDTRLineCollectionView.trackChanges = true;
          this._listDTRLineCollectionView.refresh();
          this.flexDTRLine.refresh();
        }

        this._isDTRLineDataLoaded = true;
        this._isDTRLineProgressBarHidden = false;
        if (this._dTRLineListSubscription !== null) this._dTRLineListSubscription.unsubscribe();
      },
      error => {
        this._isDTRLineProgressBarHidden = false;
        this._snackBarTemplate.snackBarError(this._snackBar, error.error.Message + " " + error.status);
        if (this._dTRLineListSubscription !== null) this._dTRLineListSubscription.unsubscribe();
      }
    );
  }

  public AddDTRLine() {
    this.DetailDTRLine(this._dTRLineModel, "Add DTR Line");
  }

  public EditDTRLine() {
    let currentDTRLine = this._listDTRLineCollectionView.currentItem;
    this.DetailDTRLine(currentDTRLine, "Edit DTR Line Detail");
  }

  public async DeleteDTRLine() {
    let currentDTRLine = this._listDTRLineCollectionView.currentItem;
    this._isProgressBarHidden = true;

    if (this._isDTRLineDataLoaded == true) {
      this._isDTRLineDataLoaded = false;
      this._deleteDTRLineSubscription = await (await this._dtrDetialService.DeleteDTRLine(currentDTRLine.Id)).subscribe(
        response => {
          this._snackBarTemplate.snackBarSuccess(this._snackBar, "Delete Successfully");
          this.GetDTRLineListData();
          this._isProgressBarHidden = false;
          this._isDTRLineDataLoaded = true;
        },
        error => {
          this._isDTRLineDataLoaded = true;
          this._isProgressBarHidden = false;
          this._snackBarTemplate.snackBarError(this._snackBar, error.error + " " + error.status);
          if (this._deleteDTRLineSubscription != null) this._deleteDTRLineSubscription.unsubscribe();
        }
      );
    }
  }

  public ComfirmDeleteDTRLine(): void {
    let currentDTRLine = this._listDTRLineCollectionView.currentItem;
    const matDialogRef = this._deleteDTRLineDialogRef.open(DeleteDialogBoxComponent, {
      width: '500px',
      data: {
        objDialogTitle: "Delete DTRLine",
        objComfirmationMessage: ` Delete ${currentDTRLine.Employee} DTR?`,
      },
      disableClose: true
    });

    matDialogRef.afterClosed().subscribe(result => {
      if (result.message == "Yes") {
        this.DeleteDTRLine();
      }
    });
  }


  public async AddDTRLineDialog() {
    const matDialogRef = this._addDTRLinesatDialogRef.open(DtrDetailDtrLineAddDialogComponent, {
      width: '1200px',
      data: {
        objDialogTitle: "Add DTR Lines",
        objData: this._dTRModel,
      },
      disableClose: true
    });

    matDialogRef.afterClosed().subscribe((result) => {
      if (result.event !== "Close") {
        this.GetDTRLineListData();
      }
    });
  }

  public DetailDTRLine(objDTRLine: DTRLineModel, eventTitle: string) {
    if (this._dTRLineListSubscription !== null) this._dTRLineListSubscription.unsubscribe();

    const matDialogRef = this._updateDTRLineDialogRef.open(DtrDetialDtrLineDetailDialogComponent, {
      width: '1300px',
      data: {
        objDialogTitle: eventTitle,
        objDTRLine: objDTRLine,
      },
      disableClose: true
    });

    matDialogRef.afterClosed().subscribe((result: any) => {
      if (result.event !== 'Close') {
        this.GetDTRLineListData();
      }
    });
  }

  ngOnDestroy() {
  }

  public async UpdateDTRLine(id: number, objDTRLine: DTRLineModel) {
    if (this._isDataLoaded == true) {
      this._isDataLoaded = false;
      this._saveDTRLineSubscription = await (await this._dtrDetialService.UpdateTRLine(id, objDTRLine)).subscribe(
        response => {
          this._isDataLoaded = true;
          this._snackBarTemplate.snackBarSuccess(this._snackBar, "Update Successfully");
          this.GetDTRLineListData();
          if (this._saveDTRLineSubscription != null) this._saveDTRLineSubscription.unsubscribe();
        },
        error => {
          this._isDataLoaded = true;
          this._snackBarTemplate.snackBarError(this._snackBar, error.error + " " + " Status Code: " + error.status);
          if (this._saveDTRLineSubscription != null) this._saveDTRLineSubscription.unsubscribe();
        }
      );
    }
  }

  selectedCheckedByUser(event: MatSelectChange) {
    const selectedData = {
      text: (event.source.selected as MatOption).viewValue,
      value: event.source.value
    };

    this._dTRModel.CheckedByUserId = event.source.value;
    this._dTRModel.CheckedByUser = (event.source.selected as MatOption).viewValue;
  }

  selectedApprovedByUser(event: MatSelectChange) {
    const selectedData = {
      text: (event.source.selected as MatOption).viewValue,
      value: event.source.value
    };

    this._dTRModel.ApprovedByUserId = event.source.value;
    this._dTRModel.ApprovedByUser = (event.source.selected as MatOption).viewValue;
  }

  public btnCSVClick(): void {
    var fileName = "";

    fileName = "dtr.csv";

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

    data = 'Daily Time Record' + '\r\n\n';
    collection = this._listDTRLineCollectionView;
    fileName = "dtr.csv";

    if (data != "") {
      var label = '"' + 'DTR ID' + '",'
        + '"' + 'LANumber' + '",'
        + '"' + 'LADate' + '",'
        + '"' + 'PayrollGroup' + '",'
        + '"' + 'Year' + '",'
        + '"' + 'DateStart' + '",'
        + '"' + 'Year' + '",'
        + '"' + 'DateEnd' + '",'
        + '"' + 'OT' + '",'
        + '"' + 'LA' + '",'
        + '"' + 'CS' + '",'
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
          var row = '"' + this._dTRModel.Id + '",'
            + '"' + this._dTRModel.DTRNumber + '",'
            + '"' + this._dTRModel.DTRDate + '",'
            + '"' + this._dTRModel.PayrollGroup + '",'
            + '"' + this._dTRModel.Year + '",'
            + '"' + this._dTRModel.DateStart + '",'
            + '"' + this._dTRModel.DateEnd + '",'
            + '"' + this._dTRModel.OT + '",'
            + '"' + this._dTRModel.LA + '",'
            + '"' + this._dTRModel.CS + '",'
            + '"' + this._dTRModel.Remarks + '",'
            + '"' + this._dTRModel.PreparedByUser + '",'
            + '"' + this._dTRModel.CheckedByUser + '",'
            + '"' + this._dTRModel.ApprovedByUser + '",';

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
