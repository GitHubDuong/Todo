import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TypeData } from '@app/models/common.model';
import { BaseService } from '@app/service/base.service';
import AppConstant from '@utilities/app-constants';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class RequestEquipmentService extends BaseService {
  _prefix = `${AppConstant.DEFAULT_URLS.API}/RequestEquipments`;

  constructor(httpClient: HttpClient) {
    super(httpClient);
  }

  getProcedureNumber() {
    return this.httpClient.get(`${this._prefix}/get-procedure-number`);
  }

  getGoodType(): Observable<TypeData<any>> {
    return this.httpClient.get<TypeData<any>>(`${this._prefix}/get-good-type`);
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

  accept(id: number) {
    return this.httpClient.put(`${this._prefix}/accept/${id}`, {});
  }

  notAccept(id: number) {
    return this.httpClient.put(`${this._prefix}/not-accept/${id}`, {});
  }

  public uploadFile(formData: any): Observable<any> {
    return this.httpClient.post(`${this._prefix}/uploadfile`, formData).pipe(
      map((comment: any) => {
        return comment;
      }),
    );
  }
  all() {
    return this.httpClient.get(`${this._prefix}/list`);
  }
}
