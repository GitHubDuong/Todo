import { Injectable } from '@angular/core';
import { BaseService } from "@app/service/base.service";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export abstract class BaseProduceService extends BaseService {
  abstract _prefix: string;
  protected constructor(protected httpClient: HttpClient) {
    super(httpClient);
  }

  getProcedureNumber() {
    return this.httpClient.get(`${this._prefix}/get-procedure-number`)
  }

  public accept(id: any): Observable<any> {
    return this.httpClient.put(`${this._prefix}/accept/${id}`, {});
  }

  public notAccept(id: any): Observable<any> {
    return this.httpClient.put(`${this._prefix}/not-accept/${id}`, {});
  }

}
