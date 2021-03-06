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
import { DatePipe, DecimalPipe } from '@angular/common';

import { PayrollOtherIncomeModel } from './../payroll-other-income.model';
import { PayrollOtherIncomeLineModel } from './../payroll-other-income-line.model';
import { PayrollOtherIncomeDetailService } from './../payroll-other-income-detail.service';
import { PayrollOtherIncomeLineDialogComponent } from '../payroll-other-income-line-dialog/payroll-other-income-line-dialog.component';
import { SoftwareSecurityService, UserModule } from '../../software-security/software-security.service';
import { ComfirmMassageDialogComponent } from '../../shared/comfirm-massage-dialog/comfirm-massage-dialog.component';
import { AddPayrollOtherIncomeDialogComponent } from '../add-payroll-other-income-dialog/add-payroll-other-income-dialog.component';

@Component({
  selector: 'app-payroll-other-income-detail',
  templateUrl: './payroll-other-income-detail.component.html',
  styleUrls: ['./payroll-other-income-detail.component.css']
})
export class PayrollOtherIncomeDetailComponent implements OnInit {

  constructor(
    private _payrollOtherIncomeDetailService: PayrollOtherIncomeDetailService,
    private _activatedRoute: ActivatedRoute,
    private _snackBar: MatSnackBar,
    private _snackBarTemplate: SnackBarTemplate,
    public _matDialog: MatDialog,
    private datePipe: DatePipe,
    private decimalPipe: DecimalPipe,
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
    this._userRightsSubscription = await (await this._softwareSecurityService.PageModuleRights("Payroll Other Income Detail")).subscribe(
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

    await this.UserListData();
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

  public _changePayrollOtherIncomeDetailSubscription: any;
  public _savePayrollOtherIncomeDetailSubscription: any;
  public _lockPayrollOtherIncomeDetailSubscription: any;
  public _unlockPayrollOtherIncomeDetailSubscription: any;

  public totalIncomeAmount: string = '0.00';

  public _payrollOtherIncomeModel: PayrollOtherIncomeModel = {
    Id: 0,
    PINumber: '',
    PIDate: new Date(),
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

  public _payrollOtherIncomeLineModel: PayrollOtherIncomeLineModel = {
    Id: 0,
    PIId: 0,
    EmployeeId: 0,
    Employee: '',
    OtherIncomeId: 0,
    OtherIncome: '',
    Amount: '0',
    Particulars: 'NA'
  }

  // Class properties
  public _listPayrollOtherIncomeLineObservableArray: ObservableArray = new ObservableArray();
  public _listPayrollOtherIncomeLineCollectionView: CollectionView = new CollectionView(this._listPayrollOtherIncomeLineObservableArray);
  public _listPageIndex: number = 15;

  @ViewChild('flexPayrollOtherIncomeLine') flexPayrollOtherIncomeLine: wjcGrid.FlexGrid;

  public _isPayrollOtherIncomeLineProgressBarHidden = false;
  public _isPayrollOtherIncomeLineDataLoaded: boolean = false;

  private _PayrollOtherIncomeLineListSubscription: any;
  private _savePayrollOtherIncomeLineSubscription: any;
  private _updatePayrollOtherIncomeLineSubscription: any;
  private _deletePayrollOtherIncomeLineSubscription: any;

  public _btnAddPayrollOtherIncomeLineDisabled: boolean = false;

  public pageNumber: number = 0;

  private async UserListData() {
    this._userDropdownSubscription = await (await this._payrollOtherIncomeDetailService.UserList()).subscribe(
      response => {
        this._userListDropdown = response;
        this.GetPayrollOtherIncomeDetail();
        if (this._userDropdownSubscription !== null) this._userDropdownSubscription.unsubscribe();
      },
      error => {
        this._snackBarTemplate.snackBarError(this._snackBar, error.error.Message + " " + error.status);
        if (this._userDropdownSubscription !== null) this._userDropdownSubscription.unsubscribe();
      }
    );
  }

  private async GetPayrollOtherIncomeDetail() {
    let id = 0;
    this._activatedRoute.params.subscribe(params => { id = params["id"]; });
    this._isComponentsShown = true;
    this._isProgressBarHidden = true;

    this.DisableButtons();
    this._changePayrollOtherIncomeDetailSubscription = await (await this._payrollOtherIncomeDetailService.PayrollOtherIncomeDetail(id)).subscribe(
      (response: any) => {
        let result = response;
        if (result != null) {
          this._payrollOtherIncomeModel = result;
          this._payrollOtherIncomeModel.PIDate = new Date(result["PIDate"]);
          this._payrollOtherIncomeLineModel.PIId = result["Id"];
        }
        this.loadComponent(result["IsLocked"]);
        this.GetPayrollOtherIncomeLineListData();
        this._isDataLoaded = true;
        this._isProgressBarHidden = false;
        this._isComponentsShown = false;
        if (this._changePayrollOtherIncomeDetailSubscription !== null) this._changePayrollOtherIncomeDetailSubscription.unsubscribe();
      },
      error => {
        this._snackBarTemplate.snackBarError(this._snackBar, error.error.Message + " " + error.status);
        if (this._changePayrollOtherIncomeDetailSubscription !== null) this._changePayrollOtherIncomeDetailSubscription.unsubscribe();
      }
    );
  }

  public DateFormatSelectedDate() {
    this._payrollOtherIncomeModel.PIDate = new Date(this.datePipe.transform(this._payrollOtherIncomeModel.PIDate, 'yyyy-MM-dd'));
  }

  public async SavePayrollOtherIncomeDetail() {
    this.DisableButtons();
    if (this._isDataLoaded == true) {
      this._isDataLoaded = false;
      this.DateFormatSelectedDate();
      this._savePayrollOtherIncomeDetailSubscription = (await this._payrollOtherIncomeDetailService.SavePayrollOtherIncome(this._payrollOtherIncomeModel.Id, this._payrollOtherIncomeModel)).subscribe(
        response => {
          this.loadComponent(false);
          this._isDataLoaded = true;
          this._snackBarTemplate.snackBarSuccess(this._snackBar, "Save Successfully.");
          if (this._savePayrollOtherIncomeDetailSubscription !== null) this._savePayrollOtherIncomeDetailSubscription.unsubscribe();
        },
        error => {
          this.loadComponent(false);
          this._isDataLoaded = true;
          this._snackBarTemplate.snackBarError(this._snackBar, error.error.Message + " " + error.status);
          if (this._savePayrollOtherIncomeDetailSubscription !== null) this._savePayrollOtherIncomeDetailSubscription.unsubscribe();
        }
      );
    }
  }

  public async LockPayrollOtherIncomeDetail() {
    this.DisableButtons();
    if (this._isDataLoaded == true) {
      this._isDataLoaded = false;
      this.DateFormatSelectedDate();
      this._lockPayrollOtherIncomeDetailSubscription = await (await this._payrollOtherIncomeDetailService.LockPayrollOtherIncome(this._payrollOtherIncomeModel.Id, this._payrollOtherIncomeModel)).subscribe(
        response => {
          this.loadComponent(true);
          this._isDataLoaded = true;
          this._snackBarTemplate.snackBarSuccess(this._snackBar, "Lock Successfully.");
          if (this._lockPayrollOtherIncomeDetailSubscription !== null) this._lockPayrollOtherIncomeDetailSubscription.unsubscribe();
        },
        error => {
          this.loadComponent(false);
          this._isDataLoaded = true;
          this._snackBarTemplate.snackBarError(this._snackBar, error.error.Message + " " + error.status);
          if (this._lockPayrollOtherIncomeDetailSubscription !== null) this._lockPayrollOtherIncomeDetailSubscription.unsubscribe();
        }
      );
    }
  }

  public async UnlockPayrollOtherIncomeDetail() {
    this.DisableButtons();
    if (this._isDataLoaded == true) {
      this._isDataLoaded = false;
      this._unlockPayrollOtherIncomeDetailSubscription = await (await this._payrollOtherIncomeDetailService.UnlockPayrollOtherIncome(this._payrollOtherIncomeModel.Id)).subscribe(
        response => {
          this.loadComponent(false);
          this._isDataLoaded = true;
          this._snackBarTemplate.snackBarSuccess(this._snackBar, "Unlock Successfully.");
          if (this._unlockPayrollOtherIncomeDetailSubscription !== null) this._unlockPayrollOtherIncomeDetailSubscription.unsubscribe();
        },
        error => {
          this.loadComponent(true);
          this._isDataLoaded = true;
          this._snackBarTemplate.snackBarError(this._snackBar, error.error.Message + " " + error.status);
          if (this._unlockPayrollOtherIncomeDetailSubscription !== null) this._unlockPayrollOtherIncomeDetailSubscription.unsubscribe();
        }
      );
    }
  }

  private loadComponent(isDisable) {
    this._btnAddPayrollOtherIncomeLineDisabled = isDisable;
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

  private async GetPayrollOtherIncomeLineListData() {
    this.pageNumber = this._listPayrollOtherIncomeLineCollectionView.pageIndex;
    this._listPayrollOtherIncomeLineObservableArray = new ObservableArray();
    this._listPayrollOtherIncomeLineCollectionView = new CollectionView(this._listPayrollOtherIncomeLineObservableArray);
    this._listPayrollOtherIncomeLineCollectionView.pageSize = 15;
    this._listPayrollOtherIncomeLineCollectionView.trackChanges = true;
    await this._listPayrollOtherIncomeLineCollectionView.refresh();
    await this.flexPayrollOtherIncomeLine.refresh();

    this._isPayrollOtherIncomeLineProgressBarHidden = true;

    this._PayrollOtherIncomeLineListSubscription = await (await this._payrollOtherIncomeDetailService.PayrollOtherIncomeLineList(this._payrollOtherIncomeModel.Id)).subscribe(
      (response: any) => {

        if (response["length"] > 0) {
          this.totalIncomeAmount = this.decimalPipe.transform(this.Sum(response), "1.2-2");
          this._listPayrollOtherIncomeLineObservableArray = response;
          this._listPayrollOtherIncomeLineCollectionView = new CollectionView(this._listPayrollOtherIncomeLineObservableArray);
          this._listPayrollOtherIncomeLineCollectionView.pageSize = 15;
          this._listPayrollOtherIncomeLineCollectionView.trackChanges = true;
          this._listPayrollOtherIncomeLineCollectionView.refresh();
          this.flexPayrollOtherIncomeLine.refresh();
        }
        this._listPayrollOtherIncomeLineCollectionView.moveToPage(this.pageNumber);
        this._isPayrollOtherIncomeLineDataLoaded = true;
        this._isPayrollOtherIncomeLineProgressBarHidden = false;
        if (this._PayrollOtherIncomeLineListSubscription !== null) this._PayrollOtherIncomeLineListSubscription.unsubscribe();
      },
      error => {
        this._isPayrollOtherIncomeLineProgressBarHidden = false;
        this._snackBarTemplate.snackBarError(this._snackBar, error.error.Message + " " + error.status);
        if (this._PayrollOtherIncomeLineListSubscription !== null) this._PayrollOtherIncomeLineListSubscription.unsubscribe();
      }
    );
  }

  gridClick(s, e) {
    if (wjcCore.hasClass(e.target, 'button-edit')) {
      if (this._userRights.CanEdit) {
        this.EditPayrollOtherIncomeLine();
      }

    }

    if (wjcCore.hasClass(e.target, 'button-delete')) {
      if (this._userRights.CanDelete) {
        this.ComfirmDeletePayrollOtherIncomeLine();
      }
    }
  }

  private Sum(data: any[]) {
    var total = 0
    data.forEach(element => {
      total += element.Amount;
    });
    return total;
  }

  public AddPayrollOtherIncomeLine() {

    const matDialogRef = this._matDialog.open(AddPayrollOtherIncomeDialogComponent, {
      width: '900px',
      data: {
        objDialogTitle: "Add Payroll Other Income Lines",
        objPayrollGroup: this._payrollOtherIncomeModel.PayrollGroup,
        objPayrollOtherIncomeLine: this._payrollOtherIncomeLineModel,
      },
      disableClose: true
    });

    matDialogRef.afterClosed().subscribe((data: any) => {
      if (data != null) {
        this.GetPayrollOtherIncomeLineListData();
      }
    });
  }

  public EditPayrollOtherIncomeLine() {
    let currentPayrollOtherIncomeLine = this._listPayrollOtherIncomeLineCollectionView.currentItem;
    const matDialogRef = this._matDialog.open(PayrollOtherIncomeLineDialogComponent, {
      width: '900px',
      data: {
        objDialogTitle: "Edit Payroll Other Income Line Detail",
        objPayrollGroup: this._payrollOtherIncomeModel.PayrollGroup,
        objPayrollOtherIncomeLine: currentPayrollOtherIncomeLine,
      },
      disableClose: true
    });

    matDialogRef.afterClosed().subscribe((result: any) => {
      if (result.event === "Edit Payroll Other Income Line Detail") {

        this._isPayrollOtherIncomeLineDataLoaded = true;

        this.UpdatePayrollOtherIncomeLine(result.data.Id, result.data);
      }
    });
  }

  public async DeletePayrollOtherIncomeLine() {
    let currentPayrollOtherIncomeLine = this._listPayrollOtherIncomeLineCollectionView.currentItem;
    this._isPayrollOtherIncomeLineProgressBarHidden = true;

    if (this._isPayrollOtherIncomeLineDataLoaded == true) {
      this._isPayrollOtherIncomeLineDataLoaded = false;
      this._deletePayrollOtherIncomeLineSubscription = await (await this._payrollOtherIncomeDetailService.DeletePayrollOtherIncomeLine(currentPayrollOtherIncomeLine.Id)).subscribe(
        response => {
          this._snackBarTemplate.snackBarSuccess(this._snackBar, "Delete Successfully");
          this.GetPayrollOtherIncomeLineListData();
          this._isPayrollOtherIncomeLineProgressBarHidden = false;
          this._isPayrollOtherIncomeLineDataLoaded = true;
        },
        error => {
          this._isPayrollOtherIncomeLineDataLoaded = true;
          this._isPayrollOtherIncomeLineProgressBarHidden = false;
          this._snackBarTemplate.snackBarError(this._snackBar, error.error + " " + error.status);
          if (this._deletePayrollOtherIncomeLineSubscription != null) this._deletePayrollOtherIncomeLineSubscription.unsubscribe();
        }
      );
    }
  }

  public ComfirmDeletePayrollOtherIncomeLine(): void {
    let currentPayrollOtherIncomeLine = this._listPayrollOtherIncomeLineCollectionView.currentItem;
    const matDialogRef = this._matDialog.open(ComfirmMassageDialogComponent, {
      width: '500px',
      data: {
        objDialogTitle: "",
        objComfirmationMessage: ` Delete ${currentPayrollOtherIncomeLine.Employee}?`,
      },
      disableClose: true
    });

    matDialogRef.afterClosed().subscribe(result => {
      if (result.message == "Yes") {
        this.DeletePayrollOtherIncomeLine();
      }
    });
  }

  public async UpdatePayrollOtherIncomeLine(id: number, objPayrollOtherIncomeLine: PayrollOtherIncomeLineModel) {
    this._isPayrollOtherIncomeLineProgressBarHidden = true;

    if (this._isPayrollOtherIncomeLineDataLoaded == true) {
      this._isPayrollOtherIncomeLineDataLoaded = false;
      this._updatePayrollOtherIncomeLineSubscription = await (await this._payrollOtherIncomeDetailService.UpdatePayrollOtherIncomeLine(id, objPayrollOtherIncomeLine)).subscribe(
        response => {
          this._isPayrollOtherIncomeLineDataLoaded = true;
          this._isPayrollOtherIncomeLineProgressBarHidden = false;

          this._snackBarTemplate.snackBarSuccess(this._snackBar, "Update Successfully");
          this.GetPayrollOtherIncomeLineListData();
          if (this._updatePayrollOtherIncomeLineSubscription != null) this._updatePayrollOtherIncomeLineSubscription.unsubscribe();
        },
        error => {
          this._isPayrollOtherIncomeLineDataLoaded = true;
          this._isPayrollOtherIncomeLineProgressBarHidden = false;
          this._snackBarTemplate.snackBarError(this._snackBar, error.error + " " + " Status Code: " + error.status);
          if (this._updatePayrollOtherIncomeLineSubscription != null) this._updatePayrollOtherIncomeLineSubscription.unsubscribe();
        }
      );
    }
  }

  selectedPreparedByUser(event: MatSelectChange) {
    const selectedData = {
      text: (event.source.selected as MatOption).viewValue,
      value: event.source.value
    };

    this._payrollOtherIncomeModel.PreparedByUserId = event.source.value;
    this._payrollOtherIncomeModel.PreparedByUser = (event.source.selected as MatOption).viewValue;
  }

  selectedCheckedByUser(event: MatSelectChange) {
    const selectedData = {
      text: (event.source.selected as MatOption).viewValue,
      value: event.source.value
    };

    this._payrollOtherIncomeModel.CheckedByUserId = event.source.value;
    this._payrollOtherIncomeModel.CheckedByUser = (event.source.selected as MatOption).viewValue;
  }

  selectedApprovedByUser(event: MatSelectChange) {
    const selectedData = {
      text: (event.source.selected as MatOption).viewValue,
      value: event.source.value
    };

    this._payrollOtherIncomeModel.ApprovedByUserId = event.source.value;
    this._payrollOtherIncomeModel.ApprovedByUser = (event.source.selected as MatOption).viewValue;
  }

  public btnCSVClick(): void {
    var fileName = "";

    fileName = "payroll-other-income.csv";

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

    data = 'Change Payroll Other Income' + '\r\n\n';
    collection = this._listPayrollOtherIncomeLineCollectionView;
    fileName = "payroll-other-income.csv";

    if (data != "") {
      var label = '"' + 'ID' + '",'
        + '"' + 'PINumber' + '",'
        + '"' + 'PIDate' + '",'
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
          var row = '"' + this._payrollOtherIncomeModel.Id + '",'
            + '"' + this._payrollOtherIncomeModel.PINumber + '",'
            + '"' + this._payrollOtherIncomeModel.PIDate + '",'
            + '"' + this._payrollOtherIncomeModel.PayrollGroup + '",'
            + '"' + this._payrollOtherIncomeModel.Year + '",'
            + '"' + this._payrollOtherIncomeModel.Remarks + '",'
            + '"' + this._payrollOtherIncomeModel.PreparedByUser + '",'
            + '"' + this._payrollOtherIncomeModel.CheckedByUser + '",'
            + '"' + this._payrollOtherIncomeModel.ApprovedByUser + '",';

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

  ngOnDestroy() {
  }
}
