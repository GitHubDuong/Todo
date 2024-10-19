import { Injectable } from '@angular/core';
import AppConstant from '../utilities/app-constants';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

let _prefix = `${AppConstant.DEFAULT_URLS.API}/Procedures`;

@Injectable({
  providedIn: 'root',
})
export class ProcedureService {
  constructor(private readonly httpClient: HttpClient) {}

  public getProcedures(params?: any): Observable<any> {
    return this.httpClient.get(`${_prefix}`, { params }).pipe(
      map((res: any) => {
        return res;
      }),
    );
  }

  public getProcedureList(): Observable<any> {
    return this.httpClient.get(`${_prefix}/list`).pipe(
      map((res: any) => {
        return res;
      }),
    );
  }

  public getProcedureDetail(id: any): Observable<any> {
    return this.httpClient.get(`${_prefix}/${id}`).pipe(
      map((res: any) => {
        return res;
      }),
    );
  }

  public createProcedure(procedure: any): Observable<any | null> {
    return this.httpClient.post(`${_prefix}`, procedure).pipe(
      map((res: any) => {
        return res;
      }),
    );
  }

  public updateProcedure(id: number, procedure: any): Observable<any> {
    const url: string = `${_prefix}/${id}`;
    return this.httpClient.put(url, procedure).pipe(
      map((res: any) => {
        return res;
      }),
    );
  }

  public deleteProcedure(id: number): Observable<any | null> {
    const url: string = `${_prefix}/${id}`;
    return this.httpClient.delete(url, {}).pipe(
      map((res: any) => {
        return res;
      }),
    );
  }

  countProcedure(): Observable<any> {
    return this.httpClient.get(`${_prefix}/count-procedure`);
  }
}
