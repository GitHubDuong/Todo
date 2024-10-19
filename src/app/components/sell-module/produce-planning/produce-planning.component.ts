import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TableColumModel } from '@app/models/common/table-colum.model';
import { CustomerService } from '@app/service/customer.service';
import { TranslationService } from '@app/service/translation.service';
import { UserService } from '@app/service/user.service';
import { DateTimeHelper } from '@app/shared/helper/date-time.helper';
import { TranslateService } from '@ngx-translate/core';
import { OrderStatus } from '@utilities/app-enum';
import * as moment from 'moment';
import { MenuItem, MessageService } from 'primeng/api';
import { ColumnDataType } from 'src/app/core/enum';
import { BillDetailModel, CreateProduceProductsModel } from 'src/app/models/website-orders.model';
import { AccountBalanceSheetReportService } from 'src/app/service/account-balance-sheet-report';
import { SellReportServiceService } from 'src/app/service/sell-report-service.service';
import { WebsiteOrdersService } from 'src/app/service/website-orders.service';
import AppUtil from 'src/app/utilities/app-util';

@Component({
  selector: 'app-produce-planning',
  templateUrl: './produce-planning.component.html',
  styleUrls: ['./produce-planning.component.scss'],
})
export class ProducePlanningComponent implements OnInit {
  mode = 'website';
  isInvalidForm = false;
  loading: boolean = true;
  appUtil = AppUtil;
  sortFields: any[] = [];
  sortTypes: any[] = [];
  producesTemp: any = [];

  pendingRequest: any;
  isMobile = screen.width <= 1199;
  lstPayment: any[] = [];
  first = 0;
  totalRecords = 0;
  totalPages = 0;

  display: boolean = false;
  displayBillDetail = false;
  billDetail: BillDetailModel[] = [];
  selectProductionOrder: number = 0;
  goodsList: any[] = [];
  paramCreateProduceProducts: CreateProduceProductsModel = {
    id: 0,
    name: '',
    customerId: 0,
    note: null,
    statusName: 'Mới tạo',
    items: [],
  };
  startDate = DateTimeHelper.firstDayOfCurrentMonth();
  endDate = new Date();
  customers: any[] = [];
  employees: any[];
  goods: any[];
  cols: any[] = [
    { header: 'label.code_orders', value: 'id', width: 'width:12%' },
    { header: 'label.status', value: 'status', width: 'width:12%' },
    { header: 'label.create_at', value: 'createAt', width: 'width:12%' },
    {
      header: 'label.customer_name',
      value: 'fullName',
      width: 'width:12%',
    },
    { header: 'label.phone', value: 'tell', width: 'width:12%' },
    {
      header: 'label.delivery_address',
      value: 'shippingAddress',
      width: 'width:12%',
    },
    {
      header: 'label.number_of_product',
      value: 'orderDetails.length()',
      width: 'width:12%',
    },
    {
      header: 'label.total_price',
      value: 'totalPrice',
      width: 'width:12%',
    },
  ];
  columns: TableColumModel[] = [];
  public getParams = {
    page: 0,
    pageSize: 20,
    status: 1,
    searchText: '',
    statusTab: 0,
    userId: null,
  };
  orderDetail;
  planningProduceProductId;
  displayProduceDetail = false;
  dataSource = [];
  dataColumns = [];
  tabMenuItems: MenuItem[] = [];
  currentStatus: number = OrderStatus.Pending;
  activeItem: MenuItem;
  protected readonly OrderStatus = OrderStatus;
  selectedItem: any;
  userList: any[] = [];

  constructor(
    private activatedRoute: ActivatedRoute,
    private readonly sellReportService: SellReportServiceService,
    private readonly messageService: MessageService,
    private readonly translateService: TranslateService,
    private readonly websiteOrdersService: WebsiteOrdersService,
    private readonly customerService: CustomerService,
    private accountBalanceSheetReportService: AccountBalanceSheetReportService,
    private readonly translationService: TranslationService,
    private userService: UserService,
  ) {
    this.dataColumns = [
      { header: 'label.code_orders', value: 'produceProductId', width: '20%' },
      { header: 'label.order_new_detail_good_code', value: 'goodsCode', width: '30%' },
      { header: 'label.order_new_detail_good_name', value: 'goodsName', width: '35%' },
      {
        header: 'label.order_new_detail_good_quantity_real',
        value: 'quantity',
        width: '15%',
        type: ColumnDataType.number,
      },
    ];
    this.columns = [
      { label: 'label.produce_planning_name', field: 'procedureNumber', type: ColumnDataType.text, class: 'w-3' },
      { label: 'label.status', field: 'procedureStatusName', type: ColumnDataType.text, class: 'w-2' },
      { label: 'label.note', field: 'note', type: ColumnDataType.text, class: 'w-3' },
      { label: 'label.stock_quantity', field: 'quantity', type: ColumnDataType.number, class: 'w-1' },
    ];
  }

