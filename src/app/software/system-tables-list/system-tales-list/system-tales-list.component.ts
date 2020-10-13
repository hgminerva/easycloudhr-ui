import { Component, OnInit, ViewChild } from '@angular/core';
import * as wjcGrid from '@grapecity/wijmo.grid';
import * as wjcCore from '@grapecity/wijmo';
import { CollectionView, ObservableArray } from '@grapecity/wijmo';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackBarTemplate } from '../../shared/snack-bar-template';

import { SystemTablesListService } from './../system-tables-list.service';
import { SystemTablesCodeTablesDetailComponent } from '../../system-tables-detail/system-tables-code-tables-detail/system-tables-code-tables-detail.component';
import { SoftwareSecurityService, UserModule } from '../../software-security/software-security.service';
import { ComfirmMassageDialogComponent } from '../../shared/comfirm-massage-dialog/comfirm-massage-dialog.component';

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
    this._userRightsSubscription = await (await this._softwareSecurityService.PageModuleRights("System Tables")).subscribe(
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

    await this.GetCategoryDropdownListData();
  }

  private _categoryDropdownSubscription: any;
  public _categoryListDropdown: any = [];
  public _filterCategory = '';

  private async GetCategoryDropdownListData() {
    this._categoryDropdownSubscription = (await this.systemTablesListService.CategoryDropdownList()).subscribe(
      response => {
        this._categoryListDropdown = response;
        this._filterCategory = this._categoryListDropdown[0].Value;
        this.GetCodeTablesListData();
        if (this._categoryDropdownSubscription !== null) this._categoryDropdownSubscription.unsubscribe();
      },
      error => {
        this.snackBarTemplate.snackBarError(this.snackBar, error.error.Message + " " + " Status Code: " + error.status);
      }
    );
  }

  public CategorySelectionChange() {
    this.GetCodeTablesListData();
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
  private deleteCodeTablesSubscription: any;

  private async GetCodeTablesListData() {
    console.log(this._filterCategory);

    this.listCodeTablesObservableArray = new ObservableArray();
    this.listCodeTablesCollectionView = new CollectionView(this.listCodeTablesObservableArray);
    this.listCodeTablesCollectionView.pageSize = 15;
    this.listCodeTablesCollectionView.trackChanges = true;
    await this.listCodeTablesCollectionView.refresh();
    await this.flexCodeTables.refresh();

    this.isTablesCodeProgressBarHidden = true;

    this.codeTableCodeTablesListSubscription = (await this.systemTablesListService.CodeTableList(this._filterCategory)).subscribe(
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

  codeTablesGridClick(s, e) {
    if (wjcCore.hasClass(e.target, 'ct-button-edit')) {
      if (this._userRights.CanEdit) {
        this.EditCodeTable();
      }

    }

    if (wjcCore.hasClass(e.target, 'ct-button-delete')) {
      if (this._userRights.CanDelete) {
        this.ComfirmDeleteCodeTable();
      }
    }
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

      this.deleteCodeTablesSubscription = (await this.systemTablesListService.DeleteCodeTable(currentCodeTables.Id)).subscribe(
        response => {
          this.snackBarTemplate.snackBarSuccess(this.snackBar, "Delete Successfully");
          this.GetCodeTablesListData();
          this.isTablesCodeProgressBarHidden = false;
          this.isTablesCodeDataLoaded = true;
        },
        error => {
          this.isTablesCodeDataLoaded = true;
          this.snackBarTemplate.snackBarError(this.snackBar, error.error + " " + error.status);
          if (this.deleteCodeTablesSubscription != null) this.deleteCodeTablesSubscription.unsubscribe();
        }
      );
    }
  }

  public ComfirmDeleteCodeTable(): void {
    let currentCodeTable = this.listCodeTablesCollectionView.currentItem;
    const matDialogRef = this.matDialog.open(ComfirmMassageDialogComponent, {
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

  public buttonDisabled: boolean = false;

  public async BtnAddCodeTables() {
    if (this.tabGroup.selectedIndex == 0) {
      this.AddCodeTable();
    }

  }

}
