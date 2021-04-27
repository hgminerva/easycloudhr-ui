import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackBarTemplate } from '../../shared/snack-bar-template';
import { CollectionView, ObservableArray } from '@grapecity/wijmo';
import * as wjcGrid from '@grapecity/wijmo.grid';
import { DecimalPipe } from '@angular/common';

import { LoanModel } from '../loan.model';
import { LoanListService } from '../loan-list.service';
import { EmployeeListPickDialogComponent } from '../../shared/employee-list-pick-dialog/employee-list-pick-dialog.component';
import { SoftwareSecurityService, UserModule } from '../../software-security/software-security.service';

@Component({
  selector: 'app-loan-detail-dialog',
  templateUrl: './loan-detail-dialog.component.html',
  styleUrls: ['./loan-detail-dialog.component.css']
})
export class LoanDetailDialogComponent implements OnInit {

  constructor(
    private snackBar: MatSnackBar,
    private snackBarTemplate: SnackBarTemplate,
    private _loanListService: LoanListService,
    public _loanDetailDialogRef: MatDialogRef<LoanDetailDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public caseData: any,
    private decimalPipe: DecimalPipe,
    public _matDialog: MatDialog,
    private _softwareSecurityService: SoftwareSecurityService,
  ) { }


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
    this._userRightsSubscription = await (await this._softwareSecurityService.PageModuleRights("Loan Detail")).subscribe(
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

    await this.GetDeductionListData();
  }

  public title = '';
  public event = 'Close';
  public inputTypeAmortiztion = 'text';
  public inputTypeLoanAmount = 'text';
  public inputTypePaidAmount = 'text';
  public inputTypeBalanceAmount = 'text';

  public _loanModel: LoanModel = {
    Id: 0,
    LNNumber: '',
    LDDate: new Date(),
    EmployeeId: 0,
    Employee: '',
    OtherDeductionId: 0,
    DocRef: '',
    Amortization: '',
    Remarks: '',
    LoanAmount: '',
    PaidAmount: '',
    BalanceAmount: '',
    Status: '',
    PreparedByUserId: 0,
    CheckedByUserId: 0,
    ApprovedByUserId: 0,
    CreatedByUserId: 0,
    CreatedByUser: '',
    CreatedDateTime: '',
    UpdatedByUserId: 0,
    UpdatedByUser: '',
    UpdatedDateTime: '',
    IsLocked: false
  }

  public isLDDateDataLoaded: boolean = false;
  public _isLocked: boolean = false;
  private _LoanDetailSubscription: any;

  private _saveLoanDetailSubscription: any;
  private _lockLoanDetailSubscription: any;
  private _unlockLoanDetailSubscription: any;

  private isDataLoaded: boolean = true;
  public isProgressBarHidden: boolean = true;

  public btnSaveDisabled: boolean = true;
  public btnLockisabled: boolean = true;
  public btnUnlockDisabled: boolean = true;

  public isComponentsShown: boolean = false;

  private otherDeductionDropdownSubscription: any;
  public otherDeductionListDropdown: any = [];

  public _userDropdownSubscription: any;
  public _userListDropdown: any = [];

  public _loanStatusDropdownSubscription: any;
  public _loanStatusListDropdown: any = [];

  // Class properties
  public _listLoanPaymentObservableArray: ObservableArray = new ObservableArray();
  public _listLoanPaymentCollectionView: CollectionView = new CollectionView(this._listLoanPaymentObservableArray);
  public _listPageIndex: number = 15;

  public _isLoanPaymentProgressBarHidden = false;
  public _isLoanPaymentDataLoaded: boolean = false;

  private _loanPaymentCListSubscription: any;

  @ViewChild('flexLoanPayment') _flexLoanPayment: wjcGrid.FlexGrid;


  private async GetDeductionListData() {
    this.otherDeductionDropdownSubscription = await (await this._loanListService.OtherDeductionList()).subscribe(
      response => {
        this.otherDeductionListDropdown = response;
        this.UserListData();
        if (this.otherDeductionDropdownSubscription !== null) this.otherDeductionDropdownSubscription.unsubscribe();
      },
      error => {
        this.snackBarTemplate.snackBarError(this.snackBar, error.error.Message + " " + error.status);
        if (this.otherDeductionDropdownSubscription !== null) this.otherDeductionDropdownSubscription.unsubscribe();
      }
    );
  }

  private async UserListData() {
    this._userDropdownSubscription = await (await this._loanListService.UserList()).subscribe(
      response => {
        this._userListDropdown = response;
        this._loanModel.PreparedByUserId = response[0].Id;
        this._loanModel.CheckedByUserId = response[0].Id;
        this._loanModel.ApprovedByUserId = response[0].Id;
        this.LoanStatusListData();
        if (this._userDropdownSubscription !== null) this._userDropdownSubscription.unsubscribe();
      },
      error => {
        this.snackBarTemplate.snackBarError(this.snackBar, error.error.Message + " " + error.status);
        if (this._userDropdownSubscription !== null) this._userDropdownSubscription.unsubscribe();
      }
    );
  }

