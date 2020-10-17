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

import { PayrollOtherDeductionModel } from './../payroll-other-deduction.model';
import { PayrollOtherDeductionLineModel } from './../payroll-other-deduction-line.model';
import { PayrollOtherDeductionDetailService } from './../payroll-other-deduction-detail.service'
import { PayrollOtherDeductionLineDialogComponent } from '../payroll-other-deduction-line-dialog/payroll-other-deduction-line-dialog.component';
import { SoftwareSecurityService, UserModule } from '../../software-security/software-security.service';
import { ComfirmMassageDialogComponent } from '../../shared/comfirm-massage-dialog/comfirm-massage-dialog.component';

@Component({
  selector: 'app-payroll-other-deduction-detail',
  templateUrl: './payroll-other-deduction-detail.component.html',
  styleUrls: ['./payroll-other-deduction-detail.component.css']
})
export class PayrollOtherDeductionDetailComponent implements OnInit {

  constructor(
    private _payrollOtherDeductionDetailService: PayrollOtherDeductionDetailService,
    private _activatedRoute: ActivatedRoute,
    private _snackBar: MatSnackBar,
    private _snackBarTemplate: SnackBarTemplate,
    public _matDialog: MatDialog,
    private datePipe: DatePipe,
    private decimalPipe: DecimalPipe,
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
    this._userRightsSubscription = await (await this._softwareSecurityService.PageModuleRights("Payroll Other Deduction Detail")).subscribe(
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

  async ngOnInit() {
    await this.Get_userRights();
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

  public _changePayrollOtherDeductionDetailSubscription: any;
  public _savePayrollOtherDeductionDetailSubscription: any;
  public _lockPayrollOtherDeductionDetailSubscription: any;
  public _unlockPayrollOtherDeductionDetailSubscription: any;

  public totalDeductionAmount: string = '0.00';

  public _payrollOtherDeductionModel: PayrollOtherDeductionModel = {
    Id: 0,
    PDNumber: '',
    PDDate: '',
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

  public UIDPDDate = new Date();

  public _payrollOtherDeductionLineModel: PayrollOtherDeductionLineModel = {
    Id: 0,
    PDId: 0,
    EmployeeId: 0,
    Employee: '',
    OtherDeductionId: 0,
    OtherDeduction: '',
    LNId: 0,
    Loan: '',
    Amount: '0',
    Particulars: 'NA'
  }

  // Class properties
  public _listPayrollOtherDeductionLineObservableArray: ObservableArray = new ObservableArray();
  public _listPayrollOtherDeductionLineCollectionView: CollectionView = new CollectionView(this._listPayrollOtherDeductionLineObservableArray);
  public _listPageIndex: number = 15;

  @ViewChild('flexPayrollOtherDeductionLine') flexPayrollOtherDeductionLine: wjcGrid.FlexGrid;

  public _isPayrollOtherDeductionLineProgressBarHidden = false;
  public _isPayrollOtherDeductionLineDataLoaded: boolean = false;

  private _PayrollOtherDeductionLineListSubscription: any;
  private _savePayrollOtherDeductionLineSubscription: any;
  private _updatePayrollOtherDeductionLineSubscription: any;
  private _deletePayrollOtherDeductionLineSubscription: any;

  public _btnAddPayrollOtherDeductionLineDisabled: boolean = false;

  private async PayrollGroupListData() {
    this._payrollGroupDropdownSubscription = (await this._payrollOtherDeductionDetailService.PayrollGroupList()).subscribe(
      response => {
        this._payrollGroupListDropdown = response;
        this._payrollOtherDeductionLineModel = this._payrollGroupListDropdown[0].Id;
        this.UserListData();
        if (this._payrollGroupDropdownSubscription !== null) this._payrollGroupDropdownSubscription.unsubscribe();
      },
      error => {
        this._snackBarTemplate.snackBarError(this._snackBar, error.error.Message + " " + error.status);
        if (this._payrollGroupDropdownSubscription !== null) this._payrollGroupDropdownSubscription.unsubscribe();
      }
    );
  }

  private async UserListData() {
    this._userDropdownSubscription = await (await this._payrollOtherDeductionDetailService.UserList()).subscribe(
      response => {
        this._userListDropdown = response;
        this.GetPayrollOtherDeductionDetail();
        if (this._userDropdownSubscription !== null) this._userDropdownSubscription.unsubscribe();
      },
      error => {
        this._snackBarTemplate.snackBarError(this._snackBar, error.error.Message + " " + error.status);
        if (this._userDropdownSubscription !== null) this._userDropdownSubscription.unsubscribe();
      }
    );
  }

  private async GetPayrollOtherDeductionDetail() {
    let id = 0;
    this._activatedRoute.params.subscribe(params => { id = params["id"]; });
    this._isComponentsShown = true;
    this._isProgressBarHidden = true;

    this.DisableButtons();
    this._changePayrollOtherDeductionDetailSubscription = await (await this._payrollOtherDeductionDetailService.PayrollOtherDeductionDetail(id)).subscribe(
      (response: any) => {
        let result = response;
        if (result != null) {
          this._payrollOtherDeductionModel = result;
          this.UIDPDDate = new Date(result["PDDate"]);
          this._payrollOtherDeductionLineModel.PDId = result["Id"];
        }
        this.loadComponent(result["IsLocked"]);
        this.GetPayrollOtherDeductionLineListData();
        this._isDataLoaded = true;
        this._isProgressBarHidden = false;
        this._isComponentsShown = false;
        if (this._changePayrollOtherDeductionDetailSubscription !== null) this._changePayrollOtherDeductionDetailSubscription.unsubscribe();
      },
      error => {
        this._snackBarTemplate.snackBarError(this._snackBar, error.error.Message + " " + error.status);
        if (this._changePayrollOtherDeductionDetailSubscription !== null) this._changePayrollOtherDeductionDetailSubscription.unsubscribe();
      }
    );
  }

  public GetUIDATEPDDate() {
    this._payrollOtherDeductionModel.PDDate = this.datePipe.transform(this.UIDPDDate, 'yyyy-MM-dd');
  }

  public async SavePayrollOtherDeductionDetail() {
    this.DisableButtons();
    if (this._isDataLoaded == true) {
      this._isDataLoaded = false;
      this._savePayrollOtherDeductionDetailSubscription = (await this._payrollOtherDeductionDetailService.SavePayrollOtherDeduction(this._payrollOtherDeductionModel.Id, this._payrollOtherDeductionModel)).subscribe(
        response => {
          this.loadComponent(false);
          this._isDataLoaded = true;
          this._snackBarTemplate.snackBarSuccess(this._snackBar, "Save Successfully.");
          if (this._savePayrollOtherDeductionDetailSubscription !== null) this._savePayrollOtherDeductionDetailSubscription.unsubscribe();
        },
        error => {
          this.loadComponent(false);
          this._isDataLoaded = true;
          this._snackBarTemplate.snackBarError(this._snackBar, error.error.Message + " " + error.status);
          if (this._savePayrollOtherDeductionDetailSubscription !== null) this._savePayrollOtherDeductionDetailSubscription.unsubscribe();
        }
      );
    }
  }

  public async LockPayrollOtherDeductionDetail() {
    this.DisableButtons();
    if (this._isDataLoaded == true) {
      this._isDataLoaded = false;
      this._lockPayrollOtherDeductionDetailSubscription = await (await this._payrollOtherDeductionDetailService.LockPayrollOtherDeduction(this._payrollOtherDeductionModel.Id, this._payrollOtherDeductionModel)).subscribe(
        response => {
          this.loadComponent(true);
          this._isDataLoaded = true;
          this._snackBarTemplate.snackBarSuccess(this._snackBar, "Lock Successfully.");
          if (this._lockPayrollOtherDeductionDetailSubscription !== null) this._lockPayrollOtherDeductionDetailSubscription.unsubscribe();
        },
        error => {
          this.loadComponent(false);
          this._isDataLoaded = true;
          this._snackBarTemplate.snackBarError(this._snackBar, error.error.Message + " " + error.status);
          if (this._lockPayrollOtherDeductionDetailSubscription !== null) this._lockPayrollOtherDeductionDetailSubscription.unsubscribe();
        }
      );
    }
  }

  public async UnlockPayrollOtherDeductionDetail() {
    this.DisableButtons();
    if (this._isDataLoaded == true) {
      this._isDataLoaded = false;
      this._unlockPayrollOtherDeductionDetailSubscription = await (await this._payrollOtherDeductionDetailService.UnlockPayrollOtherDeduction(this._payrollOtherDeductionModel.Id)).subscribe(
        response => {
          this.loadComponent(false);
          this._isDataLoaded = true;
          this._snackBarTemplate.snackBarSuccess(this._snackBar, "Unlock Successfully.");
          if (this._unlockPayrollOtherDeductionDetailSubscription !== null) this._unlockPayrollOtherDeductionDetailSubscription.unsubscribe();
        },
        error => {
          this.loadComponent(true);
          this._isDataLoaded = true;
          this._snackBarTemplate.snackBarError(this._snackBar, error.error.Message + " " + error.status);
          if (this._unlockPayrollOtherDeductionDetailSubscription !== null) this._unlockPayrollOtherDeductionDetailSubscription.unsubscribe();
        }
      );
    }
  }

  private loadComponent(isDisable) {
    this._btnAddPayrollOtherDeductionLineDisabled = isDisable;
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

  private async GetPayrollOtherDeductionLineListData() {

    this._listPayrollOtherDeductionLineObservableArray = new ObservableArray();
    this._listPayrollOtherDeductionLineCollectionView = new CollectionView(this._listPayrollOtherDeductionLineObservableArray);
    this._listPayrollOtherDeductionLineCollectionView.pageSize = 15;
    this._listPayrollOtherDeductionLineCollectionView.trackChanges = true;
    await this._listPayrollOtherDeductionLineCollectionView.refresh();
    await this.flexPayrollOtherDeductionLine.refresh();
    this.totalDeductionAmount = '0.00';

    this._isPayrollOtherDeductionLineProgressBarHidden = true;

    this._PayrollOtherDeductionLineListSubscription = await (await this._payrollOtherDeductionDetailService.PayrollOtherDeductionLineList(this._payrollOtherDeductionModel.Id)).subscribe(
      (response: any) => {
        if (response["length"] > 0) {
          this.totalDeductionAmount = this.decimalPipe.transform(this.Sum(response), "1.2-2");
          console.log(this.totalDeductionAmount);
          this._listPayrollOtherDeductionLineObservableArray = response;
          this._listPayrollOtherDeductionLineCollectionView = new CollectionView(this._listPayrollOtherDeductionLineObservableArray);
          this._listPayrollOtherDeductionLineCollectionView.pageSize = 15;
          this._listPayrollOtherDeductionLineCollectionView.trackChanges = true;
          this._listPayrollOtherDeductionLineCollectionView.refresh();
          this.flexPayrollOtherDeductionLine.refresh();
        }

        this._isPayrollOtherDeductionLineDataLoaded = true;
        this._isPayrollOtherDeductionLineProgressBarHidden = false;
        if (this._PayrollOtherDeductionLineListSubscription !== null) this._PayrollOtherDeductionLineListSubscription.unsubscribe();
      },
      error => {
        this._isPayrollOtherDeductionLineProgressBarHidden = false;
        this._snackBarTemplate.snackBarError(this._snackBar, error.error.Message + " " + error.status);
        if (this._PayrollOtherDeductionLineListSubscription !== null) this._PayrollOtherDeductionLineListSubscription.unsubscribe();
      }
    );
  }

  gridClick(s, e) {
    if (wjcCore.hasClass(e.target, 'button-edit')) {
      if (this._userRights.CanEdit) {
        this.EditPayrollOtherDeductionLine();
      }

    }

    if (wjcCore.hasClass(e.target, 'button-delete')) {
      if (this._userRights.CanDelete) {
        this.ComfirmDeletePayrollOtherDeductionLine();
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

  public AddPayrollOtherDeductionLine() {
    this.DetailPayrollOtherDeductionLine(this._payrollOtherDeductionLineModel, "Add Payroll Other Deduction Line");
  }

  public async GetLoand() {
    this._isPayrollOtherDeductionLineProgressBarHidden = true;

    if (this._isPayrollOtherDeductionLineDataLoaded == true) {
      this._isPayrollOtherDeductionLineDataLoaded = false;
      this._savePayrollOtherDeductionLineSubscription = await (await this._payrollOtherDeductionDetailService.GetLoan(this._payrollOtherDeductionModel.Id)).subscribe(
        response => {
          this._isPayrollOtherDeductionLineDataLoaded = true;
          this._isPayrollOtherDeductionLineProgressBarHidden = false;

          this._snackBarTemplate.snackBarSuccess(this._snackBar, "Loan Successfully loaded");
          this.GetPayrollOtherDeductionLineListData();
          if (this._savePayrollOtherDeductionLineSubscription != null) this._savePayrollOtherDeductionLineSubscription.unsubscribe();
        },
        error => {
          this._isPayrollOtherDeductionLineDataLoaded = true;
          this._isPayrollOtherDeductionLineProgressBarHidden = false;
          this._snackBarTemplate.snackBarError(this._snackBar, error.error + " " + " Status Code: " + error.status);
          if (this._savePayrollOtherDeductionLineSubscription != null) this._savePayrollOtherDeductionLineSubscription.unsubscribe();
        }
      );
    }
  }

  public EditPayrollOtherDeductionLine() {
    let currentPayrollOtherDeductionLine = this._listPayrollOtherDeductionLineCollectionView.currentItem;
    this.DetailPayrollOtherDeductionLine(currentPayrollOtherDeductionLine, "Edit Payroll Other Deduction Line Detail");
  }

  public async DeletePayrollOtherDeductionLine() {
    let currentPayrollOtherDeductionLine = this._listPayrollOtherDeductionLineCollectionView.currentItem;
    this._isPayrollOtherDeductionLineProgressBarHidden = true;

    if (this._isPayrollOtherDeductionLineDataLoaded == true) {
      this._isPayrollOtherDeductionLineDataLoaded = false;
      this._deletePayrollOtherDeductionLineSubscription = await (await this._payrollOtherDeductionDetailService.DeletePayrollOtherDeductionLine(currentPayrollOtherDeductionLine.Id)).subscribe(
        response => {
          this._snackBarTemplate.snackBarSuccess(this._snackBar, "Delete Successfully");
          this.GetPayrollOtherDeductionLineListData();
          this._isPayrollOtherDeductionLineProgressBarHidden = false;
          this._isPayrollOtherDeductionLineDataLoaded = true;
        },
        error => {
          this._isPayrollOtherDeductionLineDataLoaded = true;
          this._isPayrollOtherDeductionLineProgressBarHidden = false;
          this._snackBarTemplate.snackBarError(this._snackBar, error.error + " " + error.status);
          if (this._deletePayrollOtherDeductionLineSubscription != null) this._deletePayrollOtherDeductionLineSubscription.unsubscribe();
        }
      );
    }
  }

  public ComfirmDeletePayrollOtherDeductionLine(): void {
    let currentPayrollOtherDeductionLine = this._listPayrollOtherDeductionLineCollectionView.currentItem;
    const matDialogRef = this._matDialog.open(ComfirmMassageDialogComponent, {
      width: '500px',
      data: {
        objDialogTitle: "",
        objComfirmationMessage: ` Delete ${currentPayrollOtherDeductionLine.Employee}?`,
      },
      disableClose: true
    });

    matDialogRef.afterClosed().subscribe(result => {
      if (result.message == "Yes") {
        this.DeletePayrollOtherDeductionLine();
      }
    });
  }


  public DetailPayrollOtherDeductionLine(objPayrollOtherDeductionLine: PayrollOtherDeductionLineModel, eventTitle: string) {
    const matDialogRef = this._matDialog.open(PayrollOtherDeductionLineDialogComponent, {
      width: '1300px',
      data: {
        objDialogTitle: eventTitle,
        objPayrollGroup: this._payrollOtherDeductionModel.PayrollGroup,
        objPayrollOtherDeductionLine: objPayrollOtherDeductionLine,
      },
      disableClose: true
    });

    matDialogRef.afterClosed().subscribe((result: any) => {
      if (result.event === "Add Payroll Other Deduction Line") {

        this._isPayrollOtherDeductionLineDataLoaded = true;

        this.AddSavePayrollOtherDeductionLine(result.data);
      }
      if (result.event === "Edit Payroll Other Deduction Line Detail") {

        this._isPayrollOtherDeductionLineDataLoaded = true;

        this.UpdatePayrollOtherDeductionLine(result.data.Id, result.data);
      }
    });
  }

  ngOnDestroy() {
  }

  public async AddSavePayrollOtherDeductionLine(objPayrollOtherDeductionLine: PayrollOtherDeductionLineModel) {
    this._isPayrollOtherDeductionLineProgressBarHidden = true;

    if (this._isPayrollOtherDeductionLineDataLoaded == true) {
      this._isPayrollOtherDeductionLineDataLoaded = false;
      this._savePayrollOtherDeductionLineSubscription = await (await this._payrollOtherDeductionDetailService.AddPayrollOtherDeductionLine(this._payrollOtherDeductionModel.Id, objPayrollOtherDeductionLine)).subscribe(
        response => {
          this._isPayrollOtherDeductionLineDataLoaded = true;
          this._isPayrollOtherDeductionLineProgressBarHidden = false;

          this._snackBarTemplate.snackBarSuccess(this._snackBar, "Save Successfully");
          this.GetPayrollOtherDeductionLineListData();
          if (this._savePayrollOtherDeductionLineSubscription != null) this._savePayrollOtherDeductionLineSubscription.unsubscribe();
        },
        error => {
          this._isPayrollOtherDeductionLineDataLoaded = true;
          this._isPayrollOtherDeductionLineProgressBarHidden = false;
          this._snackBarTemplate.snackBarError(this._snackBar, error.error + " " + " Status Code: " + error.status);
          if (this._savePayrollOtherDeductionLineSubscription != null) this._savePayrollOtherDeductionLineSubscription.unsubscribe();
        }
      );
    }
  }

  public async UpdatePayrollOtherDeductionLine(id: number, objPayrollOtherDeductionLine: PayrollOtherDeductionLineModel) {
    this._isPayrollOtherDeductionLineProgressBarHidden = true;

    if (this._isPayrollOtherDeductionLineDataLoaded == true) {
      this._isPayrollOtherDeductionLineDataLoaded = false;
      this._updatePayrollOtherDeductionLineSubscription = await (await this._payrollOtherDeductionDetailService.UpdatePayrollOtherDeductionLine(id, objPayrollOtherDeductionLine)).subscribe(
        response => {
          this._isPayrollOtherDeductionLineDataLoaded = true;
          this._isPayrollOtherDeductionLineProgressBarHidden = false;

          this._snackBarTemplate.snackBarSuccess(this._snackBar, "Update Successfully");
          this.GetPayrollOtherDeductionLineListData();
          if (this._updatePayrollOtherDeductionLineSubscription != null) this._updatePayrollOtherDeductionLineSubscription.unsubscribe();
        },
        error => {
          this._isPayrollOtherDeductionLineDataLoaded = true;
          this._isPayrollOtherDeductionLineProgressBarHidden = false;
          this._snackBarTemplate.snackBarError(this._snackBar, error.error + " " + " Status Code: " + error.status);
          if (this._updatePayrollOtherDeductionLineSubscription != null) this._updatePayrollOtherDeductionLineSubscription.unsubscribe();
        }
      );
    }
  }

  selectedPreparedByUser(event: MatSelectChange) {
    const selectedData = {
      text: (event.source.selected as MatOption).viewValue,
      value: event.source.value
    };

    this._payrollOtherDeductionModel.PreparedByUserId = event.source.value;
    this._payrollOtherDeductionModel.PreparedByUser = (event.source.selected as MatOption).viewValue;
  }

  selectedCheckedByUser(event: MatSelectChange) {
    const selectedData = {
      text: (event.source.selected as MatOption).viewValue,
      value: event.source.value
    };

    this._payrollOtherDeductionModel.CheckedByUserId = event.source.value;
    this._payrollOtherDeductionModel.CheckedByUser = (event.source.selected as MatOption).viewValue;
  }

  selectedApprovedByUser(event: MatSelectChange) {
    const selectedData = {
      text: (event.source.selected as MatOption).viewValue,
      value: event.source.value
    };

    this._payrollOtherDeductionModel.ApprovedByUserId = event.source.value;
    this._payrollOtherDeductionModel.ApprovedByUser = (event.source.selected as MatOption).viewValue;
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
    collection = this._listPayrollOtherDeductionLineCollectionView;
    fileName = "payroll-other-income.csv";

    if (data != "") {
      var label = '"' + 'ID' + '",'
        + '"' + 'PDNumber' + '",'
        + '"' + 'PDDate' + '",'
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
          var row = '"' + this._payrollOtherDeductionModel.Id + '",'
            + '"' + this._payrollOtherDeductionModel.PDNumber + '",'
            + '"' + this._payrollOtherDeductionModel.PDDate + '",'
            + '"' + this._payrollOtherDeductionModel.PayrollGroup + '",'
            + '"' + this._payrollOtherDeductionModel.Year + '",'
            + '"' + this._payrollOtherDeductionModel.Remarks + '",'
            + '"' + this._payrollOtherDeductionModel.PreparedByUser + '",'
            + '"' + this._payrollOtherDeductionModel.CheckedByUser + '",'
            + '"' + this._payrollOtherDeductionModel.ApprovedByUser + '",';

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
