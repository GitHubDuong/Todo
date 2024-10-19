import { AfterContentInit, Component, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { ColumnDataType } from '@app/core/enum';
import { TableColumModel } from '@app/models/common/table-colum.model';
import { ChartOfAccountService } from '@app/service/chart-of-account.service';
import { GoodsService } from '@app/service/goods.service';
import { ManufactureOrderService } from '@app/service/manufacture-order.service';
import { StoreService } from '@app/service/store.service';
import { ToastService } from '@app/service/toast.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-new-product-form',
  templateUrl: './new-product-form.component.html',
  styleUrls: ['./new-product-form.component.scss'],
})
export class NewProductFormComponent implements OnInit, AfterContentInit {
  @Input() visible: boolean = false;
  @Input() item: any;
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() saveChange = new EventEmitter<any>();
  keyword = '';
  accountList: any = [];
  selectedAccount: any;
  storeList: any = [];
  selectedStore: any;
  detailIList: any = [];
  selectedDetail: any;
  data: any[] = [];
  columns: TableColumModel[] = [];
  loading = false;
  pageIndex = 0;
  pageSize = 10;
  totalItem = 0;

  @ViewChild('quantity', { static: true }) quantityTpl: TemplateRef<any>;

  constructor(
    private chartOfAccountService: ChartOfAccountService,
    private storeService: StoreService,
    private goodsService: GoodsService,
    private manufactureOrderService: ManufactureOrderService,
    private toastService: ToastService,
  ) {}

  ngOnInit(): void {
    this.getData();
    this.columns = [
      { field: 'checked', label: '', type: ColumnDataType.checkbox, class: 'w-1' },
      { field: 'code', label: 'Mã hàng ', type: ColumnDataType.text, class: 'w-2' },
      { field: 'name', label: 'Tên hàng', type: ColumnDataType.text, class: 'w-3' },
      { field: 'salePrice', label: 'Giá bán', type: ColumnDataType.number, class: 'w-2' },
      { field: 'group', label: 'Nhóm sản phẩm', type: ColumnDataType.text, class: 'w-2' },
      { field: 'quantity', label: 'SL Cần làm', type: ColumnDataType.template, class: 'w-2' },
    ];
  }

  private getData() {
    forkJoin([this.chartOfAccountService.getAllClassification({ classification: [2, 3] }), this.storeService.getAllStore()]).subscribe(
      ([accountList, storeList]) => {
        this.accountList = accountList;
        this.accountList = (this.accountList || []).map((item: any) => {
          return {
            ...item,
            label: `${item.code} - ${item.name}`,
          };
        });
        this.storeList = storeList.data;
      },
    );
  }

  ngAfterContentInit(): void {
    this.columns.forEach((item: TableColumModel) => {
      if (item.type === ColumnDataType.template) {
        item.template = this.quantityTpl;
      }
    });
  }

  onLoad(event: any = undefined) {
    this.loading = true;
    if (event) {
      this.pageIndex = event.first / event.rows;
      this.pageSize = event.rows;
    } else {
      this.pageIndex = 0;
    }
    let opts: any = {};
    opts.searchText = this.keyword;
    this.selectedAccount && (opts.account = this.selectedAccount);
    this.selectedStore && (opts.warehouse = this.selectedStore);
    this.selectedDetail && (opts.detail1 = this.selectedDetail);
    const params = {
      ...opts,
      page: this.pageIndex,
      pageSize: this.pageSize,
    };
    this.goodsService.getList(params).subscribe(
      (res: any) => {
        this.data = res.data.map((item: any) => {
          return {
            ...item,
            code: item.detail2 || item.detail1,
            name: item.detailName2 || item.detailName1,
            group: `${item.account} - ${item.detail1} - ${item.detailName1}`,
          };
        });
        this.totalItem = res.totalItems || 0;
        this.loading = false;
      },
      (error) => {
        this.loading = false;
      },
    );
  }

  onSelectAccount() {
    this.chartOfAccountService.getDetail(this.selectedAccount).subscribe((res) => {
      this.detailIList = (res.data || []).map((item: any) => {
        return {
          ...item,
          label: `${item.code} - ${item.name}`,
        };
      });
    });
    this.selectedDetail = undefined;
    this.onLoad();
  }

  onCancel() {
    this.visibleChange.emit(false);
  }

  onAddContinue() {
    const checkedItems = this.data.filter((item) => item.checked);

    if (!checkedItems.length) {
      this.toastService.error('Chưa chọn sản phẩm nào');
      return;
    }

    const params = {
      ...this.item,
      items: [
        ...this.item.items.map((item: any) => {
          if (!item.customerId) {
            delete item.customerId;
            delete item.customerName;
          }

          return item;
        }),
        ...checkedItems.map((prod: any) => {
          return {
            goodsId: prod.id,
            goodsName: prod.detail1,
            goodsCode: prod.detailName1,
            quantityRequired: prod.quantity,
            quantityReal: 0,
          };
        }),
      ],
    };

    this.manufactureOrderService.updateProduceOrder(params).subscribe((res) => {
      this.toastService.success('Tạo lệnh sản xuất thành công');
      this.saveChange.emit();
      this.onLoad();
    });
  }

  onAdd() {
    const checkedItems = this.data.filter((item) => item.checked);
    if (!checkedItems.length) {
      this.toastService.error('Chưa chọn sản phẩm nào');
      return;
    }
    const params = {
      ...this.item,
      items: [
        ...this.item.items.map((item: any) => {
          if (!item.customerId) {
            delete item.customerId;
            delete item.customerName;
          }

          return item;
        }),
        ...checkedItems.map((prod: any) => {
          return {
            goodsId: prod.id,
            goodsName: prod.detail1,
            goodsCode: prod.detailName1,
            quantityRequired: prod.quantity,
            quantityReal: 0,
          };
        }),
      ],
    };
    this.manufactureOrderService.updateProduceOrder(params).subscribe((res) => {
      this.toastService.success('Tạo lệnh sản xuất thành công');
      this.visible = false;
      this.visibleChange.emit(false);
      this.saveChange.emit();
    });
  }
}
