import { Component, OnInit, ViewChild } from '@angular/core';

import * as wjcGrid from '@grapecity/wijmo.grid';
import { CollectionView, ObservableArray } from '@grapecity/wijmo';

import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackBarTemplate } from '../../shared/snack-bar-template';

import { OtherIncomeService } from './../other-income.service';
import { DeleteDialogBoxComponent } from '../../shared/delete-dialog-box/delete-dialog-box.component';
import { OtherIncodeDetailDialogComponent } from './../other-incode-detail-dialog/other-incode-detail-dialog.component';
import { SoftwareSecurityService, UserModule } from '../../software-security/software-security.service';

@Component({
  selector: 'app-other-income',
  templateUrl: './other-income.component.html',
  styleUrls: ['./other-income.component.css']
})
export class OtherIncomeComponent implements OnInit {
  
  // Constructor and overrides
  constructor(private _otherIncomeService: OtherIncomeService,
    private _snackBar: MatSnackBar,
    private _snackBarTemplate: SnackBarTemplate,
    public _matDialogRef: MatDialog,
    private _softwareSecurityService: SoftwareSecurityService,
    ) {
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
    this._userRightsSubscription = await (await this._softwareSecurityService.PageModuleRights("Other Income")).subscribe(
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
        if (this._userRightsSubscription !== null) this._userRightsSubscription.unsubscribe();
      }
    );

    await this.GetOtherIncomeListData();
  }
  
  // Class properties
  public _listOtherIncomeObservableArray: ObservableArray = new ObservableArray();
  public _listOtherIncomeCollectionView: CollectionView = new CollectionView(this._listOtherIncomeObservableArray);
  public _listPageIndex: number = 15;

  public _isProgressBarHidden = false;
  public _isDataLoaded: boolean = false;

  private _otherIncomeListSubscription: any;
  private _addOtherIncomeSubscription: any;
  private _deleteOtherIncomeSubscription: any;

  public _btnAddDisabled: boolean = false;

  // DOM declaration
  @ViewChild('flexOtherIncome') _flexOtherIncome: wjcGrid.FlexGrid;

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
    this._listOtherIncomeCollectionView.pageSize = this.listPageIndex;
    this._listOtherIncomeCollectionView.refresh();
    this._listOtherIncomeCollectionView.refresh();
  }

  // Methods
  private async GetOtherIncomeListData() {
    this._listOtherIncomeObservableArray = new ObservableArray();
    this._listOtherIncomeCollectionView = new CollectionView(this._listOtherIncomeObservableArray);
    this._listOtherIncomeCollectionView.pageSize = 15;
    this._listOtherIncomeCollectionView.trackChanges = true;
    await this._listOtherIncomeCollectionView.refresh();
    await this._flexOtherIncome.refresh();

    this._isProgressBarHidden = true;

    this._otherIncomeListSubscription = (await this._otherIncomeService.OtherIncomeList()).subscribe(
      (response: any) => {
        var results = response;
        console.log("Response:", results);

        if (results["length"] > 0) {
          this._listOtherIncomeObservableArray = results;
          this._listOtherIncomeCollectionView = new CollectionView(this._listOtherIncomeObservableArray);
          this._listOtherIncomeCollectionView.pageSize = 15;
          this._listOtherIncomeCollectionView.trackChanges = true;
          this._listOtherIncomeCollectionView.refresh();
          this._flexOtherIncome.refresh();
        }

        this._isDataLoaded = true;
        this._isProgressBarHidden = false;

        if (this._otherIncomeListSubscription != null) this._otherIncomeListSubscription.unsubscribe();
      },
      error => {
        if (error.status == "401") {
          location.reload();
        } else {
          this._snackBarTemplate.snackBarError(this._snackBar, error.error.Message + " " + " Status Code: " + error.status);
          if (this._otherIncomeListSubscription != null) this._otherIncomeListSubscription.unsubscribe();

        }
      }
    );
  }

  public async AddOtherIncome() {
    this._btnAddDisabled = true;
    if (this._isDataLoaded == true) {
      this._isDataLoaded = false;
      this._addOtherIncomeSubscription = (await this._otherIncomeService.AddOtherIncome()).subscribe(
        (response: any) => {
          this._btnAddDisabled = false;
          this._isDataLoaded = true;
          this.GetOtherIncomeListData();
          this.DetailOtherIncome(response, "OtherIncome Detail")
          this._snackBarTemplate.snackBarSuccess(this._snackBar, "Added Successfully");
        },
        error => {
          this._btnAddDisabled = false;
          this._isDataLoaded = true;
          this._snackBarTemplate.snackBarError(this._snackBar, error.error + " " + " Status Code: " + error.status);
          if (this._addOtherIncomeSubscription != null) this._addOtherIncomeSubscription.unsubscribe();
        }
      );
    }
  }

  public EditOtherIncome() {
    let currentOtherIncome = this._listOtherIncomeCollectionView.currentItem;
    this.DetailOtherIncome(currentOtherIncome.Id, "Edit Other Income Detail");
  }

  public async DeleteOtherIncome() {
    let currentOtherIncome = this._listOtherIncomeCollectionView.currentItem;
    this._isProgressBarHidden = true;

    if (this._isDataLoaded == true) {
      this._isDataLoaded = false;
      this._deleteOtherIncomeSubscription = (await this._otherIncomeService.DeleteOtherIncome(currentOtherIncome.Id)).subscribe(
        response => {
          this._snackBarTemplate.snackBarSuccess(this._snackBar, "Delete Successfully");
          this.GetOtherIncomeListData();
          this._isProgressBarHidden = false;
          this._isDataLoaded = true;
        },
        error => {
          this._isDataLoaded = true;
          this._isProgressBarHidden = false;
          this._snackBarTemplate.snackBarError(this._snackBar, error.error.Message + " " + error.status);
          if (this._deleteOtherIncomeSubscription != null) this._deleteOtherIncomeSubscription.unsubscribe();
        }
      );
    }
  }

  public ComfirmDeleteOtherIncome(): void {
    let currentOtherIncome = this._listOtherIncomeCollectionView.currentItem;
    const userRegistrationlDialogRef = this._matDialogRef.open(DeleteDialogBoxComponent, {
      width: '500px',
      data: {
        objDialogTitle: "Delete OtherIncome",
        objComfirmationMessage: ` Delete this ${currentOtherIncome.OtherIncome}?`,
      },
      disableClose: true
    });

    userRegistrationlDialogRef.afterClosed().subscribe(result => {
      if (result.message == "Yes") {
        this.DeleteOtherIncome();
      }
    });
  }

  public DetailOtherIncome(OtherIncomeId: string, eventTitle: string): void {
    const userRegistrationlDialogRef = this._matDialogRef.open(OtherIncodeDetailDialogComponent, {
      width: '1200px',
      data: {
        objDialogTitle: eventTitle,
        objOtherIncomeId: OtherIncomeId,
      },
      disableClose: true
    });

    userRegistrationlDialogRef.afterClosed().subscribe(result => {
      if (result.event !== "Close") {
        this.GetOtherIncomeListData();
      }
    });
  }
  
  async ngOnInit() {
    await this.Get_userRights();
    await this.createCboShowNumberOfRows();
  }

  ngOnDestroy() {
    if (this._otherIncomeListSubscription !== null) this._otherIncomeListSubscription.unsubscribe();
  }

}
