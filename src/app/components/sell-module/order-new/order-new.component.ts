import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { TableColumModel } from '@app/models/common/table-colum.model';
import { IBillPromotion } from '@app/models/goods-promotion.model';
import { ControlType } from '@app/models/table/column';
import { ToastService } from '@app/service/toast.service';
import { TranslationService } from '@app/service/translation.service';
import { WebsiteOrdersService } from '@app/service/website-orders.service';
import { ProcedureCodeType } from '@app/shared/common/enums/procedure-code.type';
import { DateTimeHelper } from '@app/shared/helper/date-time.helper';
import { BillPromotionComponent } from '@components/sell-module/components/bill-discount/bill-promotion.component';
import { OrderStatusOptions } from '@components/sell-module/order-new/config/new-order.config';
import { NewOrderHelper, NewOrderModel } from '@components/sell-module/order-new/model/new-order.model';
import { TranslateService } from '@ngx-translate/core';
import { OrderStatus, RequestOvertimesStatus } from '@utilities/app-enum';
import { format } from 'date-fns';
import * as _ from 'lodash';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { ColumnDataType } from 'src/app/core/enum';
import { default as AppUtil, default as appUtil } from 'src/app/utilities/app-util';

@Component({
  selector: 'app-order-new',
  templateUrl: './order-new.component.html',
  styleUrls: ['./order-new.component.scss'],
})
export class OrderNewComponent implements OnInit {
  loading;
  isMobile = screen.width <= 1199;
  display: boolean = false;
  filterForm!: FormGroup;
  paginator = {
    totalRecords: 0,
    currentPage: 0,
    pageSize: 20,
  };
  filterParam: any = {
    page: 0,
    pageSize: 20,
  };
  dataSource: NewOrderModel[] = [];
  dataColumns = [];
  status: any[] = OrderStatusOptions;
  displayBillDetail;
  billDetail;
  detailColumns = [];
  detailDatasource = [];
  detailQuotaColumns = [];
  ColumnDataType = ColumnDataType;
  footerActionForm!: FormGroup;
  produceProductsExistList;
  cars = [];
  tabMenuItems: MenuItem[] = [];
  currentStatus: number = 1;
  activeItem: MenuItem;
  protected readonly OrderStatus = OrderStatus;
  billPromotions: IBillPromotion[] = [];
  planningBillPromotions: IBillPromotion[] = [];
  columns: TableColumModel[] = [];
  goodDetail: any;
  showGoodDetail = false;
  showUpdatePlanning = false;
  downloading = false;
  checkAllDetail = false;
  @ViewChild('billPromotionComponent') billPromotionComponent: BillPromotionComponent;
  @ViewChild('planBillPromotionComponent') planBillPromotionComponent: BillPromotionComponent;