  ngOnInit(): void {
    this.userService.getAllUserActive().subscribe((res) => {
      this.userList = res.data;
    });
    this.getListCustomer();
    this.endDate = new Date();
    this.getParams.status = null;

    this.tabMenuItems = [
      {
        label: this.translationService.translate('label.pending_approval'),
        icon: 'pi pi-clock',
        command: (event) => this.onStatusChange(OrderStatus.Pending),
        id: OrderStatus.Pending.toString(),
      },
      {
        label: this.translationService.translate('label.approved'),
        icon: 'pi pi-check-circle',
        command: (event) => this.onStatusChange(OrderStatus.Approved),
        id: OrderStatus.Approved.toString(),
      },
      {
        id: OrderStatus.Done.toString(),
        label: this.translationService.translate('label.done'),
        icon: 'pi pi-check-circle',
        command: (event) => this.onStatusChange(OrderStatus.Done),
      },
      {
        id: OrderStatus.Cancel.toString(),
        label: this.translationService.translate('label.cancel'),
        icon: 'pi pi-check-circle',
        command: (event) => this.onStatusChange(OrderStatus.Cancel),
      },
      {
        id: OrderStatus.Part.toString(),
        label: this.translationService.translate('label.part'),
        icon: 'pi pi-check-circle',
        command: (event) => this.onStatusChange(OrderStatus.Part),
      },
      {
        id: OrderStatus.Finish.toString(),
        label: this.translationService.translate('label.finish'),
        icon: 'pi pi-check-circle',
        command: (event) => this.onStatusChange(OrderStatus.Finish),
      },
      {
        label: this.translationService.translate('label.all'),
        icon: 'pi pi-th-large',
        command: (event) => this.onStatusChange(),
        id: OrderStatus.All.toString(),
      },
    ];
    this.activeItem = this.tabMenuItems[0];
    this.currentStatus = Number(this.tabMenuItems[0].id);
  }

  getListCustomer(): void {
    this.customerService.getAllCustomer().subscribe((res) => {
      this.customers = res.data;
    });
  }

  getGoodsList() {
    this.websiteOrdersService.getGoodsList().subscribe((res: any[]) => {
      this.goodsList = res;
    });
  }

  onStatusChange(status: number = 0) {
    this.currentStatus = status;
    this.getProductionOrderList(null);
  }

  getProductionOrderList(event?: any): void {
    if (this.pendingRequest) {
      this.pendingRequest.unsubscribe();
    }
    this.getParams.statusTab = this.currentStatus;
    if (event) {
      this.getParams.page = event.first / event.rows;
      this.getParams.pageSize = event.rows;
    }
    this.getParams['startDate'] = moment(this.startDate).format('YYYY-MM-DD');
    this.getParams['endDate'] = moment(this.endDate).format('YYYY-MM-DD');
    Object.keys(this.getParams).map((key) => {
      if (this.getParams[key] === null || this.getParams[key] === undefined) this.getParams[key] = '';
    });
    this.loading = true;
    this.websiteOrdersService.getListProductionOrder(this.getParams).subscribe({
      next: (res) => {
        this.producesTemp = res.data;
        this.totalRecords = res.totalItems || 0;
        this.totalPages = res.totalItems / res.pageSize + 1;
      },
      error: () => {
        this.loading = false;
      },
      complete: () => {
        this.loading = false;
      },
    });
  }

  getDetail(bill: any): void {
    this.selectProductionOrder = 0;
    this.paramCreateProduceProducts.note = '';
    this.loading = true;
    this.sellReportService.getOrderProduceProductsById(bill.id).subscribe({
      next: (res) => {
        this.display = true;
        this.loading = false;
        if (res.items) {
          this.billDetail = res.items;
          this.paramCreateProduceProducts.id = bill.id;
          this.paramCreateProduceProducts.customerId = bill.customerId;
          this.paramCreateProduceProducts.note = bill.note;
        } else {
          this.billDetail = [];
        }
      },
      error: () => {
        this.loading = false;
        this.messageService.add({
          severity: 'error',
          detail: 'Có lỗi xảy ra',
        });
      },
      complete: () => {
        this.loading = false;
      },
    });
  }

  getCustomerName(customerId: number): string {
    let temp = this.customers.find((item) => item.id === customerId);
    return temp ? temp.name : '';
  }

