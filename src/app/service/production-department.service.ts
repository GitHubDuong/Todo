import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import AppConstant from '@utilities/app-constants';
import { OrderStatus } from '@utilities/app-enum';
import { map } from 'rxjs/operators';

const _prefix = `${AppConstant.DEFAULT_URLS.API}/ProduceProducts`;

@Injectable({ providedIn: 'root' })
export class ProductionDepartmentService {
  constructor(private httpClient: HttpClient) {}

  getByPage(params: any) {
    return this.httpClient.get(_prefix, { params }).pipe(
      map((data: any) => {
        return data;
      }),
    );
  }

  getById(id) {
    return this.httpClient.get(`${_prefix}/${id}`).pipe(
      map((data: any) => {
        return data;
      }),
    );
  }

  update(data: any) {
    return this.httpClient.put(`${_prefix}/${data.id}`, data).pipe(
      map((data: any) => {
        return data;
      }),
    );
  }

  delete(id: number) {
    return this.httpClient.delete(`${_prefix}/${id}`).pipe(
      map((data: any) => {
        return data;
      }),
    );
  }

  accept(id: number) {
    return this.httpClient.put(`${_prefix}/accept/${id}`, null).pipe(
      map((data: any) => {
        return data;
      }),
    );
  }

  notAccept(id: number) {
    return this.httpClient.put(`${_prefix}/not-accept/${id}`, null).pipe(
      map((data: any) => {
        return data;
      }),
    );
  }

  ledgerImport(id: number) {
    return this.httpClient.post(`${_prefix}/ledger-import/${id}`, null).pipe(
      map((data: any) => {
        return data;
      }),
    );
  }

  ledgerExport(id: number) {
    return this.httpClient.post(`${_prefix}/ledger-export/${id}`, null).pipe(
      map((data: any) => {
        return data;
      }),
    );
  }

  getAll() {
    const params = {
      Page: 0,
      PageSize: 1000,
      StatusTab: OrderStatus.All,
    };
    return this.getByPage(params);
  }
}
