import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, Observable, throwError } from 'rxjs';
import AppConstant from '../utilities/app-constants';
import { Page, TypeData } from '../models/common.model';
import { Goods } from '../models/goods.model';
import { AddPriceList } from '../models/add-price-list';
import { UpdatePriceList } from '../models/update-price-list';
import { environment } from 'src/environments/environment';
import { IGoodsPromotion } from '@app/models/goods-promotion.model';

export interface PageFilterGoods extends Page {
  account: number;
  customerId?: number;
  customerName?: string;
  isCashier?: boolean;
}

const _prefix = `${ AppConstant.DEFAULT_URLS.API }/Goods`;
const _prefixPromotions = `${ AppConstant.DEFAULT_URLS.API }/GoodsPromotions`;
const _prefixCashiers = `${ AppConstant.DEFAULT_URLS.API }/ChartOfAccountForCashiers`;

@Injectable({ providedIn: 'root' })
export class GoodsService {
  reCallApi = new BehaviorSubject<boolean>(false);
  stateReCallApi$ = this.reCallApi.asObservable();

  constructor(private readonly httpClient: HttpClient) {}

  setStateCallApi(value: boolean) {
    this.reCallApi.next(value);
  }

  getList(params): Observable<TypeData<Goods>> {
    if (params.floorId === 0) {
      delete params.floorId;
    }
    return this.httpClient.get<TypeData<Goods>>(_prefix, { params });
  }

  getListChartOfAccountForCashiser(params): Observable<TypeData<Goods>> {
    if (params.floorId === 0) {
      delete params.floorId;
    }
    return this.httpClient.get<TypeData<Goods>>(_prefixCashiers, { params });
  }

  getListNoQuery(): Observable<TypeData<Goods>> {
    return this.httpClient.get<TypeData<Goods>>(`${ _prefix }/list`);
  }

  getDetail(id: number): Observable<any> {
    const url: string = `${ _prefix }/${ id }`;
    return this.httpClient.get(url, {});
  }

  promotions(params = {}, options = {}) {
    return this.httpClient.get<TypeData<IGoodsPromotion>>(_prefixPromotions, { params, ...options });
  }

  create(body): Observable<any> {
    const url: string = `${ _prefix }`;
    return this.httpClient.post(url, body);
  }

  update(body, id: number): Observable<any> {
    const url: string = `${ _prefix }`;
    return this.httpClient.put(url, body);
  }

  updateForWebsite(body, id: number): Observable<any> {
    const url: string = `${ _prefix }/update-for-website/${ id }`;
    return this.httpClient.put(url, body);
  }

  deleteGoods(id: number): Observable<any> {
    const url: string = `${ _prefix }/${ id }`;
    return this.httpClient.delete(url, {});
  }

  uploadFiles(formData): Observable<any> {
    return this.httpClient
    .post(`${ _prefix }/uploadImage`, formData, {
      reportProgress: true,
      observe: 'events',
    })
    .pipe(catchError(this.errorMgmt));
  }

  deleteFiles(paths): Observable<any> {
    const data = [];
    for (let i = 0; i < paths.length; i++) {
      data.push({ imageUrl: paths[i] });
    }
    return this.httpClient.delete(`${ _prefix }/deleteImages`, { body: data });
  }

  errorMgmt(error: HttpErrorResponse) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // Get client-side error
      errorMessage = error.error.message;
    } else {
      // Get server-side error
      errorMessage = `Error Code: ${ error.status }\nMessage: ${ error.message }`;
    }
    return throwError(errorMessage);
  }

  addPriceList(body: AddPriceList): Observable<any> {
    return this.httpClient.post(`${ _prefix }/copy-price-list`, body);
  }

  updatePriceList(body: UpdatePriceList): Observable<any> {
    return this.httpClient.post(`${ _prefix }/update-price-list`, body);
  }

  syncAccountGood(): Observable<any> {
    return this.httpClient.get(`${ _prefix }/SyncAccountGood`);
  }

  compareGoodPrice(body): Observable<any> {
    return this.httpClient.post(`${ _prefix }/compare-good-price`, body);
  }

  exportExcelListOfGoods(body, isManager: boolean = false): Observable<any> {
    return this.httpClient.post(`${ _prefix }/export-bkhh?isManager=${ isManager }`, body);
  }

  exportExcelCompareGoodPrice(body): Observable<any> {
    return this.httpClient.post(`${ _prefix }/export-compare-good-price`, body);
  }

  getFolderPathDownload(f: string, t: string): string {
    return `${ environment.serverURL }/api/ReportDownload/DownloadReportFromFile?filename=${ f }&fileType=${ t }`;
  }

  importExcelListOfGoods(body: any[], isManager = false): Observable<any> {
    return this.httpClient.post(`${ _prefix }/import-bkhh?isManager=${ isManager }`, body);
  }

  checkGoodNew(): Observable<any> {
    return this.httpClient.get(`${ _prefix }/check-new-good`);
  }

  ReportGoodInWarehouse(params: any) {
    return this.httpClient.get<TypeData<any>>(`${ _prefix }/report-good-in-warehouse`, { params });
  }

  getGoodPricesByPriceCode(priceCode: string, goodCodes: any[]) {
    return this.httpClient.post(`${ _prefix }/get-prices-by-price-code/${ priceCode }`, goodCodes);
  }

  updateMenuWebForGoods(body): Observable<any> {
    return this.httpClient.post(`${ _prefix }/menu-type-for-goods`, body);
  }

  changeGoodStatus(goodIds: number[], statusId: number) {
    return this.httpClient.post(`${ _prefix }/status-goods/${statusId}`, goodIds);
  }

  changeGoodService(goodIds: number[]) {
    return this.httpClient.post(`${ _prefix }/service-goods`, goodIds);
  }
}
