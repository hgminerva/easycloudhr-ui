import { Component, OnInit, ViewChild } from '@angular/core';
import * as wjcGrid from '@grapecity/wijmo.grid';
import * as wjcCore from '@grapecity/wijmo';
import { CollectionView, ObservableArray } from '@grapecity/wijmo';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackBarTemplate } from '../../shared/snack-bar-template';

import { MandatoryTablesService } from './../mandatory-tables.service';
import { DeleteDialogBoxComponent } from '../../shared/delete-dialog-box/delete-dialog-box.component';
import { MandatoryTablesDetailMandatoryBirDetailComponent } from '../../mandatory-tables-detail/mandatory-tables-detail-mandatory-bir-detail/mandatory-tables-detail-mandatory-bir-detail.component';
import { MandatoryTablesDetailMandatoryHdmfDetailComponent } from '../../mandatory-tables-detail/mandatory-tables-detail-mandatory-hdmf-detail/mandatory-tables-detail-mandatory-hdmf-detail.component';
import { MandatoryTablesDetailMandatoryPhicDetailComponent } from '../../mandatory-tables-detail/mandatory-tables-detail-mandatory-phic-detail/mandatory-tables-detail-mandatory-phic-detail.component';
import { MandatoryTablesDetailMandatorySssDetailComponent } from '../../mandatory-tables-detail/mandatory-tables-detail-mandatory-sss-detail/mandatory-tables-detail-mandatory-sss-detail.component';

import { MandatoryBIR } from '../mandatory-bir.model';
import { MandatoryHDMF } from '../mandatory-hdmf.model';
import { MandatoryPHIC } from '../mandatory-phic.model';
import { MandatorySSS } from '../mandatory-sss.model';
import { SoftwareSecurityService, UserModule } from '../../software-security/software-security.service';

@Component({
  selector: 'app-mandatory-tables-list',
  templateUrl: './mandatory-tables-list.component.html',
  styleUrls: ['./mandatory-tables-list.component.css']
})
export class MandatoryTablesListComponent implements OnInit {

  constructor(
    private _mandatoryTablesService: MandatoryTablesService,
    private router: Router,
    private snackBar: MatSnackBar,
    private snackBarTemplate: SnackBarTemplate,
    public matDialog: MatDialog,
    private _softwareSecurityService: SoftwareSecurityService,
  ) { }

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
    this._userRightsSubscription = await (await this._softwareSecurityService.PageModuleRights("Mandatory")).subscribe(
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

    await this.GetMandatoryBIRListData();
    await this.GetMandatoryPHICListData();
    await this.GetMandatoryHDMFListData();
    await this.GetMandatorySSSListData();
  }

  async ngOnInit() {
    await this.Get_userRights();
  }

  public buttonDisabled: boolean = false;

  // =============
  // Code Tables
  // =============
  public _listMandatoryBIRObservableArray: ObservableArray = new ObservableArray();
  public _listMandatoryBIRCollectionView: CollectionView = new CollectionView(this._listMandatoryBIRObservableArray);
  public _listMandatoryBIRPageIndex: number = 15;
  @ViewChild('flexMandatoryBIR') _flexMandatoryBIR: wjcGrid.FlexGrid;
  public isMandatoryBIRProgressBarHidden = false;
  public isMandatoryBIRDataLoaded: boolean = false;

  private _mandatoryBIRListSubscription: any;
  private _addMandatoryBIRSubscription: any;
  private _deleteMandatoryBIRSubscription: any;

  private async GetMandatoryBIRListData() {
    this._listMandatoryBIRObservableArray = new ObservableArray();
    this._listMandatoryBIRCollectionView = new CollectionView(this._listMandatoryBIRObservableArray);
    this._listMandatoryBIRCollectionView.pageSize = 15;
    this._listMandatoryBIRCollectionView.trackChanges = true;
    await this._listMandatoryBIRCollectionView.refresh();
    await this._flexMandatoryBIR.refresh();

    this.isMandatoryBIRProgressBarHidden = true;

    this._mandatoryBIRListSubscription = (await this._mandatoryTablesService.MandatoryBIRList()).subscribe(
      (response: any) => {
        var results = response;
        if (results["length"] > 0) {
          this._listMandatoryBIRCollectionView = results;
          this._listMandatoryBIRCollectionView = new CollectionView(this._listMandatoryBIRCollectionView);
          this._listMandatoryBIRCollectionView.pageSize = 15;
          this._listMandatoryBIRCollectionView.trackChanges = true;
          this._listMandatoryBIRCollectionView.refresh();
          this._flexMandatoryBIR.refresh();
        }

        this.isMandatoryBIRDataLoaded = true;
        this.isMandatoryBIRProgressBarHidden = false;
        if (this._mandatoryBIRListSubscription != null) this._mandatoryBIRListSubscription.unsubscribe();
      },
      error => {
        this.snackBarTemplate.snackBarError(this.snackBar, error.error.Message + " " + error.status);
        if (this._mandatoryBIRListSubscription !== null) this._mandatoryBIRListSubscription.unsubscribe();
      }
    );
  }

