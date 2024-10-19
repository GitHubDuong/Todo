import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import AppConstant from '../utilities/app-constants';
import { CreateProduceProductsModel } from "@app/models/website-orders.model";

let _prefix = `${AppConstant.DEFAULT_URLS.API}/ManufactureOrders`;

@Injectable({
  providedIn: 'root',
})
export class ManufactureOrderService {
  constructor(private httpClient: HttpClient) {}

  getAll(): Observable<any> {
    return this.httpClient.get(`${_prefix}/list`);
  }

  public createProductionOrder(
    params: CreateProduceProductsModel | any,
  ): Observable<any> {
    return this.httpClient.post(`${_prefix}`, params);
  }

  public updateProductionOrder(id: number, params: CreateProduceProductsModel | any): Observable<any> {
    return this.httpClient.put(`${_prefix}/${id}`, params);
  }

  public getPaging(params: any): Observable<any> {
    return this.httpClient
      .get(`${_prefix}`, { params })
      .pipe(
        map((product: any) => {
          return product;
        }),
      );
  }

  public create(
    params: any,
  ): Observable<any> {
    return this.httpClient.post(`${_prefix}`, params);
  }

  public update(
    params: any,
  ): Observable<any> {
    return this.httpClient.put(`${_prefix}/${params.id}`, params);
  }

  public getDetail(id: number): Observable<any> {
    return this.httpClient.get(`${_prefix}/${id}`).pipe(
      map((product: any) => {
        return product;
      }),
    );
  }

  public updateCanceledNote(
    params: any,
  ): Observable<any> {
    return this.httpClient.post(`${_prefix}/paging-manufacture/${params.id}`, params);
  }

  public accept(
    id: any,
  ): Observable<any> {
    return this.httpClient.put(`${_prefix}/accept/${id}`, {});
  }
  public updateProduceOrder(
    params: any,
  ): Observable<any> {
    return this.httpClient.put(`${_prefix}/update/${params.id}`, params);
  }

  public notAccept(
    id: any,
  ): Observable<any> {
    return this.httpClient.put(`${_prefix}/not-accept/${id}`, {});
  }

  public delete(
    id: any,
  ): Observable<any> {
    return this.httpClient.delete(`${_prefix}/${id}`, {});
  }

  public export(id: number): Observable<any> {
    const url: string = `${_prefix}/export/${id}`;
    return this.httpClient.post(url, {}).pipe(
      map((res: any) => {
        return res;
      }),
    );
  }
}
