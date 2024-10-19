import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import AppConstant from '@utilities/app-constants';

let _prefix = `${AppConstant.DEFAULT_URLS.API}/ConfigDiscounts`;

@Injectable({
  providedIn: 'root',
})
export class SaleDiscountService {
  constructor(private httpClient: HttpClient) {}

  create(body: any) {
    return this.httpClient.post(`${_prefix}`, body);
  }

  getByPage(params: any) {
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
}