  birGridClick(s, e) {
    if (wjcCore.hasClass(e.target, 'bir-button-edit')) {
      if (this._userRights.CanEdit) {
        this.EditMandatoryBIR();
      }

    }

    if (wjcCore.hasClass(e.target, 'bir-button-delete')) {
      if (this._userRights.CanDelete) {
        this.ComfirmDeleteMandatoryBIR();
      }
    }
  }

  public BtnAddMandatoryBIR() {

    let objMandatoryBIR: MandatoryBIR = {
      Id: 0,
      AmountStart: '0.00',
      AmountEnd: '0.00',
      EmployeeTaxPercentage: '0.00',
      EmployeeAdditionalAmount: '0.00',
    }
    this.DetailMandatoryBIR(objMandatoryBIR, "Add Mandatory BIR");
  }

  public EditMandatoryBIR() {
    let currentMandatoryBIR = this._listMandatoryBIRCollectionView.currentItem;
    this.DetailMandatoryBIR(currentMandatoryBIR, "Edit Mandatory BIR");
  }

  public async AddMandatoryBIR(objMandatoryBIR: MandatoryBIR) {
    this.buttonDisabled = true;
    if (this.isMandatoryBIRDataLoaded == true) {
      this.isMandatoryBIRDataLoaded = false;
      this._addMandatoryBIRSubscription = (await this._mandatoryTablesService.AddMandatoryBIR(objMandatoryBIR)).subscribe(
        response => {
          this.buttonDisabled = false;
          this.isMandatoryBIRDataLoaded = true;
          this.GetMandatoryBIRListData();
          this.snackBarTemplate.snackBarSuccess(this.snackBar, "Added Successfully");
          if (this._addMandatoryBIRSubscription != null) this._addMandatoryBIRSubscription.unsubscribe();
        },
        error => {
          this.buttonDisabled = false;
          this.isMandatoryBIRDataLoaded = true;
          this.snackBarTemplate.snackBarError(this.snackBar, error.error + " " + " Status Code: " + error.status);
          if (this._addMandatoryBIRSubscription != null) this._addMandatoryBIRSubscription.unsubscribe();
        }
      );
    }
  }

  public async SaveMandatoryBIR(objMandatoryBIR: MandatoryBIR) {
    this.buttonDisabled = true;
    if (this.isMandatoryBIRDataLoaded == true) {
      this.isMandatoryBIRDataLoaded = false;
      this._addMandatoryBIRSubscription = (await this._mandatoryTablesService.SaveMandatoryBIR(objMandatoryBIR)).subscribe(
        response => {
          this.buttonDisabled = false;
          this.isMandatoryBIRDataLoaded = true;
          this.GetMandatoryBIRListData();
          this.snackBarTemplate.snackBarSuccess(this.snackBar, "Save Successfully");
        },
        error => {
          this.buttonDisabled = false;
          this.isMandatoryBIRDataLoaded = true;
          this.snackBarTemplate.snackBarError(this.snackBar, error.error + " " + " Status Code: " + error.status);
          if (this._addMandatoryBIRSubscription != null) this._addMandatoryBIRSubscription.unsubscribe();
        }
      );
    }
  }

  public async DeleteMandatoryBIR() {
    if (this.isMandatoryBIRDataLoaded == true) {
      this.isMandatoryBIRDataLoaded = false;
      let currentMandatoryBIR = this._listMandatoryBIRCollectionView.currentItem;
      this.isMandatoryBIRProgressBarHidden = true;

      this._deleteMandatoryBIRSubscription = (await this._mandatoryTablesService.DeleteMandatoryBIR(currentMandatoryBIR.Id)).subscribe(
        response => {
          this.snackBarTemplate.snackBarSuccess(this.snackBar, "Delete Successfully");
          this.GetMandatoryBIRListData();
          this.isMandatoryBIRProgressBarHidden = false;
          this.isMandatoryBIRDataLoaded = true;
        },
        error => {
          this.isMandatoryBIRDataLoaded = true;
          this.snackBarTemplate.snackBarError(this.snackBar, error.error + " " + error.status);
          if (this._deleteMandatoryBIRSubscription != null) this._deleteMandatoryBIRSubscription.unsubscribe();
        }
      );
    }
  }

