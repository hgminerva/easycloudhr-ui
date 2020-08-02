import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackBarTemplate } from '../../shared/snack-bar-template';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { EmployeeDetailService } from './../employee-detail.service';
import { EmployeeModel, EmployeePayrollModel, EmployeeHRModel } from './../employee.model';
import { SoftwareSecurityService } from '../../software-security/software-security.service';
import { EmployeeDetailEditNameDialogComponent } from '../employee-detail-edit-name-dialog/employee-detail-edit-name-dialog.component';
import { EmployeeDetialLinkToUsernameDialogComponent } from '../employee-detial-link-to-username-dialog/employee-detial-link-to-username-dialog.component';
@Component({
  selector: 'app-employee-detail',
  templateUrl: './employee-detail.component.html',
  styleUrls: ['./employee-detail.component.css']
})
export class EmployeeDetailComponent implements OnInit {

  private userRightEmployeeDetail: any = null;

  constructor(
    private activatedRoute: ActivatedRoute,
    private snackBar: MatSnackBar,
    private snackBarTemplate: SnackBarTemplate,
    private employeeDetailService: EmployeeDetailService,
    private softwareSecurityService: SoftwareSecurityService,
    private editNameDialog: MatDialog,
    private lickToUserNameDialog: MatDialog

  ) { }

  async ngOnInit() {
    await this.GetZipCodeListData();
    if (this.softwareSecurityService.openModule("Employee Detail") == true) {
    }

    this.userRightEmployeeDetail = this.softwareSecurityService.GetModuleRights("Employee Detail");
  }


  public employeePayrollModel: EmployeePayrollModel = {
    Id: 0,
    EmployeeId: 0,
    PayrollGroup: '',
    PayrollType: '',
    PayrollRate: 0,
    MonthlyRate: 0,
    DailyRate: 0,
    HourlyRate: 0,
    AbsentDailyRate: 0,
    LateHourlyRate: 0,
    UndertimeHourlyRate: 0,
    OvertimeHourlyRate: 0,
    NightDifferentialRate: 0,
    SSSAddOnAmount: 0,
    SSSComputationType: '',
    HDMFAddOnAmount: 0,
    HDMFComputationType: '',
    TaxTable: '',
    TaxExemptionId: 0,
    IsMinimumWageEarner: true,
    CostOfLivingAllowance: 0,
    AdditionalAllowance: 0,
    ATMAccountNumber: '',
    SSSNumber: '',
    HDMFNumber: '',
    PHICNumber: '',
    TIN: '',
  }

  public employeeHRModel: EmployeeHRModel = {
    Id: 0,
    EmployeeId: 0,
    DateHired: new Date(),
    DateRegular: new Date(),
    DateResigned: new Date(),
    Branch: '',
    Division: '',
    Department: '',
    Position: '',
    DefaultShiftId: '',
  }

  public employeeModel: EmployeeModel = {
    Id: 0,
    EmployeeCode: '',
    IdNumber: 0,
    BiometricIdNumber: '',
    LastName: '',
    FirstName: '',
    MiddleName: '',
    ExtensionName: '',
    FullName: '',
    Address: '',
    ZipCode: '',
    ContactNumber: '',
    ContactMobileNumber: '',
    EmailAddress: '',
    DateOfBirth: new Date(),
    PlaceOfBirth: '',
    Sex: '',
    CivilStatus: '',
    Citizenship: '',
    Height: '',
    Weight: '',
    BloodType: '',
    Remarks: '',
    PictureURL: 'https://filbrokerstorage.blob.core.windows.net/crm-easyfis/3d225df6-aba5-40e7-9cb9-e8e97ee76762',
    CompanyId: 0,
    UserId: 0,
    Username: '',
    CreatedByUserId: 0,
    CreatedByUser: '',
    CreatedDateTime: new Date(),
    UpdatedByUserId: 0,
    UpdatedByUser: '',
    UpdatedDateTime: new Date(),
    IsLocked: false,
    EmployeePayroll: new EmployeePayrollModel,
    EmployeeHR: new EmployeeHRModel
  }

  public isLocked: boolean = false;
  public isProgressBarHidden: boolean = false;

  public isDataLoaded: boolean = false;
  private employeeDetailSubscription: any;
  private uploadPhotoSubscription: any;

  private saveEmployeeDetailSubscription: any;
  private lockEmployeeDetailSubscription: any;
  private unlockEmployeeDetailSubscription: any;

