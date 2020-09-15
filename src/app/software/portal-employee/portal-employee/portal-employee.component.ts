import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackBarTemplate } from '../../shared/snack-bar-template';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import * as wjcGrid from '@grapecity/wijmo.grid';
import { CollectionView, ObservableArray } from '@grapecity/wijmo';

import { PortalEmployeeService } from './../portal-employee.service';
import { PortalEmployeeModel } from './../portal-employee.model';
import { PortalEmployeeOvertimeApplicationDialogComponent } from '../portal-employee-overtime-application-dialog/portal-employee-overtime-application-dialog.component';
import { PortalEmployeeLeaveApplicationDialogComponent } from '../portal-employee-leave-application-dialog/portal-employee-leave-application-dialog.component';
import { PortalEmployeeLoanDialogComponent } from '../portal-employee-loan-dialog/portal-employee-loan-dialog.component';
import { PortalEmployeeDtrDialogComponent } from '../portal-employee-dtr-dialog/portal-employee-dtr-dialog.component';
import { PortalEmployeePayrollDialogComponent } from '../portal-employee-payroll-dialog/portal-employee-payroll-dialog.component';
import { UserChangePasswordDialogComponent } from '../../shared/user-change-password-dialog/user-change-password-dialog.component';

@Component({
  selector: 'app-portal-employee',
  templateUrl: './portal-employee.component.html',
  styleUrls: ['./portal-employee.component.css']
})
export class PortalEmployeeComponent implements OnInit {

  constructor(
    private _snackBar: MatSnackBar,
    private _snackBarTemplate: SnackBarTemplate,
    private _portalEmployeeService: PortalEmployeeService,
    public _matDialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.GetEmployeeDetail();
  }

  public _portalEmployeeModel: PortalEmployeeModel = {
    Id: 0,
    EmployeeCode: '',
    IdNumber: '',
    BiometricIdNumber: '',
    FullName: '',
    Address: '',
    ContactNumber: '',
    ContactMobileNumber: '',
    PictureURL: '',
    PayrollGroup: '',
    Company: '',
    Branch: '',
    Position: ''
  }

  public _employeeDetailSubscription: any;

  public _isProgressBarHidden: boolean = false;
  public _isComponentsShown: boolean = false;
  public _isDataLoaded: boolean = false;

  // Class properties
  // OT Application Header
  public _listOvertimeApplicationObservableArray: ObservableArray = new ObservableArray();
  public _listOvertimeApplicationCollectionView: CollectionView = new CollectionView(this._listOvertimeApplicationObservableArray);
  public _listOvertimeApplicationPageIndex: number = 15;

  public _isOvertimeApplicationProgressBarHidden = false;
  public _isOvertimeApplicationDataLoaded: boolean = false;

  private _overtimeApplicationSubscription: any;

  @ViewChild('flexOvertimeApplication') _flexOvertimeApplication: wjcGrid.FlexGrid;

  // Loan
  public _listLoanObservableArray: ObservableArray = new ObservableArray();
  public _listLoanCollectionView: CollectionView = new CollectionView(this._listLoanObservableArray);
  public _istLoanPageIndex: number = 15;

  public __isProgressBarHidden = false;
  public __isDataLoaded: boolean = false;

  // DOM declaration
  @ViewChild('flexLoan') _flexLoan: wjcGrid.FlexGrid;

  private _loanListSubscription: any;

