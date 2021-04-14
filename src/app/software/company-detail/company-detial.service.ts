import { Injectable } from '@angular/core';
import { AppSettings } from './../software-appsettings';
import { HttpClient } from '@angular/common/http';
import { CompanyModel } from './company.model';
import { CompanyApproverModel } from './company-approver.model';

@Injectable({
  providedIn: 'root'
})
export class CompanyDetialService {

  constructor(
    private appSettings: AppSettings,
    private httpClient: HttpClient
  ) { }

  public async CompanyDetail(id: number) {
    return this.httpClient.get(this.appSettings.defaultAPIURLHost + '/api/company/detail/' + id, this.appSettings.defaultOptions);
  }

  public async SaveCompany(id: number, objCompany: CompanyModel) {
    return this.httpClient.put(this.appSettings.defaultAPIURLHost + '/api/company/save/' + id, JSON.stringify(objCompany), this.appSettings.defaultOptions);
  }

  public async LockCompany(id: number, objCompany: CompanyModel) {
    return this.httpClient.put(this.appSettings.defaultAPIURLHost + '/api/company/lock/' + id, JSON.stringify(objCompany), this.appSettings.defaultOptions);
  }

  public async UnlockCompany(id: number) {
    return this.httpClient.put(this.appSettings.defaultAPIURLHost + '/api/company/unlock/' + id, "", this.appSettings.defaultOptions);
  }

  public async UserList() {
    return this.httpClient.get(this.appSettings.defaultAPIURLHost + '/api/company/approver/user-list',
      this.appSettings.defaultOptions);
  }
  public async BranchList() {
    return this.httpClient.get(this.appSettings.defaultAPIURLHost + '/api/company/approver/branch-list',
      this.appSettings.defaultOptions);
  }
  public async ApproverList(companyId: number) {
    return this.httpClient.get(this.appSettings.defaultAPIURLHost + '/api/company/approver/list/' + companyId,
      this.appSettings.defaultOptions);
  }
  public async AddApprover(objApprover: CompanyApproverModel) {
    return this.httpClient.post(this.appSettings.defaultAPIURLHost + '/api/company/approver/create', JSON.stringify(objApprover),
      this.appSettings.defaultOptions);
  }

  public async SaveApprover(id: number, objApprover: CompanyApproverModel) {
    return this.httpClient.put(this.appSettings.defaultAPIURLHost + '/api/company/approver/save/' + id, JSON.stringify(objApprover), this.appSettings.defaultOptions);
  }


  public async DeleteApprover(id: number) {
    return this.httpClient.delete(this.appSettings.defaultAPIURLHost + '/api/company/approver/delete/' + id,
      this.appSettings.defaultOptions);
  }
  
  public async AccountList() {
    return this.httpClient.get(this.appSettings.defaultAPIURLHost + '/mst/api/account/list', this.appSettings.defaultOptions);
  }
}