  public btnSaveDisabled: boolean = true;
  public btnLockisabled: boolean = true;
  public btnUnlockDisabled: boolean = true;

  @ViewChild('tabGroup') tabGroup;

  // =================
  // Employee Dropdown
  // =================
  private zipCodeDropdownSubscription: any;
  public zipCodeListDropdown: any = [];

  private genderDropdownSubscription: any;
  public genderListDropdown: any = [];

  private civilStatusDropdownSubscription: any;
  public civilStatusListDropdown: any = [];

  private citizenshipDropdownSubscription: any;
  public citizenshipListDropdown: any = [];

  private bloodTypeDropdownSubscription: any;
  public bloodTypeListDropdown: any = [];

  private companyDropdownSubscription: any;
  public companyListDropdown: any = [];

  private userDropdownSubscription: any;
  public userListDropdown: any = [];

  // ========================
  // EmployeePayroll Dropdown
  // ========================
  private payrollGroupDropdownSubscription: any;
  public payrollGroupListDropdown: any = [];

  private payrollTypeDropdownSubscription: any;
  public payrollTypeListDropdown: any = [];

  private taxTableDropdownSubscription: any;
  public taxTableListDropdown: any = [];

  private taxExemptionDropdownSubscription: any;
  public taxExemptionListDropdown: any = [];
  // =================== 
  // EmployeeHR Dropdown
  // =================== 
  private branchDropdownSubscription: any;
  public branchListDropdown: any = [];

  private divisionDropdownSubscription: any;
  public divisionListDropdown: any = [];

  private departmentDropdownSubscription: any;
  public departmentListDropdown: any = [];

  private positionDropdownSubscription: any;
  public positionListDropdown: any = [];

  private shiftDropdownSubscription: any;
  public shiftDropdown: any = [];

  // =================
  // Employee Dropdown
  // =================
  private async GetZipCodeListData() {
    this.zipCodeDropdownSubscription = await (await this.employeeDetailService.ZipCodeList()).subscribe(
      response => {
        this.zipCodeListDropdown = response;
        this.GetGenderListData();
        if (this.zipCodeDropdownSubscription !== null) this.zipCodeDropdownSubscription.unsubscribe();
      },
      error => {
        this.snackBarTemplate.snackBarError(this.snackBar, error.error.Message + " " + error.status);
        if (this.zipCodeDropdownSubscription !== null) this.zipCodeDropdownSubscription.unsubscribe();
      }
    );
  }

  private async GetGenderListData() {
    this.genderDropdownSubscription = await (await this.employeeDetailService.GenderList()).subscribe(
      response => {
        this.genderListDropdown = response;
        this.GetCivilStatusListData();
        if (this.genderDropdownSubscription !== null) this.genderDropdownSubscription.unsubscribe();
      },
      error => {
        this.snackBarTemplate.snackBarError(this.snackBar, error.error.Message + " " + error.status);
        if (this.genderDropdownSubscription !== null) this.genderDropdownSubscription.unsubscribe();
      }
    );
  }

  private async GetCivilStatusListData() {
    this.civilStatusDropdownSubscription = await (await this.employeeDetailService.CivilStatusList()).subscribe(
      response => {
        this.civilStatusListDropdown = response;
        this.GetCitizenshipListData();
        if (this.civilStatusDropdownSubscription !== null) this.civilStatusDropdownSubscription.unsubscribe();
      },
      error => {
        this.snackBarTemplate.snackBarError(this.snackBar, error.error.Message + " " + error.status);
        if (this.civilStatusDropdownSubscription !== null) this.civilStatusDropdownSubscription.unsubscribe();
      }
    );
  }

  private async GetCitizenshipListData() {
    this.citizenshipDropdownSubscription = await (await this.employeeDetailService.CitizenshipList()).subscribe(
      response => {
        this.citizenshipListDropdown = response;
        this.GetBloodTypeListData();
        if (this.citizenshipDropdownSubscription !== null) this.citizenshipDropdownSubscription.unsubscribe();
      },
      error => {
        this.snackBarTemplate.snackBarError(this.snackBar, error.error.Message + " " + error.status);
        if (this.citizenshipDropdownSubscription !== null) this.citizenshipDropdownSubscription.unsubscribe();
      }
    );
  }

