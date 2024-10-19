import { Injectable } from '@angular/core';
import { BaseProduceService } from "@app/service/produces/base-produce.service";
import { HttpClient } from "@angular/common/http";
import AppConstant from "@utilities/app-constants";
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AdvancedPaymentService extends BaseProduceService{
  _prefix: string = `${AppConstant.DEFAULT_URLS.API}/AdvancePayments`;
  constructor(protected httpService: HttpClient) {
    super(httpService)
  }

  getAll(query: any): Observable<any> {
    const params = {
      ...query,
      fromAt: query.fromAt ? query.fromAt.toISOString() : null,
      toAt: query.toAt ? query.toAt.toISOString() : null,
    };
    for (let key in params) {
      if (params[key] === null || params[key] === undefined) {
        delete params[key];
      }
    }
    return this.httpClient.get(`${this._prefix}`, { params });
  }

  public uploadFile(formData: any): Observable<any> {
    return this.httpClient.post(`${this._prefix}/uploadfile`, formData).pipe(
      map((comment: any) => {
        return comment;
      }),
    );
  }
  all(){
    return this.httpClient.get(`${this._prefix}/list`);
  }
}