  public ComfirmDeleteMandatoryBIR(): void {
    let currentMandatoryBIR = this._listMandatoryBIRCollectionView.currentItem;
    const matDialogRef = this.matDialog.open(DeleteDialogBoxComponent, {
      width: '500px',
      data: {
        objDialogTitle: "",
        objComfirmationMessage: `Delete BIR?`,
      },
      disableClose: true
    });

    matDialogRef.afterClosed().subscribe(result => {
      if (result.message == "Yes") {
        this.DeleteMandatoryBIR();
      }
    });
  }

  public DetailMandatoryBIR(data: MandatoryBIR, eventTitle: string): void {
    const matDialogRef = this.matDialog.open(MandatoryTablesDetailMandatoryBirDetailComponent, {
      width: '800px',
      data: {
        objDialogTitle: eventTitle,
        objData: data,
      },
      disableClose: true
    });

    matDialogRef.afterClosed().subscribe(data => {

      let objMandatoryBIR: MandatoryBIR = {
        Id: data.objData.Id,
        AmountStart: data.objData.AmountStart,
        AmountEnd: data.objData.AmountEnd,
        EmployeeTaxPercentage: data.objData.EmployeeTaxPercentage,
        EmployeeAdditionalAmount: data.objData.EmployeeAdditionalAmount,
      }

      if (data.event === "Add") {
        this.AddMandatoryBIR(objMandatoryBIR);
      }
      if (data.event === "Edit") {
        this.SaveMandatoryBIR(objMandatoryBIR);
      }
    });
  }

  // ==============
  // Mandatory HDMF
  // ==============
  public _listMandatoryHDMFObservableArray: ObservableArray = new ObservableArray();
  public _listMandatoryHDMFCollectionView: CollectionView = new CollectionView(this._listMandatoryHDMFObservableArray);
  public _listMandatoryHDMFPageIndex: number = 15;
  @ViewChild('flexMandatoryHDMF') _flexMandatoryHDMF: wjcGrid.FlexGrid;
  public isMandatoryHDMFProgressBarHidden = false;
  public isMandatoryHDMFDataLoaded: boolean = false;

  private _mandatoryHDMFListSubscription: any;
  private _addMandatoryHDMFSubscription: any;
  private _deleteMandatoryHDMFSubscription: any;

  private async GetMandatoryHDMFListData() {
    this._listMandatoryHDMFObservableArray = new ObservableArray();
    this._listMandatoryHDMFCollectionView = new CollectionView(this._listMandatoryHDMFObservableArray);
    this._listMandatoryHDMFCollectionView.pageSize = 15;
    this._listMandatoryHDMFCollectionView.trackChanges = true;
    await this._listMandatoryHDMFCollectionView.refresh();
    await this._flexMandatoryHDMF.refresh();

    this.isMandatoryHDMFProgressBarHidden = true;

    this._mandatoryHDMFListSubscription = (await this._mandatoryTablesService.MandatoryHDMFList()).subscribe(
      (response: any) => {
        var results = response;
        if (results["length"] > 0) {
          this._listMandatoryHDMFCollectionView = results;
          this._listMandatoryHDMFCollectionView = new CollectionView(this._listMandatoryHDMFCollectionView);
          this._listMandatoryHDMFCollectionView.pageSize = 15;
          this._listMandatoryHDMFCollectionView.trackChanges = true;
          this._listMandatoryHDMFCollectionView.refresh();
          this._flexMandatoryHDMF.refresh();
        }

        this.isMandatoryHDMFDataLoaded = true;
        this.isMandatoryHDMFProgressBarHidden = false;
        if (this._mandatoryHDMFListSubscription != null) this._mandatoryHDMFListSubscription.unsubscribe();
      },
      error => {
        this.snackBarTemplate.snackBarError(this.snackBar, error.error.Message + " " + error.status);
        if (this._mandatoryHDMFListSubscription !== null) this._mandatoryHDMFListSubscription.unsubscribe();
      }
    );
  }

  hdmfGridClick(s, e) {
    if (wjcCore.hasClass(e.target, 'hdmf-button-edit')) {
      if (this._userRights.CanEdit) {
        this.EditMandatoryHDMF();
      }

    }

    if (wjcCore.hasClass(e.target, 'hdmf-button-delete')) {
      if (this._userRights.CanDelete) {
        this.ComfirmDeleteMandatoryHDMF();
      }
    }
  }

  public BtnAddMandatoryHDMF() {

    let objMandatoryHDMF: any = {
      Id: 0,
      AmountStart: '0.00',
      AmountEnd: '0.00',
      EmployeeContributionPercentage: '0.00',
      EmployerContributionPercentage: '0.00',
      EmployeeContributionValue: '0.00',
      EmployerContributionValue: '0.00',
      Remarks: 'NA'
    };

    this.DetailMandatoryHDMF(objMandatoryHDMF, "Add Mandatory HDMF");
  }

