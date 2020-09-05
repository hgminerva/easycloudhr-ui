import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';

import { EmployeeDetailService } from './../employee-detail.service';
import { SnackBarTemplate } from '../../shared/snack-bar-template';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-employee-detail-employee-memo',
  templateUrl: './employee-detail-employee-memo.component.html',
  styleUrls: ['./employee-detail-employee-memo.component.css']
})
export class EmployeeDetailEmployeeMemoComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<EmployeeDetailEmployeeMemoComponent>,
    @Inject(MAT_DIALOG_DATA) public caseData: any,
    private datePipe: DatePipe,
    private employeeDetailService: EmployeeDetailService,
    private snackBar: MatSnackBar,
    private snackBarTemplate: SnackBarTemplate,
  ) { }

  public title = '';
  public AttachmentFile = '';

  public _employeeMemo: any = [];
  public uploadFileSub: any = [];
  public UIDate: Date = new Date();

  private payrollTypeDropdownSubscription: any;
  public fileTypeListDropdown: any = [];

  public isHiddenComponent: boolean = false;
  public isHiddenMemoCode: boolean = false;
  public isUploadButtonDisable: boolean = true;

  async ngOnInit() {
    this.title = this.caseData.objDialogTitle;
    this.GetPayrollTypeDropdownListData();
  }

  public Close(): void {
    // this.dialogRef.close({ event: 'Close' });
  }

  // =================
  // File Type Dropdown
  // ==================
  private async GetPayrollTypeDropdownListData() {
    this.isHiddenComponent = true;
    this.payrollTypeDropdownSubscription = await (await this.employeeDetailService.DocTypeList()).subscribe(
      response => {
        this.fileTypeListDropdown = response;
        this._employeeMemo.AttachmentType = response[0].Value;
        this.loadMemoDetail();
        if (this.payrollTypeDropdownSubscription !== null) this.payrollTypeDropdownSubscription.unsubscribe();
      },
      error => {
        this.snackBarTemplate.snackBarError(this.snackBar, error.error.Message + " " + error.status);
        if (this.payrollTypeDropdownSubscription !== null) this.payrollTypeDropdownSubscription.unsubscribe();
      }
    );
  }

  public loadMemoDetail() {
    this._employeeMemo.Id = this.caseData.objData.Id;

    this._employeeMemo.MemoCode = this.caseData.objData.MemoCode
    this._employeeMemo.EmployeeId = this.caseData.objData.EmployeeId
    this._employeeMemo.MemoDate = this.caseData.objData.MemoDate;
    this.UIDate = new Date(this.caseData.objData.MemoDate);
    this._employeeMemo.Particulars = this.caseData.objData.Particulars;
    this._employeeMemo.AttachmentURL = this.caseData.objData.AttachmentURL;
    console.log();
    if (this._employeeMemo.Id !== 0) {
      this._employeeMemo.AttachmentType = this.caseData.objData.AttachmentType;
    }

    setTimeout(() => {
      this.isHiddenComponent = false;
    }, 100);
  }

  public Save(): void {
    if (this.title == 'Add Memo') {
      this.dialogRef.close({ event: 'Add', objData: this._employeeMemo });
    } else {
      this.dialogRef.close({ event: 'Edit', objData: this._employeeMemo });
    }
  }

  public GetUIDate() {
    this._employeeMemo.MemoDate = this.datePipe.transform(this.UIDate, 'yyyy-MM-dd');
  }

  checkAttachmentDetail() {

  }

  public DocumentFileOnChange() {
    if (this.AttachmentFile !== '') {
      this.isUploadButtonDisable = false;
    } else {
      this.isUploadButtonDisable = true;
    }
  }

  public async btnUploadFile() {
    let btnUploadFile: Element = document.getElementById("btnUploadFile");
    btnUploadFile.setAttribute("disabled", "disabled");

    let inputFileImage = document.getElementById("inputFileUpload") as HTMLInputElement;

    if (inputFileImage.files.length > 0) {

      this.uploadFileSub = (await this.employeeDetailService.uploadMemoFile(inputFileImage.files[0], this._employeeMemo.AttachmentURL)).subscribe(
        response => {
          this._employeeMemo.AttachmentURL = response;
          this.isUploadButtonDisable = true;
          if (this.payrollTypeDropdownSubscription !== null) this.payrollTypeDropdownSubscription.unsubscribe();
        },
        error => {
          this.isUploadButtonDisable = true;
          this.snackBarTemplate.snackBarError(this.snackBar, error.error.Message + " " + error.status);
          if (this.payrollTypeDropdownSubscription !== null) this.payrollTypeDropdownSubscription.unsubscribe();
        }
      );
    } else {
      btnUploadFile.removeAttribute("disabled");
    }
  }

  ViewDocumentUrl() {
    window.open(this._employeeMemo.AttachmentURL);
  }
}
