import { Injectable } from '@angular/core';
import AppConstant from '../utilities/app-constants';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Page } from '../models/common.model';
import { map, Observable } from 'rxjs';

let _prefix = `${AppConstant.DEFAULT_URLS.API}/WebMails`;

@Injectable({
  providedIn: 'root',
})
export class WebMailService {
  constructor(private readonly httpClient: HttpClient) {}

  public getList(params?: any): Observable<any> {
    return this.httpClient.get(`${_prefix}`, { params }).pipe(
      map((webMails: any) => {
        return webMails;
      }),
    );
  }
}
