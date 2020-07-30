import { Component, OnInit, ViewChild } from '@angular/core';
import * as wjcGrid from '@grapecity/wijmo.grid';
import { CollectionView, ObservableArray } from '@grapecity/wijmo';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackBarTemplate } from '../../shared/snack-bar-template';

import { CompanyListService } from './../company-list.service'
import { DeleteDialogBoxComponent } from '../../shared/delete-dialog-box/delete-dialog-box.component';

@Component({
  selector: 'app-company-list',
  templateUrl: './company-list.component.html',
  styleUrls: ['./company-list.component.css']
})
export class CompanyListComponent implements OnInit {

  constructor(private companyListService: CompanyListService,
    public CompanyRegistrationlDialog: MatDialog,
    private router: Router,
    private snackBar: MatSnackBar,
    private snackBarTemplate: SnackBarTemplate,
    public DeleteConfirmDialog: MatDialog,
  ) {
  }

  async ngOnInit() {
    await this.GetCompanyListData();
  }

  public listCompanyObservableArray: ObservableArray = new ObservableArray();
  public listCompanyCollectionView: CollectionView = new CollectionView(this.listCompanyObservableArray);
  public listPageIndex: number = 15;
  @ViewChild('flexCompany') flexCompany: wjcGrid.FlexGrid;
  public isProgressBarHidden = false;
  public isDataLoaded: boolean = false;

  private companyListSubscription: any;
  private AddCompanySubscription: any;
  private DeleteCompanySubscription: any;

  public btnAddDisabled: boolean = false;

  private async GetCompanyListData() {

    this.listCompanyObservableArray = new ObservableArray();
    this.listCompanyCollectionView = new CollectionView(this.listCompanyObservableArray);
    this.listCompanyCollectionView.pageSize = 15;
    this.listCompanyCollectionView.trackChanges = true;
    await this.listCompanyCollectionView.refresh();
    await this.flexCompany.refresh();

    this.isProgressBarHidden = true;

    this.companyListSubscription = await (await this.companyListService.CompanyList()).subscribe(
      (response: any) => {
        var results = response;
        console.log("Response:", results);

        if (results["length"] > 0) {
          this.listCompanyObservableArray = results;
          this.listCompanyCollectionView = new CollectionView(this.listCompanyObservableArray);
          this.listCompanyCollectionView.pageSize = 15;
          this.listCompanyCollectionView.trackChanges = true;
          this.listCompanyCollectionView.refresh();
          this.flexCompany.refresh();
        }

        this.isDataLoaded = true;
        this.isProgressBarHidden = false;

        if (this.companyListSubscription != null) this.companyListSubscription.unsubscribe();
      },
      error => {
        this.snackBarTemplate.snackBarError(this.snackBar, error.error.Message + " " + error.status);
        if (this.companyListSubscription !== null) this.companyListSubscription.unsubscribe();
      }
    );
  }

  public async AddCompany() {
    this.btnAddDisabled = true;
    if (this.isDataLoaded == true) {
      this.isDataLoaded = false;
      this.AddCompanySubscription = await (await this.companyListService.AddCompany()).subscribe(
        response => {
          this.btnAddDisabled = false;
          this.isDataLoaded = true;
          this.GetCompanyListData();
          this.snackBarTemplate.snackBarSuccess(this.snackBar, "Added Successfully");
          this.router.navigate(['/software/company-detail/' + response]);
        },
        error => {
          this.btnAddDisabled = false;
          this.isDataLoaded = true;
          this.snackBarTemplate.snackBarError(this.snackBar, error.error + " " + " Status Code: " + error.status);
          if (this.AddCompanySubscription != null) this.AddCompanySubscription.unsubscribe();
        }
      );
    }
  }

  public EditCompany() {
    let currentCompany = this.listCompanyCollectionView.currentItem;
    this.router.navigate(['/software/company-detail/' + currentCompany.Id]);
  }

  public async DeleteCompany() {
    let currentCompany = this.listCompanyCollectionView.currentItem;
    this.isProgressBarHidden = true;

    if (this.isDataLoaded == true) {
      this.isDataLoaded = false;
      this.DeleteCompanySubscription = await (await this.companyListService.DeleteCompany(currentCompany.Id)).subscribe(
        response => {
          this.snackBarTemplate.snackBarSuccess(this.snackBar, "Delete Successfully");
          this.GetCompanyListData();
          this.isProgressBarHidden = false;
          this.isDataLoaded = true;
        },
        error => {
          this.isDataLoaded = true;
          this.isProgressBarHidden = false;
          this.snackBarTemplate.snackBarError(this.snackBar, error.error + " " + error.status);
          if (this.DeleteCompanySubscription != null) this.DeleteCompanySubscription.unsubscribe();
        }
      );
    }
  }

  public ComfirmDeleteEmployee(): void {
    let currentEmployee = this.listCompanyCollectionView.currentItem;
    const userRegistrationlDialogRef = this.DeleteConfirmDialog.open(DeleteDialogBoxComponent, {
      width: '500px',
      data: {
        objDialogTitle: "Delete Company",
        objComfirmationMessage: ` Delete this ${currentEmployee.Company}?`,
      },
      disableClose: true
    });

    userRegistrationlDialogRef.afterClosed().subscribe(result => {
      if (result.message == "Yes") {
        this.DeleteCompany();
      }
    });
  }
}
