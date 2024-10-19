import { Component, OnInit, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { GoodsQuotaRecipeService } from 'src/app/service/goods-quota-recipe.service';
import AppConstant from 'src/app/utilities/app-constants';
import AppUtil from 'src/app/utilities/app-util';
import { GoodsQuotaRecipeFormComponent } from './goods-quota-recipe-form/goods-quota-recipe-form.component';

@Component({
  selector: 'app-goods-quota-recipes',
  templateUrl: './goods-quota-recipes.component.html',
  styleUrls: ['./goods-quota-recipes.component.scss']
})
export class GoodsQuotaRecipesComponent implements OnInit {
  @ViewChild('goodsQuotaForm') goodsQuotaForm: GoodsQuotaRecipeFormComponent;

  public appConstant = AppConstant;

  public getParams = {
    Page: 1,
    PageSize: 10,
    SortField: 'id',
    isSort: true,
    SearchText: '',
  };
  public totalRecords = 0;
  public totalPages = 0;

  public isLoading: boolean = false;
  public listQuotaRecipe: any[] = [];

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
      header: 'label.id',
      value: 'id',
      width: 'width:10%;',
      display: true,
      classify: 'personal_info',
      optionHide: false,
    },
    {
      header: 'label.code',
      value: 'code',
      width: 'width:25%;',
      display: true,
      classify: 'personal_info',
      optionHide: false,
    },
    {
      header: 'label.name',
      value: 'name',
      width: 'width:55%;',
      display: true,
      classify: 'personal_info',
      optionHide: false,
    },
  ];

  constructor(
    private messageService: MessageService,
    private readonly translateService: TranslateService,
    private readonly confirmationService: ConfirmationService,
    private readonly goodsQuotaRecipeService: GoodsQuotaRecipeService,
  ) {}

  ngOnInit(): void {}

  onGetGoodsQuotaRecipe(event?: any, isExport: boolean = false): void {
    if (this.pendingRequest) {
      this.pendingRequest.unsubscribe();
    }
    this.loading = true;
    if (event) {
      this.getParams.Page = event.first / event.rows + 1;
      this.getParams.PageSize = event.rows;
    }
    // remove undefined value
    Object.keys(this.getParams).forEach(
      (k) => this.getParams[k] == null && delete this.getParams[k],
    );
    this.pendingRequest = this.goodsQuotaRecipeService
      .getGoodsQuotaRecipes(this.getParams)
      .subscribe((response: any) => {
        AppUtil.scrollToTop();
        this.listQuotaRecipe = response.data;
        this.totalRecords = response.totalItems || 0;
        this.totalPages = response.totalItems / response.pageSize + 1;
        this.loading = false;
      });
  }

  getDetail(good) {
    this.isEdit = true;
    this.goodsQuotaForm.getDetail(good);
    this.display = true;
  }

  onAdd() {
    this.isEdit = false;
    this.goodsQuotaForm.onReset();
    this.display = true;
  }

  onDelete(id) {
    let message;
    let header;
    this.translateService
      .get('question.delete_goods_quota_content')
      .subscribe((res) => {
        message = res;
      });
    this.translateService
      .get('question.delete_goods_quota')
      .subscribe((res) => {
        header = res;
      });
    this.confirmationService.confirm({
      message: message,
      header: header,
      accept: () => {
        this.goodsQuotaRecipeService.deleteGoodsQuotaRecipe(id).subscribe(
          (res) => {
            AppUtil.scrollToTop();
            this.messageService.add({
              severity: 'success',
              detail: 'Xóa thành công',
            });
            this.onGetGoodsQuotaRecipe();
          },
          (error) => {
            this.messageService.add({
              severity: 'error',
              detail: 'Lỗi lấy dữ liệu',
            });
          },
        );
      },
    });
  }
}
