import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import AppConstant from "@app/utilities/app-constants";
import { Observable, map } from "rxjs";

let _prefix = `${AppConstant.DEFAULT_URLS.API}/WarehouseProduceProducts`;


@Injectable({
    providedIn: 'root',
  })
  export class ProducePlanningWarehouseService {
    constructor(private readonly httpClient: HttpClient) {}

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

    public accept(
        id: any,
      ): Observable<any> {
        return this.httpClient.put(`${_prefix}/accept/${id}`, {});
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
}
