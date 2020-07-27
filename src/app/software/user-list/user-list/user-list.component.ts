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


@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {

  constructor(private userListService: UserListService,
    public userRegistrationlDialog: MatDialog,
    private router: Router,
    private snackBar: MatSnackBar,
    private snackBarTemplate: SnackBarTemplate,
  ) {
  }

  async ngOnInit() {
    await this.getUserListData();
  }

  public listUserObservableArray: ObservableArray = new ObservableArray();
  public listUserCollectionView: CollectionView = new CollectionView(this.listUserObservableArray);
  public listPageIndex: number = 15;
  @ViewChild('flexUsers') flexUsers: wjcGrid.FlexGrid;
  public isProgressBarHidden = false;
  public isDataLoaded: boolean = false;

  private userListSubscription: any;
  private registerUserSubscription: any;

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
        console.log("Response:", results);

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
        this.snackBarTemplate.snackBarError(this.snackBar, error.error.Message + " " + error.status);
        if (this.userListSubscription !== null) this.userListSubscription.unsubscribe();
      }
    );
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
}
