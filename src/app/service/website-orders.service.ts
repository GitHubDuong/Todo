import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { map, Observable } from 'rxjs';
import { Order } from '../models/sell-report.model';
import { CreateProduceProductsModel, ResponseModel, StatusModel } from '../models/website-orders.model';
import AppConstant from '../utilities/app-constants';

let _prefixProduce = `${AppConstant.DEFAULT_URLS.API}/PlanningProduceProducts`;
let _prefixOrderProduceProducts = `${AppConstant.DEFAULT_URLS.API}/OrderProduceProducts`;
let _prefixStatus = `${AppConstant.DEFAULT_URLS.API}/Status`;
let _prefixGoods = `${AppConstant.DEFAULT_URLS.API}/Goods`;

@Injectable({
  providedIn: 'root',
})
export class WebsiteOrdersService {
  constructor(private readonly httpClient: HttpClient) { }

  public getStatusList(): Observable<any> {
    return this.httpClient.get(`${_prefixStatus}/list?type=3`).pipe(
      map((item: ResponseModel<StatusModel>) => {
        return item.data;
      }),
    );
  }

  public getGoodsList(): Observable<any> {
    return this.httpClient.get(`${_prefixGoods}/list`).pipe(
      map((item: ResponseModel<any>) => {
        return item.data;
      }),
    );
  }

  public getListProduceProducts(customerId: number): Observable<any> {
    return this.httpClient.get(`${_prefixProduce}?customerId=${customerId}`).pipe(
      map((customer: any) => {
        return customer;
      }),
    );
  }

  public getListOrderProduceProducts(params: any): Observable<any> {
    return this.httpClient.get(`${_prefixOrderProduceProducts}`, { params }).pipe(
      map((product: Order) => {
        return product;
      }),
    );
  }

  public getListProductionOrder(params: any): Observable<any> {
    return this.httpClient.get(`${_prefixProduce}`, { params });
  }

  public getAllProductionOrder(procedureCode: number): Observable<any> {
    return this.httpClient.get(`${_prefixProduce}/list?procedureCode=${procedureCode}`);
  }

  public createProductionOrder(params: CreateProduceProductsModel | any): Observable<any> {
    return this.httpClient.post(`${_prefixProduce}`, params);
  }

  public updateProductionOrder(params: CreateProduceProductsModel | any): Observable<any> {
    return this.httpClient.put(`${_prefixProduce}/${params.id}`, params);
  }

  public updateProducePlanning(params: CreateProduceProductsModel | any): Observable<any> {
    return this.httpClient.put(`${_prefixProduce}/planning/${params.id}`, params);
  }

  public getProductionOrderById(id: number): Observable<any> {
    return this.httpClient.get(`${_prefixProduce}/${id}`).pipe(
      map((product: any) => {
        return product;
      }),
    );
  }

  public getOrderById(id: string): Observable<any> {
    return this.httpClient.get(`${_prefixOrderProduceProducts}/${id}`).pipe(
      map((product: any) => {
        return product;
      }),
    );
  }

  public getAllCars(id: number): Observable<any> {
    return this.httpClient.get(`${_prefixProduce}/list-car?id=${id}`).pipe(
      map((cars: any) => {
        return cars;
      }),
    );
  }

  public updateStatusProductionOrder(id, statusId): Observable<any> {
    return this.httpClient.post(`${_prefixProduce}/status/${id}?statusId=${statusId}`, null).pipe(
      map((product: any) => {
        return product;
      }),
    );
  }

  public billToOrderProduce(id: number): Observable<any> {
    const url: string = `${_prefixOrderProduceProducts}/bill-to-order-produce/${id}`;
    return this.httpClient.post(url, {}).pipe(
      map((res: any) => {
        return res;
      }),
    );
  }

  public accept(id: number): Observable<any> {
    const url: string = `${_prefixOrderProduceProducts}/accept/${id}`;
    return this.httpClient.put(url, {}).pipe(
      map((res: any) => {
        return res;
      }),
    );
  }

