import { Component, OnInit, ViewChild } from '@angular/core';
import * as wjcGrid from '@grapecity/wijmo.grid';
import * as wjcCore from '@grapecity/wijmo';
import { CollectionView, ObservableArray } from '@grapecity/wijmo';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackBarTemplate } from '../../shared/snack-bar-template';

import { DeleteDialogBoxComponent } from '../../shared/delete-dialog-box/delete-dialog-box.component';
import { PayrollOtherIncomeService } from './../payroll-other-income.service';
import { SoftwareSecurityService, UserModule } from '../../software-security/software-security.service';

@Component({
  selector: 'app-payroll-other-income-list',
  templateUrl: './payroll-other-income-list.component.html',
  styleUrls: ['./payroll-other-income-list.component.css']
})
export class PayrollOtherIncomeListComponent implements OnInit {

  constructor(
    private _payrollOtherIncomeService: PayrollOtherIncomeService,
    private router: Router,
    private _snackBar: MatSnackBar,
    private _snackBarTemplate: SnackBarTemplate,
    public _matDialog: MatDialog,
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
    this._userRightsSubscription = await (await this._softwareSecurityService.PageModuleRights("Payroll Other Income List")).subscribe(
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
          this.router.navigate(['/security/login']);
        }
        if (this._userRightsSubscription !== null) this._userRightsSubscription.unsubscribe();
      }
    );

    await this.GetPayrollGroupDropdownListData();
  }

  private _payrollGroupDropdownSubscription: any;
  public _payrollGroupListDropdown: any = [];
  public _filterPayrollGroup = '';

  public _listPayrollOtherIncomeObservableArray: ObservableArray = new ObservableArray();
  public _listPayrollOtherIncomeCollectionView: CollectionView = new CollectionView(this._listPayrollOtherIncomeObservableArray);
  public _listPageIndex: number = 15;
  @ViewChild('flexPayrollOtherIncome') _flexPayrollOtherIncome: wjcGrid.FlexGrid;
  public _isProgressBarHidden = false;
  public _isDataLoaded: boolean = false;

  private _payrollOtherIncomeListSubscription: any;
  private _addPayrollOtherIncomeSubscription: any;
  private _deletePayrollOtherIncomeSubscription: any;

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
    this._listPayrollOtherIncomeCollectionView.pageSize = this._listPageIndex;
    this._listPayrollOtherIncomeCollectionView.refresh();
    this._listPayrollOtherIncomeCollectionView.refresh();
  }

  private async GetPayrollGroupDropdownListData() {
    this._payrollGroupDropdownSubscription = await (await this._payrollOtherIncomeService.PayrollGroupList()).subscribe(
      response => {
        var results = response;
        if (results["length"] > 0) {
          for (var i = 0; i < results["length"]; i++) {
            this._payrollGroupListDropdown.push(results[i]);
          }
        }
        this._filterPayrollGroup = this._payrollGroupListDropdown[0].Value;

        this.GetPayrollOtherIncomeListData();
        if (this._payrollGroupDropdownSubscription !== null) this._payrollGroupDropdownSubscription.unsubscribe();
      },
      error => {
        this._snackBarTemplate.snackBarError(this._snackBar, error.error.Message + " " + " Status Code: " + error.status);
      }
    );
  }

  public PayrollGroupSelectionChange() {
    this.GetPayrollOtherIncomeListData();
  }

  private async GetPayrollOtherIncomeListData() {
    this._listPayrollOtherIncomeObservableArray = new ObservableArray();
    this._listPayrollOtherIncomeCollectionView = new CollectionView(this._listPayrollOtherIncomeObservableArray);
    this._listPayrollOtherIncomeCollectionView.pageSize = 15;
    this._listPayrollOtherIncomeCollectionView.trackChanges = true;
    await this._listPayrollOtherIncomeCollectionView.refresh();
    await this._flexPayrollOtherIncome.refresh();

    this._isProgressBarHidden = true;

    this._payrollOtherIncomeListSubscription = await (await this._payrollOtherIncomeService.PayrollOtherIncomeList(this._filterPayrollGroup)).subscribe(
      (response: any) => {
        var results = response;
        if (results["length"] > 0) {
          this._listPayrollOtherIncomeCollectionView = results;
          this._listPayrollOtherIncomeCollectionView = new CollectionView(this._listPayrollOtherIncomeCollectionView);
          this._listPayrollOtherIncomeCollectionView.pageSize = 15;
          this._listPayrollOtherIncomeCollectionView.trackChanges = true;
          this._listPayrollOtherIncomeCollectionView.refresh();
          this._flexPayrollOtherIncome.refresh();
        }

        this._isDataLoaded = true;
        this._isProgressBarHidden = false;
        if (this._payrollOtherIncomeListSubscription != null) this._payrollOtherIncomeListSubscription.unsubscribe();
      },
      error => {
        this._isProgressBarHidden = false;
        if (error.status == "401") {
          location.reload();
        } else {
          this._snackBarTemplate.snackBarError(this._snackBar, error.error.Message + " " + " Status Code: " + error.status);
          if (this._payrollOtherIncomeListSubscription != null) this._payrollOtherIncomeListSubscription.unsubscribe();
        }
      }
    );
  }

  gridClick(s, e) {
    if (wjcCore.hasClass(e.target, 'button-edit')) {
      if (this._userRights.CanEdit) {
        this.EditPayrollOtherIncome();
      }

    }

    if (wjcCore.hasClass(e.target, 'button-delete')) {
      if (this._userRights.CanDelete) {
        this.ComfirmDeletePayrollOtherIncome();
      }
    }
  }

  public async AddPayrollOtherIncome() {
    this._buttonDisabled = true;
    if (this._isDataLoaded == true) {
      this._isDataLoaded = false;
      this._addPayrollOtherIncomeSubscription = await (await this._payrollOtherIncomeService.AddPayrollOtherIncome(this._filterPayrollGroup)).subscribe(
        (response: any) => {
          this._buttonDisabled = false;
          this._isDataLoaded = true;
          this.GetPayrollOtherIncomeListData();
          this._snackBarTemplate.snackBarSuccess(this._snackBar, "Added Successfully");
          this.router.navigate(['/software/payroll-other-income-detail/' + response]);
        },
        error => {
          this._buttonDisabled = false;
          this._isDataLoaded = true;
          this._snackBarTemplate.snackBarError(this._snackBar, error.error + " " + " Status Code: " + error.status);
          if (this._addPayrollOtherIncomeSubscription != null) this._addPayrollOtherIncomeSubscription.unsubscribe();
        }
      );
    }
  }

  public EditPayrollOtherIncome() {
    let currentPayrollOtherIncome = this._listPayrollOtherIncomeCollectionView.currentItem;
    this.router.navigate(['/software/payroll-other-income-detail/' + currentPayrollOtherIncome.Id]);
  }

  public async DeletePayrollOtherIncome() {
    if (this._isDataLoaded == true) {
      this._isDataLoaded = false;
      let currentPayrollOtherIncome = this._listPayrollOtherIncomeCollectionView.currentItem;
      this._isProgressBarHidden = true;

      this._deletePayrollOtherIncomeSubscription = await (await this._payrollOtherIncomeService.DeletePayrollOtherIncome(currentPayrollOtherIncome.Id)).subscribe(
        response => {
          this._snackBarTemplate.snackBarSuccess(this._snackBar, "Delete Successfully");
          this.GetPayrollOtherIncomeListData();
          this._isProgressBarHidden = false;
          this._isDataLoaded = true;
        },
        error => {
          this._isDataLoaded = true;
          this._snackBarTemplate.snackBarError(this._snackBar, error.error + " " + error.status);
          if (this._deletePayrollOtherIncomeSubscription != null) this._deletePayrollOtherIncomeSubscription.unsubscribe();
        }
      );
    }
  }

  public ComfirmDeletePayrollOtherIncome(): void {
    let currentPayrollOtherIncome = this._listPayrollOtherIncomeCollectionView.currentItem;
    const userRegistrationlDialogRef = this._matDialog.open(DeleteDialogBoxComponent, {
      width: '500px',
      data: {
        objDialogTitle: "Delete Change Shift",
        objComfirmationMessage: `Delete ${currentPayrollOtherIncome.PINumber}?`,
      },
      disableClose: true
    });

    userRegistrationlDialogRef.afterClosed().subscribe(result => {
      if (result.message == "Yes") {
        this.DeletePayrollOtherIncome();
      }
    });
  }

  async ngOnInit() {
    await this.Get_userRights();
    await this.CreateCboShowNumberOfRows();
  }

  ngOnDestroy() {
    if (this._payrollOtherIncomeListSubscription != null) this._payrollOtherIncomeListSubscription.unsubscribe();
  }
}
