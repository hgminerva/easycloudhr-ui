import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackBarTemplate } from '../../shared/snack-bar-template';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import * as wjcGrid from '@grapecity/wijmo.grid';
import { CollectionView, ObservableArray } from '@grapecity/wijmo';

import { PortalEmployeeService } from './../portal-employee.service';
import { PortalEmployeeModel } from './../portal-employee.model';

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
  // OT Application
  public _listOvertimeApplicationLineObservableArray: ObservableArray = new ObservableArray();
  public _listOvertimeApplicationLineCollectionView: CollectionView = new CollectionView(this._listOvertimeApplicationLineObservableArray);
  public _listPageIndex: number = 15;

  public _isOvertimeApplicationLineProgressBarHidden = false;
  public _isOvertimeApplicationLineDataLoaded: boolean = false;

  private _overtimeApplicationLineSubscription: any;

  @ViewChild('flexOvertimeApplicationLine') flexOvertimeApplicationLine: wjcGrid.FlexGrid;

  // Leave Application
  public _listLeaveApplicationLineObservableArray: ObservableArray = new ObservableArray();
  public _listLeaveApplicationLineCollectionView: CollectionView = new CollectionView(this._listLeaveApplicationLineObservableArray);
  public _LeaveApplicationLinePageIndex: number = 15;

  public _isLeaveApplicationLineProgressBarHidden = false;
  public _isLeaveApplicationLineDataLoaded: boolean = false;

  private _leaveApplicationLineSubscription: any;

  @ViewChild('flexLeaveApplicationLine') flexLeaveApplicationLine: wjcGrid.FlexGrid;

  // DTR Line
  public _listDTRLineObservableArray: ObservableArray = new ObservableArray();
  public _listDTRLineCollectionView: CollectionView = new CollectionView(this._listDTRLineObservableArray);
  public _listDTRLinePageIndex: number = 15;

  public _isDTRLineProgressBarHidden = false;
  public _isDTRLineDataLoaded: boolean = false;

  @ViewChild('flexDTRLine') flexDTRLine: wjcGrid.FlexGrid;

  private _dTRLineListSubscription: any;

  // Payroll Line
  public _listPayrollLineObservableArray: ObservableArray = new ObservableArray();
  public _listPayrollLineCollectionView: CollectionView = new CollectionView(this._listPayrollLineObservableArray);
  public _listPayrollLinePageIndex: number = 15;

  public _isPayrollLineProgressBarHidden = false;
  public _isPayrollLineDataLoaded: boolean = false;

  @ViewChild('flexPayrollLine') flexPayrollLine: wjcGrid.FlexGrid;

  private _payrollLineListSubscription: any;

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

        if (this._portalEmployeeModel.Id === null || this._portalEmployeeModel.Id === 0) {
          this._snackBarTemplate.snackBarError(this._snackBar, "Link employee to current user.");
        }

        if (result != null) {
          this._portalEmployeeModel.Id = result["Id"];
          this._portalEmployeeModel.EmployeeCode = result["EmployeeCode"];
          this._portalEmployeeModel.IdNumber = result["IdNumber"];
          this._portalEmployeeModel.BiometricIdNumber = result["BiometricIdNumber"];
          this._portalEmployeeModel.FullName = result["FullName"];
          this._portalEmployeeModel.ContactNumber = result["ContactNumber"];
          this._portalEmployeeModel.ContactMobileNumber = result["ContactMobileNumber"];
          this._portalEmployeeModel.PictureURL = result["PictureURL"];
          this._portalEmployeeModel.PayrollGroup = result["PayrollGroup"];
          this._portalEmployeeModel.Company = result["Company"];
          this._portalEmployeeModel.Branch = result["Branch"];
          this._portalEmployeeModel.Position = result["Position"];
        }

        this._isProgressBarHidden = false;
        this._isDataLoaded = true;
        this._isComponentsShown = true;
        if (this._employeeDetailSubscription !== null) this._employeeDetailSubscription.unsubscribe();
      },
      error => {
        this._snackBarTemplate.snackBarError(this._snackBar, error.error.Message + " " + error.status);
        if (this._employeeDetailSubscription !== null) this._employeeDetailSubscription.unsubscribe();
      }
    );

    await this.GetOvertimeApplicationLineListData();
    await this.GetLeaveApplicationLineListData();
    await this.GetDTRLineListData();
    await this.GetPayrollLineListData();
    await this.GetLoanListData();
  }


  activeTab() { }

  private async GetOvertimeApplicationLineListData() {

    this._listOvertimeApplicationLineObservableArray = new ObservableArray();
    this._listOvertimeApplicationLineCollectionView = new CollectionView(this._listOvertimeApplicationLineObservableArray);
    this._listOvertimeApplicationLineCollectionView.pageSize = 15;
    this._listOvertimeApplicationLineCollectionView.trackChanges = true;
    await this._listOvertimeApplicationLineCollectionView.refresh();
    await this.flexOvertimeApplicationLine.refresh();

    this._isOvertimeApplicationLineProgressBarHidden = true;

    this._overtimeApplicationLineSubscription = await (await this._portalEmployeeService.OvertimeApplicationLineList(this._portalEmployeeModel.Id)).subscribe(
      (response: any) => {
        if (response["length"] > 0) {
          this._listOvertimeApplicationLineObservableArray = response;
          this._listOvertimeApplicationLineCollectionView = new CollectionView(this._listOvertimeApplicationLineObservableArray);
          this._listOvertimeApplicationLineCollectionView.pageSize = 15;
          this._listOvertimeApplicationLineCollectionView.trackChanges = true;
          this._listOvertimeApplicationLineCollectionView.refresh();
          this.flexOvertimeApplicationLine.refresh();
        }

        this._isOvertimeApplicationLineDataLoaded = true;
        this._isOvertimeApplicationLineProgressBarHidden = false;
        if (this._overtimeApplicationLineSubscription !== null) this._overtimeApplicationLineSubscription.unsubscribe();
      },
      error => {
        this._isOvertimeApplicationLineProgressBarHidden = false;
        this._snackBarTemplate.snackBarError(this._snackBar, error.error.Message + " " + error.status);
        if (this._overtimeApplicationLineSubscription !== null) this._overtimeApplicationLineSubscription.unsubscribe();
      }
    );
  }

  private async GetLeaveApplicationLineListData() {

    this._listLeaveApplicationLineObservableArray = new ObservableArray();
    this._listLeaveApplicationLineCollectionView = new CollectionView(this._listLeaveApplicationLineObservableArray);
    this._listLeaveApplicationLineCollectionView.pageSize = 15;
    this._listLeaveApplicationLineCollectionView.trackChanges = true;
    await this._listLeaveApplicationLineCollectionView.refresh();
    await this.flexLeaveApplicationLine.refresh();

    this._isLeaveApplicationLineProgressBarHidden = true;

    this._leaveApplicationLineSubscription = await (await this._portalEmployeeService.LeaveApplicationLineList(this._portalEmployeeModel.Id)).subscribe(
      (response: any) => {
        if (response["length"] > 0) {
          this._listLeaveApplicationLineObservableArray = response;
          this._listLeaveApplicationLineCollectionView = new CollectionView(this._listLeaveApplicationLineObservableArray);
          this._listLeaveApplicationLineCollectionView.pageSize = 15;
          this._listLeaveApplicationLineCollectionView.trackChanges = true;
          this._listLeaveApplicationLineCollectionView.refresh();
          this.flexLeaveApplicationLine.refresh();
        }

        this._isLeaveApplicationLineDataLoaded = true;
        this._isLeaveApplicationLineProgressBarHidden = false;
        if (this._leaveApplicationLineSubscription !== null) this._leaveApplicationLineSubscription.unsubscribe();
      },
      error => {
        this._isLeaveApplicationLineProgressBarHidden = false;
        this._snackBarTemplate.snackBarError(this._snackBar, error.error.Message + " " + error.status);
        if (this._leaveApplicationLineSubscription !== null) this._leaveApplicationLineSubscription.unsubscribe();
      }
    );
  }

  private async GetDTRLineListData() {

    this._listDTRLineObservableArray = new ObservableArray();
    this._listDTRLineCollectionView = new CollectionView(this._listDTRLineObservableArray);
    this._listDTRLineCollectionView.pageSize = 15;
    this._listDTRLineCollectionView.trackChanges = true;
    await this._listDTRLineCollectionView.refresh();
    await this.flexDTRLine.refresh();

    this._isDTRLineProgressBarHidden = true;

    this._dTRLineListSubscription = await (await this._portalEmployeeService.DTRLineList(this._portalEmployeeModel.Id)).subscribe(
      (response: any) => {
        if (response["length"] > 0) {
          this._listDTRLineObservableArray = response;
          this._listDTRLineCollectionView = new CollectionView(this._listDTRLineObservableArray);
          this._listDTRLineCollectionView.pageSize = 15;
          this._listDTRLineCollectionView.trackChanges = true;
          this._listDTRLineCollectionView.refresh();
          this.flexDTRLine.refresh();
        }

        this._isDTRLineDataLoaded = true;
        this._isDTRLineProgressBarHidden = false;
        if (this._dTRLineListSubscription !== null) this._dTRLineListSubscription.unsubscribe();
      },
      error => {
        this._isDTRLineProgressBarHidden = false;
        this._snackBarTemplate.snackBarError(this._snackBar, error.error.Message + " " + error.status);
        if (this._dTRLineListSubscription !== null) this._dTRLineListSubscription.unsubscribe();
      }
    );
  }

  private async GetPayrollLineListData() {

    this._listPayrollLineObservableArray = new ObservableArray();
    this._listPayrollLineCollectionView = new CollectionView(this._listPayrollLineObservableArray);
    this._listPayrollLineCollectionView.pageSize = 15;
    this._listPayrollLineCollectionView.trackChanges = true;
    await this._listPayrollLineCollectionView.refresh();
    await this.flexPayrollLine.refresh();

    this._isPayrollLineProgressBarHidden = true;

    this._payrollLineListSubscription = await (await this._portalEmployeeService.PayrollLineList(this._portalEmployeeModel.Id)).subscribe(
      (response: any) => {
        if (response["length"] > 0) {
          this._listPayrollLineObservableArray = response;
          this._listPayrollLineCollectionView = new CollectionView(this._listPayrollLineObservableArray);
          this._listPayrollLineCollectionView.pageSize = 15;
          this._listPayrollLineCollectionView.trackChanges = true;
          this._listPayrollLineCollectionView.refresh();
          this.flexPayrollLine.refresh();
        }

        this._isPayrollLineDataLoaded = true;
        this._isPayrollLineProgressBarHidden = false;
        if (this._payrollLineListSubscription !== null) this._payrollLineListSubscription.unsubscribe();
      },
      error => {
        this._isPayrollLineProgressBarHidden = false;
        this._snackBarTemplate.snackBarError(this._snackBar, error.error.Message + " " + error.status);
        if (this._payrollLineListSubscription !== null) this._payrollLineListSubscription.unsubscribe();
      }
    );
  }


  // Methods
  private async GetLoanListData() {
    this._listLoanObservableArray = new ObservableArray();
    this._listLoanCollectionView = new CollectionView(this._listLoanObservableArray);
    this._listLoanCollectionView.pageSize = 15;
    this._listLoanCollectionView.trackChanges = true;
    await this._listLoanCollectionView.refresh();
    await this._flexLoan.refresh();

    this.__isProgressBarHidden = true;
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
}
