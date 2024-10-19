import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ManufactureOrderService } from '@app/service/manufacture-order.service';
import { ReportDownloadService } from '@app/service/report-download';
import { TranslationService } from '@app/service/translation.service';
import { UserService } from '@app/service/user.service';
import { DateTimeHelper } from '@app/shared/helper/date-time.helper';
import { TranslateService } from '@ngx-translate/core';
import { OrderStatus } from '@utilities/app-enum';
import * as moment from 'moment';
import { MenuItem, MessageService } from 'primeng/api';
import { ColumnDataType } from 'src/app/core/enum';
import { BillDetailModel, CreateProduceProductsModel, ItemProductionOrder } from 'src/app/models/website-orders.model';
import AppUtil from 'src/app/utilities/app-util';

@Component({
  selector: 'app-produce-order',
  templateUrl: './produce-order.component.html',
  styleUrls: ['produce-order.component.scss'],
})
export class ProduceOrderComponent implements OnInit {
  mode = 'website';
  isInvalidForm = false;
  loading: boolean = true;
  appUtil = AppUtil;
  sortFields: any[] = [];
  sortTypes: any[] = [];
  producesTemp: any = [];

  pendingRequest: any;
  isMobile = screen.width <= 1199;
  first = 0;
  totalRecords = 0;
  totalPages = 0;

  display: boolean = false;
  displayBillDetail = false;
  billDetail: BillDetailModel[] = [];
  productionOrderList: ItemProductionOrder[] = [];
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

  public getParams = {
    page: 0,
    pageSize: 20,
    status: 1,
    searchText: '',
    statusTab: 0,
    userId: null,
  };
  orderDetail;
  displayProduceDetail = false;
  dataSource = [];
  dataColumns = [];
  tabMenuItems: MenuItem[] = [];
  currentStatus: number = 1;
  activeItem: MenuItem;
  userList: any[] = [];
  protected readonly OrderStatus = OrderStatus;

  constructor(
    private activatedRoute: ActivatedRoute,
    private readonly manufactureOrderService: ManufactureOrderService,
    private readonly messageService: MessageService,
    private readonly translateService: TranslateService,
    private readonly translationService: TranslationService,
    protected reportDownloadService: ReportDownloadService,
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
  }

  ngOnInit(): void {
    this.endDate = new Date();
    this.getParams.status = null;
    this.tabMenuItems = [
      {
        label: this.translationService.translate('label.pending_approval'),
        icon: 'pi pi-clock',
        command: (event) => this.onStatusChange(OrderStatus.Pending, 0),
      },
      {
        label: this.translationService.translate('label.approved'),
        icon: 'pi pi-check-circle',
        command: (event) => this.onStatusChange(OrderStatus.Approved, 1),
      },
      {
        label: 'Hoàn thành',
        icon: 'pi pi-check-circle',
        command: (event) => this.onStatusChange(OrderStatus.Done, 2),
      },
      {
        label: 'Hủy',
        icon: 'pi pi-minus-circle',
        command: (event) => this.onStatusChange(OrderStatus.Cancel, 3),
      },
      {
        label: this.translationService.translate('label.all'),
        icon: 'pi pi-th-large',
        command: (event) => this.onStatusChange(OrderStatus.All, 4),
      },
    ];
    this.activeItem = this.tabMenuItems[0];
    this.userService.getAllUserActive().subscribe((res) => {
      this.userList = res.data;
    });
  }

  onStatusChange(status: number = 0, tabIndex: number) {
    this.activeItem = this.tabMenuItems[tabIndex];
    this.currentStatus = status;
    this.getOrder(null);
  }