  private async GetBloodTypeListData() {
    this.bloodTypeDropdownSubscription = await (await this.employeeDetailService.BloodTypeList()).subscribe(
      response => {
        this.bloodTypeListDropdown = response;
        this.GetCompanyDropdownListData();
        if (this.bloodTypeDropdownSubscription !== null) this.bloodTypeDropdownSubscription.unsubscribe();
      },
      error => {
        this.snackBarTemplate.snackBarError(this.snackBar, error.error.Message + " " + error.status);
        if (this.bloodTypeDropdownSubscription !== null) this.bloodTypeDropdownSubscription.unsubscribe();
      }
    );

  }

  private async GetCompanyDropdownListData() {
    this.companyDropdownSubscription = await (await this.employeeDetailService.CompanyList()).subscribe(
      response => {
        this.companyListDropdown = response;
        this.GetUserDropdownListData();
        if (this.companyDropdownSubscription !== null) this.companyDropdownSubscription.unsubscribe();
      },
      error => {
        this.snackBarTemplate.snackBarError(this.snackBar, error.error.Message + " " + error.status);
        if (this.companyDropdownSubscription !== null) this.companyDropdownSubscription.unsubscribe();
      }
    );
  }

  private async GetUserDropdownListData() {
    this.userDropdownSubscription = await (await this.employeeDetailService.UserList()).subscribe(
      response => {
        this.userListDropdown = response;
        this.GetEmployeeDetail();
        if (this.userDropdownSubscription !== null) this.userDropdownSubscription.unsubscribe();
      },
      error => {
        this.snackBarTemplate.snackBarError(this.snackBar, error.error.Message + " " + error.status);
        if (this.userDropdownSubscription !== null) this.userDropdownSubscription.unsubscribe();
      }
    );
  }

  // ========================
  // EmployeePayroll Dropdown
  // ========================
  private async GetPayrollTypeDropdownListData() {
    this.payrollTypeDropdownSubscription = await (await this.employeeDetailService.PayrollTypeList()).subscribe(
      response => {
        this.GetPayrollGroupDropdownListData();
        this.payrollTypeListDropdown = response;
        if (this.payrollTypeDropdownSubscription !== null) this.payrollTypeDropdownSubscription.unsubscribe();
      },
      error => {
        this.snackBarTemplate.snackBarError(this.snackBar, error.error.Message + " " + error.status);
        if (this.payrollTypeDropdownSubscription !== null) this.payrollTypeDropdownSubscription.unsubscribe();
      }
    );
  }

  private async GetPayrollGroupDropdownListData() {
    this.payrollGroupDropdownSubscription = await (await this.employeeDetailService.PayrollGroupList()).subscribe(
      response => {
        this.payrollGroupListDropdown = response;
        this.GetTaxTableDropdownListData();
        if (this.payrollGroupDropdownSubscription !== null) this.payrollGroupDropdownSubscription.unsubscribe();
      },
      error => {
        this.snackBarTemplate.snackBarError(this.snackBar, error.error.Message + " " + error.status);
        if (this.payrollGroupDropdownSubscription !== null) this.payrollGroupDropdownSubscription.unsubscribe();
      }
    );
  }

  private async GetTaxTableDropdownListData() {
    this.taxTableDropdownSubscription = await (await this.employeeDetailService.TaxTableList()).subscribe(
      response => {
        this.taxTableListDropdown = response;
        this.GetTaxExemptionDropdownListData();
        if (this.taxTableDropdownSubscription !== null) this.taxTableDropdownSubscription.unsubscribe();
      },
      error => {
        this.snackBarTemplate.snackBarError(this.snackBar, error.error.Message + " " + error.status);
        if (this.taxTableDropdownSubscription !== null) this.taxTableDropdownSubscription.unsubscribe();
      }
    );
  }

  private async GetTaxExemptionDropdownListData() {
    this.taxExemptionDropdownSubscription = await (await this.employeeDetailService.TaxExemptionList()).subscribe(
      response => {
        this.taxExemptionListDropdown = response;
        this.GetBranchDropdownListData();
        if (this.taxExemptionDropdownSubscription !== null) this.taxExemptionDropdownSubscription.unsubscribe();
      },
      error => {
        this.snackBarTemplate.snackBarError(this.snackBar, error.error.Message + " " + error.status);
        if (this.taxExemptionDropdownSubscription !== null) this.taxExemptionDropdownSubscription.unsubscribe();
      }
    );
  }