  public EditMandatoryHDMF() {
    let currentMandatoryHDMFs = this._listMandatoryHDMFCollectionView.currentItem;
    this.DetailMandatoryHDMF(currentMandatoryHDMFs, "Edit Mandatory HDMF");
  }

  public async AddMandatoryHDMF(objMandatoryHDMF: MandatoryHDMF) {
    this.buttonDisabled = true;
    if (this.isMandatoryHDMFDataLoaded == true) {
      this.isMandatoryHDMFDataLoaded = false;
      this._addMandatoryHDMFSubscription = (await this._mandatoryTablesService.AddMandatoryHDMF(objMandatoryHDMF)).subscribe(
        response => {
          this.buttonDisabled = false;
          this.isMandatoryHDMFDataLoaded = true;
          this.GetMandatoryHDMFListData();
          this.snackBarTemplate.snackBarSuccess(this.snackBar, "Added Successfully");
          if (this._addMandatoryHDMFSubscription != null) this._addMandatoryHDMFSubscription.unsubscribe();
        },
        error => {
          this.buttonDisabled = false;
          this.isMandatoryHDMFDataLoaded = true;
          this.snackBarTemplate.snackBarError(this.snackBar, error.error + " " + " Status Code: " + error.status);
          if (this._addMandatoryHDMFSubscription != null) this._addMandatoryHDMFSubscription.unsubscribe();
        }
      );
    }
  }

  public async SaveMandatoryHDMF(objMandatoryHDMF: MandatoryHDMF) {
    this.buttonDisabled = true;
    if (this.isMandatoryHDMFDataLoaded == true) {
      this.isMandatoryHDMFDataLoaded = false;
      this._addMandatoryHDMFSubscription = (await this._mandatoryTablesService.SaveMandatoryHDMF(objMandatoryHDMF)).subscribe(
        response => {
          this.buttonDisabled = false;
          this.isMandatoryHDMFDataLoaded = true;
          this.GetMandatoryHDMFListData();
          this.snackBarTemplate.snackBarSuccess(this.snackBar, "Save Successfully");
        },
        error => {
          this.buttonDisabled = false;
          this.isMandatoryHDMFDataLoaded = true;
          this.snackBarTemplate.snackBarError(this.snackBar, error.error + " " + " Status Code: " + error.status);
          if (this._addMandatoryHDMFSubscription != null) this._addMandatoryHDMFSubscription.unsubscribe();
        }
      );
    }
  }

  public async DeleteMandatoryHDMF() {
    if (this.isMandatoryHDMFDataLoaded == true) {
      this.isMandatoryHDMFDataLoaded = false;
      let currentMandatoryHDMFs = this._listMandatoryHDMFCollectionView.currentItem;
      this.isMandatoryHDMFProgressBarHidden = true;

      this._deleteMandatoryHDMFSubscription = (await this._mandatoryTablesService.DeleteMandatoryHDMF(currentMandatoryHDMFs.Id)).subscribe(
        response => {
          this.snackBarTemplate.snackBarSuccess(this.snackBar, "Delete Successfully");
          this.GetMandatoryHDMFListData();
          this.isMandatoryHDMFProgressBarHidden = false;
          this.isMandatoryHDMFDataLoaded = true;
        },
        error => {
          this.isMandatoryHDMFDataLoaded = true;
          this.snackBarTemplate.snackBarError(this.snackBar, error.error + " " + error.status);
          if (this._deleteMandatoryHDMFSubscription != null) this._deleteMandatoryHDMFSubscription.unsubscribe();
        }
      );
    }
  }

  public ComfirmDeleteMandatoryHDMF(): void {
    let currentMandatoryHDMF = this._listMandatoryHDMFCollectionView.currentItem;
    const matDialogRef = this.matDialog.open(DeleteDialogBoxComponent, {
      width: '500px',
      data: {
        objDialogTitle: "",
        objComfirmationMessage: `Delete HDMF?`,
      },
      disableClose: true
    });

    matDialogRef.afterClosed().subscribe(result => {
      if (result.message == "Yes") {
        this.DeleteMandatoryHDMF();
      }
    });
  }

