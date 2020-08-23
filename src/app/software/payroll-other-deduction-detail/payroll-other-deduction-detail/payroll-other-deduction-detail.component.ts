import { Component, OnInit, ViewChild } from '@angular/core';

import * as wjcGrid from '@grapecity/wijmo.grid';
import { CollectionView, ObservableArray } from '@grapecity/wijmo';

import { ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackBarTemplate } from '../../shared/snack-bar-template';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { MatSelectChange } from '@angular/material/select';
import { MatOption } from '@angular/material/core';
import { DatePipe } from '@angular/common';

import { PayrollOtherDeductionModel } from './../payroll-other-deduction.model';
import { PayrollOtherDeductionLineModel } from './../payroll-other-deduction-line.model';
import {PayrollOtherDeductionDetailService} from './../payroll-other-deduction-detail.service'
import { DeleteDialogBoxComponent } from '../../shared/delete-dialog-box/delete-dialog-box.component';

@Component({
  selector: 'app-payroll-other-deduction-detail',
  templateUrl: './payroll-other-deduction-detail.component.html',
  styleUrls: ['./payroll-other-deduction-detail.component.css']
})
export class PayrollOtherDeductionDetailComponent implements OnInit {

  constructor(
    private _payrollOtherDeductionDetailService: PayrollOtherDeductionDetailService,
    private _activatedRoute: ActivatedRoute,
    private _snackBar: MatSnackBar,
    private _snackBarTemplate: SnackBarTemplate,
    public _matDialog: MatDialog,
    private datePipe: DatePipe

  ) { }

  async ngOnInit() {
    // await this.UserListData();
  }

  public _isProgressBarHidden: boolean = false;
  public _isComponentsShown: boolean = true;

  public _btnSaveDisabled: boolean = true;
  public _btnLockisabled: boolean = true;
  public _btnUnlockDisabled: boolean = true;

  public _isDataLoaded: boolean = false;
  public _isLocked: boolean = false;

  public _payrollGroupDropdownSubscription: any;
  public _payrollGroupListDropdown: any = [];

  public _yearDropdownSubscription: any;
  public _yearListDropdown: any = [];

  public _userDropdownSubscription: any;
  public _userListDropdown: any = [];

  public _changePayrollOtherDeductionDetailSubscription: any;
  public _savePayrollOtherDeductionDetailSubscription: any;
  public _lockPayrollOtherDeductionDetailSubscription: any;
  public _unlockPayrollOtherDeductionDetailSubscription: any;

  // public _payrollOtherIncomeModel: PayrollOtherIncomeModel = {
  //   Id: 0,
  //   PINumber: '',
  //   PIDate: new Date(),
  //   PayrollGroup: '',
  //   YearId: 0,
  //   Year: '',
  //   Remarks: '',
  //   PreparedByUserId: 0,
  //   PreparedByUser: '',
  //   CheckedByUserId: 0,
  //   CheckedByUser: '',
  //   ApprovedByUserId: 0,
  //   ApprovedByUser: '',
  //   CreatedByUserId: 0,
  //   CreatedByUser: '',
  //   CreatedDateTime: new Date(),
  //   UpdatedByUserId: 0,
  //   UpdatedByUser: '',
  //   UpdatedDateTime: new Date(),
  //   IsLocked: false
  // };

  // public _payrollOtherIncomeLineModel: PayrollOtherIncomeLineModel = {
  //   Id: 0,
  //   PIId: 0,
  //   EmployeeId: 0,
  //   Employee: '',
  //   OtherIncomeId: 0,
  //   OtherIncome: '',
  //   Amount: '0',
  //   Particulars: ''
  // }

  // // Class properties
  // public _listPayrollOtherIncomeLineObservableArray: ObservableArray = new ObservableArray();
  // public _listPayrollOtherIncomeLineCollectionView: CollectionView = new CollectionView(this._listPayrollOtherIncomeLineObservableArray);
  // public _listPageIndex: number = 15;

  // @ViewChild('flexPayrollOtherIncomeLine') flexPayrollOtherIncomeLine: wjcGrid.FlexGrid;

  // public _isPayrollOtherIncomeLineProgressBarHidden = false;
  // public _isPayrollOtherIncomeLineDataLoaded: boolean = false;

