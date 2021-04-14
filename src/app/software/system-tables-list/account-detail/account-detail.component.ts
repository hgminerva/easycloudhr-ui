import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-account-detail',
  templateUrl: './account-detail.component.html',
  styleUrls: ['./account-detail.component.css']
})
export class AccountDetailComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<AccountDetailComponent>,
    @Inject(MAT_DIALOG_DATA) public caseData: any
  ) { }

  public title = '';
  public accountData: any = [];

  async ngOnInit() {
    this.title = this.caseData.objDialogTitle;

    this.accountData.Id = this.caseData.objData.Id;
    this.accountData.AccountCode = this.caseData.objData.AccountCode;
    this.accountData.AccountName = this.caseData.objData.AccountName;
    this.accountData.Description = this.caseData.objData.Description;
  }

  public Close(): void {
    this.dialogRef.close({ event: 'Close' });
  }

  public Save(): void {
    if (this.title == 'Add Account') {
      this.dialogRef.close({ event: 'Add', objData: this.accountData });
    } else {
      this.dialogRef.close({ event: 'Edit', objData: this.accountData });
    }
  }

}
