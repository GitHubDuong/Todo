import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import AppConstant from '@utilities/app-constants';
import { Observable } from 'rxjs';

let _prefix = `${AppConstant.DEFAULT_URLS.API}/DriverRouters`;

@Injectable({
  providedIn: 'root',
})
export class DriverRouterService {
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

  start(id: number) {
    return this.httpClient.post(`${_prefix}/start?petrolConsumptionId=${id}`, null);
  }

  stop(id: number) {
    return this.httpClient.post(`${_prefix}/finish?petrolConsumptionId=${id}`, null);
  }

  getListPolicePoint(id: number) {
    return this.httpClient.get(`${_prefix}/list/police-point/${id}`);
  }
}