  // =================== 
  // EmployeeHR Dropdown
  // =================== 
  private async GetBranchDropdownListData() {
    this.branchDropdownSubscription = await (await this.employeeDetailService.BranchList()).subscribe(
      response => {
        this.branchListDropdown = response;
        this.GetDivisionDropdownListData();
        if (this.branchDropdownSubscription !== null) this.branchDropdownSubscription.unsubscribe();
      },
      error => {
        this.snackBarTemplate.snackBarError(this.snackBar, error.error.Message + " " + error.status);
        if (this.branchDropdownSubscription !== null) this.branchDropdownSubscription.unsubscribe();
      }
    );
  }

  private async GetDivisionDropdownListData() {
    this.divisionDropdownSubscription = await (await this.employeeDetailService.DivisionList()).subscribe(
      response => {
        this.divisionListDropdown = response;
        this.GetDepartmentDropdownListData();
        if (this.divisionDropdownSubscription !== null) this.divisionDropdownSubscription.unsubscribe();
      },
      error => {
        this.snackBarTemplate.snackBarError(this.snackBar, error.error.Message + " " + error.status);
        if (this.divisionDropdownSubscription !== null) this.divisionDropdownSubscription.unsubscribe();
      }
    );
  }

  private async GetDepartmentDropdownListData() {
    this.departmentDropdownSubscription = await (await this.employeeDetailService.DepartmentList()).subscribe(
      response => {
        this.departmentListDropdown = response;
        this.GetPositionDropdownListData();
        if (this.departmentDropdownSubscription !== null) this.departmentDropdownSubscription.unsubscribe();
      },
      error => {
        this.snackBarTemplate.snackBarError(this.snackBar, error.error.Message + " " + error.status);
        if (this.departmentDropdownSubscription !== null) this.departmentDropdownSubscription.unsubscribe();
      }
    );
  }

  private async GetPositionDropdownListData() {
    this.positionDropdownSubscription = await (await this.employeeDetailService.PList()).subscribe(
      response => {
        this.positionListDropdown = response;
        this.GetShiftDropdownListData();
        if (this.positionDropdownSubscription !== null) this.positionDropdownSubscription.unsubscribe();
      },
      error => {
        this.snackBarTemplate.snackBarError(this.snackBar, error.error.Message + " " + error.status);
        if (this.positionDropdownSubscription !== null) this.positionDropdownSubscription.unsubscribe();
      }
    );
  }

  private async GetShiftDropdownListData() {
    this.shiftDropdownSubscription = await (await this.employeeDetailService.ShiftList()).subscribe(
      response => {
        this.shiftDropdown = response;
        if (this.shiftDropdownSubscription !== null) this.shiftDropdownSubscription.unsubscribe();
      },
      error => {
        this.snackBarTemplate.snackBarError(this.snackBar, error.error.Message + " " + error.status);
        if (this.shiftDropdownSubscription !== null) this.shiftDropdownSubscription.unsubscribe();
      }
    );
  }

