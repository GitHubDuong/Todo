import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { TypeData } from '../models/common.model';
import AppConstant from '../utilities/app-constants';

let _prefix = `${AppConstant.DEFAULT_URLS.API}/PetrolConsumptions`;

@Injectable({
  providedIn: 'root',
})
export class PetrolConsumptionService {
  constructor(private readonly httpClient: HttpClient) { }

  exportReport(params): Observable<any> {
    // TODO: Intergration API Export
    return null;
  }

  getFolderPathDownload(f: string, t: string): string {
    var k =
      environment.serverURL +
      '/api/ReportDownload/DownloadReportFromFile' +
      `?filename=${f}&fileType=${t}`;
    return k;
  }

  getReport(params): Observable<TypeData<any>> {
    return this.httpClient.get(`${_prefix}/report`, { params },)
      .pipe(
        map((item: TypeData<any>) => {
          return item;
        }),
      );
  }

  getPaging(): Observable<TypeData<any>> {
    return this.httpClient.get(_prefix)
      .pipe(
        map((item: TypeData<any>) => {
          return item;
        }),
      );
  }
}
