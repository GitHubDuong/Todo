import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { NewsEditComponent } from '@components/website-module/news-web/news-edit/news-edit.component';
import { environment } from '../../../../environments/environment';
import { Page, TypeData } from '../../../models/common.model';
import { NewsModel } from '../../../models/web-setting/news.model';
import { ConfirmationService, MessageService } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';
import { NewsService } from '../../../service/web-setting/news.service';
import AppUtil from '../../../utilities/app-util';
import { LanguageType, MenuType } from '../../../utilities/app-enum';
import AppConstant from '../../../utilities/app-constants';
import { CategoryService } from 'src/app/service/category.service';

@Component({
  selector: 'app-news-web',
  templateUrl: './news-web.component.html',
  styles: [`
    .image-col{
      &:before{
        content: none !important;
      }
    }
  `],
  providers: [ConfirmationService],
})
export class NewsWebComponent implements OnInit {
  appConstant = AppConstant;
  serverImage = `${environment.serverURLImage}/`;
  display: boolean = false;
  formData = {};
  loading: boolean = false;
  result: TypeData<NewsModel> = {
    data: [],
    currentPage: 0,
    nextStt: 0,
    pageSize: 20,
    totalItems: 0,
  };
  isMobile = screen.width <= 1199;
  param: Page = {
    page: 1,
    pageSize: 20,
  };
  @ViewChild(NewsEditComponent) newsEdit: NewsEditComponent;
  categories: any[] = [];
  constructor(
    private readonly messageService: MessageService,
    private readonly translateService: TranslateService,
    private readonly confirmationService: ConfirmationService,
    private readonly newsService: NewsService,
    private readonly categoryService: CategoryService,
  ) {}

  ngOnInit(): void {
    this.categoryService.getListWithType(MenuType.MenuWeb).subscribe((res) => {
      this.categories = res;
    });
    this.categoryService.getAll().subscribe((res) => {
      this.categories = res.data.filter(
        (x) =>
          x.type === this.appConstant.CATEGORY_TYPE.MENU_WEB ||
          x.type === 6 ||
          x.type === 7,
      );
    });
  }

  getNews(event?: any) {
    if (event) {
      this.param.page = event.first / event.rows + 1;
      this.param.pageSize = event.rows;
    }

    Object.keys(this.param).forEach(
      (k) => this.param[k] == null && delete this.param[k],
    );
    this.newsService.getPagingNews(this.param).subscribe(
      (res) => {
        AppUtil.scrollToTop();
        this.result = res;
        this.result?.data?.map((item: any) => {
          item.uploadedFiles = item.images;
          item.images = item.images?.map(
            (img: any) => `${environment.serverURLImage}/${img.fileUrl}`,
          );
        });
      },
      (error) => {
        this.messageService.add({
          severity: 'error',
          detail: 'Lỗi lấy dữ liệu',
        });
      },
    );
  }

  onAddNews() {
    this.display = true;
    this.formData = {};
  }

  getNewsDetail(id) {
    this.display = true;
    this.newsEdit.reset();
    this.newsService.getNewsDetail(id).subscribe(
      (res) => {
        res.uploadedFiles = res.file;
        this.formData = res;
      },
      (error) => {
        this.messageService.add({
          severity: 'error',
          detail: 'Lỗi lấy dữ liệu',
        });
      },
    );

  }

  onDeleteNews(item) {
    let message;
    this.translateService
      .get('question.delete_web_news_content')
      .subscribe((res) => {
        message = res;
      });
    this.confirmationService.confirm({
      message: message,
      accept: () => {
        this.newsService.deleteNews(item?.id).subscribe(
          (res) => {
            AppUtil.scrollToTop();
            this.messageService.add({
              severity: 'success',
              detail: AppUtil.translate(
                this.translateService,
                'success.delete',
              ),
            });
            this.getNews();
          },
          (error) => {
            this.messageService.add({
              severity: 'error',
              detail: AppUtil.translate(this.translateService, 'error.0'),
            });
          },
        );
      },
    });
  }

  onCancelForm(event) {
    this.display = false;
    this.formData = {};
    // this.getNews();
  }
  @HostListener('document:keydown', ['$event'])
  async handleKeyboardEvent(event: KeyboardEvent) {
    switch (event.key) {
      case 'F7':
        event.preventDefault();
        await this.onAddNews();
        break;
    }
  }
}
