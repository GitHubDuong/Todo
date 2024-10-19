import { Component, OnInit } from '@angular/core';
import { ColumnDataType } from '@app/core/enum';
import { TableColumModel } from '@app/models/common/table-colum.model';
import { ExpenditurePlanService } from '@app/service/expenditure-plan.service';
import { ReportDownloadService } from '@app/service/report-download';
import { ToastService } from '@app/service/toast.service';
import { TranslationService } from '@app/service/translation.service';
import { UserService } from '@app/service/user.service';
import { DateTimeHelper } from '@app/shared/helper/date-time.helper';
import { OrderStatus } from '@utilities/app-enum';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-expenditure-plan',
  templateUrl: './expenditure-plan.component.html',
  styleUrls: ['./expenditure-plan.component.scss'],
})
export class ExpenditurePlanComponent implements OnInit {
  selectedItem: any;
  loading = false;
  data: any[] = [];
  columns: TableColumModel[] = [];
  pageIndex = 0;
  pageSize = 10;
  totalItem = 0;
  tabMenuItems: MenuItem[] = [];
  activeItem: MenuItem;
  currentStatus: OrderStatus;
  showForm = false;
  userList: any[] = [];
  curr = new Date();
  filter = {
    fromAt: DateTimeHelper.firstDayOfCurrentMonth(),
    toAt: this.curr,
    searchText: '',
    userId: null,
  };

  constructor(
    private expenditurePlanService: ExpenditurePlanService,
    private userService: UserService,
    private translationService: TranslationService,
    private toastService: ToastService,
    private reportDownloadService: ReportDownloadService,
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
        label: this.translationService.translate('label.done'),
        icon: 'pi pi-check-circle',
        command: (event) => this.onStatusChange(OrderStatus.Done),
      },
      {
        label: 'Đang làm',
        icon: 'pi pi-clock',
        command: (event) => this.onStatusChange(OrderStatus.Part),
      },
      {
        label: 'Kết thúc',
        icon: 'pi pi-check-circle',
        command: (event) => this.onStatusChange(OrderStatus.Finish),
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
      { field: 'procedureNumber', label: 'Mã quy trình', type: ColumnDataType.text, class: 'w-2' },
      { field: 'procedureStatusName', label: 'Trạng thái', type: ColumnDataType.text, class: 'w-2' },
      { field: 'date', label: 'Ngày tháng', type: ColumnDataType.date, class: 'w-2' },
      { field: 'expenditurePlanAmount', label: 'Tổng tiền', type: ColumnDataType.number, class: 'w-2' },
      { field: 'note', label: 'Ghi chú', type: ColumnDataType.text, class: 'w-2' },
    ];
    this.userService.getAllUserActive().subscribe((res: any) => {
      this.userList = res.data;
    });
  }

  onLoad(event: any = undefined) {
    this.loading = true;
    if (event) {
      this.pageIndex = event.first / event.rows;
      this.pageSize = event.rows;
    }
    const params = {
      Page: this.pageIndex,
      PageSize: this.pageSize,
      StatusTab: this.currentStatus,
      FromAt: this.filter.fromAt ? new Date(this.filter.fromAt).toISOString() : null,
      ToAt: this.filter.toAt ? new Date(this.filter.toAt).toISOString() : null,
      SearchText: this.filter.searchText,
      UserId: this.filter.userId,
    };
    for (let key in params) {
      if (params[key] === null || params[key] === undefined) {
        delete params[key];
      }
    }
    this.expenditurePlanService.getByPage(params).subscribe(
      (res: any) => {
        this.loading = false;
        this.data = res.data;
        this.totalItem = res.totalItems;
      },
      (error) => {
        this.loading = false;
      },
    );
  }

  onDelete(id) {
    this.expenditurePlanService.delete(id).subscribe(
      (res: any) => {
        this.toastService.success('Xóa thành công');
        this.onLoad();
      },
      (error) => {
        console.log(error);
      },
    );
  }

  onStatusChange(status?: OrderStatus) {
    this.currentStatus = status;
    this.onLoad();
  }

  get orderStatus() {
    return OrderStatus;
  }

  onAccept(id) {
    this.expenditurePlanService.accept(id).subscribe((res: any) => {
      this.toastService.success('Chuyển tiếp yêu cầu thành công');
      this.onLoad();
    });
  }

  onNotAccept(id) {
    this.expenditurePlanService.notAccept(id).subscribe((res: any) => {
      this.toastService.success('Gửi thành công');
      this.onLoad();
    });
  }

  onDetail(item: any) {
    this.selectedItem = item;
    this.showForm = true;
  }

  onExport(id: number): void {
    this.expenditurePlanService.export(id).subscribe((res) => {
      this.openDownloadFile(res.data, 'pdf');
    });
  }

  openDownloadFile(fileName: string, filetype: string) {
    try {
      const filePath = this.reportDownloadService.getFolderPathDownload(fileName, filetype);

      if (filePath) window.open(filePath);
    } catch (ex) {}
  }

  onFilterChange(event: any) {
    this.filter = event;
    this.onLoad();
  }
}
