import { DecimalPipe } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EmployeeListPickDialogComponent } from '../../shared/employee-list-pick-dialog/employee-list-pick-dialog.component';
import { SnackBarTemplate } from '../../shared/snack-bar-template';
import { YearDetialService } from '../year-detial.service';
import { YearLeaveCreditsModel } from '../year-leave-credits.model';

@Component({
  selector: 'app-year-leave-credits-dialog',
  templateUrl: './year-leave-credits-dialog.component.html',
  styleUrls: ['./year-leave-credits-dialog.component.css']
})
export class YearLeaveCreditsDialogComponent implements OnInit {

  constructor(
    public _matDialogRef: MatDialogRef<YearLeaveCreditsDialogComponent>,
    public _yearDetialService: YearDetialService,
    @Inject(MAT_DIALOG_DATA) public _caseData: any,
    private _decimalPipe: DecimalPipe,
    public _matDialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.loadComponents();
  }

  public yearLeaveCreditsModel: YearLeaveCreditsModel = {
    Id: 0,
    YearId: 0,
    EmployeeId: 0,
    Employee: '',
    LeaveCredits: '0',
    Remarks: 'NA',
    DateEncoded: ''
  }

  public _title = '';
  public _isComponentsShown: boolean = false;


  public RemoveComma(value: string): string {
    return value.toString().replace(/,/g, '');
  }

  public inputLeaveCredits = 'text';

  LeaveCreditsFormatValueFocusOut() {
    this.inputLeaveCredits = 'text';

    if (this.yearLeaveCreditsModel.LeaveCredits == '') {
      this.yearLeaveCreditsModel.LeaveCredits = this._decimalPipe.transform(0, "1.2-2");
    } else {
      this.yearLeaveCreditsModel.LeaveCredits = this._decimalPipe.transform(this.yearLeaveCreditsModel.LeaveCredits, "1.2-2");
    }
  }

  LeaveCreditsToNumberTypeFocus() {
    this.yearLeaveCreditsModel.LeaveCredits = this.RemoveComma(this.yearLeaveCreditsModel.LeaveCredits);
    this.inputLeaveCredits = 'number';
  }

  public loadComponents(): void {
    console.log(this._caseData.objDialogData.Id);
    setTimeout(() => {
      this._title = this._caseData.objDialogTitle;
      this.yearLeaveCreditsModel.Id = this._caseData.objDialogData.Id;
      this.yearLeaveCreditsModel.YearId = this._caseData.objDialogData.YearId;
      this.yearLeaveCreditsModel.EmployeeId = this._caseData.objDialogData.EmployeeId;
      this.yearLeaveCreditsModel.Employee = this._caseData.objDialogData.Employee;
      this.yearLeaveCreditsModel.LeaveCredits = this._decimalPipe.transform(this._caseData.objDialogData.LeaveCredits, "1.2-2");
      this._isComponentsShown = true;

    }, 300);

  }

  public CloseOnSave(): void {
    if (this._title == 'Add Year Leave Credits Detail') {
      this._matDialogRef.close({ event: 'Add', data: this.yearLeaveCreditsModel });
    } else {
      this._matDialogRef.close({ event: 'Edit', data: this.yearLeaveCreditsModel });
    }
  }


  public Close(): void {
    this._matDialogRef.close({ event: 'Close' });
  }

  public Save(): void {

  }

  public EmployeeListDialog() {
    const matDialogRef = this._matDialog.open(EmployeeListPickDialogComponent, {
      width: '900px',
      height: '500',
      data: {
        objDialogTitle: "Employee List",
        objPayrollGroup: null
      },
      disableClose: true
    });

    matDialogRef.afterClosed().subscribe((data: any) => {
      console.log(data);
      if (data.event != "Close") {
        this.yearLeaveCreditsModel.EmployeeId = data.employee.Id;
        this.yearLeaveCreditsModel.Employee = data.employee.Value;
      }
    });
  }

}
