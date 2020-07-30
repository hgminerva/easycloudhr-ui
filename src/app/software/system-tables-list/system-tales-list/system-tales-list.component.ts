import { Component, OnInit, ViewChild } from '@angular/core';
import * as wjcGrid from '@grapecity/wijmo.grid';
import { CollectionView, ObservableArray } from '@grapecity/wijmo';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackBarTemplate } from '../../shared/snack-bar-template';

import { SystemTablesListService } from './../system-tables-list.service';
import { DeleteDialogBoxComponent } from '../../shared/delete-dialog-box/delete-dialog-box.component';

@Component({
  selector: 'app-system-tales-list',
  templateUrl: './system-tales-list.component.html',
  styleUrls: ['./system-tales-list.component.css']
})
export class SystemTalesListComponent implements OnInit {

  constructor(
    private systemTablesListService: SystemTablesListService,
    private router: Router,
    private snackBar: MatSnackBar,
    private snackBarTemplate: SnackBarTemplate,
    public DeleteConfirmDialog: MatDialog,
  ) { }

  async ngOnInit() {
    // await this.GetTaxExemptionListData();
  }

  // =============
  // Tax Exemption
  // =============
  public listTaxExemptionObservableArray: ObservableArray = new ObservableArray();
  public listTaxExemptionCollectionView: CollectionView = new CollectionView(this.listTaxExemptionObservableArray);
  public listTaxExemptionPageIndex: number = 15;
  @ViewChild('flexTaxExemption') flexTaxExemption: wjcGrid.FlexGrid;
  public isTaxExemptionProgressBarHidden = false;
  public isDataLoaded: boolean = false;

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

