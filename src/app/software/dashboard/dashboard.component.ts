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

  public moduleOvertimeList: boolean = false;
  public moduleOvertimeDetail: boolean = false;

  public moduleOthers: boolean = false;

  ngOnInit(): void {
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

    if (this.softwareSecurityService.openModule("Overtime List") == true) {
      this.moduleOvertimeList = true;
    }

    if (this.softwareSecurityService.openModule("Overtime Detail") == true) {
      this.moduleOvertimeDetail = true;
    }

    if (this.softwareSecurityService.openModule("Others") == true) {
      this.moduleOthers = true;
    }
  }


}
