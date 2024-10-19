import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { GoodsQuotaService } from 'src/app/service/goods-quota.service';
import AppConstant from 'src/app/utilities/app-constants';
import AppUtil from 'src/app/utilities/app-util';
import { GoodsQuotaFormComponent } from './goods-quota-form/goods-quota-form.component';
import { ChartOfAccountService } from 'src/app/service/chart-of-account.service';
import { GoodsQuotaRecipeService } from 'src/app/service/goods-quota-recipe.service';
import { QuotaService } from 'src/app/service/quota.service';

@Component({
  selector: 'app-goods-quota',
  templateUrl: './goods-quota.component.html',
  styleUrls: ['./goods-quota.component.scss'],
})
export class GoodsQuotaComponent implements OnInit {
  @ViewChild('goodQuotaFrom') goodQuotaFrom: GoodsQuotaFormComponent;

  public appConstant = AppConstant;

  public getParams = {
    Page: 0,
    PageSize: 25,
    SortField: 'id',
    isSort: true,
    SearchText: '',
    goodsQuotaRecipeId : null
  };

  public totalRecords = 0;
  public totalPages = 0;

  public isLoading: boolean = false;
  public listQuota: any[] = [];

  loading = true;
  first = 0;
  isMobile = screen.width <= 1199;
  display = false;

  formData: any = {};
  isEdit: boolean = false;
  isReset: boolean = false;

  pendingRequest: any;

  cols: any[] = [
    {
      header: 'STT',
      value: 'id',
      width: 'width:10%;',
      display: true,
      classify: 'personal_info',
      optionHide: false,
    },
    {
      header: 'label.formula_type',
      value: 'goodsQuotaRecipeId',
      width: 'width:15%;',
      display: true,
      classify: 'personal_info',
      optionHide: false,
    },
    {
      header: 'label.quota_history_code',
      value: 'code',
      width: 'width:10%;',
      display: true,
      classify: 'personal_info',
      optionHide: false,
    },
    {
      header: 'label.quota_history_name',
      value: 'name',
      width: 'width:15%;',
      display: true,
      classify: 'personal_info',
      optionHide: false,
    },
    {
      header: 'label.material_code',
      value: 'itemCodes',
      width: 'width:20%;',
      display: true,
      classify: 'personal_info',
      optionHide: false,
    },
    {
      header: 'label.formula_application',
      value: 'date',
      width: 'width:15%;',
      display: true,
      classify: 'personal_info',
      optionHide: false,
    },
  ];
  creditAccounts: any[] = [];
  listGoodsQuotaRecipe: any[] = [];
  listQuotaSelection: any[] = [];
  constructor(
    private messageService: MessageService,
    private readonly translateService: TranslateService,
    private readonly confirmationService: ConfirmationService,
    private readonly goodsQuotaService: GoodsQuotaService,
    private readonly goodsQuotaRecipeService: GoodsQuotaRecipeService,
    private chartOfAccountService: ChartOfAccountService,
    private readonly quotaService: QuotaService,
  ) {}

  ngOnInit(): void {
    this.chartOfAccountService
      .getAllClassification({ classification: [2, 3] })
      .subscribe((res: any) => {
        this.creditAccounts = res;
      });

    this.quotaService
      .getList({
        Page: 1,
        PageSize: 10000,
        SearchText: '',
        goodType: 'DM',
      })
      .subscribe((res: any) => {
        this.listQuotaSelection = res.data;
      });

    this.goodsQuotaRecipeService
      .getListGoodsQuotaRecipes()
      .subscribe((response: any) => {
        this.listGoodsQuotaRecipe = response;
      });
  }

  onAdd() {
    this.isEdit = false;
    this.goodQuotaFrom.onReset();
    this.display = true;
  }

  getDetail(data) {
    this.isEdit = true;
    this.goodQuotaFrom.getDetail(data);
    this.display = true;
  }

  onGetGoodsQuotaRecipe(event?: any, isExport: boolean = false): void {
    if (event) {
      this.getParams.Page = event ? event.first / event.rows : 0;
      this.getParams.PageSize = event ? event.rows : 25;
    }
    this.loading = true;

    // remove undefined value
    Object.keys(this.getParams).forEach(
      (k) => this.getParams[k] == null && delete this.getParams[k],
    );
    this.pendingRequest = this.goodsQuotaService
      .getGoodsQuota(this.getParams)
      .subscribe((response: any) => {
        AppUtil.scrollToTop();
       
        this.listQuota = response.data;
        this.totalRecords = response.totalItems;
        this.totalPages = response.currentPage;
        this.loading = false;
      });
  }

  onSearch(event) {
    if (event.key === 'Enter') {
      this.onGetGoodsQuotaRecipe();
    }
  }

  @HostListener('document:keydown', ['$event'])
  async handleKeyboardEvent(event: KeyboardEvent) {
    switch (event.key) {
      case 'F7':
        event.preventDefault();
        await this.onAdd();
        break;
    }
  }
}