  public DetailMandatoryHDMF(data: any[], eventTitle: string): void {
    const matDialogRef = this.matDialog.open(MandatoryTablesDetailMandatoryHdmfDetailComponent, {
      width: '800px',
      data: {
        objDialogTitle: eventTitle,
        objData: data,
      },
      disableClose: true
    });

    matDialogRef.afterClosed().subscribe(data => {

      let objMandatoryHDMF: MandatoryHDMF = {
        Id: data.objData.Id,
        AmountStart: data.objData.AmountStart,
        AmountEnd: data.objData.AmountEnd,
        EmployeeContributionPercentage: data.objData.EmployeeContributionPercentage,
        EmployerContributionPercentage: data.objData.EmployerContributionPercentage,
        EmployeeContributionValue: data.objData.EmployeeContributionValue,
        EmployerContributionValue: data.objData.EmployerContributionValue,
        Remarks: data.objData.Remarks
      }

      if (data.event === "Add") {
        this.AddMandatoryHDMF(objMandatoryHDMF);
      }
      if (data.event === "Edit") {
        this.SaveMandatoryHDMF(objMandatoryHDMF);
      }
    });
  }

  // ==============
  // Mandatory PHIC
  // ==============
  public _listMandatoryPHICObservableArray: ObservableArray = new ObservableArray();
  public _listMandatoryPHICCollectionView: CollectionView = new CollectionView(this._listMandatoryPHICObservableArray);
  public _listMandatoryPHICPageIndex: number = 15;
  @ViewChild('flexMandatoryPHIC') _flexMandatoryPHIC: wjcGrid.FlexGrid;
  public _isMandatoryPHICProgressBarHidden = false;
  public _isMandatoryPHICDataLoaded: boolean = false;

  private _mandatoryPHICTablesListSubscription: any;
  private _addMandatoryPHICSubscription: any;
  private _deleteMandatoryPHICSubscription: any;

  private async GetMandatoryPHICListData() {
    this._listMandatoryPHICObservableArray = new ObservableArray();
    this._listMandatoryPHICCollectionView = new CollectionView(this._listMandatoryPHICObservableArray);
    this._listMandatoryPHICCollectionView.pageSize = 15;
    this._listMandatoryPHICCollectionView.trackChanges = true;
    await this._listMandatoryPHICCollectionView.refresh();
    await this._flexMandatoryPHIC.refresh();

    this._isMandatoryPHICProgressBarHidden = true;

    this._mandatoryPHICTablesListSubscription = (await this._mandatoryTablesService.MandatoryPHICList()).subscribe(
      (response: any) => {
        var results = response;
        if (results["length"] > 0) {
          this._listMandatoryPHICCollectionView = results;
          this._listMandatoryPHICCollectionView = new CollectionView(this._listMandatoryPHICCollectionView);
          this._listMandatoryPHICCollectionView.pageSize = 15;
          this._listMandatoryPHICCollectionView.trackChanges = true;
          this._listMandatoryPHICCollectionView.refresh();
          this._flexMandatoryPHIC.refresh();
        }

        this._isMandatoryPHICDataLoaded = true;
        this._isMandatoryPHICProgressBarHidden = false;
        if (this._mandatoryPHICTablesListSubscription != null) this._mandatoryPHICTablesListSubscription.unsubscribe();
      },
      error => {
        this.snackBarTemplate.snackBarError(this.snackBar, error.error.Message + " " + error.status);
        if (this._mandatoryPHICTablesListSubscription !== null) this._mandatoryPHICTablesListSubscription.unsubscribe();
      }
    );
  }

  phicGridClick(s, e) {
    if (wjcCore.hasClass(e.target, 'phic-button-edit')) {
      if (this._userRights.CanEdit) {
        this.EditMandatoryPHIC();
      }

    }

    if (wjcCore.hasClass(e.target, 'phic-button-delete')) {
      if (this._userRights.CanDelete) {
        this.ComfirmDeleteMandatoryPHIC();
      }
    }
  }

  public BtnAddMandatoryPHIC() {

    let objMandatoryPHIC: MandatoryPHIC = {
      Id: 0,
      AmountStart: '0.00',
      AmountEnd: '0.00',
      EmployeeContributionValue: '0.00',
      EmployerContributionValue: '0.00',
      Remarks: 'NA'
    }

    this.DetailMandatoryPHIC(objMandatoryPHIC, "Add Mandatory PHIC");
  }

  public EditMandatoryPHIC() {

    let currentMandatoryPHIC = this._listMandatoryPHICCollectionView.currentItem;

    let objMandatoryPHIC: MandatoryPHIC = {
      Id: currentMandatoryPHIC.Id,
      AmountStart: this.RemoveComma(currentMandatoryPHIC.AmountStart),
      AmountEnd: this.RemoveComma(currentMandatoryPHIC.AmountEnd),
      EmployeeContributionValue: this.RemoveComma(currentMandatoryPHIC.EmployeeContributionValue),
      EmployerContributionValue: this.RemoveComma(currentMandatoryPHIC.EmployerContributionValue),
      Remarks: currentMandatoryPHIC.Remarks
    }

    this.DetailMandatoryPHIC(objMandatoryPHIC, "Edit Mandatory PHIC");
  }

