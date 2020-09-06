import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-payroll-detail-compute-confirm-dialog',
  templateUrl: './payroll-detail-compute-confirm-dialog.component.html',
  styleUrls: ['./payroll-detail-compute-confirm-dialog.component.css']
})
export class PayrollDetailComputeConfirmDialogComponent implements OnInit {

  constructor(
    public comfirmMessageDialogRef: MatDialogRef<PayrollDetailComputeConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public caseData: any
  ) { }

  public title = 'Delete Message Box';
  public confirmationMessage = 'Delete this item?';

  ngOnInit(): void {
    this.title = this.caseData.objDialogTitle;
    this.confirmationMessage = this.caseData.objComfirmationMessage;
  }

  public ConfirmMessageNO(): void {
    this.comfirmMessageDialogRef.close({ message: 'No' });
  }

  public ConfirmMessageYes(): void {
    this.comfirmMessageDialogRef.close({ message: 'Yes' });
  }

}
