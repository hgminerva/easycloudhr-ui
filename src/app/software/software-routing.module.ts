// Angular Modules
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Router
import { SoftwareRoutingActivate } from './software-routing.activate';

// Components
import { SoftwareComponent } from './software.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CompanyListComponent } from './company-list/company-list/company-list.component';
import { CompanyDetailComponent } from './company-detail/company-detail/company-detail.component';
import { EmployeeListComponent } from './employee-list/employee-list/employee-list.component';
import { EmployeeDetailComponent } from './employee-detail/employee-detail/employee-detail.component';
import { MandatoryTablesListComponent } from './mandatory-tables-list/mandatory-tables-list/mandatory-tables-list.component';
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
import { SystemTalesListComponent } from './system-tables-list/system-tales-list/system-tales-list.component';
import { YearListComponent } from './year-list/year-list/year-list.component';
import { YearDetialComponent } from './year-detail/year-detial/year-detial.component';
import { LoanListComponent } from './loan-list/loan-list/loan-list.component';
import { PayrollOtherIncomeListComponent } from './payroll-other-income-list/payroll-other-income-list/payroll-other-income-list.component';
import { PayrollOtherIncomeDetailComponent } from './payroll-other-income-detail/payroll-other-income-detail/payroll-other-income-detail.component';
import { PayrollOtherDeductionListComponent } from './payroll-other-deduction-list/payroll-other-deduction-list/payroll-other-deduction-list.component';
import { PayrollOtherDeductionDetailComponent } from './payroll-other-deduction-detail/payroll-other-deduction-detail/payroll-other-deduction-detail.component';
import { PayrollListComponent } from './payroll-list/payroll-list/payroll-list.component';
import { PayrollDetailComponent } from './payroll-detail/payroll-detail/payroll-detail.component';
import { PortalEmployeeComponent } from './portal-employee/portal-employee/portal-employee.component';
import { TaxExemptionListComponent } from './tax-exemption-list/tax-exemption-list/tax-exemption-list.component';
import { TaxExemptionDetailComponent } from './tax-exemption-detail/tax-exemption-detail/tax-exemption-detail.component';
import { MandatoryReportComponent } from './report/mandatory-report/mandatory-report.component';
import { DemographicsComponent } from './report/demographics/demographics.component';
import { PayrollWorkSheetComponent } from './report/payroll-work-sheet/payroll-work-sheet.component';
import { PayrollOtherDeductionReportComponent } from './report/payroll-other-deduction-report/payroll-other-deduction-report.component';
import { PayrollOtherIncomeReportComponent } from './report/payroll-other-income-report/payroll-other-income-report.component';
import { CompanyJournalVoucherComponent } from './report/company-journal-voucher/company-journal-voucher.component';
import { MonthlyWithholdingTaxComponent } from './report/monthly-withholding-tax/monthly-withholding-tax.component';
import { SssLoanComponent } from './report/sss-loan/sss-loan.component';
import { AtmBankReportComponent } from './report/atm-bank-report/atm-bank-report.component';
import { PayslipReportComponent } from './report/payslip-report/payslip-report.component';
import { LoanSummaryComponent } from './report/loan-summary/loan-summary.component';
import { PayrollOtherIncomePayslipComponent } from './report/payroll-other-income-payslip/payroll-other-income-payslip.component';
import { LoanDeductionReportComponent } from './report/loan-deduction-report/loan-deduction-report.component';
import { HdmfLoanReportComponent } from './report/hdmf-loan-report/hdmf-loan-report.component';
import { SssCalamityLoanComponent } from './report/sss-calamity-loan/sss-calamity-loan.component';
import { LeaveReportsComponent } from './report/leave-reports/leave-reports.component';
import { TardinessReportComponent } from './report/tardiness-report/tardiness-report.component';
import { AbsentReportComponent } from './report/absent-report/absent-report.component';

