// Angular Modules
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// Routing Module
import { SoftwareRoutingModule } from './software-routing.module';
import { SoftwareRoutingActivate } from './software-routing.activate';

// Material
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

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
    DTRDetailComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    SoftwareRoutingModule,
    MatToolbarModule,
    MatSidenavModule,
    MatIconModule,
    MatButtonModule,
    MatListModule,
    MatCardModule,
    MatMenuModule,
    MatExpansionModule,
    FlexLayoutModule,
    WjGridModule,
    WjGridFilterModule,
    MatProgressBarModule,
    MatButtonToggleModule,
    MatFormFieldModule,
    MatInputModule
  ],
  providers: [
    SoftwareRoutingActivate
  ]
})
export class SoftwareModule { }
