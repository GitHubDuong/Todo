import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild, ViewChildren } from '@angular/core';
import { ReportDownloadService } from '@app/service/report-download';
import { ToastService } from '@app/service/toast.service';
import { TranslationService } from '@app/service/translation.service';
import { WebsiteOrdersService } from '@app/service/website-orders.service';
import { ProducePlanningRequestingPaymentFormComponent } from '@components/procedure-module/requesting-payment-pass/requesting-payment-form/produce-planning-requesting-payment-form.component';
import { CarDeliveryFormComponent } from '@components/sell-module/car-delivery/car-delivery-form/car-delivery-form.component';
import { environment } from '@env/environment';
import { OrderStatus } from '@utilities/app-enum';
import { ConfirmationService, MessageService } from 'primeng/api';
import { FileUpload } from 'primeng/fileupload';

@Component({
  selector: 'app-produce-planning-form',
  templateUrl: './produce-planning-form.component.html',
  styleUrls: ['./produce-planning-form.component.scss'],
})
export class ProducePlanningFormComponent implements OnInit, OnChanges {
  @ViewChild('carDeliveryForm') carDeliveryForm: CarDeliveryFormComponent;
  @ViewChild('requestingPaymentFormComponent') requestingPaymentFormComponent: ProducePlanningRequestingPaymentFormComponent;
  @Input() plan: any;
  @Input() display: boolean = false;
  @Input() detail: any = {};
  @Input() currentTab: any;
  @Input() planningProduceProductId: number = 0;
  @Output() onFormClosing = new EventEmitter();
  @Output() carInfoUpdated = new EventEmitter();
  requestingPaymentFormVisible: boolean = false;
  isMobile = window.innerWidth < 1200;
  normalItems = [
    {
      label: 'Sửa thông tin xe',
      icon: 'pi pi-fw pi-info-circle',
      command: () => this.onUpdateCarDelivery(),
    },
    // {
    //   label: 'Sửa phiếu đề nghị thanh toán',
    //   icon: 'pi pi-fw pi-pencil',
    //   command: () => this.onEditRequestingPayment(),
    // },
  ];
  fullItems = [
    {
      label: 'Sửa thông tin xe',
      icon: 'pi pi-fw pi-info-circle',
      command: () => this.onUpdateCarDelivery(),
    },
    // {
    //   label: 'Sửa phiếu đề nghị thanh toán',
    //   icon: 'pi pi-fw pi-pencil',
    //   command: () => this.onEditRequestingPayment(),
    // },
    { label: 'In giấy ra cổng', icon: 'pi pi-fw pi-book', command: () => this.onPrintGatePass() },
    // { label: 'In giấy đề nghị thanh toán', icon: 'pi pi-fw pi-calendar', command: () => this.onPrintPaymentProposal() },
    {
      label: 'In phiếu xuất kho',
      icon: 'pi pi-fw pi-calendar-plus',
      command: () => this.onPrintPlanningExportForCar(),
    },
    // { label: 'Lưu công nợ', icon: 'pi pi-fw pi-bookmark', command: () => this.onSaveDept() },
  ];
  items = [];
  carUpdateFormVisible: boolean = false;
  protected groupHandleItem: any;
  selectedItem: any = undefined;
  showImageDetail = false;
  promotionList: any[] = [];
  showPromotion = false;
  isUploaded = false;

  get detailItems() {
    return this.detail?.items || [];
  }

  @ViewChildren(FileUpload) fileUploads: FileUpload[];

