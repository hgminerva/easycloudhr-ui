import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { EmployeeDetailService } from '../employee-detail.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackBarTemplate } from '../../shared/snack-bar-template';
import { MatListOption } from '@angular/material/list';
import { MatSelectChange } from '@angular/material/select';
import { MatOption } from '@angular/material/core';
@Component({
  selector: 'app-employee-detial-link-to-username-dialog',
  templateUrl: './employee-detial-link-to-username-dialog.component.html',
  styleUrls: ['./employee-detial-link-to-username-dialog.component.css']
})
export class EmployeeDetialLinkToUsernameDialogComponent implements OnInit {

  constructor(
    private employeeDetailService: EmployeeDetailService,
    private snackBar: MatSnackBar,
    private snackBarTemplate: SnackBarTemplate,
    public dialogRef: MatDialogRef<EmployeeDetialLinkToUsernameDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public caseData: any
  ) { }

  ngOnInit(): void {
    this.title = this.caseData.objDialogTitle;
    this.GetUserDropdownListData();
  }

  private userDropdownSubscription: any;
  public userListDropdown: any = [];

  public title = '';
  public UserId = 0;
  public Username = '';

  private async GetUserDropdownListData() {
    this.userDropdownSubscription = await (await this.employeeDetailService.UserList()).subscribe(
      response => {
        this.userListDropdown = response;
        this.UserId = this.userListDropdown[0];
        if (this.userDropdownSubscription !== null) this.userDropdownSubscription.unsubscribe();
      },
      error => {
        this.snackBarTemplate.snackBarError(this.snackBar, error.error.Message + " " + error.status);
        if (this.userDropdownSubscription !== null) this.userDropdownSubscription.unsubscribe();
      }
    );
  }

  selected(event: MatSelectChange) {
    const selectedData = {
      text: (event.source.selected as MatOption).viewValue,
      value: event.source.value
    };

    this.UserId = event.source.value;
    this.Username = (event.source.selected as MatOption).viewValue;
  }

  public Close(): void {
    this.dialogRef.close({ event: 'Close' });
  }

  public async Link() {
    await this.dialogRef.close({ event: 'Link', UserId: this.UserId, Username: this.Username });
  }

}
