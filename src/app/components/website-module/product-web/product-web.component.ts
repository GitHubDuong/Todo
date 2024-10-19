import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { TypeData } from '../../../models/common.model';
import { ConfirmationService, MessageService } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';
import { GoodsService } from '../../../service/goods.service';
import AppUtil from '../../../utilities/app-util';
import { Goods } from '../../../models/goods.model';
import AppConstant from '../../../utilities/app-constants';
import { ChartOfAccountService } from '../../../service/chart-of-account.service';
import { WarehouseService } from '../../../service/warehouse.service';
import { CategoryService } from '../../../service/category.service';
import { TaxRates } from 'src/app/models/tax_rates.model';
import { TaxRatesService } from 'src/app/service/tax-rates.service';
import { catchError } from 'rxjs/operators';
import { BehaviorSubject, debounceTime, EMPTY, forkJoin, of, Subject, takeUntil, tap } from 'rxjs';
import { GoodFormComponent } from '../../sell-module/goods/good-form/good-form.component';

@Component({
  selector: 'app-product-web',
  templateUrl: './product-web.component.html',
  styles: [``],
  providers: [ConfirmationService],
})
export class ProductWebComponent implements OnInit, OnDestroy {
  @ViewChild('goodsForm') goodForm: GoodFormComponent;

  serverImage = `${ environment.serverURLImage }/`;
  formData = {};
  result: TypeData<Goods> = {
    data: [],
    currentPage: 0,
    nextStt: 0,
    pageSize: 20,
    totalItems: 0,
  };
  display = false;
  loading = false;

  getParams = {
    page: 1,
    pageSize: 20,
    priceCode: 'BGC',
    searchText: ''
  };
  appConstant = AppConstant;
  types: any = {};
  sortFields: any = {};
  sortTypes: any = {};
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
  isMobile = screen.width <= 1199;
  goodSelected: any;
  listGoodAll: any[] = [];
  displayMenuWeb = false;

  goodModel: any = {};
  taxRates: TaxRates[] = [];
  listGoodSelected: any[] = [];
  isDisplayAdd = false;

  searchTextSubject = new Subject<string>();

  private readonly _unsubscribe = new Subject<void>();

  constructor(
    private readonly goodsService: GoodsService,
    private readonly messageService: MessageService,
    private readonly categoryService: CategoryService,
    private readonly taxRatesService: TaxRatesService,
    private readonly translateService: TranslateService,
    private readonly warehouseService: WarehouseService,
    private readonly confirmationService: ConfirmationService,
    private readonly chartOfAccountService: ChartOfAccountService,
  ) {}

  get goods() {
    return this.goodsService.getList(this.getParams)
    .pipe(
      catchError(error => {
        this.messageService.add({
          severity: 'error',
          detail: 'Lỗi lấy dữ liệu',
        });

        return EMPTY;
      }),
      tap(res => this.setData(res))
    );
  }

  get chartOfAccounts() {
    return this.chartOfAccountService
    .getAllClassification({ classification: [2, 3] })
    .pipe(
      catchError(error => {
        this.messageService.add({
          severity: 'error',
          detail: 'Lỗi lấy dữ liệu',
        });

        return of(0);
      }),
      tap((res) => {
        this.types.chartOfAccount = res;
        this.goodForm.types.chartOfAccounts = res;
        this.goodForm.types.chartOfAccounts.forEach(item => item.displaySelected = item.code + ' - ' + item.name);
        this.goodForm.types.defaultChartOfAccount = this.goodForm.types.chartOfAccounts.find((x) => x.code == '1561');
        this.goodForm.types.form.patchValue({ debitCode: this.goodForm.types.defaultChartOfAccount });
      })
    );
  }

  get warehouses() {
    return this.warehouseService
    .getAll()
    .pipe(
      catchError(error => {
        this.messageService.add({
          severity: 'error',
          detail: 'Lỗi lấy dữ liệu',
        });

        return of({
          data: [],
          currentPage: 0,
          pageSize: 0,
          nextStt: 0,
          totalItems: 0,
        });
      }),
      tap((res) => this.types.warehouse = res.data)
    );
  }

  // Filter categories
  get categories() {
    return this.categoryService.getAll()
    .pipe(
      catchError(error => {
        this.messageService.add({
          severity: 'error',
          detail: 'Lỗi lấy dữ liệu',
        });

        return of({
          data: [],
          currentPage: 0,
          pageSize: 0,
          nextStt: 0,
          totalItems: 0,
        });
      }),
      tap((res) => {
        this.types.menuType = res.data.filter((x) => x.type === this.appConstant.CATEGORY_TYPE.GOODS_GROUP);
        this.types.goodsType = res.data.filter((x) => x.type === this.appConstant.CATEGORY_TYPE.GOODS_TYPE);
        this.types.position = res.data.filter((x) => x.type === this.appConstant.CATEGORY_TYPE.POSITION);
        this.types.priceList = res.data.filter(
          (x) => x.type === this.appConstant.CATEGORY_TYPE.PRICE_LIST && x.code == 'BGC'
        );
        this.types.menuWeb = res.data.filter(
          (x) => x.type === this.appConstant.CATEGORY_TYPE.MENU_WEB || x.type === 6 || x.type === 7
        );
        this.types.status = this.statuses;
      }),
    );
  }

