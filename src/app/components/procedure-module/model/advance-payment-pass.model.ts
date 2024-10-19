export interface AdvancePaymentPassModel {
  id: number;
  customerId: number;
  customerCode: string;
  customerName: string;
  quantity: number;
  totalAmount: number;
  date: string;
  note?: any;
  status: number;
  procedureNumber: string;
  procedureStatusName: string;
  isSpecialOrder: boolean;
  shoulDelete: boolean;
  shoulNotAccept: boolean;
  userCreated: number;
  userCreatedCode: string;
  userCreatedName: string;
  code?: any;
  isFinished: boolean;
}

export interface AdvancePaymentPassTableModel {
  id: number;
  date: string;
  userId: number;
  amount: number;
  note?: any;
  datePayment: string;
  isFinished: boolean;
  procedureNumber?: any;
  procedureStatusId: number;
  procedureStatusName: string;
}

export class AdvancePaymentPassHelper {
  static toTableModel(item: any) {
    return {
      id: item.id,
      date: item.date,
      userId: item.userId,
      amount: item.amount,
      note: item.note,
      datePayment: item.datePayment,
      isFinished: item.isFinished,
      procedureNumber: item.procedureNumber,
      procedureStatusId: item.procedureStatusId,
      procedureStatusName: item.procedureStatusName,
    };
  }
}
