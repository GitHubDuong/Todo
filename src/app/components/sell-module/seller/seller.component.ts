import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from '@app/models/user.model';
import { UserService } from '@app/service/user.service';
import * as signalR from '@microsoft/signalr';
import { TranslateService } from '@ngx-translate/core';
import * as moment from 'moment';
import { MessageService } from 'primeng/api';
import { Bill, BillDetail, NotificationCountResult, NotificationResult } from 'src/app/models/cashier.model';
import { Goods } from 'src/app/models/goods.model';
import { RoomTable } from 'src/app/models/room-table.model';
import { AuthService } from 'src/app/service/auth.service';
import { BillDetailService } from 'src/app/service/bill-detail.service';
import { BillService } from 'src/app/service/bill.service';
import { CustomerService } from 'src/app/service/customer.service';
import { RoomTableService } from 'src/app/service/room-table.service';
import AppUtil from 'src/app/utilities/app-util';
import { environment } from 'src/environments/environment';
import { BillTableComponent } from '../components/bill-table/bill-table.component';
import { DeskTableComponent } from '../components/desk-table/desk-table.component';
import { RoomTableFormComponent } from '../setup-module/room-table/component/room-table-form/room-table-form.component';

@Component({
  selector: 'app-seller',
  templateUrl: './seller.component.html',
  styleUrls: ['./seller.component.scss'],
})
export class SellerComponent implements OnInit {
  mode = 'seller';
  appUtil = AppUtil;
  @ViewChild('appBillTable') appBillTable: BillTableComponent;
  @ViewChild('roomTableForm') roomTableForm: RoomTableFormComponent;
  @ViewChild('appDeskTable') appDeskTable: DeskTableComponent;

  display: boolean = false;
  floors: RoomTable[];
  desks: RoomTable[];
  activeTableOrGoods: number = 0;
  selectedBillTabId = '';
  floorTabs: any[] = [];
  billTabs: any[] = [];
  mergeBillTab: any = {};
  billIdIdentity = 0;
  customers: any[] = [];
  displayDiscountPrice: boolean = false;
  displayNotification: boolean = false;
  notification: NotificationCountResult;
  messages: Array<NotificationResult> = [];
  existedNumMessage = 0;
  hubConnection: signalR.HubConnection;
  authUser: any = {};
  displaySplitMerge: boolean = false;
  mergeGoods: any[] = [];
  isMobile = screen.width < 1200;
  users: User[] = [];
  selectedUser: string = '';

  constructor(
    private activateRouting: ActivatedRoute,
    private roomTableService: RoomTableService,
    private customerService: CustomerService,
    private messageService: MessageService,
    private translateService: TranslateService,
    private router: Router,
    private billService: BillService,
    private billDetailService: BillDetailService,
    private authService: AuthService,
    private userService: UserService,
  ) {}

  ngOnInit() {
    this.activateRouting.url.subscribe((url) => {
      if (url[0].path === 'marketing-staff') {
        this.mode = 'marketing-staff';
      }
    });
    this.authUser = this.authService.user;
    this.getFloors();
    this.getChartOfAccounts();
    this.initNotificationRealtime();
    this.getBillIdNewest();
    this.getUserList();
    this.selectedUser = this.authUser.username;
  }

