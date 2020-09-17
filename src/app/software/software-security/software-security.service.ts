import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppSettings } from './../software-appsettings';

export interface userModule {
  Module: number,
  CanOpen: boolean,
  CanAdd: boolean,
  CanEdit: boolean,
  CanDelete: boolean,
  CanLock: boolean,
  CanUnlock: boolean,
  CanPrint: boolean,
}

@Injectable({
  providedIn: 'root'
})
export class SoftwareSecurityService {

  constructor(
    private appSettings: AppSettings,
    private httpClient: HttpClient
  ) { }

  public async getUserRights() {
    let userRights = new Array();
    await this.httpClient.get(this.appSettings.defaultAPIURLHost + "/api/security/user/right/module/list", this.appSettings.defaultOptions).subscribe(
      response => {
        var results = response;
        if (results["length"] > 0) {
          for (var i = 0; i <= results["length"] - 1; i++) {
            userRights.push({
              Id: results[i].Id,
              UserId: results[i].UserId,
              ModuleId: results[i].ModuleId,
              Module: results[i].Module,
              CanOpen: results[i].CanOpen,
              CanAdd: results[i].CanAdd,
              CanEdit: results[i].CanEdit,
              CanDelete: results[i].CanDelete,
              CanLock: results[i].CanLock,
              CanUnlock: results[i].CanUnlock,
              CanPrint: results[i].CanPrint
            });
          }
          localStorage.setItem('userRights', JSON.stringify(userRights));
        }
      }
    );
  }

  public openModule(module: string): boolean {
    let openFlag = false;
    if (localStorage.getItem("userRights") != null) {
      try {
        let userRights = JSON.parse(localStorage.getItem("userRights"));
        for (var i = 0; i <= userRights.length - 1; i++) {
          if (userRights[i].Module === module) {
            openFlag = true;
          }
        }
      } catch (e) {
        console.log(e);
      }
    }
    return openFlag;
  }

  public GetModuleRights(module: string): any[] {
    let objModule: any = [];
    if (localStorage.getItem("userRights") != null) {
      try {
        let userRights = JSON.parse(localStorage.getItem("userRights"));
        for (var i = 0; i <= userRights.length - 1; i++) {
          if (userRights[i].Module === module) {
            objModule = userRights[i];
            break;
          }
        }
      } catch (e) {
        console.log(e);
      }
    }
    return objModule;
  }

  public openGroupModule(module: string) {
    let openFlag = false;
    if (localStorage.getItem("user") != null) {
      try {
        let userRights = localStorage.getItem("userRights");

        if (module === "Dashboard") {
          openFlag = true;
        } else if (module === "User List") {
          openFlag = true;
        } else if (module === "User Detail") {
          openFlag = true;
        } else if (module === "Employee List") {
          openFlag = true;
        } else if (module === "Employee Detail") {
          openFlag = true;
        } else if (module === "Compnay List") {
          openFlag = true;
        } else if (module === "Compnay Detail") {
          openFlag = true;
        } else {
          openFlag = false;
        }
      } catch (e) {
        console.log(e);
      }
    }
    return openFlag;
  }

  public isEmployeePortalOnly() {
    let openFlag = false;
    if (localStorage.getItem("userRights") != null) {
      try {
        let userRights = JSON.parse(localStorage.getItem("userRights"));
        if (userRights["length"] === 2) {
          console.log(userRights["length"]);
          console.log(userRights);
          if (userRights[0].Module == 'Employee Portal' && userRights[1].Module == 'Portal') {
            openFlag = true;
          }

          if (userRights[0].Module == 'Employee Portal') {
            openFlag = true;
          }
        }
      } catch (e) {
        console.log(e);
      }
    }
    return openFlag;
  }
}
