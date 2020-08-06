// Angular Modules
import { NgModule } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Routing Module
import { SoftwareRoutingModule } from './software-routing.module';
import { SoftwareRoutingActivate } from './software-routing.activate';

// Material
import { MaterialModule } from './software-material';

// Flex Layout
import { FlexLayoutModule } from '@angular/flex-layout';

// Wijmo Flex Grid
import * as wjGrid from '@grapecity/wijmo.angular2.grid';
import { WjGridModule } from '@grapecity/wijmo.angular2.grid';
import { WjGridFilterModule } from '@grapecity/wijmo.angular2.grid.filter';

// Components
import { SoftwareComponent } from './software.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CompanyListComponent } from './company-list/company-list/company-list.component';
import { CompanyDetailComponent } from './company-detail/company-detail/company-detail.component';
import { EmployeeListComponent } from './employee-list/employee-list/employee-list.component';
import { EmployeeDetailComponent } from './employee-detail/employee-detail/employee-detail.component';
import { MandatoryTablesComponent } from './mandatory-tables/mandatory-tables/mandatory-tables.component';
import { ShiftCodeListComponent } from './shift-code-list/shift-code-list/shift-code-list.component';
import { ShiftCodeDetailComponent } from './shift-code-detail/shift-code-detail/shift-code-detail.component';
import { DayTypeListComponent } from './day-type-list/day-type-list/day-type-list.component';
import { DayTypeDetailComponent } from './day-type-detail/day-type-detail/day-type-detail.component';
import { OtherIncomeComponent } from './other-income/other-income/other-income.component';
import { OtherDeductionsComponent } from './other-deductions/other-deductions/other-deductions.component';
import { UserListComponent } from './user-list/user-list/user-list.component';
import { UserDetailComponent } from './user-detail/user-detail/user-detail.component';
import { LeaveCreditsListComponent } from './leave-credits-list/leave-credits-list/leave-credits-list.component';
import { LeaveCreditsDetailComponent } from './leave-credits-detail/leave-credits-detail/leave-credits-detail.component';
import { ChangeShiftCodeListComponent } from './change-shift-code-list/change-shift-code-list/change-shift-code-list.component';
import { ChangeShiftCodeDetailComponent } from './change-shift-code-detail/change-shift-code-detail/change-shift-code-detail.component';
import { LeaveApplicationListComponent } from './leave-application-list/leave-application-list/leave-application-list.component';
import { LeaveApplicationDetailComponent } from './leave-application-detail/leave-application-detail/leave-application-detail.component';
import { OvertimeApplicationListComponent } from './overtime-application-list/overtime-application-list/overtime-application-list.component';
import { OvertimeApplicationDetailComponent } from './overtime-application-detail/overtime-application-detail/overtime-application-detail.component';
import { DTRListComponent } from './DTR-list/DTR-list/DTR-list.component';
import { DTRDetailComponent } from './DTR-detail/DTR-detail/DTR-detail.component';
import { UserRegistrationDialogComponent } from './user-list/user-registration-dialog/user-registration-dialog.component';
import { SnackBarTemplate } from './shared/snack-bar-template';
import { DeleteDialogBoxComponent } from './shared/delete-dialog-box/delete-dialog-box.component';
import { SystemTalesListComponent } from './system-tables-list/system-tales-list/system-tales-list.component';
import { SystemTablesTaxExemptionDetailComponent } from './system-tables-detail/system-tables-tax-exemption-detail/system-tables-tax-exemption-detail.component';
import { SystemTablesCodeTablesDetailComponent } from './system-tables-detail/system-tables-code-tables-detail/system-tables-code-tables-detail.component';
import { UserDetailUserModuleDialogComponent } from './user-detail/user-detail-user-module-dialog/user-detail-user-module-dialog.component';
import { UserDetailUserPayrollGroupDialogComponent } from './user-detail/user-detail-user-payroll-group-dialog/user-detail-user-payroll-group-dialog.component';
import { EmployeeDetailEditNameDialogComponent } from './employee-detail/employee-detail-edit-name-dialog/employee-detail-edit-name-dialog.component';
import { EmployeeDetialLinkToUsernameDialogComponent } from './employee-detail/employee-detial-link-to-username-dialog/employee-detial-link-to-username-dialog.component';
import { DtrDetialDtrLineDetailDialogComponent } from './DTR-detail/dtr-detial-dtr-line-detail-dialog/dtr-detial-dtr-line-detail-dialog.component';

@NgModule({
  declarations: [
    SoftwareComponent,
    DashboardComponent,
    CompanyListComponent,
    CompanyDetailComponent,
    EmployeeListComponent,
    EmployeeDetailComponent,
    MandatoryTablesComponent,
    ShiftCodeListComponent,
    ShiftCodeDetailComponent,
    DayTypeListComponent,
    DayTypeDetailComponent,
    OtherIncomeComponent,
    OtherDeductionsComponent,
    UserListComponent,
    UserDetailComponent,
    LeaveCreditsListComponent,
    LeaveCreditsDetailComponent,
    ChangeShiftCodeListComponent,
    ChangeShiftCodeDetailComponent,
    LeaveApplicationListComponent,
    LeaveApplicationDetailComponent,
    OvertimeApplicationListComponent,
    OvertimeApplicationDetailComponent,
    DTRListComponent,
    DTRDetailComponent,
    UserRegistrationDialogComponent,
    DeleteDialogBoxComponent,
    SystemTalesListComponent,
    SystemTablesTaxExemptionDetailComponent,
    SystemTablesCodeTablesDetailComponent,
    UserDetailUserModuleDialogComponent,
    UserDetailUserPayrollGroupDialogComponent,
    EmployeeDetailEditNameDialogComponent,
    EmployeeDetialLinkToUsernameDialogComponent,
    DtrDetialDtrLineDetailDialogComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SoftwareRoutingModule,
    MaterialModule,
    FlexLayoutModule,
    WjGridModule,
    WjGridFilterModule,
  ],
  providers: [
    SoftwareRoutingActivate,
    UserRegistrationDialogComponent,
    DeleteDialogBoxComponent,
    SnackBarTemplate,
    DecimalPipe
  ]
})
export class SoftwareModule { }
