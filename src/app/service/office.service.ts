import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import AppConstant from '../utilities/app-constants';

let _prefix = `${AppConstant.DEFAULT_URLS.API}/Stationeries`;
@Injectable({
  providedIn: 'root',
})
export class OfficeService {
  constructor(private httpClient: HttpClient) {}

  addStationerie(body): Observable<any> {
    const addStationerie = `${_prefix}`;
    return this.httpClient.post(addStationerie, body);
  }

  getListStationerie(params): Observable<any> {
    const url = `${_prefix}`;
    return this.httpClient.get(url, { params });
  }

  saveSationerie(params): Observable<any> {
    const url = `${_prefix}/${params?.id}`;
    return this.httpClient.put(url, params);
  }

  deleteSationerie(params): Observable<any> {
    const url = `${_prefix}/${params?.id}`;
    return this.httpClient.delete(url, {});
  }

  getAllStationer(): Observable<any> {
    const url = `${_prefix}/list`;
    return this.httpClient.get(url, {});
  }
}
