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

import { LabelDetailComponent } from './../label-detail/label-detail.component';
import { AccountDetailComponent } from '../account-detail/account-detail.component';

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
    this.GetLabelListData();
    this.GetAccountListData();
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


  // =============
  // Code Tables
  // =============
  public _listLabelObservableArray: ObservableArray = new ObservableArray();
  public _listLabelCollectionView: CollectionView = new CollectionView(this._listLabelObservableArray);
  public _listLabelPageIndex: number = 15;
  @ViewChild('flexLabel') _flexLabel: wjcGrid.FlexGrid;
  public isLabelProgressBarHidden = false;
  public isLabelDataLoaded: boolean = false;

  private _labelListSubscription: any;
  private _addLabelSubscription: any;
  private _deleteLabelSubscription: any;

  private async GetLabelListData() {
    this._listLabelObservableArray = new ObservableArray();
    this._listLabelCollectionView = new CollectionView(this._listLabelObservableArray);
    this._listLabelCollectionView.pageSize = 15;
    this._listLabelCollectionView.trackChanges = true;
    await this._listLabelCollectionView.refresh();
    await this._flexLabel.refresh();

    this.isLabelProgressBarHidden = true;

    this._labelListSubscription = (await this.systemTablesListService.LabelList()).subscribe(
      (response: any) => {
        var results = response;
        if (results["length"] > 0) {
          this._listLabelObservableArray = results;
          this._listLabelCollectionView = new CollectionView(this._listLabelObservableArray);
          this._listLabelCollectionView.pageSize = 15;
          this._listLabelCollectionView.trackChanges = true;
          this._listLabelCollectionView.refresh();
          this._flexLabel.refresh();
        }

        this.isLabelDataLoaded = true;
        this.isLabelProgressBarHidden = false;
        if (this._labelListSubscription != null) this._labelListSubscription.unsubscribe();
      },
      error => {
        this.snackBarTemplate.snackBarError(this.snackBar, error.error.Message + " " + error.status);
        if (this._labelListSubscription !== null) this._labelListSubscription.unsubscribe();
      }
    );
  }

  birGridClick(s, e) {
    if (wjcCore.hasClass(e.target, 'bir-button-edit')) {
      if (this._userRights.CanEdit) {
        this.EditLabel();
      }

    }

    if (wjcCore.hasClass(e.target, 'bir-button-delete')) {
      if (this._userRights.CanDelete) {
        this.ComfirmDeleteLabel();
      }
    }
  }

  public BtnAddLabel() {

    let objLabel: any = {
      Id: 0,
      Code: '',
      Label: '',
      DisplayedLabel: ''
    }

    this.DetailLabel(objLabel, "Add Label");
  }

  public EditLabel() {
    let currentLabel = this._listLabelCollectionView.currentItem;
    this.DetailLabel(currentLabel, "Edit Label");
  }

  public async AddLabel(objLabel: any) {
    this.buttonDisabled = true;
    if (this.isLabelDataLoaded == true) {
      this.isLabelDataLoaded = false;
      this._addLabelSubscription = (await this.systemTablesListService.AddLabel(objLabel)).subscribe(
        response => {
          this.buttonDisabled = false;
          this.isLabelDataLoaded = true;
          this.GetLabelListData();
          this.snackBarTemplate.snackBarSuccess(this.snackBar, "Added Successfully");
          if (this._addLabelSubscription != null) this._addLabelSubscription.unsubscribe();
        },
        error => {
          this.buttonDisabled = false;
          this.isLabelDataLoaded = true;
          this.snackBarTemplate.snackBarError(this.snackBar, error.error + " " + " Status Code: " + error.status);
          if (this._addLabelSubscription != null) this._addLabelSubscription.unsubscribe();
        }
      );
    }
  }

  public async SaveLabel(objLabel: any) {
    this.buttonDisabled = true;
    if (this.isLabelDataLoaded == true) {
      this.isLabelDataLoaded = false;
      this._addLabelSubscription = (await this.systemTablesListService.SaveLabel(objLabel)).subscribe(
        response => {
          this.buttonDisabled = false;
          this.isLabelDataLoaded = true;
          this.GetLabelListData();
          this.snackBarTemplate.snackBarSuccess(this.snackBar, "Save Successfully");
        },
        error => {
          this.buttonDisabled = false;
          this.isLabelDataLoaded = true;
          this.snackBarTemplate.snackBarError(this.snackBar, error.error + " " + " Status Code: " + error.status);
          if (this._addLabelSubscription != null) this._addLabelSubscription.unsubscribe();
        }
      );
    }
  }

  public async DeleteLabel() {
    if (this.isLabelDataLoaded == true) {
      this.isLabelDataLoaded = false;
      let currentLabel = this._listLabelCollectionView.currentItem;
      this.isLabelProgressBarHidden = true;

      this._deleteLabelSubscription = (await this.systemTablesListService.DeleteLabel(currentLabel.Id)).subscribe(
        response => {
          this.snackBarTemplate.snackBarSuccess(this.snackBar, "Delete Successfully");
          this.GetLabelListData();
          this.isLabelProgressBarHidden = false;
          this.isLabelDataLoaded = true;
        },
        error => {
          this.isLabelDataLoaded = true;
          this.snackBarTemplate.snackBarError(this.snackBar, error.error + " " + error.status);
          if (this._deleteLabelSubscription != null) this._deleteLabelSubscription.unsubscribe();
        }
      );
    }
  }

  public ComfirmDeleteLabel(): void {
    let currentLabel = this._listLabelCollectionView.currentItem;
    const matDialogRef = this.matDialog.open(ComfirmMassageDialogComponent, {
      width: '500px',
      data: {
        objDialogTitle: "",
        objComfirmationMessage: `Delete Label?`,
      },
      disableClose: true
    });

    matDialogRef.afterClosed().subscribe(result => {
      if (result.message == "Yes") {
        this.DeleteLabel();
      }
    });
  }

  public DetailLabel(data: any, eventTitle: string): void {
    const matDialogRef = this.matDialog.open(LabelDetailComponent, {
      width: '500px',
      data: {
        objDialogTitle: eventTitle,
        objData: data,
      },
      disableClose: true
    });

    matDialogRef.afterClosed().subscribe(data => {
      if (data.event != 'Close') {
        let objLabel: any = {
          Id: data.objData.Id,
          Code: data.objData.Code,
          Label: data.objData.Label,
          DisplayedLabel: data.objData.DisplayedLabel
        }

        if (data.event === "Add") {
          this.AddLabel(objLabel);
        }
        if (data.event === "Edit") {
          this.SaveLabel(objLabel);
        }
      }
    });
  }

  // =============
  // Code Tables
  // =============
  public _listAccountObservableArray: ObservableArray = new ObservableArray();
  public _listAccountCollectionView: CollectionView = new CollectionView(this._listAccountObservableArray);
  public _listAccountPageIndex: number = 15;
  @ViewChild('flexAccount') _flexAccount: wjcGrid.FlexGrid;
  public isAccountProgressBarHidden = false;
  public isAccountDataLoaded: boolean = false;

  private _accountListSubscription: any;
  private _addAccountSubscription: any;
  private _deleteAccountSubscription: any;

  private async GetAccountListData() {
    this._listAccountObservableArray = new ObservableArray();
    this._listAccountCollectionView = new CollectionView(this._listAccountObservableArray);
    this._listAccountCollectionView.pageSize = 15;
    this._listAccountCollectionView.trackChanges = true;
    await this._listAccountCollectionView.refresh();
    await this._flexAccount.refresh();

    this.isAccountProgressBarHidden = true;

    this._accountListSubscription = (await this.systemTablesListService.AccountList()).subscribe(
      (response: any) => {
        var results = response;
        if (results["length"] > 0) {
          this._listAccountObservableArray = results;
          this._listAccountCollectionView = new CollectionView(this._listAccountObservableArray);
          this._listAccountCollectionView.pageSize = 15;
          this._listAccountCollectionView.trackChanges = true;
          this._listAccountCollectionView.refresh();
          this._flexAccount.refresh();
        }

        this.isAccountDataLoaded = true;
        this.isAccountProgressBarHidden = false;
        if (this._accountListSubscription != null) this._accountListSubscription.unsubscribe();
      },
      error => {
        this.snackBarTemplate.snackBarError(this.snackBar, error.error.Message + " " + error.status);
        if (this._accountListSubscription !== null) this._accountListSubscription.unsubscribe();
      }
    );
  }

  accountGridClick(s, e) {
    if (wjcCore.hasClass(e.target, 'bir-button-edit')) {
      if (this._userRights.CanEdit) {
        this.EditAccount();
      }

    }

    if (wjcCore.hasClass(e.target, 'bir-button-delete')) {
      if (this._userRights.CanDelete) {
        this.ComfirmDeleteAccount();
      }
    }
  }

  public BtnAddAccount() {

    let objAccount: any = {
      Id: 0,
      AccountCode: '',
      AccountName: '',
      Description: ''
    }

    this.DetailAccount(objAccount, "Add Account");
  }

  public EditAccount() {
    let currentAccount = this._listAccountCollectionView.currentItem;
    this.DetailAccount(currentAccount, "Edit Account");
  }

  public async AddAccount(objAccount: any) {
    this.buttonDisabled = true;
    if (this.isAccountDataLoaded == true) {
      this.isAccountDataLoaded = false;
      this._addAccountSubscription = (await this.systemTablesListService.AddAccount(objAccount)).subscribe(
        response => {
          this.buttonDisabled = false;
          this.isAccountDataLoaded = true;
          this.GetAccountListData();
          this.snackBarTemplate.snackBarSuccess(this.snackBar, "Added Successfully");
          if (this._addAccountSubscription != null) this._addAccountSubscription.unsubscribe();
        },
        error => {
          this.buttonDisabled = false;
          this.isAccountDataLoaded = true;
          this.snackBarTemplate.snackBarError(this.snackBar, error.error + " " + " Status Code: " + error.status);
          if (this._addAccountSubscription != null) this._addAccountSubscription.unsubscribe();
        }
      );
    }
  }

  public async SaveAccount(objAccount: any) {
    this.buttonDisabled = true;
    if (this.isAccountDataLoaded == true) {
      this.isAccountDataLoaded = false;
      this._addAccountSubscription = (await this.systemTablesListService.SaveAccount(objAccount)).subscribe(
        response => {
          this.buttonDisabled = false;
          this.isAccountDataLoaded = true;
          this.GetAccountListData();
          this.snackBarTemplate.snackBarSuccess(this.snackBar, "Save Successfully");
        },
        error => {
          this.buttonDisabled = false;
          this.isAccountDataLoaded = true;
          this.snackBarTemplate.snackBarError(this.snackBar, error.error + " " + " Status Code: " + error.status);
          if (this._addAccountSubscription != null) this._addAccountSubscription.unsubscribe();
        }
      );
    }
  }

  public async DeleteAccount() {
    if (this.isAccountDataLoaded == true) {
      this.isAccountDataLoaded = false;
      let currentAccount = this._listAccountCollectionView.currentItem;
      this.isAccountProgressBarHidden = true;

      this._deleteAccountSubscription = (await this.systemTablesListService.DeleteAccount(currentAccount.Id)).subscribe(
        response => {
          this.snackBarTemplate.snackBarSuccess(this.snackBar, "Delete Successfully");
          this.GetAccountListData();
          this.isAccountProgressBarHidden = false;
          this.isAccountDataLoaded = true;
        },
        error => {
          this.isAccountDataLoaded = true;
          this.snackBarTemplate.snackBarError(this.snackBar, error.error + " " + error.status);
          if (this._deleteAccountSubscription != null) this._deleteAccountSubscription.unsubscribe();
        }
      );
    }
  }

  public ComfirmDeleteAccount(): void {
    let currentAccount = this._listAccountCollectionView.currentItem;
    const matDialogRef = this.matDialog.open(ComfirmMassageDialogComponent, {
      width: '500px',
      data: {
        objDialogTitle: "",
        objComfirmationMessage: `Delete Account?`,
      },
      disableClose: true
    });

    matDialogRef.afterClosed().subscribe(result => {
      if (result.message == "Yes") {
        this.DeleteAccount();
      }
    });
  }

  public DetailAccount(data: any, eventTitle: string): void {
    const matDialogRef = this.matDialog.open(AccountDetailComponent, {
      width: '500px',
      data: {
        objDialogTitle: eventTitle,
        objData: data,
      },
      disableClose: true
    });

    matDialogRef.afterClosed().subscribe(data => {
      if (data.event != 'Close') {
        let objAccount: any = {
          Id: data.objData.Id,
          AccountCode: data.objData.AccountCode,
          AccountName: data.objData.AccountName,
          Description: data.objData.Description
        }

        if (data.event === "Add") {
          this.AddAccount(objAccount);
        }
        if (data.event === "Edit") {
          this.SaveAccount(objAccount);
        }
      }
    });
  }

}
