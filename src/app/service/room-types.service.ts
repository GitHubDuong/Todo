import { HttpClient, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import AppConstant from '../utilities/app-constants';
import { Page, TypeData } from '../models/common.model';
import { Observable, catchError, map, of, tap } from 'rxjs';
import { RoomType, TypeExtraBed, TypeRoom } from '../models/room-type.model';

export interface PageRoomType extends Page { }

@Injectable({
  providedIn: 'root'
})
export class RoomTypesService {
  private url = `${AppConstant.DEFAULT_URLS.API_HOTEL}/RoomTypes`;
  private urlExtra = `${AppConstant.DEFAULT_URLS.API_HOTEL}/RoomConfigureTypes`;
  private urlSyn = `${AppConstant.DEFAULT_URLS.API_HOTEL}/Goods`;
  constructor(private readonly httpClient: HttpClient) { }
  public getList(params: any): Observable<TypeData<RoomType>> {
    return this.httpClient.get(`${this.url}`, { params }).pipe(
      map((response: TypeData<RoomType>) => {
        return response
      })
    );
  }
  public getByID(id: number): Observable<RoomType> {
    return this.httpClient.get(`${this.url}/${id}`).pipe(
      map((response: RoomType) => {
        return response
      })
    );
  }
  public getListType(): Observable<TypeRoom[]> {
    return this.httpClient.get(`${this.urlExtra}/type/0`).pipe(
      map((response: TypeRoom[]) => {
        return response
      })
    );
  }
  public getListExtraBed(): Observable<TypeExtraBed[]> {
    return this.httpClient.get(`${this.urlExtra}/type/1`).pipe(
      map((response: TypeExtraBed[]) => {
        return response
      })
    );
  }
  public getListAmenityType(): Observable<any[]> {
    return this.httpClient.get(`${this.urlExtra}/type/2`).pipe(
      map((response: any[]) => {
        return response
      })
    );
  }
  public update(body: RoomType): Observable<RoomType> {
    const url: string = `${this.url}/${body.id}`;
    return this.httpClient.put(url, body).pipe(
      map((res: RoomType) => {
        return res;
      }),
    );
  }
  public syncAccountGood(): Observable<any> {
    return this.httpClient.get(`${this.urlSyn}/SyncAccountGood`);
  }
}
