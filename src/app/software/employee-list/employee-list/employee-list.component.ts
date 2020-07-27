import { Component, OnInit, ViewChild } from '@angular/core';
import * as wjcCore from '@grapecity/wijmo';
import * as wjcGrid from '@grapecity/wijmo.grid';
import { EmployeeListService } from '../employee-list.service';
import { CollectionView, ObservableArray } from '@grapecity/wijmo';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackBarTemplate } from '../../shared/snack-bar-template';
import { Router } from '@angular/router';

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

  public buttonDisable: boolean = false;

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
    this.buttonDisable = true;

    this.AddEmployeeSubscription = await (await this.employeeListService.AddEmployee()).subscribe(
      response => {
        this.buttonDisable = false;
        console.log(response);
        this.GetEmployeeData();
        this.snackBarTemplate.snackBarSuccess(this.snackBar, "Added Successfully");
        this.router.navigate(['/software/employee-detail/' + response]);
      },
      error => {
        this.buttonDisable = false;
        console.log(error);

        this.snackBarTemplate.snackBarError(this.snackBar, error.error + " " + error.status);
        if (this.AddEmployeeSubscription != null) this.AddEmployeeSubscription.unsubscribe();
      }
    );
  }

  public async EditEmployeeDetail() {
    let currentEmployee = this.listEmployeeCollectionView.currentItem;
    this.router.navigate(['/software/employee-detail/' + currentEmployee.Id]);
  }

  public async DeleteEmployeeDetail() {
    this.DeletemployeeListSubscription = await (await this.employeeListService.AddEmployee()).subscribe(
      response => { },
      error => {
        this.snackBarTemplate.snackBarError(this.snackBar, error.error.Message + " " + error.status);
        if (this.DeletemployeeListSubscription != null) this.DeletemployeeListSubscription.unsubscribe();
      }
    );
  }

}
