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
    await this.GetEmployeeData();
  }

  public listEmployeeObservableArray: ObservableArray = new ObservableArray();
  public listEmployeeCollectionView: CollectionView = new CollectionView(this.listEmployeeObservableArray);
  public listPageIndex: number = 15;
  @ViewChild('flexEmployees') flexEmployees: wjcGrid.FlexGrid;
  public isProgressBarHidden = false;
  public isDataLoaded: boolean = false;

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

    this.employeeListSubscription = await (await this.employeeListService.EmployeeList()).subscribe(
      (response: any) => {
        var results = response;
        console.log("Response:", results);

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
        objComfirmationMessage: `Delete this ${currentEmployee.FullName}?`,
      },
      disableClose: true
    });

    userRegistrationlDialogRef.afterClosed().subscribe(result => {
      if (result.message == "Yes") {
        this.DeleteEmployeeDetail();
      }
    });
  }
}