  // =============== 
  // Employee Detail
  // =============== 
  private async GetEmployeeDetail() {
    this._isProgressBarHidden = true;
    this._isComponentsShown = false;

    this._employeeDetailSubscription = (await this._portalEmployeeService.EmployeeDetail()).subscribe(
      response => {
        let result = response;
        console.log(result)

        if (result["Id"] === null || result["Id"] === 0) {
          this._snackBarTemplate.snackBarError(this._snackBar, "Link employee to current user.");
        }

        if (result != null) {
          this._portalEmployeeModel.Id = result["Id"];
          this._portalEmployeeModel.EmployeeCode = result["EmployeeCode"];
          this._portalEmployeeModel.IdNumber = result["IdNumber"];
          this._portalEmployeeModel.BiometricIdNumber = result["BiometricIdNumber"];
          this._portalEmployeeModel.FullName = result["FullName"];
          this._portalEmployeeModel.Address = result["Address"];
          this._portalEmployeeModel.ContactNumber = result["ContactNumber"];
          this._portalEmployeeModel.ContactMobileNumber = result["ContactMobileNumber"];
          this._portalEmployeeModel.PictureURL = result["PictureURL"];
          this._portalEmployeeModel.PayrollGroup = result["PayrollGroup"];
          this._portalEmployeeModel.Company = result["Company"];
          this._portalEmployeeModel.Branch = result["Branch"];
          this._portalEmployeeModel.Position = result["Position"];
          this.GetOTYearDropdownListData();
        }

        this._isProgressBarHidden = false;
        this._isDataLoaded = true;
        this._isComponentsShown = true;
        if (this._employeeDetailSubscription !== null) this._employeeDetailSubscription.unsubscribe();
      },
      error => {
        if (error.status == "401") {
          location.reload();
        } else {
          this._snackBarTemplate.snackBarError(this._snackBar, error.error.Message + " " + " Status Code: " + error.status);
          if (this._employeeDetailSubscription != null) this._employeeDetailSubscription.unsubscribe();
        }
      }
    );
  }

  // ============ 
  // Current Year
  // ============ 

  private _yearOTCurrentSubscription: any;
  public _currentYearIdOT: number = 0;

  private _yearOTListSubscription: any;
  public _yearOTListDropdownList: any;


  private async GetOTYearDropdownListData() {
    this._yearOTListSubscription = await (await this._portalEmployeeService.YearList()).subscribe(
      response => {
        this._yearOTListDropdownList = response;
        this._currentYearIdOT = response[0].Id;
        this.GetCurrentOTYear();
        if (this._yearOTListSubscription !== null) this._yearOTListSubscription.unsubscribe();
      },
      error => {
        this._snackBarTemplate.snackBarError(this._snackBar, error.error.Message + " " + error.status);
        if (this._yearOTListSubscription !== null) this._yearOTListSubscription.unsubscribe();
      }
    );
  }

  private async GetCurrentOTYear() {
    this._yearOTCurrentSubscription = await (await this._portalEmployeeService.CurrentYear()).subscribe(
      (result: any) => {
        this._currentYearIdOT = result;
        if (this._yearOTCurrentSubscription !== null) this._yearOTCurrentSubscription.unsubscribe();
      },
      error => {
        this._snackBarTemplate.snackBarError(this._snackBar, error.error.Message + " " + error.status);
        if (this._yearOTCurrentSubscription !== null) this._yearOTCurrentSubscription.unsubscribe();
      }
    );

    await this.GetOvertimeApplicationListData();
    // await this.GetLeaveApplicationListData();
    // await this.GetDTRListData();
    // await this.GetPayrollListData();
  }

  activeTab() { }

  private async GetOvertimeApplicationListData() {

    this._listOvertimeApplicationObservableArray = new ObservableArray();
    this._listOvertimeApplicationCollectionView = new CollectionView(this._listOvertimeApplicationObservableArray);
    this._listOvertimeApplicationCollectionView.pageSize = 15;
    this._listOvertimeApplicationCollectionView.trackChanges = true;
    await this._listOvertimeApplicationCollectionView.refresh();
    await this._flexOvertimeApplication.refresh();

    this._isOvertimeApplicationProgressBarHidden = true;

    console.log(this._portalEmployeeModel.Id);
    this._overtimeApplicationSubscription = await (await this._portalEmployeeService.OvertimeApplicationList(this._portalEmployeeModel.Id, this._currentYearIdOT)).subscribe(
      (response: any) => {
        if (response["length"] > 0) {
          this._listOvertimeApplicationObservableArray = response;
          this._listOvertimeApplicationCollectionView = new CollectionView(this._listOvertimeApplicationObservableArray);
          this._listOvertimeApplicationCollectionView.pageSize = 15;
          this._listOvertimeApplicationCollectionView.trackChanges = true;
          this._listOvertimeApplicationCollectionView.refresh();
          this._flexOvertimeApplication.refresh();
        }

        this._isOvertimeApplicationDataLoaded = true;
        this._isOvertimeApplicationProgressBarHidden = false;
        if (this._overtimeApplicationSubscription !== null) this._overtimeApplicationSubscription.unsubscribe();
      },
      error => {
        this._isOvertimeApplicationProgressBarHidden = false;
        this._snackBarTemplate.snackBarError(this._snackBar, error.error.Message + " " + error.status);
        if (this._overtimeApplicationSubscription !== null) this._overtimeApplicationSubscription.unsubscribe();
      }
    );

    this.GetYearLADropdownListData();
  }