  // private _PayrollOtherIncomeLineListSubscription: any;
  // private _savePayrollOtherIncomeLineSubscription: any;
  // private _updatePayrollOtherIncomeLineSubscription: any;
  // private _deletePayrollOtherIncomeLineSubscription: any;

  // public _btnAddPayrollOtherIncomeLineDisabled: boolean = false;

  // // private async PayrollGroupListData() {
  // //   this._payrollGroupDropdownSubscription = (await this._payrollOtherDeductionDetailService.PayrollGroupList()).subscribe(
  // //     response => {
  // //       this._payrollGroupListDropdown = response;
  // //       this._payrollOtherIncomeLineModel = this._payrollGroupListDropdown[0].Id;
  // //       this.UserListData();
  // //       if (this._payrollGroupDropdownSubscription !== null) this._payrollGroupDropdownSubscription.unsubscribe();
  // //     },
  // //     error => {
  // //       this._snackBarTemplate.snackBarError(this._snackBar, error.error.Message + " " + error.status);
  // //       if (this._payrollGroupDropdownSubscription !== null) this._payrollGroupDropdownSubscription.unsubscribe();
  // //     }
  // //   );
  // // }

  // private async UserListData() {
  //   this._userDropdownSubscription = await (await this._payrollOtherDeductionDetailService.UserList()).subscribe(
  //     response => {
  //       this._userListDropdown = response;
  //       this.GetPayrollOtherIncomeDetail();
  //       if (this._userDropdownSubscription !== null) this._userDropdownSubscription.unsubscribe();
  //     },
  //     error => {
  //       this._snackBarTemplate.snackBarError(this._snackBar, error.error.Message + " " + error.status);
  //       if (this._userDropdownSubscription !== null) this._userDropdownSubscription.unsubscribe();
  //     }
  //   );
  // }

  // private async GetPayrollOtherIncomeDetail() {
  //   let id = 0;
  //   this._activatedRoute.params.subscribe(params => { id = params["id"]; });
  //   this._isComponentsShown = true;
  //   this._isProgressBarHidden = true;

  //   this.DisableButtons();
  //   this._changePayrollOtherDeductionDetailSubscription = await (await this._payrollOtherDeductionDetailService.PayrollOtherIncomeDetail(id)).subscribe(
  //     (response: any) => {
  //       let result = response;
  //       if (result != null) {
  //         this._payrollOtherIncomeModel = result;
  //         this._payrollOtherIncomeModel.PIDate = new Date(result["PIDate"]);
  //         this._payrollOtherIncomeLineModel.PIId = result["Id"];
  //       }
  //       this.loadComponent(result["IsLocked"]);
  //       this.GetPayrollOtherIncomeLineListData();
  //       this._isDataLoaded = true;
  //       this._isProgressBarHidden = false;
  //       this._isComponentsShown = false;
  //       if (this._changePayrollOtherDeductionDetailSubscription !== null) this._changePayrollOtherDeductionDetailSubscription.unsubscribe();
  //     },
  //     error => {
  //       this._snackBarTemplate.snackBarError(this._snackBar, error.error.Message + " " + error.status);
  //       if (this._changePayrollOtherDeductionDetailSubscription !== null) this._changePayrollOtherDeductionDetailSubscription.unsubscribe();
  //     }
  //   );
  // }

  // public DateFormatSelectedDate() {
  //   this._payrollOtherIncomeModel.PIDate = new Date(this.datePipe.transform(this._payrollOtherIncomeModel.PIDate, 'yyyy-MM-dd'));
  // }

  // public async SavePayrollOtherIncomeDetail() {
  //   this.DisableButtons();
  //   if (this._isDataLoaded == true) {
  //     this._isDataLoaded = false;
  //     this.DateFormatSelectedDate();
  //     this._savePayrollOtherDeductionDetailSubscription = (await this._payrollOtherDeductionDetailService.SavePayrollOtherIncome(this._payrollOtherIncomeModel.Id, this._payrollOtherIncomeModel)).subscribe(
  //       response => {
  //         this.loadComponent(this._payrollOtherIncomeModel.IsLocked);
  //         this._isDataLoaded = true;
  //         this._snackBarTemplate.snackBarSuccess(this._snackBar, "Save Successfully.");
  //         if (this._savePayrollOtherDeductionDetailSubscription !== null) this._savePayrollOtherDeductionDetailSubscription.unsubscribe();
  //       },
  //       error => {
  //         this.loadComponent(this._payrollOtherIncomeModel.IsLocked);
  //         this._isDataLoaded = true;
  //         this._snackBarTemplate.snackBarError(this._snackBar, error.error.Message + " " + error.status);
  //         if (this._savePayrollOtherDeductionDetailSubscription !== null) this._savePayrollOtherDeductionDetailSubscription.unsubscribe();
  //       }
  //     );
  //   }
  // }

