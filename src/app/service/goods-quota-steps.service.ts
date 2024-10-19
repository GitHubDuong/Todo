import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { map } from "rxjs";
import AppConstant from "@utilities/app-constants";

const _prefix: string = `${AppConstant.DEFAULT_URLS.API}/GoodsQuotaSteps`;

@Injectable({
  providedIn: 'root'
})
export class GoodsQuotaStepsService {
  constructor(private readonly httpClient: HttpClient) {
  }

  getAll(params: any) {
    return this.httpClient.get(`${_prefix}`, { params }).pipe(
      map((res: any) => {
        return res;
      }),
    );
  }

  getAllNoneQuery() {
    return this.httpClient.get(`${_prefix}/list`, ).pipe(
      map((res: any) => {
        return res;
      }),
    );
  }

  getById(id: number) {
    return this.httpClient.get(`${_prefix}/${id}`).pipe(
      map((res: any) => {
        return res;
      }),
    );
  }

  create(requestBody: any) {
    return this.httpClient.post(`${_prefix}`, requestBody).pipe(
      map((res: any) => {
        return res;
      }),
    );
  }

  update(id: number, requestBody: any) {
    return this.httpClient.put(`${_prefix}/${id}`, requestBody).pipe(
      map((res: any) => {
        return res;
      }),
    );
  }

  delete(id: number) {
    return this.httpClient.delete(`${_prefix}/${id}`).pipe(
      map((res: any) => {
        return res;
      }),
    );
  }
}
