import { Component, OnInit, ViewChild } from '@angular/core';
import * as wjcCore from '@grapecity/wijmo';
import * as wjcGrid from '@grapecity/wijmo.grid';
import { CollectionView, ObservableArray } from '@grapecity/wijmo';

import { ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackBarTemplate } from '../../shared/snack-bar-template';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSelectChange } from '@angular/material/select';
import { MatOption } from '@angular/material/core';
import { DatePipe } from '@angular/common';

import * as XLSX from 'xlsx';

import { DtrDetialService } from './../dtr-detial.service';
import { DTRModel } from '../dtr-detial.model';
import { DTRLineModel } from '../dtr-line.model';
import { DtrDetialDtrLineDetailDialogComponent } from '../dtr-detial-dtr-line-detail-dialog/dtr-detial-dtr-line-detail-dialog.component';
import { DtrDetailDtrLineAddDialogComponent } from '../dtr-detail-dtr-line-add-dialog/dtr-detail-dtr-line-add-dialog.component';
import { SoftwareSecurityService, UserModule } from '../../software-security/software-security.service';
import { DtrDetailImportDtrLogsComponent } from '../dtr-detail-import-dtr-logs/dtr-detail-import-dtr-logs.component';
import { ComfirmMassageDialogComponent } from '../../shared/comfirm-massage-dialog/comfirm-massage-dialog.component';
import { SharedService } from '../../shared/shared.service';

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
    private datePipe: DatePipe,
    private _softwareSecurityService: SoftwareSecurityService,
    private _sharedService: SharedService
  ) { }

  async ngOnInit() {
    await this.GetUserRights();
  }

  private async GetUserRights() {
    this._userRightsSubscription = await (await this._softwareSecurityService.PageModuleRights("DTR Detail")).subscribe(
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
    DTRDate: '',
    PayrollGroup: '',
    YearId: 0,
    Year: '',
    DateStart: '',
    DateEnd: '',
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
    CreatedDateTime: '',
    UpdatedByUserId: 0,
    UpdatedByUser: '',
    UpdatedDateTime: '',
    IsLocked: false
  };

  public UIDTRDate = new Date();
  public UIDateStart = new Date();
  public UIDateEnd = new Date();

  public _dTRLineModel: DTRLineModel = {
    Id: 0,
    DTRId: 0,
    EmployeeId: 0,
    Employee: '',
    DTRDate: '',
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

  @ViewChild('flexDTRLine') flexDTRLine: wjcGrid.FlexGrid;

  private _dTRLineListSubscription: any;
  private _saveDTRLineSubscription: any;
  private _deleteDTRLineSubscription: any;

  public _btnAddDTRLineDisabled: boolean = false;

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
          this.UIDTRDate = new Date(result["DTRDate"]);
          this.UIDateStart = new Date(result["DateStart"]);
          this.UIDateEnd = new Date(result["DateEnd"]);
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

  public GetUIDATEDTRDate() {
    this._dTRModel.DTRDate = this.datePipe.transform(this.UIDTRDate, 'yyyy-MM-dd');
  }

  public GetUIDATEDateStart() {
    this._dTRModel.DateStart = this.datePipe.transform(this.UIDateStart, 'yyyy-MM-dd');
  }

  public GetUIDATEDateEnd() {
    this._dTRModel.DateEnd = this.datePipe.transform(this.UIDateEnd, 'yyyy-MM-dd');
  }

  public async SaveDTRDetail() {
    this.DisableButtons();
    if (this._isDataLoaded == true) {
      this._isDataLoaded = false;
      this._saveDTRDetailSubscription = (await this._dtrDetialService.SaveDTR(this._dTRModel.Id, this._dTRModel)).subscribe(
        response => {
          this.loadComponent(false);
          this._isDataLoaded = true;
          this._snackBarTemplate.snackBarSuccess(this._snackBar, "Save Successfully.");
          if (this._saveDTRDetailSubscription !== null) this._saveDTRDetailSubscription.unsubscribe();
        },
        error => {
          this.loadComponent(false);
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
    this._btnAddDTRLineDisabled = isDisable;
    this._btnSaveDisabled = isDisable;
    this._btnLockisabled = isDisable;
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


  gridClick(s, e) {
    if (wjcCore.hasClass(e.target, 'button-edit')) {
      if (this._userRights.CanEdit) {
        this.EditDTRLine();
      }
    }

    if (wjcCore.hasClass(e.target, 'button-delete')) {
      if (this._userRights.CanDelete) {
        this.ComfirmDeleteDTRLine();
      }
    }
  }

  public AddDTRLine() {
    this.DetailDTRLine(this._dTRLineModel, "Add DTR Line");
  }

  public EditDTRLine() {
    let currentDTRLine = this._listDTRLineCollectionView.currentItem;

    let _dTRLineModel: DTRLineModel = {
      Id: currentDTRLine.Id,
      DTRId: currentDTRLine.DTRId,
      EmployeeId: currentDTRLine.EmployeeId,
      Employee: currentDTRLine.Employee,
      DTRDate: currentDTRLine.DTRDate,
      DateType: currentDTRLine.DateType,
      IsRestDay: currentDTRLine.IsRestDay,
      ShiftId: currentDTRLine.ShiftId,
      Shift: currentDTRLine.Shift,
      Branch: currentDTRLine.Branch,
      TimeIn1: currentDTRLine.TimeIn1,
      TimeOut1: currentDTRLine.TimeOut1,
      TimeIn2: currentDTRLine.TimeIn2,
      TimeOut2: currentDTRLine.TimeOut2,
      IsOnLeave: currentDTRLine.IsOnLeave,
      IsOnLeaveHalfDay: currentDTRLine.IsOnLeaveHalfDay,
      IsOnOfficialBusiness: currentDTRLine.IsOnOfficialBusiness,
      IsOnOfficialBusinessHalfDay: currentDTRLine.IsOnOfficialBusinessHalfDay,
      IsAbsent: currentDTRLine.IsAbsent,
      IsAbsentHalfDay: currentDTRLine.IsAbsentHalfDay,
      NumberOfHoursWorked: this.RemoveComma(currentDTRLine.NumberOfHoursWorked),
      OvertimeHours: this.RemoveComma(currentDTRLine.OvertimeHours),
      NightDifferentialHours: this.RemoveComma(currentDTRLine.NightDifferentialHours),
      LateHours: this.RemoveComma(currentDTRLine.LateHours),
      UndertimeHours: this.RemoveComma(currentDTRLine.UndertimeHours),
      DailyPay: this.RemoveComma(currentDTRLine.DailyPay),
      PremiumPay: this.RemoveComma(currentDTRLine.PremiumPay),
      HolidayPay: this.RemoveComma(currentDTRLine.HolidayPay),
      OvertimePay: this.RemoveComma(currentDTRLine.OvertimePay),
      NightDifferentialPay: this.RemoveComma(currentDTRLine.NightDifferentialPay),
      COLA: this.RemoveComma(currentDTRLine.COLA),
      AdditionalAllowance: this.RemoveComma(currentDTRLine.AdditionalAllowance),
      LateDeduction: this.RemoveComma(currentDTRLine.LateDeduction),
      UndertimeDeduction: this.RemoveComma(currentDTRLine.UndertimeDeduction),
      AbsentDeduction: this.RemoveComma(currentDTRLine.AbsentDeduction),
      DailyNetPay: this.RemoveComma(currentDTRLine.DailyNetPay),
      Remarks: currentDTRLine.Remarks
    }
    this.DetailDTRLine(_dTRLineModel, "Edit DTR Line Detail");
  }

  public RemoveComma(value: string): string {
    return value.toString().replace(',', '');
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

  private _computeDTRLinesSubscription: any;

  public async ComputeAllDTRLines() {
    console.log("ComputeAllDTRLines");
    if (this._isDataLoaded == true) {
      this._isDataLoaded = false;
      this._isDTRLineProgressBarHidden = true;

      this._computeDTRLinesSubscription = await (await this._dtrDetialService.ComputeAllDTRLines(this._dTRModel.Id)).subscribe(
        response => {
          this._isDataLoaded = true;
          this._isDTRLineProgressBarHidden = false;

          this._snackBarTemplate.snackBarSuccess(this._snackBar, "Compute Successfully");
          this.GetDTRLineListData();
          if (this._computeDTRLinesSubscription != null) this._computeDTRLinesSubscription.unsubscribe();
        },
        error => {
          this._isDataLoaded = true;
          this._isDTRLineProgressBarHidden = false;

          this._snackBarTemplate.snackBarError(this._snackBar, error.error + " " + " Status Code: " + error.status);
          if (this._computeDTRLinesSubscription != null) this._computeDTRLinesSubscription.unsubscribe();
        }
      );
    }
  }

  public ComfirmDeleteDTRLine(): void {
    let currentDTRLine = this._listDTRLineCollectionView.currentItem;
    const matDialogRef = this._deleteDTRLineDialogRef.open(ComfirmMassageDialogComponent, {
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
        objDateStart: this.UIDateStart,
        objDateEnd: this.UIDateEnd,
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

  public ImportDTRLogs() {
    if (this._dTRLineListSubscription !== null) this._dTRLineListSubscription.unsubscribe();

    const matDialogRef = this._updateDTRLineDialogRef.open(DtrDetailImportDtrLogsComponent, {
      width: '1300px',
      data: {
        objDialogTitle: 'Import DTR Logs',
        objDTRData: this._dTRModel,
      },
      disableClose: true
    });

    matDialogRef.afterClosed().subscribe((result: any) => {
      if (result.event !== 'Close') {
        this.GetDTRLineListData();
      }
    });
  }

  public btnCSVClick() {
    this._sharedService.generateCSV(this._listDTRLineCollectionView, "Daily Time Records", "dtr-list.csv");
  }

  ngOnDestroy() {
  }
}
