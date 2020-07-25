import { Component, OnInit, ViewChild } from '@angular/core';
import * as wjcCore from '@grapecity/wijmo';
import * as wjcGrid from '@grapecity/wijmo.grid';
import { EmployeeListService } from '../employee-list.service';
import { CollectionView, ObservableArray } from '@grapecity/wijmo';

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.css']
})
export class EmployeeListComponent implements OnInit {

  constructor(private employeeListService: EmployeeListService) {
  }

  async ngOnInit() {
    await this.getEmployeeData();
  }

  public listEmployeeObservableArray: ObservableArray = new ObservableArray();
  public listEmployeeCollectionView: CollectionView = new CollectionView(this.listEmployeeObservableArray);
  public listActivityPageIndex: number = 15;
  @ViewChild('flexEmployees') flexEmployees: wjcGrid.FlexGrid;
  public isProgressBarHidden = false;
  public isDataLoaded: boolean = false;

  private employeeListSubscription: any;

  private async getEmployeeData() {
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
        console.log(error.status);
      }
    );
  }


  private editEmployee() {

  }

}
