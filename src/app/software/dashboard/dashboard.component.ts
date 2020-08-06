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
  public moduleDTR: boolean = false;
  public moduleDTRList: boolean = false;
  public moduleDTRDetail: boolean = false;
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

    if (this.softwareSecurityService.openModule("DTR") == true) {
      this.moduleDTR = true;
    }

    if (this.softwareSecurityService.openModule("DTR List") == true) {
      this.moduleDTRList = true;
    }

    if (this.softwareSecurityService.openModule("DTR Detail") == true) {
      this.moduleDTRDetail = true;
    }

    if (this.softwareSecurityService.openModule("Others") == true) {
      this.moduleOthers = true;
    }
  }


}
