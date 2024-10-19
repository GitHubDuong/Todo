import { Page, TypeData } from "../models/common.model";
import AppConstant from "../utilities/app-constants";
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { SalaryUserVersionModel } from "../models/salary-user-version.model";

export interface PageFilterSalaryHistory extends Page {
}

let _prefix = `${AppConstant.DEFAULT_URLS.API}/SalaryUserVersions`;

@Injectable({
  providedIn: 'root',
})
export class SalaryHistoryService {
  constructor(
    private readonly httpClient: HttpClient
  ) {
  }

  public getListSalaryHistory(params?: any): Observable<TypeData<SalaryUserVersionModel>> {
    return this.httpClient.get(`${_prefix}`, {params}).pipe(
      map((data: TypeData<SalaryUserVersionModel>) => {
        return data;
      }),
    );
  }

  public getDetail(id: number): Observable<SalaryUserVersionModel> {
    const url: string = `${_prefix}/${id}`;
    return this.httpClient.get(url, {}).pipe(
      map((data: SalaryUserVersionModel) => {
        return data;
      }),
    );
  }

  public createSalaryHistory(body: any): Observable<any | null> {
    return this.httpClient.post(`${_prefix}`, body).pipe(
      map((data: any) => {
        return data;
      }),
    );
  }

  public updateSalaryHistory(id: number, body: any): Observable<any> {
    const url: string = `${_prefix}/${id}`;
    return this.httpClient.put(url, body).pipe(
      map((data: any) => {
        return data;
      }),
    );
  }

  public deleteSalaryHistory(id: number): Observable<SalaryUserVersionModel | null> {
    const url: string = `${_prefix}/${id}`;
    return this.httpClient.delete(url, {}).pipe(
      map((data: SalaryUserVersionModel) => {
        return data;
      }),
    );
  }
}