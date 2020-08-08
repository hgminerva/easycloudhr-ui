import { Injectable } from '@angular/core';
import { AppSettings } from 'src/app/app-settings';
import { HttpClient } from '@angular/common/http';
import { EmployeeModel } from './employee.model';

@Injectable({
  providedIn: 'root'
})
export class EmployeeDetailService {

  constructor(
    private appSettings: AppSettings,
    private httpClient: HttpClient
  ) { }


  //==================
  // Employee Dropdown
  //==================
  public async ZipCodeList() {
    return this.httpClient.get(this.appSettings.defaultAPIURLHost + '/api/employee/zip/code/list', this.appSettings.defaultOptions);
  }

  public async GenderList() {
    return this.httpClient.get(this.appSettings.defaultAPIURLHost + '/api/employee/sex/list', this.appSettings.defaultOptions);
  }

  public async CivilStatusList() {
    return this.httpClient.get(this.appSettings.defaultAPIURLHost + '/api/employee/civil/status/list', this.appSettings.defaultOptions);
  }

  public async CitizenshipList() {
    return this.httpClient.get(this.appSettings.defaultAPIURLHost + '/api/employee/citizenship/list', this.appSettings.defaultOptions);
  }

  public async BloodTypeList() {
    return this.httpClient.get(this.appSettings.defaultAPIURLHost + '/api/employee/blood/type/list', this.appSettings.defaultOptions);
  }

  public async UserList() {
    return this.httpClient.get(this.appSettings.defaultAPIURLHost + '/api/employee/user/list', this.appSettings.defaultOptions);
  }

  public async CompanyList() {
    return this.httpClient.get(this.appSettings.defaultAPIURLHost + '/api/employee/company/list', this.appSettings.defaultOptions);
  }

  public async CityList() {
    return this.httpClient.get(this.appSettings.defaultAPIURLHost + '/api/employee/city/list', this.appSettings.defaultOptions);
  }

  public async ReligionList() {
    return this.httpClient.get(this.appSettings.defaultAPIURLHost + '/api/employee/religion/list', this.appSettings.defaultOptions);
  }

  //=========================
  // EmployeePayroll Dropdown
  //=========================
  public async PayrollTypeList() {
    return this.httpClient.get(this.appSettings.defaultAPIURLHost + '/api/employee/payroll/type/list', this.appSettings.defaultOptions);
  }

  public async PayrollGroupList() {
    return this.httpClient.get(this.appSettings.defaultAPIURLHost + '/api/employee/payroll/group/list', this.appSettings.defaultOptions);
  }

  public async SSSComputationList() {
    return this.httpClient.get(this.appSettings.defaultAPIURLHost + '/api/employee/payroll/sss/computation/list', this.appSettings.defaultOptions);
  }

  public async HDMFComputationList() {
    return this.httpClient.get(this.appSettings.defaultAPIURLHost + '/api/employee/payroll/hdmf/computation/list', this.appSettings.defaultOptions);
  }

  public async TaxTableList() {
    return this.httpClient.get(this.appSettings.defaultAPIURLHost + '/api/employee/payroll/tax/table/list', this.appSettings.defaultOptions);
  }

  public async TaxExemptionList() {
    return this.httpClient.get(this.appSettings.defaultAPIURLHost + '/api/employee/payroll/tax/exemption/list', this.appSettings.defaultOptions);
  }

  //====================
  // EmployeeHR Dropdown
  //====================

  public async BranchList() {
    return this.httpClient.get(this.appSettings.defaultAPIURLHost + '/api/employee/hr/branch/list', this.appSettings.defaultOptions);
  }

  public async DivisionList() {
    return this.httpClient.get(this.appSettings.defaultAPIURLHost + '/api/employee/hr/division/list', this.appSettings.defaultOptions);
  }

  public async DepartmentList() {
    return this.httpClient.get(this.appSettings.defaultAPIURLHost + '/api/employee/hr/department/list', this.appSettings.defaultOptions);
  }

  public async PositionList() {
    return this.httpClient.get(this.appSettings.defaultAPIURLHost + '/api/employee/hr/position/list', this.appSettings.defaultOptions);
  }

  public async ShiftList() {
    return this.httpClient.get(this.appSettings.defaultAPIURLHost + '/api/employee/hr/shift/list', this.appSettings.defaultOptions);
  }

  public async PList() {
    return this.httpClient.get(this.appSettings.defaultAPIURLHost + '/api/employee/hr/posotion/list', this.appSettings.defaultOptions);
  }

  //========= 
  // Employee 
  //========= 
  public async EmployeeDetail(id: number) {
    return this.httpClient.get(this.appSettings.defaultAPIURLHost + '/api/employee/detail/' + id, this.appSettings.defaultOptions);
  }

  public async SaveEmployee(id: number, objEmployee: EmployeeModel) {
    return this.httpClient.put(this.appSettings.defaultAPIURLHost + '/api/employee/save/' + id, JSON.stringify(objEmployee), this.appSettings.defaultOptions);
  }

  public async LockEmployee(id: number, objEmployee: EmployeeModel) {
    return this.httpClient.put(this.appSettings.defaultAPIURLHost + '/api/employee/lock/' + id, JSON.stringify(objEmployee), this.appSettings.defaultOptions);
  }

  public async Unlockemployee(id: number) {
    return this.httpClient.put(this.appSettings.defaultAPIURLHost + '/api/employee/unlock/' + id, "", this.appSettings.defaultOptions);
  }

  public async uploadFile(file: File, fileName: string, employeeId: number) {
    var formData: FormData = new FormData();
    formData.append("image", file, fileName);
    return this.httpClient.post(this.appSettings.defaultAPIURLHost + "/api/employee/upload/image/", formData, this.appSettings.uploadFileOptions);
  }

  //======== 
  // Payroll 
  //======== 
  public async EmployeePayrollDetail(id: number) {
    return this.httpClient.get(this.appSettings.defaultAPIURLHost + '/api/employee/payroll/detail/' + id, this.appSettings.defaultOptions);
  }
}
