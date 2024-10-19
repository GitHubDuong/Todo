import { Component, OnInit } from '@angular/core';
import { ColumnDataType } from '@app/core/enum';
import { TableColumModel } from '@app/models/common/table-colum.model';
import { ToastService } from '@app/service/toast.service';
import AppUtil from '@app/utilities/app-util';
import { OrderQuoteService } from '@components/sell-module/order-quote/order-quote.service';

@Component({
  selector: 'app-order-quote',
  templateUrl: './order-quote.component.html',
  styleUrls: ['./order-quote.component.scss'],
})
export class OrderQuoteComponent implements OnInit {
  fromDate: Date = new Date();
  toDate: Date = new Date();
  showForm = false;
  selectedItem: any;
  loading = false;
  data: any[] = [];
  columns: TableColumModel[] = [];
  subColumns: TableColumModel[] = [];
  isMobile = screen.width <= 1199;

  options: any[] = [
    { key: 'Hàng hóa', value: 0 },
    { key: 'Khách hàng', value: 1 },
  ];

  optionSelected: number = 0;

  constructor(
    private orderQuoteService: OrderQuoteService,
    private toastService: ToastService,
  ) { }

  ngOnInit(): void {
    this.initTableColumn();
  }

  initTableColumn() {
    this.columns = [
      { field: 'expand', label: '', type: ColumnDataType.text, class: 'w-1 justify-content-center' },
      {
        field: this.optionSelected === 0 ? 'goodName' : 'customerName',
        label: this.optionSelected === 0 ? 'Tên sản phẩm' : 'Tên khách hàng',
        type: ColumnDataType.text,
        class: 'w-5 font-bold h-50'
      },
      { field: 'quantity', label: 'Số lượng', type: ColumnDataType.number, class: 'w-2 font-bold justify-content-end' },
      { field: 'quantityInProgress', label: 'Đang làm', type: ColumnDataType.number, class: 'w-2 font-bold justify-content-end' },
      { field: 'quantityDelivered', label: 'Đã bàn giao', type: ColumnDataType.number, class: 'w-2 font-bold justify-content-end' },
    ];

    this.subColumns = [
      { field: 'index', label: 'STT', type: ColumnDataType.number, class: 'w-1' },
      {
        field: this.optionSelected === 1 ? 'goodName' : 'customerName',
        label: this.optionSelected === 1 ? 'Tên sản phẩm' : 'Tên khách hàng',
        type: ColumnDataType.text,
        class: 'w-5'
      },
      { field: 'quantity', label: 'Số lượng', type: ColumnDataType.number, class: 'w-2 justify-content-end' },
      { field: 'quantityInProgress', label: 'Đang làm', type: ColumnDataType.number, class: 'w-2 justify-content-end' },
      { field: 'quantityDelivered', label: 'Đã bàn giao', type: ColumnDataType.number, class: 'w-2 justify-content-end' },
    ];

    this.onLoad();
  }

  onShowForm(item: any = undefined) {
    this.showForm = true;
    this.selectedItem = item;
  }

  onLoad(event: any = undefined) {
    this.loading = true;
    this.orderQuoteService
      .report({
        Type: this.optionSelected,
        FromAt: this.fromDate.toISOString(),
        ToAt: this.toDate.toISOString(),
      })
      .subscribe(
        (res: any) => {
          this.loading = false;
          this.data = res.data;
        },
        (error) => {
          this.loading = false;
        },
      );
  }

  onChangePrintReport(): void {
    this.orderQuoteService
      .reportExport({
        Type: this.optionSelected,
        FromAt: this.fromDate.toISOString(),
        ToAt: this.toDate.toISOString(),
      })
      .subscribe(
        (res: any) => {
          AppUtil.openDownloadFile(res.data, 'pdf');
        }
      );
  }
}
