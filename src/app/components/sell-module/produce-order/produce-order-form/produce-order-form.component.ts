import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CustomerService } from '@app/service/customer.service';
import { ManufactureOrderService } from '@app/service/manufacture-order.service';
import { TranslationService } from '@app/service/translation.service';
import { WebsiteOrdersService } from '@app/service/website-orders.service';
import { OrderStatus } from '@utilities/app-enum';
import { MessageService } from 'primeng/api';
import { debounceTime } from 'rxjs';

@Component({
  selector: 'app-produce-order-form',
  templateUrl: './produce-order-form.component.html',
  styleUrls: ['./produce-order-form.component.scss'],
})
export class ProduceOrderFormComponent implements OnInit {
  @Input() display: boolean = false;
  @Input() detail: any = {};
  @Input() currentTab: any;
  @Output() onFormClosing = new EventEmitter();
  goodDetailDisplay: boolean = false;
  goodDetails: any[];
  manufactureOrders: any[] = [];
  isMobile = screen.width < 1200;
  selectAll = false;
  showNewProductForm = false;

  customers: any[] = [];

  get detailItems() {
    return this.detail?.items || [];
  }

  constructor(
    private readonly messageService: MessageService,
    private readonly translationService: TranslationService,
    private readonly websiteOrdersService: WebsiteOrdersService,
    private readonly manufactureOrderService: ManufactureOrderService,
    private readonly customerService: CustomerService,
  ) {}

  ngOnInit(): void {
    this.getData();
    this.getListCustomer();
  }

  sumGroup(goods: any[], field: string) {
    return goods.reduce((sum, good) => sum + good[field], 0);
  }

  onSubmit() {
    this.websiteOrdersService.updateProducePlanning(this.detail).subscribe((res) => {
      this.messageService.add({
        severity: 'success',
        detail: this.translationService.translate('success.update'),
      });
      this.onFormClosing.emit();
    });
  }

  onShowDetail(goodDetails: any[]) {
    this.goodDetails = goodDetails;
    this.goodDetailDisplay = true;
  }

  onUpdateOrderProduceProduct() {
    const params = {
      ...this.detail,
      items: [
        ...this.detail.items.map((item: any) => {
          if (!item.customerId) {
            delete item.customerId;
            delete item.customerName;
          }

          return item;
        }),
      ],
    };

    this.manufactureOrderService.updateProduceOrder(params).subscribe((res) => {
      this.onFormClosing.emit();
      this.messageService.add({
        severity: 'success',
        detail: this.translationService.translate('success.update'),
      });
    });
  }

  onRemoveOrderProduceProduct() {
    let itemList = this.detail.items.filter((item) => !item.checked);

    if (itemList && itemList.length === this.detail.items.length) {
      this.messageService.add({
        severity: 'warn',
        detail: 'Không có phần tử nào được chọn.',
      });
      return;
    }

    this.detail.items = itemList;

    const params = {
      ...this.detail,
      items: [
        ...this.detail.items.map((item: any) => {
          if (!item.customerId) {
            delete item.customerId;
            delete item.customerName;
          }

          return item;
        }),
      ],
    };

    this.manufactureOrderService.updateProduceOrder(params).subscribe((res) => {
      this.messageService.add({
        severity: 'success',
        detail: this.translationService.translate('success.delete'),
      });
    });
  }

  onToggleSelectAll() {
    (this.detail?.items || []).forEach((item: any) => {
      item.checked = this.selectAll;
    });
  }

  onAddProduct() {
    this.showNewProductForm = true;
  }

  get orderStatus() {
    return OrderStatus;
  }

  getData() {
    this.manufactureOrderService.getAll().subscribe((response) => {
      this.manufactureOrders = response;
    });
  }

  getListCustomer() {
    this.customerService
      .getListCustomerWithCodeName()
      .pipe(debounceTime(500))
      .subscribe((res: any) => {
        this.customers = (res.data as any[]) ?? [];
      });
  }

  onSaveNewProduct() {
    this.manufactureOrderService.getDetail(this.detail.id).subscribe((res) => {
      this.detail = res;
    });
  }

  totalRealQuantity() {
    return (this.detail?.items || []).reduce((sum, item) => sum + (+item.quantityReal), 0) || 0;
  }
}
