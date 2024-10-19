import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AppMainComponent } from '@app/layouts/app.main.component';
import { Goods } from '@app/models/goods.model';
import { PrintItemGoods } from '@app/models/print-item.goods.model';
import { CategoryService } from '@app/service/category.service';
import { ChartOfAccountService } from '@app/service/chart-of-account.service';
import { GoodsService } from '@app/service/goods.service';
import { StoreService } from '@app/service/store.service';
import { WarehouseService } from '@app/service/warehouse.service';
import { environment } from '@env/environment';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { BehaviorSubject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { TaxRates } from 'src/app/models/tax_rates.model';
import { GoodsQuotaService } from 'src/app/service/goods-quota.service';
import { TaxRatesService } from 'src/app/service/tax-rates.service';
import * as XLSX from 'xlsx';
import AppConstant from '../../../utilities/app-constants';
import AppUtil from '../../../utilities/app-util';
import { GoodsFormComponent } from '../list-of-goods/goods-form/goods-form.component';
import { AddPriceListComponent } from '../setup-module/menu-of-goods/component/add-price-list/add-price-list.component';
import { ComparePricesComponent } from '../setup-module/menu-of-goods/component/compare-prices/compare-prices.component';

@Component({
  selector: 'app-goods',
  templateUrl: './goods.component.html',
  styleUrls: ['./goods.component.scss'],
})
export class GoodsComponent implements OnInit {
  appConstant = AppConstant;
  @ViewChild('goodsForm') goodsForm: GoodsFormComponent;
  @ViewChild('addPriceListComponent', { static: false })
  addPriceListComponent: AddPriceListComponent;
  @ViewChild('addCompareComponent', { static: false })
  addCompareComponent: ComparePricesComponent;
  loading: boolean = true;

  sortFields: any[] = [];
  sortTypes: any[] = [];

  first = 0;

  printOptions: any = [
    { label: 'Mã vạch', value: 1 },
    { label: 'Mã QR', value: 2 },
  ];

  printDisplayOption: number;

  public getParams: any = {
    page: 1,
    pageSize: 5,
    sortField: 'id',
    isSort: true,
    account: 0,
    searchText: '',
    status: 1,
    priceCode: 'BGC',
    isManage: true,
    minStockType: 0,
  };
  public totalRecords = 0;
  public totalPages = 0;

  public isLoading: boolean = false;

  public goodsList: Goods[] = [];
  selectedGoods: Goods[] = [];

  public isVisiblePrintPopup: boolean = false;

  public listPrintItem: PrintItemGoods[] = [];

  chartOfAccounts: any[] = [];

  types: any = {};

  display: boolean = false;
  selectedGoodSalary: Goods;

  isMobile = screen.width <= 1199;

  formData: any = {};
  isEdit: boolean = false;
  isReset: boolean = false;
  pendingRequest: any;
  statuses = [
    {
      value: 1,
      label: 'Đang kinh doanh',
    },
    {
      value: 0,
      label: 'Ngừng kinh doanh',
    },
  ];
  minStockTypes = [
    {
      value: 0,
      label: 'Tất cả',
    },
    {
      value: 1,
      label: 'Tồn tối thiểu',
    },
  ];
  taxRates: TaxRates[] = [];
  displayDialog = false;
  listGoodQuota: any[] = [];
  goodQuotaId: any;
  listGoodSelected: any[] = [];
  $textSearch = new BehaviorSubject('');

  constructor(
    public appMain: AppMainComponent,
    private router: Router,
    private messageService: MessageService,
    private readonly storeService: StoreService,
    private readonly goodsServices: GoodsService,
    private readonly categoryService: CategoryService,
    private readonly taxRatesService: TaxRatesService,
    private readonly warehouseService: WarehouseService,
    private readonly translateService: TranslateService,
    private readonly goodQuotaService: GoodsQuotaService,
    private readonly confirmationService: ConfirmationService,
    private readonly chartOfAccountService: ChartOfAccountService,
  ) {}

  ngOnInit() {
    AppUtil.getRoomTableSortTypes(this.translateService).subscribe((res) => {
      this.sortFields = res;
    });
    AppUtil.getSortTypes(this.translateService).subscribe((res) => {
      this.sortTypes = res;
    });

    this.getCategories();
    this.goodsSync();
    this.getStore();
    this.getTaxRate();
    this.goodQuotaService
      .getGoodsQuota({
        Page: 0,
        PageSize: 100000,
        SortField: 'id',
        isSort: true,
        SearchText: '',
      })
      .subscribe((res) => {
        if (res.data) {
          res.data.forEach((x) => (x.name = x.goodsQuotaRecipeName + ' | ' + x.name));
          this.listGoodQuota = res.data;
        }
      });
    this.$textSearch.pipe(debounceTime(500)).subscribe(() => {
      this.getGoods();
    });
  }

  getChartOfAccounts() {
    this.chartOfAccountService.getAllClassification({ classification: [2, 3] }).subscribe((res: any) => (this.types.chartOfAccount = res));
  }

  getDetail1(accountCode: string): void {
    const params = this.getParams.warehouse != null ? { warehouseCode: this.getParams.warehouse } : {};

    this.chartOfAccountService.getDetailV2(accountCode, params).subscribe((res: any) => (this.types.detail1 = res.data));
  }

  getStore() {
    this.storeService.getAllStore().subscribe((res: any) => {
      this.types.lstStore = res.data;
    });
  }

  onChangeAccount(event) {
    if (event && event.value) {
      this.getDetail1(event.value.code);
      this.getGoods();
    } else {
      this.types.detail1 = [];
    }
  }

  onChangeWarehouse($event: any): void {
    this.getDetail1(this.getParams.account.code);
    this.getGoods();
  }

  getWarehouses() {
    this.warehouseService.getAll().subscribe((res) => {
      this.types.warehouse = res.data;
    });
  }

  getCategories() {
    this.categoryService.getAll().subscribe((res) => {
      this.getChartOfAccounts();
      this.types.menuType = res.data.filter((x) => x.type === this.appConstant.CATEGORY_TYPE.GOODS_GROUP);
      this.types.goodsType = res.data.filter((x) => x.type === this.appConstant.CATEGORY_TYPE.GOODS_TYPE);
      this.types.position = res.data.filter((x) => x.type === this.appConstant.CATEGORY_TYPE.POSITION);
      this.types.priceList = res.data.filter((x) => x.type === this.appConstant.CATEGORY_TYPE.PRICE_LIST);
      this.types.menuWeb = res.data.filter((x) => x.type === this.appConstant.CATEGORY_TYPE.MENU_WEB);
      this.types.status = this.statuses;
      this.getWarehouses();
    });
  }

  onSearch(event) {
    if (event.key === 'Enter') {
      this.getGoods();
    }
  }

  onChangeSort(event, type) {
    if (type === 'sortType') {
      this.getParams.isSort = event.value;
    }
    this.getGoods();
  }

  getGoods(event?: any, isExport: boolean = false): void {
    if (this.pendingRequest) {
      this.pendingRequest.unsubscribe();
    }
    this.loading = true;
    if (event) {
      this.getParams.page = event.first / event.rows + 1;
      this.getParams.pageSize = event.rows;
    }
    Object.keys(this.getParams).forEach((k) => this.getParams[k] == null && delete this.getParams[k]);
    let params = Object.assign({}, this.getParams);
    if (params.account === 0) {
      delete params.account;
    }
    if (this.getParams.account) {
      params.account = this.getParams.account.code;
    } else {
      delete params.account;
    }
    if (this.getParams.detail1) {
      params.detail1 = this.getParams.detail1.code;
    } else {
      delete params.detail1;
    }

    this.pendingRequest = this.goodsServices.getList(params).subscribe((response: any) => {
      AppUtil.scrollToTop();

      this.goodsList = response.data;
      this.totalRecords = response.totalItems || 0;
      this.totalPages = response.totalItems / response.pageSize + 1;
      this.loading = false;
    });
  }

  getDetail(id) {
    this.isEdit = true;
    this.goodsForm.getDetail(id);
    this.display = true;
  }

  onAddGoods() {
    this.isEdit = false;
    this.goodsForm.onReset();
    this.display = true;
  }

  onDelete(id) {
    let message;
    this.translateService.get('question.delete_goods_table').subscribe((res) => (message = res));
    this.confirmationService.confirm({
      message: message,
      key: 'removeGoodTmp',
      accept: () => {
        this.goodsServices.deleteGoods(id).subscribe((response: any) => {
          this.getGoods();
        });
      },
    });
  }

  onSaveChange() {
    var listGoods = this.listGoodSelected.map((x) => x.id);
    this.goodQuotaService.updateGoodsQuotaForGoodDetail(this.goodQuotaId, listGoods).subscribe((res) => {
      this.messageService.add({
        severity: 'success',
        detail: 'Gán công thức thành công.',
      });
      this.displayDialog = false;
      this.getGoods();
    });
  }

  showGoodQuotaDialog() {
    this.displayDialog = true;
  }

  baseUrlImage(image) {
    return `${environment.serverURL}/${image}`;
  }

  getAccountCode(data: Goods) {
    if (!data) {
      return '';
    }
    if (data.detail2) {
      return data.detail2;
    }
    if (data.detail1) {
      return data.detail1.split('_')[0];
    }
    return data.account;
  }

  getAccountName(data: Goods) {
    if (!data) {
      return '';
    }
    if (data.detail2) {
      return data.detailName2;
    }
    if (data.detail1) {
      return data.detailName1;
    }
    return data.accountName;
  }

  getGroupName(data: Goods) {
    if (!data) {
      return '';
    }
    if (data.detail2) {
      return `${data.account} - ${data.detail1.split('_')[0]} - ${data.detailName1}`;
    }
    if (data.detail1) {
      return `${data.account} - ${data.accountName}`;
    }
    return '';
  }

  getCategoryName(code: string, type: number) {
    let category: any = {};
    switch (type) {
      case this.appConstant.CATEGORY_TYPE.GOODS_GROUP:
        {
          category = this.types.menuType.find((x) => x.code === code);
        }
        break;
      case this.appConstant.CATEGORY_TYPE.PRICE_LIST:
        {
          category = this.types.priceList.find((x) => x.code === code);
        }
        break;
      case this.appConstant.CATEGORY_TYPE.GOODS_TYPE:
        {
          category = this.types.goodsType.find((x) => x.code === code);
        }
        break;
      case this.appConstant.CATEGORY_TYPE.POSITION:
        {
          category = this.types.position.find((x) => x.code === code);
        }
        break;
      case this.appConstant.CATEGORY_TYPE.MENU_WEB:
        {
          category = this.types.menuWeb.find((x) => x.code === code);
        }
        break;
    }
    return category ? category.name : '';
  }

  printBarCode() {
    this.isVisiblePrintPopup = true;
  }

  addPriceList() {
    this.addPriceListComponent.show();
  }

  addComparePrices() {
    this.addCompareComponent.show();
  }

  comparePriceList() {
    this.router.navigate(['/uikit/setup/compare-price-list']).then();
  }

  goodsSync() {
    this.goodsServices.syncAccountGood().subscribe((res) => {
      this.getGoods();
    });
  }

  exportExcel() {
    Object.keys(this.getParams).forEach((k) => this.getParams[k] == null && delete this.getParams[k]);
    let params = Object.assign({}, this.getParams);
    if (params.account === 0) {
      delete params.account;
    }
    this.goodsServices.exportExcelListOfGoods(params, true).subscribe((res) => {
      this.openDownloadFile(res.data, `excel`);
    });
  }

  onDisplayOptionClick() {
    this.printDisplayOption = null;
  }

  openDownloadFile(_fileName: string, _ft: string) {
    try {
      var _l = this.goodsServices.getFolderPathDownload(_fileName, _ft);
      if (_l) window.open(_l);
    } catch (ex) {}
  }

  import(evt) {
    const objProps = [
      'image1', // mã tài khoản 3
      'account', // mã tài khoản 3
      'accountName', // tên tài khoản 4
      'detail1', //mã ct1 5
      'detailName1', // tên ct1 6
      'detail2', // mã ct2
      'detailName2', // tên ct2
      'warehouse', // mã kho 7
      'warehouseName', //tên kho 8
      'goodsType', //giá vốn 9
      'minStockLevel', //giá bán 10
      'maxStockLevel', // thuế VAT 11
      'net',
      'taxRateName', // giảm giá 12
      'status', // nhóm sản phẩm 13
    ];
    const target: DataTransfer = <DataTransfer>evt.target;
    if (target.files.length !== 1) throw new Error('Cannot use multiple files');
    const reader: FileReader = new FileReader();
    reader.onload = (e: any) => {
      let dataImport = [];
      /* read workbook */
      const bstr: string = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });

      /* grab first sheet */
      const wsname: string = wb.SheetNames[0];
      const ws: XLSX.WorkSheet = wb.Sheets[wsname];

      /* save data */
      const datas = XLSX.utils.sheet_to_json(ws, {
        header: 1,
        blankrows: false,
        range: 6,
      }) as any;

      if (datas && datas?.length > 0) {
        datas.forEach((element) => {
          const objItem = {};
          objProps.forEach((item, index) => {
            if (item == 'status') {
              objItem[item] = element[index] == 'Đang kinh doanh' ? 1 : 0;
            } else {
              objItem[item] = element[index];
            }
          });
          dataImport.push(objItem);
        });
      }
      this.goodsServices.importExcelListOfGoods(dataImport, true).subscribe(
        (res) => {
          this.messageService.add({
            severity: 'success',
            detail: AppUtil.translate(this.translateService, 'success.create'),
          });
        },
        (err) => {
          this.messageService.add({
            severity: 'error',
            detail: AppUtil.translate(this.translateService, 'error.0'),
          });
        },
      );
    };
    reader.readAsBinaryString(target.files[0]);
    (document.getElementById('fileInput') as HTMLInputElement).value = null;
  }

  @HostListener('document:keydown', ['$event'])
  async handleKeyboardEvent(event: KeyboardEvent) {
    switch (event.key) {
      case 'F7':
        event.preventDefault();
        await this.onAddGoods();
        break;
    }
  }

  getTaxRate() {
    this.taxRatesService.getAllTaxRateForRs().subscribe((res) => {
      this.taxRates = res.data;
    });
  }

  discontinueProductSales(goodIds: any = []): void {
    if (goodIds.length == 0) {
      goodIds = this.selectedGoods.map((item) => item.id);
    }
    let stopBusinessStatus: number = 0;
    this.goodsServices.changeGoodStatus(goodIds, stopBusinessStatus).subscribe((res: any) => {
      this.messageService.add({
        severity: 'success',
        detail: AppUtil.translate(this.translateService, 'success.update'),
      });
      this.getGoods(null, false);
    });
  }

  isGoodService(goodIds: any = []): void {
    if (goodIds.length == 0) {
      goodIds = this.selectedGoods.map((item) => item.id);
    }
    this.goodsServices.changeGoodService(goodIds).subscribe((res: any) => {
      this.messageService.add({
        severity: 'success',
        detail: AppUtil.translate(this.translateService, 'success.update'),
      });
      this.getGoods(null, false);
    });
  }

  onTextSearch() {
    this.$textSearch.next(this.getParams.searchText);
  }
}
