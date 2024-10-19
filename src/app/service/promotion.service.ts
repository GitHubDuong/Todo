import { Injectable } from '@angular/core';
import { IGoodPromotionForSale } from '@app/models/goods-promotion.model';
import { HttpClient } from '@angular/common/http';
import AppConstant from '@utilities/app-constants';
import { Observable } from "rxjs";
import { BaseService } from "@app/service/base.service";

const _prefix = `${ AppConstant.DEFAULT_URLS.API }/GoodsPromotions`;

@Injectable({ providedIn: 'root' })
export class PromotionService extends BaseService {
  _prefix = `${AppConstant.DEFAULT_URLS.API}/GoodsPromotions`;
  constructor(httpClient: HttpClient) {
    super(httpClient)
  }

  forSalePromotions(): Observable<IGoodPromotionForSale[]>{
    return this.httpClient.get<IGoodPromotionForSale[]>(`${ _prefix }/promotions-for-sale`);
  }
}
