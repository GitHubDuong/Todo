import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import AppConstant from '@utilities/app-constants';
import { Observable } from 'rxjs';

let _prefix = `${AppConstant.DEFAULT_URLS.API}/LedgerProduceImports`;
let _procedurePrefix = `${AppConstant.DEFAULT_URLS.API}/PlanningProduceProducts`;
@Injectable({
  providedIn: 'root',
})
export class ImportProcessService {
  constructor(private httpClient: HttpClient) {}

  create(body: any) {
    return this.httpClient.post(`${_prefix}`, body);
  }

  getByPage(params: any): Observable<any> {
    return this.httpClient.get(`${_prefix}`, { params });
  }

  getById(id: number): Observable<any> {
    return this.httpClient.get(`${_prefix}/${id}`);
  }

  update(id: number, body: any) {
    return this.httpClient.put(`${_prefix}/${id}`, body);
  }

  delete(id: number) {
    return this.httpClient.delete(`${_prefix}/${id}`);
  }

  getAll() {
    const body = { Page: 0, PageSize: 1000 };
    return this.getByPage(body);
  }

  accept(id) {
    return this.httpClient.put(`${_prefix}/accept/${id}`, {});
  }

  export(id: any) {
    return this.httpClient.post(`${_prefix}/export/${id}`, {});
  }

  uploadDocument(id: any, file: any) {
    const formData = new FormData();
    formData.append('files', file);
    return this.httpClient.post(`${_prefix}/uploadfile/${id}`, formData);
  }

  notAccept(id) {
    return this.httpClient.put(`${_prefix}/not-accept/${id}`, {});
  }

  createProcedure(body: { note: any; id: any; items: any }) {
    return this.httpClient.post(`${_procedurePrefix}/ledger-import`, body);
  }
}