  constructor(
    private readonly messageService: MessageService,
    private readonly translateService: TranslateService,
    private readonly websiteOrdersService: WebsiteOrdersService,
    private readonly translationService: TranslationService,
    private toastService: ToastService,
    private confirmService: ConfirmationService,
  ) {
    this.dataColumns = [
      { header: '', value: 'isChecked', width: '5%', type: ColumnDataType.checkbox },
      {
        header: 'label.special',
        value: 'isSpecialOrder',
        width: '8%',
        type: ColumnDataType.tag,
        contentFunc: (item: any): string => (item.isSpecialOrder == true ? translationService.translate('label.special') : ''),
      },
      { header: 'label.status_procedure', value: 'procedureStatusName', width: '10%' },
      { header: 'label.procedure_number', value: 'order', width: '15%', type: ColumnDataType.raw },
      { header: 'label.employee', value: 'employee', width: '16%', type: ColumnDataType.raw },
      { header: 'label.customer_name', value: 'customer', width: '15%', type: ColumnDataType.raw },
      { header: 'label.new_order_number_of_product', value: 'price', width: '11%', type: ColumnDataType.raw },
      { header: 'label.note', value: 'note', width: '10%' },
      { header: '', value: '', width: '15%', type: ColumnDataType.action },
    ];
    this.detailColumns = [
      { header: '', value: '', width: '5%', type: ColumnDataType.checkbox },
      { header: '', value: '', width: '5%', type: ColumnDataType.action },
      { header: 'label.order_new_detail_good_code', value: 'goodsCode', width: '14%' },
      { header: 'label.order_new_detail_good_name', value: 'goodsName', width: '20%' },
      {
        header: 'label.order_new_detail_good_quantity_required',
        value: 'quantityRequired',
        width: '8%',
        type: ColumnDataType.number,
      },
      {
        header: 'label.order_new_detail_good_quantity_real',
        value: 'quantityReal',
        width: '8%',
        type: ColumnDataType.edit,
        controlType: ControlType.InputNumber,
      },
      {
        header: 'label.order_new_detail_good_quantity_stock',
        value: 'quantityStock',
        width: '8%',
        type: ColumnDataType.number,
      },
      {
        header: 'label.unit_price',
        value: 'unitPrice',
        width: '8%',
        type: ColumnDataType.edit,
        controlType: ControlType.InputNumber,
      },
      {
        header: 'label.amount',
        value: 'amount',
        width: '8%',
        contentFunc: this.formatTotalDetailTotal,
        type: ColumnDataType.number,
      },
      {
        header: 'label.order_new_detail_in_progress',
        value: 'quantityInProgress',
        width: '8%',
        type: ColumnDataType.number,
      },
      {
        header: 'label.order_new_detail_delivered',
        value: 'quantityDelivered',
        width: '8%',
        type: ColumnDataType.number,
      },
    ];
    this.detailQuotaColumns = [
      { header: 'label.order_new_detail_index', value: '', width: '11%', type: ColumnDataType.action },
      { header: 'label.order_new_detail_good_code', value: 'goodsCode', width: '15%' },
      { header: 'label.order_new_detail_good_name', value: 'goodsName', width: '25%' },
      {
        header: 'label.order_new_detail_quotes',
        value: 'quantityQuote',
        width: '15%',
        type: ColumnDataType.number,
      },
      {
        header: 'label.order_new_detail_good_quantity_required',
        value: 'quantityRequired',
        width: '15%',
        type: ColumnDataType.number,
      },
      {
        header: 'label.order_new_detail_good_quantity_stock',
        value: 'quantityStock',
        width: '19%',
        type: ColumnDataType.number,
      },
    ];

    this.tabMenuItems = [
      {
        id: OrderStatus.Pending.toString(),
        label: this.translationService.translate('label.pending_approval'),
        icon: 'pi pi-clock',
        command: (event) => this.onStatusChange(OrderStatus.Pending),
      },
      {
        id: OrderStatus.Approved.toString(),
        label: this.translationService.translate('label.approved'),
        icon: 'pi pi-check-circle',
        command: (event) => this.onStatusChange(OrderStatus.Approved),
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
        id: OrderStatus.All.toString(),
        label: this.translationService.translate('label.all'),
        icon: 'pi pi-th-large',
        command: (event) => this.onStatusChange(OrderStatus.All),
      },
    ];
    this.activeItem = this.tabMenuItems[0];
  }

  isSpecial(item: any) {
    return item.isSpecialOrder == true ? this.translationService.translate('label.special') : '';
  }

  onStatusChange(status: number = 0) {
    this.currentStatus = status;
    this.activeItem = this.tabMenuItems.find((x) => x.id == status.toString());
    this.getOrders(null);
  }

  formatTotalDetailTotal(detailItem: any) {
    const amount = detailItem.quantityRequired * detailItem.unitPrice;
    return appUtil.formatMoney(amount, 0);
  }

  ngOnInit(): void {
    this.filterForm = new FormGroup({
      fromAt: new FormControl(DateTimeHelper.firstDayOfCurrentMonth()),
      toAt: new FormControl(new Date()),
      status: new FormControl(null),
      searchText: new FormControl(''),
    });
    this.resetFormFooter();
    this.getOrders();
  }

  resetFormFooter() {
    this.footerActionForm = new FormGroup({
      produceProductsName: new FormControl(null),
      planningProduceProductId: new FormControl(null),
      isSpecialOrder: new FormControl(false),
      carId: new FormControl(null),
    });
  }

  getOrders(event?: any) {
    this.filterParam.statusTab = this.currentStatus;
    if (event) {
      this.filterParam.page = event ? event.first / event.rows : this.paginator.currentPage;
      this.filterParam.pageSize = event ? event.rows : this.paginator.pageSize;
    }

    Object.keys(this.filterForm.value).map((key) => {
      if (this.filterForm.value[key] !== null && this.filterForm.value[key] !== undefined) {
        if (['fromAt', 'toAt'].includes(key))
          this.filterParam = {
            ...this.filterParam,
            [key]: format(this.filterForm.value[key], 'yyyy-MM-dd'),
          };
        else
          this.filterParam = {
            ...this.filterParam,
            [key]: this.filterForm.value[key],
          };
      }
    });
    this.loading = true;

    this.websiteOrdersService.getListOrderProduceProducts(this.filterParam).subscribe(
      (res) => {
        this.loading = false;
        this.dataSource = res.data.map((item: NewOrderModel) => NewOrderHelper.toTableModel(item));
        this.paginator = {
          ...this.paginator,
          currentPage: res.currentPage + 1,
          totalRecords: res.totalItems,
          pageSize: res.pageSize,
        };
      },
      (err) => {
        this.loading = false;
      },
    );
  }

