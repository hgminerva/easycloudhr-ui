import { Injectable } from '@angular/core';
import { AppSettings } from './../software-appsettings';
import { HttpClient } from '@angular/common/http';

import { MandatorySSS } from './mandatory-sss.model';
import { MandatoryPHIC } from './mandatory-phic.model';
import { MandatoryHDMF } from './mandatory-hdmf.model';
import { MandatoryBIR } from './mandatory-bir.model';

@Injectable({
  providedIn: 'root'
})
export class MandatoryTablesService {

  constructor(
    private appSettings: AppSettings,
    private httpClient: HttpClient
  ) { }

  // BIR
  public async MandatoryBIRList() {
    return this.httpClient.get(this.appSettings.defaultAPIURLHost + '/api/mst/mandatary/bir/list', this.appSettings.defaultOptions);
  }

  public async AddMandatoryBIR(objMandatoryBIR: MandatoryBIR) {
    return this.httpClient.post(this.appSettings.defaultAPIURLHost + '/api/mst/mandatary/bir/create', JSON.stringify(objMandatoryBIR), this.appSettings.defaultOptions);
  }

  public async SaveMandatoryBIR(objMandatoryBIR: MandatoryBIR) {
    return this.httpClient.put(this.appSettings.defaultAPIURLHost + '/api/mst/mandatary/bir/update/' + objMandatoryBIR.Id, JSON.stringify(objMandatoryBIR), this.appSettings.defaultOptions);
  }

  public async DeleteMandatoryBIR(id: number) {
    return this.httpClient.delete(this.appSettings.defaultAPIURLHost + '/api/mst/mandatary/bir/delete/' + id, this.appSettings.defaultOptions);
  }

  // HDMF
  public async MandatoryHDMFList() {
    return this.httpClient.get(this.appSettings.defaultAPIURLHost + '/api/mst/mandatary/hdmf/list', this.appSettings.defaultOptions);
  }

  public async AddMandatoryHDMF(objMandatoryHDMF: MandatoryHDMF) {
    return this.httpClient.post(this.appSettings.defaultAPIURLHost + '/api/mst/mandatary/hdmf/create', JSON.stringify(objMandatoryHDMF), this.appSettings.defaultOptions);
  }

  public async SaveMandatoryHDMF(objMandatoryHDMF: MandatoryHDMF) {
    return this.httpClient.put(this.appSettings.defaultAPIURLHost + '/api/mst/mandatary/hdmf/update/' + objMandatoryHDMF.Id, JSON.stringify(objMandatoryHDMF), this.appSettings.defaultOptions);
  }

  public async DeleteMandatoryHDMF(id: number) {
    return this.httpClient.delete(this.appSettings.defaultAPIURLHost + '/api/mst/mandatary/hdmf/delete/' + id, this.appSettings.defaultOptions);
  }

  // PHIC
  public async MandatoryPHICList() {
    return this.httpClient.get(this.appSettings.defaultAPIURLHost + '/api/mst/mandatary/phic/list', this.appSettings.defaultOptions);
  }

  public async AddMandatoryPHIC(objMandatoryPHIC: MandatoryPHIC) {
    return this.httpClient.post(this.appSettings.defaultAPIURLHost + '/api/mst/mandatary/phic/create', JSON.stringify(objMandatoryPHIC), this.appSettings.defaultOptions);
  }

  public async SaveMandatoryPHIC(objMandatoryPHIC: MandatoryPHIC) {
    return this.httpClient.put(this.appSettings.defaultAPIURLHost + '/api/mst/mandatary/phic/update/' + objMandatoryPHIC.Id, JSON.stringify(objMandatoryPHIC), this.appSettings.defaultOptions);
  }

  public async DeleteMandatoryPHIC(id: number) {
    return this.httpClient.delete(this.appSettings.defaultAPIURLHost + '/api/mst/mandatary/phic/delete/' + id, this.appSettings.defaultOptions);
  }

  // SSS
  public async MandatorySSSList() {
    return this.httpClient.get(this.appSettings.defaultAPIURLHost + '/api/mst/mandatary/sss/list', this.appSettings.defaultOptions);
  }

  public async AddMandatorySSS(objMandatorySSS: MandatorySSS) {
    return this.httpClient.post(this.appSettings.defaultAPIURLHost + '/api/mst/mandatary/sss/create', JSON.stringify(objMandatorySSS), this.appSettings.defaultOptions);
  }

  public async SaveMandatorySSS(objMandatorySSS: MandatorySSS) {
    return this.httpClient.put(this.appSettings.defaultAPIURLHost + '/api/mst/mandatary/sss/update/' + objMandatorySSS.Id, JSON.stringify(objMandatorySSS), this.appSettings.defaultOptions);
  }

  public async DeleteMandatorySSS(id: number) {
    return this.httpClient.delete(this.appSettings.defaultAPIURLHost + '/api/mst/mandatary/sss/delete/' + id, this.appSettings.defaultOptions);
  }
}
