import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CustomerService } from '@app/service/customer.service';
import * as signalR from '@microsoft/signalr';
import { TranslateService } from '@ngx-translate/core';
import { MessageService } from 'primeng/api';
import { environment } from '../../../../../../environments/environment';
import { AppMainComponent } from '../../../../../layouts/app.main.component';
import { Bill, BillDetail, NotificationCountResult, NotificationResult } from '../../../../../models/cashier.model';
import { TypeData } from '../../../../../models/common.model';
import { RoomTable } from '../../../../../models/room-table.model';
import { BillDetailService } from '../../../../../service/bill-detail.service';
import { BillService } from '../../../../../service/bill.service';
import AppUtil from '../../../../../utilities/app-util';
import appUtil from '../../../../../utilities/app-util';

@Component({
  selector: 'app-bill-notification',
  templateUrl: './bill-notification.component.html',
  styleUrls: ['./bill-notification.component.scss'],
})
export class BillNotificationComponent implements OnInit {
  existedNumMessage = 0;
  @Input() selectedUser: any;
  @Input() authUser: any;
  @Input() billTabs: any[];
  @Input() desks: RoomTable[];
  @Input() floors: RoomTable[];
  @Input() customers: any[];
  @Output() onAddBillFromEmployee = new EventEmitter<any>();

  private hubConnection: signalR.HubConnection;
  notification: NotificationCountResult;
  messages: Array<NotificationResult> = [];
  displayNotification: boolean = false;
  isMobile = screen.width <= 1199;

  constructor(
    public appMain: AppMainComponent,
    private messageService: MessageService,
    private translateService: TranslateService,
    private billService: BillService,
    private billDetailService: BillDetailService,
    private customerService: CustomerService,
  ) {}

  ngOnInit(): void {
    this.initNotificationRealtime();
  }

  receivedBill(message: NotificationResult) {
    this.billService.receivedBill(message.billId, this.authUser.id).subscribe((res: any) => {
      if (res && res.data) {
        this.messageService.add({
          severity: 'success',
          detail: AppUtil.translate(this.translateService, `${this.selectedUser} đã nhận món từ bếp`),
        });
        this.getNotificationMessage();
      }
    });
  }

  deleteNotification(message: NotificationResult) {
    this.billService.deleteNotification(message.id).subscribe(() => {
      this.getNotificationMessage();
    });
  }

  deleteNotifications(): void {
    if (confirm(`Are you sure want to delete all notifications?`)) {
      this.billService.deleteNotifications().subscribe(() => {
        this.getNotificationMessage();
      });
    }
  }

  initNotificationRealtime() {
    this.getNotificationCount();
    this.hubConnection = new signalR.HubConnectionBuilder()
      .configureLogging(signalR.LogLevel.Information)
      .withUrl(`${environment.serverURL}/notify`, {
        skipNegotiation: true,
        transport: signalR.HttpTransportType.WebSockets,
      })
      .build();

    this.hubConnection
      .start()
      .then(() => {
        console.log('SignalR Connected!');
        this.getNotificationCount();
        this.getNotificationMessage();
      })
      .catch((err) => console.error(err.toString()));

    this.hubConnection.on('BroadcastMessage', () => {
      this.getNotificationCount();
      this.getNotificationMessage();
    });
    this.hubConnection.on('ReceiveMessage', (data: any) => {
      console.log('SignalR receive message ', data);
    });
  }

  getNotificationMessage() {
    this.billService.getNotificationMessage().subscribe((messages) => {
      if (messages.length === 0) {
        this.displayNotification = false;
        this.reloadMessCount(messages);
        this.getNotificationCount();
        return;
      }
      this.reloadMessCount(messages);
      this.getNotificationCount();
    });
  }

  reloadMessCount(messages?: NotificationResult[]) {
    if (messages && messages.length > 0) {
      this.messages = messages.filter(
        (x) =>
          !this.billTabs
            .map((x) => x.data)
            .map((x) => x.id)
            .includes(x.billId),
      );
      this.existedNumMessage = this.messages.length;
    }
  }

  getNotificationCount() {
    this.billService.getNotificationCount().subscribe((notification) => {
      this.notification = notification;
    });
  }

  cancelBill(message: NotificationResult) {
    this.billService.cancelBill(message.billId, this.authUser.id).subscribe((res: any) => {
      if (res && res.data) {
        this.messageService.add({
          severity: 'success',
          detail: AppUtil.translate(this.translateService, `${this.selectedUser} đã nhận món từ bếp`),
        });
        this.getNotificationMessage();
      }
    });
  }

  addBillFromEmployee(msg: NotificationResult) {
    this.billService.getBillDetail(msg.billId).subscribe((res: any) => {
      if (res && res.data) {
        this.addBillFromNotification(res.data, msg);
        this.displayNotification = false;
      }
    });
  }

  addBillFromNotification(bill: Bill, msg: NotificationResult) {
    const newProducts: any[] = [];
    this.billDetailService.getBillDetails(bill.id).subscribe((res: TypeData<BillDetail>) => {
      res.data.forEach((data: any) => {
        newProducts.push({
          id: data.id,
          billId: data.billId,
          goodsId: data.goodsId,
          goodsName: data.goodsName,
          goodsCode: data.goodsCode,
          wareHouseName: data.wareHouseName,
          billQuantity: data.quantity,
          salePrice: data.unitPrice,
          discountType: data.discountType,
          taxVat: data.taxVat,
          discountPrice: data.discountPrice,
          note: data.note,
          image1: data.image1,
          detail1: data.detail1,
          detail2: data.detail2,
        });
      });
      let deskLive = this.desks.find((x) => x.id === bill.deskId);
      let floorLive = this.floors.find((x) => x.id === bill.floorId);
      this.customerService.getCustomerDetail(bill.customerId).subscribe((res) => {
        console.log('customer', res.data);
        const customer = res.data;
        let newBill = {
          isDefault: false,
          msgId: msg.id,
          tabId: appUtil.makeRandomId(6),
          deskId: deskLive ? deskLive.id : 0,
          deskName: deskLive ? deskLive.name : '',
          floorId: floorLive ? floorLive.id : 0,
          floorName: floorLive ? floorLive.name : '',
          title: `Bill ${bill.billNumber || bill.displayOrder}`,
          isPrintBill: bill.isPrintBill,
          isPriority: bill.isPriority,
          data: {
            ...bill,
            id: bill.id,
            isRealId: true,
            products: newProducts,
            customerNumber: bill.quantityCustomer,
            customerId: bill.customerId,
            customerName: bill.customerName,
            debitCode: customer ? customer?.debit?.code : '',
            debitDetailCodeFirst: customer ? customer?.debitDetailFirst?.code : '',
            debitDetailCodeSecond: customer ? customer?.debitDetailSecond?.code : '',
            discountType: bill.discountType,
            totalAmount: bill.totalAmount,
            discountPrice: bill.discountPrice,
            note: bill.note,
            status: bill.status,
            typePay: bill.typePay,
            createdDate: bill.createdDate,
            billNumber: bill.billNumber,
            type: bill.type,
            vat: bill.vatRate,
            vatCode: bill.vatCode,
            vatRate: bill.vatRate,
          },
        };
        this.onAddBillFromEmployee.emit(newBill);
        this.getNotificationMessage();
      });
    });
  }

  getCustomer(customerId) {
    return this.customers.find((x) => x.id === customerId);
  }

  get notificationCount() {
    return this.notification.count;
  }

  showNotificationDialog() {
    this.getNotificationMessage();
    this.displayNotification = true;
  }
}