  // =============== 
  // Employee Detail
  // =============== 
  private async GetEmployeeDetail() {
    this.disableButtons();
    let id = 0;
    this.isProgressBarHidden = true;
    this.activatedRoute.params.subscribe(params => { id = params["id"]; });

    this.employeeDetailSubscription = await (await this.employeeDetailService.EmployeeDetail(id)).subscribe(
      response => {
        let result = response;
        if (result != null) {
          this.employeeModel.Id = result["Id"];
          this.employeeModel.EmployeeCode = result["EmployeeCode"];
          this.employeeModel.IdNumber = result["IdNumber"];
          this.employeeModel.BiometricIdNumber = result["BiometricIdNumber"];
          this.employeeModel.LastName = result["LastName"];
          this.employeeModel.FirstName = result["FirstName"];
          this.employeeModel.MiddleName = result["MiddleName"];
          this.employeeModel.ExtensionName = result["ExtensionName"];
          this.employeeModel.FullName = result["FullName"];
          this.employeeModel.Address = result["Address"];
          this.employeeModel.ZipCode = result["ZipCode"];
          this.employeeModel.ContactNumber = result["ContactNumber"];
          this.employeeModel.ContactMobileNumber = result["ContactMobileNumber"];
          this.employeeModel.EmailAddress = result["EmailAddress"];
          this.employeeModel.DateOfBirth = new Date(result["DateOfBirth"]);
          this.employeeModel.PlaceOfBirth = result["PlaceOfBirth"];
          this.employeeModel.Sex = result["Sex"];
          this.employeeModel.CivilStatus = result["CivilStatus"];
          this.employeeModel.Citizenship = result["Citizenship"];
          this.employeeModel.Height = result["Height"];
          this.employeeModel.Weight = result["Weight"];
          this.employeeModel.BloodType = result["BloodType"];
          this.employeeModel.Remarks = result["Remarks"];
          this.employeeModel.PictureURL = result["PictureURL"];
          this.employeeModel.CompanyId = result["CompanyId"];
          this.employeeModel.UserId = result["UserId"];
          this.employeeModel.Username = result["Username"];
          this.employeeModel.CreatedByUserId = result["CreatedByUserId"];
          this.employeeModel.CreatedByUser = result["CreatedByUser"];
          this.employeeModel.CreatedDateTime = new Date(result["CreatedDateTime"]);
          this.employeeModel.UpdatedByUserId = result["UpdatedByUserId"];
          this.employeeModel.UpdatedByUser = result["UpdatedByUser"];
          this.employeeModel.UpdatedDateTime = new Date(result["UpdatedDateTime"]);
          this.employeeModel.IsLocked = result["IsLocked"];
          if (result["EmployeePayroll"] !== null) {
            this.employeeModel.EmployeePayroll = result["EmployeePayroll"];
          } else {
            this.employeeModel.EmployeePayroll = this.employeePayrollModel;
            this.snackBarTemplate.snackBarError(this.snackBar, "Employee Payroll Null");
          }

          if (result["EmployeeHR"] !== null) {
            this.employeeModel.EmployeeHR = result["EmployeeHR"];
            this.employeeModel.EmployeeHR.DateHired = new Date(result["EmployeeHR"].DateHired);
            this.employeeModel.EmployeeHR.DateRegular = new Date(result["EmployeeHR"].DateRegular);
            this.employeeModel.EmployeeHR.DateResigned = new Date(result["EmployeeHR"].DateResigned);
          } else {
            this.employeeModel.EmployeeHR = this.employeeHRModel;
            this.snackBarTemplate.snackBarError(this.snackBar, "Employee HR Null");
          }

        }

        this.loadComponent(result["IsLocked"]);
        this.isProgressBarHidden = false;
        this.isDataLoaded = true;
        if (this.employeeDetailSubscription !== null) this.employeeDetailSubscription.unsubscribe();
      },
      error => {
        this.snackBarTemplate.snackBarError(this.snackBar, error.error.Message + " " + error.status);
        if (this.employeeDetailSubscription !== null) this.employeeDetailSubscription.unsubscribe();
      }
    );

    await this.GetPayrollTypeDropdownListData();
  }


  handleData(data: boolean) {
    this.employeeModel.EmployeePayroll.IsMinimumWageEarner = data;
  }

  public async SaveEmployeeDetail() {
    this.disableButtons();
    if (this.isDataLoaded == true) {
      this.isDataLoaded = false;
      this.saveEmployeeDetailSubscription = await (await this.employeeDetailService.SaveEmployee(this.employeeModel.Id, this.employeeModel)).subscribe(
        response => {
          this.loadComponent(this.employeeModel.IsLocked);
          this.isDataLoaded = true;
          this.snackBarTemplate.snackBarSuccess(this.snackBar, "Save Successfully.");
          if (this.saveEmployeeDetailSubscription !== null) this.saveEmployeeDetailSubscription.unsubscribe();
        },
        error => {
          this.loadComponent(this.employeeModel.IsLocked);
          this.isDataLoaded = true;
          this.snackBarTemplate.snackBarError(this.snackBar, error.error + " " + " Status Code: " + error.status);
          if (this.saveEmployeeDetailSubscription !== null) this.saveEmployeeDetailSubscription.unsubscribe();
        }
      );
    }
  }

  public async LockEmployeeDetail() {
    this.disableButtons();

    if (this.isDataLoaded == true) {
      this.isDataLoaded = false;
      this.lockEmployeeDetailSubscription = await (await this.employeeDetailService.LockEmployee(this.employeeModel.Id, this.employeeModel)).subscribe(
        response => {
          this.loadComponent(true);
          this.isDataLoaded = true;
          this.snackBarTemplate.snackBarSuccess(this.snackBar, "Lock Successfully.");
          if (this.lockEmployeeDetailSubscription !== null) this.lockEmployeeDetailSubscription.unsubscribe();
        },
        error => {
          this.loadComponent(false);
          this.isDataLoaded = true;
          this.snackBarTemplate.snackBarError(this.snackBar, error.error + " " + " Status Code: " + error.status);
          if (this.lockEmployeeDetailSubscription !== null) this.lockEmployeeDetailSubscription.unsubscribe();
        }
      );
    }
  }

