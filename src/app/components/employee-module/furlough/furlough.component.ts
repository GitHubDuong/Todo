import { Component, HostListener, OnInit } from '@angular/core';
import { Page, TypeData } from '@app/models/common.model';
import { FurloughModel } from '@app/models/furlough.model';
import { FurloughService } from '@app/service/furlough.service';
import { ToastService } from '@app/service/toast.service';
import { TranslateService } from '@ngx-translate/core';
import { MessageService } from 'primeng/api';
import AppConstants from '../../../utilities/app-constants';
import AppUtil from '../../../utilities/app-util';

@Component({
  selector: 'app-furlough',
  templateUrl: './furlough.component.html',
  styleUrls: [],
})
export class FurloughComponent implements OnInit {
  appConstant = AppConstants;
  display: boolean = false;
  formData = {};
  loading: boolean = false;
  result: TypeData<FurloughModel> = {
    data: [],
    currentPage: 0,
    nextStt: 0,
    pageSize: 20,
    totalItems: 0,
  };
  param: Page = {
    page: 1,
    pageSize: 20,
  };
  isMobile = screen.width <= 1199;

  constructor(
    private readonly messageService: MessageService,
    private readonly translateService: TranslateService,
    private readonly furloughService: FurloughService,
    private toastService: ToastService,
  ) {}

  ngOnInit(): void {}

  getFurloughs(event?: any): void {
    this.param.page = Math.floor(Number(event?.first || 0) / Number(event?.rows || 1)) + 1;
    this.param.pageSize = Number(event?.rows || 20);
    this.furloughService.getPagingFurloughs(this.param).subscribe((res) => {
      AppUtil.scrollToTop();
      this.result = res;
    });
  }

  onApproveFurlough(item): void {
    this.furloughService.approveFurlough(item.id, item).subscribe((res) => {
      this.messageService.add({
        severity: 'success',
        detail: AppUtil.translate(this.translateService, 'success.update'),
      });
      this.getFurloughs();
    });
  }

  onAddFurlough(): void {
    this.display = true;
    this.formData = {};
  }

  onEditFurlough(item): void {
    this.furloughService.getFurloughDetail(item.id).subscribe({
      next: (res) => {
        this.display = true;
        this.formData = res;
      },
    });
  }

  onDeleteFurlough(item): void {
    this.furloughService.deleteFurlough(item.id).subscribe(() => {
      this.getFurloughs();
    });
  }

  onCancel(event): void {
    this.display = false;
    this.getFurloughs();
  }

  @HostListener('document:keydown', ['$event'])
  async handleKeyboardEvent(event: KeyboardEvent) {
    switch (event.key) {
      case 'F7':
        event.preventDefault();
        await this.onAddFurlough();
        break;
    }
  }

  onNotAcceptFurlough(item: any) {
    this.furloughService.notAcceptFurlough(item.id).subscribe((res) => {
      this.toastService.success('Đã từ chối đơn xin nghỉ phép');
      this.getFurloughs();
    });
  }
}
