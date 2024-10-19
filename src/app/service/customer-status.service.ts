import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { TypeData } from '../models/common.model';
import { CustomerClassification } from '../models/customer-classification.model';
import { CustomerStatus } from '../models/customer-status.model';
import AppConstant from '../utilities/app-constants';

let _prefix = `${AppConstant.DEFAULT_URLS.API}/Status`;

@Injectable({
  providedIn: 'root',
})
export class CustomerStatusService {
  constructor(private readonly httpClient: HttpClient) {}

  public getAll() {
    const body: any = {
      page: 0,
      pageSize: 1000,
      sortField: 'id',
      isSort: true,
      keyword: '',
      type: 2,
    };
    return this.getAllCustomerStatus(body);
  }

  public getCustomerStatus(params: any): Observable<TypeData<CustomerStatus>> {
    return this.httpClient.get(`${_prefix}`, { params }).pipe(
      map((customer: TypeData<CustomerStatus>) => {
        return customer;
      }),
    );
  }

  public getAllCustomerStatus(type: number): Observable<TypeData<CustomerStatus>> {
    return this.httpClient.get(`${_prefix}/list?type=${type}`).pipe(
      map((customer: TypeData<CustomerStatus>) => {
        return customer;
      }),
    );
  }

  public getCustomerStatusDetail(id: number): Observable<CustomerStatus> {
    const url: string = `${_prefix}/${id}`;
    return this.httpClient.get(url, {}).pipe(
      map((customer: CustomerStatus) => {
        return customer;
      }),
    );
  }

  public createCustomerStatus(customer: CustomerClassification): Observable<CustomerStatus | null> {
    const url: string = `${_prefix}`;
    return this.httpClient.post(url, customer).pipe(
      map((customer: CustomerStatus) => {
        return customer;
      }),
    );
  }

  public updateCustomerStatus(customer: CustomerClassification, id: number): Observable<CustomerStatus> {
    console.log(customer);
    const url: string = `${_prefix}/${id}`;
    return this.httpClient.put(url, customer).pipe(
      map((customer: CustomerStatus) => {
        return customer;
      }),
    );
  }

  public deleteCustomerStatus(id: number): Observable<CustomerStatus | null> {
    const url: string = `${_prefix}/${id}`;
    return this.httpClient.delete(url, {}).pipe(
      map((customer: CustomerStatus) => {
        return customer;
      }),
    );
  }

  // uploadFiles(formData): Observable<any> {
  //     return this.httpClient
  //         .post(`${_prefixUpload}/uploadImage`, formData, {
  //             reportProgress: true,
  //             observe: 'events',
  //         })
  //         .pipe(catchError(this.errorMgmt));
  // }

  // errorMgmt(error: HttpErrorResponse) {
  //     let errorMessage = '';
  //     if (error.error instanceof ErrorEvent) {
  //         // Get client-side error
  //         errorMessage = error.error.message;
  //     } else {
  //         // Get server-side error
  //         errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
  //     }
  //     console.log(errorMessage);
  //     return throwError(errorMessage);
  // }

  // getExcelReport(param: PageFilterCustomerTax): Observable<{ dt: string }> {
  //     let url: string = `${_prefix}/export-excel-customer`;

  //     return this.httpClient.get(url).pipe(
  //         map((data: { dt: string }) => {
  //             return data;
  //         })
  //     );
  // }

  // getFolderPathDownload(f: string, t: string): string {
  //     var k =
  //         environment.serverURL +
  //         '/ReportDownload/DownloadReportFromFile' +
  //         `?filename=${f}&fileType=${t}`;
  //     return k;
  // }

  // importExcel(formData): Observable<any> {
  //     return this.httpClient.post(`${_prefix}/import-customer`, formData).pipe(
  //         map((data: any) => {
  //             return data;
  //         })
  //     );
  // }
}
