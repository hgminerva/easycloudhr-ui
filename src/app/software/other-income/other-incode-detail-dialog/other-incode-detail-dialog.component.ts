import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackBarTemplate } from '../../shared/snack-bar-template';
import { OtherIncomeModel } from '../other-income.model';
import { OtherIncomeService } from '../other-income.service';
import { SoftwareSecurityService, UserModule } from '../../software-security/software-security.service';

@Component({
  selector: 'app-other-incode-detail-dialog',
  templateUrl: './other-incode-detail-dialog.component.html',
  styleUrls: ['./other-incode-detail-dialog.component.css']
})
export class OtherIncodeDetailDialogComponent implements OnInit {

  constructor(
    private snackBar: MatSnackBar,
    private snackBarTemplate: SnackBarTemplate,
    private _otherIncomeService: OtherIncomeService,
    public _otherIncomeDetailDialogRef: MatDialogRef<OtherIncodeDetailDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public caseData: any,
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
    this._userRightsSubscription = await (await this._softwareSecurityService.PageModuleRights("Other Income")).subscribe(
      (response: any) => {
        let results = response;
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

    await this.GetOtherIncomeDetail(this.caseData.objOtherIncomeId);
  }

  ngOnInit(): void {
    this.title = this.caseData.objDialogTitle;
    this.Get_userRights();
  }

  public _otherIncomeModel: OtherIncomeModel = {
    Id: 0,
    OtherIncomeCode: '',
    OtherIncome: '',
    IsTaxable: false,
    CreatedByUserId: 0,
    CreatedByUser: '',
    CreatedDateTime: '',
    UpdatedByUserId: 0,
    UpdatedByUser: '',
    UpdatedDateTime: '',
    IsLocked: false
  }

  public isOtherIncomeDataLoaded: boolean = false;
  public isLocked: boolean = false;
  private _otherIncomeDetailSubscription: any;

  private saveOtherIncomeDetailSubscription: any;
  private _lockOtherIncomeDetailSubscription: any;
  private _unlockOtherIncomeDetailSubscription: any;

  private isDataLoaded: boolean = true;
  public isProgressBarHidden: boolean = true;

  public btnSaveDisabled: boolean = true;
  public btnLockisabled: boolean = true;
  public btnUnlockDisabled: boolean = true;

  public isComponentsShown: boolean = false;


  private async GetOtherIncomeDetail(id) {
    this.isComponentsShown = false;
    this.disableButtons();
    this._otherIncomeDetailSubscription = await (await this._otherIncomeService.OtherIncomeDetail(id)).subscribe(
      response => {
        let result = response;
        if (result != null) {
          this._otherIncomeModel.Id = result["Id"];
          this._otherIncomeModel.OtherIncomeCode = result["OtherIncomeCode"];
          this._otherIncomeModel.OtherIncome = result["OtherIncome"];
          this._otherIncomeModel.IsTaxable = result["IsTaxable"];
          this._otherIncomeModel.CreatedByUserId = result["CreatedByUserId"];
          this._otherIncomeModel.CreatedByUser = result["CreatedByUser"];
          this._otherIncomeModel.CreatedDateTime = result["CreatedDateTime"];
          this._otherIncomeModel.UpdatedByUserId = result["UpdatedByUserId"];
          this._otherIncomeModel.UpdatedByUser = result["UpdatedByUser"];
          this._otherIncomeModel.UpdatedDateTime = result["UpdatedDateTime"];
          this._otherIncomeModel.IsLocked = result["IsLocked"];
        }
        this.loadComponent(result["IsLocked"]);
        this.isComponentsShown = true;
        if (this._otherIncomeDetailSubscription !== null) this._otherIncomeDetailSubscription.unsubscribe();
      },
      error => {
        this.snackBarTemplate.snackBarError(this.snackBar, error.error.Message + " " + error.status);
        if (this._otherIncomeDetailSubscription !== null) this._otherIncomeDetailSubscription.unsubscribe();
      }
    );
  }

  public async SaveOtherIncomeDetail() {
    this.disableButtons();
    if (this.isDataLoaded == true) {
      this.isDataLoaded = false;
      this.saveOtherIncomeDetailSubscription = await (await this._otherIncomeService.SaveOtherIncome(this._otherIncomeModel.Id, this._otherIncomeModel)).subscribe(
        response => {
          this.loadComponent(this._otherIncomeModel.IsLocked);
          this.isDataLoaded = true;
          this.event = "Save";
          this.snackBarTemplate.snackBarSuccess(this.snackBar, "Save Successfully.");
          if (this.saveOtherIncomeDetailSubscription !== null) this.saveOtherIncomeDetailSubscription.unsubscribe();
        },
        error => {
          this.loadComponent(this._otherIncomeModel.IsLocked);
          this.isDataLoaded = true;
          this.snackBarTemplate.snackBarError(this.snackBar, error.error.Message + " " + error.status);
          if (this.saveOtherIncomeDetailSubscription !== null) this.saveOtherIncomeDetailSubscription.unsubscribe();
        }
      );
    }
  }


  public async LockOtherIncomeDetail() {
    this.disableButtons();
    if (this.isDataLoaded == true) {
      this.isDataLoaded = false;
      this._lockOtherIncomeDetailSubscription = await (await this._otherIncomeService.LockOtherIncome(this._otherIncomeModel.Id, this._otherIncomeModel)).subscribe(
        response => {
          this.loadComponent(true);
          this.isDataLoaded = true;
          this.event = "Lock";
          this.snackBarTemplate.snackBarSuccess(this.snackBar, "Lock Successfully.");
          if (this._lockOtherIncomeDetailSubscription !== null) this._lockOtherIncomeDetailSubscription.unsubscribe();
        },
        error => {
          this.loadComponent(false);
          this.isDataLoaded = true;
          this.snackBarTemplate.snackBarError(this.snackBar, error.error.Message + " " + error.status);
          if (this._lockOtherIncomeDetailSubscription !== null) this._lockOtherIncomeDetailSubscription.unsubscribe();
        }
      );
    }
  }

  public async UnlockOtherIncomeDetail() {
    this.disableButtons();
    if (this.isDataLoaded == true) {
      this.isDataLoaded = false;
      this._unlockOtherIncomeDetailSubscription = await (await this._otherIncomeService.UnlockOtherIncome(this._otherIncomeModel.Id)).subscribe(
        response => {
          this.loadComponent(false);
          this.isDataLoaded = true;
          this.event = "Unlock";
          this.snackBarTemplate.snackBarSuccess(this.snackBar, "Unlock Successfully.");
          if (this._unlockOtherIncomeDetailSubscription !== null) this._unlockOtherIncomeDetailSubscription.unsubscribe();
        },
        error => {
          this.loadComponent(true);
          this.isDataLoaded = true;
          this.snackBarTemplate.snackBarError(this.snackBar, error.error.Message + " " + error.status);
          if (this._unlockOtherIncomeDetailSubscription !== null) this._unlockOtherIncomeDetailSubscription.unsubscribe();
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
    this._otherIncomeDetailDialogRef.close({ event: this.event });
  }
}
