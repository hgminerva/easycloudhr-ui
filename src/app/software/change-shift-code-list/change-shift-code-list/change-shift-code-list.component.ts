import { Component, OnInit, ViewChild } from '@angular/core';
import * as wjcGrid from '@grapecity/wijmo.grid';
import * as wjcCore from '@grapecity/wijmo';

import { CollectionView, ObservableArray } from '@grapecity/wijmo';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackBarTemplate } from '../../shared/snack-bar-template';

import { DeleteDialogBoxComponent } from '../../shared/delete-dialog-box/delete-dialog-box.component';
import { ChangeShiftCodeListService } from './../change-shift-code-list.service';
import { SoftwareSecurityService, UserModule } from '../../software-security/software-security.service';
@Component({
  selector: 'app-change-shift-code-list',
  templateUrl: './change-shift-code-list.component.html',
  styleUrls: ['./change-shift-code-list.component.css']
})
export class ChangeShiftCodeListComponent implements OnInit {

  constructor(
    private _changeShiftCodeListService: ChangeShiftCodeListService,
    private router: Router,
    private _snackBar: MatSnackBar,
    private _snackBarTemplate: SnackBarTemplate,
    public _matDialog: MatDialog,
    private softwareSecurityService: SoftwareSecurityService,

  ) {
  }

  private _userRightsSubscription: any;

  public userRights: UserModule = {
    Module: "",
    CanOpen: false,
    CanAdd: false,
    CanEdit: false,
    CanDelete: false,
    CanLock: false,
    CanUnlock: false,
    CanPrint: false,
  }

  public _isComponentsShown: boolean = false;

  gridClick(s, e) {
    if (wjcCore.hasClass(e.target, 'button-edit')) {
      if (this.userRights.CanEdit) {
        this.EditChangeShiftCode();
      }

    }

    if (wjcCore.hasClass(e.target, 'button-delete')) {
      if (this.userRights.CanDelete) {
        this.ComfirmDeleteChangeShiftCode();
      }
    }
  }

  async ngOnInit() {
    await this.GetUserRights();
    await this.CreateCboShowNumberOfRows();
  }

  private async GetUserRights() {
    this._userRightsSubscription = await (await this.softwareSecurityService.PageModuleRights("Change Shift List")).subscribe(
      (response: any) => {
        let results = response;
        if (results !== null) {
          this.userRights.Module = results["Module"];
          this.userRights.CanOpen = results["CanOpen"];
          this.userRights.CanAdd = results["CanAdd"];
          this.userRights.CanEdit = results["CanEdit"];
          this.userRights.CanDelete = results["CanDelete"];
          this.userRights.CanLock = results["CanLock"];
          this.userRights.CanUnlock = results["CanUnlock"];
          this.userRights.CanPrint = results["CanPrint"];
        }

        if (this._userRightsSubscription !== null) this._userRightsSubscription.unsubscribe();
      },
      error => {
        this._snackBarTemplate.snackBarError(this._snackBar, error.error.Message + " " + error.status);
        if (this._userRightsSubscription !== null) this._userRightsSubscription.unsubscribe();
      }
    );

    await this.GetPayrollGroupDropdownListData();
  }

  private _payrollGroupDropdownSubscription: any;
  public _payrollGroupListDropdown: any = [];
  public _filterPayrollGroup = '';

  public _listChangeShiftCodeObservableArray: ObservableArray = new ObservableArray();
  public _listChangeShiftCodeCollectionView: CollectionView = new CollectionView(this._listChangeShiftCodeObservableArray);
  public _listPageIndex: number = 15;
  @ViewChild('flexShiftCode') flexShiftCode: wjcGrid.FlexGrid;
  public _isProgressBarHidden = false;
  public _isDataLoaded: boolean = false;

  private _changeShiftCodeListSubscription: any;
  private _addChangeShiftCodeSubscription: any;
  private _deleteChangeShiftCodeSubscription: any;

