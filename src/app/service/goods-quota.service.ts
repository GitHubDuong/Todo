import { Injectable } from '@angular/core';
import AppConstant from '../utilities/app-constants';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';

let _prefix = `${AppConstant.DEFAULT_URLS.API}/GoodsQuotas`;

@Injectable({
  providedIn: 'root',
})
export class GoodsQuotaService {
  constructor(private readonly httpClient: HttpClient) {}

  public getGoodsQuota(params?: any): Observable<any> {
    return this.httpClient.get(`${_prefix}`, { params }).pipe(
      map((res: any) => {
        return res;
      }),
    );
  }

  public getGoodsQuotaDetail(id: any): Observable<any> {
    return this.httpClient.get(`${_prefix}/${id}`).pipe(
      map((res: any) => {
        return res;
      }),
    );
  }

  public createGoodsQuota(quota: any): Observable<any | null> {
    return this.httpClient.post(`${_prefix}`, quota).pipe(
      map((res: any) => {
        return res;
      }),
    );
  }

  public updateGoodsQuota(id: number, Quota: any): Observable<any> {
    const url: string = `${_prefix}/${id}`;
    return this.httpClient.put(url, Quota).pipe(
      map((res: any) => {
        return res;
      }),
    );
  }

  public updateGoodsQuotaForGoodDetail(
    id: any,
    listGood: any,
  ): Observable<any | null> {
    const options = {
      params: new HttpParams({ fromObject: { goodsQuotaId: id } }),
    };
    return this.httpClient
      .post(`${_prefix}/goods-quota-for-goods-detail`, listGood, options)
      .pipe(
        map((res: any) => {
          return res;
        }),
      );
  }
}
