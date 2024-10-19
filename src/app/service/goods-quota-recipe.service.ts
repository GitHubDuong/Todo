import { Injectable } from '@angular/core';
import AppConstant from '../utilities/app-constants';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

let _prefix = `${AppConstant.DEFAULT_URLS.API}/GoodsQuotaRecipes`;

@Injectable({
  providedIn: 'root',
})
export class GoodsQuotaRecipeService {
  constructor(private readonly httpClient: HttpClient) {}

  public getGoodsQuotaRecipes(params?: any): Observable<any> {
    return this.httpClient.get(`${_prefix}`, { params }).pipe(
      map((res: any) => {
        return res;
      }),
    );
  }

  public createGoodsQuotaRecipe(quota: any): Observable<any | null> {
    return this.httpClient.post(`${_prefix}`, quota).pipe(
      map((res: any) => {
        return res;
      }),
    );
  }

  public deleteGoodsQuotaRecipe(id: number): Observable<any | null> {
    const url: string = `${_prefix}/${id}`;
    return this.httpClient.delete(url, {}).pipe(
      map((res: any) => {
        return res;
      }),
    );
  }

  public updateGoodsQuotaRecipe(id: number, Quota: any): Observable<any> {
    const url: string = `${_prefix}/${id}`;
    return this.httpClient.put(url, Quota).pipe(
      map((res: any) => {
        return res;
      }),
    );
  }

  public getListGoodsQuotaRecipes(): Observable<any> {
    return this.httpClient.get(`${_prefix}/list`).pipe(
      map((res: any) => {
        return res;
      }),
    );
  }
}
