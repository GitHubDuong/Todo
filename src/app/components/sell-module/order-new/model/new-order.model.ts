import { DateTimeHelper } from '@app/shared/helper/date-time.helper';
import { StringHelper } from '@app/shared/helper/string.helper';

export interface NewOrderModel {
  id: number;
  customerId: number;
  customerCode: string;
  customerName: string;
  quantity: number;
  quantityInProgress?: number;
  quantityDelivered?: number;
  totalAmount: number;
  date: Date;
  note: null;
  status: number;
  procedureNumber: string;
  procedureStatusName: string;
  isSpecialOrder: boolean;
  shoulDelete: boolean;
  shoulNotAccept: boolean;
  userCreated: number;
  userCreatedCode: string;
  userCreatedName: string;
  code: null;
  isFinished: boolean;
  isChecked: boolean;
}

export interface NewOrderTableModel extends NewOrderModel {
  order: string;
  employee: string;
  customer: string;
  price: string;
}

export class NewOrderHelper {
  static toTableModel(data: NewOrderModel): NewOrderTableModel {
    return {
      ...data,
      order: `<div><p>${data.procedureNumber}</p>
              <p>${DateTimeHelper.formatDateTime(data.date)}</p></div>`,
      employee: `<div><p>${data.userCreatedCode}</p>
                <p>${data.userCreatedName}</p></div>`,
      customer: `<div><p>${data.customerCode}</p>
                 <p>${data.customerName}</p></div>`,
      price: `<div>
                <div class="w-full">
                  <span class="text-primary">${data.quantity} &nbsp;</span> -
                  <span class="text-blue-600">${data.quantityInProgress}&nbsp;</span> -
                  <span class="text-green-600">${data.quantityDelivered}&nbsp;</span>
                </div>
                <p class="pt-3">${StringHelper.applyThousandSeparator(data.totalAmount)}</p>
              </div>
              `,
    };
  }
}
