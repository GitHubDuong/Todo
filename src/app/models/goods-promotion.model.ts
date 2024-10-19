import { ChartOfAccount } from '@app/models/case.model';

export interface IGoodsPromotionItem {
  id: number;
  quantityFrom: number;
  standard: string;
  discount: number;
  account: string | ChartOfAccount;
  accountName: string;
  detail1: string | ChartOfAccount;
  detail1Name: string;
  detail2: string | ChartOfAccount;
  detail2Name: string;
}

export interface BasePromotion {
  id: number;
  code: string;
  name: string;
}

export interface IGoodsPromotion extends BasePromotion {
  value: number;
  fromAt: string;
  toAt: string;
  fileLink: any;
  address: string;
  customerNote: string;
  note: string;
  items: IGoodsPromotionItem[];
}

export interface IGoodPromotionForSale extends BasePromotion {
  standard: string;
  note: string;
  discount?: number;
  qty?: number;
  unit?: string;
}

export interface IBillPromotion {
  id: number;
  note: string;
  code: string;
  name: string;
  amount: number;
  standard: string;
  discount?: number;
  qty?: number;
  unit?: string;
}