  public notAccept(id: number): Observable<any> {
    const url: string = `${_prefixOrderProduceProducts}/not-accept/${id}`;
    return this.httpClient.put(url, {}).pipe(
      map((res: any) => {
        return res;
      }),
    );
  }

  public delete(id: number): Observable<any> {
    const url: string = `${_prefixOrderProduceProducts}/${id}`;
    return this.httpClient.delete(url, {}).pipe(
      map((res: any) => {
        return res;
      }),
    );
  }

  public producePlanningAccept(id: number): Observable<any> {
    const url: string = `${_prefixProduce}/accept/${id}`;
    return this.httpClient.put(url, {}).pipe(
      map((res: any) => {
        return res;
      }),
    );
  }

  public updateOrderProduceProduct(params: CreateProduceProductsModel | any): Observable<any> {
    return this.httpClient.put(`${_prefixOrderProduceProducts}/${params.id}`, params);
  }

  public producePlanningNotAccept(id: number): Observable<any> {
    const url: string = `${_prefixProduce}/not-accept/${id}`;
    return this.httpClient.put(url, {}).pipe(
      map((res: any) => {
        return res;
      }),
    );
  }

  public producePlanningDelete(id: number): Observable<any> {
    const url: string = `${_prefixProduce}/${id}`;
    return this.httpClient.delete(url, {}).pipe(
      map((res: any) => {
        return res;
      }),
    );
  }

  public producePlanningExport(id: number): Observable<any> {
    const url: string = `${_prefixProduce}/export/${id}`;
    return this.httpClient.post(url, {}).pipe(
      map((res: any) => {
        return res;
      }),
    );
  }

  public producePlanningExportGatePass(carId: number, carName: string, id: number): Observable<any> {
    let url: string = `${_prefixProduce}/export-gate-pass/${id}?carName=${carName}`;
    if (carId != null) {
      url = url + `&carId=${carId}`;
    }
    return this.httpClient.post(url, {}).pipe(
      map((res: any) => {
        return res;
      }),
    );
  }

  public producePlanningExportPaymentProposal(carId: number, carName: string, id: number): Observable<any> {
    let url: string = `${_prefixProduce}/export-payment-proposal/${id}?carName=${carName}`;
    if (carId != null) {
      url = url + `&carId=${carId}`;
    }
    return this.httpClient.post(url, {}).pipe(
      map((res: any) => {
        return res;
      }),
    );
  }

  public producePlanningExportForCar(carId: number, carName: string, id: number): Observable<any> {
    let url: string = `${_prefixProduce}/export-for-car/${id}?carName=${carName}`;
    if (carId != null) {
      url = url + `&carId=${carId}`;
    }
    return this.httpClient.post(url, {}).pipe(
      map((res: any) => {
        return res;
      }),
    );
  }

  public cancelOrder(id: number) {
    return this.httpClient.put(`${_prefixOrderProduceProducts}/canceled/${id}`, null);
  }

  public uploadFile(formData: any): Observable<any> {
    return this.httpClient.post(`${_prefixProduce}/uploadfile`, formData).pipe(
      map((comment: any) => {
        return comment;
      }),
    );
  }

  public exportOrder(id: number) {
    return this.httpClient.get(`${_prefixOrderProduceProducts}/export/${id}`).pipe(
      map((data: any) => {
        return data;
      }),
    );
  }

  public cancelDetail(id: number, detailIds: number[]) {
    return this.httpClient.put(`${_prefixProduce}/${id}/cancel-detail`, detailIds);
  }

  public saveDept(id: number) {
    return this.httpClient.post(`${_prefixProduce}/${id}/ledger`, null);
  }

  importExcel(formData): Observable<any> {
    return this.httpClient.post(`${_prefixOrderProduceProducts}/import-excel`, formData);
  }

  exportExcel(ids: number[]) {
    return this.httpClient.post(`${_prefixOrderProduceProducts}/export-excel`, ids).pipe(
      map((data: any) => {
        return data;
      }),
    );
  }

  getFolderPathDownload(f: string, t: string): string {
    return `${environment.serverURL}/api/ReportDownload/DownloadReportFromFile?filename=${f}&fileType=${t}`;
  }
}
