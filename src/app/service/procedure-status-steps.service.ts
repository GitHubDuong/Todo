import { Injectable } from '@angular/core';
import AppConstant from '../utilities/app-constants';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

let _prefix = `${AppConstant.DEFAULT_URLS.API}/ProcedureStatusSteps`;
let _dePrefix = `${AppConstant.DEFAULT_URLS.API}/ProcedureStatus/list`;
let _conditionfix = `${AppConstant.DEFAULT_URLS.API}/ProcedureConditions`;
@Injectable({
  providedIn: 'root',
})
export class ProcedureStatusStepsService {
  constructor(private readonly httpClient: HttpClient) {}

  public getProcedureStepDetail(id: any): Observable<any> {
    return this.httpClient.get(`${_prefix}/${id}`).pipe(
      map((res: any) => {
        return res;
      }),
    );
  }

  public createProcedureStep(id: any, procedure: any): Observable<any | null> {
    return this.httpClient.post(`${_prefix}/${id}`, procedure).pipe(
      map((res: any) => {
        return res;
      }),
    );
  }

  public getListStatus(id: any): Observable<any | null> {
    return this.httpClient.get(`${_dePrefix}/${id}`).pipe(
      map((res: any) => {
        return res;
      }),
    );
  }

  public getListCondition(procedureCode: any): Observable<any | null> {
    return this.httpClient.get(`${_conditionfix}/list?procedureCode=${procedureCode}`).pipe(
      map((res: any) => {
        return res;
      }),
    );
  }
}
