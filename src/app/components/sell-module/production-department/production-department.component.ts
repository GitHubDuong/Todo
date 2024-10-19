import { Component, OnInit } from '@angular/core';
import { ColumnDataType } from '@app/core/enum';
import { Page } from '@app/models/common.model';
import { TableColumModel } from '@app/models/common/table-colum.model';
import { ProductionDepartmentService } from '@app/service/production-department.service';
import { ToastService } from '@app/service/toast.service';
import { TranslationService } from '@app/service/translation.service';
import { UserService } from '@app/service/user.service';
import { DateTimeHelper } from '@app/shared/helper/date-time.helper';
import { ProductionDepartmentModel } from '@components/sell-module/production-department/model/production-department.model';
import appConstant from '@utilities/app-constants';
import { OrderStatus } from '@utilities/app-enum';
import AppUtil from '@utilities/app-util';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-production-department',
  templateUrl: './production-department.component.html',
  styleUrls: ['./production-department.component.scss'],
})
export class ProductionDepartmentComponent implements OnInit {
  data: ProductionDepartmentModel[] = [];
  columns: TableColumModel[] = [];
  totalItems = 0;
  param: Page = {
    page: 0,
    pageSize: 10,
    searchText: '',
    userId: null,
  };
  showDetail = false;
  selectedData?: ProductionDepartmentModel;
  tabMenuItems: MenuItem[] = [];
  activeItem: MenuItem;
  currentStatus: OrderStatus;
  startDate = DateTimeHelper.firstDayOfCurrentMonth();
  endDate = new Date();
  userList: any[] = [];

  constructor(
    private translationService: TranslationService,
    private productionDepartmentService: ProductionDepartmentService,
    private toastService: ToastService,
    private userService: UserService,
  ) {}

  ngOnInit(): void {
    this.tabMenuItems = [
      {
        label: this.translationService.translate('label.pending_approval'),
        icon: 'pi pi-clock',
        command: (event) => this.onStatusChange(OrderStatus.Pending),
      },
      {
        label: this.translationService.translate('label.approved'),
        icon: 'pi pi-check-circle',
        command: (event) => this.onStatusChange(OrderStatus.Approved),
      },
      {
        label: 'Hoàn thành',
        icon: 'pi pi-check-circle',
        command: (event) => this.onStatusChange(OrderStatus.Done),
      },
      {
        label: this.translationService.translate('label.all'),
        icon: 'pi pi-th-large',
        command: (event) => this.onStatusChange(OrderStatus.All),
      },
    ];
    this.activeItem = this.tabMenuItems[0];
    this.currentStatus = OrderStatus.Pending;
    this.columns = [
      {
        field: 'procedureNumber',
        class: 'w-4',
        label: 'label.code_orders',
        type: ColumnDataType.text,
      },
      {
        field: 'procedureStatusName',
        class: 'w-3',
        label: 'label.status',
        type: ColumnDataType.text,
      },
      {
        field: 'note',
        class: 'w-3',
        label: 'label.user_role_note',
        type: ColumnDataType.text,
      },
    ];
    this.getByPage(null);
    this.userService.getAllUserActive().subscribe((res) => {
      this.userList = res.data;
    });
  }

  onStatusChange(status?: OrderStatus) {
    this.currentStatus = status;
    this.getByPage(null);
  }

  getByPage(event: any) {
    if (event) {
      this.param.page = event.first / event.rows;
      this.param.pageSize = event.rows;
    }
    const params = {
      Page: this.param.page,
      PageSize: this.param.pageSize,
      StatusTab: this.currentStatus,
      SearchText: this.param.searchText,
      FromAt: this.startDate ? this.startDate.toISOString() : null,
      ToAt: this.endDate ? this.endDate.toISOString() : null,
      UserId: this.param.userId,
    };
    for (let item in params) {
      if (params[item] === null || params[item] === undefined) {
        delete params[item];
      }
    }
    this.productionDepartmentService.getByPage(params).subscribe(
      (res) => {
        AppUtil.scrollToTop();
        this.data = res.data || [];
        this.totalItems = res.totalItems;
      },
      (error) => {
        this.toastService.error('Lỗi lấy dữ liệu');
      },
    );
  }

  protected readonly appConstant = appConstant;

  onEdit(item: any) {
    this.showDetail = true;
    this.selectedData = item;
  }

  onDelete(id) {
    this.productionDepartmentService.delete(id).subscribe(
      (res) => {
        this.toastService.success('Xóa thành công');
        this.getByPage(null);
      },
      (error) => {
        this.toastService.error('Xóa thất bại');
      },
    );
  }

  onCancelForm($event: any) {
    this.showDetail = false;
    this.selectedData = undefined;
  }

  protected readonly OrderStatus = OrderStatus;

  onAccept(id) {
    this.productionDepartmentService.accept(id).subscribe((res) => {
      this.toastService.success('Chuyển tiếp thành công');
      this.getByPage(null);
    });
  }

  onNotAccept(id) {
    this.productionDepartmentService.notAccept(id).subscribe((res) => {
      this.toastService.success('Chuyển lại thành công');
      this.getByPage(null);
    });
  }

  get orderStatus() {
    return OrderStatus;
  }
}
