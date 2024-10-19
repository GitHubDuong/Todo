import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import AppConstant from '@utilities/app-constants';
import { Observable } from 'rxjs';

let _prefix = `${AppConstant.DEFAULT_URLS.API}/LedgerProcedurePayments`;

@Injectable({
  providedIn: 'root',
})
export class LedgerPaymentService {
  constructor(private httpClient: HttpClient) {}

  create(body: any) {
    return this.httpClient.post(`${_prefix}`, body);
  }

  getByPage(params: any): Observable<any> {
    return this.httpClient.get(`${_prefix}`, { params });
  }

  getById(id: number) {
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

  notAccept(id) {
    return this.httpClient.put(`${_prefix}/not-accept/${id}`, {});
  }

  export(id: any) {
    return this.httpClient.post(`${_prefix}/export/${id}`, {});
  }

  uploadDocument(id: any, file: any) {
    const formData = new FormData();
    formData.append('files', file);
    return this.httpClient.post(`${_prefix}/uploadfile/${id}`, formData);
  }
}
