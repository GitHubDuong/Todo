import { Injectable } from '@angular/core';
import AppConstant from '../utilities/app-constants';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

let _prefix = `${AppConstant.DEFAULT_URLS.API}/ProcedureRequestOvertimes`;

@Injectable({
  providedIn: 'root',
})
export class ProcedureRequestOvertimesService {
  constructor(private readonly httpClient: HttpClient) { }

  public getProcedureRequestOvertimes(params?: any): Observable<any> {
    return this.httpClient.get(`${_prefix}`, { params }).pipe(
      map((res: any) => {
        return res;
      }),
    );
  }

  public getProcedureRequestOvertimesDetail(id: any): Observable<any> {
    return this.httpClient.get(`${_prefix}/${id}`).pipe(
      map((res: any) => {
        return res;
      }),
    );
  }

  public createProcedureRequestOvertimes(
    ProcedureRequestOvertimes: any,
  ): Observable<any | null> {
    return this.httpClient.post(`${_prefix}`, ProcedureRequestOvertimes).pipe(
      map((res: any) => {
        return res;
      }),
    );
  }

  public updateProcedureRequestOvertimes(
    id: number,
    ProcedureRequestOvertimes: any,
  ): Observable<any> {
    const url: string = `${_prefix}/${id}`;
    return this.httpClient.put(url, ProcedureRequestOvertimes).pipe(
      map((res: any) => {
        return res;
      }),
    );
  }

  public deleteProcedureRequestOvertimes(id: number): Observable<any | null> {
    const url: string = `${_prefix}/${id}`;
    return this.httpClient.delete(url).pipe(
      map((res: any) => {
        return res;
      }),
    );
  }

  public getProcedureNumber() {
    return this.httpClient.get(`${_prefix}/get-procedure-number`, {
      responseType: "text"
    }).pipe(
      map((res: any) => {
        return res;
      }),
    );
  }

  public approveProcedureRequestOvertimes(id: number): Observable<any> {
    const url: string = `${_prefix}/accept/${id}`;
    return this.httpClient.put(url, {}).pipe(
      map((res: any) => {
        return res;
      }),
    );
  }
  public notAccept(id: number): Observable<any> {
    const url: string = `${_prefix}/not-accept/${id}`;
    return this.httpClient.put(url, {}).pipe(
      map((res: any) => {
        return res;
      }),
    );
  }
}
