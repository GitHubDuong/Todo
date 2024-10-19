import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ManufactureOrderService } from '@app/service/manufacture-order.service';
import { ProducePlanningWarehouseService } from '@app/service/produces/produce-planning-warehouse.service';
import { ReportDownloadService } from '@app/service/report-download';
import { TranslationService } from '@app/service/translation.service';
import { WebsiteOrdersService } from '@app/service/website-orders.service';
import { ProducePlanningRequestingPaymentFormComponent } from '@components/procedure-module/requesting-payment-pass/requesting-payment-form/produce-planning-requesting-payment-form.component';
import { CarDeliveryFormComponent } from '@components/sell-module/car-delivery/car-delivery-form/car-delivery-form.component';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-produce-planning-warehouse-form',
  templateUrl: './produce-planning-warehouse-form.component.html',
  styleUrls: ['./produce-planning-warehouse-form.component.scss'],
})
export class ProducePlanningWarehouseFormComponent implements OnInit, OnChanges {
  @Input() display: boolean = false;
  @Input() detail: any = {};
  @Output() onFormClosing = new EventEmitter();

  goodDetailDisplay: boolean = false;
  goodDetails: any[];
  manufactureOrders: any[] = [];
  manufactureOrder: any = {
    id: 0,
    note: '',
  };
  items = [
    {
      label: 'Sửa thông tin xe',
      icon: 'pi pi-fw pi-pencil',
      command: () => this.onUpdateCarDelivery(),
    },
    {
      label: 'Sửa phiếu đề nghị thanh toán',
      icon: 'pi pi-fw pi-pencil',
      command: () => this.onEditRequestingPayment(),
    },
    { label: 'In giấy ra cổng', icon: 'pi pi-fw pi-download', command: () => this.onPrintGatePass() },
    { label: 'In giấy đề nghị thanh toán', icon: 'pi pi-fw pi-download', command: () => this.onPrintPaymentProposal() },
    { label: 'In phiếu xuất kho', icon: 'pi pi-fw pi-download', command: () => this.onPrintPlanningExportForCar() },
  ];
  protected groupHandleItem: any;
  carUpdateFormVisible: boolean = false;
  requestingPaymentFormVisible: boolean = false;
  isMobile = screen.width < 1200;

  get detailItems() {
    console.log(this.detail?.items);
    return this.detail?.items || [];
  }

  showUpdateProduce: boolean = false;
  manufactureOrderForm: FormGroup;
  selectAll = false;
  @ViewChild('carDeliveryForm') carDeliveryForm: CarDeliveryFormComponent;
  @ViewChild('requestingPaymentFormComponent') requestingPaymentFormComponent: ProducePlanningRequestingPaymentFormComponent;

  constructor(
    private readonly messageService: MessageService,
    private readonly translationService: TranslationService,
    private readonly manufactureOrderService: ManufactureOrderService,
    private readonly producePlanningWarehouseService: ProducePlanningWarehouseService,
    private readonly websiteOrdersService: WebsiteOrdersService,
    private reportDownloadService: ReportDownloadService,
  ) {}

  ngOnChanges(changes: SimpleChanges): void {}

  ngOnInit(): void {
    this.manufactureOrderService.getAll().subscribe((response) => {
      this.manufactureOrders = response;
    });
  }

  sumGroup(goods: any[], field: string) {
    return goods.reduce((sum, good) => sum + good[field], 0);
  }

  onShowDetail(goodDetails: any[]) {
    this.goodDetails = goodDetails;
    this.goodDetailDisplay = true;
  }

  onSaveProduceProduct(): void {
    const request = this.prepareRequestProduceProduct();
    if (request === null) {
      return;
    }
    (this.manufactureOrder.id
      ? this.manufactureOrderService.updateProductionOrder(this.manufactureOrder.id, request)
      : this.manufactureOrderService.createProductionOrder(request)
    ).subscribe(
      (res) => {
        this.onFormClosing.emit();
        this.manufactureOrder = {
          id: 0,
          note: '',
        };

        this.messageService.add({
          severity: 'success',
          detail: this.translationService.translate('success.create'),
        });
      },
      (err) => {},
    );
  }

  prepareRequestProduceProduct() {
    if (this.manufactureOrder.id == 0 && this.manufactureOrder.note == '') {
      this.messageService.add({
        severity: 'error',
        detail: 'Bạn cần nhập tên/ chọn tên lệnh sản xuất',
      });
      return null;
    }

    const items =
      this.detailItems?.reduce((arr, gr) => {
        gr.goods
          .filter((item) => item.checked === true)
          .forEach((item) => {
            arr.push({
              carId: gr.carId,
              carName: gr.carName,
              goodsId: item.goodsId,
              quantityRequired: item.quantityRequired,
              quantityReal: item.quantityReal,
              customerId: item.customerId,
              warehousePlanningProduceProductDetailId: item.id,
            });
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
      id: this.manufactureOrder.id ?? 0,
      note: this.manufactureOrder.note,
      items,
    };
  }

  onUpdateOrderProduceProduct() {
    this.producePlanningWarehouseService.update(this.detail).subscribe((res) => {
      this.onFormClosing.emit();
      this.messageService.add({
        severity: 'success',
        detail: this.translationService.translate('success.update'),
      });
    });
  }

  onUpdateCarDelivery() {
    this.carDeliveryForm.edit(this.groupHandleItem.carId, this.groupHandleItem.carName, this.detail?.id);
  }

  onEditRequestingPayment() {
    this.requestingPaymentFormComponent.onEdit(this.detail?.id, this.groupHandleItem.carId, this.groupHandleItem.carName);
  }

  onPrintGatePass() {
    this.websiteOrdersService
      .producePlanningExportGatePass(this.groupHandleItem.carId, this.groupHandleItem.carName, this.detail?.id)
      .subscribe((res: any) => {
        this.openDownloadFile(res.data, 'pdf');
      });
  }

  onPrintPaymentProposal() {
    this.websiteOrdersService
      .producePlanningExportPaymentProposal(this.groupHandleItem.carId, this.groupHandleItem.carName, this.detail?.id)
      .subscribe((res: any) => {
        this.openDownloadFile(res.data, 'pdf');
      });
  }

  onPrintPlanningExportForCar() {
    this.websiteOrdersService
      .producePlanningExportForCar(this.groupHandleItem.carId, this.groupHandleItem.carName, this.detail?.id)
      .subscribe((res: any) => {
        var fileExports = res;
        if (fileExports !== null) {
          fileExports.forEach((element) => {
            this.openDownloadFile(element, 'pdf');
          });
        }
      });
  }

  openDownloadFile(fileName, filetype: string) {
    try {
      var _l = this.reportDownloadService.getFolderPathDownload(fileName, filetype);
      if (_l) window.open(_l);
    } catch (ex) {
      // this.notificationService.error('Lỗi', 'Không thể download file');
    }
  }

  onCarUpdateSuccess($event: boolean) {
    console.log('Update car success');
  }

  onShowUpdateProduce() {
    this.showUpdateProduce = true;
  }

  onToggleSelectAll() {
    (this.detail?.items || []).forEach((item: any) => {
      (item.goods || []).forEach((good: any) => {
        good.checked = this.selectAll;
      });
    });
  }

  onChangeManufactureOrder() {
    const item = this.manufactureOrders.find((item) => item.id == this.manufactureOrder.id);
    if (item) {
      this.manufactureOrder.note = item.note;
    }
  }
}