  // public async LockPayrollOtherIncomeDetail() {
  //   this.DisableButtons();
  //   if (this._isDataLoaded == true) {
  //     this._isDataLoaded = false;
  //     this.DateFormatSelectedDate();
  //     this._lockPayrollOtherDeductionDetailSubscription = await (await this._payrollOtherDeductionDetailService.LockPayrollOtherIncome(this._payrollOtherIncomeModel.Id, this._payrollOtherIncomeModel)).subscribe(
  //       response => {
  //         this.loadComponent(true);
  //         this._isDataLoaded = true;
  //         this._snackBarTemplate.snackBarSuccess(this._snackBar, "Lock Successfully.");
  //         if (this._lockPayrollOtherDeductionDetailSubscription !== null) this._lockPayrollOtherDeductionDetailSubscription.unsubscribe();
  //       },
  //       error => {
  //         this.loadComponent(false);
  //         this._isDataLoaded = true;
  //         this._snackBarTemplate.snackBarError(this._snackBar, error.error.Message + " " + error.status);
  //         if (this._lockPayrollOtherDeductionDetailSubscription !== null) this._lockPayrollOtherDeductionDetailSubscription.unsubscribe();
  //       }
  //     );
  //   }
  // }

  // public async UnlockPayrollOtherIncomeDetail() {
  //   this.DisableButtons();
  //   if (this._isDataLoaded == true) {
  //     this._isDataLoaded = false;
  //     this._unlockPayrollOtherDeductionDetailSubscription = await (await this._payrollOtherDeductionDetailService.UnlockPayrollOtherIncome(this._payrollOtherIncomeModel.Id)).subscribe(
  //       response => {
  //         this.loadComponent(false);
  //         this._isDataLoaded = true;
  //         this._snackBarTemplate.snackBarSuccess(this._snackBar, "Unlock Successfully.");
  //         if (this._unlockPayrollOtherDeductionDetailSubscription !== null) this._unlockPayrollOtherDeductionDetailSubscription.unsubscribe();
  //       },
  //       error => {
  //         this.loadComponent(true);
  //         this._isDataLoaded = true;
  //         this._snackBarTemplate.snackBarError(this._snackBar, error.error.Message + " " + error.status);
  //         if (this._unlockPayrollOtherDeductionDetailSubscription !== null) this._unlockPayrollOtherDeductionDetailSubscription.unsubscribe();
  //       }
  //     );
  //   }
  // }

  // private loadComponent(isDisable) {
  //   if (isDisable == true) {
  //     this._btnAddPayrollOtherIncomeLineDisabled = isDisable;
  //     this._btnSaveDisabled = isDisable;
  //     this._btnLockisabled = isDisable;
  //     this._btnUnlockDisabled = !isDisable;
  //   } else {
  //     this._btnAddPayrollOtherIncomeLineDisabled = isDisable;
  //     this._btnSaveDisabled = isDisable;
  //     this._btnLockisabled = isDisable;
  //     this._btnUnlockDisabled = !isDisable;
  //   }

  //   this._isLocked = isDisable;
  //   this._isProgressBarHidden = false;
  // }

  // private DisableButtons() {
  //   this._btnSaveDisabled = true;
  //   this._btnLockisabled = true;
  //   this._btnUnlockDisabled = true;
  //   this._isProgressBarHidden = true;
  // }

  // activeTab() { }

  // private async GetPayrollOtherIncomeLineListData() {