  private async LoanStatusListData() {
    this._loanStatusDropdownSubscription = await (await this._loanListService.LoanStatusList()).subscribe(
      response => {
        this._loanStatusListDropdown = response;
        this.GetLoanDetail();
        if (this._loanStatusDropdownSubscription !== null) this._loanStatusDropdownSubscription.unsubscribe();
      },
      error => {
        this.snackBarTemplate.snackBarError(this.snackBar, error.error.Message + " " + error.status);
        if (this._loanStatusDropdownSubscription !== null) this._loanStatusDropdownSubscription.unsubscribe();
      }
    );
    this.GetLoanDetail();

  }

  private async GetLoanDetail() {
    this.isComponentsShown = false;
    this.disableButtons();
    this._LoanDetailSubscription = await (await this._loanListService.LoanDetail(this.caseData.objLoanId)).subscribe(
      response => {
        let result = response;
        if (result != null) {
          this._loanModel.Id = result["Id"];
          this._loanModel.LNNumber = result["LNNumber"];
          this._loanModel.LDDate = result["LDDate"];
          this._loanModel.EmployeeId = result["EmployeeId"];
          this._loanModel.Employee = result["Employee"];
          this._loanModel.OtherDeductionId = result["OtherDeductionId"];
          this._loanModel.DocRef = result["DocRef"];
          this._loanModel.Amortization = this.decimalPipe.transform(result["Amortization"], "1.2-2");
          this._loanModel.LoanAmount = this.decimalPipe.transform(result["LoanAmount"], "1.2-2");
          this._loanModel.PaidAmount = this.decimalPipe.transform(result["PaidAmount"], "1.2-2");
          this._loanModel.BalanceAmount = this.decimalPipe.transform(result["BalanceAmount"], "1.2-2");
          this._loanModel.Remarks = result["Remarks"];
          this._loanModel.Status = result["Status"];
          this._loanModel.PreparedByUserId = result["PreparedByUserId"];
          this._loanModel.CheckedByUserId = result["CheckedByUserId"];
          this._loanModel.ApprovedByUserId = result["ApprovedByUserId"];
          this._loanModel.CreatedByUserId = result["CreatedByUserId"];
          this._loanModel.CreatedByUser = result["CreatedByUser"];
          this._loanModel.CreatedDateTime = result["CreatedDateTime"];
          this._loanModel.UpdatedByUserId = result["UpdatedByUserId"];
          this._loanModel.UpdatedByUser = result["UpdatedByUser"];
          this._loanModel.UpdatedDateTime = result["UpdatedDateTime"];
          this._loanModel.IsLocked = result["IsLocked"];
          this.GetLoanPaymentListData(result["Id"]);
        }
        this.loadComponent(result["IsLocked"]);
        if (this._LoanDetailSubscription !== null) this._LoanDetailSubscription.unsubscribe();
      },
      error => {
        this.snackBarTemplate.snackBarError(this.snackBar, error.error.Message + " " + error.status);
        if (this._LoanDetailSubscription !== null) this._LoanDetailSubscription.unsubscribe();
      }
    );
  }

  private async GetLoanPaymentListData(loanId: number) {
    this._listLoanPaymentObservableArray = new ObservableArray();
    this._listLoanPaymentCollectionView = new CollectionView(this._listLoanPaymentObservableArray);
    this._listLoanPaymentCollectionView.pageSize = 15;
    this._listLoanPaymentCollectionView.trackChanges = true;
    await this._listLoanPaymentCollectionView.refresh();
    await this._flexLoanPayment.refresh();

    this._isLoanPaymentProgressBarHidden = true;
    this._loanPaymentCListSubscription = (await this._loanListService.LoanPayments(loanId)).subscribe(
      (response: any) => {
        var results = response;
        console.log(results);
        if (results["length"] > 0) {
          this._listLoanPaymentObservableArray = results;
          this._listLoanPaymentCollectionView = new CollectionView(this._listLoanPaymentObservableArray);
          this._listLoanPaymentCollectionView.pageSize = 15;
          this._listLoanPaymentCollectionView.trackChanges = true;
          this._listLoanPaymentCollectionView.refresh();
          this._flexLoanPayment.refresh();
        }

        this._isLoanPaymentDataLoaded = true;
        this._isLoanPaymentProgressBarHidden = false;
        this.isComponentsShown = true;

        if (this._loanPaymentCListSubscription != null) this._loanPaymentCListSubscription.unsubscribe();
      },
      error => {
        this.snackBarTemplate.snackBarError(this.snackBar, error.error.Message + " " + " Status Code: " + error.status);
        if (this._loanPaymentCListSubscription != null) this._loanPaymentCListSubscription.unsubscribe();
      }
    );
  }

