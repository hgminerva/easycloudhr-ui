import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SnackBarTemplate } from 'src/app/software/shared/snack-bar-template';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CollectionView, ObservableArray } from '@grapecity/wijmo';
import * as wjcGrid from '@grapecity/wijmo.grid';

import { SharedService } from './../shared.service'

@Component({
  selector: 'app-employee-list-pick-dialog',
  templateUrl: './employee-list-pick-dialog.component.html',
  styleUrls: ['./employee-list-pick-dialog.component.css']
})
export class EmployeeListPickDialogComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<EmployeeListPickDialogComponent>,
    private _sharedService: SharedService,
    private _snackBar: MatSnackBar,
    private _snackBarTemplate: SnackBarTemplate,
    @Inject(MAT_DIALOG_DATA) public caseData: any
  ) { }

  ngOnInit(): void {
    this.GetEmployeeListData(this.caseData.objPayrollGroup);
    this.CreateCboShowNumberOfRows();
  }

  title = "Employee List";

  public _employeeObservableArray: ObservableArray = new ObservableArray();
  public _listEmployeeCollectionView: CollectionView = new CollectionView(this._employeeObservableArray);
  public _listPageIndex: number = 30;

  @ViewChild('flexEmployee') flexEmployee: wjcGrid.FlexGrid;

  public _isEmployeeProgressBarHidden: boolean = false;

  public _employeeListDropdownSubscription: any;

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
    this._listEmployeeCollectionView.pageSize = this._listPageIndex;
    this._listEmployeeCollectionView.refresh();
    this._listEmployeeCollectionView.refresh();
  }

  private async GetEmployeeListData(payrollGroup: string) {
    this._employeeObservableArray = new ObservableArray();
    this._listEmployeeCollectionView = new CollectionView(this._employeeObservableArray);
    this._listEmployeeCollectionView.pageSize = 10;
    this._listEmployeeCollectionView.trackChanges = true;
    await this._listEmployeeCollectionView.refresh();
    await this.flexEmployee.refresh();

    this._isEmployeeProgressBarHidden = true;

    this._employeeListDropdownSubscription = await (await this._sharedService.EmployeeList(payrollGroup)).subscribe(
      (response: any) => {
        if (response["length"] > 0) {
          this._employeeObservableArray = response;
          this._listEmployeeCollectionView = new CollectionView(this._employeeObservableArray);
          this._listEmployeeCollectionView.pageSize = 10;
          this._listEmployeeCollectionView.trackChanges = true;
          this._listEmployeeCollectionView.refresh();
          this.flexEmployee.refresh();
        }

        this._isEmployeeProgressBarHidden = false;
        if (this._employeeListDropdownSubscription !== null) this._employeeListDropdownSubscription.unsubscribe();
      },
      error => {
        this._isEmployeeProgressBarHidden = false;
        this._snackBarTemplate.snackBarError(this._snackBar, error.error.Message + " " + error.status);
        if (this._employeeListDropdownSubscription !== null) this._employeeListDropdownSubscription.unsubscribe();
      }
    );
  }

  Pick() {
    let objEmployee = this._listEmployeeCollectionView.currentItem;
    this.dialogRef.close({ event: 'Pick', employee: objEmployee });
  }

  public Close(): void {
    this.dialogRef.close({ event: 'Close' });
  }


}