  public async AddMandatoryPHIC(objMandatoryPHIC: MandatoryPHIC) {
    this.buttonDisabled = true;
    if (this._isMandatoryPHICDataLoaded == true) {
      this._isMandatoryPHICDataLoaded = false;
      this._addMandatoryPHICSubscription = (await this._mandatoryTablesService.AddMandatoryPHIC(objMandatoryPHIC)).subscribe(
        response => {
          this.buttonDisabled = false;
          this._isMandatoryPHICDataLoaded = true;
          this.GetMandatoryPHICListData();
          this.snackBarTemplate.snackBarSuccess(this.snackBar, "Added Successfully");
          if (this._addMandatoryPHICSubscription != null) this._addMandatoryPHICSubscription.unsubscribe();
        },
        error => {
          this.buttonDisabled = false;
          this._isMandatoryPHICDataLoaded = true;
          this.snackBarTemplate.snackBarError(this.snackBar, error.error + " " + " Status Code: " + error.status);
          if (this._addMandatoryPHICSubscription != null) this._addMandatoryPHICSubscription.unsubscribe();
        }
      );
    }
  }

  public async SaveMandatoryPHIC(objMandatoryPHIC: MandatoryPHIC) {
    this.buttonDisabled = true;
    if (this._isMandatoryPHICDataLoaded == true) {
      this._isMandatoryPHICDataLoaded = false;
      this._addMandatoryPHICSubscription = (await this._mandatoryTablesService.SaveMandatoryPHIC(objMandatoryPHIC)).subscribe(
        response => {
          this.buttonDisabled = false;
          this._isMandatoryPHICDataLoaded = true;
          this.GetMandatoryPHICListData();
          this.snackBarTemplate.snackBarSuccess(this.snackBar, "Save Successfully");
        },
        error => {
          this.buttonDisabled = false;
          this._isMandatoryPHICDataLoaded = true;
          this.snackBarTemplate.snackBarError(this.snackBar, error.error + " " + " Status Code: " + error.status);
          if (this._addMandatoryPHICSubscription != null) this._addMandatoryPHICSubscription.unsubscribe();
        }
      );
    }
  }

  public async DeleteMandatoryPHIC() {
    if (this._isMandatoryPHICDataLoaded == true) {
      this._isMandatoryPHICDataLoaded = false;
      let currentMandatoryPHIC = this._listMandatoryPHICCollectionView.currentItem;
      this._isMandatoryPHICProgressBarHidden = true;

      this._deleteMandatoryPHICSubscription = (await this._mandatoryTablesService.DeleteMandatoryPHIC(currentMandatoryPHIC.Id)).subscribe(
        response => {
          this.snackBarTemplate.snackBarSuccess(this.snackBar, "Delete Successfully");
          this.GetMandatoryPHICListData();
          this._isMandatoryPHICProgressBarHidden = false;
          this._isMandatoryPHICDataLoaded = true;
        },
        error => {
          this._isMandatoryPHICDataLoaded = true;
          this.snackBarTemplate.snackBarError(this.snackBar, error.error + " " + error.status);
          if (this._deleteMandatoryPHICSubscription != null) this._deleteMandatoryPHICSubscription.unsubscribe();
        }
      );
    }
  }

  public ComfirmDeleteMandatoryPHIC(): void {
    let currentMandatoryPHIC = this._listMandatoryPHICCollectionView.currentItem;
    const matDialogRef = this.matDialog.open(DeleteDialogBoxComponent, {
      width: '500px',
      data: {
        objDialogTitle: "",
        objComfirmationMessage: `Delete PHIC?`,
      },
      disableClose: true
    });

    matDialogRef.afterClosed().subscribe(result => {
      if (result.message == "Yes") {
        this.DeleteMandatoryPHIC();
      }
    });
  }

  public DetailMandatoryPHIC(data: MandatoryPHIC, eventTitle: string): void {

    const matDialogRef = this.matDialog.open(MandatoryTablesDetailMandatoryPhicDetailComponent, {
      width: '800px',
      data: {
        objDialogTitle: eventTitle,
        objData: data,
      },
      disableClose: true
    });

    matDialogRef.afterClosed().subscribe(data => {

      let objMandatoryPHIC: MandatoryPHIC = {
        Id: data.objData.Id,
        AmountStart: data.objData.AmountStart,
        AmountEnd: data.objData.AmountEnd,
        EmployeeContributionValue: data.objData.EmployeeContributionValue,
        EmployerContributionValue: data.objData.EmployerContributionValue,
        Remarks: data.objData.Remarks
      }

      if (data.event === "Add") {
        this.AddMandatoryPHIC(objMandatoryPHIC);
      }
      if (data.event === "Edit") {
        this.SaveMandatoryPHIC(objMandatoryPHIC);
      }
    });
  }

