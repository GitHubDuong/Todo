import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import AppConstant from '@utilities/app-constants';
import { Observable } from 'rxjs';

let _prefix = `${AppConstant.DEFAULT_URLS.API}/OrderProduceProducts`;

@Injectable({
  providedIn: 'root',
})
export class OrderQuoteService {
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

  getAll(): Observable<any> {
    return this.httpClient.get(`${_prefix}/list`);
  }

  report(params: any): Observable<any> {
    return this.httpClient.get(`${_prefix}/report`, { params });
  }

  reportExport(params: any): Observable<any> {
    return this.httpClient.get(`${_prefix}/report-export`, { params });
  }
}
