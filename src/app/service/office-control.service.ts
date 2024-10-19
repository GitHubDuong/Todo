import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import AppConstant from '../utilities/app-constants';

let _prefix = `${AppConstant.DEFAULT_URLS.API}/StationeryImports`;
@Injectable({
  providedIn: 'root',
})
export class OfficeControlService {
  constructor(private httpClient: HttpClient) {}

  addOffice(body): Observable<any> {
    const addStationerie = `${_prefix}`;
    return this.httpClient.post(addStationerie, body);
  }

  updateOffice(body): Observable<any> {
    const addStationerie = `${_prefix}/${body?.id}`;
    return this.httpClient.put(addStationerie, body);
  }

  getListOffice(params): Observable<any> {
    const url = `${_prefix}`;
    return this.httpClient.get(url, { params });
  }
  getDetailOffice(id): Observable<any> {
    const url = `${_prefix}/${id}`;
    return this.httpClient.get(url);
  }

  saveOffice(params): Observable<any> {
    const url = `${_prefix}/${params?.id}`;
    return this.httpClient.put(url, params);
  }

  deleteOffice(params): Observable<any> {
    const url = `${_prefix}/${params?.id}`;
    return this.httpClient.delete(url, {});
  }

  getProcedureNumber(): Observable<any> {
    const url = `${_prefix}/get-procedure-number`;
    return this.httpClient.get(
      'https://asianasa.com:8443/api/StationeryImports/get-procedure-number',
    );
  }
}
