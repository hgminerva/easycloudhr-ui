import { Component, Inject, OnInit, ViewChild } from '@angular/core';

import * as wjcGrid from '@grapecity/wijmo.grid';
import * as wjcCore from '@grapecity/wijmo';
import { CollectionView, ObservableArray } from '@grapecity/wijmo';

import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackBarTemplate } from '../../shared/snack-bar-template';

import { CompanyDetialService } from './../company-detial.service';
import { CompanyModel } from "./../company.model";
import { SoftwareSecurityService, UserModule } from '../../software-security/software-security.service';
import { DecimalPipe } from '@angular/common';
import { CompanyDetailApproverComponent } from '../company-detail-approver/company-detail-approver.component';

import { CompanyApproverModel } from './../company-approver.model';
import { ComfirmMassageDialogComponent } from '../../shared/comfirm-massage-dialog/comfirm-massage-dialog.component';
@Component({
  selector: 'app-company-detail',
  templateUrl: './company-detail.component.html',
  styleUrls: ['./company-detail.component.css']
})
export class CompanyDetailComponent implements OnInit {

  constructor(
    private snackBar: MatSnackBar,
    private snackBarTemplate: SnackBarTemplate,
    private companyDetialService: CompanyDetialService,
    public _companyDetailDialogRef: MatDialogRef<CompanyDetailComponent>,
    @Inject(MAT_DIALOG_DATA) public caseData: any,
    private softwareSecurityService: SoftwareSecurityService,
    private decimalPipe: DecimalPipe,
    public matDialog: MatDialog,
  ) { }

  public title = '';
  public event = 'Close';

  private _userRightsSubscription: any;

  public userRights: UserModule = {
    Module: "",
    CanOpen: false,
    CanAdd: false,
    CanEdit: false,
    CanDelete: false,
    CanLock: false,
    CanUnlock: false,
    CanPrint: false,
  }

  public companyModel: CompanyModel = {
    Id: 0,
    CompanyCode: '',
    Company: '',
    Address: '',
    SSSNumber: '',
    PHICNumber: '',
    HDMFNumber: '',
    TaxNumber: '',
    ExtenTaxNumbersionName: '',
    MinimumOvertimeHours: '0.00',
    CreatedByUserId: 0,
    CreatedByUser: '',
    CreatedDateTime: '',
    UpdatedByUserId: 0,
    UpdatedByUser: '',
    UpdatedDateTime: '',
    IsLocked: false,
    FundingAccount: '',
    SSSAccountId: null,
    HDMFAccountId: null,
    PHICAccountId: null,
    TaxAccountId: null
  }

  public isCompanyDataLoaded: boolean = false;
  public isLocked: boolean = false;
  private companyDetailSubscription: any;

  private saveCompanyDetailSubscription: any;
  private lockCompanyDetailSubscription: any;
  private unlockCompanyDetailSubscription: any;

  private isDataLoaded: boolean = true;
  public isProgressBarHidden: boolean = true;

  public btnSaveDisabled: boolean = true;
  public btnLockisabled: boolean = true;
  public btnUnlockDisabled: boolean = true;

  public _isComponentsShown: boolean = false;

  public accountDropdownSubscription: any;
  public accountListDropdown: any;
  private async GetAccountDropdownListData() {
    this.accountDropdownSubscription = await (await this.companyDetialService.AccountList()).subscribe(
      response => {
        this.accountListDropdown = response;
        if (this.accountDropdownSubscription !== null) this.accountDropdownSubscription.unsubscribe();
      },
      error => {
        this.snackBarTemplate.snackBarError(this.snackBar, error.error.Message + " " + error.status);
        if (this.accountDropdownSubscription !== null) this.accountDropdownSubscription.unsubscribe();
      }
    );
  }