  // =======
  // Code SSS
  // ========
  public _listMandatorySSSObservableArray: ObservableArray = new ObservableArray();
  public _listMandatorySSSCollectionView: CollectionView = new CollectionView(this._listMandatorySSSObservableArray);
  public _listMandatorySSSPageIndex: number = 15;
  @ViewChild('flexMandatorySSS') _flexMandatorySSS: wjcGrid.FlexGrid;
  public _isMandatorySSSProgressBarHidden = false;
  public _isMandatorySSSDataLoaded: boolean = false;

  private _mandatorySSSListSubscription: any;
  private _addMandatorySSSSubscription: any;
  private _deleteMandatorySSSSubscription: any;

  private async GetMandatorySSSListData() {
    this._listMandatorySSSObservableArray = new ObservableArray();
    this._listMandatorySSSCollectionView = new CollectionView(this._listMandatorySSSObservableArray);
    this._listMandatorySSSCollectionView.pageSize = 15;
    this._listMandatorySSSCollectionView.trackChanges = true;
    await this._listMandatorySSSCollectionView.refresh();
    await this._flexMandatorySSS.refresh();

    this._isMandatorySSSProgressBarHidden = true;

    this._mandatorySSSListSubscription = (await this._mandatoryTablesService.MandatorySSSList()).subscribe(
      (response: any) => {
        var results = response;
        if (results["length"] > 0) {
          this._listMandatorySSSCollectionView = results;
          this._listMandatorySSSCollectionView = new CollectionView(this._listMandatorySSSCollectionView);
          this._listMandatorySSSCollectionView.pageSize = 15;
          this._listMandatorySSSCollectionView.trackChanges = true;
          this._listMandatorySSSCollectionView.refresh();
          this._flexMandatorySSS.refresh();
        }

        this._isMandatorySSSDataLoaded = true;
        this._isMandatorySSSProgressBarHidden = false;
        if (this._mandatorySSSListSubscription != null) this._mandatorySSSListSubscription.unsubscribe();
      },
      error => {
        this.snackBarTemplate.snackBarError(this.snackBar, error.error.Message + " " + error.status);
        if (this._mandatorySSSListSubscription !== null) this._mandatorySSSListSubscription.unsubscribe();
      }
    );
  }

  sssGridClick(s, e) {
    if (wjcCore.hasClass(e.target, 'sss-button-edit')) {
      if (this._userRights.CanEdit) {
        this.EditMandatorySSS();
      }

    }

    if (wjcCore.hasClass(e.target, 'sss-button-delete')) {
      if (this._userRights.CanDelete) {
        this.ComfirmDeleteMandatorySSS();
      }
    }
  }

  public BtnAddMandatorySSS() {

    let objMandatorySSS: MandatorySSS = {
      Id: 0,
      AmountStart: '0.00',
      AmountEnd: '0.00',
      EmployeeContributionValue: '0.00',
      EmployerContributionValue: '0.00',
      EmployerECValue: '0.00',
      Remarks: 'NA'
    };

    this.DetailMandatorySSS(objMandatorySSS, "Add Mandatory SSS");
  }

  public EditMandatorySSS() {
    let currentMandatorySSS = this._listMandatorySSSCollectionView.currentItem;

    let objMandatorySSS: MandatorySSS = {
      Id: currentMandatorySSS.Id,
      AmountStart: currentMandatorySSS.AmountStart,
      AmountEnd: currentMandatorySSS.AmountEnd,
      EmployeeContributionValue: currentMandatorySSS.EmployeeContributionValue,
      EmployerContributionValue: currentMandatorySSS.EmployerContributionValue,
      EmployerECValue: currentMandatorySSS.EmployerECValue,
      Remarks: 'NA'
    };

    this.DetailMandatorySSS(objMandatorySSS, "Edit Mandatory SSS");
  }

  public async AddMandatorySSS(objMandatorySSS: MandatorySSS) {
    this.buttonDisabled = true;
    if (this._isMandatorySSSDataLoaded == true) {
      this._isMandatorySSSDataLoaded = false;
      this._addMandatorySSSSubscription = (await this._mandatoryTablesService.AddMandatorySSS(objMandatorySSS)).subscribe(
        response => {
          this.buttonDisabled = false;
          this._isMandatorySSSDataLoaded = true;
          this.GetMandatorySSSListData();
          this.snackBarTemplate.snackBarSuccess(this.snackBar, "Added Successfully");
          if (this._addMandatorySSSSubscription != null) this._addMandatorySSSSubscription.unsubscribe();
        },
        error => {
          this.buttonDisabled = false;
          this._isMandatorySSSDataLoaded = true;
          this.snackBarTemplate.snackBarError(this.snackBar, error.error + " " + " Status Code: " + error.status);
          if (this._addMandatorySSSSubscription != null) this._addMandatorySSSSubscription.unsubscribe();
        }
      );
    }
  }

