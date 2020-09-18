import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackBarTemplate } from '../../shared/snack-bar-template';

import { CompanyDetialService } from './../company-detial.service';
import { CompanyModel } from "./../company.model";
import { SoftwareSecurityService, UserModule } from '../../software-security/software-security.service';

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
    CreatedByUserId: 0,
    CreatedByUser: '',
    CreatedDateTime: '',
    UpdatedByUserId: 0,
    UpdatedByUser: '',
    UpdatedDateTime: '',
    IsLocked: false
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
          this.companyModel.CreatedByUserId = result["CreatedByUserId"];
          this.companyModel.CreatedByUser = result["CreatedByUser"];
          this.companyModel.CreatedDateTime = result["CreatedDateTime"];
          this.companyModel.UpdatedByUserId = result["UpdatedByUserId"];
          this.companyModel.UpdatedByUser = result["UpdatedByUser"];
          this.companyModel.UpdatedDateTime = result["UpdatedDateTime"];
          this.companyModel.IsLocked = result["IsLocked"];
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
  }

  public async SaveCompanyDetail() {
    this.disableButtons();
    if (this.isDataLoaded == true) {
      this.isDataLoaded = false;
      this.saveCompanyDetailSubscription = await (await this.companyDetialService.SaveCompany(this.companyModel.Id, this.companyModel)).subscribe(
        response => {
          this.loadComponent(this.companyModel.IsLocked);
          this.isDataLoaded = true;
          this.event = "Save";
          this.snackBarTemplate.snackBarSuccess(this.snackBar, "Save Successfully.");
          if (this.saveCompanyDetailSubscription !== null) this.saveCompanyDetailSubscription.unsubscribe();
        },
        error => {
          this.loadComponent(this.companyModel.IsLocked);
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

  private loadComponent(isDisable) {
    if (isDisable == true) {
      this.btnSaveDisabled = isDisable;
      this.btnLockisabled = isDisable;
      this.btnUnlockDisabled = !isDisable;
    } else {
      this.btnSaveDisabled = isDisable;
      this.btnLockisabled = isDisable;
      this.btnUnlockDisabled = !isDisable;
    }

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


  ngOnInit(): void {
    this.title = this.caseData.objDialogTitle;
    this.GetUserRights();
  }
}
