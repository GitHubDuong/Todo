import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import AppConstant from '../utilities/app-constants';

let _prefix = `${AppConstant.DEFAULT_URLS.API}/ShiftUsers`;

@Injectable({
  providedIn: 'root',
})
export class ShiftUserService {
  constructor(private readonly httpClient: HttpClient) {}

  public getShiftUserByMonth(month: number): Observable<any> {
    return this.httpClient.get(`${_prefix}/${month}`).pipe(
      map((res: any) => {
        return res;
      }),
    );
  }

  public create(body: any): Observable<any> {
    return this.httpClient.post(`${_prefix}`, body);
  }

  public saveUser(id: number, user: any): Observable<any> {
    return this.httpClient.post(`${_prefix}/${id}/user`, user);
  }

  public saveUsers(id: number, users: any[]): Observable<any> {
    return this.httpClient.post(`${_prefix}/${id}/users`, users);
  }
  public bulkUsers(body: any): Observable<any> {
    return this.httpClient.post(`${_prefix}/users`, body);
  }


  public syncUser(id: number): Observable<any> {
    return this.httpClient.get(`${_prefix}/${id}/sync-user`);
  }
}