  getOrderDetail(item) {
    this.loading = true;
    this.websiteOrdersService.getOrderById(item.id).subscribe(
      (res) => {
        this.displayBillDetail = true;
        this.loading = false;
        this.billDetail = res;
        this.footerActionForm.patchValue({
          isSpecialOrder: res.isSpecialOrder,
          produceProductsName: this.billDetail.note,
        });
        this.billPromotions = res.billPromotions;
        this.detailDatasource =
          res?.items?.reduce((arr, _it) => {
            const _goodsQuotes = _it.goodsQuotes?.map((_good) => {
              return {
                ..._good,
                error: false,
              };
            });
            arr.push({
              ..._it,
              goodsQuotes: _goodsQuotes,
              checked: false,
            });
            return arr;
          }, []) || [];
      },
      (err) => {
        this.loading = false;
      },
    );

    this.websiteOrdersService.getAllProductionOrder(ProcedureCodeType.NEW_ORDER).subscribe(
      (res) => {
        this.loading = false;
        this.produceProductsExistList = res;
      },
      (err) => {
        this.loading = false;
      },
    );
    this.getCars(null);
  }

  getCars(event) {
    let id = 0;
    if (event != null) {
      id = event.value;
      const item = this.produceProductsExistList.find((item: any) => item.id == id);
      if (item) {
        this.footerActionForm.patchValue({
          produceProductsName: item.note,
        });
      }
    }
    this.websiteOrdersService.getAllCars(id).subscribe((response) => {
      this.cars = response;
    });
  }

  prepareRequestProduceProduct() {
    const items =
      this.detailDatasource?.reduce((arr, _item) => {
        if (_item.checked)
          arr.push({
            id: _item.id,
            planningProduceProductId: this.footerActionForm.value.planningProduceProductId || 0,
            goodsId: _item.goodsId,
            goodsCode: _item.goodsCode,
            goodsName: _item.goodsName,
            quantity: _item.quantityReal,
            unitPrice: _item.unitPrice,
            customerId: this.billDetail.customerId,
            carId: this.footerActionForm.value.carId < 0 ? null : this.footerActionForm.value.carId,
            carName: this.cars.find((x) => x.id == this.footerActionForm.value.carId)?.licensePlates,
          });
        return arr;
      }, []) || [];

    if (!items?.length) {
      this.messageService.add({
        severity: 'error',
        detail: 'Cần chọn ít nhất 1 sản phẩm để tạo lệnh sản xuất',
      });
      return null;
    }
    return {
      id: this.footerActionForm.value.planningProduceProductId ?? 0,
      note: this.footerActionForm.value.produceProductsName || '',
      items,
      billPromotions: this.planningBillPromotions,
    };
  }

  prepareRequestOrderProduceProduct() {
    const items =
      this.detailDatasource?.reduce((arr, _item) => {
        arr.push({
          id: _item.id,
          goodsId: _item.goodsId,
          goodsCode: _item.goodsCode,
          goodsName: _item.goodsName,
          quantityReal: _item.quantityReal,
          quantityRequired: _item.quantityRequired,
          unitPrice: _item.unitPrice,
        });
        return arr;
      }, []) || [];

    return {
      id: this.billDetail.id,
      customerId: this.billDetail.customerId,
      note: this.billDetail.note || '',
      isSpecialOrder: this.footerActionForm.value.isSpecialOrder || false,
      billPromotions: this.billPromotions,
      totalAmount: this.orderTotalAmount,
      items,
    };
  }

  get subTotal() {
    return this.detailDatasource?.reduce((total, current) => total + current.quantityRequired * current.unitPrice, 0);
  }

  get orderTotalAmount(): number {
    return this.subTotal - this.billDiscount;
  }

  get billDiscount() {
    return this.billPromotionComponent?.promotionDiscountAmount || 0;
  }

  onSaveProduceProduct(): void {
    const request = this.prepareRequestProduceProduct();
    if (request === null) {
      return;
    }

    this.loading = true;
    (this.footerActionForm.value.planningProduceProductId
      ? this.websiteOrdersService.updateProductionOrder(request)
      : this.websiteOrdersService.createProductionOrder(request)
    ).subscribe(
      (res) => {
        this.loading = false;
        this.displayBillDetail = false;
        this.resetFormFooter();
        this.getOrders();
        this.messageService.add({
          severity: 'success',
          detail: AppUtil.translate(this.translateService, 'success.create'),
        });
        this.showUpdatePlanning = false;
      },
      (err) => {
        this.loading = false;
      },
    );
  }

