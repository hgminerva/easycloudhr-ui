import { Component, OnInit, ViewChild } from '@angular/core';
import * as wjcGrid from '@grapecity/wijmo.grid';
import * as wjcCore from '@grapecity/wijmo';
import { CollectionView, ObservableArray } from '@grapecity/wijmo';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackBarTemplate } from '../../shared/snack-bar-template';

import { ShiftCodeListService } from './../shift-code-list.service';
import { DeleteDialogBoxComponent } from '../../shared/delete-dialog-box/delete-dialog-box.component';
import { ShiftCodeDetailComponent } from '../../shift-code-detail/shift-code-detail/shift-code-detail.component';
import { SoftwareSecurityService, UserModule } from '../../software-security/software-security.service';

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
    this._userRightsSubscription = await (await this._softwareSecurityService.PageModuleRights("Shift List")).subscribe(
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
        this.snackBarTemplate.snackBarError(this.snackBar, error.error.Message + " " + error.status);

        if (error.status == "401") {
          this.router.navigate(['/security/login']);
        }
        if (this._userRightsSubscription !== null) this._userRightsSubscription.unsubscribe();
      }
    );

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
    this.listShiftCodeCollectionView.pageSize = this.listPageIndex;
    this.listShiftCodeCollectionView.refresh();
    this.listShiftCodeCollectionView.refresh();
  }

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
        this.snackBarTemplate.snackBarError(this.snackBar, error.error.Message + " " + " Status Code: " + error.status);
        if (this.shiftCodeListSubscription != null) this.shiftCodeListSubscription.unsubscribe();
      }
    );
  }

  gridClick(s, e) {
    if (wjcCore.hasClass(e.target, 'button-edit')) {
      if (this._userRights.CanEdit) {
        this.EditShiftCode();
      }

    }

    if (wjcCore.hasClass(e.target, 'button-delete')) {
      if (this._userRights.CanDelete) {
        this.ComfirmDeleteShiftCode();
      }
    }
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
    const userRegistrationlDialogRef = this._matDialog.open(DeleteDialogBoxComponent, {
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
    const userRegistrationlDialogRef = this._matDialog.open(ShiftCodeDetailComponent, {
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

  async ngOnInit() {
    await this.Get_userRights();
    await this.CreateCboShowNumberOfRows();
  }
}
