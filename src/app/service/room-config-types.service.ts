import { Injectable } from '@angular/core';
import AppConstant from '../utilities/app-constants';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Page, TypeData } from '../models/common.model';
import { ConfigType, RoomConfigType } from '../models/room-config-type.model';

@Injectable({
  providedIn: 'root'
})
export class RoomConfigTypesService {
  private url = `${AppConstant.DEFAULT_URLS.API_HOTEL}/RoomConfigureTypes`;
  constructor(private readonly httpClient: HttpClient) { }
  public getList(params: any): Observable<TypeData<RoomConfigType>> {
    return this.httpClient.get(`${this.url}`, { params }).pipe(
      map((response: TypeData<RoomConfigType>) => {
        return response
      })
    );
  }
  public getByID(id: number): Observable<RoomConfigType> {
    return this.httpClient.get(`${this.url}/${id}`,).pipe(
      map((response: RoomConfigType) => {
        return response
      })
    );
  }
  public create(body: RoomConfigType): Observable<RoomConfigType> {
    const url: string = `${this.url}`;
    return this.httpClient.post(url, body).pipe(
      map((res: RoomConfigType) => {
        return res;
      }),
    );
  }
  public update(body: RoomConfigType): Observable<RoomConfigType> {
    const url: string = `${this.url}/${body.id}`;
    return this.httpClient.put(url, body).pipe(
      map((res: RoomConfigType) => {
        return res;
      }),
    );
  }
  public delete(body: RoomConfigType): Observable<RoomConfigType> {
    const url: string = `${this.url}/${body.id}`;
    return this.httpClient.delete(url, {}).pipe(
      map((res: RoomConfigType) => {
        return res;
      }),
    );
  }

  public getListConfigTypes(): Observable<ConfigType[]> {
    return this.httpClient.get(`${this.url}/room-config-types`).pipe(
      map((response: ConfigType[]) => {
        return response
      })
    );
  }
}
