import { Component, OnInit, Inject } from '@angular/core';
import { ShiftModel } from './../shift-code-model';
import { ShiftCodeDetailService } from './../shift-code-detail.service';
import { ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackBarTemplate } from '../../shared/snack-bar-template';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-shift-code-detail',
  templateUrl: './shift-code-detail.component.html',
  styleUrls: ['./shift-code-detail.component.css']
})
export class ShiftCodeDetailComponent implements OnInit {

  constructor(private shiftCodeDetailService: ShiftCodeDetailService,
    private activatedRoute: ActivatedRoute,
    private snackBar: MatSnackBar,
    private snackBarTemplate: SnackBarTemplate,
    public _companyDetailDialogRef: MatDialogRef<ShiftCodeDetailComponent>,
    @Inject(MAT_DIALOG_DATA) public caseData: any
  ) { }

  public title = '';
  public event = 'Close';

  ngOnInit(): void {
    this.title = this.caseData.objDialogTitle;
    this.GetShiftDetail(this.caseData.objShiftCodeId);
  }

  public shiftModel: ShiftModel = {
    Id: 0,
    ShiftCode: "",
    Shift: "",
    Particulars: "",
    CreatedByUserId: 0,
    CreatedByUser: "",
    CreatedDateTime: new Date(),
    UpdatedByUserId: 0,
    UpdatedByUser: "",
    UpdatedDateTime: new Date(),
    IsLocked: false
  }

  public isDataLoaded: boolean = false;
  public isProgressBarHidden: boolean = false;

  private shiftDetailSubscription: any;
  private saveShiftDetailSubscription: any;
  private lockShiftDetailSubscription: any;
  private unlockShiftDetailSubscription: any;

  public btnSaveDisabled: boolean = true;
  public btnLockisabled: boolean = true;
  public btnUnlockDisabled: boolean = true;

  public isLocked: boolean = false;
  public isComponentsShown: boolean = false;

  private async GetShiftDetail(id) {
    this.disableButtons();
    this.isComponentsShown = false;
    this.shiftDetailSubscription = (await this.shiftCodeDetailService.ShiftDetail(id)).subscribe(
      (response: any) => {
        let result = response;
        console.log(result);
        if (result != null) {
          this.shiftModel = result;
          this.shiftModel.IsLocked = result["IsLocked"];
          console.log(result["IsLocked"]);
        }

        this.loadComponent(result["IsLocked"]);
        this.isDataLoaded = true;
        this.isComponentsShown = true;
        if (this.shiftDetailSubscription !== null) this.shiftDetailSubscription.unsubscribe();
      },
      error => {
        this.snackBarTemplate.snackBarError(this.snackBar, error.error + " " + " Status Code: " + error.status);
        if (this.shiftDetailSubscription !== null) this.shiftDetailSubscription.unsubscribe();
      }
    );
  }

  public async SaveShiftDetail() {
    this.disableButtons();
    if (this.isDataLoaded == true) {
      this.isDataLoaded = false;
      this.saveShiftDetailSubscription = await (await this.shiftCodeDetailService.SaveShift(this.shiftModel.Id, this.shiftModel)).subscribe(
        response => {
          this.event = "Save";
          this.isDataLoaded = true;
          this.loadComponent(this.shiftModel.IsLocked);
          this.snackBarTemplate.snackBarSuccess(this.snackBar, "Save Successfully.");
          if (this.saveShiftDetailSubscription !== null) this.saveShiftDetailSubscription.unsubscribe();
        },
        error => {
          this.loadComponent(this.shiftModel.IsLocked);
          this.btnUnlockDisabled = true;
          this.snackBarTemplate.snackBarError(this.snackBar, error.error + " " + " Status Code: " + error.status);
          if (this.saveShiftDetailSubscription !== null) this.saveShiftDetailSubscription.unsubscribe();
        }
      );
    }
  }

  public async LockShiftDetail() {
    this.disableButtons();

    if (this.isDataLoaded == true) {
      this.isDataLoaded = false;
      this.lockShiftDetailSubscription = await (await this.shiftCodeDetailService.LockShift(this.shiftModel.Id, this.shiftModel)).subscribe(
        response => {
          this.event = "Lock";
          this.loadComponent(true);
          this.isDataLoaded = true;
          this.snackBarTemplate.snackBarSuccess(this.snackBar, "Lock Successfully.");
          if (this.lockShiftDetailSubscription !== null) this.lockShiftDetailSubscription.unsubscribe();
        },
        error => {
          this.isDataLoaded = true;
          this.loadComponent(false);
          this.snackBarTemplate.snackBarError(this.snackBar, error.error + " " + " Status Code: " + error.status);
          if (this.lockShiftDetailSubscription !== null) this.lockShiftDetailSubscription.unsubscribe();
        }
      );
    }
  }

  public async UnlockShiftDetail() {
    this.disableButtons();

    if (this.isDataLoaded == true) {
      this.isDataLoaded = false;
      this.unlockShiftDetailSubscription = await (await this.shiftCodeDetailService.UnlockShift(this.shiftModel.Id)).subscribe(
        response => {
          this.event = "Unlock";
          this.loadComponent(false);
          this.isDataLoaded = true;
          this.snackBarTemplate.snackBarSuccess(this.snackBar, "Unlock Successfully.");
          if (this.unlockShiftDetailSubscription !== null) this.unlockShiftDetailSubscription.unsubscribe();
        },
        error => {
          this.loadComponent(true);
          this.isDataLoaded = true;
          this.snackBarTemplate.snackBarError(this.snackBar, error.error + " " + " Status Code: " + error.status);
          if (this.unlockShiftDetailSubscription !== null) this.unlockShiftDetailSubscription.unsubscribe();
        }
      );
    }
  }

  ngOnDestroy() {
  }

  // ==================
  // Component Behavior
  // ==================
  private loadComponent(isDisable) {
    if (isDisable == true) {
      this.btnSaveDisabled = isDisable;
      this.btnLockisabled = isDisable;
      this.btnUnlockDisabled = !isDisable;
    } else {
      this.btnSaveDisabled = isDisable;
      this.btnLockisabled = isDisable;
      this.btnUnlockDisabled = !isDisable;
    }

    this.isLocked = isDisable;
    this.isProgressBarHidden = false;
  }

  private disableButtons() {
    this.btnSaveDisabled = true;
    this.btnLockisabled = true;
    this.btnUnlockDisabled = true;
    this.isProgressBarHidden = true;
  }

  public Close(): void {
    this._companyDetailDialogRef.close({ event: this.event });
  }
}