  getOrder(event?: any, isExport: boolean = false) {
    if (this.pendingRequest) {
      this.pendingRequest.unsubscribe();
    }

    this.getParams.statusTab = this.currentStatus;
    if (event) {
      this.getParams.page = event.first / event.rows;
      this.getParams.pageSize = event.rows;
    }

    this.loading = true;
    this.getParams['FromAt'] = moment(this.startDate).format('YYYY-MM-DD');
    this.getParams['ToAt'] = moment(this.endDate).format('YYYY-MM-DD');

    Object.keys(this.getParams).map((key) => {
      if (this.getParams[key] === null || this.getParams[key] === undefined) this.getParams[key] = '';
    });

    this.manufactureOrderService.getPaging(this.getParams).subscribe({
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
    this.manufactureOrderService.getDetail(bill.id).subscribe({
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

  onChangeSelectProductionOrder(event) {
    this.paramCreateProduceProducts.name = event.value ? event.value : '';
  }

  onOrder(billDetail: any[]): void {
    const items = billDetail.filter((item) => item.checked);
    this.paramCreateProduceProducts.items = items;
    this.loading = true;

    if (this.selectProductionOrder) {
      this.manufactureOrderService.update(this.paramCreateProduceProducts).subscribe({
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

    this.manufactureOrderService.create(this.paramCreateProduceProducts).subscribe({
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
    this.manufactureOrderService.update(order).subscribe(
      (res) => {
        this.messageService.add({
          severity: 'success',
          detail: AppUtil.translate(this.translateService, 'success.update'),
        });
      },
      (error) => { },
      () => this.getOrder(),
    );
  }

  onDetailProduce(item) {
    this.loading = true;
    this.manufactureOrderService.getDetail(item.id).subscribe(
      (res) => {
        this.loading = false;
        this.orderDetail = res;
        this.dataSource = res?.items || [];
        this.display = true;
      },
      (err) => {
        this.loading = false;
      },
    );
  }

  accept(orderId: number): void {
    this.manufactureOrderService.accept(orderId).subscribe((res: any) => {
      AppUtil.scrollToTop();
      this.messageService.add({
        severity: 'success',
        detail: this.translationService.translate('success.approved_request'),
      });
      this.getOrder(null);
    });
  }

  notAccept(orderId: number): void {
    this.manufactureOrderService.notAccept(orderId).subscribe((res: any) => {
      AppUtil.scrollToTop();
      this.messageService.add({
        severity: 'success',
        detail: this.translationService.translate('success.not_approved_request'),
      });
      this.getOrder(null);
    });
  }

  delete(orderId: number): void {
    this.manufactureOrderService.delete(orderId).subscribe((res: any) => {
      AppUtil.scrollToTop();
      this.messageService.add({
        severity: 'success',
        detail: this.translationService.translate('success.delete'),
      });
      this.getOrder(null);
    });
  }

  export(orderId: number) {
    this.manufactureOrderService.export(orderId).subscribe((res: any) => {
      this.openDownloadFile(res.data, 'pdf');
    });
  }

  openDownloadFile(_fileName, _ft: string) {
    try {
      var _l = this.reportDownloadService.getFolderPathDownload(_fileName, _ft);
      if (_l) window.open(_l);
    } catch (ex) {
      // this.notificationService.error('Lỗi', 'Không thể download file');
    }
  }

  onSaveChangeNote(item: any) {
    this.manufactureOrderService.getDetail(item.id).subscribe((res: any) => {
      const detail = res;
      detail.note = item.note;
      this.manufactureOrderService.update(detail).subscribe((res: any) => {
        this.messageService.add({
          severity: 'success',
          detail: 'Cập nhật thành công',
        });

        this.getOrder(null);
      });
    });
  }

  onSaveChangeCanceledNote(item: any) {
    this.manufactureOrderService.getDetail(item.id).subscribe((res: any) => {
      const detail = res;
      detail.canceledNote = item.canceledNote;
      this.manufactureOrderService.updateCanceledNote(detail).subscribe((res: any) => {
        this.messageService.add({
          severity: 'success',
          detail: 'Cập nhật thành công',
        });

        this.getOrder(null);
      });
    });
  }
}
