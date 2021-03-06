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

import { PayrollDetailService } from './../payroll-detail.service';
import { PayrollModel } from './../payroll.model';
import { PayrollLineModel } from './../payroll-line.model';
import { PayrollLineDetailDialogComponent } from '../payroll-line-detail-dialog/payroll-line-detail-dialog.component';
import { SoftwareSecurityService, UserModule } from '../../software-security/software-security.service';
import { PdfDialogComponent } from '../../shared/pdf-dialog/pdf-dialog.component';
import { ComfirmMassageDialogComponent } from '../../shared/comfirm-massage-dialog/comfirm-massage-dialog.component';
import { SharedService } from '../../shared/shared.service';
import { EmployeeListPickDialogComponent } from '../../shared/employee-list-pick-dialog/employee-list-pick-dialog.component';

@Component({
  selector: 'app-payroll-detail',
  templateUrl: './payroll-detail.component.html',
  styleUrls: ['./payroll-detail.component.css']
})
export class PayrollDetailComponent implements OnInit {

  constructor(
    private _payrollDetailService: PayrollDetailService,
    private _activatedRoute: ActivatedRoute,
    private _snackBar: MatSnackBar,
    private _snackBarTemplate: SnackBarTemplate,
    public _matDialogRef: MatDialog,
    private datePipe: DatePipe,
    private _softwareSecurityService: SoftwareSecurityService,
    private _sharedService: SharedService
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
    this._userRightsSubscription = await (await this._softwareSecurityService.PageModuleRights("Payroll Detail")).subscribe(
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

    await this.GetPayrollDetail();
  }

  public _isProgressBarHidden: boolean = false;
  public _isComponentsShown: boolean = true;

  public _btnSaveDisabled: boolean = true;
  public _btnLockisabled: boolean = true;
  public _btnUnlockDisabled: boolean = true;

  public _isDataLoaded: boolean = false;
  public _isLocked: boolean = false;

  public _dTRDropdownSubscription: any;
  public _dTRListDropdown: any = [];

  public _payrollOtherIncomeDropdownSubscription: any;
  public _payrollOtherIncomeListDropdown: any = [];

  public _payrollOtherDeductionDropdownSubscription: any;
  public _payrollOtherDeductionListDropdown: any = [];

  public _userDropdownSubscription: any;
  public _userListDropdown: any = [];

  public _payrollDetailSubscription: any;
  public _savePayrollDetailSubscription: any;
  public _lockPayrollDetailSubscription: any;
  public _unlockPayrollDetailSubscription: any;

  public _payrollModel: PayrollModel = {
    Id: 0,
    PAYNumber: '',
    PAYDate: '',
    PayrollGroup: '',
    YearId: 0,
    Year: '',
    QuarterNumber: '',
    MonthNumber: '',
    WeekNumber: '',
    DTRId: 0,
    DTR: '',
    PDId: 0,
    PD: '',
    PIId: 0,
    PI: '',
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

  public UIPAYDate = new Date();

  public _payrollLineModel: PayrollLineModel = {
    Id: 0,
    PAYId: 0,
    EmployeeId: 0,
    Employee: '',
    PayrollRate: '0',
    TotalDailyPay: '0',
    TotalPremiumPay: '0',
    TotalHolidayPay: '0',
    TotalOvertimePay: '0',
    TotalNightDifferentialPay: '0',
    TotalCOLA: '0',
    TotalAdditionalAllowance: '0',
    TotalLateDeduction: '0',
    TotalUndertimeDeduction: '0',
    Income: '0',
    TotalOtherIncomeNotTaxable: '0',
    TotalOtherIncomeTaxable: '0',
    GrossIncome: '0',
    SSSContribution: '0',
    PHICContribution: '0',
    HDMFContribution: '0',
    IncomeTaxAmount: '0',
    TotalOtherDeduction: '0',
    NetIncome: '0',
    SSSEmployerContribution: '0',
    SSSEC: '0',
    PHICEmployerContribution: '0',
    HDMFEmployerContribution: '0'
  }

  // Class properties
  public _listPayrollLineObservableArray: ObservableArray = new ObservableArray();
  public _listPayrollLineCollectionView: CollectionView = new CollectionView(this._listPayrollLineObservableArray);
  public _listPageIndex: number = 15;

  public _isPayrollLineProgressBarHidden = false;
  public _isPayrollLineDataLoaded: boolean = false;

  @ViewChild('flexPayrollLine') flexPayrollLine: wjcGrid.FlexGrid;

  private _payrollLineListSubscription: any;
  private _savePayrollLineSubscription: any;
  private _downlloadDTRPayrollLineSubscription: any;
  private _deletePayrollLineSubscription: any;

  public _btnAddPayrollLineDisabled: boolean = false;
  public payrollDetail: any;

  public pageNumber: number = 0;

  private async GetPayrollDetail() {
    let id = 0;
    this._activatedRoute.params.subscribe(params => { id = params["id"]; });
    this._isComponentsShown = true;
    this._isProgressBarHidden = true;

    this.DisableButtons();
    this._payrollDetailSubscription = await (await this._payrollDetailService.PayrollDetail(id)).subscribe(
      (response: any) => {
        let result = response;
        if (result != null) {
          this.payrollDetail = result;
          this.UIPAYDate = new Date(result["PAYDate"]);
          this._payrollLineModel.PAYId = result["Id"];
          this.DTRListData(result["PayrollGroup"]);
        }
        this.loadComponent(result["IsLocked"]);
        this._isDataLoaded = true;
        this._isProgressBarHidden = false;
        this._isComponentsShown = false;
        if (this._payrollDetailSubscription !== null) this._payrollDetailSubscription.unsubscribe();
      },
      error => {
        this._snackBarTemplate.snackBarError(this._snackBar, error.error.Message + " " + error.status);
        if (this._payrollDetailSubscription !== null) this._payrollDetailSubscription.unsubscribe();
      }
    );
  }

  private async DTRListData(payrollGroup) {
    this._dTRDropdownSubscription = await (await this._payrollDetailService.DTRList(payrollGroup)).subscribe(
      response => {
        this._dTRListDropdown = response;
        this._payrollModel.DTRId = this.payrollDetail.DTRId;

        if (this._dTRDropdownSubscription !== null) this._dTRDropdownSubscription.unsubscribe();
      },
      error => {
        this._snackBarTemplate.snackBarError(this._snackBar, error.error.Message + " " + error.status);
        if (this._dTRDropdownSubscription !== null) this._dTRDropdownSubscription.unsubscribe();
      }
    );
    this.PayrOtheIncomeListData(payrollGroup);
  }

  private async PayrOtheIncomeListData(payrollGroup) {
    this._payrollOtherIncomeDropdownSubscription = await (await this._payrollDetailService.PayrollOtherIncomeList(payrollGroup)).subscribe(
      response => {
        this._payrollOtherIncomeListDropdown = response;
        this._payrollModel.PIId = this.payrollDetail.PIId;
        if (this._payrollOtherIncomeDropdownSubscription !== null) this._payrollOtherIncomeDropdownSubscription.unsubscribe();
      },
      error => {
        this._snackBarTemplate.snackBarError(this._snackBar, error.error.Message + " " + error.status);
        if (this._payrollOtherIncomeDropdownSubscription !== null) this._payrollOtherIncomeDropdownSubscription.unsubscribe();
      }
    );
    this.PayrollOtherDeductionListData(payrollGroup);
  }

  private async PayrollOtherDeductionListData(payrollGroup) {
    this._payrollOtherDeductionDropdownSubscription = await (await this._payrollDetailService.PayrollOtherDeductionList(payrollGroup)).subscribe(
      response => {
        this._payrollOtherDeductionListDropdown = response;
        this._payrollModel.PDId = this.payrollDetail.PDId;
        this.UserListData();
        if (this._payrollOtherDeductionDropdownSubscription !== null) this._payrollOtherDeductionDropdownSubscription.unsubscribe();
      },
      error => {
        this._snackBarTemplate.snackBarError(this._snackBar, error.error.Message + " " + error.status);
        if (this._payrollOtherDeductionDropdownSubscription !== null) this._payrollOtherDeductionDropdownSubscription.unsubscribe();
      }
    );
  }

  private async UserListData() {
    this._userDropdownSubscription = await (await this._payrollDetailService.UserList()).subscribe(
      response => {
        this._userListDropdown = response;
        this.GetPayrollLineListData();
        if (this._userDropdownSubscription !== null) this._userDropdownSubscription.unsubscribe();
      },
      error => {
        this._snackBarTemplate.snackBarError(this._snackBar, error.error.Message + " " + error.status);
        if (this._userDropdownSubscription !== null) this._userDropdownSubscription.unsubscribe();
      }
    );
    this._payrollModel = this.payrollDetail;
  }

  public GetUIDATEPAYDate() {
    this._payrollModel.PAYDate = this.datePipe.transform(this.UIPAYDate, 'yyyy-MM-dd');
  }

  public async SavePayrollDetail() {
    this.DisableButtons();
    if (this._isDataLoaded == true) {
      this._isDataLoaded = false;
      this._savePayrollDetailSubscription = (await this._payrollDetailService.SavePayroll(this._payrollModel.Id, this._payrollModel)).subscribe(
        response => {
          this.loadComponent(false);
          this._isDataLoaded = true;
          this._snackBarTemplate.snackBarSuccess(this._snackBar, "Save Successfully.");
          if (this._savePayrollDetailSubscription !== null) this._savePayrollDetailSubscription.unsubscribe();
        },
        error => {
          this.loadComponent(false);
          this._isDataLoaded = true;
          this._snackBarTemplate.snackBarError(this._snackBar, error.error.Message + " " + error.status);
          if (this._savePayrollDetailSubscription !== null) this._savePayrollDetailSubscription.unsubscribe();
        }
      );
    }
  }

  public async LockPayrollDetail() {
    this.DisableButtons();
    if (this._isDataLoaded == true) {
      this._isDataLoaded = false;
      this._lockPayrollDetailSubscription = await (await this._payrollDetailService.LockPayroll(this._payrollModel.Id, this._payrollModel)).subscribe(
        response => {
          this.loadComponent(true);
          this._isDataLoaded = true;
          this._snackBarTemplate.snackBarSuccess(this._snackBar, "Lock Successfully.");
          if (this._lockPayrollDetailSubscription !== null) this._lockPayrollDetailSubscription.unsubscribe();
        },
        error => {
          this.loadComponent(false);
          this._isDataLoaded = true;
          this._snackBarTemplate.snackBarError(this._snackBar, error.error.Message + " " + error.status);
          if (this._lockPayrollDetailSubscription !== null) this._lockPayrollDetailSubscription.unsubscribe();
        }
      );
    }
  }

  public async UnlockPayrollDetail() {
    this.DisableButtons();
    if (this._isDataLoaded == true) {
      this._isDataLoaded = false;
      this._unlockPayrollDetailSubscription = await (await this._payrollDetailService.UnlockPayroll(this._payrollModel.Id)).subscribe(
        response => {
          this.loadComponent(false);
          this._isDataLoaded = true;
          this._snackBarTemplate.snackBarSuccess(this._snackBar, "Unlock Successfully.");
          if (this._unlockPayrollDetailSubscription !== null) this._unlockPayrollDetailSubscription.unsubscribe();
        },
        error => {
          this.loadComponent(true);
          this._isDataLoaded = true;
          this._snackBarTemplate.snackBarError(this._snackBar, error.error.Message + " " + error.status);
          if (this._unlockPayrollDetailSubscription !== null) this._unlockPayrollDetailSubscription.unsubscribe();
        }
      );
    }
  }

  private loadComponent(isDisable) {
    this._btnAddPayrollLineDisabled = isDisable;
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
  public grandTotal = {
    PayrollRate: 0,
    TotalDailyPay: 0,
    TotalPremiumPay: 0,
    TotalHolidayPay: 0,
    TotalOvertimePay: 0,
    TotalNightDifferentialPay: 0,
    TotalCOLA: 0,
    TotalAdditionalAllowance: 0,
    TotalLateDeduction: 0,
    TotalUndertimeDeduction: 0,
    Income: 0,
    TotalOtherIncomeNotTaxable: 0,
    TotalOtherIncomeTaxable: 0,
    GrossIncome: 0,
    SSSContribution: 0,
    PHICContribution: 0,
    HDMFContribution: 0,
    IncomeTaxAmount: 0,
    TotalOtherDeduction: 0,
    NetIncome: 0,
    SSSEmployerContribution: 0,
    SSSEC: 0,
    PHICEmployerContribution: 0,
    HDMFEmployerContribution: 0,
    NoOfPremiumPayDays: 0,
    NoOfHolidays: 0,
    NoOfDaysLate: 0,
    NoOfDaysUndertime: 0,
    NoOfDaysWorked: 0,
    NoOfRestdays: 0,
    TotalRestdaysPay: 0,
    TotalPaidLeaveDays: 0,
    TotalPaidLeaveAmount: 0,
    NoOfUnPaidLeaveDays: 0,
    NoOfAbsentDays: 0,
    TotalAbsentAmount: 0,
    OvertimeNumberOfHours: 0
  }

  private async GetPayrollLineListData() {
    this.pageNumber = this._listPayrollLineCollectionView.pageIndex;
    this._listPayrollLineObservableArray = new ObservableArray();
    this._listPayrollLineCollectionView = new CollectionView(this._listPayrollLineObservableArray);
    this._listPayrollLineCollectionView.pageSize = 15;
    this._listPayrollLineCollectionView.trackChanges = true;
    await this._listPayrollLineCollectionView.refresh();
    await this.flexPayrollLine.refresh();

    this._isPayrollLineProgressBarHidden = true;

    this._payrollLineListSubscription = await (await this._payrollDetailService.PayrollLineList(this._payrollModel.Id)).subscribe(
      (response: any) => {
        console.log(response);
        if (response["length"] > 0) {
          this.getGrandTotal(response);
          this._listPayrollLineObservableArray = response;
          this._listPayrollLineCollectionView = new CollectionView(this._listPayrollLineObservableArray);
          this._listPayrollLineCollectionView.pageSize = 15;
          this._listPayrollLineCollectionView.trackChanges = true;
          this._listPayrollLineCollectionView.refresh();
          this.flexPayrollLine.refresh();
        }

        this._listPayrollLineCollectionView.moveToPage(this.pageNumber);
        this._isPayrollLineDataLoaded = true;
        this._isPayrollLineProgressBarHidden = false;

        if (this._payrollLineListSubscription !== null) this._payrollLineListSubscription.unsubscribe();
      },
      error => {
        this._isPayrollLineProgressBarHidden = false;
        this._snackBarTemplate.snackBarError(this._snackBar, error.error.Message + " " + error.status);
        if (this._payrollLineListSubscription !== null) this._payrollLineListSubscription.unsubscribe();
      }
    );
  }

  public getGrandTotal(data: any) {
    this.grandTotal = {
      PayrollRate: 0,
      TotalDailyPay: 0,
      TotalPremiumPay: 0,
      TotalHolidayPay: 0,
      TotalOvertimePay: 0,
      TotalNightDifferentialPay: 0,
      TotalCOLA: 0,
      TotalAdditionalAllowance: 0,
      TotalLateDeduction: 0,
      TotalUndertimeDeduction: 0,
      Income: 0,
      TotalOtherIncomeNotTaxable: 0,
      TotalOtherIncomeTaxable: 0,
      GrossIncome: 0,
      SSSContribution: 0,
      PHICContribution: 0,
      HDMFContribution: 0,
      IncomeTaxAmount: 0,
      TotalOtherDeduction: 0,
      NetIncome: 0,
      SSSEmployerContribution: 0,
      SSSEC: 0,
      PHICEmployerContribution: 0,
      HDMFEmployerContribution: 0,
      NoOfPremiumPayDays: 0,
      NoOfHolidays: 0,
      NoOfDaysLate: 0,
      NoOfDaysUndertime: 0,
      NoOfDaysWorked: 0,
      NoOfRestdays: 0,
      TotalRestdaysPay: 0,
      TotalPaidLeaveDays: 0,
      TotalPaidLeaveAmount: 0,
      NoOfUnPaidLeaveDays: 0,
      NoOfAbsentDays: 0,
      TotalAbsentAmount: 0,
      OvertimeNumberOfHours: 0
    }
    
    for (var i = 0; i < data.length; i++) {
      this.grandTotal.PayrollRate += data[i].PayrollRate;
      this.grandTotal.TotalDailyPay += data[i].TotalDailyPay;
      this.grandTotal.TotalPremiumPay += data[i].TotalPremiumPay;
      this.grandTotal.TotalHolidayPay += data[i].TotalHolidayPay;
      this.grandTotal.TotalOvertimePay += data[i].TotalOvertimePay;
      this.grandTotal.TotalNightDifferentialPay += data[i].TotalNightDifferentialPay;
      this.grandTotal.TotalCOLA += data[i].TotalCOLA;
      this.grandTotal.TotalAdditionalAllowance += data[i].TotalAdditionalAllowance;
      this.grandTotal.TotalLateDeduction += data[i].TotalLateDeduction;
      this.grandTotal.TotalUndertimeDeduction += data[i].TotalUndertimeDeduction;
      this.grandTotal.Income += data[i].Income;
      this.grandTotal.TotalOtherIncomeNotTaxable += data[i].TotalOtherIncomeNotTaxable;
      this.grandTotal.TotalOtherIncomeTaxable += data[i].TotalOtherIncomeTaxable;
      this.grandTotal.GrossIncome += data[i].GrossIncome;
      this.grandTotal.SSSContribution += data[i].SSSContribution;
      this.grandTotal.PHICContribution += data[i].PHICContribution;
      this.grandTotal.HDMFContribution += data[i].HDMFContribution;
      this.grandTotal.IncomeTaxAmount += data[i].IncomeTaxAmount;
      this.grandTotal.TotalOtherDeduction += data[i].TotalOtherDeduction;
      this.grandTotal.NetIncome += data[i].NetIncome;
      this.grandTotal.SSSEmployerContribution += data[i].SSSEmployerContribution;
      this.grandTotal.SSSEC += data[i].SSSEC;
      this.grandTotal.PHICEmployerContribution += data[i].PHICEmployerContribution;
      this.grandTotal.HDMFEmployerContribution += data[i].HDMFEmployerContribution;
      this.grandTotal.NoOfPremiumPayDays += data[i].NoOfPremiumPayDays;
      this.grandTotal.NoOfHolidays += data[i].NoOfHolidays;
      this.grandTotal.NoOfDaysLate += data[i].NoOfDaysLate;
      this.grandTotal.NoOfDaysUndertime += data[i].NoOfDaysUndertime;
      this.grandTotal.NoOfDaysWorked += data[i].NoOfDaysWorked;
      this.grandTotal.NoOfRestdays += data[i].NoOfRestdays;
      this.grandTotal.TotalRestdaysPay += data[i].TotalRestdaysPay;
      this.grandTotal.TotalPaidLeaveDays += data[i].TotalPaidLeaveDays;
      this.grandTotal.TotalPaidLeaveAmount += data[i].TotalPaidLeaveAmount;
      this.grandTotal.NoOfUnPaidLeaveDays += data[i].NoOfUnPaidLeaveDays;
      this.grandTotal.NoOfAbsentDays += data[i].NoOfAbsentDays;
      this.grandTotal.TotalAbsentAmount += data[i].TotalAbsentAmount;
      this.grandTotal.OvertimeNumberOfHours += data[i].OvertimeNumberOfHours;
    }
    console.log(this.grandTotal);
  }



  gridClick(s, e) {
    if (wjcCore.hasClass(e.target, 'button-edit')) {
      if (this._userRights.CanEdit) {
        this.EditPayrollLine();
      }
    }

    if (wjcCore.hasClass(e.target, 'button-delete')) {
      if (this._userRights.CanDelete) {
        this.ComfirmDeletePayrollLine();
      }
    }
  }

  public AddPayrollLine() {
    this.DetailPayrollLine(this._payrollLineModel, "Add Payroll Line");
  }

  public EditPayrollLine() {
    let currentPayrollLine = this._listPayrollLineCollectionView.currentItem;

    let _payrollLineModel: PayrollLineModel = {
      Id: currentPayrollLine.Id,
      PAYId: currentPayrollLine.PAYId,
      EmployeeId: currentPayrollLine.EmployeeId,
      Employee: currentPayrollLine.Employee,
      PayrollRate: this.RemoveComma(currentPayrollLine.PayrollRate),
      TotalDailyPay: this.RemoveComma(currentPayrollLine.TotalDailyPay),
      TotalPremiumPay: this.RemoveComma(currentPayrollLine.TotalPremiumPay),
      TotalHolidayPay: this.RemoveComma(currentPayrollLine.TotalHolidayPay),
      TotalOvertimePay: this.RemoveComma(currentPayrollLine.TotalOvertimePay),
      TotalNightDifferentialPay: this.RemoveComma(currentPayrollLine.TotalNightDifferentialPay),
      TotalCOLA: this.RemoveComma(currentPayrollLine.TotalCOLA),
      TotalAdditionalAllowance: this.RemoveComma(currentPayrollLine.TotalAdditionalAllowance),
      TotalLateDeduction: this.RemoveComma(currentPayrollLine.TotalLateDeduction),
      TotalUndertimeDeduction: this.RemoveComma(currentPayrollLine.TotalUndertimeDeduction),
      Income: this.RemoveComma(currentPayrollLine.Income),
      TotalOtherIncomeNotTaxable: this.RemoveComma(currentPayrollLine.TotalOtherIncomeNotTaxable),
      TotalOtherIncomeTaxable: this.RemoveComma(currentPayrollLine.TotalOtherIncomeTaxable),
      GrossIncome: this.RemoveComma(currentPayrollLine.GrossIncome),
      SSSContribution: this.RemoveComma(currentPayrollLine.SSSContribution),
      PHICContribution: this.RemoveComma(currentPayrollLine.PHICContribution),
      HDMFContribution: this.RemoveComma(currentPayrollLine.HDMFContribution),
      IncomeTaxAmount: this.RemoveComma(currentPayrollLine.IncomeTaxAmount),
      TotalOtherDeduction: this.RemoveComma(currentPayrollLine.TotalOtherDeduction),
      NetIncome: this.RemoveComma(currentPayrollLine.NetIncome),
      SSSEmployerContribution: this.RemoveComma(currentPayrollLine.SSSEmployerContribution),
      SSSEC: this.RemoveComma(currentPayrollLine.SSSEC),
      PHICEmployerContribution: this.RemoveComma(currentPayrollLine.PHICEmployerContribution),
      HDMFEmployerContribution: this.RemoveComma(currentPayrollLine.HDMFEmployerContribution)
    }
    console.log(_payrollLineModel.TotalLateDeduction);
    this.DetailPayrollLine(_payrollLineModel, "Edit Payroll Line Detail");
  }

  public async DownloadDTR() {
    if (this._isDataLoaded == true) {
      this._isPayrollLineProgressBarHidden = true;
      this._isDataLoaded = false;
      this._downlloadDTRPayrollLineSubscription = await (await this._payrollDetailService.DownloadDTRPayrollLines(this._payrollLineModel.PAYId)).subscribe(
        response => {
          this.GetPayrollLineListData();
          this._isDataLoaded = true;
          this._isPayrollLineProgressBarHidden = false;
          this._snackBarTemplate.snackBarSuccess(this._snackBar, "Download Successfully");
          if (this._downlloadDTRPayrollLineSubscription != null) this._downlloadDTRPayrollLineSubscription.unsubscribe();
        },
        error => {
          this._isDataLoaded = true;
          this._isPayrollLineProgressBarHidden = false;
          this._snackBarTemplate.snackBarError(this._snackBar, error.error + " " + " Status Code: " + error.status);
          if (this._downlloadDTRPayrollLineSubscription != null) this._downlloadDTRPayrollLineSubscription.unsubscribe();
        }
      );
    }
  }

  public RemoveComma(value: string): string {
    return value.toString().replace(',', '');
  }

  public async DeletePayrollLine() {
    let currentPayrollLine = this._listPayrollLineCollectionView.currentItem;
    this._isProgressBarHidden = true;

    if (this._isPayrollLineDataLoaded == true) {
      this._isPayrollLineDataLoaded = false;
      this._deletePayrollLineSubscription = await (await this._payrollDetailService.DeletePayrollLine(currentPayrollLine.Id)).subscribe(
        response => {
          this._snackBarTemplate.snackBarSuccess(this._snackBar, "Delete Successfully");
          this.GetPayrollLineListData();
          this._isProgressBarHidden = false;
          this._isPayrollLineDataLoaded = true;
        },
        error => {
          this._isPayrollLineDataLoaded = true;
          this._isProgressBarHidden = false;
          this._snackBarTemplate.snackBarError(this._snackBar, error.error + " " + error.status);
          if (this._deletePayrollLineSubscription != null) this._deletePayrollLineSubscription.unsubscribe();
        }
      );
    }
  }

  public ComfirmDeletePayrollLine(): void {
    let currentPayrollLine = this._listPayrollLineCollectionView.currentItem;
    const matDialogRef = this._matDialogRef.open(ComfirmMassageDialogComponent, {
      width: '500px',
      data: {
        objDialogTitle: "Delete PayrollLine",
        objComfirmationMessage: ` Delete ${currentPayrollLine.Employee} Payroll?`,
      },
      disableClose: true
    });

    matDialogRef.afterClosed().subscribe(result => {
      if (result.message == "Yes") {
        this.DeletePayrollLine();
      }
    });
  }

  public DetailPayrollLine(objPayrollLine: PayrollLineModel, eventTitle: string) {
    if (this._payrollLineListSubscription !== null) this._payrollLineListSubscription.unsubscribe();

    const matDialogRef = this._matDialogRef.open(PayrollLineDetailDialogComponent, {
      width: '1300px',
      data: {
        objDialogTitle: eventTitle,
        objPayrollLine: objPayrollLine,
        objPayrollGroup: this._payrollModel.PayrollGroup
      },
      disableClose: true
    });

    matDialogRef.afterClosed().subscribe((result: any) => {
      if (result.event !== 'Close') {
        this.GetPayrollLineListData();
      }
    });
  }

  ngOnDestroy() {
  }

  public async UpdatePayrollLine(id: number, objPayrollLine: PayrollLineModel) {
    if (this._isDataLoaded == true) {
      this._isDataLoaded = false;
      this._savePayrollLineSubscription = await (await this._payrollDetailService.UpdatePayrollLine(id, objPayrollLine)).subscribe(
        response => {
          this._isDataLoaded = true;
          this._snackBarTemplate.snackBarSuccess(this._snackBar, "Update Successfully");
          this.GetPayrollLineListData();
          if (this._savePayrollLineSubscription != null) this._savePayrollLineSubscription.unsubscribe();
        },
        error => {
          this._isDataLoaded = true;
          this._snackBarTemplate.snackBarError(this._snackBar, error.error + " " + " Status Code: " + error.status);
          if (this._savePayrollLineSubscription != null) this._savePayrollLineSubscription.unsubscribe();
        }
      );
    }
  }

  public ComfirmComputePayroll(): void {
    const userRegistrationlDialogRef = this._matDialogRef.open(ComfirmMassageDialogComponent, {
      width: '500px',
      data: {
        objDialogTitle: "Compute",
        objComfirmationMessage: `Compute Payroll?`,
      },
      disableClose: true
    });

    userRegistrationlDialogRef.afterClosed().subscribe(result => {
      if (result.message == "Yes") {
        this.DownloadDTR();
      }
    });
  }

  public btnPrintWorkSheetClick(): void {
    const userRegistrationlDialogRef = this._matDialogRef.open(PdfDialogComponent, {
      width: '1000px',
      data: {
        objDialogTitle: "Payroll",
        objData: { EmployeeId: 0, TransactionId: this._payrollModel.Id }
      },
      disableClose: true
    });

    userRegistrationlDialogRef.afterClosed().subscribe(result => {
      if (result.message == "Yes") {
      }
    });
  }


  selectedCheckedByUser(event: MatSelectChange) {
    const selectedData = {
      text: (event.source.selected as MatOption).viewValue,
      value: event.source.value
    };

    this._payrollModel.CheckedByUserId = event.source.value;
    this._payrollModel.CheckedByUser = (event.source.selected as MatOption).viewValue;
  }

  selectedApprovedByUser(event: MatSelectChange) {
    const selectedData = {
      text: (event.source.selected as MatOption).viewValue,
      value: event.source.value
    };

    this._payrollModel.ApprovedByUserId = event.source.value;
    this._payrollModel.ApprovedByUser = (event.source.selected as MatOption).viewValue;
  }

  public btnCSVClick() {
    this._sharedService.generateCSVPayrollLine(this._listPayrollLineCollectionView, this.grandTotal, "Payroll List", "payroll.csv");
    console.log(this._listPayrollLineCollectionView);
  }

  public PickEmployeeDownload() {
    const matDialogRef = this._matDialogRef.open(EmployeeListPickDialogComponent, {
      width: '900px',
      height: '500',
      data: {
        objDialogTitle: "Employee List",
        objPayrollGroup: this._payrollModel.PayrollGroup
      },
      disableClose: true
    });

    matDialogRef.afterClosed().subscribe((data: any) => {
      console.log(data);
      if (data.event != "Close") {
        this.DownloadEmployeeDTR(data.employee.Id);
      }
    });
  }

  public async DownloadEmployeeDTR(employeeId: number) {
    if (this._isDataLoaded == true) {
      this._isPayrollLineProgressBarHidden = true;
      this._isDataLoaded = false;
      this._downlloadDTRPayrollLineSubscription = (await this._payrollDetailService.DownloadEmployeePayrollLines(employeeId, this._payrollLineModel.PAYId)).subscribe(
        response => {
          this.GetPayrollLineListData();
          this._isDataLoaded = true;
          this._isPayrollLineProgressBarHidden = false;
          this._snackBarTemplate.snackBarSuccess(this._snackBar, "Download Successfully");
          if (this._downlloadDTRPayrollLineSubscription != null) this._downlloadDTRPayrollLineSubscription.unsubscribe();
        },
        error => {
          this._isDataLoaded = true;
          this._isPayrollLineProgressBarHidden = false;
          this._snackBarTemplate.snackBarError(this._snackBar, error.error + " " + " Status Code: " + error.status);
          if (this._downlloadDTRPayrollLineSubscription != null) this._downlloadDTRPayrollLineSubscription.unsubscribe();
        }
      );
    }
  }

  async ngOnInit() {
    await this.Get_userRights();
  }
}
