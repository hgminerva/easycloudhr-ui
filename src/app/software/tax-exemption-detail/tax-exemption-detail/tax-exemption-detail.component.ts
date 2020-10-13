import { Component, OnInit, ViewChild } from '@angular/core';
import * as wjcCore from '@grapecity/wijmo';
import * as wjcGrid from '@grapecity/wijmo.grid';
import { CollectionView, ObservableArray } from '@grapecity/wijmo';

import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackBarTemplate } from '../../shared/snack-bar-template';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';

import { TaxExemptionModel } from './../tax-exemption.model';
import { TaxExemptionTableModel } from './../tax-exemption-table.model';
import { TaxExemptionDetailService } from '../tax-exemption-detail.service';
import { SoftwareSecurityService, UserModule } from '../../software-security/software-security.service';
import { ComfirmMassageDialogComponent } from '../../shared/comfirm-massage-dialog/comfirm-massage-dialog.component';
import { DecimalPipe } from '@angular/common';
import { TaxExemptionTableDialogComponent } from '../tax-exemption-table-dialog/tax-exemption-table-dialog.component';

@Component({
  selector: 'app-tax-exemption-detail',
  templateUrl: './tax-exemption-detail.component.html',
  styleUrls: ['./tax-exemption-detail.component.css']
})

export class TaxExemptionDetailComponent implements OnInit {

  constructor(private taxExemptionDetailService: TaxExemptionDetailService,
    private activatedRoute: ActivatedRoute,
    private snackBar: MatSnackBar,
    private snackBarTemplate: SnackBarTemplate,
    public shiftLineDetailDialog: MatDialog,
    public deleteTaxExemptionTableDetailDialog: MatDialog,
    private _softwareSecurityService: SoftwareSecurityService,
    private decimalPipe: DecimalPipe,
  ) { }

  ngOnInit(): void {
    this.Get_userRights();
  }

  public title = '';
  public event = 'Close';

