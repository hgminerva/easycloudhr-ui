import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackBarTemplate } from '../../shared/snack-bar-template';

import { DecimalPipe } from '@angular/common';

import { OtherDeductionsService } from '../other-deductions.service';
import { OtherDeductionModel } from '../other-deduction.model';
import { SoftwareSecurityService, UserModule } from '../../software-security/software-security.service';

@Component({
  selector: 'app-other-deduction-detail-dialog',
  templateUrl: './other-deduction-detail-dialog.component.html',
  styleUrls: ['./other-deduction-detail-dialog.component.css']
})
export class OtherDeductionDetailDialogComponent implements OnInit {

  constructor(
    private snackBar: MatSnackBar,
    private snackBarTemplate: SnackBarTemplate,
    private _otherDeductionsService: OtherDeductionsService,
    public _OtherDeductionDetailDialogRef: MatDialogRef<OtherDeductionDetailDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public caseData: any,
    private decimalPipe: DecimalPipe,
    private _softwareSecurityService: SoftwareSecurityService,
  ) { }

  public title = '';
  public event = 'Close';

  private _userRightsSubscription: any;

  public _userRights: UserModule = {
    Module: "",
    CanOpen: false,
    CanAdd: false,
    CanEdit: false,
    CanDelete: false,
    CanLock: false,
    CanUnlock: false,
    CanPrint: false,
  }

  private async Get_userRights() {
    this._userRightsSubscription = await (await this._softwareSecurityService.PageModuleRights("Other Deduction")).subscribe(
      (response: any) => {
        let results = response;
        console.log(response);
        if (results !== null) {
          this._userRights.Module = results["Module"];
          this._userRights.CanOpen = results["CanOpen"];
          this._userRights.CanAdd = results["CanAdd"];
          this._userRights.CanEdit = results["CanEdit"];
          this._userRights.CanDelete = results["CanDelete"];
          this._userRights.CanLock = results["CanLock"];
          this._userRights.CanUnlock = results["CanUnlock"];
          this._userRights.CanPrint = results["CanPrint"];
        }

        if (this._userRightsSubscription !== null) this._userRightsSubscription.unsubscribe();
      },
      error => {
        this.snackBarTemplate.snackBarError(this.snackBar, error.error.Message + " " + error.status);
        if (this._userRightsSubscription !== null) this._userRightsSubscription.unsubscribe();
      }
    );

    await this.GetOtherDeductionDetail(this.caseData.objOtherDeductionId);
  }

  public _otherDeductionModel: OtherDeductionModel = {
    Id: 0,
    OtherDeductionCode: '',
    OtherDeduction: '',
    IsLoan: false,
    DefaultAmount: '',
    CreatedByUserId: 0,
    CreatedByUser: '',
    CreatedDateTime: '',
    UpdatedByUserId: 0,
    UpdatedByUser: '',
    UpdatedDateTime: '',
    IsLocked: false
  }

  public isOtherDeductionDataLoaded: boolean = false;
  public isLocked: boolean = false;
  private _OtherDeductionDetailSubscription: any;

  private saveOtherDeductionDetailSubscription: any;
  private _lockOtherDeductionDetailSubscription: any;
  private _unlockOtherDeductionDetailSubscription: any;

  private isDataLoaded: boolean = true;
  public isProgressBarHidden: boolean = true;

  public btnSaveDisabled: boolean = true;
  public btnLockisabled: boolean = true;
  public btnUnlockDisabled: boolean = true;

  public isComponentsShown: boolean = false;

  private async GetOtherDeductionDetail(id) {
    this.isComponentsShown = false;
    this.disableButtons();
    this._OtherDeductionDetailSubscription = await (await this._otherDeductionsService.OtherDeductionDetail(id)).subscribe(
      response => {
        let result = response;
        if (result != null) {
          this._otherDeductionModel.Id = result["Id"];
          this._otherDeductionModel.OtherDeductionCode = result["OtherDeductionCode"];
          this._otherDeductionModel.OtherDeduction = result["OtherDeduction"];
          this._otherDeductionModel.IsLoan = result["IsLoan"];
          this._otherDeductionModel.DefaultAmount = this.decimalPipe.transform(result["DefaultAmount"], "1.2-2");
          this._otherDeductionModel.CreatedByUserId = result["CreatedByUserId"];
          this._otherDeductionModel.CreatedByUser = result["CreatedByUser"];
          this._otherDeductionModel.CreatedDateTime = result["CreatedDateTime"];
          this._otherDeductionModel.UpdatedByUserId = result["UpdatedByUserId"];
          this._otherDeductionModel.UpdatedByUser = result["UpdatedByUser"];
          this._otherDeductionModel.UpdatedDateTime = result["UpdatedDateTime"];
          this._otherDeductionModel.IsLocked = result["IsLocked"];
        }
        this.loadComponent(result["IsLocked"]);
        this.isComponentsShown = true;
        if (this._OtherDeductionDetailSubscription !== null) this._OtherDeductionDetailSubscription.unsubscribe();
      },
      error => {
        this.snackBarTemplate.snackBarError(this.snackBar, error.error.Message + " " + error.status);
        if (this._OtherDeductionDetailSubscription !== null) this._OtherDeductionDetailSubscription.unsubscribe();
      }
    );
  }