  constructor(
    private readonly messageService: MessageService,
    private readonly translationService: TranslationService,
    private readonly websiteOrdersService: WebsiteOrdersService,
    private reportDownloadService: ReportDownloadService,
    private confirmationService: ConfirmationService,
    private toastService: ToastService,
  ) {}

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges) {
    const { detail, plan } = changes;
    if (detail && detail.currentValue) {
      console.log(this.detail);
    }
    if (plan && plan.currentValue) {
      if (this.plan.isFinished) {
        this.items = this.fullItems;
      } else {
        this.items = this.normalItems;
      }
    }
  }

  sumGroup(goods: any[], field: string) {
    return goods.reduce((sum, good) => sum + good[field], 0);
  }

  total(goods: any[]) {
    return goods.reduce((sum, good) => sum + good.quantity * good.unitPrice, 0);
  }

  removeRow(goods: any[], rowIndex: number) {
    goods.splice(rowIndex, 1);
  }

  onSubmit() {
    if (this.isUploaded) {
      this.confirmationService.confirm({
        message: 'Bạn chắc chắn đây là Giấy tờ giao hàng có chữ Ký Khách hàng. Nếu Update thì đơn hàng sẽ Thành công',
        accept: () => {
          this.submit();
        },
      });
    } else {
      this.submit();
    }
  }

  submit() {
    this.websiteOrdersService
      .updateProducePlanning({
        ...this.detail,
      })
      .subscribe((res) => {
        this.messageService.add({
          severity: 'success',
          detail: this.translationService.translate('success.update'),
        });
        this.onFormClosing.emit();
      });
  }

  onCarUpdateSuccess($event: boolean) {
    this.carInfoUpdated.emit();
  }

  onPrintGatePass() {
    this.websiteOrdersService
      .producePlanningExportGatePass(this.groupHandleItem.carId, this.groupHandleItem.carName, this.planningProduceProductId)
      .subscribe((res: any) => {
        this.openDownloadFile(res.data, 'pdf');
      });
  }

  onPrintPaymentProposal() {
    this.websiteOrdersService
      .producePlanningExportPaymentProposal(this.groupHandleItem.carId, this.groupHandleItem.carName, this.planningProduceProductId)
      .subscribe((res: any) => {
        this.openDownloadFile(res.data, 'pdf');
      });
  }

  onPrintPlanningExportForCar() {
    this.websiteOrdersService
      .producePlanningExportForCar(this.groupHandleItem.carId, this.groupHandleItem.carName, this.planningProduceProductId)
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

  onUpdateCarDelivery() {
    this.carDeliveryForm.edit(this.groupHandleItem.carId, this.groupHandleItem.carName, this.planningProduceProductId);
  }

  onEditRequestingPayment() {
    this.requestingPaymentFormComponent.onEdit(this.planningProduceProductId, this.groupHandleItem.carId, this.groupHandleItem.carName);
  }

  totalDiscount(goods: any) {
    let total = 0;
    goods.forEach((good) => {
      good.promotions?.forEach((item) => item.amount && (total += item.amount));
    });
    return total;
  }

  sumSubTotal(goods: any[]) {
    return goods.reduce((sum, good) => sum + good.unitPrice * good.quantity, 0);
  }

  onUploadFile(event: any, item: any) {
    const formData = new FormData();
    formData.append('file', event.currentFiles?.[0]);
    this.websiteOrdersService.uploadFile(formData).subscribe((res: any) => {
      this.isUploaded = true;
      item.fileDelivered = {
        ...res,
        fileUrl: `${environment.serverURL}/${res.fileUrl}`,
      };
      this.fileUploads.forEach((item: FileUpload) => {
        item.clear();
      });
    });
  }

  onShowImage(item) {
    this.selectedItem = item;
    this.showImageDetail = true;
  }

  onCancel() {
    this.onFormClosing.emit();
  }

  onShowPromotion(item: any) {
    this.showPromotion = true;
    this.promotionList = item[0].promotions;
  }

  onCancelDetail() {
    this.confirmationService.confirm({
      message: 'Bạn chắc chắn muốn hủy kế hoach sản xuất này?',
      accept: () => {
        this.cancelDetail();
      },
    });
  }

  private cancelDetail() {
    const checkedCustomer = [];
    this.detail?.items.forEach((item: any) =>
      item.goods.forEach((good: any) => {
        good.checked && checkedCustomer.push(good.customerId);
      }),
    );
    const ids: number[] = [];
    (this.detail?.items || []).forEach((item: any) => {
      (item?.goods || []).forEach((good: any) => {
        checkedCustomer.includes(good.customerId) && ids.push(good.id);
      });
    });
    this.websiteOrdersService.cancelDetail(this.detail.id, ids).subscribe((res) => {
      this.toastService.success('Hủy kế hoạch sản xuất thành công');
    });
  }

  private onSaveDept() {
    this.websiteOrdersService.saveDept(this.detail.id).subscribe((res) => {
      this.toastService.success('Lưu công nợ thành công');
    });
  }

  get orderStatus() {
    return OrderStatus;
  }
}