  public async ViewOvertimeApplication() {
    let currentOvertimeApplication = this._listOvertimeApplicationCollectionView.currentItem;
    const userRegistrationlDialogRef = this._matDialog.open(PortalEmployeeOvertimeApplicationDialogComponent, {
      width: '900px',
      data: {
        objDialogTitle: "Overtime Application",
        objDataOTApplication: currentOvertimeApplication,
        objDataEmployeeId: this._portalEmployeeModel.Id,
      },
      disableClose: true
    });

    userRegistrationlDialogRef.afterClosed().subscribe(result => {
      if (result.message == "Yes") {
        this.GetOvertimeApplicationListData();
      }
    });
  }

  // =================
  // Leave Application
  // =================
  private _yearLACurrentSubscription: any;
  public _currentYearIdLA: number = 0;

  private _yearLAListSubscription: any;
  public _yearLAListDropdownList: any;

  private async GetYearLADropdownListData() {
    this._yearLAListSubscription = await (await this._portalEmployeeService.YearList()).subscribe(
      response => {
        this._yearLAListDropdownList = response;
        this._currentYearIdLA = response[0].Id;
        this.GetCurrentLAYear();
        if (this._yearLAListSubscription !== null) this._yearLAListSubscription.unsubscribe();
      },
      error => {
        this._snackBarTemplate.snackBarError(this._snackBar, error.error.Message + " " + error.status);
        if (this._yearLAListSubscription !== null) this._yearLAListSubscription.unsubscribe();
      }
    );
  }

  private async GetCurrentLAYear() {
    this._yearLACurrentSubscription = await (await this._portalEmployeeService.CurrentYear()).subscribe(
      (result: any) => {
        this._currentYearIdLA = result;
        this.GetLeaveApplicationListData();
        if (this._yearLACurrentSubscription !== null) this._yearLACurrentSubscription.unsubscribe();
      },
      error => {
        this._snackBarTemplate.snackBarError(this._snackBar, error.error.Message + " " + error.status);
        if (this._yearLACurrentSubscription !== null) this._yearLACurrentSubscription.unsubscribe();
      }
    );
  }

  // Leave Application
  public _listLeaveApplicationObservableArray: ObservableArray = new ObservableArray();
  public _listLeaveApplicationCollectionView: CollectionView = new CollectionView(this._listLeaveApplicationObservableArray);
  public _leaveApplicationPageIndex: number = 15;

  public _isLeaveApplicationProgressBarHidden = false;
  public _isLeaveApplicationDataLoaded: boolean = false;

  private _leaveApplicationSubscription: any;

  @ViewChild('flexLeaveApplication') _flexLeaveApplication: wjcGrid.FlexGrid;

