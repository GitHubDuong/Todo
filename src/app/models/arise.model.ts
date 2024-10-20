import { DecimalPipe, getLocaleDateTimeFormat } from '@angular/common';

export interface IArise {
  id: number;
  code: string;
  payer: string;
  payDate: Date;
  address: string;
  documentFile: string;
  documentNote: string;
  documentType: string;
  invoiceNumber: string;
  type1: string;
  type2: string;
  invoiceDate: Date;
  invoiceAddress: string;
  seriNumber: string;
  taxIdentity: string;
  unit: string;
  commodity: string;
  warehouseCode: string;
  depreciationMonth: number;
  warehouseId: number;
  endInventory: number;
  caseCode: string;
  unitCode: string;
  quantity: number;
  amount: number;
  total: number;
  currency: string;
  exchangeRate: number;
  caseId1: string;
  caseInventory1: number;
  caseId2: string;
  caseInventory2: number;
  caseId3: string;
  caseInventory3: number;
  caseId4: string;
  caseInventory4: number;
  caseId5: string;
  caseInventory5: number;
  caseId6: string;
  caseInventory6: number;
  isCreateAccounting: string;
  nb: boolean;
  deliverCode: string;
  deliverDate: Date | string;
  deliverName: string;
  deliverAddress: string;
  createAt: Date;
  updateAt: Date;
  deleteAt: Date;
  isDelete: boolean;
  userCreated: number;
  userUpdated: number;
}

export interface AriseSelectList {
  Balance: number;
  BalanceAvailable: number;
  BalanceCurrency: number;
  BalanceCurrencyAvailable: number;
  Code: string;
  Id: string;
  Title: string;
}

export class Arise implements IArise {
  id: number = 0;
  code: string = '';
  payer: string = '';
  payDate: Date = new Date();
  address: string = '';
  documentFile: string = '';
  documentNote: string = '';
  documentType: string = '';
  invoiceNumber: string = '';
  type1: string = '';
  type2: string = '';
  invoiceDate: Date = this.payDate;
  invoiceAddress: string = '';
  seriNumber: string = '';
  taxIdentity: string = '';
  unit: string = '';
  commodity: string = '';
  warehouseCode: string = '';
  warehouseId: number = 0;
  warehouseName: string = '';
  depreciationMonth: number = 0;
  endInventory: number = 0;
  caseCode: string = '';
  unitCode: string = '';
  quantity: number = 0;
  amount: number = 0;
  total: number = 0;
  currency: string = '';
  exchangeRate: number = 0;
  caseId1: string = '';
  caseTitle1: string = '';
  caseInventory1: number = 0;
  caseId2: string = '';
  caseTitle2: string = '';
  caseInventory2: number = 0;
  caseId3: string = '';
  caseTitle3: string = '';
  caseInventory3: number = 0;
  caseId4: string = '';
  caseTitle4: string = '';
  caseInventory4: number = 0;
  caseId5: string = '';
  caseTitle5: string = '';
  caseInventory5: number = 0;
  caseId6: string = '';
  caseTitle6: string = '';
  caseInventory6: number = 0;
  isCreateAccounting: string = 'false';
  nb: boolean = false;
  deliverCode: string = '';
  deliverDate: Date | string = null;
  deliverName: string = '';
  deliverAddress: string = '';
  createAt: Date = new Date();
  updateAt: Date = new Date();
  deleteAt: Date = null;
  isDelete: boolean = false;
  userCreated: number = 0;
  userUpdated: number = 0;

  constructor(params?: IArise) {
    Object.assign(this, params);
  }
}
export interface ImportFromExcelTaiKhoanArisingFile {
  code?: string;
  name?: string;
  parentCode?: string;
  warehouse?: string;
  beginningCredit?: string;
  beginningDebit?: string;
  foreignCurrencyCredit?: string;
  foreignCurrencyDebit?: string;
  accGroup?: string;
  classification?: string;
  matKind?: string;
}
export interface ImportFromExcelTaiKhoanArisingModel {
  id?: number;
  code?: string;
  name?: string;
  openingDebit?: number;
  openingCredit?: number;
  arisingDebit?: number;
  arisingCredit?: number;
  isForeignCurrency?: boolean;
  openingForeignDebit?: number;
  openingForeignCredit?: number;
  arisingForeignDebit?: number;
  arisingForeignCredit?: number;
  duration?: string;
  currency?: string;
  exchangeRate?: number;
  accGroup?: number;
  classification?: number;
  protected?: number;
  type?: number;
  hasChild?: boolean;
  hasDetails?: boolean;
  parentRef?: string;
  displayInsert?: boolean;
  displayDelete?: boolean;
  stockUnit?: string;
  openingStockQuantity?: number;
  arisingStockQuantity?: number;
  stockUnitPrice?: number;
  warehouseCode?: string;
  warehouseName?: string;
  openingDebitNB?: number;
  openingCreditNB?: number;
  arisingDebitNB?: number;
  arisingCreditNB?: number;
  openingForeignDebitNB?: number;
  openingForeignCreditNB?: number;
  arisingForeignDebitNB?: number;
  arisingForeignCreditNB?: number;
  openingStockQuantityNB?: number;
  arisingStockQuantityNB?: number;
  stockUnitPriceNB?: number;
}
