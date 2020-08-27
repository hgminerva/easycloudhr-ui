import { Component, OnInit, ViewChild } from '@angular/core';
import * as wjcGrid from '@grapecity/wijmo.grid';
import { CollectionView, ObservableArray } from '@grapecity/wijmo';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackBarTemplate } from '../../shared/snack-bar-template';

import { SystemTablesListService } from './../system-tables-list.service';
import { DeleteDialogBoxComponent } from '../../shared/delete-dialog-box/delete-dialog-box.component';
import { SystemTablesCodeTablesDetailComponent } from '../../system-tables-detail/system-tables-code-tables-detail/system-tables-code-tables-detail.component';
import { SystemTablesTaxExemptionDetailComponent } from '../../system-tables-detail/system-tables-tax-exemption-detail/system-tables-tax-exemption-detail.component';

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
    public matDialog: MatDialog,

  ) { }

  ngOnInit() {
    this.GetCodeTablesListData();
    this.GetTaxExemptionListData();
  }

  // =============
  // Code Tables
  // =============
  public listCodeTablesObservableArray: ObservableArray = new ObservableArray();
  public listCodeTablesCollectionView: CollectionView = new CollectionView(this.listCodeTablesObservableArray);
  public listTablesCodePageIndex: number = 15;
  @ViewChild('flexCodeTables') flexCodeTables: wjcGrid.FlexGrid;
  public isTablesCodeProgressBarHidden = false;
  public isTablesCodeDataLoaded: boolean = false;

  private codeTableCodeTablesListSubscription: any;
  private addCodeTablesSubscription: any;
  private aeleteCodeTablesSubscription: any;

  private async GetCodeTablesListData() {
    this.listCodeTablesObservableArray = new ObservableArray();
    this.listCodeTablesCollectionView = new CollectionView(this.listCodeTablesObservableArray);
    this.listCodeTablesCollectionView.pageSize = 15;
    this.listCodeTablesCollectionView.trackChanges = true;
    await this.listCodeTablesCollectionView.refresh();
    await this.flexCodeTables.refresh();

    this.isTablesCodeProgressBarHidden = true;

    this.codeTableCodeTablesListSubscription = (await this.systemTablesListService.CodeTableList()).subscribe(
      (response: any) => {
        var results = response;
        if (results["length"] > 0) {
          this.listCodeTablesCollectionView = results;
          this.listCodeTablesCollectionView = new CollectionView(this.listCodeTablesCollectionView);
          this.listCodeTablesCollectionView.pageSize = 15;
          this.listCodeTablesCollectionView.trackChanges = true;
          this.listCodeTablesCollectionView.refresh();
          this.flexCodeTables.refresh();
        }

        this.isTablesCodeDataLoaded = true;
        this.isTablesCodeProgressBarHidden = false;
        if (this.codeTableCodeTablesListSubscription != null) this.codeTableCodeTablesListSubscription.unsubscribe();
      },
      error => {
        this.snackBarTemplate.snackBarError(this.snackBar, error.error.Message + " " + error.status);
        if (this.codeTableCodeTablesListSubscription !== null) this.codeTableCodeTablesListSubscription.unsubscribe();
      }
    );
  }

  public AddCodeTable() {
    let objCodeTable: any = { Id: 0, Code: 'NA', Value: 'NA', Category: 'NA' };
    this.DetailCodeTable(objCodeTable, "Add Table Code");
  }

  public EditCodeTable() {
    let currentCodeTables = this.listCodeTablesCollectionView.currentItem;
    this.DetailCodeTable(currentCodeTables, "Edit Table Code");
  }

  public async AddCodeTables(objTableCode: any) {
    this.buttonDisabled = true;
    if (this.isTablesCodeDataLoaded == true) {
      this.isTablesCodeDataLoaded = false;
      this.addCodeTablesSubscription = (await this.systemTablesListService.AddCodeTable(objTableCode)).subscribe(
        response => {
          this.buttonDisabled = false;
          this.isTablesCodeDataLoaded = true;
          this.GetCodeTablesListData();
          this.snackBarTemplate.snackBarSuccess(this.snackBar, "Added Successfully");
          if (this.addCodeTablesSubscription != null) this.addCodeTablesSubscription.unsubscribe();
        },
        error => {
          this.buttonDisabled = false;
          this.isTablesCodeDataLoaded = true;
          this.snackBarTemplate.snackBarError(this.snackBar, error.error + " " + " Status Code: " + error.status);
          if (this.addCodeTablesSubscription != null) this.addCodeTablesSubscription.unsubscribe();
        }
      );
    }
  }

  public async SaveCodeTable(objTableCode: any) {
    this.buttonDisabled = true;
    if (this.isTablesCodeDataLoaded == true) {
      this.isTablesCodeDataLoaded = false;
      this.addCodeTablesSubscription = (await this.systemTablesListService.SaveCodeTable(objTableCode)).subscribe(
        response => {
          this.buttonDisabled = false;
          this.isTablesCodeDataLoaded = true;
          this.GetCodeTablesListData();
          this.snackBarTemplate.snackBarSuccess(this.snackBar, "Added Successfully");
        },
        error => {
          this.buttonDisabled = false;
          this.isTablesCodeDataLoaded = true;
          this.snackBarTemplate.snackBarError(this.snackBar, error.error + " " + " Status Code: " + error.status);
          if (this.addCodeTablesSubscription != null) this.addCodeTablesSubscription.unsubscribe();
        }
      );
    }
  }

  public async DeleteCodeTables() {
    if (this.isTablesCodeDataLoaded == true) {
      this.isTablesCodeDataLoaded = false;
      let currentCodeTables = this.listCodeTablesCollectionView.currentItem;
      this.isTablesCodeProgressBarHidden = true;

      this.aeleteCodeTablesSubscription = (await this.systemTablesListService.DeleteCodeTable(currentCodeTables.Id)).subscribe(
        response => {
          this.snackBarTemplate.snackBarSuccess(this.snackBar, "Delete Successfully");
          this.GetCodeTablesListData();
          this.isTablesCodeProgressBarHidden = false;
          this.isTablesCodeDataLoaded = true;
        },
        error => {
          this.isTablesCodeDataLoaded = true;
          this.snackBarTemplate.snackBarError(this.snackBar, error.error + " " + error.status);
          if (this.aeleteCodeTablesSubscription != null) this.aeleteCodeTablesSubscription.unsubscribe();
        }
      );
    }
  }

  public ComfirmDeleteCodeTable(): void {
    let currentCodeTable = this.listCodeTablesCollectionView.currentItem;
    const matDialogRef = this.matDialog.open(DeleteDialogBoxComponent, {
      width: '500px',
      data: {
        objDialogTitle: "Delete Tables Code",
        objComfirmationMessage: `Delete ${currentCodeTable.Code}?`,
      },
      disableClose: true
    });

    matDialogRef.afterClosed().subscribe(result => {
      if (result.message == "Yes") {
        this.DeleteCodeTables();
      }
    });
  }

  activeTab() { }

  public DetailCodeTable(data: any[], eventTitle: string): void {
    const matDialogRef = this.matDialog.open(SystemTablesCodeTablesDetailComponent, {
      width: '800px',
      data: {
        objDialogTitle: eventTitle,
        objData: data,
      },
      disableClose: true
    });

    matDialogRef.afterClosed().subscribe(data => {
      if (data.event === "Add") {
        this.AddCodeTables(data.objData);
      }
      if (data.event === "Edit") {
        this.SaveCodeTable(data.objData);
      }
    });
  }


  // =============
  // Tax Exemption
  // =============
  public listTaxExemptionObservableArray: ObservableArray = new ObservableArray();
  public listTaxExemptionCollectionView: CollectionView = new CollectionView(this.listTaxExemptionObservableArray);
  public listTaxExemptionPageIndex: number = 15;
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

    this.taxExemptionListSubscription = (await this.systemTablesListService.TaxExemptionList()).subscribe(
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

  public async AddTaxExemption(objTaxExemption: any) {
    this.buttonDisabled = true;
    if (this.isTaxExemptionDataLoaded == true) {
      this.isTaxExemptionDataLoaded = false;
      this.addCodeTablesSubscription = (await this.systemTablesListService.AddTaxExemption(objTaxExemption)).subscribe(
        response => {
          this.buttonDisabled = false;
          this.isTaxExemptionDataLoaded = true;
          this.GetTaxExemptionListData();
          this.snackBarTemplate.snackBarSuccess(this.snackBar, "Added Successfully");
          if (this.addCodeTablesSubscription != null) this.addCodeTablesSubscription.unsubscribe();
        },
        error => {
          this.buttonDisabled = false;
          this.isTaxExemptionDataLoaded = true;
          this.snackBarTemplate.snackBarError(this.snackBar, error.error + " " + " Status Code: " + error.status);
          if (this.addCodeTablesSubscription != null) this.addCodeTablesSubscription.unsubscribe();
        }
      );
    }
  }

  public async SaveTaxExemption(objTaxExemption: any) {
    this.buttonDisabled = true;
    if (this.isTaxExemptionDataLoaded == true) {
      this.isTaxExemptionDataLoaded = false;
      this.addCodeTablesSubscription = (await this.systemTablesListService.SaveTaxExemption(objTaxExemption)).subscribe(
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
          if (this.addCodeTablesSubscription != null) this.addCodeTablesSubscription.unsubscribe();
        }
      );
    }
  }


  public Add_TaxExemption() {
    let objCodeTable: any = { Id: 0, TaxExemptionCode: 'NA', ExemptionAmount: '0.00', DependentAmount: '0.00' };
    this.DetailTaxExemption(objCodeTable, "Add Tax Exemption");
  }

  public EditTaxExemption() {
    let currentTaxExemption = this.listTaxExemptionCollectionView.currentItem;
    this.DetailTaxExemption(currentTaxExemption, "Edit Tax Exemption");
  }

  public async DeleteTaxExemption() {
    if (this.isTaxExemptionDataLoaded == true) {
      this.isTaxExemptionDataLoaded = false;
      let currentTaxExemption = this.listTaxExemptionCollectionView.currentItem;
      this.isTaxExemptionProgressBarHidden = true;

      this.deleteTaxExemptionubscription = (await this.systemTablesListService.DeleteTaxExemption(currentTaxExemption.Id)).subscribe(
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

    const matDialogRef = this.matDialog.open(DeleteDialogBoxComponent, {
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

  public DetailTaxExemption(data: any[], eventTitle: string): void {
    const matDialogRef = this.matDialog.open(SystemTablesTaxExemptionDetailComponent, {
      width: '800px',
      data: {
        objDialogTitle: eventTitle,
        objData: data,
      },
      disableClose: true
    });

    matDialogRef.afterClosed().subscribe(data => {
      if (data.event === "Add") {
        this.AddTaxExemption(data.objData);
      }
      if (data.event === "Edit") {
        this.SaveTaxExemption(data.objData);
      }
    });
  }

  @ViewChild('tabGroup') tabGroup;
  
  public async BtnAddCodeTables() {
    if (this.tabGroup.selectedIndex == 0) {
      this.AddCodeTable();
    }

    if (this.tabGroup.selectedIndex == 1) {
      this.Add_TaxExemption();
    }
  }
}
