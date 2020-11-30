import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DecimalPipe } from '@angular/common';
import { CompanyApproverModel } from '../company-approver.model';
import { CompanyDetialService } from '../company-detial.service';
import { SnackBarTemplate } from '../../shared/snack-bar-template';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-company-detail-approver',
  templateUrl: './company-detail-approver.component.html',
  styleUrls: ['./company-detail-approver.component.css']
})
export class CompanyDetailApproverComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<CompanyDetailApproverComponent>,
    @Inject(MAT_DIALOG_DATA) public caseData: any,
    private companyDetialService: CompanyDetialService,
    private snackBar: MatSnackBar,
    private snackBarTemplate: SnackBarTemplate,
  ) { }

  public title = '';
  public _approver: CompanyApproverModel = new CompanyApproverModel();
  public isSpinnerShow: boolean = true;
  public isContentShow: boolean = false;

  public dialogTitle: string = this.caseData.objDialogTitle;
  public dialogData: any = this.caseData.objData;
  public dialogType: any = this.caseData.objDialogType;
  public dialogReturnData: any = null;

  private _saveApproverSubscription: any;
  private _userDropdownListSubscription: any;

  public stillProcessing: boolean = false;

  public userListDropdown: any = [];
  public branchListDropdown: any = [];

  public async getUserDropdownListData() {
    (await this.companyDetialService.UserList()).subscribe(
      data => {
        if (data["length"] > 0) {
          this.userListDropdown = data;
        }
        this.getBranchDropdownListData();
      }
    );
  }

  public async getBranchDropdownListData() {
    (await this.companyDetialService.BranchList()).subscribe(
      data => {
        if (data["length"] > 0) {
          this.branchListDropdown = data;
        }
        this.getApproverDetail();
      }
    );
  }

  public getApproverDetail() {
    setTimeout(() => {
      console.log(this.dialogData);
      this._approver = this.dialogData;
      this.isSpinnerShow = false;
      this.isContentShow = true;
    }, 500);
  }

  async ngOnInit() {
    this.getUserDropdownListData();
  }

  public async Save() {
    if (this.dialogType == "Add") {
      console.log(this._approver);
      this._saveApproverSubscription = (await this.companyDetialService.AddApprover(this._approver)).subscribe(
        response => {
          this._approver.Id = response[1];
          this.dialogReturnData = 200;
          this.dialogType = "Edit";
          this.snackBarTemplate.snackBarSuccess(this.snackBar, "Added Successfully");
          if (this._saveApproverSubscription != null) this._saveApproverSubscription.unsubscribe();
        },
        error => {
          this.snackBarTemplate.snackBarError(this.snackBar, error.error + " " + " Status Code: " + error.status);
          if (this._saveApproverSubscription != null) this._saveApproverSubscription.unsubscribe();
        }
      );
    } else if (this.dialogType == "Edit") {
      this._saveApproverSubscription = (await this.companyDetialService.SaveApprover(this._approver.Id, this._approver)).subscribe(
        response => {
          this.dialogReturnData = 200;
          this.snackBarTemplate.snackBarSuccess(this.snackBar, "Save Successfully");
        },
        error => {
          this.snackBarTemplate.snackBarError(this.snackBar, error.error + " " + " Status Code: " + error.status);
          if (this._saveApproverSubscription != null) this._saveApproverSubscription.unsubscribe();
        }
      );
    }
  }

  public Close(): void {
    this.dialogRef.close(this.dialogReturnData);
  }

}
