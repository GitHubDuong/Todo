import { Injectable } from '@angular/core';
import AppConstant from '../utilities/app-constants';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

let _prefix = `${AppConstant.DEFAULT_URLS.API}/WorkingDays`;
@Injectable({
  providedIn: 'root',
})
export class WorkingDaysService {
  constructor(private readonly httpClient: HttpClient) {}

  public getWorkingDays(params?: any): Observable<any> {
    return this.httpClient.get(`${_prefix}`, { params }).pipe(
      map((res: any) => {
        return res;
      }),
    );
  }

  public getWorkingDayDetail(id: any): Observable<any> {
    return this.httpClient.get(`${_prefix}/${id}`).pipe(
      map((res: any) => {
        return res;
      }),
    );
  }

  public createWorkingDay(WorkingDay: any): Observable<any | null> {
    return this.httpClient.post(`${_prefix}`, WorkingDay).pipe(
      map((res: any) => {
        return res;
      }),
    );
  }

  public updateWorkingDay(id: number, WorkingDay: any): Observable<any> {
    const url: string = `${_prefix}/${id}`;
    return this.httpClient.put(url, WorkingDay).pipe(
      map((res: any) => {
        return res;
      }),
    );
  }

  public deleteWorkingDay(id: number): Observable<any | null> {
    const url: string = `${_prefix}/${id}`;
    return this.httpClient.delete(url).pipe(
      map((res: any) => {
        return res;
      }),
    );
  }
}
