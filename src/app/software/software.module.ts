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

import { DatePipe } from '@angular/common';

import { NgxDocViewerModule } from 'ngx-doc-viewer';

// Components
import { SoftwareComponent } from './software.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CompanyListComponent } from './company-list/company-list/company-list.component';
import { CompanyDetailComponent } from './company-detail/company-detail/company-detail.component';
import { EmployeeListComponent } from './employee-list/employee-list/employee-list.component';
import { EmployeeDetailComponent } from './employee-detail/employee-detail/employee-detail.component';
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
import { DTRListComponent } from './dtr-list-new/dtr-list/dtr-list.component';
import { DTRDetailComponent } from './dtr-detail-new/dtr-detail/dtr-detail.component';
import { UserRegistrationDialogComponent } from './user-list/user-registration-dialog/user-registration-dialog.component';
import { SnackBarTemplate } from './shared/snack-bar-template';
// import { DeleteDialogBoxComponent } from './shared/delete-dialog-box/delete-dialog-box.component';
import { SystemTalesListComponent } from './system-tables-list/system-tales-list/system-tales-list.component';
import { SystemTablesCodeTablesDetailComponent } from './system-tables-detail/system-tables-code-tables-detail/system-tables-code-tables-detail.component';
import { UserDetailUserModuleDialogComponent } from './user-detail/user-detail-user-module-dialog/user-detail-user-module-dialog.component';
import { UserDetailUserPayrollGroupDialogComponent } from './user-detail/user-detail-user-payroll-group-dialog/user-detail-user-payroll-group-dialog.component';
import { EmployeeDetailEditNameDialogComponent } from './employee-detail/employee-detail-edit-name-dialog/employee-detail-edit-name-dialog.component';
import { EmployeeDetialLinkToUsernameDialogComponent } from './employee-detail/employee-detial-link-to-username-dialog/employee-detial-link-to-username-dialog.component';
import { DtrDetialDtrLineDetailDialogComponent } from './dtr-detail-new/dtr-detial-dtr-line-detail-dialog/dtr-detial-dtr-line-detail-dialog.component';
import { DtrDetailDtrLineAddDialogComponent } from './dtr-detail-new/dtr-detail-dtr-line-add-dialog/dtr-detail-dtr-line-add-dialog.component';
import { ShiftCodeDetialShiftLineComponent } from './shift-code-detail/shift-code-detial-shift-line/shift-code-detial-shift-line.component';
import { ChangeShiftCodeLineDetailComponent } from './change-shift-code-detail/change-shift-code-line-detail/change-shift-code-line-detail.component';
import { LeaveApplicationLineDetailComponent } from './leave-application-detail/leave-application-line-detail/leave-application-line-detail.component';
import { OvertimeApplicationLineDialogComponent } from './overtime-application-detail/overtime-application-line-dialog/overtime-application-line-dialog.component';
import { EmployeeListPickDialogComponent } from './shared/employee-list-pick-dialog/employee-list-pick-dialog.component';
import { YearListComponent } from './year-list/year-list/year-list.component';
import { YearDetialComponent } from './year-detail/year-detial/year-detial.component';
import { YearDateDialogComponent } from './year-detail/year-date-dialog/year-date-dialog.component';
import { OtherIncodeDetailDialogComponent } from './other-income/other-incode-detail-dialog/other-incode-detail-dialog.component';
import { OtherDeductionDetailDialogComponent } from './other-deductions/other-deduction-detail-dialog/other-deduction-detail-dialog.component';
import { PayrollDetailComponent } from './payroll-detail/payroll-detail/payroll-detail.component';
import { PayrollListComponent } from './payroll-list/payroll-list/payroll-list.component';
import { PayrollOtherDeductionDetailComponent } from './payroll-other-deduction-detail/payroll-other-deduction-detail/payroll-other-deduction-detail.component';
import { PayrollOtherDeductionListComponent } from './payroll-other-deduction-list/payroll-other-deduction-list/payroll-other-deduction-list.component';
import { PayrollOtherIncomeDetailComponent } from './payroll-other-income-detail/payroll-other-income-detail/payroll-other-income-detail.component';
import { PayrollOtherIncomeListComponent } from './payroll-other-income-list/payroll-other-income-list/payroll-other-income-list.component';
import { LoanListComponent } from './loan-list/loan-list/loan-list.component';
import { LoanDetailDialogComponent } from './loan-list/loan-detail-dialog/loan-detail-dialog.component';
import { PayrollOtherIncomeLineDialogComponent } from './payroll-other-income-detail/payroll-other-income-line-dialog/payroll-other-income-line-dialog.component';
import { PayrollOtherDeductionLineDialogComponent } from './payroll-other-deduction-detail/payroll-other-deduction-line-dialog/payroll-other-deduction-line-dialog.component';
import { PayrollLineDetailDialogComponent } from './payroll-detail/payroll-line-detail-dialog/payroll-line-detail-dialog.component';
import { MandatoryTablesListComponent } from './mandatory-tables-list/mandatory-tables-list/mandatory-tables-list.component';
import { MandatoryTablesDetailMandatoryBirDetailComponent } from './mandatory-tables-detail/mandatory-tables-detail-mandatory-bir-detail/mandatory-tables-detail-mandatory-bir-detail.component';
import { MandatoryTablesDetailMandatoryHdmfDetailComponent } from './mandatory-tables-detail/mandatory-tables-detail-mandatory-hdmf-detail/mandatory-tables-detail-mandatory-hdmf-detail.component';
import { MandatoryTablesDetailMandatoryPhicDetailComponent } from './mandatory-tables-detail/mandatory-tables-detail-mandatory-phic-detail/mandatory-tables-detail-mandatory-phic-detail.component';
import { MandatoryTablesDetailMandatorySssDetailComponent } from './mandatory-tables-detail/mandatory-tables-detail-mandatory-sss-detail/mandatory-tables-detail-mandatory-sss-detail.component';
import { PortalEmployeeComponent } from './portal-employee/portal-employee/portal-employee.component';
import { EmployeeDetailEmployeeMemoComponent } from './employee-detail/employee-detail-employee-memo/employee-detail-employee-memo.component';
import { PortalEmployeeLeaveApplicationDialogComponent } from './portal-employee/portal-employee-leave-application-dialog/portal-employee-leave-application-dialog.component';
import { PortalEmployeeOvertimeApplicationDialogComponent } from './portal-employee/portal-employee-overtime-application-dialog/portal-employee-overtime-application-dialog.component';
import { PortalEmployeeLoanDialogComponent } from './portal-employee/portal-employee-loan-dialog/portal-employee-loan-dialog.component';
import { PortalEmployeeDtrDialogComponent } from './portal-employee/portal-employee-dtr-dialog/portal-employee-dtr-dialog.component';
import { PortalEmployeePayrollDialogComponent } from './portal-employee/portal-employee-payroll-dialog/portal-employee-payroll-dialog.component';
import { YearDateAddToBranchesDialogComponent } from './year-detail/year-date-add-to-branches-dialog/year-date-add-to-branches-dialog.component';
import { UserChangePasswordDialogComponent } from './shared/user-change-password-dialog/user-change-password-dialog.component';
import { DtrDetailImportDtrLogsComponent } from './dtr-detail-new/dtr-detail-import-dtr-logs/dtr-detail-import-dtr-logs.component';
import { GenericDropdownDialogComponent } from './shared/generic-dropdown-dialog/generic-dropdown-dialog.component';
import { PdfDialogComponent } from './shared/pdf-dialog/pdf-dialog.component';
import { ComfirmMassageDialogComponent } from './shared/comfirm-massage-dialog/comfirm-massage-dialog.component';
import { TaxExemptionListComponent } from './tax-exemption-list/tax-exemption-list/tax-exemption-list.component';
import {TaxExemptionDetailComponent} from './tax-exemption-detail/tax-exemption-detail/tax-exemption-detail.component';
import { TaxExemptionTableDialogComponent } from './tax-exemption-detail/tax-exemption-table-dialog/tax-exemption-table-dialog.component';
import { YearLeaveCreditsDialogComponent } from './year-detail/year-leave-credits-dialog/year-leave-credits-dialog.component';
import { MandatoryReportComponent } from './report/mandatory-report/mandatory-report.component';
import { DemographicsComponent } from './report/demographics/demographics.component';
import { CompanyDetailApproverComponent } from './company-detail/company-detail-approver/company-detail-approver.component';
import { PortalEmployeeApproverDialogComponent } from './portal-employee/portal-employee-approver-dialog/portal-employee-approver-dialog.component';
import { PayrollWorkSheetComponent } from './report/payroll-work-sheet/payroll-work-sheet.component';
import { PayrollOtherDeductionReportComponent } from './report/payroll-other-deduction-report/payroll-other-deduction-report.component';
import { PayrollOtherIncomeReportComponent } from './report/payroll-other-income-report/payroll-other-income-report.component';
import { CompanyJournalVoucherComponent } from './report/company-journal-voucher/company-journal-voucher.component';
import { MonthlyWithholdingTaxComponent } from './report/monthly-withholding-tax/monthly-withholding-tax.component';
import { SssLoanComponent } from './report/sss-loan/sss-loan.component';
import { AtmBankReportComponent } from './report/atm-bank-report/atm-bank-report.component';
import { AddPayrollOtherIncomeDialogComponent } from './payroll-other-income-detail/add-payroll-other-income-dialog/add-payroll-other-income-dialog.component';

