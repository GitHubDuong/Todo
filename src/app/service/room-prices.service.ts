import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import AppConstant from '../utilities/app-constants';
import { Page, TypeData } from '../models/common.model';
import { map, Observable } from 'rxjs';
import { RoomPrice } from "../models/room-price.model";

@Injectable({
  providedIn: 'root'
})
export class RoomPricesService {
  private url = `${AppConstant.DEFAULT_URLS.API_HOTEL}/RoomPrices`;
  private urlType = `${AppConstant.DEFAULT_URLS.API_HOTEL}/RoomTypes`;
  constructor(private readonly httpClient: HttpClient) { }
  public getList(params: any): Observable<RoomPrice[]> {
    return this.httpClient.get(`${this.url}`, { params }).pipe(
      map((response: RoomPrice[]) => {
        return response
      })
    );
  }
  public getListRoomType(): Observable<any[]> {
    return this.httpClient.get(`${this.urlType}/list`).pipe(
      map((response: any[]) => {
        return response
      })
    );
  }
  public create(body: any): Observable<any> {
    const url: string = `${this.url}`;
    return this.httpClient.post(url, body).pipe(
      map((res: any) => {
        return res;
      }),
    );
  }
}