  private _userRightsSubscription: any;
  public _canEdit: boolean = false;

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
    this._userRightsSubscription = await (await this._softwareSecurityService.PageModuleRights("Tax Exemption Detail")).subscribe(
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
        if (this._userRightsSubscription !== null) this._userRightsSubscription.unsubscribe();
      }
    );

    await this.GetTaxExemptionDetail();
  }



  public isDataLoaded: boolean = false;
  public isProgressBarHidden: boolean = false;

  private taxExemptionDetailSubscription: any;
  private saveTaxExemptionDetailSubscription: any;

  public btnSaveDisabled: boolean = true;

  public isLocked: boolean = false;
  public isComponentsShown: boolean = false;

  public _listTaxExemptionTableObservableArray: ObservableArray = new ObservableArray();
  public _listTaxExemptionTableCollectionView: CollectionView = new CollectionView(this._listTaxExemptionTableObservableArray);
  public _listPageIndex: number = 15;

  public _isTaxExemptionTableProgressBarHidden = false;
  public _isDataLoaded: boolean = false;

  private _taxExemptionTableListSubscription: any;
  private _addTaxExemptionTableSubscription: any;
  private _deleteTaxExemptionTableSubscription: any;

  public _btnAddTaxExemptionTableDisabled: boolean = false;

  // DOM declaration
  @ViewChild('flexTaxExemptionTable') flexTaxExemptionTable: wjcGrid.FlexGrid;

  public taxExemption: TaxExemptionModel = {
    Id: 0,
    TaxExemptionCode: '',
    ExemptionAmount: '0',
    DependentAmount: '0',
  }

  private async GetTaxExemptionDetail() {
    let id = 0;
    this.activatedRoute.params.subscribe(params => { id = params["id"]; });
    this.disableButtons();
    this.isComponentsShown = false;
    this.taxExemptionDetailSubscription = (await this.taxExemptionDetailService.TaxExemptionDetail(id)).subscribe(
      (response: any) => {
        let result = response;
        console.log(result);
        if (result != null) {
          this.taxExemption.Id = result["Id"];
          this.taxExemption.TaxExemptionCode = result["TaxExemptionCode"];
          this.taxExemption.ExemptionAmount = this.decimalPipe.transform(result["ExemptionAmount"], "1.2-2");
          this.taxExemption.DependentAmount = this.decimalPipe.transform(result["DependentAmount"], "1.2-2");
        }
        this.GetTaxExemptionTableListData();

        this.loadComponent();
        this.isDataLoaded = true;
        this.isComponentsShown = true;
        if (this.taxExemptionDetailSubscription !== null) this.taxExemptionDetailSubscription.unsubscribe();
      },
      error => {
        this.isDataLoaded = true;
        this.snackBarTemplate.snackBarError(this.snackBar, error.error + " " + " Status Code: " + error.status);
        if (this.taxExemptionDetailSubscription !== null) this.taxExemptionDetailSubscription.unsubscribe();
      }
    );
  }

  public async SaveTaxExemptionDetail() {
    this.disableButtons();
    if (this.isDataLoaded == true) {
      this.isDataLoaded = false;
      this.saveTaxExemptionDetailSubscription = await (await this.taxExemptionDetailService.SaveTaxExemption(this.taxExemption.Id, this.taxExemption)).subscribe(
        response => {
          this.event = "Save";
          this.isDataLoaded = true;
          this.loadComponent();
          this.snackBarTemplate.snackBarSuccess(this.snackBar, "Save Successfully.");
          if (this.saveTaxExemptionDetailSubscription !== null) this.saveTaxExemptionDetailSubscription.unsubscribe();
        },
        error => {
          this.loadComponent();
          this.isDataLoaded = true;
          this.snackBarTemplate.snackBarError(this.snackBar, error.error + " " + " Status Code: " + error.status);
          if (this.saveTaxExemptionDetailSubscription !== null) this.saveTaxExemptionDetailSubscription.unsubscribe();
        }
      );
    }
  }
 
  // ==================
  // Component Behavior
  // ==================
  private loadComponent() {
    // this._btnAddTaxExemptionTableDisabled = isDisabled;
    // this.btnSaveDisabled = isDisabled;


    // if (this._userRights.CanEdit == false) {
    //   this._canEdit = false;
    //   this.isLocked = true;
    // } else {
    //   this._canEdit = !isDisabled;
    //   this.isLocked = isDisabled;
    // }

    this.isProgressBarHidden = false;
  }

  private disableButtons() {
    this.btnSaveDisabled = true;
    this.isProgressBarHidden = true;
  }


  formatValueExemptionAmount() {
    if (this.taxExemption.ExemptionAmount == '') {
      this.taxExemption.ExemptionAmount = this.decimalPipe.transform(0, "1.2-2");
    } else {
      this.taxExemption.ExemptionAmount = this.decimalPipe.transform(this.taxExemption.ExemptionAmount, "1.2-2");
    }
  }

  formatValueDependentAmount() {
    if (this.taxExemption.DependentAmount == '') {
      this.taxExemption.DependentAmount = this.decimalPipe.transform(0, "1.2-2");
    } else {
      this.taxExemption.DependentAmount = this.decimalPipe.transform(this.taxExemption.DependentAmount, "1.2-2");
    }
  }

  public RemoveComma(value: string): string {
    return value.toString().replace(/,/g, '');
  }

  public inputTypeExemptionAmount = 'text';
  public inputTypeDependentAmount = 'text';

  ExemptionAmountFormatValueFocusOut() {
    this.inputTypeExemptionAmount = 'text';

    if (this.taxExemption.ExemptionAmount == '') {
      this.taxExemption.ExemptionAmount = this.decimalPipe.transform(0, "1.2-2");
    } else {
      this.taxExemption.ExemptionAmount = this.decimalPipe.transform(this.taxExemption.ExemptionAmount, "1.2-2");
    }
  }

  ExemptionAmountToNumberTypeFocus() {
    this.taxExemption.ExemptionAmount = this.RemoveComma(this.taxExemption.ExemptionAmount);
    this.inputTypeExemptionAmount = 'number';
  }

  DependentAmountFormatValueFocusOut() {
    this.inputTypeDependentAmount = 'text';

    if (this.taxExemption.DependentAmount == '') {
      this.taxExemption.DependentAmount = this.decimalPipe.transform(0, "1.2-2");
    } else {
      this.taxExemption.DependentAmount = this.decimalPipe.transform(this.taxExemption.DependentAmount, "1.2-2");
    }
  }

  DependentAmountToNumberTypeFocus() {
    this.taxExemption.DependentAmount = this.RemoveComma(this.taxExemption.DependentAmount);
    this.inputTypeDependentAmount = 'number';
  }

  // Class properties
  private async GetTaxExemptionTableListData() {
    this._listTaxExemptionTableObservableArray = new ObservableArray();
    this._listTaxExemptionTableCollectionView = new CollectionView(this._listTaxExemptionTableObservableArray);
    this._listTaxExemptionTableCollectionView.pageSize = 15;
    this._listTaxExemptionTableCollectionView.trackChanges = true;
    await this._listTaxExemptionTableCollectionView.refresh();
    await this.flexTaxExemptionTable.refresh();

    this._isTaxExemptionTableProgressBarHidden = true;

    this._taxExemptionTableListSubscription = (await this.taxExemptionDetailService.TaxExemptionTableList(this.taxExemption.Id)).subscribe(
      (response: any) => {
        var results = response;

        if (results["length"] > 0) {
          this._listTaxExemptionTableObservableArray = results;
          this._listTaxExemptionTableCollectionView = new CollectionView(this._listTaxExemptionTableObservableArray);
          this._listTaxExemptionTableCollectionView.pageSize = 15;
          this._listTaxExemptionTableCollectionView.trackChanges = true;
          this._listTaxExemptionTableCollectionView.refresh();
          this.flexTaxExemptionTable.refresh();
        }

        this._isDataLoaded = true;
        this._isTaxExemptionTableProgressBarHidden = false;

        if (this._taxExemptionTableListSubscription != null) this._taxExemptionTableListSubscription.unsubscribe();
      },
      error => {
        this.snackBarTemplate.snackBarError(this.snackBar, error.error.Message + " " + error.status);
        if (this._taxExemptionTableListSubscription !== null) this._taxExemptionTableListSubscription.unsubscribe();
      }
    );
  }

  gridClick(s, e) {
    if (wjcCore.hasClass(e.target, 'button-edit')) {
      if (this._userRights.CanEdit) {
        this.EditTaxExemptionTable();
      }

    }

    if (wjcCore.hasClass(e.target, 'button-delete')) {
      if (this._userRights.CanDelete) {
        this.ComfirmDeleteTaxExemptionTable();
      }
    }
  }

  public async AddTaxExemptionTable(objTaxExemptionTable: TaxExemptionTableModel) {
    this._btnAddTaxExemptionTableDisabled = true;
    if (this._isDataLoaded == true) {
      this._isDataLoaded = false;
      this._addTaxExemptionTableSubscription = (await this.taxExemptionDetailService.AddTaxExemptionTable(this.taxExemption.Id, objTaxExemptionTable)).subscribe(
        (response: any) => {
          this._btnAddTaxExemptionTableDisabled = false;
          this._isDataLoaded = true;
          this.GetTaxExemptionTableListData();
          this.snackBarTemplate.snackBarSuccess(this.snackBar, "Added Successfully");
        },
        error => {
          this._btnAddTaxExemptionTableDisabled = false;
          this._isDataLoaded = true;
          this.snackBarTemplate.snackBarError(this.snackBar, error.error + " " + " Status Code: " + error.status);
          if (this._addTaxExemptionTableSubscription != null) this._addTaxExemptionTableSubscription.unsubscribe();
        }
      );
    }
  }

  public async UpdateTaxExemptionTable(objTaxExemptionTable: TaxExemptionTableModel) {
    this._btnAddTaxExemptionTableDisabled = true;
    if (this._isDataLoaded == true) {
      this._isDataLoaded = false;
      this._addTaxExemptionTableSubscription = (await this.taxExemptionDetailService.UpdateExemptionTable(objTaxExemptionTable.Id, objTaxExemptionTable)).subscribe(
        (response: any) => {
          this._btnAddTaxExemptionTableDisabled = false;
          this._isDataLoaded = true;
          this.GetTaxExemptionTableListData();
          this.snackBarTemplate.snackBarSuccess(this.snackBar, "Updated Successfully");
        },
        error => {
          this._btnAddTaxExemptionTableDisabled = false;
          this._isDataLoaded = true;
          this.snackBarTemplate.snackBarError(this.snackBar, error.error + " " + " Status Code: " + error.status);
          if (this._addTaxExemptionTableSubscription != null) this._addTaxExemptionTableSubscription.unsubscribe();
        }
      );
    }
  }

  AddTaxExemptionTableDialog() {
    let taxExemptionTable: TaxExemptionTableModel = {
      Id: 0,
      TaxExemptionId: this.taxExemption.Id,
      Type: '',
      Amount: '0',
      Tax: '0',
      Percentage: '0'
    }

    this.DetailTaxExemptionTable(taxExemptionTable, "Add Tax Exemption Table");
  }

  public EditTaxExemptionTable() {
    let currentTaxExemptionTable = this._listTaxExemptionTableCollectionView.currentItem;
    this.DetailTaxExemptionTable(currentTaxExemptionTable, "Edit Tax Exemption Table");
  }

  public async DeleteTaxExemptionTable() {
    let currentTaxExemptionTable = this._listTaxExemptionTableCollectionView.currentItem;
    this._isTaxExemptionTableProgressBarHidden = true;

    if (this._isDataLoaded == true) {
      this._isDataLoaded = false;
      this._deleteTaxExemptionTableSubscription = (await this.taxExemptionDetailService.DeleteTaxExemptionTable(currentTaxExemptionTable.Id)).subscribe(
        response => {
          this.snackBarTemplate.snackBarSuccess(this.snackBar, "Delete Successfully");
          this.GetTaxExemptionTableListData();
          this._isTaxExemptionTableProgressBarHidden = false;
          this._isDataLoaded = true;
        },
        error => {
          this._isDataLoaded = true;
          this._isTaxExemptionTableProgressBarHidden = false;
          this.snackBarTemplate.snackBarError(this.snackBar, error.error + " " + error.status);
          if (this._deleteTaxExemptionTableSubscription != null) this._deleteTaxExemptionTableSubscription.unsubscribe();
        }
      );
    }
  }

  public ComfirmDeleteTaxExemptionTable(): void {
    let currentTaxExemptionTable = this._listTaxExemptionTableCollectionView.currentItem;
    const dialogRef = this.deleteTaxExemptionTableDetailDialog.open(ComfirmMassageDialogComponent, {
      width: '500px',
      data: {
        objDialogTitle: "Delete TaxExemptionTable",
        objComfirmationMessage: ` Delete this ${currentTaxExemptionTable.Type}?`,
      },
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result.message == "Yes") {
        this.DeleteTaxExemptionTable();
      }
    });
  }

  public DetailTaxExemptionTable(objTaxExemptionTable: TaxExemptionTableModel, eventTitle: string): void {
    const dialogRef = this.shiftLineDetailDialog.open(TaxExemptionTableDialogComponent, {
      width: '900px',
      data: {
        objDialogTitle: eventTitle,
        objData: objTaxExemptionTable,
      },
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result.event === 'Add') {
        console.log(result);
        this.AddTaxExemptionTable(result.data);
      }
      if (result.event === 'Edit') {
        console.log(result);
        this.UpdateTaxExemptionTable(result.data);
      }
    });
  }

  activeTab() { }

  ngOnDestroy() {
  }

}
