import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import AppConstant from '@utilities/app-constants';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

let _prefix = `${AppConstant.DEFAULT_URLS.API}/CarLocations`;

@Injectable({
  providedIn: 'root',
})
export class CarLocationService {
  constructor(private httpClient: HttpClient) {}

  create(body: any) {
    return this.httpClient.post(`${_prefix}`, body);
  }

  getByPage(params: any): Observable<any> {
    return this.httpClient.get(`${_prefix}`, { params });
  }

  getById(id: number): Observable<any> {
    return this.httpClient.get(`${_prefix}/${id}`);
  }

  update(id: number, body: any) {
    return this.httpClient.put(`${_prefix}/${id}`, body);
  }

  delete(id: number) {
    return this.httpClient.delete(`${_prefix}/${id}`);
  }

  getAll() {
    const body = { Page: 0, PageSize: 1000 };
    return this.getByPage(body);
  }

  getProcedureCode(): Observable<any> {
    return this.httpClient.get(`${_prefix}/get-procedure-number`);
  }

  public accept(id: any): Observable<any> {
    return this.httpClient.put(`${_prefix}/accept/${id}`, {});
  }

  public notAccept(id: any): Observable<any> {
    return this.httpClient.put(`${_prefix}/not-accept/${id}`, {});
  }

  export(id: number): Observable<any> {
    return this.httpClient.post(`${_prefix}/export/${id}`, {});
  }

  public uploadFile(formData: any): Observable<any> {
    return this.httpClient.post(`${_prefix}/uploadfile`, formData).pipe(
      map((comment: any) => {
        return comment;
      }),
    );
  }
}