@NgModule({
  declarations: [
    SoftwareComponent,
    DashboardComponent,
    CompanyListComponent,
    CompanyDetailComponent,
    EmployeeListComponent,
    EmployeeDetailComponent,
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
    SystemTalesListComponent,
    SystemTablesCodeTablesDetailComponent,
    UserDetailUserModuleDialogComponent,
    UserDetailUserPayrollGroupDialogComponent,
    EmployeeDetailEditNameDialogComponent,
    EmployeeDetialLinkToUsernameDialogComponent,
    DtrDetialDtrLineDetailDialogComponent,
    DtrDetailDtrLineAddDialogComponent,
    ShiftCodeDetialShiftLineComponent,
    ChangeShiftCodeLineDetailComponent,
    LeaveApplicationLineDetailComponent,
    OvertimeApplicationLineDialogComponent,
    EmployeeListPickDialogComponent,
    YearListComponent,
    YearDetialComponent,
    YearDateDialogComponent,
    OtherIncodeDetailDialogComponent,
    OtherDeductionDetailDialogComponent,
    LoanListComponent,
    PayrollDetailComponent,
    PayrollListComponent,
    PayrollOtherDeductionDetailComponent,
    PayrollOtherDeductionListComponent,
    PayrollOtherIncomeDetailComponent,
    PayrollOtherIncomeListComponent,
    LoanDetailDialogComponent,
    PayrollOtherIncomeLineDialogComponent,
    PayrollOtherDeductionLineDialogComponent,
    PayrollLineDetailDialogComponent,
    MandatoryTablesListComponent,
    MandatoryTablesDetailMandatoryBirDetailComponent,
    MandatoryTablesDetailMandatoryHdmfDetailComponent,
    MandatoryTablesDetailMandatoryPhicDetailComponent,
    MandatoryTablesDetailMandatorySssDetailComponent,
    PortalEmployeeComponent,
    EmployeeDetailEmployeeMemoComponent,
    PortalEmployeeLeaveApplicationDialogComponent,
    PortalEmployeeOvertimeApplicationDialogComponent,
    PortalEmployeeLoanDialogComponent,
    PortalEmployeeDtrDialogComponent,
    PortalEmployeePayrollDialogComponent,
    YearDateAddToBranchesDialogComponent,
    UserChangePasswordDialogComponent,
    DtrDetailImportDtrLogsComponent,
    GenericDropdownDialogComponent,
    PdfDialogComponent,
    ComfirmMassageDialogComponent,
    TaxExemptionListComponent,
    TaxExemptionDetailComponent,
    TaxExemptionTableDialogComponent,
    YearLeaveCreditsDialogComponent,
    MandatoryReportComponent,
    DemographicsComponent,
    CompanyDetailApproverComponent,
    PortalEmployeeApproverDialogComponent,
    PayrollWorkSheetComponent,
    PayrollOtherDeductionReportComponent,
    PayrollOtherIncomeReportComponent,
    CompanyJournalVoucherComponent,
    MonthlyWithholdingTaxComponent,
    SssLoanComponent,
    AtmBankReportComponent,
    AddPayrollOtherIncomeDialogComponent
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
    NgxDocViewerModule
  ],
  providers: [
    SoftwareRoutingActivate,
    UserRegistrationDialogComponent,
    ComfirmMassageDialogComponent,
    EmployeeListPickDialogComponent,
    SnackBarTemplate,
    DecimalPipe,
    DatePipe,
  ]
})
export class SoftwareModule { }
