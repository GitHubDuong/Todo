import { Injectable } from '@angular/core';
import AppConstant from '../utilities/app-constants';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

let _prefix = `${AppConstant.DEFAULT_URLS.API}/ProcedureChangeShifts`;

@Injectable({
  providedIn: 'root',
})
export class ProcedureChangeShiftService {
  constructor(private readonly httpClient: HttpClient) { }

  public getProcedureChangeShifts(params?: any): Observable<any> {
    return this.httpClient.get(`${_prefix}`, { params }).pipe(
      map((res: any) => {
        return res;
      }),
    );
  }

  public getProcedureChangeShiftDetail(id: any): Observable<any> {
    return this.httpClient.get(`${_prefix}/${id}`).pipe(
      map((res: any) => {
        return res;
      }),
    );
  }

  public createProcedureChangeShift(
    ProcedureRequestOvertimes: any,
  ): Observable<any | null> {
    return this.httpClient.post(`${_prefix}`, ProcedureRequestOvertimes).pipe(
      map((res: any) => {
        return res;
      }),
    );
  }

  public updateProcedureChangeShift(
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

  public deleteProcedureChangeShift(id: number): Observable<any | null> {
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
}