  public async UnlockEmployeeDetail() {
    this.disableButtons();

    if (this.isDataLoaded == true) {
      this.isDataLoaded = false;
      this.unlockEmployeeDetailSubscription = await (await this.employeeDetailService.Unlockemployee(this.employeeModel.Id)).subscribe(
        response => {
          this.loadComponent(false);
          this.isDataLoaded = true;
          this.snackBarTemplate.snackBarSuccess(this.snackBar, "Unlock Successfully.");
          if (this.unlockEmployeeDetailSubscription !== null) this.unlockEmployeeDetailSubscription.unsubscribe();
        },
        error => {
          this.loadComponent(true);
          this.isDataLoaded = true;
          this.snackBarTemplate.snackBarError(this.snackBar, error.error + " " + " Status Code: " + error.status);
          if (this.unlockEmployeeDetailSubscription !== null) this.unlockEmployeeDetailSubscription.unsubscribe();
        }
      );
    }
  }


  public async btnUploadImage() {
    let btnUploadPhoto: Element = document.getElementById("btnUploadPhoto");
    btnUploadPhoto.setAttribute("disabled", "disabled");

    let inputFileImage = document.getElementById("inputFileUploadPhoto") as HTMLInputElement;

    this.uploadPhotoSubscription = await (await this.employeeDetailService.uploadFile(inputFileImage.files[0], this.employeeModel.FullName, this.employeeModel.Id)).subscribe(
      (response: any) => {
        this.snackBarTemplate.snackBarSuccess(this.snackBar, "Uploaded Successfully.");
        this.employeeModel.PictureURL = response;
        if (this.uploadPhotoSubscription !== null) this.uploadPhotoSubscription.unsubscribe();
      },
      error => {
        this.isDataLoaded = true;
        btnUploadPhoto.removeAttribute("disabled");
        this.snackBarTemplate.snackBarError(this.snackBar, error.error + " " + " Status Code: " + error.status);
        if (this.uploadPhotoSubscription !== null) this.uploadPhotoSubscription.unsubscribe();
      }
    );
  }


  async activeTab() {
    // console.log(this.tabGroup.selectedIndex);
    // if (this.tabGroup.selectedIndex == 1) {
    //   await this.GetEmployeePayrollDetail();
    // }
  }

  private async loadComponent(isDisable) {
    if (isDisable == true) {
      this.btnSaveDisabled = isDisable;
      this.btnLockisabled = isDisable;
      this.btnUnlockDisabled = !isDisable;
    } else {
      this.btnSaveDisabled = isDisable;
      this.btnLockisabled = isDisable;
      this.btnUnlockDisabled = !isDisable;
    }

    this.isLocked = isDisable;
  }

  private disableButtons() {
    this.btnSaveDisabled = true;
    this.btnLockisabled = true;
    this.btnUnlockDisabled = true;
  }

  public EditEmployeeNameDialog() {
    let objEmployeeFullName: any = {
      LastName: this.employeeModel.LastName,
      FirstName: this.employeeModel.FirstName,
      MiddleName: this.employeeModel.MiddleName,
      ExtensionName: this.employeeModel.ExtensionName
    };
    const matDialogRef = this.editNameDialog.open(EmployeeDetailEditNameDialogComponent, {
      width: '1000px',
      data: {
        objDialogTitle: "Edit Employee Name",
        objEmployeeName: objEmployeeFullName,
      },
      disableClose: true
    });

    matDialogRef.afterClosed().subscribe(data => {
      if (data.event == "Save") {
        this.employeeModel.LastName = data.objEmployeeName.LastName;
        this.employeeModel.FirstName = data.objEmployeeName.FirstName;
        this.employeeModel.MiddleName = data.objEmployeeName.MiddleName;
        this.employeeModel.ExtensionName = data.objEmployeeName.ExtensionName;
      }
    });
  }

  public LinkToUserName() {
    const matDialogRef = this.lickToUserNameDialog.open(EmployeeDetialLinkToUsernameDialogComponent, {
      width: '500px',
      data: {
        objDialogTitle: "Link Username",
      },
      disableClose: true
    });

    matDialogRef.afterClosed().subscribe(data => {
      if (data.event == "Link") {
        this.employeeModel.UserId = data.UserId;
        this.employeeModel.Username = data.Username;
      }
    });
  }

}