  public async SaveLoanDetail() {
    this.disableButtons();
    if (this.isDataLoaded == true) {
      this.isDataLoaded = false;
      this._loanModel.BalanceAmount = this._loanModel.LoanAmount;
      this._saveLoanDetailSubscription = await (await this._loanListService.SaveLoan(this._loanModel.Id, this._loanModel)).subscribe(
        response => {
          this.loadComponent(false);
          this.isDataLoaded = true;
          this.event = "Save";
          this.snackBarTemplate.snackBarSuccess(this.snackBar, "Save Successfully.");
          if (this._saveLoanDetailSubscription !== null) this._saveLoanDetailSubscription.unsubscribe();
        },
        error => {
          this.loadComponent(false);
          this.isDataLoaded = true;
          this.snackBarTemplate.snackBarError(this.snackBar, error.error.Message + " " + error.status);
          if (this._saveLoanDetailSubscription !== null) this._saveLoanDetailSubscription.unsubscribe();
        }
      );
    }
  }


  public async LockLoanDetail() {
    this.disableButtons();
    if (this.isDataLoaded == true) {
      this.isDataLoaded = false;
      this._loanModel.BalanceAmount = this._loanModel.LoanAmount;
      this._lockLoanDetailSubscription = await (await this._loanListService.LockLoan(this._loanModel.Id, this._loanModel)).subscribe(
        response => {
          this.loadComponent(true);
          this.isDataLoaded = true;
          this.event = "Lock";
          this.snackBarTemplate.snackBarSuccess(this.snackBar, "Lock Successfully.");
          if (this._lockLoanDetailSubscription !== null) this._lockLoanDetailSubscription.unsubscribe();
        },
        error => {
          this.loadComponent(false);
          this.isDataLoaded = true;
          this.snackBarTemplate.snackBarError(this.snackBar, error.error.Message + " " + error.status);
          if (this._lockLoanDetailSubscription !== null) this._lockLoanDetailSubscription.unsubscribe();
        }
      );
    }
  }

  public async UnlockLoanDetail() {
    this.disableButtons();
    if (this.isDataLoaded == true) {
      this.isDataLoaded = false;
      this._unlockLoanDetailSubscription = await (await this._loanListService.UnlockLoan(this._loanModel.Id)).subscribe(
        response => {
          this.loadComponent(false);
          this.isDataLoaded = true;
          this.event = "Unlock";
          this.snackBarTemplate.snackBarSuccess(this.snackBar, "Unlock Successfully.");
          if (this._unlockLoanDetailSubscription !== null) this._unlockLoanDetailSubscription.unsubscribe();
        },
        error => {
          this.loadComponent(true);
          this.isDataLoaded = true;
          this.snackBarTemplate.snackBarError(this.snackBar, error.error.Message + " " + error.status);
          if (this._unlockLoanDetailSubscription !== null) this._unlockLoanDetailSubscription.unsubscribe();
        }
      );
    }
  }

  private loadComponent(isDisable) {
    this.btnSaveDisabled = isDisable;
    this.btnLockisabled = isDisable;
    this.btnUnlockDisabled = !isDisable;

    if (this._userRights.CanEdit === false) {
      this._isLocked = true;
    } else {
      this._isLocked = isDisable;
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
    this._loanDetailDialogRef.close({ event: this.event });
  }

  public RemoveComma(value: string): string {
    return value.toString().replace(/,/g, '');
  }


  FormatValueAmortization() {
    this.inputTypeAmortiztion = 'text';

    if (this._loanModel.Amortization == '') {
      this._loanModel.Amortization = this.decimalPipe.transform(0, "1.2-2");
    } else {
      this._loanModel.Amortization = this.decimalPipe.transform(this._loanModel.Amortization, "1.2-2");
    }
  }

  AmortiztionToNumberType() {
    this._loanModel.Amortization = this.RemoveComma(this._loanModel.Amortization);
    this.inputTypeAmortiztion = 'number';
  }

  FormatValueLoanAmount() {
    this.inputTypeLoanAmount = 'text';

    if (this._loanModel.LoanAmount == '') {
      this._loanModel.LoanAmount = this.decimalPipe.transform(0, "1.2-2");
    } else {
      this._loanModel.LoanAmount = this.decimalPipe.transform(this._loanModel.LoanAmount, "1.2-2");
    }
  }

  LoanAmountToNumberType() {
    this._loanModel.LoanAmount = this.RemoveComma(this._loanModel.LoanAmount);

    this.inputTypeLoanAmount = 'number';
  }

  public EmployeeListDialog() {
    if (this._isLocked == false) {
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
        if (data.event === 'Pick') {
          this._loanModel.EmployeeId = data.employee.Id;
          this._loanModel.Employee = data.employee.Value;
        }
      });
    }
  }

  activeTab() { }


  ngOnInit(): void {
    this.title = this.caseData.objDialogTitle;
    this.Get_userRights();
  }

}
