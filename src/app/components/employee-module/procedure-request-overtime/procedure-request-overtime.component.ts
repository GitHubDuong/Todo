import { Component, OnInit, ViewChild } from '@angular/core';
import { TranslationService } from '@app/service/translation.service';
import { DateTimeHelper } from '@app/shared/helper/date-time.helper';
import { OrderStatus, RequestOvertimesStatus } from '@utilities/app-enum';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { map } from 'rxjs';
import { ProcedureRequestOvertimesService } from 'src/app/service/procedure-request-overtimes.service';
import { UserService } from 'src/app/service/user.service';
import AppConstant from 'src/app/utilities/app-constants';
import AppUtil from 'src/app/utilities/app-util';
import { ProcedureRequestOvertimeFormComponent } from './procedure-request-overtime-form/procedure-request-overtime-form.component';

@Component({
  selector: 'app-procedure-request-overtime',
  templateUrl: './procedure-request-overtime.component.html',
  styleUrls: ['./procedure-request-overtime.component.scss'],
})
export class ProcedureRequestOvertimeComponent implements OnInit {
  @ViewChild('procedureRequestOvertimeForm') ProcedureRequestOvertimeForm: ProcedureRequestOvertimeFormComponent | undefined;
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
    statusTab: 0,
    fromAt: DateTimeHelper.firstDayOfCurrentMonth(),
    toAt: new Date(),
    userId: null,
  };
  public totalRecords = 0;
  public totalPages = 0;

  public isLoading: boolean = false;

  public listRequest: any[] = [];

  display: boolean = false;

  isMobile = screen.width <= 1199;

  formData: any = {};
  isEdit: boolean = false;
  isReset: boolean = false;

  pendingRequest: any;
  roles: any[] = [];
  procedureNumber: any;
  employees: any[] = [];
  status: any[] = [
    {
      value: 0,
      label: 'Tất cả',
    },
    {
      value: 1,
      label: 'Chờ duyệt',
    },
    {
      value: 2,
      label: 'Đã duyệt',
    },
  ];

  items: MenuItem[];
  activeItem: MenuItem;
  currentStatus: number = 1;

  protected readonly RequestOvertimesStatus = RequestOvertimesStatus;

  constructor(
    private readonly requestOvertimeService: ProcedureRequestOvertimesService,
    private readonly translationService: TranslationService,
    private readonly confirmationService: ConfirmationService,
    private readonly messageService: MessageService,
    private readonly userService: UserService,
  ) {
    this.items = [
      {
        label: this.translationService.translate('label.pending_approval'),
        icon: 'pi pi-clock',
        command: (event) => this.onStatusChange(RequestOvertimesStatus.Pending),
      },
      {
        label: this.translationService.translate('label.approved'),
        icon: 'pi pi-check-circle',
        command: (event) => this.onStatusChange(RequestOvertimesStatus.Approved),
      },
      {
        label: this.translationService.translate('label.done'),
        icon: 'pi pi-check-circle',
        command: (event) => this.onStatusChange(OrderStatus.Done),
      },
      {
        label: this.translationService.translate('label.all'),
        icon: 'pi pi-th-large',
        command: (event) => this.onStatusChange(),
      },
    ];
    this.activeItem = this.items[0];
  }

  ngOnInit() {
    this.requestOvertimeService
      .getProcedureNumber()
      .pipe(map((res) => res.toString()))
      .subscribe((res) => {
        this.procedureNumber = res;
      });
    this.userService.getAllUserActive().subscribe((res: any) => {
      this.employees = res.data;
    });
  }

  onStatusChange(status: number = 0) {
    this.currentStatus = status;
    this.getRequests(null);
  }

  getRequests(event?: any, isExport: boolean = false): void {
    this.getParams.statusTab = this.currentStatus;
    if (this.pendingRequest) {
      this.pendingRequest.unsubscribe();
    }
    this.loading = true;
    if (event) {
      this.getParams.page = event.first / event.rows;
      this.getParams.pageSize = event.rows;
    }
    const params = {
      Page: this.getParams.page,
      PageSize: this.getParams.pageSize,
      StatusTab: this.currentStatus,
      FromAt: this.getParams.fromAt ? new Date(this.getParams.fromAt).toISOString() : null,
      ToAt: this.getParams.toAt ? new Date(this.getParams.toAt).toISOString() : null,
      SearchText: this.getParams.searchText,
      UserId: this.getParams.userId,
    };
    // remove undefined value
    Object.keys(params).forEach((k) => params[k] == null && delete params[k]);
    this.pendingRequest = this.requestOvertimeService.getProcedureRequestOvertimes(params).subscribe((response: any) => {
      AppUtil.scrollToTop();
      this.listRequest = response.data;
      this.totalRecords = response.totalItems || 0;
      this.totalPages = response.totalItems / response.pageSize + 1;
      this.loading = false;
    });
  }

  onSearch(event) {
    if (event.key === 'Enter') {
      this.getRequests();
    }
  }

  showDialog() {
    this.ProcedureRequestOvertimeForm.onReset();
    this.display = true;
  }

  onAdd() {
    this.isEdit = false;
    this.showDialog();
  }

  onDelete(id) {
    let message = this.translationService.translate('question.delete_content');
    let header = this.translationService.translate('question.delete_header');
    this.confirmationService.confirm({
      message: message,
      header: header,
      accept: () => {
        this.requestOvertimeService.deleteProcedureRequestOvertimes(id).subscribe(
          (res) => {
            AppUtil.scrollToTop();
            this.messageService.add({
              severity: 'success',
              detail: 'Xóa thành công',
            });
            this.getRequests();
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
    this.ProcedureRequestOvertimeForm.getDetail(id);
    this.display = true;
  }

  approveRequest(requestId: number): void {
    this.requestOvertimeService.approveProcedureRequestOvertimes(requestId).subscribe((res: any) => {
      AppUtil.scrollToTop();
      this.messageService.add({
        severity: 'success',
        detail: this.translationService.translate('success.approved_request'),
      });
      this.getRequests();
    });
  }

  onNotAccept(requestId: number): void {
    this.requestOvertimeService.notAccept(requestId).subscribe((res: any) => {
      AppUtil.scrollToTop();
      this.messageService.add({
        severity: 'success',
        detail: this.translationService.translate('success.not_approved_request'),
      });
      this.getRequests();
    });
  }

  onFilterChange(event: any) {
    this.getParams = event;
    this.getRequests();
  }
}
