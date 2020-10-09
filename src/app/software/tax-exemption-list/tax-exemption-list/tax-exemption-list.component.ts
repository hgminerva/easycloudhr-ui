import { Component, OnInit, ViewChild } from '@angular/core';
import * as wjcGrid from '@grapecity/wijmo.grid';
import * as wjcCore from '@grapecity/wijmo';
import { CollectionView, ObservableArray } from '@grapecity/wijmo';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackBarTemplate } from '../../shared/snack-bar-template';

import { SoftwareSecurityService, UserModule } from '../../software-security/software-security.service';
import { ComfirmMassageDialogComponent } from '../../shared/comfirm-massage-dialog/comfirm-massage-dialog.component';
import { TaxExemptionListService } from '../tax-exemption-list.service';

@Component({
  selector: 'app-tax-exemption-list',
  templateUrl: './tax-exemption-list.component.html',
  styleUrls: ['./tax-exemption-list.component.css']
})
export class TaxExemptionListComponent implements OnInit {

  constructor(
    private taxExemptionListService: TaxExemptionListService,
    private router: Router,
    private snackBar: MatSnackBar,
    private snackBarTemplate: SnackBarTemplate,
    public matDialog: MatDialog,
    private _softwareSecurityService: SoftwareSecurityService,

  ) { }

    
  ngOnInit() {
    this.Get_userRights();
  }

  @ViewChild('tabGroup') tabGroup;

