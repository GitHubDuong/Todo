import { Component, OnInit, ViewChild } from '@angular/core';
import AppConstant from 'src/app/utilities/app-constants';
import { WorkingDaysFormComponent } from './working-days-form/working-days-form.component';
import AppUtil from 'src/app/utilities/app-util';
import { ConfirmationService, MessageService } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';
import { WorkingDaysService } from 'src/app/service/working-days.service';

@Component({
  selector: 'app-working-days',
  templateUrl: './working-days.component.html',
  styleUrls: ['./working-days.component.scss']
})
export class WorkingDaysComponent implements OnInit {
  @ViewChild('dayForm') WorkingDaysFormComponent:
    | WorkingDaysFormComponent
    | undefined;
  public appConstant = AppConstant;

  loading: boolean = true;

  sortFields: any[] = [];
  sortTypes: any[] = [];

  first = 0;

  public getParams = {
    page: 1,
    pageSize: 5,
    sortField: 'id',
    isSort: true,
    searchText: '',
  };
  public totalRecords = 0;
  public totalPages = 0;

  public isLoading: boolean = false;

  public lstDays: any[] = [];

  display: boolean = false;

  isMobile = screen.width <= 1199;

  formData: any = {};
  isEdit: boolean = false;
  isReset: boolean = false;

  pendingRequest: any;
  roles: any[] = [];
  listSymbol: any[] = [];
  years: any[] = [];
  constructor(
    private readonly translateService: TranslateService,
    private readonly confirmationService: ConfirmationService,
    private readonly workingDayService: WorkingDaysService,
    private readonly messageService: MessageService,
  ) {}

  ngOnInit() {
    for (var i = 1945; i <= 3000; i++) {
      this.years.push(i);
    }
  }

  getDays(event?: any, isExport: boolean = false): void {
    if (this.pendingRequest) {
      this.pendingRequest.unsubscribe();
    }
    this.loading = true;
    if (event) {
      this.getParams.page = event.first / event.rows;
      this.getParams.pageSize = event.rows;
    }
    // remove undefined value
    Object.keys(this.getParams).forEach(
      (k) => this.getParams[k] == null && delete this.getParams[k],
    );
    this.pendingRequest = this.workingDayService
      .getWorkingDays(this.getParams)
      .subscribe((response: any) => {
        AppUtil.scrollToTop();
        this.lstDays = response.data;
        this.totalRecords = response.totalItems || 0;
        this.totalPages = response.totalItems / response.pageSize + 1;
        this.loading = false;
      });
  }

  onSearch(event) {
    if (event.key === 'Enter') {
      this.getDays();
    }
  }

  showDialog() {
    this.WorkingDaysFormComponent.onReset();
    this.display = true;
  }

  onAdd() {
    this.isEdit = false;
    this.showDialog();
  }

  onDelete(id) {
    let message;
    let header;
    this.translateService.get('question.delete_content').subscribe((res) => {
      message = res;
    });
    this.translateService.get('question.delete_header').subscribe((res) => {
      header = res;
    });
    this.confirmationService.confirm({
      message: message,
      header: header,
      accept: () => {
        this.workingDayService.deleteWorkingDay(id).subscribe(
          (res) => {
            AppUtil.scrollToTop();
            this.messageService.add({
              severity: 'success',
              detail: 'Xóa thành công',
            });
            this.getDays();
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

  getDetail(id) {
    this.isEdit = true;
    this.WorkingDaysFormComponent.getDetail(id);
    this.display = true;
  }
}
