import { Component, OnInit } from '@angular/core';
import { SoftwareSecurityService } from './../software-security/software-security.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  constructor(
    private softwareSecurityService: SoftwareSecurityService
  ) { }

  public moduleDashBoard: boolean = false;
  public moduleUserList: boolean = false;
  public moduleEmployeeList: boolean = false;
  public moduleCompanyList: boolean = false;
  public moduleSystemTables: boolean = false;
  public moduleDTR: boolean = false;
  public moduleDTRList: boolean = false;
  public moduleDTRDetail: boolean = false;

  public moduleShiftList: boolean = false;
  public moduleShiftDetail: boolean = false;

  public moduleChangeShiftList: boolean = false;
  public moduleChangeShiftDetail: boolean = false;

  public moduleLeaveApplicationList: boolean = false;
  public moduleLeaveApplicationDetail: boolean = false;

  public moduleOvertimeApplicationList: boolean = false;
  public moduleOvertimeApplicationDetail: boolean = false;

  public moduleOtherIncomeList: boolean = false;
  public moduleOtherDeductionList: boolean = false;
  public moduleLoanList: boolean = false;
  public moduleMandatory: boolean = false;

  public modulePayroll: boolean = false;
  public modulePayrollList: boolean = false;
  public modulePayrollDetail: boolean = false;
  public modulePayrollOtherDeductionList: boolean = false;
  public modulePayrollOtherDeductionDetail: boolean = false;
  public modulePayrollOtherIncomeList: boolean = false;
  public modulePayrollOtherIncomeDetail: boolean = false;
  public moduleMandatoryListList: boolean = false;
  public moduleMandatoryDetail: boolean = false;

  public moduleYearList: boolean = false;

  public moduleOthers: boolean = false;

  async ngOnInit() {
    await this.softwareSecurityService.getUserRights();

    await setTimeout(() => {
      if (this.softwareSecurityService.openModule("Dashboard") == true) {
        this.moduleDashBoard = true;
      }

      if (this.softwareSecurityService.openModule("User List") == true) {
        this.moduleUserList = true;
      }

      if (this.softwareSecurityService.openModule("Employee List") == true) {
        this.moduleEmployeeList = true;
      }

      if (this.softwareSecurityService.openModule("Company List") == true) {
        this.moduleCompanyList = true;
      }

      if (this.softwareSecurityService.openModule("System Tables") == true) {
        this.moduleSystemTables = true;
      }

      if (this.softwareSecurityService.openModule("DTR") == true) {
        this.moduleDTR = true;
      }

      if (this.softwareSecurityService.openModule("DTR List") == true) {
        this.moduleDTRList = true;
      }

      if (this.softwareSecurityService.openModule("DTR Detail") == true) {
        this.moduleDTRDetail = true;
      }

      if (this.softwareSecurityService.openModule("Shift List") == true) {
        this.moduleShiftList = true;
      }

      if (this.softwareSecurityService.openModule("Shift Detail") == true) {
        this.moduleShiftDetail = true;
      }

      if (this.softwareSecurityService.openModule("Change Shift List") == true) {
        this.moduleChangeShiftList = true;
      }

      if (this.softwareSecurityService.openModule("Change Shift Detail") == true) {
        this.moduleChangeShiftDetail = true;
      }

      if (this.softwareSecurityService.openModule("Leave Application List") == true) {
        this.moduleLeaveApplicationList = true;
      }

      if (this.softwareSecurityService.openModule("Leave Application Detail") == true) {
        this.moduleLeaveApplicationDetail = true;
      }

      if (this.softwareSecurityService.openModule("Overtime Application List") == true) {
        this.moduleOvertimeApplicationList = true;
      }

      if (this.softwareSecurityService.openModule("Overtime Application Detail") == true) {
        this.moduleOvertimeApplicationDetail = true;
      }

      if (this.softwareSecurityService.openModule("Payroll Other Income List") == true) {
        this.modulePayrollOtherIncomeList = true;
      }

      if (this.softwareSecurityService.openModule("Payroll Other Deduction List") == true) {
        this.modulePayrollOtherDeductionList = true;
      }

      if (this.softwareSecurityService.openModule("Mandatory") == true) {
        this.moduleMandatory = true;
      }

      if (this.softwareSecurityService.openModule("Loan List") == true) {
        this.moduleLoanList = true;
      }

      if (this.softwareSecurityService.openModule("Payroll") == true) {
        this.modulePayroll = true;
      }

      if (this.softwareSecurityService.openModule("Payroll List") == true) {
        this.modulePayrollList = true;
      }

      if (this.softwareSecurityService.openModule("Year List") == true) {
        this.moduleYearList = true;
      }

      if (this.softwareSecurityService.openModule("Others") == true) {
        this.moduleOthers = true;
      }
    }, 300);
  }
}