  openDownloadFile(_fileName, _ft: string) {
    try {
      var _l = this.accountBalanceSheetReportService.getFolderPathDownload(_fileName, _ft);
      if (_l) window.open(_l);
    } catch (ex) {
      // this.notificationService.error('Lỗi', 'Không thể download file');
    }
  }

  onChangeSelectProductionOrder(event) {
    this.paramCreateProduceProducts.name = event.value ? event.value : '';
  }

  onOrder(billDetail: any[]): void {
    const items = billDetail.filter((item) => item.checked);
    this.paramCreateProduceProducts.items = items;
    this.loading = true;

    if (this.selectProductionOrder) {
      this.websiteOrdersService.updateProductionOrder(this.paramCreateProduceProducts).subscribe({
        next: (res): void => {
          this.loading = false;
          this.displayBillDetail = false;
          this.messageService.add({
            severity: 'success',
            detail: AppUtil.translate(this.translateService, 'success.create'),
          });
        },
        error: () => {
          this.loading = false;
          this.messageService.add({
            severity: 'error',
            detail: 'Có lỗi xảy ra',
          });
        },
        complete: () => {
          this.loading = false;
        },
      });
      return;
    }

    this.websiteOrdersService.createProductionOrder(this.paramCreateProduceProducts).subscribe({
      next: (res): void => {
        this.loading = false;
        this.displayBillDetail = false;
        this.messageService.add({
          severity: 'success',
          detail: AppUtil.translate(this.translateService, 'success.create'),
        });
      },
      error: () => {
        this.loading = false;
        this.messageService.add({
          severity: 'error',
          detail: 'Có lỗi xảy ra',
        });
      },
      complete: () => {
        this.loading = false;
      },
    });
  }

  onUpdateOrder(order) {
    this.sellReportService.updateWebsiteOrder(order.id, order).subscribe(
      (res) => {
        this.messageService.add({
          severity: 'success',
          detail: AppUtil.translate(this.translateService, 'success.update'),
        });
      },
      (error) => {},
      () => this.getProductionOrderList(),
    );
  }

  onUpdateStatusOrder(id, event) {
    if (!id || !event || !event.value) return;
    this.websiteOrdersService.updateStatusProductionOrder(id, event.value).subscribe({
      next: () => {
        this.getProductionOrderList();
        this.messageService.add({
          severity: 'success',
          detail: AppUtil.translate(this.translateService, 'success.update'),
        });
      },
      error: () => {
        this.loading = false;
        this.messageService.add({
          severity: 'error',
          detail: 'Có lỗi xảy ra',
        });
      },
      complete: () => {
        this.loading = false;
      },
    });
  }

  getGoodsName(goodsId: number) {
    return this.goodsList.find((item) => item.id === goodsId).name || '';
  }

  getGoodsCode(goodsId: number) {
    return this.goodsList.find((item) => item.id === goodsId).code || '';
  }

  getTotalPrice(billDetail: BillDetailModel) {
    return this.appUtil.formatCurrencyVND(
      billDetail.quantityRequired * billDetail.unitPrice + billDetail.taxVat - billDetail.discountPrice,
    );
  }

  onDetailProduce(item) {
    this.loading = true;
    this.selectedItem = item;
    this.websiteOrdersService.getProductionOrderById(item.id).subscribe(
      (res) => {
        this.loading = false;
        this.orderDetail = res;
        this.planningProduceProductId = item.id;
        this.dataSource = res?.items || [];
        this.display = true;
      },
      (err) => {
        this.loading = false;
      },
    );
  }

  accept(orderId: number): void {
    this.websiteOrdersService.producePlanningAccept(orderId).subscribe((res: any) => {
      AppUtil.scrollToTop();
      this.messageService.add({
        severity: 'success',
        detail: this.translationService.translate('success.approved_request'),
      });
      this.getProductionOrderList(null);
    });
  }

  notAccept(orderId: number): void {
    this.websiteOrdersService.producePlanningNotAccept(orderId).subscribe((res: any) => {
      AppUtil.scrollToTop();
      this.messageService.add({
        severity: 'success',
        detail: this.translationService.translate('success.not_approved_request'),
      });
      this.getProductionOrderList(null);
    });
  }

  delete(orderId: number): void {
    this.websiteOrdersService.producePlanningDelete(orderId).subscribe((res: any) => {
      AppUtil.scrollToTop();
      this.messageService.add({
        severity: 'success',
        detail: this.translationService.translate('success.delete'),
      });
      this.getProductionOrderList(null);
    });
  }

  export(orderId: number) {
    this.websiteOrdersService.producePlanningExport(orderId).subscribe((res: any) => {
      this.openDownloadFile(res.data, 'pdf');
    });
  }
}
