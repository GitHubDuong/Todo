import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Page, TypeData } from '../models/common.model';
import { PetrolConsumptions } from '../models/gasoline-norms.model';
import AppConstant from '../utilities/app-constants';

export interface PageFilterDecide extends Page {}

let _prefix = `${AppConstant.DEFAULT_URLS.API}/PetrolConsumptions`;

@Injectable({
  providedIn: 'root',
})
export class GasolineNormsService {
  constructor(private readonly httpClient: HttpClient) {}

  public getPetroConsumptions(params?: any): Observable<TypeData<PetrolConsumptions>> {
    return this.httpClient.get(`${_prefix}`, { params }).pipe(
      map((res: TypeData<PetrolConsumptions>) => {
        return res;
      }),
    );
  }

  public createPetroConsumptions(data: any): Observable<any | null> {
    return this.httpClient.post(`${_prefix}`, data).pipe(
      map((res: any) => {
        return res;
      }),
    );
  }

  public deletePetrolConsumptions(id: number): Observable<PetrolConsumptions | null> {
    const url: string = `${_prefix}/${id}`;
    return this.httpClient.delete(url, {}).pipe(
      map((res: PetrolConsumptions) => {
        return res;
      }),
    );
  }

  public getDetail(id: number): Observable<PetrolConsumptions> {
    const url: string = `${_prefix}/${id}`;
    return this.httpClient.get(url, {}).pipe(
      map((res: PetrolConsumptions) => {
        return res;
      }),
    );
  }

  public updatePetrolConsumptions(id: number, Data: any): Observable<any> {
    const url: string = `${_prefix}/${id}`;
    return this.httpClient.put(url, Data).pipe(
      map((res: any) => {
        return res;
      }),
    );
  }

  getAll() {
    const params = {
      page: 0,
      pageSize: 1000,
    };
    return this.getPetroConsumptions(params);
  }
}