const routes: Routes = [
  {
    path: '', canActivate: [SoftwareRoutingActivate], component: SoftwareComponent,
    children: [
      { path: '', canActivate: [SoftwareRoutingActivate], component: DashboardComponent },
      { path: 'dashboard', canActivate: [SoftwareRoutingActivate], component: DashboardComponent },
      { path: 'company-list', canActivate: [SoftwareRoutingActivate], component: CompanyListComponent },
      { path: 'company-detail/:id', canActivate: [SoftwareRoutingActivate], component: CompanyDetailComponent },
      { path: 'employee-list', canActivate: [SoftwareRoutingActivate], component: EmployeeListComponent },
      { path: 'employee-detail/:id', canActivate: [SoftwareRoutingActivate], component: EmployeeDetailComponent },
      { path: 'mandatory-tables', canActivate: [SoftwareRoutingActivate], component: MandatoryTablesListComponent },
      { path: 'shift-code-list', canActivate: [SoftwareRoutingActivate], component: ShiftCodeListComponent },
      { path: 'shift-code-detail/:id', canActivate: [SoftwareRoutingActivate], component: ShiftCodeDetailComponent },
      { path: 'year-list', canActivate: [SoftwareRoutingActivate], component: YearListComponent },
      { path: 'year-detail/:id', canActivate: [SoftwareRoutingActivate], component: YearDetialComponent },
      { path: 'day-type-list', canActivate: [SoftwareRoutingActivate], component: DayTypeListComponent },
      { path: 'day-type-detail/:id', canActivate: [SoftwareRoutingActivate], component: DayTypeDetailComponent },
      { path: 'other-income', canActivate: [SoftwareRoutingActivate], component: OtherIncomeComponent },
      { path: 'other-deductions', canActivate: [SoftwareRoutingActivate], component: OtherDeductionsComponent },
      { path: 'user-list', canActivate: [SoftwareRoutingActivate], component: UserListComponent },
      { path: 'user-detail/:id', canActivate: [SoftwareRoutingActivate], component: UserDetailComponent },
      { path: 'leave-credits-list', canActivate: [SoftwareRoutingActivate], component: LeaveCreditsListComponent },
      { path: 'leave-credits-detail/:id', canActivate: [SoftwareRoutingActivate], component: LeaveCreditsDetailComponent },
      { path: 'change-shift-code-list', canActivate: [SoftwareRoutingActivate], component: ChangeShiftCodeListComponent },
      { path: 'change-shift-code-detail/:id', canActivate: [SoftwareRoutingActivate], component: ChangeShiftCodeDetailComponent },
      { path: 'change-shift-code-detail', canActivate: [SoftwareRoutingActivate], component: ChangeShiftCodeDetailComponent },
      { path: 'leave-application-list', canActivate: [SoftwareRoutingActivate], component: LeaveApplicationListComponent },
      { path: 'leave-application-detail/:id', canActivate: [SoftwareRoutingActivate], component: LeaveApplicationDetailComponent },
      { path: 'overtime-application-list', canActivate: [SoftwareRoutingActivate], component: OvertimeApplicationListComponent },
      { path: 'overtime-application-detail/:id', canActivate: [SoftwareRoutingActivate], component: OvertimeApplicationDetailComponent },
      { path: 'dtr-list', canActivate: [SoftwareRoutingActivate], component: DTRListComponent },
      { path: 'dtr-detail/:id', canActivate: [SoftwareRoutingActivate], component: DTRDetailComponent },
      { path: 'system-tables-list', canActivate: [SoftwareRoutingActivate], component: SystemTalesListComponent },
      { path: 'loan-list', canActivate: [SoftwareRoutingActivate], component: LoanListComponent },
      { path: 'payroll-list', canActivate: [SoftwareRoutingActivate], component: PayrollListComponent },
      { path: 'payroll-detail/:id', canActivate: [SoftwareRoutingActivate], component: PayrollDetailComponent },
      { path: 'payroll-other-income-list', canActivate: [SoftwareRoutingActivate], component: PayrollOtherIncomeListComponent },
      { path: 'payroll-other-income-detail/:id', canActivate: [SoftwareRoutingActivate], component: PayrollOtherIncomeDetailComponent },
      { path: 'payroll-other-deduction-list', canActivate: [SoftwareRoutingActivate], component: PayrollOtherDeductionListComponent },
      { path: 'payroll-other-deduction-detail/:id', canActivate: [SoftwareRoutingActivate], component: PayrollOtherDeductionDetailComponent },
      { path: 'portal-employee', canActivate: [SoftwareRoutingActivate], component: PortalEmployeeComponent },
      { path: 'tax-exemption-list', canActivate: [SoftwareRoutingActivate], component: TaxExemptionListComponent },
      { path: 'tax-exemption-detail/:id', canActivate: [SoftwareRoutingActivate], component: TaxExemptionDetailComponent },
      { path: 'report-mandatory', canActivate: [SoftwareRoutingActivate], component: MandatoryReportComponent },
      { path: 'report-demographics', canActivate: [SoftwareRoutingActivate], component: DemographicsComponent },
      { path: 'report-payroll-work-sheet', canActivate: [SoftwareRoutingActivate], component: PayrollWorkSheetComponent },
      { path: 'report-payroll-other-deduction', canActivate: [SoftwareRoutingActivate], component: PayrollOtherDeductionReportComponent },
      { path: 'report-payroll-other-income', canActivate: [SoftwareRoutingActivate], component: PayrollOtherIncomeReportComponent },
      { path: 'report-company-journal-voucher', canActivate: [SoftwareRoutingActivate], component: CompanyJournalVoucherComponent },
      { path: 'report-month-withholding-tax', canActivate: [SoftwareRoutingActivate], component: MonthlyWithholdingTaxComponent },
      { path: 'report-sss-loan', canActivate: [SoftwareRoutingActivate], component: SssLoanComponent },
      { path: 'report-sss-calamity-loan', canActivate: [SoftwareRoutingActivate], component: SssCalamityLoanComponent },
      { path: 'atm-bank-report', canActivate: [SoftwareRoutingActivate], component: AtmBankReportComponent },
      { path: 'payslip-report', canActivate: [SoftwareRoutingActivate], component: PayslipReportComponent },
      { path: 'loan-summary-report', canActivate: [SoftwareRoutingActivate], component: LoanSummaryComponent },
      { path: 'payroll-other-income-payslip', canActivate: [SoftwareRoutingActivate], component: PayrollOtherIncomePayslipComponent },
      { path: 'loan-deduction-report', canActivate: [SoftwareRoutingActivate], component: LoanDeductionReportComponent },
      { path: 'hdmf-loan-report', canActivate: [SoftwareRoutingActivate], component: HdmfLoanReportComponent },
      { path: 'leave-reports', canActivate: [SoftwareRoutingActivate], component: LeaveReportsComponent },
      { path: 'tardiness-reports', canActivate: [SoftwareRoutingActivate], component: TardinessReportComponent },
      { path: 'absent-reports', canActivate: [SoftwareRoutingActivate], component: AbsentReportComponent },
    
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SoftwareRoutingModule { }