  private async GetUserRights() {
    this._userRightsSubscription = await (await this.softwareSecurityService.PageModuleRights("Company Detail")).subscribe(
      (response: any) => {
        let results = response;
        if (results !== null) {
          this.userRights.Module = results["Module"];
          this.userRights.CanOpen = results["CanOpen"];
          this.userRights.CanAdd = results["CanAdd"];
          this.userRights.CanEdit = results["CanEdit"];
          this.userRights.CanDelete = results["CanDelete"];
          this.userRights.CanLock = results["CanLock"];
          this.userRights.CanUnlock = results["CanUnlock"];
          this.userRights.CanPrint = results["CanPrint"];
        }

        if (this._userRightsSubscription !== null) this._userRightsSubscription.unsubscribe();
      },
      error => {
        this.snackBarTemplate.snackBarError(this.snackBar, error.error.Message + " " + error.status);
        if (this._userRightsSubscription !== null) this._userRightsSubscription.unsubscribe();
      }
    );

    await this.GetCompanyDetail(this.caseData.objCompanyId);
  }

  public RemoveComma(value: string): string {
    return value.toString().replace(',', '');
  }

  private async GetCompanyDetail(id) {
    this._isComponentsShown = false;
    this.disableButtons();
    this.companyDetailSubscription = await (await this.companyDetialService.CompanyDetail(id)).subscribe(
      response => {
        let result = response;
        if (result != null) {
          this.companyModel.Id = result["Id"];
          this.companyModel.CompanyCode = result["CompanyCode"];
          this.companyModel.Company = result["Company"];
          this.companyModel.Address = result["Address"];
          this.companyModel.SSSNumber = result["SSSNumber"];
          this.companyModel.PHICNumber = result["PHICNumber"];
          this.companyModel.HDMFNumber = result["HDMFNumber"];
          this.companyModel.TaxNumber = result["TaxNumber"];
          this.companyModel.MinimumOvertimeHours = this.decimalPipe.transform(result["MinimumOvertimeHours"], "1.2-2");
          this.companyModel.CreatedByUserId = result["CreatedByUserId"];
          this.companyModel.CreatedByUser = result["CreatedByUser"];
          this.companyModel.CreatedDateTime = result["CreatedDateTime"];
          this.companyModel.UpdatedByUserId = result["UpdatedByUserId"];
          this.companyModel.UpdatedByUser = result["UpdatedByUser"];
          this.companyModel.UpdatedDateTime = result["UpdatedDateTime"];
          this.companyModel.IsLocked = result["IsLocked"];
          this.companyModel.FundingAccount = result["FundingAccount"];
        }
        this.loadComponent(result["IsLocked"]);
        this._isComponentsShown = true;
        if (this.companyDetailSubscription !== null) this.companyDetailSubscription.unsubscribe();
      },
      error => {
        this.snackBarTemplate.snackBarError(this.snackBar, error.error.Message + " " + error.status);
        if (this.companyDetailSubscription !== null) this.companyDetailSubscription.unsubscribe();
      }
    );
    setTimeout(() => {
      this.GetApproverListData();
    }, 500);
  }

  public async SaveCompanyDetail() {
    this.disableButtons();
    if (this.isDataLoaded == true) {
      this.isDataLoaded = false;
      this.saveCompanyDetailSubscription = await (await this.companyDetialService.SaveCompany(this.companyModel.Id, this.companyModel)).subscribe(
        response => {
          this.loadComponent(false);
          this.isDataLoaded = true;
          this.event = "Save";
          this.snackBarTemplate.snackBarSuccess(this.snackBar, "Save Successfully.");
          if (this.saveCompanyDetailSubscription !== null) this.saveCompanyDetailSubscription.unsubscribe();
        },
        error => {
          this.loadComponent(false);
          this.isDataLoaded = true;
          this.snackBarTemplate.snackBarError(this.snackBar, error.error.Message + " " + error.status);
          if (this.saveCompanyDetailSubscription !== null) this.saveCompanyDetailSubscription.unsubscribe();
        }
      );
    }
  }

