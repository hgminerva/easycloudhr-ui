import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackBarTemplate } from '../../shared/snack-bar-template';

import { CompanyDetialService } from './../company-detial.service';
import { CompanyModel } from "./../company.model";

@Component({
  selector: 'app-company-detail',
  templateUrl: './company-detail.component.html',
  styleUrls: ['./company-detail.component.css']
})
export class CompanyDetailComponent implements OnInit {

  constructor(
    private activatedRoute: ActivatedRoute,
    private snackBar: MatSnackBar,
    private snackBarTemplate: SnackBarTemplate,
    private companyDetialService: CompanyDetialService
  ) { }

  async ngOnInit() {
    await this.GetCompanyDetail();
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
    CreatedDateTime: new Date(),
    UpdatedByUserId: 0,
    UpdatedByUser: '',
    UpdatedDateTime: new Date(),
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

  private async GetCompanyDetail() {
    this.disableButtons();
    let id = 0;
    this.activatedRoute.params.subscribe(params => { id = params["id"]; });
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
          this.companyModel.CreatedDateTime = new Date(result["CreatedDateTime"]);
          this.companyModel.UpdatedByUserId = result["UpdatedByUserId"];
          this.companyModel.UpdatedByUser = result["UpdatedByUser"];
          this.companyModel.UpdatedDateTime = new Date(result["UpdatedDateTime"]);
          this.companyModel.IsLocked = result["IsLocked"];
        }

        this.loadComponent(result["IsLocked"]);
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

    this.isLocked = isDisable;
    this.isProgressBarHidden = false;
  }

  private disableButtons() {
    this.btnSaveDisabled = true;
    this.btnLockisabled = true;
    this.btnUnlockDisabled = true;
    this.isProgressBarHidden = true;
  }
}
