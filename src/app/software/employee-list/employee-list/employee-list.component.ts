import { Component, OnInit, ViewChild } from '@angular/core';
import * as wjcCore from '@grapecity/wijmo';
import * as wjcGrid from '@grapecity/wijmo.grid';
import { EmployeeListService } from '../employee-list.service';
import { CollectionView, ObservableArray } from '@grapecity/wijmo';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackBarTemplate } from '../../shared/snack-bar-template';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { DeleteDialogBoxComponent } from '../../shared/delete-dialog-box/delete-dialog-box.component';

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

  ) {
  }

  async ngOnInit() {
    await this.GetPayrollGroupDropdownListData();
    await this.createCboShowNumberOfRows();
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
        this.snackBarTemplate.snackBarError(this.snackBar, error.error.Message + " " + error.status);
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
      },
      error => {
        this.snackBarTemplate.snackBarError(this.snackBar, error.error + " " + " Status Code: " + error.status);
        if (this.DeletemployeeListSubscription != null) this.DeletemployeeListSubscription.unsubscribe();
      }
    );
  }

  public ComfirmDeleteEmployee(): void {
    let currentEmployee = this.listEmployeeCollectionView.currentItem;

    const userRegistrationlDialogRef = this.DeleteConfirmDialog.open(DeleteDialogBoxComponent, {
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
    var fileName = "";

    fileName = "employees-list.csv";

    var csvData = this.generateCSV();
    var csvURL = window.URL.createObjectURL(csvData);
    var tempLink = document.createElement('a');

    tempLink.href = csvURL;
    tempLink.setAttribute('download', fileName);
    tempLink.click();
  }

  public generateCSV(): Blob {
    var data = "";
    var collection;
    var fileName = "";

    data = 'Employees List' + '\r\n\n';
    collection = this.listEmployeeCollectionView;
    fileName = "employees-list.csv";

    if (data != "") {
      var label = '';
      for (var s in collection.items[0]) {
        label += s + ',';
      }
      label = label.slice(0, -1);

      data += label + '\r\n';

      collection.moveToFirstPage();
      for (var p = 0; p < collection.pageCount; p++) {
        for (var i = 0; i < collection.items.length; i++) {
          var row = '';
          for (var s in collection.items[i]) {
            row += '"' + collection.items[i][s] + '",';
          }
          row.slice(0, row.length - 1);
          data += row + '\r\n';
        }
        collection.moveToNextPage();
      }
    }
    return new Blob([data], { type: 'text/csv;charset=utf-8;' });
  }

}