  public async LockCompanyDetail() {
    this.disableButtons();
    if (this.isDataLoaded == true) {
      this.isDataLoaded = false;
      this.lockCompanyDetailSubscription = await (await this.companyDetialService.LockCompany(this.companyModel.Id, this.companyModel)).subscribe(
        response => {
          this.loadComponent(true);
          this.isDataLoaded = true;
          this.event = "Lock";
          this.snackBarTemplate.snackBarSuccess(this.snackBar, "Lock Successfully.");
          if (this.lockCompanyDetailSubscription !== null) this.lockCompanyDetailSubscription.unsubscribe();
        },
        error => {
          this.loadComponent(false);
          this.isDataLoaded = true;
          this.snackBarTemplate.snackBarError(this.snackBar, error.error.Message + " " + error.status);
          if (this.lockCompanyDetailSubscription !== null) this.lockCompanyDetailSubscription.unsubscribe();
        }
      );
    }
  }

  public async UnlockCompanyDetail() {
    this.disableButtons();
    if (this.isDataLoaded == true) {
      this.isDataLoaded = false;
      this.unlockCompanyDetailSubscription = await (await this.companyDetialService.UnlockCompany(this.companyModel.Id)).subscribe(
        response => {
          this.loadComponent(false);
          this.isDataLoaded = true;
          this.event = "Unlock";
          this.snackBarTemplate.snackBarSuccess(this.snackBar, "Unlock Successfully.");
          if (this.unlockCompanyDetailSubscription !== null) this.unlockCompanyDetailSubscription.unsubscribe();
        },
        error => {
          this.loadComponent(true);
          this.isDataLoaded = true;
          this.snackBarTemplate.snackBarError(this.snackBar, error.error.Message + " " + error.status);
          if (this.unlockCompanyDetailSubscription !== null) this.unlockCompanyDetailSubscription.unsubscribe();
        }
      );
    }
  }

  public inputTypeMinimumOvertimeHours = 'text';

  formatValueMinimumOvertimeHours() {
    this.inputTypeMinimumOvertimeHours = 'text';

    if (this.companyModel.MinimumOvertimeHours == '') {
      this.companyModel.MinimumOvertimeHours = this.decimalPipe.transform(0, "1.2-2");
    } else {
      this.companyModel.MinimumOvertimeHours = this.decimalPipe.transform(this.companyModel.MinimumOvertimeHours, "1.2-2");
    }
  }

  MinimumOvertimeHoursToNumberType() {
    this.inputTypeMinimumOvertimeHours = 'number';
  }

  private loadComponent(isDisable) {
    this.btnSaveDisabled = isDisable;
    this.btnLockisabled = isDisable;
    this.btnUnlockDisabled = !isDisable;

    if (this.userRights.CanEdit === false) {
      this.isLocked = true;
    } else {
      this.isLocked = isDisable;
    }

    this.isProgressBarHidden = false;
  }

  private disableButtons() {
    this.btnSaveDisabled = true;
    this.btnLockisabled = true;
    this.btnUnlockDisabled = true;
    this.isProgressBarHidden = true;
  }

  public Close(): void {
    this._companyDetailDialogRef.close({ event: this.event });
  }

  // =============
  // Code Tables
  // =============
  public _listApproverObservableArray: ObservableArray = new ObservableArray();
  public _listApproverCollectionView: CollectionView = new CollectionView(this._listApproverObservableArray);
  public _listApproverageIndex: number = 15;
  @ViewChild('flexApprover') _flexApprover: wjcGrid.FlexGrid;
  public isApproverProgressBarHidden = false;
  public isApproverDataLoaded: boolean = false;

  private _approverListSubscription: any;
  private _deleteApproverSubscription: any;

  public buttonDisabled: boolean = false;

