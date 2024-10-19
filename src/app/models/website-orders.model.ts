export class BillDetailModel {
  id: number;
  discountPrice: number;
  goodsCode: number | null;
  goodsId: number;
  goodsName: string | null;
  isDeleted: boolean;
  isProduced: boolean;
  quantityReal: number;
  quantityRequired: number;
  taxVat: number;
  unitPrice: number;

  constructor(params: any = {}) {
    this.id = params.id || 0;
    this.discountPrice = params.discountPrice || 0;
    this.goodsCode = params.goodsCode || null;
    this.goodsId = params.goodsId || 0;
    this.quantityReal = params.quantityReal || 0;
    this.quantityRequired = params.quantityRequired || 0;
    this.taxVat = params.taxVat ||params.taxVAT || 0;
    this.unitPrice = params.unitPrice || 0;
    this.goodsName = params.goodsName || '';
    this.isDeleted = params.isDeleted || false;
    this.isProduced = params.isProduced || false;
  }
}

export interface ItemProductionOrder {
  id: number;
  customerId: number;
  date: string;
  note: string | null;
  statusId: number | null;
  statusName: string | null;
}

export class ItemOrderProduceProductsModel {
  id: string;
  goodsId: number;
  isDeleted: boolean;
  isProduced: boolean;
  quantityReal: number;
  quantityRequired: number;
  checked: boolean;
  quantity: number;
  unitPrice: number;
  discountPrice: number;
  taxVat: number;

  constructor(params: any = {}) {
    this.id = params.id || 0;
    this.discountPrice = params.discountPrice || 0;
    this.goodsId = params.goodsId || 0;
    this.quantityReal = params.quantityReal || 0;
    this.quantityRequired = params.quantityRequired || 0;
    this.taxVat = params.taxVat || params.taxVAT || 0;
    this.unitPrice = params.unitPrice || 0;
    this.isDeleted = params.isDeleted || false;
    this.isProduced = params.isProduced || false;
  }
}

export interface CreateProduceProductsModel {
  id: number;
  customerId: number;
  note: string | null;
  name: string | null;
  statusName: string | null;
  items?: ItemOrderProduceProductsModel[];
}

export interface StatusModel {
  id: number;
  name: string;
}

export interface ResponseModel<T> {
  currentPage: number;
  data: T[];
  dataTotal: number;
  nextStt: number;
  pageSize: number;
  totalItems: number;
}
