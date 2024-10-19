import { AfterContentInit, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ColumnDataType } from '@app/core/enum';
import { TableColumModel } from '@app/models/common/table-colum.model';
import { ReportDownloadService } from '@app/service/report-download';
import { ToastService } from '@app/service/toast.service';
import { TranslationService } from '@app/service/translation.service';
import { DateTimeHelper } from '@app/shared/helper/date-time.helper';
import { RequestEquipmentOrderService } from '@components/procedure-module/request-equipment-order/request-equipment-order.service';
import { OrderStatus } from '@utilities/app-enum';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-request-equipment-order',
  templateUrl: './request-equipment-order.component.html',
  styleUrls: ['./request-equipment-order.component.scss'],
})
export class RequestEquipmentOrderComponent implements OnInit, AfterContentInit {
  showForm = false;
  selectedItem: any;
  loading = false;
  data: any[] = [];
  columns: TableColumModel[] = [];
  pageIndex = 0;
  pageSize = 10;
  totalItem = 0;
  activeItem: MenuItem;
  tabMenuList: MenuItem[] = [
    {
      id: OrderStatus.Pending.toString(),
      label: this.translationService.translate('label.pending_approval'),
      icon: 'pi pi-clock',
      command: (event) => this.onStatusChange(OrderStatus.Pending),
    },
    {
      id: OrderStatus.Approved.toString(),
      label: this.translationService.translate('label.approved'),
      icon: 'pi pi-check-circle',
      command: (event) => this.onStatusChange(OrderStatus.Approved),
    },
    {
      id: OrderStatus.Done.toString(),
      label: 'Hoàn thành',
      icon: 'pi pi-check-circle',
      command: (event) => this.onStatusChange(OrderStatus.Done),
    },
    {
      id: OrderStatus.All.toString(),
      label: this.translationService.translate('label.all'),
      icon: 'pi pi-th-large',
      command: (event) => this.onStatusChange(OrderStatus.All),
    },
  ];
  currentStatus: OrderStatus = OrderStatus.Pending;
  filter = {
    fromAt: DateTimeHelper.firstDayOfCurrentMonth(),
    toAt: new Date(),
    searchText: '',
    userId: null,
  };
  @ViewChild('userCol', { static: true }) userCol: TemplateRef<any>;

  constructor(
    private requestEquipmentOrderService: RequestEquipmentOrderService,
    private translationService: TranslationService,
    private toastService: ToastService,
    private reportDownloadService: ReportDownloadService,
  ) {}

  ngOnInit(): void {
    this.columns = [
      { field: 'procedureNumber', label: 'Mã quy trình', type: ColumnDataType.text, class: 'w-3' },
      { field: 'procedureStatusName', label: 'Trạng thái', type: ColumnDataType.text, class: 'w-1' },
      { field: 'date', label: 'Thời gian', type: ColumnDataType.date, class: 'w-2' },
      { field: 'user', label: 'Người tạo', type: ColumnDataType.template, class: 'w-2' },
      { field: 'note', label: 'Ghi chú', type: ColumnDataType.number, class: 'w-2' },
    ];
    this.activeItem = this.tabMenuList[0];
  }

  onShowForm(item: any = undefined) {
    this.showForm = true;
    this.selectedItem = item;
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
    this.requestEquipmentOrderService.getByPage(params).subscribe(
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
    this.requestEquipmentOrderService.delete(id).subscribe(
      (res: any) => {
        this.toastService.success('Xóa thành công');
        this.onLoad();
      },
      (error) => {
        console.log(error);
      },
    );
  }

  private onStatusChange(status: OrderStatus) {
    this.currentStatus = status;
    this.pageIndex = 0;
    this.onLoad();
  }

  get orderStatus() {
    return OrderStatus;
  }

  onAccept(item: any) {
    this.requestEquipmentOrderService.accept(item.id).subscribe((item: any) => {
      this.toastService.success('Chuyển tiếp yêu cầu thành công');
      this.onLoad();
    });
  }

  onNotAccept(item: any) {}

  ngAfterContentInit(): void {
    this.columns.forEach((col) => {
      if (col.field === 'user') {
        col.template = this.userCol;
      }
    });
  }

  onExport(id: number): void {
    this.requestEquipmentOrderService.export(id).subscribe((res) => {
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