  private async GetApproverListData() {
    this._listApproverObservableArray = new ObservableArray();
    this._listApproverCollectionView = new CollectionView(this._listApproverObservableArray);
    this._listApproverCollectionView.pageSize = 15;
    this._listApproverCollectionView.trackChanges = true;
    await this._listApproverCollectionView.refresh();
    await this._flexApprover.refresh();

    this.isApproverProgressBarHidden = true;

    this._approverListSubscription = (await this.companyDetialService.ApproverList(this.companyModel.Id)).subscribe(
      (response: any) => {
        let results = response;
        console.log(results["length"], results);

        if (results["length"] > 0) {
          this._listApproverObservableArray = results;
          this._listApproverCollectionView = new CollectionView(this._listApproverObservableArray);
          this._listApproverCollectionView.pageSize = 15;
          this._listApproverCollectionView.trackChanges = true;
          this._listApproverCollectionView.refresh();
          this._flexApprover.refresh();
        }
        this.isApproverDataLoaded = true;
        this.isApproverProgressBarHidden = false;
        if (this._approverListSubscription != null) this._approverListSubscription.unsubscribe();
      },
      error => {
        this.snackBarTemplate.snackBarError(this.snackBar, error.error.Message + " " + error.status);
        if (this._approverListSubscription !== null) this._approverListSubscription.unsubscribe();
      }
    );
  }

  gridClick(s, e) {
    if (wjcCore.hasClass(e.target, 'button-edit')) {
      if (this.userRights.CanEdit) {
        this.EditApprover();
      }

    }

    if (wjcCore.hasClass(e.target, 'button-delete')) {
      if (this.userRights.CanDelete) {
        this.ComfirmDeleteApprover();
      }
    }
  }
  public BtnAddApprover() {

    let objApprover: CompanyApproverModel = {
      Id: 0,
      CompanyId: this.companyModel.Id,
      UserId: 0,
      Branch: '',
      Remarks: ''
    }
    this.DetailApprover(objApprover, "Add Approver", "Add");
  }

  public EditApprover() {
    let currentApprover = this._listApproverCollectionView.currentItem;
    this.DetailApprover(currentApprover, "Edit Approver", "Edit");
  }

  public async DeleteApprover() {
    if (this.isApproverDataLoaded == true) {
      this.isApproverDataLoaded = false;
      let currentApprover = this._listApproverCollectionView.currentItem;
      this.isApproverProgressBarHidden = true;

      this._deleteApproverSubscription = (await this.companyDetialService.DeleteApprover(currentApprover.Id)).subscribe(
        response => {
          this.snackBarTemplate.snackBarSuccess(this.snackBar, "Delete Successfully");
          this.GetApproverListData();
          this.isApproverProgressBarHidden = false;
          this.isApproverDataLoaded = true;
        },
        error => {
          this.isApproverDataLoaded = true;
          this.snackBarTemplate.snackBarError(this.snackBar, error.error + " " + error.status);
          if (this._deleteApproverSubscription != null) this._deleteApproverSubscription.unsubscribe();
        }
      );
    }
  }

  public ComfirmDeleteApprover(): void {
    let currentApprover = this._listApproverCollectionView.currentItem;
    const matDialogRef = this.matDialog.open(ComfirmMassageDialogComponent, {
      width: '500px',
      data: {
        objDialogTitle: "",
        objComfirmationMessage: `Delete ${currentApprover.User}?`,
      },
      disableClose: true
    });

    matDialogRef.afterClosed().subscribe(result => {
      if (result.message == "Yes") {
        this.DeleteApprover();
      }
    });
  }

  public DetailApprover(objApprover: CompanyApproverModel, eventTitle: string, action: string): void {
    const matDialogRef = this.matDialog.open(CompanyDetailApproverComponent, {
      width: '500px',
      data: {
        objDialogTitle: eventTitle,
        objData: objApprover,
        objDialogType: action,
      },
      disableClose: true
    });

    matDialogRef.afterClosed().subscribe(data => {
      if (data != null) {
        this.GetApproverListData();
      }
    });
  }

  ngOnInit(): void {
    this.title = this.caseData.objDialogTitle;
    this.GetAccountDropdownListData();
    this.GetUserRights();
  }
}
