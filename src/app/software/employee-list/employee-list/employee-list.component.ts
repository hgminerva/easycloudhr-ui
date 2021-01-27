import { Component, OnInit, ViewChild } from '@angular/core';

import * as wjcCore from '@grapecity/wijmo';
import * as wjcGrid from '@grapecity/wijmo.grid';
import { CollectionView, ObservableArray } from '@grapecity/wijmo';

import { EmployeeListService } from '../employee-list.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackBarTemplate } from '../../shared/snack-bar-template';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { SoftwareSecurityService, UserModule } from '../../software-security/software-security.service';
import { SharedService } from '../../shared/shared.service';
import { ComfirmMassageDialogComponent } from '../../shared/comfirm-massage-dialog/comfirm-massage-dialog.component';

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.css']
})
export class EmployeeListComponent implements OnInit {

  constructor(private employeeListService: EmployeeListService,
    private snackBar: MatSnackBar,
    private snackBarTemplate: SnackBarTemplate,
    private router: Router,
    public DeleteConfirmDialog: MatDialog,
    private softwareSecurityService: SoftwareSecurityService,
    private _sharedService: SharedService
  ) {
  }

  // ==================
  //Security User Rights
  // ===================
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

  private async GetUserRights() {
    this._userRightsSubscription = await (await this.softwareSecurityService.PageModuleRights("Employee List")).subscribe(
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
        this.snackBarTemplate.snackBarError(this.snackBar, error.error.Message + " " + error.status);

        if (error.status == "401") {
          this.softwareSecurityService.logOut();
        }
        if (this._userRightsSubscription !== null) this._userRightsSubscription.unsubscribe();
      }
    );

