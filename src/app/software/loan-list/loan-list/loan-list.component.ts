import { Component, OnInit, ViewChild } from '@angular/core';

import * as wjcGrid from '@grapecity/wijmo.grid';
import { CollectionView, ObservableArray } from '@grapecity/wijmo';

import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackBarTemplate } from '../../shared/snack-bar-template';

import { DeleteDialogBoxComponent } from '../../shared/delete-dialog-box/delete-dialog-box.component';
import {LoanListService} from './../loan-list.service';
import { LoanDetailDialogComponent } from '../loan-detail-dialog/loan-detail-dialog.component';

@Component({
  selector: 'app-loan-list',
  templateUrl: './loan-list.component.html',
  styleUrls: ['./loan-list.component.css']
})
export class LoanListComponent implements OnInit {

   // Class properties
   public _listLoanObservableArray: ObservableArray = new ObservableArray();
   public _listLoanCollectionView: CollectionView = new CollectionView(this._listLoanObservableArray);
   public _listPageIndex: number = 15;
 
   public _isProgressBarHidden = false;
   public _isDataLoaded: boolean = false;
 
   private _loanListSubscription: any;
   private _addLoanSubscription: any;
   private _deleteLoanSubscription: any;
 
   public _btnAddDisabled: boolean = false;
 
   // DOM declaration
   @ViewChild('flexLoan') _flexLoan: wjcGrid.FlexGrid;
 
   // Constructor and overrides
   constructor(private _LoanListService: LoanListService,
     private _snackBar: MatSnackBar,
     private _snackBarTemplate: SnackBarTemplate,
     public _matDialogRef: MatDialog) {
   }
   async ngOnInit() {
     await this.GetLoanListData();
     await this.createCboShowNumberOfRows();
   }
 
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
     this._listLoanCollectionView.pageSize = this.listPageIndex;
     this._listLoanCollectionView.refresh();
     this._listLoanCollectionView.refresh();
   }
 
   // Methods
   private async GetLoanListData() {
     this._listLoanObservableArray = new ObservableArray();
     this._listLoanCollectionView = new CollectionView(this._listLoanObservableArray);
     this._listLoanCollectionView.pageSize = 15;
     this._listLoanCollectionView.trackChanges = true;
     await this._listLoanCollectionView.refresh();
     await this._flexLoan.refresh();
 
     this._isProgressBarHidden = true;
     this._loanListSubscription = (await this._LoanListService.LoanList()).subscribe(
       (response: any) => {
         var results = response;
         console.log("Response:", results);
 
         if (results["length"] > 0) {
           this._listLoanObservableArray = results;
           this._listLoanCollectionView = new CollectionView(this._listLoanObservableArray);
           this._listLoanCollectionView.pageSize = 15;
           this._listLoanCollectionView.trackChanges = true;
           this._listLoanCollectionView.refresh();
           this._flexLoan.refresh();
         }
 
         this._isDataLoaded = true;
         this._isProgressBarHidden = false;
 
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
 
   public async AddLoan() {
     this._btnAddDisabled = true;
     if (this._isDataLoaded == true) {
       this._isDataLoaded = false;
       this._addLoanSubscription = (await this._LoanListService.AddLoan()).subscribe(
         (response: any) => {
           this._btnAddDisabled = false;
           this._isDataLoaded = true;
           this.GetLoanListData();
           this.DetailLoan(response, "Loan Detail")
           this._snackBarTemplate.snackBarSuccess(this._snackBar, "Added Successfully");
         },
         error => {
           this._btnAddDisabled = false;
           this._isDataLoaded = true;
           this._snackBarTemplate.snackBarError(this._snackBar, error.error + " " + " Status Code: " + error.status);
           if (this._addLoanSubscription != null) this._addLoanSubscription.unsubscribe();
         }
       );
     }
   }
 
   public EditLoan() {
     let currentLoan = this._listLoanCollectionView.currentItem;
     this.DetailLoan(currentLoan.Id, "Edit Loan Detail");
   }
 
   public async DeleteLoan() {
     let currentLoan = this._listLoanCollectionView.currentItem;
     this._isProgressBarHidden = true;
 
     if (this._isDataLoaded == true) {
       this._isDataLoaded = false;
       this._deleteLoanSubscription = (await this._LoanListService.DeleteLoan(currentLoan.Id)).subscribe(
         response => {
           this._snackBarTemplate.snackBarSuccess(this._snackBar, "Delete Successfully");
           this.GetLoanListData();
           this._isProgressBarHidden = false;
           this._isDataLoaded = true;
         },
         error => {
           this._isDataLoaded = true;
           this._isProgressBarHidden = false;
           this._snackBarTemplate.snackBarError(this._snackBar, error.error.Message + " " + error.status);
           if (this._deleteLoanSubscription != null) this._deleteLoanSubscription.unsubscribe();
         }
       );
     }
   }
 
   public ComfirmDeleteLoan(): void {
     let currentLoan = this._listLoanCollectionView.currentItem;
     const userRegistrationlDialogRef = this._matDialogRef.open(DeleteDialogBoxComponent, {
       width: '500px',
       data: {
         objDialogTitle: "Delete Loan",
         objComfirmationMessage: ` Delete this ${currentLoan.Loan}?`,
       },
       disableClose: true
     });
 
     userRegistrationlDialogRef.afterClosed().subscribe(result => {
       if (result.message == "Yes") {
         this.DeleteLoan();
       }
     });
   }
 
   public DetailLoan(LoanId: string, eventTitle: string): void {
     const userRegistrationlDialogRef = this._matDialogRef.open(LoanDetailDialogComponent, {
       width: '1200px',
       data: {
         objDialogTitle: eventTitle,
         objLoanId: LoanId,
       },
       disableClose: true
     });
 
     userRegistrationlDialogRef.afterClosed().subscribe(result => {
       if (result.event !== "Close") {
         this.GetLoanListData();
       }
     });
   }
 
   ngOnDestroy() {
     if (this._loanListSubscription !== null) this._loanListSubscription.unsubscribe();
   }

}