  private async GetLeaveApplicationListData() {

    this._listLeaveApplicationObservableArray = new ObservableArray();
    this._listLeaveApplicationCollectionView = new CollectionView(this._listLeaveApplicationObservableArray);
    this._listLeaveApplicationCollectionView.pageSize = 15;
    this._listLeaveApplicationCollectionView.trackChanges = true;
    await this._listLeaveApplicationCollectionView.refresh();
    await this._flexLeaveApplication.refresh();

    this._isLeaveApplicationProgressBarHidden = true;

    this._leaveApplicationSubscription = await (await this._portalEmployeeService.LeaveApplicationList(this._portalEmployeeModel.Id, this._currentYearIdLA)).subscribe(
      (response: any) => {
        if (response["length"] > 0) {
          this._listLeaveApplicationObservableArray = response;
          this._listLeaveApplicationCollectionView = new CollectionView(this._listLeaveApplicationObservableArray);
          this._listLeaveApplicationCollectionView.pageSize = 15;
          this._listLeaveApplicationCollectionView.trackChanges = true;
          this._listLeaveApplicationCollectionView.refresh();
          this._flexLeaveApplication.refresh();
        }

        this._isLeaveApplicationDataLoaded = true;
        this._isLeaveApplicationProgressBarHidden = false;
        if (this._leaveApplicationSubscription !== null) this._leaveApplicationSubscription.unsubscribe();
      },
      error => {
        this._isLeaveApplicationProgressBarHidden = false;
        this._snackBarTemplate.snackBarError(this._snackBar, error.error.Message + " " + error.status);
        if (this._leaveApplicationSubscription !== null) this._leaveApplicationSubscription.unsubscribe();
      }
    );

    await this.GetLoanListData();
    await this.GetYearDTRDropdownListData();
  }

  public async ViewLeaveApplication() {
    let currentLeaveApplication = this._listLeaveApplicationCollectionView.currentItem;
    const matDialogRef = this._matDialog.open(PortalEmployeeLeaveApplicationDialogComponent, {
      width: '900px',
      data: {
        objDialogTitle: "Leave Application",
        objDataLAApplication: currentLeaveApplication,
        objDataEmployeeId: this._portalEmployeeModel.Id,
      },
      disableClose: true
    });

    matDialogRef.afterClosed().subscribe(result => {
      if (result.message == "Yes") {
        this.GetLeaveApplicationListData();
      }
    });
  }

  // ===
  // DTR 
  // ===
  private _yearDTRCurrentSubscription: any;
  public _currentYearIdDTR: number = 0;

  private _yearDTRListSubscription: any;
  public _yearDTRListDropdownList: any;

  private async GetYearDTRDropdownListData() {
    this._yearDTRCurrentSubscription = await (await this._portalEmployeeService.YearList()).subscribe(
      response => {
        this._yearDTRListDropdownList = response;
        this._currentYearIdDTR = response[0].Id;
        this.GetCurrentDTRYear();
        if (this._yearDTRCurrentSubscription !== null) this._yearDTRCurrentSubscription.unsubscribe();
      },
      error => {
        this._snackBarTemplate.snackBarError(this._snackBar, error.error.Message + " " + error.status);
        if (this._yearDTRCurrentSubscription !== null) this._yearDTRCurrentSubscription.unsubscribe();
      }
    );
  }

  private async GetCurrentDTRYear() {
    this._yearDTRListSubscription = await (await this._portalEmployeeService.CurrentYear()).subscribe(
      (result: any) => {
        this._currentYearIdDTR = result;
        this.GetDTRListData();
        if (this._yearDTRListSubscription !== null) this._yearDTRListSubscription.unsubscribe();
      },
      error => {
        this._snackBarTemplate.snackBarError(this._snackBar, error.error.Message + " " + error.status);
        if (this._yearDTRListSubscription !== null) this._yearDTRListSubscription.unsubscribe();
      }
    );
  }

  public _listDTRObservableArray: ObservableArray = new ObservableArray();
  public _listDTRCollectionView: CollectionView = new CollectionView(this._listDTRObservableArray);
  public _listDTRPageIndex: number = 15;

  public _isDTRProgressBarHidden = false;
  public _isDTRDataLoaded: boolean = false;

  @ViewChild('flexDTR') flexDTR: wjcGrid.FlexGrid;

  private _dtrListSubscription: any;