    await this.GetPayrollGroupDropdownListData();
  }

  // ========================
  // EmployeePayroll Dropdown
  // ========================
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
    this.listEmployeeCollectionView.pageSize = this.listPageIndex;
    this.listEmployeeCollectionView.refresh();
    this.listEmployeeCollectionView.refresh();
  }

  // ========================
  // EmployeePayroll Dropdown
  // ========================
  private payrollGroupDropdownSubscription: any;
  public payrollGroupListDropdown: any = [];
  public filterPayrollGroup = '';
  public unauthorizedQueryCount: number = 0;

  private async GetPayrollGroupDropdownListData() {
    this.payrollGroupDropdownSubscription = await (await this.employeeListService.PayrollGroupList()).subscribe(
      response => {
        var results = response;
        if (results["length"] > 0) {
          for (var i = 0; i < results["length"]; i++) {
            this.payrollGroupListDropdown.push(results[i]);
          }
        }
        this.filterPayrollGroup = this.payrollGroupListDropdown[0].Value;

        this.GetEmployeeData();
        if (this.payrollGroupDropdownSubscription !== null) this.payrollGroupDropdownSubscription.unsubscribe();
      },
      error => {
        this.snackBarTemplate.snackBarError(this.snackBar, error.error.Message + " " + " Status Code: " + error.status);
        if (this.payrollGroupDropdownSubscription !== null) this.payrollGroupDropdownSubscription.unsubscribe();
      }
    );
  }

  public payrollGroupSelectionChange() {
    this.GetEmployeeData();
  }

  // =============
  // Employee List
  // =============

  public listEmployeeObservableArray: ObservableArray = new ObservableArray();
  public listEmployeeCollectionView: CollectionView = new CollectionView(this.listEmployeeObservableArray);
  @ViewChild('flexEmployees') flexEmployees: wjcGrid.FlexGrid;
  public isProgressBarHidden = false;
  public isDataLoaded: boolean = false;
  public isEmployeeListAuthorized: boolean = false;

  private employeeListSubscription: any;
  private AddEmployeeSubscription: any;
  private DeletemployeeListSubscription: any;

  public btnAddDisabled: boolean = false;
  public pageNumber: number = 0;

  private async GetEmployeeData() {
    this.listEmployeeObservableArray = new ObservableArray();
    this.listEmployeeCollectionView = new CollectionView(this.listEmployeeObservableArray);
    this.listEmployeeCollectionView.pageSize = 15;
    this.listEmployeeCollectionView.trackChanges = true;
    await this.listEmployeeCollectionView.refresh();
    await this.flexEmployees.refresh();

    this.isProgressBarHidden = true;

    this.employeeListSubscription = await (await this.employeeListService.EmployeeList(this.filterPayrollGroup)).subscribe(
      (response: any) => {
        var results = response;
        if (results["length"] > 0) {
          this.listEmployeeObservableArray = results;
          this.listEmployeeCollectionView = new CollectionView(this.listEmployeeObservableArray);
          this.listEmployeeCollectionView.pageSize = 15;
          this.listEmployeeCollectionView.trackChanges = true;
          this.listEmployeeCollectionView.refresh();
          this.flexEmployees.refresh();
        }

        this.isDataLoaded = true;
        this.isProgressBarHidden = false;

        if (this.employeeListSubscription != null) this.employeeListSubscription.unsubscribe();
      },
      error => {
        this.snackBarTemplate.snackBarError(this.snackBar, error.error.Message + " " + error.status);
        if (this.employeeListSubscription != null) this.employeeListSubscription.unsubscribe();
      }
    );
  }

  gridClick(s, e) {
    if (wjcCore.hasClass(e.target, 'button-edit')) {
      if (this.userRights.CanEdit) {
        this.EditEmployeeDetail();
      }

    }

    if (wjcCore.hasClass(e.target, 'button-delete')) {
      if (this.userRights.CanDelete) {
        this.ComfirmDeleteEmployee();
      }
    }
  }

  public async AddEmployeeDetail() {
    this.btnAddDisabled = true;
    if (this.isDataLoaded == true) {
      this.isDataLoaded = false;
      this.AddEmployeeSubscription = await (await this.employeeListService.AddEmployee()).subscribe(
        response => {
          this.btnAddDisabled = false;
          this.isDataLoaded = true;
          this.snackBarTemplate.snackBarSuccess(this.snackBar, "Added Successfully");
          this.router.navigate(['/software/employee-detail/' + response]);
        },
        error => {
          this.btnAddDisabled = false;
          this.isDataLoaded = true;
          this.snackBarTemplate.snackBarError(this.snackBar, error.error + " " + " Status Code: " + error.status);
          if (this.AddEmployeeSubscription != null) this.AddEmployeeSubscription.unsubscribe();
        }
      );
    }
  }

  public async EditEmployeeDetail() {
    let currentEmployee = this.listEmployeeCollectionView.currentItem;
    this.router.navigate(['/software/employee-detail/' + currentEmployee.Id]);
  }

  public async DeleteEmployeeDetail() {
    let currentEmployee = this.listEmployeeCollectionView.currentItem;
    this.DeletemployeeListSubscription = await (await this.employeeListService.DeleteEmployee(currentEmployee.Id)).subscribe(
      response => {
        this.GetEmployeeData();
        this.snackBarTemplate.snackBarSuccess(this.snackBar, "Deleted Successfully");
        if (this.DeletemployeeListSubscription != null) this.DeletemployeeListSubscription.unsubscribe();
      },
      error => {
        this.snackBarTemplate.snackBarError(this.snackBar, error.error + " " + " Status Code: " + error.status);
        if (this.DeletemployeeListSubscription != null) this.DeletemployeeListSubscription.unsubscribe();
      }
    );
  }

  public ComfirmDeleteEmployee(): void {
    let currentEmployee = this.listEmployeeCollectionView.currentItem;

    const userRegistrationlDialogRef = this.DeleteConfirmDialog.open(ComfirmMassageDialogComponent, {
      width: '500px',
      data: {
        objDialogTitle: "Delete Employee",
        objComfirmationMessage: `Delete ${currentEmployee.FullName}?`,
      },
      disableClose: true
    });

    userRegistrationlDialogRef.afterClosed().subscribe(result => {
      if (result.message == "Yes") {
        this.DeleteEmployeeDetail();
      }
    });
  }

  public btnCSVEmployeesListClick(): void {
    this._sharedService.generateCSV(this.listEmployeeCollectionView, "Employees List", "employees-list.csv");
  }

  async ngOnInit() {
    await this.GetUserRights();
    await this.createCboShowNumberOfRows();
  }

  ngOnDestroy() {
    if (this.payrollGroupDropdownSubscription !== null) this.payrollGroupDropdownSubscription.unsubscribe();
  }

}
