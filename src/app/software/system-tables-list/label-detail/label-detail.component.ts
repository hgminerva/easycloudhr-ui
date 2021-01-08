import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-label-detail',
  templateUrl: './label-detail.component.html',
  styleUrls: ['./label-detail.component.css']
})
export class LabelDetailComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<LabelDetailComponent>,
    @Inject(MAT_DIALOG_DATA) public caseData: any
  ) { }

  public title = '';
  public labelData: any = [];

  async ngOnInit() {
    this.title = this.caseData.objDialogTitle;

    this.labelData.Id = this.caseData.objData.Id;
    this.labelData.Code = this.caseData.objData.Code;
    this.labelData.Label = this.caseData.objData.Label;
    this.labelData.DisplayedLabel = this.caseData.objData.DisplayedLabel;
  }

  public Close(): void {
    this.dialogRef.close({ event: 'Close' });
  }

  public Save(): void {
    if (this.title == 'Add Label') {
      this.dialogRef.close({ event: 'Add', objData: this.labelData });
    } else {
      this.dialogRef.close({ event: 'Edit', objData: this.labelData });
    }
  }
}