  private async GetDTRListData() {

    this._listDTRObservableArray = new ObservableArray();
    this._listDTRCollectionView = new CollectionView(this._listDTRObservableArray);
    this._listDTRCollectionView.pageSize = 15;
    this._listDTRCollectionView.trackChanges = true;
    await this._listDTRCollectionView.refresh();
    await this.flexDTR.refresh();

    this._isDTRProgressBarHidden = true;

    this._dtrListSubscription = await (await this._portalEmployeeService.DTRList(this._portalEmployeeModel.Id, this._currentYearIdDTR)).subscribe(
      (response: any) => {
        if (response["length"] > 0) {
          this._listDTRObservableArray = response;
          this._listDTRCollectionView = new CollectionView(this._listDTRObservableArray);
          this._listDTRCollectionView.pageSize = 15;
          this._listDTRCollectionView.trackChanges = true;
          this._listDTRCollectionView.refresh();
          this.flexDTR.refresh();
        }

        this._isDTRDataLoaded = true;
        this._isDTRProgressBarHidden = false;
        this.GetYearPayrollDropdownListData();
        if (this._dtrListSubscription !== null) this._dtrListSubscription.unsubscribe();
      },
      error => {
        this._isDTRProgressBarHidden = false;
        this._snackBarTemplate.snackBarError(this._snackBar, error.error.Message + " " + error.status);
        if (this._dtrListSubscription !== null) this._dtrListSubscription.unsubscribe();
      }
    );
  }

  ViewDTR() {
    let currentDTR = this._listDTRCollectionView.currentItem;
    const matDialogRef = this._matDialog.open(PortalEmployeeDtrDialogComponent, {
      width: '900px',
      data: {
        objDialogTitle: "DTR Lines",
        objDataDTR: currentDTR,
        objDataEmployeeId: this._portalEmployeeModel.Id,
      },
      disableClose: true
    });

    matDialogRef.afterClosed().subscribe(result => {
      if (result.message == "Yes") {
        this.GetLeaveApplicationListData();
      }
    });
  }

  // =======
  // Payroll 
  // =======
  private _yearPayrollCurrentSubscription: any;
  public _currentYearIdPayroll: number = 0;

  public _yearPayrollListSubscription: any;
  public _yearPayrollListDropdownList: any;

  private async GetYearPayrollDropdownListData() {
    this._yearPayrollCurrentSubscription = await (await this._portalEmployeeService.YearList()).subscribe(
      response => {
        this._yearPayrollListDropdownList = response;
        this._currentYearIdPayroll = response[0].Id;
        this.GetCurrentPayrollYear();
        if (this._yearPayrollCurrentSubscription !== null) this._yearPayrollCurrentSubscription.unsubscribe();
      },
      error => {
        this._snackBarTemplate.snackBarError(this._snackBar, error.error.Message + " " + error.status);
        if (this._yearPayrollCurrentSubscription !== null) this._yearPayrollCurrentSubscription.unsubscribe();
      }
    );
  }

  private async GetCurrentPayrollYear() {
    this._yearPayrollListSubscription = await (await this._portalEmployeeService.CurrentYear()).subscribe(
      (result: any) => {
        this._currentYearIdPayroll = result;
        this.GetPayrollListData();
        if (this._yearPayrollListSubscription !== null) this._yearPayrollListSubscription.unsubscribe();
      },
      error => {
        this._snackBarTemplate.snackBarError(this._snackBar, error.error.Message + " " + error.status);
        if (this._yearPayrollListSubscription !== null) this._yearPayrollListSubscription.unsubscribe();
      }
    );
  }

  public _listPayrollObservableArray: ObservableArray = new ObservableArray();
  public _listPayrollCollectionView: CollectionView = new CollectionView(this._listPayrollObservableArray);
  public _listPayrollPageIndex: number = 15;

  public _isPayrollProgressBarHidden = false;
  public _isPayrollDataLoaded: boolean = false;

  @ViewChild('flexPayroll') flexPayroll: wjcGrid.FlexGrid;

  private _PayrollListSubscription: any;

