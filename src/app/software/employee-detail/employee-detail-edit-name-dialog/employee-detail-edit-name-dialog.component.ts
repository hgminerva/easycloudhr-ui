import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-employee-detail-edit-name-dialog',
  templateUrl: './employee-detail-edit-name-dialog.component.html',
  styleUrls: ['./employee-detail-edit-name-dialog.component.css']
})
export class EmployeeDetailEditNameDialogComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<EmployeeDetailEditNameDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public caseData: any
  ) { }

  public title = '';
  public objEmployeeDetail: any = [];

  ngOnInit(): void {
    this.title = this.caseData.objDialogTitle;
    this.objEmployeeDetail = this.caseData.objEmployeeName;
  }

  public Close(): void {
    this.dialogRef.close({ event: 'Close' });
  }

  public async Save() {
    await this.dialogRef.close({ event: 'Save', objEmployeeName: this.objEmployeeDetail });
  }
}
