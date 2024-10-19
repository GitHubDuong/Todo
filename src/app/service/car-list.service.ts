import { Injectable } from '@angular/core';
import AppConstant from '../utilities/app-constants';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Page, TypeData } from '../models/common.model';
import { Observable, map } from 'rxjs';
import { CarList } from '../models/car-list.model';

export interface PageFilterDecide extends Page {}

let _prefix = `${AppConstant.DEFAULT_URLS.API}/Cars`;

@Injectable({
  providedIn: 'root',
})
export class CarListService {
  constructor(private readonly httpClient: HttpClient) {}

  public getListCars(params?: any): Observable<any> {
    return this.httpClient.get(`${_prefix}`, { params }).pipe(
      map((cars: any) => {
        return cars;
      }),
    );
  }

  public createCar(Car: any): Observable<any | null> {
    return this.httpClient.post(`${_prefix}`, Car).pipe(
      map((Car: any) => {
        return Car;
      }),
    );
  }

  public deleteCar(id: number): Observable<any> {
    const url: string = `${_prefix}/${id}`;
    return this.httpClient.delete(url, {}).pipe(
      map((Car: any) => {
        return Car;
      }),
    );
  }

  public getDetail(id: number): Observable<any> {
    const url: string = `${_prefix}/${id}`;
    return this.httpClient.get(url, {}).pipe(
      map((Car: any) => {
        return Car;
      }),
    );
  }

  public updateCar(id: number, Car: any): Observable<any> {
    const url: string = `${_prefix}/${id}`;
    return this.httpClient.put(url, Car).pipe(
      map((Car: any) => {
        return Car;
      }),
    );
  }

  public getAllCars(): Observable<any> {
    return this.httpClient.get(`${_prefix}/List`).pipe(
      map((cars: any) => {
        return cars;
      }),
    );
  }

  public getCarFieldSetup(id: number): Observable<any> {
    const url: string = `${_prefix}/car-field-setup`;
    const options = {
      params: new HttpParams({ fromObject: { carId: id } }),
    };
    return this.httpClient.get(url, options).pipe(
      map((Car: any) => {
        return Car;
      }),
    );
  }

  public updateCarFieldSetup(id: number, Car: any): Observable<any> {
    const url: string = `${_prefix}/car-field-setup`;
    const options = {
      params: new HttpParams({ fromObject: { carId: id } }),
    };
    return this.httpClient.put(url, Car, options).pipe(
      map((Car: any) => {
        return Car;
      }),
    );
  }
}
