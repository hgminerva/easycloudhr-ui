import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SoftwareSecurityService {

  constructor() { }

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
}
