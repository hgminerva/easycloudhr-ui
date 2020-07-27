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

  private async GetCompanyDetail() {
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
          this.companyModel.CreatedDateTime = result["CreatedDateTime"];
          this.companyModel.UpdatedByUserId = result["UpdatedByUserId"];
          this.companyModel.UpdatedByUser = result["UpdatedByUser"];
          this.companyModel.UpdatedDateTime = result["UpdatedDateTime"];
          this.companyModel.IsLocked = result["IsLocked"];
          console.log(this.companyModel);
        }

        if (this.companyModel.IsLocked == true) {
          this.isLocked = this.companyModel.IsLocked;
        }

        this.isCompanyDataLoaded = true;
        if (this.companyDetailSubscription !== null) this.companyDetailSubscription.unsubscribe();
      },
      error => {
        this.snackBarTemplate.snackBarError(this.snackBar, error.error.Message + " " + error.status);
        if (this.companyDetailSubscription !== null) this.companyDetailSubscription.unsubscribe();
      }
    );
  }


  public async SaveCompanyDetail() {
    if (this.isDataLoaded == true) {
      this.isDataLoaded = false;
      this.saveCompanyDetailSubscription = await (await this.companyDetialService.SaveCompany(this.companyModel.Id, this.companyModel)).subscribe(
        response => {
          this.isDataLoaded = true;
          this.snackBarTemplate.snackBarSuccess(this.snackBar, "Save Successfully.");
          if (this.saveCompanyDetailSubscription !== null) this.saveCompanyDetailSubscription.unsubscribe();
        },
        error => {
          this.isDataLoaded = true;
          this.snackBarTemplate.snackBarError(this.snackBar, error.error.Message + " " + error.status);
          if (this.saveCompanyDetailSubscription !== null) this.saveCompanyDetailSubscription.unsubscribe();
        }
      );
    }
  }


  public async LockCompanyDetail() {
    if (this.isDataLoaded == true) {
      this.isDataLoaded = false;
      this.lockCompanyDetailSubscription = await (await this.companyDetialService.LockCompany(this.companyModel.Id, this.companyModel)).subscribe(
        response => {
          this.isLocked = true;
          this.isDataLoaded = true;

          this.snackBarTemplate.snackBarSuccess(this.snackBar, "Lock Successfully.");
          if (this.lockCompanyDetailSubscription !== null) this.lockCompanyDetailSubscription.unsubscribe();
        },
        error => {
          this.isDataLoaded = true;
          this.snackBarTemplate.snackBarError(this.snackBar, error.error.Message + " " + error.status);
          if (this.lockCompanyDetailSubscription !== null) this.lockCompanyDetailSubscription.unsubscribe();
        }
      );
    }

  }

  public async UnlockCompanyDetail() {
    if (this.isDataLoaded == true) {
      this.isDataLoaded = false;
      this.unlockCompanyDetailSubscription = await (await this.companyDetialService.UnlockCompany(this.companyModel.Id)).subscribe(
        response => {
          this.isLocked = false;
          this.isDataLoaded = true;
          this.snackBarTemplate.snackBarSuccess(this.snackBar, "Unlock Successfully.");
          if (this.unlockCompanyDetailSubscription !== null) this.unlockCompanyDetailSubscription.unsubscribe();
        },
        error => {
          this.isDataLoaded = true;
          this.snackBarTemplate.snackBarError(this.snackBar, error.error.Message + " " + error.status);
          if (this.unlockCompanyDetailSubscription !== null) this.unlockCompanyDetailSubscription.unsubscribe();
        }
      );
    }

  }
}
