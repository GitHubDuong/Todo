import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import AppConstant from '@utilities/app-constants';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

let _prefix = `${AppConstant.DEFAULT_URLS.API}/ExpenditurePlans`;

@Injectable({
  providedIn: 'root',
})
export class ExpenditurePlanService {
  constructor(private http: HttpClient) {}

  create(body: any) {
    return this.http.post(_prefix, body);
  }

  update(id, body: any) {
    return this.http.put(`${_prefix}/${id}`, body);
  }

  getByPage(params: any) {
    return this.http.get(`${_prefix}`, { params });
  }

  getAll(): Observable<any> {
    return this.http.get(`${_prefix}/list`);
  }

  getById(id: number) {
    return this.http.get(`${_prefix}/${id}`);
  }

  delete(id: number) {
    return this.http.delete(`${_prefix}/${id}`);
  }

  accept(id: number) {
    return this.http.put(`${_prefix}/accept/${id}`, null);
  }

  notAccept(id: number) {
    return this.http.put(`${_prefix}/not-accept/${id}`, null);
  }

  updateExpenditurePlan(id, body: any) {
    return this.http.put(`${_prefix}/expenditure-plan/${id}`, body);
  }

  public uploadFile(formData: any): Observable<any> {
    return this.http.post(`${_prefix}/uploadfile`, formData).pipe(
      map((comment: any) => {
        return comment;
      }),
    );
  }

  export(id: number): Observable<any>  {
    return this.http.post(`${_prefix}/export/${id}`, {});
  }
  exportAdvance(id: number): Observable<any>  {
    return this.http.post(`${_prefix}/export-advance/${id}`, {});
  }
}
