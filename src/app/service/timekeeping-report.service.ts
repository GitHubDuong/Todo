import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import AppConstant from '../utilities/app-constants';
import { UnitConvention } from "@app/models/unit.model";
import { TimekeepingReportModel } from "@app/models/timekeeping-report.model";
import { map } from "rxjs/operators";
import { TypeData } from "@app/models/common.model";
import { SurchargeModel } from "@app/models/sur-charge.model";

let _prefix = `${AppConstant.DEFAULT_URLS.API}/InOut`;

@Injectable({
  providedIn: 'root',
})
export class TimekeepingReportService {
  constructor(private readonly httpClient: HttpClient) {}

  getAllReport(params?): Observable<any> {
    return this.httpClient.post(`${_prefix}/report`, params);
  }

  exportExcel(params?): Observable<any> {
    return this.httpClient.post(`${_prefix}/exportreportexcel`, params, {
      responseType: 'blob',
    });
  }

  getTimekeepingReportV2(params?): Observable<TypeData<TimekeepingReportModel>> {
    return this.httpClient.post(`${_prefix}/report-v2`, params).pipe(
      map((surcharge: TypeData<TimekeepingReportModel>) => {
        return surcharge;
      }),
    );
  }
}