  initNotificationRealtime() {
    this.getNotificationCount();
    this.hubConnection = new signalR.HubConnectionBuilder()
      .configureLogging(signalR.LogLevel.Information)
      .withUrl(`${environment.serverURL}/notify`, {
        skipNegotiation: true,
        transport: signalR.HttpTransportType.WebSockets,
      })
      // .withHubProtocol(new signalRMsgPack.MessagePackHubProtocol())
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

  getNotificationCount() {
    this.billService.getNotificationCount().subscribe((notification) => {
      this.notification = notification;
    });
  }

  getNotificationMessage() {
    this.billService.getNotificationMessage().subscribe((messages) => {
      if (messages.length === 0) {
        this.displayNotification = false;
        return;
      }
      this.reloadMessCount(messages);
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

  getFloors() {
    this.roomTableService.getListNoQuery().subscribe((res) => {
      this.floors = res.data.filter((item) => item.floorId === 0) || [];
      this.desks = res.data.filter((item) => item.floorId !== 0) || [];
      this.floors.forEach((item) => {
        if (this.floorTabs.map((x) => x.id !== item.id)) {
          this.floorTabs.push({
            id: item.id,
            title: `${item.name}`,
          });
        }
      });
      this.appDeskTable.onChangeFloorTab({ index: 0 });
    });
  }

  getChartOfAccounts() {
    this.customerService.getAllCustomer().subscribe((res: any) => {
      this.customers = res.data;
    });
  }

  addBill(roomTable) {
    let billTab = this.billTabs.find((x) => x.deskId === roomTable.id);
    if (billTab) {
      this.messageService.add({
        severity: 'info',
        detail: AppUtil.translate(this.translateService, 'Bàn đã tồn tại'),
      });
      this.setSelectedTab(billTab.tabId);
      this.activeTableOrGoods = 1;
      return;
    }
    let newBill = {
      isDefault: false,
      tabId: this.appUtil.makeRandomId(6),
      deskId: roomTable.id,
      deskName: roomTable.deskName,
      floorId: roomTable.floorId,
      floorName: this.floors.find((x) => x.id === roomTable.floorId).name,
      title: `Bill ${this.billIdIdentity}`,
      data: {
        id: this.billIdIdentity,
        isRealId: false,
        products: [],
        deskId: roomTable.id,
        floorName: '',
        customerNumber: 1,
        customerId: '',
        customerName: '',
        discountType: 'money',
        totalPrice: 0,
        discountPrice: 0,
        note: '',
        payPrice: 0,
        tabIndex: this.billIdIdentity,
        isSendToCashier: false,
        isSendToChef: false,
        isCooking: false,
        isCooked: false,
        isPaid: false,
        typePay: 'CN',
        billPromotions: [],
      },
    };
    this.billTabs.unshift(newBill);
    this.setSelectedTab(newBill.tabId);
    this.activeTableOrGoods = 1;
  }

  addProduct(event) {
    if (this.desks && this.desks.length === 1 && this.floors && this.floors.length === 1 && this.billTabs.length === 0) {
      let newBill = {
        isDefault: false,
        tabId: this.appUtil.makeRandomId(6),
        deskId: this.desks.find((x) => x.code === 'Live').id,
        deskName: this.desks.find((x) => x.code === 'Live').name,
        floorId: this.floors.find((x) => x.code === 'Floor').id,
        floorName: this.floors.find((x) => x.code === 'Floor').name,
        title: `Bill ${this.billIdIdentity}`,
        data: {
          id: this.billIdIdentity,
          isRealId: false,
          products: [],
          floorName: '',
          customerNumber: 1,
          customerId: '',
          customerName: '',
          discountType: 'money',
          totalPrice: 0,
          discountPrice: 0,
          note: '',
          payPrice: 0,
          tabIndex: this.billIdIdentity,
          isSendToCashier: false,
          isSendToChef: false,
          isCooking: false,
          isCooked: false,
          isPaid: false,
          typePay: 'CN',
          billPromotions: [],
        },
      };
      this.billTabs.unshift(newBill);
      this.setSelectedTab(newBill.tabId);
      this.activeTableOrGoods = 1;
    }
    this.onAddProduct(event);
  }

  onAddProduct(product) {
    //check exist in products
    let products = this.billTabs.find((x) => x.tabId === this.selectedBillTabId).data.products;
    // check exist in has bill
    let productTemp = products.find((x) => (x.goodsId ? x.goodsId === product.id : x.id === product.id)) || {};
    if (!this.appUtil.isEmpty(productTemp)) {
      // this.messageService.add({
      //     severity: 'info', detail: AppUtil.translate(this.translateService, 'Hàng hóa đã tồn tại'),
      // });
      return;
    }
    product.billQuantity = 1;
    product.discountPrice = 0;
    product.discountType = 'money';
    this.billTabs.find((x) => x.tabId === this.selectedBillTabId).data.products = [...products, Object.assign({}, product)];
  }

  async closeBill(tabId) {
    this.billTabs = this.billTabs.filter((x) => x.tabId !== tabId);
    this.setSelectedTab(this.billTabs[0].tabId);
    this.activeTableOrGoods = 0;
    await this.getBillIdNewest();
  }

  async getBillIdNewest() {
    this.billService.getBillIdNewestByType('KHĐ').subscribe((res) => {
      this.billIdIdentity = res.billOrder;
    });
  }

  onChangeTab(event) {
    this.setSelectedTab(this.billTabs[event.index].tabId);
  }

  async onShowSplitMerge(billTabId) {
    let products = this.billTabs.find((x) => x.tabId === billTabId).data.products;
    if (products && products.length > 0) {
      await this.getFloors();
      this.mergeBillTab.splitMergeType = 'split';
      this.mergeGoods = products.map((a) => Object.assign({}, a));
      this.mergeGoods.forEach((goods) => {
        goods.checked = false;
        goods.mergeQuantity = null;
      });
      this.displaySplitMerge = true;
    }
  }

  setSelectedTab(tabId) {
    this.selectedBillTabId = tabId;
  }

  onSendToCashier(event: any): void {
    if (event.isMarketing) {
      this.doSendBill(false, true, event.data);
    } else {
      this.doSendBill(false);
    }
    this.displayDiscountPrice = true;
  }

  private saveBill(param: Bill, isMarketing = false, billData: any): void {
    const params: any = Object.assign({}, param);
    if (params.id === 0) {
      if (isMarketing) {
        const customer = billData.data.products.find((item) => item.customerId && item.customerId > 0);
        if (!customer) {
          this.messageService.add({
            severity: 'info',
            detail: AppUtil.translate(this.translateService, 'info.please_check_again_customer'),
          });
          return;
        }
        const items = [];
        billData.data.products.forEach((product) => {
          items.push({
            id: product.id,
            goodsId: product.id,
            quantity: product.billQuantity,
            unitPrice: product.salePrice,
            discountPrice: 0,
            taxVAT: 0,
          });
        });
        const body: any = {
          customerId: customer ? customer.customerId : 0,
          date: moment().toDate(),
          note: billData.data.note,
          items: items,
          billPromotions: billData.billPromotions,
        };
        this.billService.createOrderProduce(body).subscribe((res): void => {
          this.reloadAfterCreate(res);
        });
      } else {
        this.billService.createBill(params).subscribe((res: any) => {
          this.reloadAfterCreate(res);
        });
      }
    }
  }

  doSendBill(isPayment: boolean = false, isMarketing = false, billData?: any): void {
    let billReq = this.getBillReq(isPayment, true);
    if (!isMarketing) {
      billReq.products = [
        {
          billId: 0,
          discountPrice: 10,
          discountType: 'percent',
          id: 0,
          note: '',
          quantity: 1,
          taxVat: 0,
          unitPrice: 10000,
        },
      ];
    }
    this.saveBill(billReq, isMarketing, billData);
  }

  reloadAfterCreate(res) {
    this.messageService.add({
      severity: 'success',
      detail: AppUtil.translate(this.translateService, 'success.create'),
    });
    this.billTabs.find((x) => x.tabId === this.selectedBillTabId).id = res.data.id;
    this.onSaveBillDetail(
      this.billTabs.find((x) => x.tabId === this.selectedBillTabId),
      res.data.id,
    );
  }

  onSaveBillDetail(billTab, billId) {
    const params: BillDetail[] = [];
    billTab.data.products.forEach((product) => {
      const param: BillDetail = {
        id: 0,
        billId,
        goodsId: product.id,
        quantity: product.billQuantity,
        unitPrice: product.salePrice,
        discountPrice: product.discountPrice,
        discountType: product.discountType,
        taxVat: product.taxVat,
        note: product.note,
      };
      params.push(param);
    });

    this.createBillDetail(params);
  }

  private createBillDetail(param: BillDetail[]) {
    this.billDetailService.createBillDetail(param).subscribe((res: any) => {
      this.getNotificationCount();
      this.closeBill(this.selectedBillTabId);
      this.appUtil.scrollToTop();
      this.getBillIdNewest();
    });
  }

  getBillReq(isPayment: boolean, isNew?: boolean) {
    const params: any[] = [];
    let bill = this.billTabs.find((x) => x.tabId === this.selectedBillTabId);
    bill.data.products.forEach((product) => {
      const param: BillDetail = {
        id: 0,
        billId: bill.id,
        goodsId: product.id,
        quantity: product.quantity,
        unitPrice: product.salePrice,
        discountPrice: product.discountPrice,
        discountType: product.discountType,
        taxVat: product.taxVat,
        note: product.note,
      };
      params.push(param);
    });
    if (this.mode === 'marketing-staff') {
      return {
        id: isNew ? 0 : bill.data.id,
        floorId: bill.floorId,
        deskId: bill.deskId,
        customerId: bill.data.customerId || 0,
        customerName: this.getCustomerName(bill.data.customerId) || '',
        userCode: this.authUser.fullname,
        userType: 'seller',
        quantityCustomer: bill.data.customerNumber,
        totalAmount: 0,
        amountReceivedByCus: 0,
        amountSendToCus: 0,
        discountType: bill.data.discountType || '',
        discountPrice: bill.data.discountPrice || 0,
        note: bill.data.note,
        status: bill.data.status || 'Waiting',
        isPayment,
        typePay: bill.data.typePay,
        products: params,
        displayOrder: this.billIdIdentity,
        billPromotions: bill.data.billPromotions,
      };
    } else {
      return {
        id: isNew ? 0 : bill.data.id,
        floorId: bill.floorId,
        deskId: bill.deskId,
        customerId: bill.data.customerId || 0,
        customerName: this.getCustomerName(bill.data.customerId) || '',
        userCode: this.authUser.fullname,
        userType: 'seller',
        quantityCustomer: bill.data.customerNumber,
        totalAmount: bill.data.totalPrice,
        amountReceivedByCus: bill.data.payPrice,
        amountSendToCus: 0,
        // bill.payPrice - this.getDiscountBillMoney()
        discountType: bill.data.discountType || '',
        discountPrice: bill.data.discountPrice || 0,
        note: bill.data.note,
        status: bill.data.status || 'Waiting',
        isPayment,
        typePay: bill.data.typePay,
        products: params,
        displayOrder: this.billIdIdentity,
        billPromotions: bill.data.billPromotions,
      };
    }
  }

  getAccountCode(data: Goods) {
    if (data.detail2) {
      return data.detail2;
    }
    if (data.detail1) {
      return data.detail1.split('_')[0];
    }
    return data.account;
  }

  getAccountName(data: Goods) {
    if (data.detail2) {
      return data.detailName2;
    }
    if (data.detail1) {
      return data.detailName1;
    }
    return data.accountName;
  }

  getCustomerName(customerId) {
    if (customerId > 0) {
      return this.customers.find((x) => x.id === customerId).name;
    }
    return '';
  }

  onChangeCustomer(event: any) {
    if (this.appBillTable) {
      this.appBillTable.onChangeCustomer(event);
    }
  }

  private getUserList() {
    this.userService.getAllUserActive1().subscribe((res: any) => {
      this.users = res.data;
    });
  }
}
