import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { TypeData } from '../models/common.model';
import { EndOfTermEnding } from '../models/end-of-term-ending';
import AppConstant from '../utilities/app-constants';

let _prefix = `${AppConstant.DEFAULT_URLS.API}/FinalStandard`;

@Injectable({
  providedIn: 'root',
})
export class EndOfTermEndingService {
  constructor(private readonly httpClient: HttpClient) {}

  getListEndOfTermEnding(params): Observable<any> {
    return this.httpClient.get(`${_prefix}`, { params }).pipe(
      map((data: TypeData<EndOfTermEnding>) => {
        return data;
      }),
    );
  }

  getEndOfTermEndingByID(id): Observable<any> {
    return this.httpClient.get(`${_prefix}/${id}`);
  }

  getDetails(ids: number[]) {
    const params = {
      listIDFinal: ids,
      Page: 0,
      PageSize: 1000,
    };
    return this.httpClient.get(`${_prefix}/GetDetails`, { params });
  }

  saveEndOfTerm(isInternal: number, data: any[]) {
    return this.httpClient.post(`${_prefix}/ledger?isInternal=${isInternal}`, data);
  }

  createEndOfTermEnding(body): Observable<any> {
    return this.httpClient.post(`${_prefix}`, body);
  }

  updateEndOfTermEnding(id, body): Observable<any> {
    return this.httpClient.put(`${_prefix}/${id}`, body);
  }

  deleteEndOfTermEnding(id): Observable<any> {
    return this.httpClient.delete(`${_prefix}/${id}`);
  }
}
