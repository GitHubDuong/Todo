import { Injectable } from '@angular/core';
import AppConstant from '../utilities/app-constants';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

let _prefix = `${AppConstant.DEFAULT_URLS.API}/Shifts`;
@Injectable({
  providedIn: 'root',
})
export class ShiftService {
  constructor(private readonly httpClient: HttpClient) {}

  public getShifts(params?: any): Observable<any> {
    return this.httpClient.get(`${_prefix}`, { params }).pipe(
      map((res: any) => {
        return res;
      }),
    );
  }

  public getShiftDetail(id: any): Observable<any> {
    return this.httpClient.get(`${_prefix}/${id}`).pipe(
      map((res: any) => {
        return res;
      }),
    );
  }

  public createShift(Shift: any): Observable<any | null> {
    return this.httpClient.post(`${_prefix}`, Shift).pipe(
      map((res: any) => {
        return res;
      }),
    );
  }

  public updateShift(id: number, Shift: any): Observable<any> {
    const url: string = `${_prefix}/${id}`;
    return this.httpClient.put(url, Shift).pipe(
      map((res: any) => {
        return res;
      }),
    );
  }

  public deleteShift(id: number): Observable<any | null> {
    const url: string = `${_prefix}/${id}`;
    return this.httpClient.delete(url).pipe(
      map((res: any) => {
        return res;
      }),
    );
  }
}
