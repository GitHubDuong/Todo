import { AfterContentChecked, ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CustomerService } from '@app/service/customer.service';
import { CashierMediatorService } from '@app/service/mediators/cashier-mediator.service';
import { StoreService } from '@app/service/store.service';
import { TranslateService } from '@ngx-translate/core';
import { MessageService } from 'primeng/api';
import { BehaviorSubject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { Goods } from 'src/app/models/goods.model';
import { Product } from 'src/app/models/product';
import { AuthService } from 'src/app/service/auth.service';
import { CategoryService } from 'src/app/service/category.service';
import { ChartOfAccountService } from 'src/app/service/chart-of-account.service';
import { GoodsService } from 'src/app/service/goods.service';
import { WarehouseService } from 'src/app/service/warehouse.service';
import AppConstant from 'src/app/utilities/app-constants';
import AppUtil from 'src/app/utilities/app-util';
import { environment } from 'src/environments/environment';
import AppConstants from '../../../../utilities/app-constants';

@Component({
  selector: 'app-goods-table',
  templateUrl: './goods-table.component.html',
  styleUrls: ['./goods-table.component.scss'],
})
export class GoodsTableComponent implements OnInit, AfterContentChecked {
  appConstant = AppConstant;
  selectedProduct: any = null;
  @Input('users') users: any[] = [];
  @Input('customers') customers: any[] = [];
  @Input('isSeller') isSeller: boolean = false;
  @Input() ableChooseStaff: boolean = true;
  @Output() onProductSelected = new EventEmitter();
  @Output() onChangeFilterCustomer = new EventEmitter();
  @Output() onFilterCustomerBySearchText = new EventEmitter();
  @Output() customersChange = new EventEmitter();
  @Input() selectedUser: any;
  products: Product[];
  sortOrder: number;
  sortField: string;

  public getParams: any;
  searchTypes: any[] = [
    { key: 'Mã CT1 - Mã CT2', value: 0 },
    { key: 'Mã CT1 - Tên CT2', value: 1 },
    { key: 'Tên CT1 - Tên CT2', value: 2 },
    { key: 'Mã HH', value: 3 },
    { key: 'Tên HH', value: 4 },
  ];
  public totalRecords = 0;
  public totalPages = 0;

  public isLoading: boolean = false;

  public goodsList: Goods[] = [];

  pendingRequest: any;

  loading: boolean = true;
  isSearchAdvanced: boolean = false;
  passWifi: string = '';
  layout: string = '';
  isPassWifi: boolean = false;
  first = 0;

  isQRScannerVisible: boolean = false;
  isMobile = screen.width <= 1199;

  types: any = {};
  sortFields: any[] = [];
  sortTypes: any[] = [];
  private allGoodList: any;
  warehouses = [];
  $textSearch = new BehaviorSubject('');

  constructor(
    private goodsService: GoodsService,
    private cdref: ChangeDetectorRef,
    public messageService: MessageService,
    private chartOfAccountService: ChartOfAccountService,
    private warehouseService: WarehouseService,
    private categoryService: CategoryService,
    private translateService: TranslateService,
    private customerService: CustomerService,
    private cashierMediator: CashierMediatorService,
    private readonly authService: AuthService,
    private readonly storeService: StoreService,
  ) {}

  ngAfterContentChecked(): void {
    this.cdref.detectChanges();
  }

  ngOnInit(): void {
    AppUtil.getRoomTableSortTypes(this.translateService).subscribe((res) => {
      this.sortFields = res;
    });
    AppUtil.getSortTypes(this.translateService).subscribe((res) => {
      this.sortTypes = res;
    });
    this.onResetParams();
    this.getCategories();
    this.passWifi = AppUtil.getStorage(AppConstant.WIFI);
    this.getAllGoods(null);
    this.layout = this.authService.getConfigurationViewLayout || 'list';
    this.getStore();
    this.$textSearch.pipe(debounceTime(500)).subscribe(() => {
      this.getGoods();
    });
  }

  getStore() {
    this.storeService.getAllStore().subscribe((res: any) => {
      this.warehouses = res.data;
    });
  }

  onChangeLayout(event?: any) {
    AppUtil.setStorage(AppConstant.LAYOUT_DATAVIEW, event.layout);
    this.layout = event.layout;
  }

  getGoods(event?: any, isRefresh: boolean = false): void {
    if (isRefresh) {
      this.onResetParams();
      this.getGoods();
      return;
    }
    if (this.pendingRequest) {
      this.pendingRequest.unsubscribe();
    }
    this.loading = true;

    if (event) {
      this.getParams.page = event.first / event.rows + 1;
      this.getParams.pageSize = event.rows;
    } else {
      this.getParams.page = 1;
    }

    let params = Object.assign({}, this.getParams);
    if (params.account === null || params.account === 0) {
      delete params.account;
    }
    if (isRefresh) {
      params = {};
    }
    this.cashierMediator.changePriceCode(this.getParams.priceCode);
    this.pendingRequest = this.goodsService.getList(AppUtil.cleanObject(params)).subscribe((response: any) => {
      AppUtil.scrollToTop();
      this.goodsList = response.data;
      this.totalRecords = response.totalItems || 0;
      this.totalPages = response.totalItems / response.pageSize + 1;
      this.loading = false;
    });
  }

  getAllGoods(event) {
    let payload = {
      priceCode: 'BGC',
      isCashier: true,
      isSort: true,
      page: 1,
      pageSize: 30,
      searchText: event?.filter ?? '',
    };
    this.goodsService.getList(payload).subscribe((response: any) => {
      if (response.data != null && response.data.length > 0) {
        this.allGoodList = response.data.map((good) => {
          return {
            ...good,
            displayName: `${this.getAccountCode(good)} - ${this.getAccountName(good)}`,
          };
        });
      }
    });
  }

  onSearch(event) {
    if (event.key === 'Enter') {
      this.getGoods();
    }
  }

  onResetParams() {
    this.getParams = {
      page: 1,
      pageSize: 8,
      sortField: 'id',
      isSort: true,
      account: 0,
      searchText: '',
      isCashier: true,
      priceCode: 'BGC',
    };
  }

  getChartOfAccounts() {
    this.chartOfAccountService.getAllClassification({ classification: [2, 3] }).subscribe((res: any) => {
      this.types.chartOfAccount = (res || []).map((item: any) => ({
        ...item,
        label: `${item.code} - ${item.name}`,
      }));
    });
  }

  getDetail1(accountCode) {
    this.chartOfAccountService.getDetail(accountCode).subscribe((res: any) => {
      this.types.detail1 = (res.data || []).map((item: any) => ({
        ...item,
        label: `${item.code} - ${item.name}`,
      }));
    });
  }

  onChangeSort(event, type) {
    if (type === 'sortType') {
      this.getParams.isSort = event.value;
    }
    this.getGoods();
  }

  onChangeAccount(event) {
    if (event && event.value) {
      this.getDetail1(event.value);
      this.getGoods();
    } else {
      this.types.detail1 = [];
    }
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
      this.types.status = [
        { value: 1, label: 'Đang kinh doanh' },
        { value: 0, label: 'Ngừng kinh doanh' },
      ];
      this.getWarehouses();
    });
  }

  getAccount(data: Goods) {
    const arr = [];
    data.account && arr.push(data.account);
    data.warehouse && arr.push(data.warehouse);
    return arr.join(' - ');
  }

  getAccountCode(data: Goods) {
    const codes = [];
    data.detail1 && codes.push(data.detail1);
    data.detail2 && codes.push(data.detail2);
    return codes.join(' - ');
    // var str = '';
    // var war = '';
    //
    // if (data.warehouse) {
    //   war = war.concat(data.warehouse).concat(' - ');
    // }
    // if (data.detail2) {
    //   str = str.concat(' - ').concat(data.detail2);
    // }
    // return (war = war.concat(data.detail1 ?? '').concat(str));
    // if (data.detail2) {
    //     return data.detail2 + ' - ' + data.detail1;
    // }
    // if (data.detail1) {
    //     return data.detail1.split('_')[0];
    // }
    // return `${data.warehouse ?? ""}${data.detail1 ? "-" + data.detail1 : ""}${data.detail2 ? "-" + data.detail2 : ""}`
  }

  getAccountName(data: Goods) {
    if (data.detail2) {
      return data.detailName2;
    }
    if (data.detail1) {
      return data.detailName1;
    }
    return data.accountName;
  }

  filteredCustomers: any[] = [];

  // event filter customer
  onCustomerNameSelect(event) {
    if (event) {
      let customer = this.customers.find((x) => x.code.trim() === event.split('|')[0].trim());
      if (customer) {
        this.getParams.customerId = customer.id;
        this.getParams.customerName = `${customer.code} | ${customer.name}`;
        this.getParams.priceCode = customer.priceList || 'BGC';

        this.getGoods();

        this.customerService.getCustomerDetail(customer?.id).subscribe((res) => {
          customer = res.data;
          this.onChangeFilterCustomer.emit(customer);
        });

        return;
      }
    }
    this.onChangeFilterCustomer.emit({});
  }

  onSelectProduct(good) {
    good['customerId'] = this.getParams.customerId;
    this.onProductSelected.emit(good);
  }

  onQRScanSuccess(goodCode: string) {
    let good = this.goodsList.find((item) => item.qrCodes.find((qr) => qr == goodCode));

    if (good == null) {
      this.messageService.add({
        severity: 'error',
        detail: `Không tìm thấy sản phẩm với mã ${goodCode}`,
      });
      return;
    }

    this.messageService.add({
      severity: 'success',
      detail: AppUtil.translate(this.translateService, `Đã tìm thấy sản phẩm ${good.detailName1 || good.detailName2}`),
    });
    this.onSelectProduct(good);
  }

  onChangeCustomer(customer) {
    if (customer && !AppUtil.isEmpty(customer)) {
      this.getParams.customerId = customer.id;
      this.getParams.customerName = `${customer.code} | ${customer.name}`;
      this.getParams.priceCode = customer.priceList;
    } else {
      delete this.getParams.customerId;
      delete this.getParams.customerName;
      this.getParams.priceCode = 'BGC';
    }
  }

  onClearCustomer(event) {
    this.getParams.priceCode = 'BGC';
    this.getGoods();
  }

  // event filter customer
  @Input() selectedBillTab: any = { data: { customerName: '' } };
  showCustomerFormDialog: boolean = false;

  filterCustomerName(event) {
    let keyword = event.query.toLowerCase();
    this.getListCustomer(keyword);
  }

  getListCustomer(searchText: string = '') {
    this.customerService.getAllCustomer(searchText).subscribe((res: any) => {
      const filteredCustomers = res.data;
      this.customers = filteredCustomers;
      this.customersChange.emit(filteredCustomers);
      this.filteredCustomers = filteredCustomers.map((item) => `${item.code} | ${item.name}`);
      this.cashierMediator.notifyOnCustomerFiltered(filteredCustomers);
    });
  }

  baseUrlImage(image) {
    return `${environment.serverURL}/${image}`;
  }

  onSavePassWifi() {
    AppUtil.setStorage(AppConstant.WIFI, this.passWifi);
    this.isPassWifi = false;
  }

  showAddCustomerDialog() {
    this.showCustomerFormDialog = true;
  }

  onAddCustomerSuccess($event) {
    this.selectedBillTab.data.customerName = $event.name;
  }

  protected readonly AppConstant = AppConstant;
  protected readonly AppConstants = AppConstants;

  onTextSearch() {
    this.$textSearch.next(this.getParams.searchText);
  }
}
