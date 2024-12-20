import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Page, TypeData } from '../models/common.model';
import AppConstant from '../utilities/app-constants';
import { Branch } from '../models/branch.model';

export interface PageFilterBranch extends Page {}

let _prefix = `${AppConstant.DEFAULT_URLS.API}/Branchs`;

@Injectable({
  providedIn: 'root',
})
export class BranchService {
  constructor(private readonly httpClient: HttpClient) {}

  public getListBranch(params: any): Observable<TypeData<Branch>> {
    return this.httpClient.get(`${_prefix}`, { params }).pipe(
      map((Branch: TypeData<Branch>) => {
        return Branch;
      }),
    );
  }

  public getAllBranch(): Observable<any> {
    return this.httpClient.get(`${_prefix}/list`).pipe(
      map((Branch: TypeData<Branch>) => {
        return Branch;
      }),
    );
  }

  public getBranchDetail(id: number): Observable<Branch> {
    const url: string = `${_prefix}/${id}`;
    return this.httpClient.get(url, {}).pipe(
      map((Branch: Branch) => {
        return Branch;
      }),
    );
  }

  public createBranch(Branch: Branch): Observable<Branch | null> {
    const url: string = `${_prefix}`;
    return this.httpClient.post(url, Branch).pipe(
      map((Branch: Branch) => {
        return Branch;
      }),
    );
  }

  public updateBranch(Branch: Branch, id: number): Observable<Branch> {
    console.log(Branch);
    const url: string = `${_prefix}/${id}`;
    return this.httpClient.put(url, Branch).pipe(
      map((Branch: Branch) => {
        return Branch;
      }),
    );
  }

  public deleteBranch(id: number): Observable<Branch | null> {
    const url: string = `${_prefix}/${id}`;
    return this.httpClient.delete(url, {}).pipe(
      map((Branch: Branch) => {
        return Branch;
      }),
    );
  }

  uploadFiles(formData): Observable<any> {
    return this.httpClient
      .post(`${_prefix}/uploadImage`, formData, {
        reportProgress: true,
        observe: 'events',
      })
      .pipe(catchError(this.errorMgmt));
  }

  deleteFiles(paths): Observable<any> {
    let data = [];
    for (let i = 0; i < paths.length; i++) {
      data.push({ imageUrl: paths[i] });
    }
    const url: string = `${_prefix}/deleteImages`;
    return this.httpClient.post(url, data).pipe(
      map((imageUrl: string) => {
        return imageUrl;
      }),
    );
  }

  errorMgmt(error: HttpErrorResponse) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // Get client-side error
      errorMessage = error.error.message;
    } else {
      // Get server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.log(errorMessage);
    return throwError(errorMessage);
  }

  getExcelReport(param: PageFilterBranch): Observable<{ dt: string }> {
    let url: string = `${_prefix}/export-excel-Branch`;

    return this.httpClient.get(url).pipe(
      map((data: { dt: string }) => {
        return data;
      }),
    );
  }

  getFolderPathDownload(f: string, t: string): string {
    var k =
      environment.serverURL +
      '/ReportDownload/DownloadReportFromFile' +
      `?filename=${f}&fileType=${t}`;
    return k;
  }

  importExcel(formData): Observable<any> {
    return this.httpClient.post(`${_prefix}/import-Branch`, formData).pipe(
      map((data: any) => {
        return data;
      }),
    );
  }
}
