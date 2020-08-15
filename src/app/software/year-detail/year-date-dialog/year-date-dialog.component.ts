import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackBarTemplate } from '../../shared/snack-bar-template';
import { YearDetialService } from '../year-detial.service';
import { YearDateModel } from '../year-date.model';

@Component({
  selector: 'app-year-date-dialog',
  templateUrl: './year-date-dialog.component.html',
  styleUrls: ['./year-date-dialog.component.css']
})
export class YearDateDialogComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<YearDateDialogComponent>,
    private _yearDetialService: YearDetialService,
    @Inject(MAT_DIALOG_DATA) public caseData: any,
    private _snackBar: MatSnackBar,
    private _snackBarTemplate: SnackBarTemplate,
    public _matDialog: MatDialog,
  ) { }


  ngOnInit(): void {
    this.title = this.caseData.objDialogTitle;
    this.DateTypeListData();
  }

  public _yearDateModel: YearDateModel = {
    Id: 0,
    YearId: 0,
    YearDate: new Date(),
    Branch: '',
    DateType: '',
    Remarks: ''
  }

  public title = '';

  public isComponentHidden: boolean = true;

  public _branchListDropdownSubscription: any;
  public _branchListDropdown: any = [];

  public _dateTypeListDropdownSubscription: any;
  public _dateTypeListDropdown: any = [];

  private async DateTypeListData() {
    this._dateTypeListDropdownSubscription = (await this._yearDetialService.DayTypeDropdown()).subscribe(
      response => {
        this._dateTypeListDropdown = response;
        this._yearDateModel.DateType = this._dateTypeListDropdown[0].Value;
        this.BranchListData();
        if (this._dateTypeListDropdownSubscription !== null) this._dateTypeListDropdownSubscription.unsubscribe();
      },
      error => {
        this._snackBarTemplate.snackBarError(this._snackBar, error.error.Message + " " + error.status);
        if (this._dateTypeListDropdownSubscription !== null) this._dateTypeListDropdownSubscription.unsubscribe();
      }
    );
  }


  private async BranchListData() {
    this._branchListDropdownSubscription = (await this._yearDetialService.BranchDropdown()).subscribe(
      response => {
        this._branchListDropdown = response;
        this._yearDateModel.Branch = this._branchListDropdown[0].Value;
        this.loadShiftLineDetail();
        if (this._branchListDropdownSubscription !== null) this._branchListDropdownSubscription.unsubscribe();
      },
      error => {
        this._snackBarTemplate.snackBarError(this._snackBar, error.error.Message + " " + error.status);
        if (this._branchListDropdownSubscription !== null) this._branchListDropdownSubscription.unsubscribe();
      }
    );
  }


  private loadShiftLineDetail() {
    this._yearDateModel.Id = this.caseData.objYearDate.Id;
    this._yearDateModel.YearId = this.caseData.objYearDate.YearId;
    this._yearDateModel.YearDate = new Date(this.caseData.objYearDate.YearDate);
    this._yearDateModel.Remarks = this.caseData.objYearDate.Remarks;

    if (this._yearDateModel.Id != 0) {
      this._yearDateModel.Branch = this.caseData.objYearDate.Branch;
      this._yearDateModel.DateType = this.caseData.objYearDate.DateType;
    }

    setTimeout(() => {
      this.isComponentHidden = false;
    }, 100);
  }

  public Close(): void {
    this.dialogRef.close({ event: 'Close' });
  }

  public async Save() {
    if (this._yearDateModel.Id == 0) {
      await this.dialogRef.close({ event: 'Add', data: this._yearDateModel });
    } else {
      await this.dialogRef.close({ event: 'Update', data: this._yearDateModel });
    }
  }
}

