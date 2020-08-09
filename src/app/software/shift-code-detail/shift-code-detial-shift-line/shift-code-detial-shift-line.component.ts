import { Component, OnInit, Inject } from '@angular/core';

import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackBarTemplate } from '../../shared/snack-bar-template';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DecimalPipe } from '@angular/common';
import { ShiftLineModel } from '../shift-code-line.model';
import { ShiftCodeDetailService } from '../shift-code-detail.service';

@Component({
  selector: 'app-shift-code-detial-shift-line',
  templateUrl: './shift-code-detial-shift-line.component.html',
  styleUrls: ['./shift-code-detial-shift-line.component.css']
})
export class ShiftCodeDetialShiftLineComponent implements OnInit {

  constructor(
    public _shiftCodeDetailService: ShiftCodeDetailService,
    private _snackBar: MatSnackBar,
    private _snackBarTemplate: SnackBarTemplate,
    public _matDialogRef: MatDialogRef<ShiftCodeDetialShiftLineComponent>,
    @Inject(MAT_DIALOG_DATA) public _caseData: any,
    private _decimalPipe: DecimalPipe

  ) { }

  ngOnInit() {
    this._title = this._caseData.objDialogTitle;
    this.DateTypeListData();
  }

  public _title = '';
  public _isComponentsShown: boolean = true;

  public _shiftLineModel: ShiftLineModel = {
    Id: 0,
    ShiftId: 0,
    ShiftDate: '',
    TimeIn1: '',
    TimeOut1: '',
    TimeIn2: '',
    TimeOut2: '',
    IsRestDay: false,
    TotalNumberOfHours: '',
    NightDifferentialHours: '',
    IsFlexible: false,
    FixibilityHoursLimit: '',
    Remarks: '',
  }

  public _dayDropdownSubscription: any;
  public _dayListDropdown: any = [];

  private async DateTypeListData() {
    this._dayDropdownSubscription = await (await this._shiftCodeDetailService.DayList()).subscribe(
      response => {
        this._dayListDropdown = response;
        this._shiftLineModel.ShiftDate = response[0].Value;
        this.loadDTRLineDetail();
        if (this._dayDropdownSubscription !== null) this._dayDropdownSubscription.unsubscribe();
      },
      error => {
        this._snackBarTemplate.snackBarError(this._snackBar, error.error.Message + " " + error.status);
        if (this._dayDropdownSubscription !== null) this._dayDropdownSubscription.unsubscribe();
      }
    );
  }

  fillLeadingZeroes(number: string, length: number) {
    let result = number;
    let pad = length - result.length;
    while (pad > 0) { result = '0' + result; pad--; }

    return result;
  }

  convertTime(time12h) {

    if (time12h == '') {
      return '';
    }

    const [time, modifier] = time12h.split(' ');

    let [hours, minutes] = time.split(':');

    if (hours === '12') {
      hours = '00';
    }

    if (modifier === 'PM') {
      hours = parseInt(hours, 10) + 12;
    }

    let hrs = this.fillLeadingZeroes(hours, 2);
    let mins = this.fillLeadingZeroes(minutes, 2);

    return `${hrs}:${mins}`;
  }


  restrictNumeric(e) {
    let input;
    if (e.key == '') {
      return 0.00;
    }
    if (e.metaKey || e.ctrlKey) {
      return true;
    }
    if (e.which === 32) {
      return false;
    }
    if (e.which === 0) {
      return true;
    }
    if (e.which < 33) {
      return true;
    }
    if (e.which < 33) {
      return true;
    }
    input = String.fromCharCode(e.which);
    return !!/^[0-9.,]+$/.test(input);
  }

  formatValueTotalNumberOfHours() {
    if (this._shiftLineModel.TotalNumberOfHours == '') {
      this._shiftLineModel.TotalNumberOfHours = this._decimalPipe.transform(0, "1.2-2");
    } else {
      this._shiftLineModel.TotalNumberOfHours = this._decimalPipe.transform(this._shiftLineModel.TotalNumberOfHours, "1.2-2");
    }
  }

  formatValueNightDifferentialHours() {
    if (this._shiftLineModel.NightDifferentialHours == '') {
      this._shiftLineModel.NightDifferentialHours = this._decimalPipe.transform(0, "1.2-2");
    } else {
      this._shiftLineModel.NightDifferentialHours = this._decimalPipe.transform(this._shiftLineModel.NightDifferentialHours, "1.2-2");
    }
  }

  formatValueFixibilityHoursLimit() {
    if (this._shiftLineModel.FixibilityHoursLimit == '') {
      this._shiftLineModel.FixibilityHoursLimit = this._decimalPipe.transform(0, "1.2-2");
    } else {
      this._shiftLineModel.FixibilityHoursLimit = this._decimalPipe.transform(this._shiftLineModel.FixibilityHoursLimit, "1.2-2");
    }
  }

  public async loadDTRLineDetail() {
    this._shiftLineModel.Id = this._caseData.objShiftLine.Id;
    this._shiftLineModel.ShiftDate = this._caseData.objShiftLine.ShiftDate;
    this._shiftLineModel.ShiftId = await this._caseData.objShiftLine.ShiftId;
    this._shiftLineModel.TimeIn1 = await this.convertTime(this._caseData.objShiftLine.TimeIn1);
    this._shiftLineModel.TimeOut1 = await this.convertTime(this._caseData.objShiftLine.TimeOut1);
    this._shiftLineModel.TimeIn2 = await this.convertTime(this._caseData.objShiftLine.TimeIn2);
    this._shiftLineModel.TimeOut2 = await this.convertTime(this._caseData.objShiftLine.TimeOut2);
    this._shiftLineModel.IsRestDay = await this._caseData.objShiftLine.IsRestDay;
    this._shiftLineModel.IsFlexible = await this._caseData.objShiftLine.IsFlexible;
    this._shiftLineModel.TotalNumberOfHours = await this._decimalPipe.transform(this._caseData.objShiftLine.TotalNumberOfHours, "1.2-2");
    this._shiftLineModel.NightDifferentialHours = await this._decimalPipe.transform(this._caseData.objShiftLine.NightDifferentialHours, "1.2-2");
    this._shiftLineModel.FixibilityHoursLimit = await this._decimalPipe.transform(this._caseData.objShiftLine.FixibilityHoursLimit, "1.2-2");
    this._shiftLineModel.Remarks = this._caseData.objShiftLine.Remarks;

    setTimeout(() => {
      this._isComponentsShown = true;
    }, 1500);
  }


  public Close(): void {
    this._matDialogRef.close({ event: "Close" });
  }

  public CloseOnSave(): void {
    if (this._title === "Add ShiftLine Detail") {
      this._matDialogRef.close({ event: "Add", data: this._shiftLineModel });
    } else {
      this._matDialogRef.close({ event: "Update", data: this._shiftLineModel });

    }
  }

  ngOnDestroy() {
  }

}
