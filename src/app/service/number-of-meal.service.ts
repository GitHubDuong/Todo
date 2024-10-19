import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import AppConstant from '@utilities/app-constants';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NumberOfMealService {
  _prefix: string = `${AppConstant.DEFAULT_URLS.API}/NumberOfMeals`;

  constructor(protected httpClient: HttpClient) {}

  getAll(params: any): Observable<any> {
    return this.httpClient.get(`${this._prefix}`, { params });
  }

  getDetail(date: string, type: string) {
    return this.httpClient.get(`${this._prefix}/detail?date=${date}&timeType=${type}`);
  }

  create(body: any): Observable<any> {
    return this.httpClient.post(`${this._prefix}/detail`, body);
  }

  deleteDetail(id: number): Observable<any> {
    return this.httpClient.delete(`${this._prefix}/detail/${id}`);
  }

  refresh(date: any) {
    return this.httpClient.post(`${this._prefix}/meal?date=${date}`, {});
  }
}