  public _buttonDisabled: boolean = false;

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
    this._listChangeShiftCodeCollectionView.pageSize = this._listPageIndex;
    this._listChangeShiftCodeCollectionView.refresh();
    this._listChangeShiftCodeCollectionView.refresh();
  }

  private async GetPayrollGroupDropdownListData() {
    this._payrollGroupDropdownSubscription = await (await this._changeShiftCodeListService.PayrollGroupList()).subscribe(
      response => {
        var results = response;
        if (results["length"] > 0) {
          for (var i = 0; i < results["length"]; i++) {
            this._payrollGroupListDropdown.push(results[i]);
          }
        }
        this._filterPayrollGroup = this._payrollGroupListDropdown[0].Value;

        this.GetChangeShiftCodeListData();
        if (this._payrollGroupDropdownSubscription !== null) this._payrollGroupDropdownSubscription.unsubscribe();
      },
      error => {
        if (error.status == "401") {
          location.reload();
        } else {
          this._snackBarTemplate.snackBarError(this._snackBar, error.error.Message + " " + " Status Code: " + error.status);
        }
      }
    );
  }

  public PayrollGroupSelectionChange() {
    this.GetChangeShiftCodeListData();
  }

  private async GetChangeShiftCodeListData() {
    this._listChangeShiftCodeObservableArray = new ObservableArray();
    this._listChangeShiftCodeCollectionView = new CollectionView(this._listChangeShiftCodeObservableArray);
    this._listChangeShiftCodeCollectionView.pageSize = 15;
    this._listChangeShiftCodeCollectionView.trackChanges = true;
    await this._listChangeShiftCodeCollectionView.refresh();
    await this.flexShiftCode.refresh();

    this._isProgressBarHidden = true;

    this._changeShiftCodeListSubscription = await (await this._changeShiftCodeListService.ChangeShiftCodeList(this._filterPayrollGroup)).subscribe(
      (response: any) => {
        var results = response;
        console.log("Response:", results);

        if (results["length"] > 0) {
          this._listChangeShiftCodeCollectionView = results;
          this._listChangeShiftCodeCollectionView = new CollectionView(this._listChangeShiftCodeCollectionView);
          this._listChangeShiftCodeCollectionView.pageSize = 15;
          this._listChangeShiftCodeCollectionView.trackChanges = true;
          this._listChangeShiftCodeCollectionView.refresh();
          this.flexShiftCode.refresh();
        }

        this._isDataLoaded = true;
        this._isProgressBarHidden = false;
        if (this._changeShiftCodeListSubscription != null) this._changeShiftCodeListSubscription.unsubscribe();
      },
      error => {
        this._isProgressBarHidden = false;
        if (error.status == "401") {
          location.reload();
        } else {
          this._snackBarTemplate.snackBarError(this._snackBar, error.error.Message + " " + " Status Code: " + error.status);
          if (this._changeShiftCodeListSubscription != null) this._changeShiftCodeListSubscription.unsubscribe();
        }
      }
    );
  }

  public async AddChangeShiftCode() {
    this._buttonDisabled = true;
    if (this._isDataLoaded == true) {
      this._isDataLoaded = false;
      this._addChangeShiftCodeSubscription = await (await this._changeShiftCodeListService.AddChangeShiftCode(this._filterPayrollGroup)).subscribe(
        (response: any) => {
          this._buttonDisabled = false;
          this._isDataLoaded = true;
          this.GetChangeShiftCodeListData();
          this._snackBarTemplate.snackBarSuccess(this._snackBar, "Added Successfully");
          this.router.navigate(['/software/change-shift-code-detail/' + response]);
        },
        error => {
          this._buttonDisabled = false;
          this._isDataLoaded = true;
          this._snackBarTemplate.snackBarError(this._snackBar, error.error + " " + " Status Code: " + error.status);
          if (this._addChangeShiftCodeSubscription != null) this._addChangeShiftCodeSubscription.unsubscribe();
        }
      );
    }
  }

  public EditChangeShiftCode() {
    let currentShiftCode = this._listChangeShiftCodeCollectionView.currentItem;
    this.router.navigate(['/software/change-shift-code-detail/' + currentShiftCode.Id]);
  }

  public async DeleteChangeShiftCode() {
    if (this._isDataLoaded == true) {
      this._isDataLoaded = false;
      let currentShiftCode = this._listChangeShiftCodeCollectionView.currentItem;
      this._isProgressBarHidden = true;

      this._deleteChangeShiftCodeSubscription = await (await this._changeShiftCodeListService.DeleteChangeShiftCode(currentShiftCode.Id)).subscribe(
        response => {
          this._snackBarTemplate.snackBarSuccess(this._snackBar, "Delete Successfully");
          this.GetChangeShiftCodeListData();
          this._isProgressBarHidden = false;
          this._isDataLoaded = true;
        },
        error => {
          this._isDataLoaded = true;
          this._snackBarTemplate.snackBarError(this._snackBar, error.error + " " + error.status);
          if (this._deleteChangeShiftCodeSubscription != null) this._deleteChangeShiftCodeSubscription.unsubscribe();
        }
      );
    }
  }

  public ComfirmDeleteChangeShiftCode(): void {
    let currentChangeShiftCode = this._listChangeShiftCodeCollectionView.currentItem;
    const userRegistrationlDialogRef = this._matDialog.open(DeleteDialogBoxComponent, {
      width: '500px',
      data: {
        objDialogTitle: "Delete Change Shift",
        objComfirmationMessage: `Delete ${currentChangeShiftCode.CSNumber}?`,
      },
      disableClose: true
    });

    userRegistrationlDialogRef.afterClosed().subscribe(result => {
      if (result.message == "Yes") {
        this.DeleteChangeShiftCode();
      }
    });
  }

  ngOnDestroy() {
    if (this._changeShiftCodeListSubscription != null) this._changeShiftCodeListSubscription.unsubscribe();
  }
}
