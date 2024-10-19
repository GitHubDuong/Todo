import { Injectable } from '@angular/core';
import AppConstant from '../utilities/app-constants';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

let _prefix = `${AppConstant.DEFAULT_URLS.API}/CarFields`;

@Injectable({
  providedIn: 'root',
})
export class CarFieldService {
  constructor(private readonly httpClient: HttpClient) {}

  public getCarFields(params?: any): Observable<any> {
    return this.httpClient.get(`${_prefix}`, { params }).pipe(
      map((cars: any) => {
        return cars;
      }),
    );
  }

  public createCarField(Car: any): Observable<any | null> {
    return this.httpClient.post(`${_prefix}`, Car).pipe(
      map((Car: any) => {
        return Car;
      }),
    );
  }

  public deleteCarField(id: number): Observable<any> {
    const url: string = `${_prefix}/${id}`;
    return this.httpClient.delete(url, {}).pipe(
      map((Car: any) => {
        return Car;
      }),
    );
  }

  public getDetailCarField(id: number): Observable<any> {
    const url: string = `${_prefix}/${id}`;
    return this.httpClient.get(url, {}).pipe(
      map((Car: any) => {
        return Car;
      }),
    );
  }

  public updateCarField(id: number, Car: any): Observable<any> {
    const url: string = `${_prefix}/${id}`;
    return this.httpClient.put(url, Car).pipe(
      map((Car: any) => {
        return Car;
      }),
    );
  }
}
