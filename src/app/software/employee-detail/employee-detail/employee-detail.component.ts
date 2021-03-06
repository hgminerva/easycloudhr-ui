import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackBarTemplate } from '../../shared/snack-bar-template';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DecimalPipe, DatePipe } from '@angular/common';
import * as wjcGrid from '@grapecity/wijmo.grid';
import * as wjcCore from '@grapecity/wijmo';
import { CollectionView, ObservableArray } from '@grapecity/wijmo';

import { EmployeeDetailService } from './../employee-detail.service';
import { EmployeeModel, EmployeePayrollModel, EmployeeHRModel } from './../employee.model';
import { SoftwareSecurityService, UserModule } from '../../software-security/software-security.service';
import { EmployeeDetailEditNameDialogComponent } from '../employee-detail-edit-name-dialog/employee-detail-edit-name-dialog.component';
import { EmployeeDetialLinkToUsernameDialogComponent } from '../employee-detial-link-to-username-dialog/employee-detial-link-to-username-dialog.component';
import { EmployeeMemoModel } from './../employee-memo.model';
import { EmployeeDetailEmployeeMemoComponent } from '../employee-detail-employee-memo/employee-detail-employee-memo.component';
import { GenericDropdownDialogComponent } from '../../shared/generic-dropdown-dialog/generic-dropdown-dialog.component';
import { ComfirmMassageDialogComponent } from '../../shared/comfirm-massage-dialog/comfirm-massage-dialog.component';
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
    private matDialog: MatDialog,
    private _decimalPipe: DecimalPipe,
    private datePipe: DatePipe,
  ) {
  }

  private _userRightsSubscription: any;
  public _canEdit: boolean = false;
  public _canDelete: boolean = false;

  public userRights: UserModule = {
    Module: "",
    CanOpen: false,
    CanAdd: false,
    CanEdit: false,
    CanDelete: false,
    CanLock: false,
    CanUnlock: false,
    CanPrint: false,
  }

  async ngOnInit() {
    await this.GetUserRights();
  }

  private async GetUserRights() {
    this._userRightsSubscription = await (await this.softwareSecurityService.PageModuleRights("Employee Detail")).subscribe(
      (response: any) => {
        let results = response;
        if (results !== null) {
          this.userRights.Module = results["Module"];
          this.userRights.CanOpen = results["CanOpen"];
          this.userRights.CanAdd = results["CanAdd"];
          this.userRights.CanEdit = results["CanEdit"];
          this.userRights.CanDelete = results["CanDelete"];
          this.userRights.CanLock = results["CanLock"];
          this.userRights.CanUnlock = results["CanUnlock"];
          this.userRights.CanPrint = results["CanPrint"];
        }

        if (this._userRightsSubscription !== null) this._userRightsSubscription.unsubscribe();
      },
      error => {
        this.snackBarTemplate.snackBarError(this.snackBar, error.error.Message + " " + error.status);
        if (this._userRightsSubscription !== null) this._userRightsSubscription.unsubscribe();
      }
    );

    await this.GetZipCodeListData();
  }

  public employeePayrollModel: EmployeePayrollModel = {
    Id: 0,
    EmployeeId: 0,
    PayrollGroup: '',
    PayrollType: '',
    PayrollRate: '',
    MonthlyRate: '',
    DailyRate: '',
    HourlyRate: '',
    AbsentDailyRate: '',
    LateHourlyRate: '',
    UndertimeHourlyRate: '',
    OvertimeHourlyRate: '',
    NightDifferentialRate: '',
    SSSAddOnAmount: '',
    SSSComputationType: '',
    HDMFAddOnAmount: '',
    HDMFComputationType: '',
    TaxTable: '',
    TaxExemptionId: 0,
    IsMinimumWageEarner: true,
    CostOfLivingAllowance: '',
    AdditionalAllowance: '',
    ATMAccountNumber: '',
    SSSNumber: '',
    HDMFNumber: '',
    PHICNumber: '',
    TIN: '',
    AccountId: null,
  }

  public employeeHRModel: EmployeeHRModel = {
    Id: 0,
    EmployeeId: 0,
    DateHired: this.datePipe.transform(new Date(), 'yyyy-MM-dd'),
    DateRegular: this.datePipe.transform(new Date(), 'yyyy-MM-dd'),
    DateResigned: this.datePipe.transform(new Date(), 'yyyy-MM-dd'),
    Branch: '',
    Division: '',
    Department: '',
    Position: '',
    DefaultShiftId: '',
  }

  public UIDateHired = new Date();
  public UIDateRegular = new Date();
  public UIDateResigned = new Date();

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
    CityId: 0,
    City: '',
    ZipCode: '',
    ContactNumber: '',
    ContactMobileNumber: '',
    EmailAddress: '',
    DateOfBirth: this.datePipe.transform(new Date(), 'yyyy-MM-dd'),
    PlaceOfBirth: '',
    Sex: '',
    CivilStatus: '',
    Citizenship: '',
    Height: '',
    Weight: '',
    BloodType: '',
    Religion: '',
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

  public UIDateOfBirth = new Date();

  public isLocked: boolean = false;
  public isComponentsShown: boolean = false;
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

  private cityDropdownSubscription: any;
  public cityListDropdown: any = [];

  private religionDropdownSubscription: any;
  public religionListDropdown: any = [];


  // ========================
  // EmployeePayroll Dropdown
  // ========================
  private payrollGroupDropdownSubscription: any;
  public payrollGroupListDropdown: any = [];

  private payrollTypeDropdownSubscription: any;
  public payrollTypeListDropdown: any = [];

  private sssComputationDropdownSubscription: any;
  public sssComputationListDropdown: any = [];

  private hdmfComputationDropdownSubscription: any;
  public hdmfComputationListDropdown: any = [];

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
        this.GetCityDropdownListData();
        if (this.userDropdownSubscription !== null) this.userDropdownSubscription.unsubscribe();
      },
      error => {
        this.snackBarTemplate.snackBarError(this.snackBar, error.error.Message + " " + error.status);
        if (this.userDropdownSubscription !== null) this.userDropdownSubscription.unsubscribe();
      }
    );
  }

  private async GetCityDropdownListData() {
    this.cityDropdownSubscription = await (await this.employeeDetailService.CityList()).subscribe(
      response => {
        this.cityListDropdown = response;
        this.GetReligionDropdownListData();
        if (this.cityDropdownSubscription !== null) this.cityDropdownSubscription.unsubscribe();
      },
      error => {
        this.snackBarTemplate.snackBarError(this.snackBar, error.error.Message + " " + error.status);
        if (this.cityDropdownSubscription !== null) this.cityDropdownSubscription.unsubscribe();
      }
    );
  }

  private async GetReligionDropdownListData() {
    this.religionDropdownSubscription = await (await this.employeeDetailService.ReligionList()).subscribe(
      response => {
        this.religionListDropdown = response;
        this.GetPayrollTypeDropdownListData();
        if (this.religionDropdownSubscription !== null) this.religionDropdownSubscription.unsubscribe();
      },
      error => {
        this.snackBarTemplate.snackBarError(this.snackBar, error.error.Message + " " + error.status);
        if (this.religionDropdownSubscription !== null) this.religionDropdownSubscription.unsubscribe();
      }
    );
  }

  // ========================
  // EmployeePayroll Dropdown
  // ========================
  private async GetPayrollTypeDropdownListData() {
    this.payrollTypeDropdownSubscription = await (await this.employeeDetailService.PayrollTypeList()).subscribe(
      response => {
        this.GetAccountDropdownListData();
        this.payrollTypeListDropdown = response;
        if (this.payrollTypeDropdownSubscription !== null) this.payrollTypeDropdownSubscription.unsubscribe();
      },
      error => {
        this.snackBarTemplate.snackBarError(this.snackBar, error.error.Message + " " + error.status);
        if (this.payrollTypeDropdownSubscription !== null) this.payrollTypeDropdownSubscription.unsubscribe();
      }
    );
  }
  public accountDropdownSubscription: any;
  public accountListDropdown: any;
  private async GetAccountDropdownListData() {
    this.accountDropdownSubscription = await (await this.employeeDetailService.AccountList()).subscribe(
      response => {
        this.GetPayrollGroupDropdownListData();
        this.accountListDropdown = response;
        if (this.accountDropdownSubscription !== null) this.accountDropdownSubscription.unsubscribe();
      },
      error => {
        this.snackBarTemplate.snackBarError(this.snackBar, error.error.Message + " " + error.status);
        if (this.accountDropdownSubscription !== null) this.accountDropdownSubscription.unsubscribe();
      }
    );
  }

  private async GetPayrollGroupDropdownListData() {
    this.payrollGroupDropdownSubscription = await (await this.employeeDetailService.PayrollGroupList()).subscribe(
      response => {
        this.payrollGroupListDropdown = response;
        this.SSSComputationDropdownListData();
        if (this.payrollGroupDropdownSubscription !== null) this.payrollGroupDropdownSubscription.unsubscribe();
      },
      error => {
        this.snackBarTemplate.snackBarError(this.snackBar, error.error.Message + " " + error.status);
        if (this.payrollGroupDropdownSubscription !== null) this.payrollGroupDropdownSubscription.unsubscribe();
      }
    );
  }

  private async SSSComputationDropdownListData() {
    this.sssComputationDropdownSubscription = await (await this.employeeDetailService.SSSComputationList()).subscribe(
      response => {
        this.sssComputationListDropdown = response;
        this.HDMFComputationDropdownListData();
        if (this.sssComputationDropdownSubscription !== null) this.sssComputationDropdownSubscription.unsubscribe();
      },
      error => {
        this.snackBarTemplate.snackBarError(this.snackBar, error.error.Message + " " + error.status);
        if (this.sssComputationDropdownSubscription !== null) this.sssComputationDropdownSubscription.unsubscribe();
      }
    );
  }

  private async HDMFComputationDropdownListData() {
    this.hdmfComputationDropdownSubscription = await (await this.employeeDetailService.HDMFComputationList()).subscribe(
      response => {
        this.hdmfComputationListDropdown = response;
        this.GetTaxTableDropdownListData();
        if (this.hdmfComputationDropdownSubscription !== null) this.hdmfComputationDropdownSubscription.unsubscribe();
      },
      error => {
        this.snackBarTemplate.snackBarError(this.snackBar, error.error.Message + " " + error.status);
        if (this.hdmfComputationDropdownSubscription !== null) this.hdmfComputationDropdownSubscription.unsubscribe();
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

        setTimeout(() => {
          this.GetEmployeeDetail();
        }, 500);

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
    this.activatedRoute.params.subscribe(params => { id = params["id"]; });
    this.isProgressBarHidden = true;
    this.isComponentsShown = false;

    this.employeeDetailSubscription = await (await this.employeeDetailService.EmployeeDetail(id)).subscribe(
      response => {
        let result = response;
        console.log(result)
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
          this.employeeModel.CityId = result["CityId"];
          this.employeeModel.City = result["City"];
          this.employeeModel.ZipCode = result["ZipCode"];
          this.employeeModel.ContactNumber = result["ContactNumber"];
          this.employeeModel.ContactMobileNumber = result["ContactMobileNumber"];
          this.employeeModel.EmailAddress = result["EmailAddress"];
          this.employeeModel.DateOfBirth = result["DateOfBirth"];
          this.UIDateOfBirth = new Date(result["DateOfBirth"]);
          this.employeeModel.PlaceOfBirth = result["PlaceOfBirth"];
          this.employeeModel.Sex = result["Sex"];
          this.employeeModel.CivilStatus = result["CivilStatus"];
          this.employeeModel.Citizenship = result["Citizenship"];
          this.employeeModel.Height = this._decimalPipe.transform(result["Height"], "1.2-2");
          this.employeeModel.Weight = this._decimalPipe.transform(result["Weight"], "1.2-2");;
          this.employeeModel.BloodType = result["BloodType"];
          this.employeeModel.Religion = result["Religion"];
          this.employeeModel.Remarks = result["Remarks"];
          this.employeeModel.PictureURL = result["PictureURL"];
          this.employeeModel.CompanyId = result["CompanyId"];
          this.employeeModel.UserId = result["UserId"];
          this.employeeModel.Username = result["Username"];
          this.employeeModel.CreatedByUserId = result["CreatedByUserId"];
          this.employeeModel.CreatedByUser = result["CreatedByUser"];
          this.employeeModel.CreatedDateTime = result["CreatedDateTime"];
          this.employeeModel.UpdatedByUserId = result["UpdatedByUserId"];
          this.employeeModel.UpdatedByUser = result["UpdatedByUser"];
          this.employeeModel.UpdatedDateTime = result["UpdatedDateTime"];
          this.employeeModel.IsLocked = result["IsLocked"];
          if (result["EmployeePayroll"] !== null) {
            this.employeeModel.EmployeePayroll = result["EmployeePayroll"];
            this.employeeModel.EmployeePayroll.TaxTable = result["EmployeePayroll"].TaxTable;
            this.employeeModel.EmployeePayroll.PayrollRate = this._decimalPipe.transform(result["EmployeePayroll"].PayrollRate, "1.2-2");
            this.employeeModel.EmployeePayroll.MonthlyRate = this._decimalPipe.transform(result["EmployeePayroll"].MonthlyRate, "1.2-2");
            this.employeeModel.EmployeePayroll.DailyRate = this._decimalPipe.transform(result["EmployeePayroll"].DailyRate, "1.2-2");
            this.employeeModel.EmployeePayroll.HourlyRate = this._decimalPipe.transform(result["EmployeePayroll"].HourlyRate, "1.2-2");
            this.employeeModel.EmployeePayroll.AbsentDailyRate = this._decimalPipe.transform(result["EmployeePayroll"].AbsentDailyRate, "1.2-2");
            this.employeeModel.EmployeePayroll.LateHourlyRate = this._decimalPipe.transform(result["EmployeePayroll"].LateHourlyRate, "1.2-2");
            this.employeeModel.EmployeePayroll.UndertimeHourlyRate = this._decimalPipe.transform(result["EmployeePayroll"].UndertimeHourlyRate, "1.2-2");
            this.employeeModel.EmployeePayroll.OvertimeHourlyRate = this._decimalPipe.transform(result["EmployeePayroll"].OvertimeHourlyRate, "1.2-2");
            this.employeeModel.EmployeePayroll.SSSAddOnAmount = this._decimalPipe.transform(result["EmployeePayroll"].SSSAddOnAmount, "1.2-2");
            this.employeeModel.EmployeePayroll.HDMFAddOnAmount = this._decimalPipe.transform(result["EmployeePayroll"].HDMFAddOnAmount, "1.2-2");
            this.employeeModel.EmployeePayroll.CostOfLivingAllowance = this._decimalPipe.transform(result["EmployeePayroll"].CostOfLivingAllowance, "1.2-2");
            this.employeeModel.EmployeePayroll.AdditionalAllowance = this._decimalPipe.transform(result["EmployeePayroll"].AdditionalAllowance, "1.2-2");
            this.employeeModel.EmployeePayroll.NightDifferentialRate = this._decimalPipe.transform(result["EmployeePayroll"].NightDifferentialRate, "1.2-2");
          } else {
            this.employeeModel.EmployeePayroll = this.employeePayrollModel;
            this.snackBarTemplate.snackBarError(this.snackBar, "Employee Payroll Null");
          }

          if (result["EmployeeHR"] !== null) {
            this.employeeModel.EmployeeHR = result["EmployeeHR"];
            this.employeeModel.EmployeeHR.DateHired = result["EmployeeHR"].DateHired;
            this.employeeModel.EmployeeHR.DateRegular = result["EmployeeHR"].DateRegular;
            this.employeeModel.EmployeeHR.DateResigned = result["EmployeeHR"].DateResigned;
            this.UIDateHired = new Date(result["EmployeeHR"].DateHired);
            this.UIDateRegular = result["EmployeeHR"].DateRegular == result["EmployeeHR"].DateHired || result["EmployeeHR"].DateRegular < result["EmployeeHR"].DateHired ? null : new Date(result["EmployeeHR"].DateRegular);
            this.UIDateResigned = result["EmployeeHR"].DateResigned == result["EmployeeHR"].DateHired || result["EmployeeHR"].DateResigned < result["EmployeeHR"].DateHired ? null : new Date(result["EmployeeHR"].DateResigned);;
          } else {
            this.employeeModel.EmployeeHR = this.employeeHRModel;
            this.snackBarTemplate.snackBarError(this.snackBar, "Employee HR Null");
          }
        }

        this.loadComponent(result["IsLocked"]);
        this.isProgressBarHidden = false;
        this.isDataLoaded = true;
        this.isComponentsShown = true;
        this.GetEmployeeMemoListData();
        if (this.employeeDetailSubscription !== null) this.employeeDetailSubscription.unsubscribe();
      },
      error => {
        this.snackBarTemplate.snackBarError(this.snackBar, error.error.Message + " " + error.status);
        if (this.employeeDetailSubscription !== null) this.employeeDetailSubscription.unsubscribe();
      }
    );
  }

  public GetUIDateOfBirth() {
    this.employeeModel.DateOfBirth = this.datePipe.transform(this.UIDateOfBirth, 'yyyy-MM-dd');
  }

  public GetUIDateHired() {
    this.employeeModel.EmployeeHR.DateHired = this.datePipe.transform(this.UIDateHired, 'yyyy-MM-dd');

  }
  public GetUIDateRegular() {
    this.employeeModel.EmployeeHR.DateRegular = this.datePipe.transform(this.UIDateRegular, 'yyyy-MM-dd');

  }
  public GetUIDateResigned() {
    this.employeeModel.EmployeeHR.DateResigned = this.datePipe.transform(this.UIDateResigned, 'yyyy-MM-dd');
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
          this.loadComponent(false);
          this.GetChangeHistoryListData();
          this.isDataLoaded = true;
          this.snackBarTemplate.snackBarSuccess(this.snackBar, "Save Successfully.");
          if (this.saveEmployeeDetailSubscription !== null) this.saveEmployeeDetailSubscription.unsubscribe();
        },
        error => {
          this.loadComponent(false);
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
          this.GetChangeHistoryListData();
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

  private async loadComponent(isDisabled) {
    this.btnSaveDisabled = isDisabled;
    this.btnLockisabled = isDisabled;
    this.btnUnlockDisabled = !isDisabled;

    if (this.userRights.CanEdit === false) {
      this._canEdit = false;
      this.isLocked = true;
    } else {
      this._canEdit = !isDisabled;
      this.isLocked = isDisabled;
    }

    if (this.userRights.CanDelete === false) {
      this._canDelete = false;
    } else {
      this._canDelete = !isDisabled;
    }
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
    const matDialogRef = this.matDialog.open(EmployeeDetailEditNameDialogComponent, {
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
    const matDialogRef = this.matDialog.open(EmployeeDetialLinkToUsernameDialogComponent, {
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

  public PickCity() {
    const matDialogRef = this.matDialog.open(GenericDropdownDialogComponent, {
      width: '900px',
      height: '500',
      data: {
        objDialogTitle: "City",
      },
      disableClose: true
    });

    matDialogRef.afterClosed().subscribe(data => {
      if (data.event == "Pick") {
        this.employeeModel.CityId = data.Value.Id;
        this.employeeModel.City = data.Value.Value;
      }
    });
  }

  public monthlyRateOnKeyUpEvent(event: any) {
    let payrollRate = parseFloat(event.target.value) / 2;
    let dailyRate = parseFloat(event.target.value) / 26;
    let absentRate = parseFloat(event.target.value) / 26;
    let hourlyRate = dailyRate / 8;
    let lateHourlyRate = dailyRate / 8;
    let undertimeHourlyRate = dailyRate / 8;
    let overtimeHourlyRate = (dailyRate / 8) * 1.25;
    let nightDifferenceHourlyRate = hourlyRate * 0.10;
    this.employeeModel.EmployeePayroll.PayrollRate = this._decimalPipe.transform(payrollRate, "1.2-2");
    this.employeeModel.EmployeePayroll.DailyRate = this._decimalPipe.transform(dailyRate, "1.2-2");
    this.employeeModel.EmployeePayroll.AbsentDailyRate = this._decimalPipe.transform(absentRate, "1.2-2");
    this.employeeModel.EmployeePayroll.HourlyRate = this._decimalPipe.transform(hourlyRate, "1.2-2");
    this.employeeModel.EmployeePayroll.LateHourlyRate = this._decimalPipe.transform(lateHourlyRate, "1.2-2");
    this.employeeModel.EmployeePayroll.UndertimeHourlyRate = this._decimalPipe.transform(undertimeHourlyRate, "1.2-2");
    this.employeeModel.EmployeePayroll.OvertimeHourlyRate = this._decimalPipe.transform(overtimeHourlyRate, "1.2-2");
    this.employeeModel.EmployeePayroll.NightDifferentialRate = this._decimalPipe.transform(nightDifferenceHourlyRate, "1.2-2");
  }

  public payrollRateOnKeyUpEvent(event: any) {
    let monthlyRate = parseFloat(event.target.value) * 2;
    let dailyRate = monthlyRate / 26;
    let absentRate = monthlyRate / 26;
    let hourlyRate = dailyRate / 8;
    let lateHourlyRate = dailyRate / 8;
    let undertimeHourlyRate = dailyRate / 8;
    let overtimeHourlyRate = (dailyRate / 8) * 1.25;
    let nightDifferenceHourlyRate = hourlyRate * 0.10;
    this.employeeModel.EmployeePayroll.MonthlyRate = this._decimalPipe.transform(monthlyRate, "1.2-2");
    this.employeeModel.EmployeePayroll.DailyRate = this._decimalPipe.transform(dailyRate, "1.2-2");
    this.employeeModel.EmployeePayroll.AbsentDailyRate = this._decimalPipe.transform(absentRate, "1.2-2");
    this.employeeModel.EmployeePayroll.HourlyRate = this._decimalPipe.transform(hourlyRate, "1.2-2");
    this.employeeModel.EmployeePayroll.LateHourlyRate = this._decimalPipe.transform(lateHourlyRate, "1.2-2");
    this.employeeModel.EmployeePayroll.UndertimeHourlyRate = this._decimalPipe.transform(undertimeHourlyRate, "1.2-2");
    this.employeeModel.EmployeePayroll.OvertimeHourlyRate = this._decimalPipe.transform(overtimeHourlyRate, "1.2-2");
    this.employeeModel.EmployeePayroll.NightDifferentialRate = this._decimalPipe.transform(nightDifferenceHourlyRate, "1.2-2");
  }

  restrictNumeric(e) {
    let input;
    if (e.key == '') {
      return 0.00;
    }
    if (e.metaKey || e.ctrlKey) {
      return true;
    }
    if (e.which === 32) {
      return false;
    }
    if (e.which === 0) {
      return true;
    }
    if (e.which < 33) {
      return true;
    }
    if (e.which < 33) {
      return true;
    }
    input = String.fromCharCode(e.which);
    return !!/^[0-9.,]+$/.test(input);
  }

  public RemoveComma(value: string): string {
    return value.toString().replace(/,/g, '');
  }

  public inputTypePayrollRate = 'text';
  public inputTypeMonthlyRate = 'text';
  public inputTypeHourlyRate = 'text';
  public inputTypeAbsentDailyRate = 'text';
  public inputTypeDailyRate = 'text';
  public inputTypeLateHourlyRate = 'text';
  public inputTypeUndertimeHourlyRate = 'text';
  public inputTypeNightDifferentialRate = 'text';
  public inputTypeOvertimeHourlyRate = 'text';
  public inputTypeSSSAddOnAmount = 'text';
  public inputTypeHDMFAddOnAmount = 'text';
  public inputTypeCostOfLivingAllowance = 'text';
  public inputTypeAdditionalAllowance = 'text';
  public inputTypeHeight = 'text';
  public inputTypeWeight = 'text';

  PayrollRateToNumberTypeFocus() {
    this.employeeModel.EmployeePayroll.PayrollRate = this.RemoveComma(this.employeeModel.EmployeePayroll.PayrollRate);
    this.inputTypePayrollRate = 'number';
  }

  PayrollRateFormatValueFocusOut() {
    this.inputTypePayrollRate = 'text';

    if (this.employeeModel.EmployeePayroll.PayrollRate == '') {
      this.employeeModel.EmployeePayroll.PayrollRate = this._decimalPipe.transform(0, "1.2-2");
    } else {
      this.employeeModel.EmployeePayroll.PayrollRate = this._decimalPipe.transform(this.employeeModel.EmployeePayroll.PayrollRate, "1.2-2");
    }
  }

  MonthlyRateToNumberTypeFocus() {
    this.employeeModel.EmployeePayroll.MonthlyRate = this.RemoveComma(this.employeeModel.EmployeePayroll.MonthlyRate);
    this.inputTypeMonthlyRate = 'number';
  }

  MonthlyRateFormatValueFocusOut() {
    this.inputTypeMonthlyRate = 'text';

    if (this.employeeModel.EmployeePayroll.MonthlyRate == '') {
      this.employeeModel.EmployeePayroll.MonthlyRate = this._decimalPipe.transform(0, "1.2-2");
    } else {
      this.employeeModel.EmployeePayroll.MonthlyRate = this._decimalPipe.transform(this.employeeModel.EmployeePayroll.MonthlyRate, "1.2-2");
    }
  }

  HourlyRateToNumberTypeFocus() {
    this.employeeModel.EmployeePayroll.HourlyRate = this.RemoveComma(this.employeeModel.EmployeePayroll.HourlyRate);
    this.inputTypeHourlyRate = 'number';
  }

  HourlyRateFormatValueFocusOut() {
    this.inputTypeHourlyRate = 'text';

    if (this.employeeModel.EmployeePayroll.HourlyRate == '') {
      this.employeeModel.EmployeePayroll.HourlyRate = this._decimalPipe.transform(0, "1.2-2");
    } else {
      this.employeeModel.EmployeePayroll.HourlyRate = this._decimalPipe.transform(this.employeeModel.EmployeePayroll.HourlyRate, "1.2-2");
    }
  }

  AbsentDailyRateFormatValueFocusOut() {
    this.inputTypeAbsentDailyRate = 'text';

    if (this.employeeModel.EmployeePayroll.AbsentDailyRate == '') {
      this.employeeModel.EmployeePayroll.AbsentDailyRate = this._decimalPipe.transform(0, "1.2-2");
    } else {
      this.employeeModel.EmployeePayroll.AbsentDailyRate = this._decimalPipe.transform(this.employeeModel.EmployeePayroll.AbsentDailyRate, "1.2-2");
    }
  }

  AbsentDailyRateToNumberTypeFocus() {
    this.employeeModel.EmployeePayroll.AbsentDailyRate = this.RemoveComma(this.employeeModel.EmployeePayroll.AbsentDailyRate);
    this.inputTypeAbsentDailyRate = 'number';
  }

  DailyRateFormatValueFocusOut() {
    this.inputTypeDailyRate = 'text';

    if (this.employeeModel.EmployeePayroll.DailyRate == '') {
      this.employeeModel.EmployeePayroll.DailyRate = this._decimalPipe.transform(0, "1.2-2");
    } else {
      this.employeeModel.EmployeePayroll.DailyRate = this._decimalPipe.transform(this.employeeModel.EmployeePayroll.DailyRate, "1.2-2");
    }
  }

  DailyRateToNumberTypeFocus() {
    this.employeeModel.EmployeePayroll.DailyRate = this.RemoveComma(this.employeeModel.EmployeePayroll.DailyRate);
    this.inputTypeDailyRate = 'number';
  }

  LateHourlyRateFormatValueFocusOut() {
    this.inputTypeLateHourlyRate = 'text';

    if (this.employeeModel.EmployeePayroll.LateHourlyRate == '') {
      this.employeeModel.EmployeePayroll.LateHourlyRate = this._decimalPipe.transform(0, "1.2-2");
    } else {
      this.employeeModel.EmployeePayroll.LateHourlyRate = this._decimalPipe.transform(this.employeeModel.EmployeePayroll.LateHourlyRate, "1.2-2");
    }
  }

  LateHourlyRateToNumberTypeFocus() {
    this.employeeModel.EmployeePayroll.LateHourlyRate = this.RemoveComma(this.employeeModel.EmployeePayroll.LateHourlyRate);
    this.inputTypeLateHourlyRate = 'number';
  }

  UndertimeHourlyRateFormatValueFocusOut() {
    this.inputTypeUndertimeHourlyRate = 'text';

    if (this.employeeModel.EmployeePayroll.UndertimeHourlyRate == '') {
      this.employeeModel.EmployeePayroll.UndertimeHourlyRate = this._decimalPipe.transform(0, "1.2-2");
    } else {
      this.employeeModel.EmployeePayroll.UndertimeHourlyRate = this._decimalPipe.transform(this.employeeModel.EmployeePayroll.UndertimeHourlyRate, "1.2-2");
    }
  }

  UndertimeHourlyRateToNumberTypeFocus() {
    this.employeeModel.EmployeePayroll.UndertimeHourlyRate = this.RemoveComma(this.employeeModel.EmployeePayroll.UndertimeHourlyRate);
    this.inputTypeUndertimeHourlyRate = 'number';
  }

  NightDifferentialRateFormatValueFocusOut() {
    this.inputTypeNightDifferentialRate = 'text';

    if (this.employeeModel.EmployeePayroll.NightDifferentialRate == '') {
      this.employeeModel.EmployeePayroll.NightDifferentialRate = this._decimalPipe.transform(0, "1.2-2");
    } else {
      this.employeeModel.EmployeePayroll.NightDifferentialRate = this._decimalPipe.transform(this.employeeModel.EmployeePayroll.NightDifferentialRate, "1.2-2");
    }
  }

  NightDifferentialRateToNumberTypeFocus() {
    this.employeeModel.EmployeePayroll.NightDifferentialRate = this.RemoveComma(this.employeeModel.EmployeePayroll.NightDifferentialRate);
    this.inputTypeNightDifferentialRate = 'number';
  }

  OvertimeHourlyRateFormatValueFocusOut() {
    this.inputTypeOvertimeHourlyRate = 'text';

    if (this.employeeModel.EmployeePayroll.OvertimeHourlyRate == '') {
      this.employeeModel.EmployeePayroll.OvertimeHourlyRate = this._decimalPipe.transform(0, "1.2-2");
    } else {
      this.employeeModel.EmployeePayroll.OvertimeHourlyRate = this._decimalPipe.transform(this.employeeModel.EmployeePayroll.OvertimeHourlyRate, "1.2-2");
    }
  }

  OvertimeHourlyRateToNumberTypeFocus() {
    this.employeeModel.EmployeePayroll.OvertimeHourlyRate = this.RemoveComma(this.employeeModel.EmployeePayroll.OvertimeHourlyRate);
    this.inputTypeOvertimeHourlyRate = 'number';
  }

  SSSAddOnAmountFormatValueFocusOut() {
    this.inputTypeSSSAddOnAmount = 'text';

    if (this.employeeModel.EmployeePayroll.SSSAddOnAmount == '') {
      this.employeeModel.EmployeePayroll.SSSAddOnAmount = this._decimalPipe.transform(0, "1.2-2");
    } else {
      this.employeeModel.EmployeePayroll.SSSAddOnAmount = this._decimalPipe.transform(this.employeeModel.EmployeePayroll.SSSAddOnAmount, "1.2-2");
    }
  }

  SSSAddOnAmountToNumberTypeFocus() {
    this.employeeModel.EmployeePayroll.SSSAddOnAmount = this.RemoveComma(this.employeeModel.EmployeePayroll.SSSAddOnAmount);
    this.inputTypeSSSAddOnAmount = 'number';
  }

  HDMFAddOnAmountFormatValueFocusOut() {
    this.inputTypeHDMFAddOnAmount = 'text';

    if (this.employeeModel.EmployeePayroll.HDMFAddOnAmount == '') {
      this.employeeModel.EmployeePayroll.HDMFAddOnAmount = this._decimalPipe.transform(0, "1.2-2");
    } else {
      this.employeeModel.EmployeePayroll.HDMFAddOnAmount = this._decimalPipe.transform(this.employeeModel.EmployeePayroll.HDMFAddOnAmount, "1.2-2");
    }
  }

  HDMFAddOnAmountToNumberTypeFocus() {
    this.employeeModel.EmployeePayroll.HDMFAddOnAmount = this.RemoveComma(this.employeeModel.EmployeePayroll.HDMFAddOnAmount);
    this.inputTypeHDMFAddOnAmount = 'number';
  }

  CostOfLivingAllowanceFormatValueFocusOut() {
    this.inputTypeCostOfLivingAllowance = 'text';

    if (this.employeeModel.EmployeePayroll.CostOfLivingAllowance == '') {
      this.employeeModel.EmployeePayroll.CostOfLivingAllowance = this._decimalPipe.transform(0, "1.2-2");
    } else {
      this.employeeModel.EmployeePayroll.CostOfLivingAllowance = this._decimalPipe.transform(this.employeeModel.EmployeePayroll.CostOfLivingAllowance, "1.2-2");
    }
  }

  CostOfLivingAllowanceToNumberTypeFocus() {
    this.employeeModel.EmployeePayroll.CostOfLivingAllowance = this.RemoveComma(this.employeeModel.EmployeePayroll.CostOfLivingAllowance);
    this.inputTypeCostOfLivingAllowance = 'number';
  }

  AdditionalAllowanceFormatValueFocusOut() {
    this.inputTypeAdditionalAllowance = 'text';

    if (this.employeeModel.EmployeePayroll.AdditionalAllowance == '') {
      this.employeeModel.EmployeePayroll.AdditionalAllowance = this._decimalPipe.transform(0, "1.2-2");
    } else {
      this.employeeModel.EmployeePayroll.AdditionalAllowance = this._decimalPipe.transform(this.employeeModel.EmployeePayroll.AdditionalAllowance, "1.2-2");
    }
  }

  AdditionalAllowanceToNumberTypeFocus() {
    this.employeeModel.EmployeePayroll.AdditionalAllowance = this.RemoveComma(this.employeeModel.EmployeePayroll.AdditionalAllowance);
    this.inputTypeAdditionalAllowance = 'number';
  }

  HeightFormatValueFocusOut() {
    this.inputTypeHeight = 'text';

    if (this.employeeModel.Height == '') {
      this.employeeModel.Height = this._decimalPipe.transform(0, "1.2-2");
    } else {
      this.employeeModel.Height = this._decimalPipe.transform(this.employeeModel.Height, "1.2-2");
    }
  }

  HeightToNumberTypeFocus() {
    this.employeeModel.Height = this.RemoveComma(this.employeeModel.Height);
    this.inputTypeHeight = 'number';
  }

  WeightFormatValueFocusOut() {
    this.inputTypeWeight = 'text';

    if (this.employeeModel.Weight == '') {
      this.employeeModel.Weight = this._decimalPipe.transform(0, "1.2-2");
    } else {
      this.employeeModel.Weight = this._decimalPipe.transform(this.employeeModel.Weight, "1.2-2");
    }
  }

  WeightToNumberTypeFocus() {
    this.employeeModel.Weight = this.RemoveComma(this.employeeModel.Weight);
    this.inputTypeWeight = 'number';
  }

  public imagefile = '';
  public uploadButtonDisabled: boolean = true;

  documentFileOnChange() {
    if (this.imagefile !== '') {
      this.uploadButtonDisabled = false;
    }
  }

  // ==== 
  // Memo
  // ==== 
  public _listEmployeeMemoObservableArray: ObservableArray = new ObservableArray();
  public _listEmployeeMemoCollectionView: CollectionView = new CollectionView(this._listEmployeeMemoObservableArray);
  public _listEmployeeMemoPageIndex: number = 15;
  @ViewChild('flexEmployeeMemo') _flexEmployeeMemo: wjcGrid.FlexGrid;
  public _isEmployeeMemoProgressBarHidden = false;
  public _isEmployeeMemDataLoaded: boolean = false;

  private _employeeMemoListSubscription: any;
  private _addEmployeeMemoSubscription: any;
  private _deleteEmployeeMemoSubscription: any;

  public buttonAddDisabled: boolean = false;

  private async GetEmployeeMemoListData() {
    this._listEmployeeMemoObservableArray = new ObservableArray();
    this._listEmployeeMemoCollectionView = new CollectionView(this._listEmployeeMemoObservableArray);
    this._listEmployeeMemoCollectionView.pageSize = 15;
    this._listEmployeeMemoCollectionView.trackChanges = true;
    await this._listEmployeeMemoCollectionView.refresh();
    await this._flexEmployeeMemo.refresh();

    this._isEmployeeMemoProgressBarHidden = true;

    this._employeeMemoListSubscription = (await this.employeeDetailService.EmployeeMemoList(this.employeeModel.Id)).subscribe(
      (response: any) => {
        var results = response;
        if (results["length"] > 0) {
          this._listEmployeeMemoCollectionView = results;
          this._listEmployeeMemoCollectionView = new CollectionView(this._listEmployeeMemoCollectionView);
          this._listEmployeeMemoCollectionView.pageSize = 15;
          this._listEmployeeMemoCollectionView.trackChanges = true;
          this._listEmployeeMemoCollectionView.refresh();
          this._flexEmployeeMemo.refresh();
        }

        this._isEmployeeMemDataLoaded = true;
        this._isEmployeeMemoProgressBarHidden = false;
        if (this._employeeMemoListSubscription != null) this._employeeMemoListSubscription.unsubscribe();
      },
      error => {
        this.snackBarTemplate.snackBarError(this.snackBar, error.error.Message + " " + error.status);
        if (this._employeeMemoListSubscription !== null) this._employeeMemoListSubscription.unsubscribe();
      }
    );

    await this.GetChangeHistoryListData();
  }

  gridClick(s, e) {
    if (wjcCore.hasClass(e.target, 'button-edit')) {
      if (this.userRights.CanEdit) {
        this.EditEmployeeMemo();
      }

    }

    if (wjcCore.hasClass(e.target, 'button-delete')) {
      if (this.userRights.CanDelete) {
        this.ComfirmDeleteEmployeeMemo();
      }
    }
  }

  public BtnAddEmployeeMemo() {

    let objEmployeeMemoModel: EmployeeMemoModel = {
      Id: 0,
      EmployeeId: this.employeeModel.Id,
      MemoCode: '0000000000',
      MemoDate: this.datePipe.transform(new Date(), 'yyyy-MM-dd'),
      Particulars: 'NA',
      AttachmentURL: 'NA',
      AttachmentType: ''
    }
    console.log(this._isEmployeeMemDataLoaded);

    this.DetailEmployeeMemo(objEmployeeMemoModel, 'Add Memo');
  }

  public EditEmployeeMemo() {
    let currentEmployeeMemoModel = this._listEmployeeMemoCollectionView.currentItem;
    this.DetailEmployeeMemo(currentEmployeeMemoModel, 'Edit Memo');
  }

  public async AddEmployeeMemoModel(objEmployeeMemoModel: EmployeeMemoModel) {
    this.buttonAddDisabled = true;
    if (this._isEmployeeMemDataLoaded == true) {
      this._isEmployeeMemDataLoaded = false;
      this._addEmployeeMemoSubscription = (await this.employeeDetailService.AddEmployeeMemo(objEmployeeMemoModel)).subscribe(
        response => {
          this.buttonAddDisabled = false;
          this._isEmployeeMemDataLoaded = true;
          this.GetEmployeeMemoListData();
          this.snackBarTemplate.snackBarSuccess(this.snackBar, "Added Successfully");
          if (this._addEmployeeMemoSubscription != null) this._addEmployeeMemoSubscription.unsubscribe();
        },
        error => {
          this.buttonAddDisabled = false;
          this._isEmployeeMemDataLoaded = true;
          this.snackBarTemplate.snackBarError(this.snackBar, error.error + " " + " Status Code: " + error.status);
          if (this._addEmployeeMemoSubscription != null) this._addEmployeeMemoSubscription.unsubscribe();
        }
      );
    }
  }

  public async SaveEmployeeMemo(objEmployeeMemoModel: EmployeeMemoModel) {
    this.buttonAddDisabled = true;
    if (this._isEmployeeMemDataLoaded == true) {
      this._isEmployeeMemDataLoaded = false;
      this._addEmployeeMemoSubscription = (await this.employeeDetailService.SaveEmployeeMemo(objEmployeeMemoModel)).subscribe(
        response => {
          this.buttonAddDisabled = false;
          this._isEmployeeMemDataLoaded = true;
          this.GetEmployeeMemoListData();
          this.snackBarTemplate.snackBarSuccess(this.snackBar, "Save Successfully");
        },
        error => {
          this.buttonAddDisabled = false;
          this._isEmployeeMemDataLoaded = true;
          this.snackBarTemplate.snackBarError(this.snackBar, error.error + " " + " Status Code: " + error.status);
          if (this._addEmployeeMemoSubscription != null) this._addEmployeeMemoSubscription.unsubscribe();
        }
      );
    }
  }

  public async DeleteEmployeeMemo() {
    if (this._isEmployeeMemDataLoaded == true) {
      this._isEmployeeMemDataLoaded = false;
      let currentEmployeeMemoModel = this._listEmployeeMemoCollectionView.currentItem;
      this._isEmployeeMemoProgressBarHidden = true;

      this._deleteEmployeeMemoSubscription = (await this.employeeDetailService.DeleteEmployeeMemo(currentEmployeeMemoModel.Id)).subscribe(
        response => {
          this.snackBarTemplate.snackBarSuccess(this.snackBar, "Delete Successfully");
          this.GetEmployeeMemoListData();
          this._isEmployeeMemoProgressBarHidden = false;
          this._isEmployeeMemDataLoaded = true;
        },
        error => {
          this._isEmployeeMemDataLoaded = true;
          this.snackBarTemplate.snackBarError(this.snackBar, error.error + " " + error.status);
          if (this._deleteEmployeeMemoSubscription != null) this._deleteEmployeeMemoSubscription.unsubscribe();
        }
      );
    }
  }

  public ComfirmDeleteEmployeeMemo(): void {
    let currentEmployeeMemoModel = this._listEmployeeMemoCollectionView.currentItem;
    const matDialogRef = this.matDialog.open(ComfirmMassageDialogComponent, {
      width: '500px',
      data: {
        objDialogTitle: "",
        objComfirmationMessage: `Delete ${currentEmployeeMemoModel.MemoCode}?`,
      },
      disableClose: true
    });

    matDialogRef.afterClosed().subscribe(result => {
      if (result.message == "Yes") {
        this.DeleteEmployeeMemo();
      }
    });
  }

  public DetailEmployeeMemo(data: EmployeeMemoModel, eventTitle: string): void {
    const matDialogRef = this.matDialog.open(EmployeeDetailEmployeeMemoComponent, {
      width: '1000px',
      data: {
        objDialogTitle: eventTitle,
        objData: data,
      },
      disableClose: true
    });

    matDialogRef.afterClosed().subscribe(data => {

      let objEmployeeMemoModel: EmployeeMemoModel = {
        Id: data.objData.Id,
        EmployeeId: data.objData.EmployeeId,
        MemoCode: data.objData.MemoCode,
        MemoDate: data.objData.MemoDate,
        Particulars: data.objData.Particulars,
        AttachmentURL: data.objData.AttachmentURL,
        AttachmentType: data.objData.AttachmentType
      }

      console.log(data.event);

      if (data.event === 'Add') {
        this.AddEmployeeMemoModel(objEmployeeMemoModel);
      }
      if (data.event === 'Edit') {
        this.SaveEmployeeMemo(objEmployeeMemoModel);
      }
    });
  }

  public _isTabMemo: boolean = false;

  async activeTab() {
    this._isTabMemo = await false;
    if (this.tabGroup.selectedIndex == 3) {
      this._isTabMemo = await true;
    }
  }

  // ==============
  // Mandatory HDMF
  // ==============
  public _listChangeHistoryObservableArray: ObservableArray = new ObservableArray();
  public _listChangeHistoryCollectionView: CollectionView = new CollectionView(this._listChangeHistoryObservableArray);
  public _listChangeHistoryPageIndex: number = 15;
  @ViewChild('flexChangeHistory') _flexChangeHistory: wjcGrid.FlexGrid;
  public _isChangeHistoryProgressBarHidden = false;
  public _isChangeHistoryDataLoaded: boolean = false;

  private _ChangeHistoryListSubscription: any;

  private async GetChangeHistoryListData() {
    this._listChangeHistoryObservableArray = new ObservableArray();
    this._listChangeHistoryCollectionView = new CollectionView(this._listChangeHistoryObservableArray);
    this._listChangeHistoryCollectionView.pageSize = 15;
    this._listChangeHistoryCollectionView.trackChanges = true;
    await this._listChangeHistoryCollectionView.refresh();
    await this._flexChangeHistory.refresh();

    this._isChangeHistoryProgressBarHidden = true;

    this._ChangeHistoryListSubscription = (await this.employeeDetailService.ChangeHistoryList(this.employeeModel.Id)).subscribe(
      (response: any) => {
        var results = response;
        if (results["length"] > 0) {
          this._listChangeHistoryCollectionView = results;
          this._listChangeHistoryCollectionView = new CollectionView(this._listChangeHistoryCollectionView);
          this._listChangeHistoryCollectionView.pageSize = 15;
          this._listChangeHistoryCollectionView.trackChanges = true;
          this._listChangeHistoryCollectionView.refresh();
          this._flexChangeHistory.refresh();
        }

        this._isChangeHistoryDataLoaded = true;
        this._isChangeHistoryProgressBarHidden = false;
        if (this._ChangeHistoryListSubscription != null) this._ChangeHistoryListSubscription.unsubscribe();
      },
      error => {
        this.snackBarTemplate.snackBarError(this.snackBar, error.error.Message + " " + error.status);
        if (this._ChangeHistoryListSubscription !== null) this._ChangeHistoryListSubscription.unsubscribe();
      }
    );
  }
}
