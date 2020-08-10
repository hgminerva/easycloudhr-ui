import { Component, OnInit, ViewChild } from '@angular/core';
import { ChangeShiftCodeDetailService } from '../../change-shift-code-detail.service';
import { MatDialogRef } from '@angular/material/dialog';
import { SnackBarTemplate } from 'src/app/software/shared/snack-bar-template';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CollectionView, ObservableArray } from '@grapecity/wijmo';
import * as wjcGrid from '@grapecity/wijmo.grid';

@Component({
  selector: 'app-empoloyee-list-dialog',
  templateUrl: './empoloyee-list-dialog.component.html',
  styleUrls: ['./empoloyee-list-dialog.component.css']
})
export class EmpoloyeeListDialogComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<EmpoloyeeListDialogComponent>,
    private _changeShiftCodeDetailService: ChangeShiftCodeDetailService,
    private _snackBar: MatSnackBar,
    private _snackBarTemplate: SnackBarTemplate,
  ) { }

  ngOnInit(): void {
    this.GetEmployeeListData();
  }

  title = "Employee List";

  public _employeeObservableArray: ObservableArray = new ObservableArray();
  public _listEmployeeCollectionView: CollectionView = new CollectionView(this._employeeObservableArray);
  public _listPageIndex: number = 30;

  @ViewChild('flexEmployee') flexEmployee: wjcGrid.FlexGrid;

  public _isEmployeeProgressBarHidden: boolean = false;

  public _employeeListDropdownSubscription: any;

  private async GetEmployeeListData() {

    this._employeeObservableArray = new ObservableArray();
    this._listEmployeeCollectionView = new CollectionView(this._employeeObservableArray);
    this._listEmployeeCollectionView.pageSize = 15;
    this._listEmployeeCollectionView.trackChanges = true;
    await this._listEmployeeCollectionView.refresh();
    await this.flexEmployee.refresh();

    this._isEmployeeProgressBarHidden = true;

    this._employeeListDropdownSubscription = await (await this._changeShiftCodeDetailService.EmployeeList()).subscribe(
      (response: any) => {
        if (response["length"] > 0) {
          this._employeeObservableArray = response;
          this._listEmployeeCollectionView = new CollectionView(this._employeeObservableArray);
          this._listEmployeeCollectionView.pageSize = 15;
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