    this.taxExemptionListSubscription = await (await this.systemTablesListService.TaxExemptionList()).subscribe(
      (response: any) => {
        var results = response;
        console.log("Response:", results);

        if (results["length"] > 0) {
          this.listTaxExemptionCollectionView = results;
          this.listTaxExemptionCollectionView = new CollectionView(this.listTaxExemptionCollectionView);
          this.listTaxExemptionCollectionView.pageSize = 15;
          this.listTaxExemptionCollectionView.trackChanges = true;
          this.listTaxExemptionCollectionView.refresh();
          this.flexTaxExemption.refresh();
        }

        this.isDataLoaded = true;
        this.isTaxExemptionProgressBarHidden = false;

        if (this.taxExemptionListSubscription != null) this.taxExemptionListSubscription.unsubscribe();
      },
      error => {
        this.snackBarTemplate.snackBarError(this.snackBar, error.error.Message + " " + error.status);
        if (this.taxExemptionListSubscription !== null) this.taxExemptionListSubscription.unsubscribe();
      }
    );
  }

  public async AddTaxExemption() {
    // this.buttonDisabled = true;
    // if (this.isDataLoaded == true) {
    //   this.isDataLoaded = false;
    //   this.addTaxExemptionSubscription = await (await this.systemTablesListService.AddTaxExemption()).subscribe(
    //     response => {
    //       this.buttonDisabled = false;
    //       this.isDataLoaded = true;
    //       this.GetTaxExemptionListData();
    //       this.snackBarTemplate.snackBarSuccess(this.snackBar, "Added Successfully");
    //     },
    //     error => {
    //       this.buttonDisabled = false;
    //       this.isDataLoaded = true;
    //       this.snackBarTemplate.snackBarError(this.snackBar, error.error + " " + " Status Code: " + error.status);
    //       if (this.addTaxExemptionSubscription != null) this.addTaxExemptionSubscription.unsubscribe();
    //     }
    //   );
    // }
  }

  public EditTaxExemption() {
    let currentTaxExemption = this.listTaxExemptionCollectionView.currentItem;
  }

  public async DeleteTaxExemption() {
    if (this.isDataLoaded == true) {
      this.isDataLoaded = false;
      let currentTaxExemption = this.listTaxExemptionCollectionView.currentItem;
      this.isTaxExemptionProgressBarHidden = true;

      this.deleteTaxExemptionubscription = await (await this.systemTablesListService.DeleteTaxExemption(currentTaxExemption.Id)).subscribe(
        response => {
          this.snackBarTemplate.snackBarSuccess(this.snackBar, "Delete Successfully");
          this.GetTaxExemptionListData();
          this.isTaxExemptionProgressBarHidden = false;
          this.isDataLoaded = true;
        },
        error => {
          this.isDataLoaded = true;
          this.snackBarTemplate.snackBarError(this.snackBar, error.error + " " + error.status);
          if (this.deleteTaxExemptionubscription != null) this.deleteTaxExemptionubscription.unsubscribe();
        }
      );
    }
  }

  public ComfirmDeleteTaxExemption(): void {
    let currentTaxExemption = this.listTaxExemptionCollectionView.currentItem;

    const userRegistrationlDialogRef = this.DeleteConfirmDialog.open(DeleteDialogBoxComponent, {
      width: '500px',
      data: {
        objDialogTitle: "Delete Tax Exemption",
        objComfirmationMessage: `Delete this ${currentTaxExemption.Shift}?`,
      },
      disableClose: true
    });

    userRegistrationlDialogRef.afterClosed().subscribe(result => {
      if (result.message == "Yes") {
        this.DeleteTaxExemption();
      }
    });
  }

  public listCodeTablesObservableArray: ObservableArray = new ObservableArray();
  public listCodeTablesCollectionView: CollectionView = new CollectionView(this.listCodeTablesObservableArray);
  public listTablesCodePageIndex: number = 15;
  @ViewChild('flexCodeTables') flexCodeTables: wjcGrid.FlexGrid;
  public isTablesCodeProgressBarHidden = false;
  // public isDataLoaded: boolean = false;

  private codeTableCodeTablesListSubscription: any;
  private AddCodeTablesSubscription: any;
  private DeleteCodeTablesSubscription: any;

  private async GetCodeTablesListData() {
    this.listCodeTablesObservableArray = new ObservableArray();
    this.listCodeTablesCollectionView = new CollectionView(this.listCodeTablesObservableArray);
    this.listCodeTablesCollectionView.pageSize = 15;
    this.listCodeTablesCollectionView.trackChanges = true;
    await this.listCodeTablesCollectionView.refresh();
    await this.flexCodeTables.refresh();

    this.isTablesCodeProgressBarHidden = true;

    this.codeTableCodeTablesListSubscription = await (await this.systemTablesListService.TaxCodeTableList()).subscribe(
      (response: any) => {
        var results = response;
        console.log("Response:", results);

        if (results["length"] > 0) {
          this.listCodeTablesCollectionView = results;
          this.listCodeTablesCollectionView = new CollectionView(this.listCodeTablesCollectionView);
          this.listCodeTablesCollectionView.pageSize = 15;
          this.listCodeTablesCollectionView.trackChanges = true;
          this.listCodeTablesCollectionView.refresh();
          this.flexCodeTables.refresh();
        }

        this.isDataLoaded = true;
        this.isTablesCodeProgressBarHidden = false;

        if (this.codeTableCodeTablesListSubscription != null) this.codeTableCodeTablesListSubscription.unsubscribe();
      },
      error => {
        this.snackBarTemplate.snackBarError(this.snackBar, error.error.Message + " " + error.status);
        if (this.codeTableCodeTablesListSubscription !== null) this.codeTableCodeTablesListSubscription.unsubscribe();
      }
    );
  }

  public async AddCodeTables() {
    // this.buttonDisabled = true;
    // if (this.isDataLoaded == true) {
    //   this.isDataLoaded = false;
    //   this.AddCodeTablesSubscription = await (await this.systemTablesListService.AddCodeTable()).subscribe(
    //     response => {
    //       this.buttonDisabled = false;
    //       this.isDataLoaded = true;
    //       this.GetCodeTablesListData();
    //       this.snackBarTemplate.snackBarSuccess(this.snackBar, "Added Successfully");
    //     },
    //     error => {
    //       this.buttonDisabled = false;
    //       this.isDataLoaded = true;
    //       this.snackBarTemplate.snackBarError(this.snackBar, error.error + " " + " Status Code: " + error.status);
    //       if (this.AddCodeTablesSubscription != null) this.AddCodeTablesSubscription.unsubscribe();
    //     }
    //   );
    // }
  }

  public EditCodeTables() {
    let currentCodeTables = this.listCodeTablesCollectionView.currentItem;
  }

  public async DeleteCodeTables() {
    if (this.isDataLoaded == true) {
      this.isDataLoaded = false;
      let currentCodeTables = this.listCodeTablesCollectionView.currentItem;
      this.isTablesCodeProgressBarHidden = true;

      this.DeleteCodeTablesSubscription = await (await this.systemTablesListService.DeleteCodeTable(currentCodeTables.Id)).subscribe(
        response => {
          this.snackBarTemplate.snackBarSuccess(this.snackBar, "Delete Successfully");
          this.GetCodeTablesListData();
          this.isTablesCodeProgressBarHidden = false;
          this.isDataLoaded = true;
        },
        error => {
          this.isDataLoaded = true;
          this.snackBarTemplate.snackBarError(this.snackBar, error.error + " " + error.status);
          if (this.DeleteCodeTablesSubscription != null) this.DeleteCodeTablesSubscription.unsubscribe();
        }
      );
    }
  }

  public ComfirmDeleteCodeTables(): void {
    let currentCodeTables = this.listCodeTablesCollectionView.currentItem;
    const userRegistrationlDialogRef = this.DeleteConfirmDialog.open(DeleteDialogBoxComponent, {
      width: '500px',
      data: {
        objDialogTitle: "Delete Tables Code",
        objComfirmationMessage: `Delete this ${currentCodeTables.Shift}?`,
      },
      disableClose: true
    });

    userRegistrationlDialogRef.afterClosed().subscribe(result => {
      if (result.message == "Yes") {
        this.DeleteCodeTables();
      }
    });
  }

  activeTab() {

  }
}
