import { Component, OnInit } from '@angular/core';
import { ProcedureCodeType } from '@app/shared/common/enums/procedure-code.type';
import * as moment from 'moment';
import { AccountBalanceSheetReportService } from 'src/app/service/account-balance-sheet-report';
import { SellReportServiceService } from 'src/app/service/sell-report-service.service';
import { ActivatedRoute } from '@angular/router';
import AppUtil from 'src/app/utilities/app-util';
import { TranslateService } from '@ngx-translate/core';
import { MessageService } from 'primeng/api';
import { CustomerService } from '../../../service/customer.service';
import {
  BillDetailModel,
  CreateProduceProductsModel,
  ItemProductionOrder,
  StatusModel,
} from 'src/app/models/website-orders.model';
import { WebsiteOrdersService } from 'src/app/service/website-orders.service';
import { ColumnDataType } from 'src/app/core/enum';

@Component({
  selector: 'app-website-orders',
  templateUrl: './website-orders.component.html',
  styles: [
    `
      :host ::ng-deep .p-dropdown {
        width: 250px;
      }

      :host ::ng-deep .p-inputtext {
        width: 250px;
      }

      :host ::ng-deep p-autocomplete,
      :host ::ng-deep .p-autocomplete {
        width: auto !important;
      }
    `,
  ],
})
export class WebsiteOrdersComponent implements OnInit {
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
  statusProductionOrders: StatusModel[];
  startDate = new Date();
  endDate = new Date();
  customers: any[] = [];
  employees: any[];
  goods: any[];
  cols: any[] = [
    {header: 'label.code_orders', value: 'id', width: 'width:12%'},
    {header: 'label.status', value: 'status', width: 'width:12%'},
    {header: 'label.create_at', value: 'createAt', width: 'width:12%'},
    {
      header: 'label.customer_name',
      value: 'fullName',
      width: 'width:12%',
    },
    {header: 'label.phone', value: 'tell', width: 'width:12%'},
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
  status: any[] = [
    {
      statusName: 'Mới tạo',
      statusValue: 1,
    },
    {
      statusName: 'Đã xác nhận',
      statusValue: 2,
    },
    {
      statusName: 'Đang giao',
      statusValue: 3,
    },
    {
      statusName: 'Đã giao',
      statusValue: 4,
    },
    {
      statusName: 'Hoàn thành',
      statusValue: 5,
    },
    {
      statusName: 'Hủy',
      statusValue: 6,
    },
  ];

  public getParams = {
    page: 0,
    pageSize: 20,
    status: 1,
    searchText: '',
  };
  orderDetail
  displayProduceDetail = false
  dataSource = []
  dataColumns = []

  constructor(
    private activatedRoute: ActivatedRoute,
    private readonly sellReportService: SellReportServiceService,
    private readonly messageService: MessageService,
    private readonly translateService: TranslateService,
    private readonly websiteOrdersService: WebsiteOrdersService,
    private readonly customerService: CustomerService,
    private accountBalanceSheetReportService: AccountBalanceSheetReportService,
  ) {
    this.dataColumns = [
      {header: 'label.code_orders', value: 'produceProductId', width: '20%'},
      {header: 'label.order_new_detail_good_code', value: 'goodsCode', width: '30%'},
      {header: 'label.order_new_detail_good_name', value: 'goodsName', width: '35%'},
      {header: 'label.order_new_detail_good_quantity_real', value: 'quantity', width: '15%', type: ColumnDataType.number},
    ]
  }

  ngOnInit(): void {
    this.activatedRoute.url.subscribe((url) => {
      if (url[0].path === 'production-orders') {
        this.mode = 'product';
      }
      if (url[0].path === 'production-orders-new') {
        this.mode = 'product-new';
      }
    });
    if (this.mode === 'website') {
      this.startDate.setDate(1);
      this.getOrder();
    } else if (this.mode === 'product-new') {
      this.startDate = null;
      this.endDate = null;
      this.getParams.status = null;
      this.getListCustomer();
      this.getGoodsList();
    } else if (this.mode === 'product') {
      this.getListCustomer();
      this.getStatusList();
      this.startDate = new Date(2020,1,1);
      this.endDate = new Date();
      this.getParams.status = null;
    }
  }

  getListCustomer(): void {
    this.customerService.getAllCustomer().subscribe((res) => {
      this.customers = res.data;
    });
  }

  getStatusList() {
    this.websiteOrdersService
      .getStatusList()
      .subscribe((res: StatusModel[]) => {
        this.statusProductionOrders = res;
      });
  }

  getGoodsList() {
    this.websiteOrdersService.getGoodsList().subscribe((res: any[]) => {
      this.goodsList = res;
    });
  }

  getOrderList(event?: any): void {
    if (this.pendingRequest) {
      this.pendingRequest.unsubscribe();
    }
    if (event) {
      this.getParams.page = event.first / event.rows;
      this.getParams.pageSize = event.rows;
    }

    Object.keys(this.getParams).map((key) => {
      if (this.getParams[key] === null || this.getParams[key] === undefined)
        this.getParams[key] = '';
    });
    this.loading = true;
    this.websiteOrdersService
      .getListOrderProduceProducts(this.getParams)
      .subscribe({
        next: (res): void => {
          this.producesTemp = res.data;
          this.totalRecords = res.totalItems || 0;
          this.totalPages = res.totalItems / res.pageSize + 1;
          this.loading = false;
        },
      });
  }

  getProductionOrderList(event?: any): void {
    if (this.pendingRequest) {
      this.pendingRequest.unsubscribe();
    }
    if (event) {
      this.getParams.page = event.first / event.rows;
      this.getParams.pageSize = event.rows;
    }
    this.getParams['startDate'] = moment(this.startDate).format('YYYY-MM-DD');
    this.getParams['endDate'] = moment(this.endDate).format('YYYY-MM-DD');
    Object.keys(this.getParams).map((key) => {
      if (this.getParams[key] === null || this.getParams[key] === undefined)
        this.getParams[key] = '';
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

  getOrder(event?: any, isExport: boolean = false) {
    if (this.pendingRequest) {
      this.pendingRequest.unsubscribe();
    }
    if (event) {
      this.getParams.page = event.first / event.rows + 1;
      this.getParams.pageSize = event.rows;
    }

    this.loading = true;
    this.getParams['startDate'] = moment(this.startDate).format('YYYY-MM-DD');
    this.getParams['endDate'] = moment(this.endDate).format('YYYY-MM-DD');

    Object.keys(this.getParams).map((key) => {
      if (this.getParams[key] === null || this.getParams[key] === undefined)
        this.getParams[key] = '';
    });

    this.sellReportService.getWebsiteOrder(this.getParams).subscribe({
      next: (res) => {
        this.lstPayment = res.data;
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

  getAllProductionOrder() {
    this.loading = true;
    this.websiteOrdersService
      .getAllProductionOrder(ProcedureCodeType.NEW_ORDER)
      .subscribe({
        next: (res) => {
          this.productionOrderList = res;
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
        this.displayBillDetail = true;
        this.loading = false;
        if (res.items) {
          this.billDetail = res.items;
          this.paramCreateProduceProducts.id = bill.id;
          this.paramCreateProduceProducts.customerId = bill.customerId;
          this.paramCreateProduceProducts.note = bill.note;
          this.getAllProductionOrder();
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

  exportBill() {
    this.sellReportService.getExportBill(this.getParams).subscribe((res) => {
      this.customers = res.data;
      this.openDownloadFile(res.data, 'excel');
    });
  }

  openDownloadFile(_fileName, _ft: string) {
    try {
      var _l = this.accountBalanceSheetReportService.getFolderPathDownload(
        _fileName,
        _ft,
      );
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
      this.websiteOrdersService
        .updateProductionOrder(this.paramCreateProduceProducts)
        .subscribe({
          next: (res): void => {
            this.loading = false;
            this.displayBillDetail = false;
            this.messageService.add({
              severity: 'success',
              detail: AppUtil.translate(
                this.translateService,
                'success.create',
              ),
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

    this.websiteOrdersService
      .createProductionOrder(this.paramCreateProduceProducts)
      .subscribe({
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
      (error) => {
      },
      () => this.getOrder(),
    );
  }

  onUpdateStatusOrder(id, event) {
    if (!id || !event || !event.value) return;
    this.websiteOrdersService
      .updateStatusProductionOrder(id, event.value)
      .subscribe({
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
      billDetail.quantityRequired * billDetail.unitPrice +
      billDetail.taxVat -
      billDetail.discountPrice,
    );
  }

  onDetailProduce(item) {
    this.loading = true
    this.websiteOrdersService.getProductionOrderById(item.id).subscribe(res => {
      this.loading = false
      this.orderDetail = res
      this.dataSource = res?.items || []
      this.displayProduceDetail = true
    }, err => {
      this.loading = false
    })
  }
}
