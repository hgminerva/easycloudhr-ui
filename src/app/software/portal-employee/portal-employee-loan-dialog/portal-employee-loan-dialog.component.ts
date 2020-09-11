import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackBarTemplate } from '../../shared/snack-bar-template';
import { CollectionView, ObservableArray } from '@grapecity/wijmo';
import * as wjcGrid from '@grapecity/wijmo.grid';
import { DecimalPipe } from '@angular/common';
import { PortalEmployeeService } from '../portal-employee.service';

@Component({
  selector: 'app-portal-employee-loan-dialog',
  templateUrl: './portal-employee-loan-dialog.component.html',
  styleUrls: ['./portal-employee-loan-dialog.component.css']
})
export class PortalEmployeeLoanDialogComponent implements OnInit {

  constructor(
    private snackBar: MatSnackBar,
    private snackBarTemplate: SnackBarTemplate,
    private _portalEmployeeService: PortalEmployeeService,
    public _loanDetailDialogRef: MatDialogRef<PortalEmployeeLoanDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public caseData: any,
    private decimalPipe: DecimalPipe,
    public _matDialog: MatDialog,
  ) { }

  public title = '';
  public event = 'Close';
  public inputTypeAmortiztion = 'text';
  public inputTypeLoanAmount = 'text';
  public inputTypePaidAmount = 'text';
  public inputTypeBalanceAmount = 'text';

  ngOnInit(): void {
    this.title = this.caseData.objDialogTitle;
    this.GetLoanDetail();
  }

  public _loanModel: any = {
    Id: 0,
    LNNumber: '',
    LDDate: new Date(),
    EmployeeId: 0,
    Employee: '',
    OtherDeductionId: 0,
    OtherDeduction: '',
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

  public isComponentsShown: boolean = false;
  public isProgressBarHidden: boolean = false;

  // Class properties
  public _listLoanPaymentObservableArray: ObservableArray = new ObservableArray();
  public _listLoanPaymentCollectionView: CollectionView = new CollectionView(this._listLoanPaymentObservableArray);
  public _listPageIndex: number = 15;

  public _isLoanPaymentProgressBarHidden = false;
  public _isLoanPaymentDataLoaded: boolean = false;

  private _loanPaymentCListSubscription: any;

  @ViewChild('flexLoanPayment') _flexLoanPayment: wjcGrid.FlexGrid;

  private async GetLoanDetail() {
    this.isComponentsShown = false;
    this.isProgressBarHidden = true;
    this._LoanDetailSubscription = await (await this._portalEmployeeService.LoanDetail(this.caseData.objLoanId)).subscribe(
      response => {
        let result = response;
        console.log(result);
        if (result != null) {
          this._loanModel.Id = result["Id"];
          this._loanModel.LNNumber = result["LNNumber"];
          this._loanModel.LDDate = result["LDDate"];
          this._loanModel.EmployeeId = result["EmployeeId"];
          this._loanModel.Employee = result["Employee"];
          this._loanModel.OtherDeductionId = result["OtherDeductionId"];
          this._loanModel.OtherDeduction = result["OtherDeduction"];
          this._loanModel.DocRef = result["DocRef"];
          this._loanModel.Amortization = this.decimalPipe.transform(result["Amortization"], "1.2-2");
          this._loanModel.LoanAmount = this.decimalPipe.transform(result["LoanAmount"], "1.2-2");
          this._loanModel.PaidAmount = this.decimalPipe.transform(result["PaidAmount"], "1.2-2");
          this._loanModel.BalanceAmount = this.decimalPipe.transform(result["BalanceAmount"], "1.2-2");
          this._loanModel.Remarks = result["Remarks"];
          this._loanModel.Status = result["Status"];
          this._loanModel.PreparedByUser = result["PreparedByUser"];
          this._loanModel.CheckedByUser = result["CheckedByUser"];
          this._loanModel.ApprovedByUser = result["ApprovedByUser"];
          this._loanModel.CreatedByUser = result["CreatedByUser"];
          this._loanModel.CreatedDateTime = result["CreatedDateTime"];
          this._loanModel.UpdatedByUser = result["UpdatedByUser"];
          this._loanModel.UpdatedDateTime = result["UpdatedDateTime"];
          this._loanModel.IsLocked = result["IsLocked"];
          this.GetLoanPaymentListData(result["Id"]);
        }

        this.isProgressBarHidden = false;

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
    this._loanPaymentCListSubscription = (await this._portalEmployeeService.LoanPayments(loanId)).subscribe(
      (response: any) => {
        var results = response;
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

  activeTab() { }

}
