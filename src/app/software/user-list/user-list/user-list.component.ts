import { Component, OnInit, ViewChild } from '@angular/core';
import * as wjcCore from '@grapecity/wijmo';
import * as wjcGrid from '@grapecity/wijmo.grid';
import { CollectionView, ObservableArray } from '@grapecity/wijmo';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UserRegistrationDialogComponent } from '../user-registration-dialog/user-registration-dialog.component';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackBarTemplate } from '../../shared/snack-bar-template';

import { UserListService } from '../user-list.service';
import { SoftwareSecurityService, UserModule } from '../../software-security/software-security.service';


@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css'],
})
export class UserListComponent implements OnInit {

  constructor(private userListService: UserListService,
    public userRegistrationlDialog: MatDialog,
    private router: Router,
    private snackBar: MatSnackBar,
    private snackBarTemplate: SnackBarTemplate,
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
    this._userRightsSubscription = await (await this._softwareSecurityService.PageModuleRights("User List")).subscribe(
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
          this._softwareSecurityService.logOut();
        }
        if (this._userRightsSubscription !== null) this._userRightsSubscription.unsubscribe();
      }
    );

    await this.getUserListData();
  }

  async ngOnInit() {
    await this.Get_userRights();
    await this.CreateCboShowNumberOfRows();
  }

  public listUserObservableArray: ObservableArray = new ObservableArray();
  public listUserCollectionView: CollectionView = new CollectionView(this.listUserObservableArray);
  public listPageIndex: number = 15;
  @ViewChild('flexUsers') flexUsers: wjcGrid.FlexGrid;
  public isProgressBarHidden = false;
  public isDataLoaded: boolean = false;

  private userListSubscription: any;
  private registerUserSubscription: any;

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
    this.listUserCollectionView.pageSize = this.listPageIndex;
    this.listUserCollectionView.refresh();
    this.listUserCollectionView.refresh();
  }

  private async getUserListData() {
    this.listUserObservableArray = new ObservableArray();
    this.listUserCollectionView = new CollectionView(this.listUserObservableArray);
    this.listUserCollectionView.pageSize = 15;
    this.listUserCollectionView.trackChanges = true;
    await this.listUserCollectionView.refresh();
    await this.flexUsers.refresh();

    this.isProgressBarHidden = true;

    this.userListSubscription = await (await this.userListService.UserList()).subscribe(
      (response: any) => {
        var results = response;
        if (results["length"] > 0) {
          this.listUserObservableArray = results;
          this.listUserCollectionView = new CollectionView(this.listUserObservableArray);
          this.listUserCollectionView.pageSize = 15;
          this.listUserCollectionView.trackChanges = true;
          this.listUserCollectionView.refresh();
          this.flexUsers.refresh();
        }

        this.isDataLoaded = true;
        this.isProgressBarHidden = false;

        if (this.userListSubscription != null) this.userListSubscription.unsubscribe();
      },
      error => {
        this.snackBarTemplate.snackBarError(this.snackBar, error.error.Message + " " + " Status Code: " + error.status);
        if (this.userListSubscription != null) this.userListSubscription.unsubscribe();
      }
    );
  }

  gridClick(s, e) {
    if (wjcCore.hasClass(e.target, 'button-edit')) {
      if (this._userRights.CanEdit) {
        this.EditUser();
      }

    }
  }


  public btnAddUsers(): void {
    const userRegistrationlDialogRef = this.userRegistrationlDialog.open(UserRegistrationDialogComponent, {
      width: '500px',
      data: {
        objDialogTitle: "Add User",
      },
      disableClose: true
    });

    userRegistrationlDialogRef.afterClosed().subscribe(result => {
      if (result.status == 200) {
        this.getUserListData();
      }
    });
  }

  public EditUser() {
    let currentUser = this.listUserCollectionView.currentItem;
    this.router.navigate(['/software/user-detail/' + currentUser.Id]);
  }

  ngOnDestroy() {
    if (this.userListSubscription !== null) this.userListSubscription.unsubscribe();
  }
}
