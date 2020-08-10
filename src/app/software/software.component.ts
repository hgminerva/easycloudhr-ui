import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';
import { Router } from '@angular/router';
import { MatExpansionPanelHeader } from '@angular/material/expansion/expansion-panel-header';
import { SoftwareSecurityService } from './software-security/software-security.service';

import { UserListService } from './user-list/user-list.service';
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


  @ViewChild("logoutPanelHeader") logoutPanelHeader: MatExpansionPanelHeader;
  public currentUserName: string = localStorage.getItem('username');

  public logOut(): void {
    this.logoutPanelHeader._toggle();

    localStorage.removeItem('access_token');
    localStorage.removeItem('expires_in');
    localStorage.removeItem('token_type');
    localStorage.removeItem('username');

    setTimeout(() => {
      location.reload();
    }, 500);
  }

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

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }
}
