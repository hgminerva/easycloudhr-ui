import { Component, OnInit, ViewChild } from '@angular/core';
import * as wjcGrid from '@grapecity/wijmo.grid';
import { CollectionView, ObservableArray } from '@grapecity/wijmo';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackBarTemplate } from '../../shared/snack-bar-template';
import { ShiftCodeListService } from './../shift-code-list.service';
import { DeleteDialogBoxComponent } from '../../shared/delete-dialog-box/delete-dialog-box.component';
import { ShiftCodeDetailComponent } from '../../shift-code-detail/shift-code-detail/shift-code-detail.component';

@Component({
  selector: 'app-shift-code-list',
  templateUrl: './shift-code-list.component.html',
  styleUrls: ['./shift-code-list.component.css']
})
export class ShiftCodeListComponent implements OnInit {

  constructor(
    private shiftCodeListService: ShiftCodeListService,
    private router: Router,
    private snackBar: MatSnackBar,
    private snackBarTemplate: SnackBarTemplate,
    public DeleteConfirmDialog: MatDialog,
    public _shiftCodeDetailMatDialogRef: MatDialog
  ) {
  }

  async ngOnInit() {
    await this.GetShiftCodeListData();
  }

  public listShiftCodeObservableArray: ObservableArray = new ObservableArray();
  public listShiftCodeCollectionView: CollectionView = new CollectionView(this.listShiftCodeObservableArray);
  public listPageIndex: number = 15;
  @ViewChild('flexShiftCode') flexShiftCode: wjcGrid.FlexGrid;
  public isProgressBarHidden = false;
  public isDataLoaded: boolean = false;

  private shiftCodeListSubscription: any;
  private AddShiftCodeSubscription: any;
  private DeleteShiftCodeSubscription: any;

  public buttonDisabled: boolean = false;

  private async GetShiftCodeListData() {
    this.listShiftCodeObservableArray = new ObservableArray();
    this.listShiftCodeCollectionView = new CollectionView(this.listShiftCodeObservableArray);
    this.listShiftCodeCollectionView.pageSize = 15;
    this.listShiftCodeCollectionView.trackChanges = true;
    await this.listShiftCodeCollectionView.refresh();
    await this.flexShiftCode.refresh();

    this.isProgressBarHidden = true;

    this.shiftCodeListSubscription = await (await this.shiftCodeListService.ShiftCodeList()).subscribe(
      (response: any) => {
        var results = response;
        console.log("Response:", results);

        if (results["length"] > 0) {
          this.listShiftCodeCollectionView = results;
          this.listShiftCodeCollectionView = new CollectionView(this.listShiftCodeCollectionView);
          this.listShiftCodeCollectionView.pageSize = 15;
          this.listShiftCodeCollectionView.trackChanges = true;
          this.listShiftCodeCollectionView.refresh();
          this.flexShiftCode.refresh();
        }

        this.isDataLoaded = true;
        this.isProgressBarHidden = false;

        if (this.shiftCodeListSubscription != null) this.shiftCodeListSubscription.unsubscribe();
      },
      error => {
        this.snackBarTemplate.snackBarError(this.snackBar, error.error.Message + " " + error.status);
        if (this.shiftCodeListSubscription !== null) this.shiftCodeListSubscription.unsubscribe();
      }
    );
  }

  public async AddShiftCode() {
    this.buttonDisabled = true;
    if (this.isDataLoaded == true) {
      this.isDataLoaded = false;
      this.AddShiftCodeSubscription = await (await this.shiftCodeListService.AddShiftCode()).subscribe(
        (response: any) => {
          this.buttonDisabled = false;
          this.isDataLoaded = true;
          this.GetShiftCodeListData();
          this.snackBarTemplate.snackBarSuccess(this.snackBar, "Added Successfully");
          this.router.navigate(['/software/shift-code-detail/' + response]);
          // this.DetailShiftCode(response, "Shift Code Detail")
        },
        error => {
          this.buttonDisabled = false;
          this.isDataLoaded = true;
          this.snackBarTemplate.snackBarError(this.snackBar, error.error + " " + " Status Code: " + error.status);
          if (this.AddShiftCodeSubscription != null) this.AddShiftCodeSubscription.unsubscribe();
        }
      );
    }
  }

  public EditShiftCode() {
    let currentShiftCode = this.listShiftCodeCollectionView.currentItem;
    this.router.navigate(['/software/shift-code-detail/' + currentShiftCode.Id]);

    // this.DetailShiftCode(currentShiftCode.Id, "Edit Shift Code Detail")
  }

  public async DeleteShiftCode() {
    if (this.isDataLoaded == true) {
      this.isDataLoaded = false;
      let currentShiftCode = this.listShiftCodeCollectionView.currentItem;
      this.isProgressBarHidden = true;

      this.DeleteShiftCodeSubscription = await (await this.shiftCodeListService.DeleteShiftCode(currentShiftCode.Id)).subscribe(
        response => {
          this.snackBarTemplate.snackBarSuccess(this.snackBar, "Delete Successfully");
          this.GetShiftCodeListData();
          this.isProgressBarHidden = false;
          this.isDataLoaded = true;
        },
        error => {
          this.isDataLoaded = true;
          this.snackBarTemplate.snackBarError(this.snackBar, error.error + " " + error.status);
          if (this.DeleteShiftCodeSubscription != null) this.DeleteShiftCodeSubscription.unsubscribe();
        }
      );
    }
  }

  public ComfirmDeleteShiftCode(): void {
    let currentShiftCode = this.listShiftCodeCollectionView.currentItem;
    const userRegistrationlDialogRef = this.DeleteConfirmDialog.open(DeleteDialogBoxComponent, {
      width: '500px',
      data: {
        objDialogTitle: "Delete Shift",
        objComfirmationMessage: `Delete this ${currentShiftCode.Shift}?`,
      },
      disableClose: true
    });

    userRegistrationlDialogRef.afterClosed().subscribe(result => {
      if (result.message == "Yes") {
        this.DeleteShiftCode();
      }
    });
  }

  public DetailShiftCode(shiftCodeId: string, eventTitle: string): void {
    const userRegistrationlDialogRef = this._shiftCodeDetailMatDialogRef.open(ShiftCodeDetailComponent, {
      width: '1200px',
      data: {
        objDialogTitle: eventTitle,
        objShiftCodeId: shiftCodeId,
      },
      disableClose: true
    });

    userRegistrationlDialogRef.afterClosed().subscribe(result => {
      if (result.event !== "Close") {
        this.GetShiftCodeListData();
      }
    });
  }
}
