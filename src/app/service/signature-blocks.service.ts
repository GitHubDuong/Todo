import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { TypeData } from "@app/models/common.model";
import AppConstant from "@app/utilities/app-constants";
import { environment } from "@env/environment";
import { catchError, map, Observable, throwError } from "rxjs";

let _prefix = `${AppConstant.DEFAULT_URLS.API}/SignatureBlocks`;
let _prefixUpload = `${AppConstant.DEFAULT_URLS.API}/UploadFiles`;

@Injectable({
    providedIn: 'root',
})
export class SignatureBlocksService {
    constructor(private readonly httpClient: HttpClient) { }

    getPaging(params: any): Observable<TypeData<any>> {
        return this.httpClient.get(_prefix, { params }).pipe(
            map((item: TypeData<any>) => {
                return item;
            }),
        );
    }

    create(body: any): Observable<any> {
        return this.httpClient.post(_prefix, body);
    }

    uploadFiles(formData): Observable<any> {
        return this.httpClient
            .post(`${_prefixUpload}?controllerName=SignatureBlocks`, formData, {
                reportProgress: true,
                observe: 'events',
            })
            .pipe(catchError(this.errorMgmt));
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

    export(id: number): Observable<any> {
        return this.httpClient.get(`${_prefix}/export/${id}`);
    }

    accept(id: any): Observable<any> {
        return this.httpClient.put(`${_prefix}/accept/${id}`, {});
    }

    getFolderPathDownload(f: string, t: string): string {
        var k =
            environment.serverURL +
            '/api/ReportDownload/DownloadReportFromFile' +
            `?filename=${f}&fileType=${t}`;
        return k;
    }
}