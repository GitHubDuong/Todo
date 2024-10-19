import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { ICrudMethod } from "@app/models/crud-method.model";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})

export abstract class BaseService implements ICrudMethod {
  protected abstract _prefix: string;
  protected constructor(protected httpClient: HttpClient) { }

  create(body: any): Observable<any>  {
    return this.httpClient.post(this._prefix, body)
  }

  update(id: number, body: any): Observable<any> {
    return this.httpClient.put(`${this._prefix}/${id}`, body);
  }

  get(id: number): Observable<any>  {
    return this.httpClient.get(`${this._prefix}/${id}`);
  }

  getAll(params: any): Observable<any>  {
    return this.httpClient.get(`${this._prefix}`,  { params });
  }

  delete(id: number): Observable<any>  {
    return this.httpClient.delete(`${this._prefix}/${id}`);
  }

  export(id: number): Observable<any>  {
    return this.httpClient.post(`${this._prefix}/export/${id}`, {});
  }
}