  get goodsSync() {
    return this.goodsService.syncAccountGood()
    .pipe(
      catchError(error => {
        this.messageService.add({
          severity: 'error',
          detail: 'Lỗi lấy dữ liệu',
        });

        return EMPTY;
      }),
    );
  }

  ngOnInit(): void {
    this.loadData();

    this.searchTextSubject
    .pipe(
      debounceTime(300),
      takeUntil(this._unsubscribe)
    )
    .subscribe(_ => this.loadGoods());
  }

  loadData() {
    const source$ = [
      this.categories,
      this.chartOfAccounts,
      this.warehouses,
      this.goodsSync,
      AppUtil.getRoomTableSortTypes(this.translateService).pipe(tap(fields => this.sortFields = fields)),
      AppUtil.getSortTypes(this.translateService).pipe(tap(types => this.sortTypes = types)),
    ];

    forkJoin(source$).subscribe();
  }

  loadGoods(event?: any) {
    if (event) {
      this.getParams.page = event.first / event.rows + 1;
      this.getParams.pageSize = event.rows;
    }

    this.goods.subscribe();
  }

  setData(res: any) {
    AppUtil.scrollToTop();

    this.result = res;
    this.result.data.map((x) => {
      const words = x.contentVietNam?.split(/\s+/);
      x.contentVietNam = words?.slice(0, 10).join(' ').concat('...');
    });
  }

  onSearchTextChange(searchText: string) {
    this.getParams.searchText = searchText;
    this.searchTextSubject.next('');
  }

  onAddGood() {
    this.isDisplayAdd = true;
    this.goodForm.onReset();
    this.formData = {};
  }

  getGoodDetail(item) {
    this.goodsService.getDetail(item.id).subscribe((res) => {
      this.display = true;
      this.formData = res || {};
    });
  }

  onDeleteGood(item) {
    let message;

    this.translateService
    .get('question.delete_web_slider_content')
    .subscribe((res) => message = res);

    this.confirmationService.confirm({
      message,
      accept: () => {
        this.goodsService.deleteGoods(item?.id)
        .pipe(
          catchError(error => {
            this.messageService.add({
              severity: 'error',
              detail: AppUtil.translate(this.translateService, 'error.0'),
            });

            return EMPTY;
          })
        )
        .subscribe(_ => {
            AppUtil.scrollToTop();

            this.messageService.add({
              severity: 'success',
              detail: AppUtil.translate(this.translateService, 'success.delete',),
            });

            this.loadGoods();
          }
        );
      },
    });
  }

  onCancelForm(event) {
    this.display = false;
    this.formData = {};
    this.loadGoods();
  }

  baseUrlImage(image) {
    return image ? `${ this.serverImage }${ image }` : '';
  }

  getAccountCode(data: Goods) {
    if (data.detail2) {
      return data.detail2;
    }

    if (data.detail1) {
      return data.detail1.split('_')[0];
    }

    return data.account;
  }

  getAccountName(data: Goods) {
    if (data == null) return '';

    if (data.detail2) {
      return data.detailName2;
    }

    if (data.detail1) {
      return data.detailName1;
    }

    return data.accountName;
  }

  showMenuWebDialog() {
    this.displayMenuWeb = true;
    this.goodModel.goodIds = this.listGoodSelected.map(x => x.id);
  }

  getDetail1(accountCode) {
    this.chartOfAccountService.getDetail(accountCode).subscribe(res => this.types.detail1 = res.data);
  }

  onChangeAccount(event) {
    if (event && event.value) {
      this.getDetail1(event.value);
      this.loadGoods();
    } else {
      this.types.detail1 = [];
    }
  }

  onSaveChangeMenuWeb() {
    this.goodsService.updateMenuWebForGoods(this.goodModel)
    .subscribe(() => {
      this.messageService.add({
        severity: 'success',
        detail: 'Chuyển sản phẩm vào Menu Web thành công.',
      });
      this.displayMenuWeb = false;
    });
  }

  getTaxRate() {
    this.taxRatesService.getAllTaxRateForRs().subscribe((res) => this.taxRates = res.data);
  }

  ngOnDestroy(): void {
    this._unsubscribe.next();
    this._unsubscribe.complete();
  }
}
