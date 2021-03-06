import { Component, OnInit, ViewChild } from '@angular/core';
import * as wjcCore from '@grapecity/wijmo';
import * as wjcGrid from '@grapecity/wijmo.grid';
import { CollectionView, ObservableArray } from '@grapecity/wijmo';

import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackBarTemplate } from '../../shared/snack-bar-template';

import { OtherDeductionDetailDialogComponent } from '../other-deduction-detail-dialog/other-deduction-detail-dialog.component';

import { OtherDeductionsService } from './../other-deductions.service';
import { SoftwareSecurityService, UserModule } from '../../software-security/software-security.service';
import { Router } from '@angular/router';
import { ComfirmMassageDialogComponent } from '../../shared/comfirm-massage-dialog/comfirm-massage-dialog.component';

@Component({
  selector: 'app-other-deductions',
  templateUrl: './other-deductions.component.html',
  styleUrls: ['./other-deductions.component.css']
})
export class OtherDeductionsComponent implements OnInit {

  // Constructor and overrides
  constructor(private _otherDeductionsService: OtherDeductionsService,
    private _snackBar: MatSnackBar,
    private _snackBarTemplate: SnackBarTemplate,
    public _matDialogRef: MatDialog,
    private _softwareSecurityService: SoftwareSecurityService,
    private _router: Router,
  ) {
  }