  public async SaveOtherDeductionDetail() {
    this.disableButtons();
    if (this.isDataLoaded == true) {
      this.isDataLoaded = false;
      this.saveOtherDeductionDetailSubscription = await (await this._otherDeductionsService.SaveOtherDeduction(this._otherDeductionModel.Id, this._otherDeductionModel)).subscribe(
        response => {
          this.loadComponent(this._otherDeductionModel.IsLocked);
          this.isDataLoaded = true;
          this.event = "Save";
          this.snackBarTemplate.snackBarSuccess(this.snackBar, "Save Successfully.");
          if (this.saveOtherDeductionDetailSubscription !== null) this.saveOtherDeductionDetailSubscription.unsubscribe();
        },
        error => {
          this.loadComponent(this._otherDeductionModel.IsLocked);
          this.isDataLoaded = true;
          this.snackBarTemplate.snackBarError(this.snackBar, error.error.Message + " " + error.status);
          if (this.saveOtherDeductionDetailSubscription !== null) this.saveOtherDeductionDetailSubscription.unsubscribe();
        }
      );
    }
  }


  public async LockOtherDeductionDetail() {
    this.disableButtons();
    if (this.isDataLoaded == true) {
      this.isDataLoaded = false;
      this._lockOtherDeductionDetailSubscription = await (await this._otherDeductionsService.LockOtherDeduction(this._otherDeductionModel.Id, this._otherDeductionModel)).subscribe(
        response => {
          this.loadComponent(true);
          this.isDataLoaded = true;
          this.event = "Lock";
          this.snackBarTemplate.snackBarSuccess(this.snackBar, "Lock Successfully.");
          if (this._lockOtherDeductionDetailSubscription !== null) this._lockOtherDeductionDetailSubscription.unsubscribe();
        },
        error => {
          this.loadComponent(false);
          this.isDataLoaded = true;
          this.snackBarTemplate.snackBarError(this.snackBar, error.error.Message + " " + error.status);
          if (this._lockOtherDeductionDetailSubscription !== null) this._lockOtherDeductionDetailSubscription.unsubscribe();
        }
      );
    }
  }

  public async UnlockOtherDeductionDetail() {
    this.disableButtons();
    if (this.isDataLoaded == true) {
      this.isDataLoaded = false;
      this._unlockOtherDeductionDetailSubscription = await (await this._otherDeductionsService.UnlockOtherDeduction(this._otherDeductionModel.Id)).subscribe(
        response => {
          this.loadComponent(false);
          this.isDataLoaded = true;
          this.event = "Unlock";
          this.snackBarTemplate.snackBarSuccess(this.snackBar, "Unlock Successfully.");
          if (this._unlockOtherDeductionDetailSubscription !== null) this._unlockOtherDeductionDetailSubscription.unsubscribe();
        },
        error => {
          this.loadComponent(true);
          this.isDataLoaded = true;
          this.snackBarTemplate.snackBarError(this.snackBar, error.error.Message + " " + error.status);
          if (this._unlockOtherDeductionDetailSubscription !== null) this._unlockOtherDeductionDetailSubscription.unsubscribe();
        }
      );
    }
  }

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

    if (this._userRights.CanEdit === false) {
      this.isLocked = true;
    } else {
      this.isLocked = isDisable;
    }

    this.isProgressBarHidden = false;
  }

  private disableButtons() {
    this.btnSaveDisabled = true;
    this.btnLockisabled = true;
    this.btnUnlockDisabled = true;
    this.isProgressBarHidden = true;
  }

  public Close(): void {
    this._OtherDeductionDetailDialogRef.close({ event: this.event });
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

  formatValueDefaultAmount() {
    if (this._otherDeductionModel.DefaultAmount == '') {
      this._otherDeductionModel.DefaultAmount = this.decimalPipe.transform(0, "1.2-2");
    } else {
      this._otherDeductionModel.DefaultAmount = this.decimalPipe.transform(this._otherDeductionModel.DefaultAmount, "1.2-2");
    }
  }

  ngOnInit(): void {
    this.title = this.caseData.objDialogTitle;
    this.Get_userRights();
  }
}
