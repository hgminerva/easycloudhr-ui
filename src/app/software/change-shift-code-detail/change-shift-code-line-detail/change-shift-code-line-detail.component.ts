import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackBarTemplate } from '../../shared/snack-bar-template';
import { ChangeShiftCodeDetailService } from '../change-shift-code-detail.service';
import { ChangeShiftLineModel } from '../change-shift-code-line.model';
import { EmployeeListPickDialogComponent } from './../../shared/employee-list-pick-dialog/employee-list-pick-dialog.component';
import { DatePipe } from '@angular/common';

import { SharedService, LabelModel } from '../../shared/shared.service';

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
    private _snackBarTemplate: SnackBarTemplate,
    public _matDialog: MatDialog,
    private datePipe: DatePipe,
    public sharedService: SharedService
  ) { }

  public labels: LabelModel[] = [];
  public getLabels(): void {
    this.labels = [];
    this.sharedService.LabelList().subscribe(
      data => {
        if (data.length > 0) {
          this.labels = data;
        }
      }
    );
  }
  public setLabel(label: string): string {
    let displayed_label: string = label;
    for (let i = 0; i < this.labels.length; i++) {
      if (label === this.labels[i].label) displayed_label = this.labels[i].displayed_label;
    }
    return displayed_label;
  }

  public _changeShiftLine: ChangeShiftLineModel = {
    Id: 0,
    CSId: 0,
    EmployeeId: 0,
    Employee: '',
    ShiftDate: this.datePipe.transform(new Date(), 'yyyy-MM-dd'),
    ShiftId: 0,
    Branch: '',
    Remarks: ''
  }

  public UIShiftDate = new Date();

  public title = '';
  public Employee = '';

  public isComponentHidden: boolean = true;

  public _branchListDropdownSubscription: any;
  public _branchListDropdown: any = [];

  public _shiftListDropdownSubscription: any;
  public _shiftListDropdown: any = [];

  private async ShiftsListData() {
    this._shiftListDropdownSubscription = (await this._changeShiftCodeDetailService.ShiftsList()).subscribe(
      response => {
        this._shiftListDropdown = response;
        this._changeShiftLine.ShiftId = this._shiftListDropdown[0].Id;
        this.BranchListData();
        if (this._shiftListDropdownSubscription !== null) this._shiftListDropdownSubscription.unsubscribe();
      },
      error => {
        this._snackBarTemplate.snackBarError(this._snackBar, error.error.Message + " " + error.status);
        if (this._shiftListDropdownSubscription !== null) this._shiftListDropdownSubscription.unsubscribe();
      }
    );
  }


  private async BranchListData() {
    this._branchListDropdownSubscription = (await this._changeShiftCodeDetailService.BranchList()).subscribe(
      response => {
        this._branchListDropdown = response;
        this._changeShiftLine.Branch = this._branchListDropdown[0].Value;
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
    this._changeShiftLine.Id = this.caseData.objChangeShiftLine.Id;
    this._changeShiftLine.CSId = this.caseData.objChangeShiftLine.CSId;
    this._changeShiftLine.EmployeeId = this.caseData.objChangeShiftLine.EmployeeId;
    this._changeShiftLine.Employee = this.caseData.objChangeShiftLine.Employee;
    this._changeShiftLine.Remarks = this.caseData.objChangeShiftLine.Remarks;
    this._changeShiftLine.ShiftDate = this.caseData.objChangeShiftLine.ShiftDate;

    if (this._changeShiftLine.Id != 0) {
      this.UIShiftDate = new Date(this.caseData.objChangeShiftLine.ShiftDate);
      this._changeShiftLine.Branch = this.caseData.objChangeShiftLine.Branch;
    }

    console.log(this._changeShiftLine);
    setTimeout(() => {
      this.isComponentHidden = false;
    }, 100);
  }

  public Close(): void {
    this.dialogRef.close({ event: 'Close' });
  }

  public GetUIDATEShiftDate() {
    this._changeShiftLine.ShiftDate = this.datePipe.transform(this.UIShiftDate, 'yyyy-MM-dd');
    console.log(this._changeShiftLine.ShiftDate);
  }

  public async Save() {
    if (this._changeShiftLine.EmployeeId != 0) {
      await this.dialogRef.close({ event: this.title, data: this._changeShiftLine });
    } else {
      this._snackBarTemplate.snackBarError(this._snackBar, "Choose employee!");
    }
  }

  public EmployeeListDialog() {
    const matDialogRef = this._matDialog.open(EmployeeListPickDialogComponent, {
      width: '900px',
      height: '500',
      data: {
        objDialogTitle: "Employee List",
        objPayrollGroup: this.caseData.objPayrollGroup
      },
      disableClose: true
    });

    matDialogRef.afterClosed().subscribe((data: any) => {
      console.log(data);
      if (data.event != "Close") {
        this._changeShiftLine.EmployeeId = data.employee.Id;
        this._changeShiftLine.Employee = data.employee.Value;
      }
    });
  }

  async ngOnInit() {
    await this.getLabels();
    this.title = await this.caseData.objDialogTitle;
    await this.ShiftsListData();
  }
}