  //   this._listPayrollOtherIncomeLineObservableArray = new ObservableArray();
  //   this._listPayrollOtherIncomeLineCollectionView = new CollectionView(this._listPayrollOtherIncomeLineObservableArray);
  //   this._listPayrollOtherIncomeLineCollectionView.pageSize = 15;
  //   this._listPayrollOtherIncomeLineCollectionView.trackChanges = true;
  //   await this._listPayrollOtherIncomeLineCollectionView.refresh();
  //   await this.flexPayrollOtherIncomeLine.refresh();

  //   this._isPayrollOtherIncomeLineProgressBarHidden = true;

  //   this._PayrollOtherIncomeLineListSubscription = await (await this._payrollOtherDeductionDetailService.PayrollOtherIncomeLineList(this._payrollOtherIncomeModel.Id)).subscribe(
  //     (response: any) => {
  //       if (response["length"] > 0) {
  //         this._listPayrollOtherIncomeLineObservableArray = response;
  //         this._listPayrollOtherIncomeLineCollectionView = new CollectionView(this._listPayrollOtherIncomeLineObservableArray);
  //         this._listPayrollOtherIncomeLineCollectionView.pageSize = 15;
  //         this._listPayrollOtherIncomeLineCollectionView.trackChanges = true;
  //         this._listPayrollOtherIncomeLineCollectionView.refresh();
  //         this.flexPayrollOtherIncomeLine.refresh();
  //       }

  //       this._isPayrollOtherIncomeLineDataLoaded = true;
  //       this._isPayrollOtherIncomeLineProgressBarHidden = false;
  //       if (this._PayrollOtherIncomeLineListSubscription !== null) this._PayrollOtherIncomeLineListSubscription.unsubscribe();
  //     },
  //     error => {
  //       this._isPayrollOtherIncomeLineProgressBarHidden = false;
  //       this._snackBarTemplate.snackBarError(this._snackBar, error.error.Message + " " + error.status);
  //       if (this._PayrollOtherIncomeLineListSubscription !== null) this._PayrollOtherIncomeLineListSubscription.unsubscribe();
  //     }
  //   );
  // }

  // public AddPayrollOtherIncomeLine() {
  //   this.DetailPayrollOtherIncomeLine(this._payrollOtherIncomeLineModel, "Add Payroll Other Income Line");
  // }

  // public EditPayrollOtherIncomeLine() {
  //   let currentPayrollOtherIncomeLine = this._listPayrollOtherIncomeLineCollectionView.currentItem;
  //   this.DetailPayrollOtherIncomeLine(currentPayrollOtherIncomeLine, "Edit Payroll Other Income Line Detail");
  // }

  // public async DeletePayrollOtherIncomeLine() {
  //   let currentPayrollOtherIncomeLine = this._listPayrollOtherIncomeLineCollectionView.currentItem;
  //   this._isPayrollOtherIncomeLineProgressBarHidden = true;

  //   if (this._isPayrollOtherIncomeLineDataLoaded == true) {
  //     this._isPayrollOtherIncomeLineDataLoaded = false;
  //     this._deletePayrollOtherIncomeLineSubscription = await (await this._payrollOtherDeductionDetailService.DeletePayrollOtherIncomeLine(currentPayrollOtherIncomeLine.Id)).subscribe(
  //       response => {
  //         this._snackBarTemplate.snackBarSuccess(this._snackBar, "Delete Successfully");
  //         this.GetPayrollOtherIncomeLineListData();
  //         this._isPayrollOtherIncomeLineProgressBarHidden = false;
  //         this._isPayrollOtherIncomeLineDataLoaded = true;
  //       },
  //       error => {
  //         this._isPayrollOtherIncomeLineDataLoaded = true;
  //         this._isPayrollOtherIncomeLineProgressBarHidden = false;
  //         this._snackBarTemplate.snackBarError(this._snackBar, error.error + " " + error.status);
  //         if (this._deletePayrollOtherIncomeLineSubscription != null) this._deletePayrollOtherIncomeLineSubscription.unsubscribe();
  //       }
  //     );
  //   }
  // }

  // public ComfirmDeletePayrollOtherIncomeLine(): void {
  //   let currentPayrollOtherIncomeLine = this._listPayrollOtherIncomeLineCollectionView.currentItem;
  //   const matDialogRef = this._matDialog.open(DeleteDialogBoxComponent, {
  //     width: '500px',
  //     data: {
  //       objDialogTitle: "",
  //       objComfirmationMessage: ` Delete ${currentPayrollOtherIncomeLine.Employee}?`,
  //     },
  //     disableClose: true
  //   });

