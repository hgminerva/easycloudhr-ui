import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';
import { Router } from '@angular/router';
import { MatExpansionPanelHeader } from '@angular/material/expansion/expansion-panel-header';
import { SoftwareSecurityService } from './software-security/software-security.service';

import { UserListService } from './user-list/user-list.service';
import { MatSidenav } from '@angular/material/sidenav';
@Component({
  selector: 'app-software',
  templateUrl: './software.component.html',
  styleUrls: ['./software.component.css']
})
export class SoftwareComponent implements OnInit {
  public mobileQuery: MediaQueryList;
  private _mobileQueryListener: () => void;

  constructor(
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher,
    private router: Router,
    private userListService: UserListService,
    private softwareSecurityService: SoftwareSecurityService
  ) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }

  @ViewChild('snav') sidenav: MatSidenav;

  // ================
  // Dashboard Module
  // ================
  public moduleDashBoard: boolean = false; // Dashboard

  // ==============
  // Systems Module
  // ==============
  public moduleSystemTables: boolean = false;
  public moduleSettings: boolean = false;
  public moduleSecurity: boolean = false;

  // ===================
  // Master Files Module
  // ===================
  public moduleSetup: boolean = false; // Setup 


  public moduleUserList: boolean = false;
  public moduleEmployeeList: boolean = false;
  public moduleCompanyList: boolean = false;
  public moduleShiftList: boolean = false;
  public moduleShiftDetail: boolean = false;
  public moduleYearList: boolean = false;
  public moduleYearDetail: boolean = false;
  public moduleOtherIncomeList: boolean = false;
  public moduleOtherDeductionList: boolean = false;
  public moduleMandatory: boolean = false;

  // ==================
  // Transaction Module
  // ==================
  public moduleDTR: boolean = false; // DTR

  public moduleDTRList: boolean = false;
  public moduleDTRDetail: boolean = false;
  public moduleChangeShiftList: boolean = false;
  public moduleChangeShiftDetail: boolean = false;
  public moduleLeaveApplicationList: boolean = false;
  public moduleLeaveApplicationDetail: boolean = false;
  public moduleOvertimeList: boolean = false;
  public moduleOvertimeDetail: boolean = false;

  public modulePayroll: boolean = false; // Payroll

  public modulePayrollList: boolean = false;
  public modulePayrollDetail: boolean = false;
  public modulePayrollOtherDeductionList: boolean = false;
  public modulePayrollOtherDeductionDetail: boolean = false;
  public modulePayrollOtherIncomeList: boolean = false;
  public modulePayrollOtherIncomeDetail: boolean = false;
  public moduleLoanList: boolean = false;
  public moduleLoanDetail: boolean = false;

  // =============
  // Portal Module
  // =============
  public modulePortal: boolean = false; // Portal

  public moduleEmployeePortal: boolean = false;

  public moduleOthers: boolean = true;

  public moduleEmployeePortalOnly: boolean = false;

  public isComponentHidden: boolean = false;

  // =============
  // Report Module
  // =============
  public moduleReports: boolean = false;
  public moduleDTRReports: boolean = false;
  public modulePayrollReports: boolean = false;
  public moduleMandatoryReports: boolean = false;
  public moduleBankReports: boolean = false;
  public moduleLeaveReports: boolean = false;
  public moduleLoanReports: boolean = false;
  public moduleDemographicsReports: boolean = false;

  @ViewChild("logoutPanelHeader") logoutPanelHeader: MatExpansionPanelHeader;
  public currentUserName: string = localStorage.getItem('username');

  public logOut(): void {
    this.logoutPanelHeader._toggle();

    localStorage.removeItem('access_token');
    localStorage.removeItem('expires_in');
    localStorage.removeItem('token_type');
    localStorage.removeItem('username');
    localStorage.removeItem('userRights');

    setTimeout(() => {
      location.reload();
    }, 500);
  }

  async ngOnInit() {
    await this.softwareSecurityService.getUserRights();

    await setTimeout(() => {
      if (this.softwareSecurityService.isEmployeePortalOnly() == true) {
        this.moduleEmployeePortalOnly = true;
        this.router.navigate(['/software/portal-employee']);
      } else {

        this.moduleEmployeePortalOnly = false;
        // ==============
        // Systems Module
        // ==============
        if (this.softwareSecurityService.openModule("Settings") == true) {
          this.moduleSettings = true;
        }

        if (this.softwareSecurityService.openModule("Security") == true) {
          this.moduleSecurity = true;
        }

        if (this.softwareSecurityService.openModule("System Tables") == true) {
          this.moduleSystemTables = true;
        }

        // ===================
        // Master Files Module
        // ===================
        if (this.softwareSecurityService.openModule("Setup") == true) {
          this.moduleSetup = true;

        }
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

        if (this.softwareSecurityService.openModule("Shift List") == true) {
          this.moduleShiftList = true;
        }

        if (this.softwareSecurityService.openModule("Shift Detail") == true) {
          this.moduleShiftDetail = true;
        }

        if (this.softwareSecurityService.openModule("Other Income") == true) {
          this.moduleOtherIncomeList = true;
        }

        if (this.softwareSecurityService.openModule("Other Deduction") == true) {
          this.moduleOtherDeductionList = true;
        }

        if (this.softwareSecurityService.openModule("Mandatory") == true) {
          this.moduleMandatory = true;
        }

        if (this.softwareSecurityService.openModule("Year List") == true) {
          this.moduleYearList = true;
        }

        if (this.softwareSecurityService.openModule("Year Detail") == true) {
          this.moduleYearDetail = true;
        }
        // ==================
        // Transaction Module
        // ==================
        if (this.softwareSecurityService.openModule("DTR") == true) {
          this.moduleDTR = true;
        }

        if (this.softwareSecurityService.openModule("DTR List") == true) {
          this.moduleDTRList = true;
        }

        if (this.softwareSecurityService.openModule("DTR Detail") == true) {
          this.moduleDTRDetail = true;
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

        if (this.softwareSecurityService.openModule("Overtime List") == true) {
          this.moduleOvertimeList = true;
        }

        if (this.softwareSecurityService.openModule("Overtime Detail") == true) {
          this.moduleOvertimeDetail = true;
        }

        if (this.softwareSecurityService.openModule("Payroll") == true) {
          this.modulePayroll = true;
        }

        if (this.softwareSecurityService.openModule("Payroll List") == true) {
          this.modulePayrollList = true;
        }

        if (this.softwareSecurityService.openModule("Payroll Detail") == true) {
          this.modulePayrollDetail = true;
        }

        if (this.softwareSecurityService.openModule("Payroll Other Deduction List") == true) {
          this.modulePayrollOtherDeductionList = true;
        }

        if (this.softwareSecurityService.openModule("Payroll Other Deduction Detail") == true) {
          this.modulePayrollOtherDeductionDetail = true;
        }

        if (this.softwareSecurityService.openModule("Payroll Other Income List") == true) {
          this.modulePayrollOtherIncomeList = true;
        }

        if (this.softwareSecurityService.openModule("Payroll Other Income Detail") == true) {
          this.modulePayrollOtherIncomeDetail = true;
        }

        if (this.softwareSecurityService.openModule("Loan List") == true) {
          this.moduleLoanList = true;
        }

        // =============
        // Portal Module
        // =============

        if (this.softwareSecurityService.openModule("Portal") == true) {
          this.modulePortal = true;
        }

        if (this.softwareSecurityService.openModule("Employee Portal") == true) {
          this.moduleEmployeePortal = true;
        }

        if (this.softwareSecurityService.openModule("Others") == true) {
          // this.moduleOthers = true;
        }

        // =============
        // Report Module
        // =============
        if (this.softwareSecurityService.openModule("Reports") == true) {
          this.moduleReports = true;
        }

        if (this.softwareSecurityService.openModule("DTR Reports") == true) {
          this.moduleDTRReports = true;
        }

        if (this.softwareSecurityService.openModule("Payroll Reports") == true) {
          this.modulePayrollReports = true;
        }

        if (this.softwareSecurityService.openModule("Mandatory Reports") == true) {
          this.moduleMandatoryReports = true;
        }

        if (this.softwareSecurityService.openModule("Bank Reports") == true) {
          this.moduleBankReports = true;
        }

        if (this.softwareSecurityService.openModule("Leave Reports") == true) {
          this.moduleLeaveReports = true;
        }

        if (this.softwareSecurityService.openModule("Loan Reports") == true) {
          this.moduleLoanReports = true;
        }

        if (this.softwareSecurityService.openModule("Demographics Reports") == true) {
          this.moduleDemographicsReports = true;
        }
      }
    }, 300);
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }
}
