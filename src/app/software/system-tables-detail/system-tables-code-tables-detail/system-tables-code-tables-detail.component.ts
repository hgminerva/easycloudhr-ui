import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-system-tables-code-tables-detail',
  templateUrl: './system-tables-code-tables-detail.component.html',
  styleUrls: ['./system-tables-code-tables-detail.component.css']
})
export class SystemTablesCodeTablesDetailComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<SystemTablesCodeTablesDetailComponent>,
    @Inject(MAT_DIALOG_DATA) public caseData: any
  ) { }

  public title = '';
  public tableCode: any = [];

  async ngOnInit() {
    this.title = this.caseData.objDialogTitle;
    this.tableCode = await this.caseData.objData;
    console.log(this.tableCode);
  }

  public Close(): void {
    this.dialogRef.close({ event: 'Close' });
  }

  public Save(): void {
    if (this.title == 'Add Table Code') {
      this.dialogRef.close({ event: 'Add', objData: this.tableCode });
    } else {
      this.dialogRef.close({ event: 'Edit', objData: this.tableCode });

    }
  }
}
