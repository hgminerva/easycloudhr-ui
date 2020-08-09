import { Component, OnInit, ViewChild } from '@angular/core';

import * as wjcGrid from '@grapecity/wijmo.grid';
import { CollectionView, ObservableArray } from '@grapecity/wijmo';

import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackBarTemplate } from '../../shared/snack-bar-template';

import { CompanyListService } from './../company-list.service'
import { DeleteDialogBoxComponent } from '../../shared/delete-dialog-box/delete-dialog-box.component';
import { CompanyDetailComponent } from '../../company-detail/company-detail/company-detail.component';

@Component({
  selector: 'app-company-list',
  templateUrl: './company-list.component.html',
  styleUrls: ['./company-list.component.css']
})
export class CompanyListComponent implements OnInit {
  // Class properties
  public _listCompanyObservableArray: ObservableArray = new ObservableArray();
  public _listCompanyCollectionView: CollectionView = new CollectionView(this._listCompanyObservableArray);
  public _listPageIndex: number = 15;

  public _isProgressBarHidden = false;
  public _isDataLoaded: boolean = false;

  private _companyListSubscription: any;
  private _addCompanySubscription: any;
  private _deleteCompanySubscription: any;

  public _btnAddDisabled: boolean = false;

  // DOM declaration
  @ViewChild('flexCompany') _flexCompany: wjcGrid.FlexGrid;

  // Constructor and overrides
  constructor(private _companyListService: CompanyListService,
    private _snackBar: MatSnackBar,
    private _snackBarTemplate: SnackBarTemplate,
    public _matDialogRef: MatDialog) {
  }
  async ngOnInit() {
    await this.GetCompanyListData();
  }

  // Methods
  private async GetCompanyListData() {
    this._listCompanyObservableArray = new ObservableArray();
    this._listCompanyCollectionView = new CollectionView(this._listCompanyObservableArray);
    this._listCompanyCollectionView.pageSize = 15;
    this._listCompanyCollectionView.trackChanges = true;
    await this._listCompanyCollectionView.refresh();
    await this._flexCompany.refresh();

    this._isProgressBarHidden = true;

    this._companyListSubscription = (await this._companyListService.CompanyList()).subscribe(
      (response: any) => {
        var results = response;
        console.log("Response:", results);

        if (results["length"] > 0) {
          this._listCompanyObservableArray = results;
          this._listCompanyCollectionView = new CollectionView(this._listCompanyObservableArray);
          this._listCompanyCollectionView.pageSize = 15;
          this._listCompanyCollectionView.trackChanges = true;
          this._listCompanyCollectionView.refresh();
          this._flexCompany.refresh();
        }

        this._isDataLoaded = true;
        this._isProgressBarHidden = false;

        if (this._companyListSubscription != null) this._companyListSubscription.unsubscribe();
      },
      error => {
        if (error.status == "401") {
          location.reload();
        } else {
          this._snackBarTemplate.snackBarError(this._snackBar, error.error.Message + " " + " Status Code: " + error.status);
          if (this._companyListSubscription != null) this._companyListSubscription.unsubscribe();

        }
      }
    );
  }

  public async AddCompany() {
    this._btnAddDisabled = true;
    if (this._isDataLoaded == true) {
      this._isDataLoaded = false;
      this._addCompanySubscription = (await this._companyListService.AddCompany()).subscribe(
        (response: any) => {
          this._btnAddDisabled = false;
          this._isDataLoaded = true;
          this.GetCompanyListData();
          this.DetailCompany(response, "Company Detail")
          this._snackBarTemplate.snackBarSuccess(this._snackBar, "Added Successfully");
        },
        error => {
          this._btnAddDisabled = false;
          this._isDataLoaded = true;
          this._snackBarTemplate.snackBarError(this._snackBar, error.error + " " + " Status Code: " + error.status);
          if (this._addCompanySubscription != null) this._addCompanySubscription.unsubscribe();
        }
      );
    }
  }

  public EditCompany() {
    let currentCompany = this._listCompanyCollectionView.currentItem;
    this.DetailCompany(currentCompany.Id, "Edit Company Detail");
  }

  public async DeleteCompany() {
    let currentCompany = this._listCompanyCollectionView.currentItem;
    this._isProgressBarHidden = true;

    if (this._isDataLoaded == true) {
      this._isDataLoaded = false;
      this._deleteCompanySubscription = (await this._companyListService.DeleteCompany(currentCompany.Id)).subscribe(
        response => {
          this._snackBarTemplate.snackBarSuccess(this._snackBar, "Delete Successfully");
          this.GetCompanyListData();
          this._isProgressBarHidden = false;
          this._isDataLoaded = true;
        },
        error => {
          this._isDataLoaded = true;
          this._isProgressBarHidden = false;
          this._snackBarTemplate.snackBarError(this._snackBar, error.error + " " + error.status);
          if (this._deleteCompanySubscription != null) this._deleteCompanySubscription.unsubscribe();
        }
      );
    }
  }

  public ComfirmDeleteCompany(): void {
    let currentCompany = this._listCompanyCollectionView.currentItem;
    const userRegistrationlDialogRef = this._matDialogRef.open(DeleteDialogBoxComponent, {
      width: '500px',
      data: {
        objDialogTitle: "Delete Company",
        objComfirmationMessage: ` Delete this ${currentCompany.Company}?`,
      },
      disableClose: true
    });

    userRegistrationlDialogRef.afterClosed().subscribe(result => {
      if (result.message == "Yes") {
        this.DeleteCompany();
      }
    });
  }

  public DetailCompany(companyId: string, eventTitle: string): void {
    const userRegistrationlDialogRef = this._matDialogRef.open(CompanyDetailComponent, {
      width: '1200px',
      height: '550px',
      data: {
        objDialogTitle: eventTitle,
        objCompanyId: companyId,
      },
      disableClose: true
    });

    userRegistrationlDialogRef.afterClosed().subscribe(result => {
      if (result.event !== "Close") {
        this.GetCompanyListData();
      }
    });
  }

  ngOnDestroy() {
    if (this._companyListSubscription !== null) this._companyListSubscription.unsubscribe();
  }
}