  public async SaveMandatorySSS(objMandatorySSS: MandatorySSS) {
    this.buttonDisabled = true;
    if (this._isMandatorySSSDataLoaded == true) {
      this._isMandatorySSSDataLoaded = false;
      this._addMandatorySSSSubscription = (await this._mandatoryTablesService.SaveMandatorySSS(objMandatorySSS)).subscribe(
        response => {
          this.buttonDisabled = false;
          this._isMandatorySSSDataLoaded = true;
          this.GetMandatorySSSListData();
          this.snackBarTemplate.snackBarSuccess(this.snackBar, "Save Successfully");
        },
        error => {
          this.buttonDisabled = false;
          this._isMandatorySSSDataLoaded = true;
          this.snackBarTemplate.snackBarError(this.snackBar, error.error + " " + " Status Code: " + error.status);
          if (this._addMandatorySSSSubscription != null) this._addMandatorySSSSubscription.unsubscribe();
        }
      );
    }
  }

  public async DeleteMandatorySSS() {
    if (this._isMandatorySSSDataLoaded == true) {
      this._isMandatorySSSDataLoaded = false;
      let currentMandatorySSS = this._listMandatorySSSCollectionView.currentItem;
      this._isMandatorySSSProgressBarHidden = true;

      this._deleteMandatorySSSSubscription = (await this._mandatoryTablesService.DeleteMandatorySSS(currentMandatorySSS.Id)).subscribe(
        response => {
          this.snackBarTemplate.snackBarSuccess(this.snackBar, "Delete Successfully");
          this.GetMandatorySSSListData();
          this._isMandatorySSSProgressBarHidden = false;
          this._isMandatorySSSDataLoaded = true;
        },
        error => {
          this._isMandatorySSSDataLoaded = true;
          this.snackBarTemplate.snackBarError(this.snackBar, error.error + " " + error.status);
          if (this._deleteMandatorySSSSubscription != null) this._deleteMandatorySSSSubscription.unsubscribe();
        }
      );
    }
  }

  public ComfirmDeleteMandatorySSS(): void {
    let currentMandatorySSS = this._listMandatorySSSCollectionView.currentItem;
    const matDialogRef = this.matDialog.open(DeleteDialogBoxComponent, {
      width: '500px',
      data: {
        objDialogTitle: "",
        objComfirmationMessage: `Delete SSS?`,
      },
      disableClose: true
    });

    matDialogRef.afterClosed().subscribe(result => {
      if (result.message == "Yes") {
        this.DeleteMandatorySSS();
      }
    });
  }

  activeTab() { }

  public DetailMandatorySSS(data: MandatorySSS, eventTitle: string): void {
    const matDialogRef = this.matDialog.open(MandatoryTablesDetailMandatorySssDetailComponent, {
      width: '800px',
      data: {
        objDialogTitle: eventTitle,
        objData: data,
      },
      disableClose: true
    });

    matDialogRef.afterClosed().subscribe(data => {

      let objMandatorySSS: MandatorySSS = {
        Id: data.objData.Id,
        AmountStart: data.objData.AmountStart,
        AmountEnd: data.objData.AmountEnd,
        EmployeeContributionValue: data.objData.EmployeeContributionValue,
        EmployerContributionValue: data.objData.EmployerContributionValue,
        EmployerECValue: data.objData.EmployerECValue,
        Remarks: data.objData.Remarks
      }

      if (data.event === 'Add') {
        this.AddMandatorySSS(objMandatorySSS);
      }
      if (data.event === 'Edit') {
        this.SaveMandatorySSS(objMandatorySSS);
      }
    });
  }

  @ViewChild('tabGroup') tabGroup;

  public async AddMandatoryTable() {
    if (this.tabGroup.selectedIndex == 0) {
      this.BtnAddMandatoryBIR();
    }

    if (this.tabGroup.selectedIndex == 1) {
      this.BtnAddMandatoryHDMF();
    }

    if (this.tabGroup.selectedIndex == 2) {
      this.BtnAddMandatoryPHIC();
    }

    if (this.tabGroup.selectedIndex == 3) {
      this.BtnAddMandatorySSS();
    }
  }

  public RemoveComma(value: string): string {
    return value.toString().replace(/,/g, '');
  }

}
