import { Injectable } from '@angular/core';
import AppConstant from '../utilities/app-constants';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

let _prefix = `${AppConstant.DEFAULT_URLS.API}/IntroduceTypes`;

@Injectable({
  providedIn: 'root',
})
export class StandardFormService {
  constructor(private readonly httpClient: HttpClient) {}

  public createIntroduceType(request: any): Observable<any | null> {
    return this.httpClient.post(`${_prefix}`, request).pipe(
      map((res: any) => {
        return res;
      }),
    );
  }


  public getIntroduceType(params?: any): Observable<any> {
    return this.httpClient.get(`${_prefix}`, { params }).pipe(
      map((res: any) => {
        return res;
      }),
    );
  }
}