  onChangeRealQuantity(item) {
    item.goodsQuotes?.map((_it) => {
      _it.quantityRequired = Number(_it.quantityQuote || 0) * Number(item.quantityReal || 0);
      _it.error = _it.quantityRequired > _it.quantityStock;
    });
  }

  protected readonly RequestOvertimesStatus = RequestOvertimesStatus;

  accept(orderId: number): void {
    this.websiteOrdersService.accept(orderId).subscribe((res: any) => {
      AppUtil.scrollToTop();
      this.messageService.add({
        severity: 'success',
        detail: this.translationService.translate('success.approved_request'),
      });
      this.getOrders(null);
    });
  }

  notAccept(orderId: number): void {
    this.websiteOrdersService.notAccept(orderId).subscribe((res: any) => {
      AppUtil.scrollToTop();
      this.messageService.add({
        severity: 'success',
        detail: this.translationService.translate('success.not_approved_request'),
      });
      this.getOrders(null);
    });
  }

  delete(orderId: number): void {
    this.websiteOrdersService.delete(orderId).subscribe((res: any) => {
      AppUtil.scrollToTop();
      this.messageService.add({
        severity: 'success',
        detail: this.translationService.translate('success.delete'),
      });
      this.getOrders(null);
    });
  }

  onUpdateOrderProduceProduct() {
    const request = this.prepareRequestOrderProduceProduct();
    this.websiteOrdersService.updateOrderProduceProduct(request).subscribe((res) => {
      this.displayBillDetail = false;
      this.resetFormFooter();
      this.messageService.add({
        severity: 'success',
        detail: AppUtil.translate(this.translateService, 'success.update'),
      });
    });
  }

  onSelectPromotionSuccess($event: IBillPromotion[], isPlanningEvent: boolean) {
    if (isPlanningEvent) this.planningBillPromotions = $event;
    else this.billPromotions = $event;
  }

  get calendarStyle() {
    return {
      'min-width': '150px',
    };
  }

  protected readonly ControlType = ControlType;

  onShowGoodDetail(orderDetail: any) {
    this.showGoodDetail = true;
    this.goodDetail = orderDetail.goodsQuotes;
  }

  onShowUpdatePlanning() {
    this.showUpdatePlanning = true;
    this.planningBillPromotions = _.cloneDeep(this.billPromotions);
  }

  onCancelOrder() {
    if (!this.billDetail) {
      return;
    }
    this.confirmService.confirm({
      header: 'Xác nhận',
      message: 'Bạn có chắc chắn muốn huỷ đơn hàng này không?',
      accept: () => {
        this.websiteOrdersService.cancelOrder(this.billDetail.id).subscribe((res) => {
          this.toastService.success('Huỷ đơn hàng thành công');
        });
      },
    });
  }

  onDownloadProduceProduct(id) {
    this.downloading = true;
    this.websiteOrdersService.exportOrder(id).subscribe((res) => {
      AppUtil.openDownloadFile(res.data, 'pdf');
      this.downloading = false;
    });
  }

  onToggleCheckAllDetail() {
    (this.detailDatasource || []).map((item: any) => {
      item.checked = this.checkAllDetail;
    });
  }

  onToggleCheckAll() {
    (this.dataSource || []).map((item: any) => {
      item.isChecked = this.checkAllDetail;
    });
  }

  importExcel(event) {
    if (!event || !event.target?.files[0]) {
      return;
    }
    const formData = new FormData();
    formData.append('file', event.target?.files[0]);
    this.websiteOrdersService.importExcel(formData).subscribe((response: any) => {
      this.messageService.add({
        severity: 'success',
        detail: AppUtil.translate(this.translateService, 'Tải tệp thành công'),
      });

      this.getOrders();
    });
  }

  exportExcel() {
    const ids =
      this.dataSource?.reduce((arr, _item) => {
        if (_item.isChecked)
          arr.push(_item.id);
        return arr;
      }, []) || [];

    if (!ids || ids.length === 0) {
      this.toastService.error("Vui lòng chọn phần tử cần tải xuống!");
      return;
    }

    this.websiteOrdersService.exportExcel(ids).subscribe((res) => {
      this.openDownloadFile(res.data, `excel`);
    });
  }

  openDownloadFile(_fileName: string, _ft: string) {
    try {
      var _l = this.websiteOrdersService.getFolderPathDownload(_fileName, _ft);
      if (_l) window.open(_l);
    } catch (ex) {}
  }
}