  private _userRightsSubscription: any;

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
    this._userRightsSubscription = await (await this._softwareSecurityService.PageModuleRights("Tax Exemption")).subscribe(
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
        this.snackBarTemplate.snackBarError(this.snackBar, error.error.Message + " " + error.status);

        if (error.status == "401") {
          this._softwareSecurityService.logOut();
        }
        if (this._userRightsSubscription !== null) this._userRightsSubscription.unsubscribe();
      }
    );

    await this.GetTaxExemptionListData();
  }

  public _createCboShowNumberOfRows: ObservableArray = new ObservableArray();

  public CreateCboShowNumberOfRows(): void {
    for (var i = 0; i <= 4; i++) {
      var rows = 0;
      var rowsString = "";
      if (i == 0) {
        rows = 15;
        rowsString = "Show 15";
      } else if (i == 1) {
        rows = 50;
        rowsString = "Show 50";
      } else if (i == 2) {
        rows = 100;
        rowsString = "Show 100";
      } else if (i == 3) {
        rows = 150;
        rowsString = "Show 150";
      } else {
        rows = 200;
        rowsString = "Show 200";
      }

      this._createCboShowNumberOfRows.push({
        rowNumber: rows,
        rowString: rowsString
      });
    }
  }

  public CboShowNumberOfRowsOnSelectedIndexChanged(): void {
    this.listTaxExemptionCollectionView.pageSize = this.listPageIndex;
    this.listTaxExemptionCollectionView.refresh();
    this.listTaxExemptionCollectionView.refresh();
  }

  // =============
  // Tax Exemption
  // =============
  public listTaxExemptionObservableArray: ObservableArray = new ObservableArray();
  public listTaxExemptionCollectionView: CollectionView = new CollectionView(this.listTaxExemptionObservableArray);
  public listPageIndex: number = 15;
  @ViewChild('flexTaxExemption') flexTaxExemption: wjcGrid.FlexGrid;
  public isTaxExemptionProgressBarHidden = false;
  public isTaxExemptionDataLoaded: boolean = false;

  private taxExemptionListSubscription: any;
  private addTaxExemptionSubscription: any;
  private deleteTaxExemptionubscription: any;

  public buttonDisabled: boolean = false;

  // =============
  // Tax Exemption
  // =============
  private async GetTaxExemptionListData() {
    this.listTaxExemptionObservableArray = new ObservableArray();
    this.listTaxExemptionCollectionView = new CollectionView(this.listTaxExemptionObservableArray);
    this.listTaxExemptionCollectionView.pageSize = 15;
    this.listTaxExemptionCollectionView.trackChanges = true;
    await this.listTaxExemptionCollectionView.refresh();
    await this.flexTaxExemption.refresh();

    this.isTaxExemptionProgressBarHidden = true;

    this.taxExemptionListSubscription = (await this.taxExemptionListService.TaxExemptionList()).subscribe(
      (response: any) => {
        var results = response;
        if (results["length"] > 0) {
          this.listTaxExemptionCollectionView = results;
          this.listTaxExemptionCollectionView = new CollectionView(this.listTaxExemptionCollectionView);
          this.listTaxExemptionCollectionView.pageSize = 15;
          this.listTaxExemptionCollectionView.trackChanges = true;
          this.listTaxExemptionCollectionView.refresh();
          this.flexTaxExemption.refresh();
        }

        this.isTaxExemptionDataLoaded = true;
        this.isTaxExemptionProgressBarHidden = false;

        if (this.taxExemptionListSubscription != null) this.taxExemptionListSubscription.unsubscribe();
      },
      error => {
        this.snackBarTemplate.snackBarError(this.snackBar, error.error.Message + " " + error.status);
        if (this.taxExemptionListSubscription !== null) this.taxExemptionListSubscription.unsubscribe();
      }
    );
  }

  taxExemptionGridClick(s, e) {
    if (wjcCore.hasClass(e.target, 'te-button-edit')) {
      if (this._userRights.CanEdit) {
        this.EditTaxExemption();
      }

    }

    if (wjcCore.hasClass(e.target, 'te-button-delete')) {
      if (this._userRights.CanDelete) {
        this.ComfirmDeleteTaxExemption();
      }
    }
  }

  public async AddTaxExemption(objTaxExemption: any) {
    this.buttonDisabled = true;
    if (this.isTaxExemptionDataLoaded == true) {
      this.isTaxExemptionDataLoaded = false;
      this.addTaxExemptionSubscription = (await this.taxExemptionListService.AddTaxExemption(objTaxExemption)).subscribe(
        response => {
          this.buttonDisabled = false;
          this.isTaxExemptionDataLoaded = true;
          this.GetTaxExemptionListData();
          this.snackBarTemplate.snackBarSuccess(this.snackBar, "Added Successfully");
          if (this.addTaxExemptionSubscription != null) this.addTaxExemptionSubscription.unsubscribe();
        },
        error => {
          this.buttonDisabled = false;
          this.isTaxExemptionDataLoaded = true;
          this.snackBarTemplate.snackBarError(this.snackBar, error.error + " " + " Status Code: " + error.status);
          if (this.addTaxExemptionSubscription != null) this.addTaxExemptionSubscription.unsubscribe();
        }
      );
    }
  }

  public async SaveTaxExemption(objTaxExemption: any) {
    this.buttonDisabled = true;
    if (this.isTaxExemptionDataLoaded == true) {
      this.isTaxExemptionDataLoaded = false;
      this.addTaxExemptionSubscription = (await this.taxExemptionListService.SaveTaxExemption(objTaxExemption)).subscribe(
        response => {
          this.buttonDisabled = false;
          this.isTaxExemptionDataLoaded = true;
          this.GetTaxExemptionListData();
          this.snackBarTemplate.snackBarSuccess(this.snackBar, "Added Successfully");
        },
        error => {
          this.buttonDisabled = false;
          this.isTaxExemptionDataLoaded = true;
          this.snackBarTemplate.snackBarError(this.snackBar, error.error + " " + " Status Code: " + error.status);
          if (this.addTaxExemptionSubscription != null) this.addTaxExemptionSubscription.unsubscribe();
        }
      );
    }
  }

  public Add_TaxExemption() {
    let objCodeTable: any = { Id: 0, TaxExemptionCode: 'NA', ExemptionAmount: '0.00', DependentAmount: '0.00' };
  }

  public EditTaxExemption() {
    let currentTaxExemption = this.listTaxExemptionCollectionView.currentItem;
  }

  public async DeleteTaxExemption() {
    if (this.isTaxExemptionDataLoaded == true) {
      this.isTaxExemptionDataLoaded = false;
      let currentTaxExemption = this.listTaxExemptionCollectionView.currentItem;
      this.isTaxExemptionProgressBarHidden = true;

      this.deleteTaxExemptionubscription = (await this.taxExemptionListService.DeleteTaxExemption(currentTaxExemption.Id)).subscribe(
        response => {
          this.snackBarTemplate.snackBarSuccess(this.snackBar, "Delete Successfully");
          this.GetTaxExemptionListData();
          this.isTaxExemptionProgressBarHidden = false;
          this.isTaxExemptionDataLoaded = true;
        },
        error => {
          this.isTaxExemptionDataLoaded = true;
          this.snackBarTemplate.snackBarError(this.snackBar, error.error + " " + error.status);
          if (this.deleteTaxExemptionubscription != null) this.deleteTaxExemptionubscription.unsubscribe();
        }
      );
    }
  }

  public ComfirmDeleteTaxExemption(): void {
    let currentTaxExemption = this.listTaxExemptionCollectionView.currentItem;

    const matDialogRef = this.matDialog.open(ComfirmMassageDialogComponent, {
      width: '500px',
      data: {
        objDialogTitle: "Delete Tax Exemption",
        objComfirmationMessage: `Delete ${currentTaxExemption.TaxExemptionCode}?`,
      },
      disableClose: true
    });

    matDialogRef.afterClosed().subscribe(result => {
      if (result.message == "Yes") {
        this.DeleteTaxExemption();
      }
    });
  }


}
