import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackBarTemplate } from '../../shared/snack-bar-template';
import { ChangeShiftCodeDetailService } from '../change-shift-code-detail.service';
import { ChangeShiftLineModel } from '../change-shift-code-line.model';

@Component({
  selector: 'app-change-shift-code-line-detail',
  templateUrl: './change-shift-code-line-detail.component.html',
  styleUrls: ['./change-shift-code-line-detail.component.css']
})
export class ChangeShiftCodeLineDetailComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<ChangeShiftCodeLineDetailComponent>,
    private _changeShiftCodeDetailService: ChangeShiftCodeDetailService,
    @Inject(MAT_DIALOG_DATA) public caseData: any,
    private _snackBar: MatSnackBar,
    private _snackBarTemplate: SnackBarTemplate
  ) { }


  ngOnInit(): void {
    this.title = this.caseData.objDialogTitle;
    this.EmployeeListData();
  }

  public _changeShiftLine: ChangeShiftLineModel = {
    Id: 0,
    CSId: 0,
    EmployeeId: 0,
    ShiftDate: new Date(),
    ShiftId: 0,
    Branch: '',
    Remarks: ''
  }

  public title = '';

  public isComponentHidden: boolean = true;

  public _employeeListDropdownSubscription: any;
  public _employeeListDropdown: any = [];

  public _branchListDropdownSubscription: any;
  public _branchListDropdown: any = [];

  public _shiftListDropdownSubscription: any;
  public _shiftListDropdown: any = [];

  private async EmployeeListData() {
    this._employeeListDropdownSubscription = (await this._changeShiftCodeDetailService.EmployeeList()).subscribe(
      response => {
        this._employeeListDropdown = response;
        this.BranchListData();
        if (this._employeeListDropdownSubscription !== null) this._employeeListDropdownSubscription.unsubscribe();
      },
      error => {
        this._snackBarTemplate.snackBarError(this._snackBar, error.error.Message + " " + error.status);
        if (this._employeeListDropdownSubscription !== null) this._employeeListDropdownSubscription.unsubscribe();
      }
    );
  }

  private async BranchListData() {
    this._branchListDropdownSubscription = (await this._changeShiftCodeDetailService.BranchList()).subscribe(
      response => {
        this._branchListDropdown = response;
        this.ShiftsListData();
        if (this._branchListDropdownSubscription !== null) this._branchListDropdownSubscription.unsubscribe();
      },
      error => {
        this._snackBarTemplate.snackBarError(this._snackBar, error.error.Message + " " + error.status);
        if (this._branchListDropdownSubscription !== null) this._branchListDropdownSubscription.unsubscribe();
      }
    );
  }

  private async ShiftsListData() {
    this._shiftListDropdownSubscription = (await this._changeShiftCodeDetailService.ShiftsList()).subscribe(
      response => {
        this._shiftListDropdown = response;
        this.loadShiftLineDetail();
        if (this._shiftListDropdownSubscription !== null) this._shiftListDropdownSubscription.unsubscribe();
      },
      error => {
        this._snackBarTemplate.snackBarError(this._snackBar, error.error.Message + " " + error.status);
        if (this._shiftListDropdownSubscription !== null) this._shiftListDropdownSubscription.unsubscribe();
      }
    );
  }

  private loadShiftLineDetail() {
    this._changeShiftLine.Id = this.caseData.objChangeShiftLine.Id;
    this._changeShiftLine.CSId = this.caseData.objChangeShiftLine.CSId;
    this._changeShiftLine.EmployeeId = this.caseData.objChangeShiftLine.EmployeeId;
    this._changeShiftLine.ShiftDate = new Date(this.caseData.objChangeShiftLine.ShiftDate);
    this._changeShiftLine.Branch = this.caseData.objChangeShiftLine.Branch;
    this._changeShiftLine.Remarks = this.caseData.objChangeShiftLine.Remarks;
    console.log(this._changeShiftLine);
    setTimeout(() => {
      this.isComponentHidden = false;
    }, 100);
  }

  public Close(): void {
    this.dialogRef.close({ event: 'Close' });
  }

  public async Save() {
    await this.dialogRef.close({ event: 'Save', objChangeShiftLine: this._changeShiftLine });
  }

}