  //   matDialogRef.afterClosed().subscribe(result => {
  //     if (result.message == "Yes") {
  //       this.DeletePayrollOtherIncomeLine();
  //     }
  //   });
  // }


  // public DetailPayrollOtherIncomeLine(objPayrollOtherIncomeLine: PayrollOtherIncomeLineModel, eventTitle: string) {
  //   const matDialogRef = this._matDialog.open(PayrollOtherIncomeLineDialogComponent, {
  //     width: '1300px',
  //     data: {
  //       objDialogTitle: eventTitle,
  //       objPayrollGroup: this._payrollOtherIncomeModel.PayrollGroup,
  //       objPayrollOtherIncomeLine: objPayrollOtherIncomeLine,
  //     },
  //     disableClose: true
  //   });

  //   matDialogRef.afterClosed().subscribe((result: any) => {
  //     if (result.event === "Add Payroll Other Income Line") {

  //       this._isPayrollOtherIncomeLineDataLoaded = true;

  //       this.AddSavePayrollOtherIncomeLine(result.data);
  //     }
  //     if (result.event === "Edit Payroll Other Income Line Detail") {

  //       this._isPayrollOtherIncomeLineDataLoaded = true;

  //       this.UpdatePayrollOtherIncomeLine(result.data.Id, result.data);
  //     }
  //   });
  // }

  // ngOnDestroy() {
  // }

  // public async AddSavePayrollOtherIncomeLine(objPayrollOtherIncomeLine: PayrollOtherIncomeLineModel) {
  //   this._isPayrollOtherIncomeLineProgressBarHidden = true;

  //   if (this._isPayrollOtherIncomeLineDataLoaded == true) {
  //     this._isPayrollOtherIncomeLineDataLoaded = false;
  //     this._savePayrollOtherIncomeLineSubscription = await (await this._payrollOtherDeductionDetailService.AddPayrollOtherIncomeLine(objPayrollOtherIncomeLine)).subscribe(
  //       response => {
  //         this._isPayrollOtherIncomeLineDataLoaded = true;
  //         this._isPayrollOtherIncomeLineProgressBarHidden = false;

  //         this._snackBarTemplate.snackBarSuccess(this._snackBar, "Save Successfully");
  //         this.GetPayrollOtherIncomeLineListData();
  //         if (this._savePayrollOtherIncomeLineSubscription != null) this._savePayrollOtherIncomeLineSubscription.unsubscribe();
  //       },
  //       error => {
  //         this._isPayrollOtherIncomeLineDataLoaded = true;
  //         this._isPayrollOtherIncomeLineProgressBarHidden = false;
  //         this._snackBarTemplate.snackBarError(this._snackBar, error.error + " " + " Status Code: " + error.status);
  //         if (this._savePayrollOtherIncomeLineSubscription != null) this._savePayrollOtherIncomeLineSubscription.unsubscribe();
  //       }
  //     );
  //   }
  // }

  // public async UpdatePayrollOtherIncomeLine(id: number, objPayrollOtherIncomeLine: PayrollOtherIncomeLineModel) {
  //   this._isPayrollOtherIncomeLineProgressBarHidden = true;

  //   if (this._isPayrollOtherIncomeLineDataLoaded == true) {
  //     this._isPayrollOtherIncomeLineDataLoaded = false;
  //     this._updatePayrollOtherIncomeLineSubscription = await (await this._payrollOtherDeductionDetailService.UpdatePayrollOtherIncomeLine(id, objPayrollOtherIncomeLine)).subscribe(
  //       response => {
  //         this._isPayrollOtherIncomeLineDataLoaded = true;
  //         this._isPayrollOtherIncomeLineProgressBarHidden = false;

  //         this._snackBarTemplate.snackBarSuccess(this._snackBar, "Update Successfully");
  //         this.GetPayrollOtherIncomeLineListData();
  //         if (this._updatePayrollOtherIncomeLineSubscription != null) this._updatePayrollOtherIncomeLineSubscription.unsubscribe();
  //       },
  //       error => {
  //         this._isPayrollOtherIncomeLineDataLoaded = true;
  //         this._isPayrollOtherIncomeLineProgressBarHidden = false;
  //         this._snackBarTemplate.snackBarError(this._snackBar, error.error + " " + " Status Code: " + error.status);
  //         if (this._updatePayrollOtherIncomeLineSubscription != null) this._updatePayrollOtherIncomeLineSubscription.unsubscribe();
  //       }
  //     );
  //   }
  // }

