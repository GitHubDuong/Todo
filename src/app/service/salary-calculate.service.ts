import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { TypeData } from '../models/common.model';
import { Salary } from '../models/salary.model';
import AppConstant from '../utilities/app-constants';
import { SalaryReport } from "@app/models/salary-report.model";

let _prefix = `${AppConstant.DEFAULT_URLS.API}/CalculateSalary`;
@Injectable({
  providedIn: 'root',
})
export class SalaryCalculateService {
  constructor(private readonly httpClient: HttpClient) {}
  public getListSalary(params: any): Observable<TypeData<SalaryReport>> {
    return this.httpClient.get(`${_prefix}/list`, { params }).pipe(
      map((Salary: TypeData<SalaryReport>) => {
        return Salary;
      }),
    );
  }

  public calculateSalary(params: any): Observable<any> {
    return this.httpClient.post(`${_prefix}/calculate`, null,{ params }, );
  }

  exportExcel(params: any): Observable<any> {
    let url: string = `${_prefix}/export-excel`;
    return this.httpClient.post(url, null,{ params });
  }

  exportPdf(params: any): Observable<any> {
    let url: string = `${_prefix}/export-pdf`;
    return this.httpClient.post(url, null,{ params });
  }

  getFolderPathDownload(f: string, t: string): string {
    var k =
      environment.serverURL +
      '/api/ReportDownload/DownloadReportFromFile' +
      `?filename=${f}&fileType=${t}`;
    return k;
  }
}