  private async GetPayrollListData() {

    this._listPayrollObservableArray = new ObservableArray();
    this._listPayrollCollectionView = new CollectionView(this._listPayrollObservableArray);
    this._listPayrollCollectionView.pageSize = 15;
    this._listPayrollCollectionView.trackChanges = true;
    await this._listPayrollCollectionView.refresh();
    await this.flexPayroll.refresh();

    this._isPayrollProgressBarHidden = true;

    this._PayrollListSubscription = await (await this._portalEmployeeService.PayrollList(this._portalEmployeeModel.Id, this._currentYearIdPayroll)).subscribe(
      (response: any) => {
        if (response["length"] > 0) {
          this._listPayrollObservableArray = response;
          this._listPayrollCollectionView = new CollectionView(this._listPayrollObservableArray);
          this._listPayrollCollectionView.pageSize = 15;
          this._listPayrollCollectionView.trackChanges = true;
          this._listPayrollCollectionView.refresh();
          this.flexPayroll.refresh();
        }

        this._isPayrollDataLoaded = true;
        this._isPayrollProgressBarHidden = false;
        if (this._PayrollListSubscription !== null) this._PayrollListSubscription.unsubscribe();
      },
      error => {
        this._isPayrollProgressBarHidden = false;
        this._snackBarTemplate.snackBarError(this._snackBar, error.error.Message + " " + error.status);
        if (this._PayrollListSubscription !== null) this._PayrollListSubscription.unsubscribe();
      }
    );
  }

  ViewPayroll() {
    let currentPayroll = this._listPayrollCollectionView.currentItem;
    const matDialogRef = this._matDialog.open(PortalEmployeePayrollDialogComponent, {
      width: '900px',
      data: {
        objDialogTitle: "Payroll Lines",
        objDataPayroll: currentPayroll,
        objDataEmployeeId: this._portalEmployeeModel.Id,
      },
      disableClose: true
    });

    matDialogRef.afterClosed().subscribe(result => {
      if (result.message == "Yes") {
        this.GetLeaveApplicationListData();
      }
    });
  }

  // ====
  // Loan
  // ====
  private async GetLoanListData() {
    this._listLoanObservableArray = new ObservableArray();
    this._listLoanCollectionView = new CollectionView(this._listLoanObservableArray);
    this._listLoanCollectionView.pageSize = 15;
    this._listLoanCollectionView.trackChanges = true;
    await this._listLoanCollectionView.refresh();
    await this._flexLoan.refresh();

    this.__isProgressBarHidden = true;
    console.log("Loan: ", this._portalEmployeeModel.Id);
    this._loanListSubscription = (await this._portalEmployeeService.LoanList(this._portalEmployeeModel.Id)).subscribe(
      (response: any) => {
        var results = response;
        if (results["length"] > 0) {
          this._listLoanObservableArray = results;
          this._listLoanCollectionView = new CollectionView(this._listLoanObservableArray);
          this._listLoanCollectionView.pageSize = 15;
          this._listLoanCollectionView.trackChanges = true;
          this._listLoanCollectionView.refresh();
          this._flexLoan.refresh();
        }

        this.__isDataLoaded = true;
        this.__isProgressBarHidden = false;

        if (this._loanListSubscription != null) this._loanListSubscription.unsubscribe();
      },
      error => {
        if (error.status == "401") {
          location.reload();
        } else {
          this._snackBarTemplate.snackBarError(this._snackBar, error.error.Message + " " + " Status Code: " + error.status);
          if (this._loanListSubscription != null) this._loanListSubscription.unsubscribe();

        }
      }
    );
  }

  public async ViewLoan() {
    let currentLoan = this._listLoanCollectionView.currentItem;
    const userRegistrationlDialogRef = this._matDialog.open(PortalEmployeeLoanDialogComponent, {
      width: '1200px',
      data: {
        objDialogTitle: 'Loan Detail',
        objLoanId: currentLoan.Id,
      },
      disableClose: true
    });

    userRegistrationlDialogRef.afterClosed().subscribe(result => {
      if (result.event !== "Close") {
        this.GetLoanListData();
      }
    });
  }

  public ChangePassword(): void {
    const userRegistrationlDialogRef = this._matDialog.open(UserChangePasswordDialogComponent, {
      width: '500px',
      data: {
        objDialogTitle: "Change Password",
        objDialogComponent: "Employee Portal",
        objUserId: this._portalEmployeeModel.Id,
      },
      disableClose: true
    });
    userRegistrationlDialogRef.afterClosed();
  }
}