  async ngOnInit() {
    await this.Get_userRights();
    await this.createCboShowNumberOfRows();
  }

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
    this._userRightsSubscription = await (await this._softwareSecurityService.PageModuleRights("Other Deduction")).subscribe(
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
        this._snackBarTemplate.snackBarError(this._snackBar, error.error.Message + " " + error.status);

        if (error.status == "401") {
          this._softwareSecurityService.logOut();
        }
        if (this._userRightsSubscription !== null) this._userRightsSubscription.unsubscribe();
      }
    );

    await this.GetOtherDeductionListData();
  }

  // Class properties
  public _listOtherDeductionObservableArray: ObservableArray = new ObservableArray();
  public _listOtherDeductionCollectionView: CollectionView = new CollectionView(this._listOtherDeductionObservableArray);
  public _listPageIndex: number = 15;

  public _isProgressBarHidden = false;
  public _isDataLoaded: boolean = false;

  private _otherDeductionListSubscription: any;
  private _addOtherDeductionSubscription: any;
  private _deleteOtherDeductionSubscription: any;

  public _btnAddDisabled: boolean = false;

  // DOM declaration
  @ViewChild('flexOtherDeduction') _flexOtherDeduction: wjcGrid.FlexGrid;

  public cboShowNumberOfRows: ObservableArray = new ObservableArray();
  public listPageIndex: number = 15;

  public createCboShowNumberOfRows(): void {
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

      this.cboShowNumberOfRows.push({
        rowNumber: rows,
        rowString: rowsString
      });
    }
  }

  public cboShowNumberOfRowsOnSelectedIndexChanged(): void {
    this._listOtherDeductionCollectionView.pageSize = this.listPageIndex;
    this._listOtherDeductionCollectionView.refresh();
    this._listOtherDeductionCollectionView.refresh();
  }

  // Methods
  private async GetOtherDeductionListData() {
    this._listOtherDeductionObservableArray = new ObservableArray();
    this._listOtherDeductionCollectionView = new CollectionView(this._listOtherDeductionObservableArray);
    this._listOtherDeductionCollectionView.pageSize = 15;
    this._listOtherDeductionCollectionView.trackChanges = true;
    await this._listOtherDeductionCollectionView.refresh();
    await this._flexOtherDeduction.refresh();

    this._isProgressBarHidden = true;

    this._otherDeductionListSubscription = (await this._otherDeductionsService.OtherDeductionList()).subscribe(
      (response: any) => {
        var results = response;
        console.log("Response:", results);

        if (results["length"] > 0) {
          this._listOtherDeductionObservableArray = results;
          this._listOtherDeductionCollectionView = new CollectionView(this._listOtherDeductionObservableArray);
          this._listOtherDeductionCollectionView.pageSize = 15;
          this._listOtherDeductionCollectionView.trackChanges = true;
          this._listOtherDeductionCollectionView.refresh();
          this._flexOtherDeduction.refresh();
        }

        this._isDataLoaded = true;
        this._isProgressBarHidden = false;

        if (this._otherDeductionListSubscription != null) this._otherDeductionListSubscription.unsubscribe();
      },
      error => {
        this._snackBarTemplate.snackBarError(this._snackBar, error.error.Message + " " + " Status Code: " + error.status);
        if (this._otherDeductionListSubscription != null) this._otherDeductionListSubscription.unsubscribe();
      }
    );
  }

  gridClick(s, e) {
    if (wjcCore.hasClass(e.target, 'button-edit')) {
      if (this._userRights.CanEdit) {
        this.EditOtherDeduction();
      }

    }

    if (wjcCore.hasClass(e.target, 'button-delete')) {
      if (this._userRights.CanDelete) {
        this.ComfirmDeleteOtherDeduction();
      }
    }
  }

  public async AddOtherDeduction() {
    this._btnAddDisabled = true;
    if (this._isDataLoaded == true) {
      this._isDataLoaded = false;
      this._addOtherDeductionSubscription = (await this._otherDeductionsService.AddOtherDeduction()).subscribe(
        (response: any) => {
          this._btnAddDisabled = false;
          this._isDataLoaded = true;
          this.GetOtherDeductionListData();
          this.DetailOtherDeduction(response, "Other Deduction Detail")
          this._snackBarTemplate.snackBarSuccess(this._snackBar, "Added Successfully");
        },
        error => {
          this._btnAddDisabled = false;
          this._isDataLoaded = true;
          this._snackBarTemplate.snackBarError(this._snackBar, error.error + " " + " Status Code: " + error.status);
          if (this._addOtherDeductionSubscription != null) this._addOtherDeductionSubscription.unsubscribe();
        }
      );
    }
  }

  public EditOtherDeduction() {
    let currentOtherDeduction = this._listOtherDeductionCollectionView.currentItem;
    this.DetailOtherDeduction(currentOtherDeduction.Id, "Edit Other Deduction Detail");
  }

  public async DeleteOtherDeduction() {
    let currentOtherDeduction = this._listOtherDeductionCollectionView.currentItem;
    this._isProgressBarHidden = true;

    if (this._isDataLoaded == true) {
      this._isDataLoaded = false;
      this._deleteOtherDeductionSubscription = (await this._otherDeductionsService.DeleteOtherDeduction(currentOtherDeduction.Id)).subscribe(
        response => {
          this._snackBarTemplate.snackBarSuccess(this._snackBar, "Delete Successfully");
          this.GetOtherDeductionListData();
          this._isProgressBarHidden = false;
          this._isDataLoaded = true;
        },
        error => {
          this._isDataLoaded = true;
          this._isProgressBarHidden = false;
          this._snackBarTemplate.snackBarError(this._snackBar, error.error.Message + " " + error.status);
          if (this._deleteOtherDeductionSubscription != null) this._deleteOtherDeductionSubscription.unsubscribe();
        }
      );
    }
  }

  public ComfirmDeleteOtherDeduction(): void {
    let currentOtherDeduction = this._listOtherDeductionCollectionView.currentItem;
    const userRegistrationlDialogRef = this._matDialogRef.open(ComfirmMassageDialogComponent, {
      width: '500px',
      data: {
        objDialogTitle: "Delete OtherDeduction",
        objComfirmationMessage: ` Delete this ${currentOtherDeduction.OtherDeductionCode}?`,
      },
      disableClose: true
    });

    userRegistrationlDialogRef.afterClosed().subscribe(result => {
      if (result.message == "Yes") {
        this.DeleteOtherDeduction();
      }
    });
  }

  public DetailOtherDeduction(OtherDeductionId: string, eventTitle: string): void {
    const userRegistrationlDialogRef = this._matDialogRef.open(OtherDeductionDetailDialogComponent, {
      width: '1200px',
      data: {
        objDialogTitle: eventTitle,
        objOtherDeductionId: OtherDeductionId,
      },
      disableClose: true
    });

    userRegistrationlDialogRef.afterClosed().subscribe(result => {
      if (result.event !== "Close") {
        this.GetOtherDeductionListData();
      }
    });
  }

  ngOnDestroy() {
    if (this._otherDeductionListSubscription !== null) this._otherDeductionListSubscription.unsubscribe();
  }
}