  // selectedPreparedByUser(event: MatSelectChange) {
  //   const selectedData = {
  //     text: (event.source.selected as MatOption).viewValue,
  //     value: event.source.value
  //   };

  //   this._payrollOtherIncomeModel.PreparedByUserId = event.source.value;
  //   this._payrollOtherIncomeModel.PreparedByUser = (event.source.selected as MatOption).viewValue;
  // }

  // selectedCheckedByUser(event: MatSelectChange) {
  //   const selectedData = {
  //     text: (event.source.selected as MatOption).viewValue,
  //     value: event.source.value
  //   };

  //   this._payrollOtherIncomeModel.CheckedByUserId = event.source.value;
  //   this._payrollOtherIncomeModel.CheckedByUser = (event.source.selected as MatOption).viewValue;
  // }

  // selectedApprovedByUser(event: MatSelectChange) {
  //   const selectedData = {
  //     text: (event.source.selected as MatOption).viewValue,
  //     value: event.source.value
  //   };

  //   this._payrollOtherIncomeModel.ApprovedByUserId = event.source.value;
  //   this._payrollOtherIncomeModel.ApprovedByUser = (event.source.selected as MatOption).viewValue;
  // }

  // public btnCSVClick(): void {
  //   var fileName = "";

  //   fileName = "payroll-other-income.csv";

  //   var csvData = this.generateCSV();
  //   var csvURL = window.URL.createObjectURL(csvData);
  //   var tempLink = document.createElement('a');

  //   tempLink.href = csvURL;
  //   tempLink.setAttribute('download', fileName);
  //   tempLink.click();
  // }

  // public generateCSV(): Blob {
  //   var data = "";
  //   var collection;
  //   var fileName = "";

  //   data = 'Change Payroll Other Income' + '\r\n\n';
  //   collection = this._listPayrollOtherIncomeLineCollectionView;
  //   fileName = "payroll-other-income.csv";

  //   if (data != "") {
  //     var label = '"' + 'ID' + '",'
  //       + '"' + 'PINumber' + '",'
  //       + '"' + 'PIDate' + '",'
  //       + '"' + 'PayrollGroup' + '",'
  //       + '"' + 'Year' + '",'
  //       + '"' + 'Remarks' + '",'
  //       + '"' + 'PreparedByUser' + '",'
  //       + '"' + 'CheckedByUser' + '",'
  //       + '"' + 'ApprovedByUser' + '",';
  //     for (var s in collection.items[0]) {
  //       label += s + ',';
  //     }
  //     label = label.slice(0, -1);

  //     data += label + '\r\n';

  //     collection.moveToFirstPage();
  //     for (var p = 0; p < collection.pageCount; p++) {
  //       for (var i = 0; i < collection.items.length; i++) {
  //         var row = '"' + this._payrollOtherIncomeModel.Id + '",'
  //           + '"' + this._payrollOtherIncomeModel.PINumber + '",'
  //           + '"' + this._payrollOtherIncomeModel.PIDate + '",'
  //           + '"' + this._payrollOtherIncomeModel.PayrollGroup + '",'
  //           + '"' + this._payrollOtherIncomeModel.Year + '",'
  //           + '"' + this._payrollOtherIncomeModel.Remarks + '",'
  //           + '"' + this._payrollOtherIncomeModel.PreparedByUser + '",'
  //           + '"' + this._payrollOtherIncomeModel.CheckedByUser + '",'
  //           + '"' + this._payrollOtherIncomeModel.ApprovedByUser + '",';

  //         for (var s in collection.items[i]) {
  //           row += '"' + collection.items[i][s] + '",';
  //         }
  //         row.slice(0, row.length - 1);
  //         data += row + '\r\n';
  //       }
  //       collection.moveToNextPage();
  //     }
  //   }
  //   return new Blob([data], { type: 'text/csv;charset=utf-8;' });
  // }


}
