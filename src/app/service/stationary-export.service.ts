import { Injectable } from '@angular/core';
import AppConstant from '../utilities/app-constants';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

let _prefix = `${AppConstant.DEFAULT_URLS.API}/StationeryExports`;

@Injectable({
  providedIn: 'root',
})
export class StationaryExportService {
  constructor(private readonly httpClient: HttpClient) {}

  public getListStationaryExports(params?: any): Observable<any> {
    return this.httpClient.get(`${_prefix}`, { params }).pipe(
      map((res: any) => {
        return res;
      }),
    );
  }

  public createStationaryExport(quota: any): Observable<any | null> {
    return this.httpClient.post(`${_prefix}`, quota).pipe(
      map((res: any) => {
        return res;
      }),
    );
  }

  public deleteStationaryExport(id: number): Observable<any | null> {
    const url: string = `${_prefix}/${id}`;
    return this.httpClient.delete(url, {}).pipe(
      map((res: any) => {
        return res;
      }),
    );
  }

  public updateStationaryExport(id: number, Quota: any): Observable<any> {
    const url: string = `${_prefix}/${id}`;
    return this.httpClient.put(url, Quota).pipe(
      map((res: any) => {
        return res;
      }),
    );
  }

  public getStationaryExport(id: number): Observable<any> {
    const url: string = `${_prefix}/${id}`;
    return this.httpClient.get(url, {}).pipe(
      map((res: any) => {
        return res;
      }),
    );
  }
}
