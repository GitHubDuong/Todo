import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import AppConstant from '@utilities/app-constants';

@Injectable({
  providedIn: 'root'
})
export class LedgerProducesService {
  _prefix = `${AppConstant.DEFAULT_URLS.API}/LedgerProduces`;

  constructor(private http: HttpClient) {}

  createLedgerProduce(body: any) {
    return this.http.post(this._prefix, body);
  }
}
