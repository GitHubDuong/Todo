export interface ProcedureProductModel {
  id: number;
  note: string;
  isFinished: boolean;
  date: string;
  procedureNumber: string;
  procedureStatusId: number;
  procedureStatusName: string;
  items: CarTripModel[];
}

export interface CarTripModel {
  carId?: string;
  carName: string;
  note?: string;
  licensePlates?: any;
  goods: ProductModel[];
}

export interface ProductModel {
  id: number;
  customerId: number;
  customerName: string;
  planningProduceProductId: number;
  goodsId: number;
  goodsCode: string;
  goodsName: string;
  goodsNec: number;
  stockUnit: string;
  quantity: number;
  unitPrice: number;
  discountPrice: number;
  taxVAT: number;
  orderProduceProductCode: string;
  promotionAmount: number;
  promotions: any[];
  fileDelivered?: FileDeliveredModel;
}

export interface FileDeliveredModel {
  fileName: string;
  fileUrl: string;
}
