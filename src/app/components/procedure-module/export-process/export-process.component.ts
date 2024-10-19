import { AfterContentInit, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ColumnDataType } from '@app/core/enum';
import { TableColumModel } from '@app/models/common/table-colum.model';
import { ReportDownloadService } from '@app/service/report-download';
import { ToastService } from '@app/service/toast.service';
import { TranslationService } from '@app/service/translation.service';
import { DateTimeHelper } from '@app/shared/helper/date-time.helper';
import { ExportProcessService } from '@components/procedure-module/export-process/export-process.service';
import { OrderStatus } from '@utilities/app-enum';
import { ConfirmationService, MenuItem } from 'primeng/api';

@Component({
  selector: 'app-export-process',
  templateUrl: './export-process.component.html',
  styleUrls: ['./export-process.component.scss'],
})
export class ExportProcessComponent implements OnInit, AfterContentInit {
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
      label: this.translationService.translate('label.done'),
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

  get orderStatus() {
    return OrderStatus;
  }

  @ViewChild('quantity', { static: true }) quantity: TemplateRef<any>;
  @ViewChild('uploadImage', { static: true }) uploadImage: TemplateRef<any>;

  constructor(
    private exportProcessService: ExportProcessService,
    private translationService: TranslationService,
    private toastService: ToastService,
    private reportDownloadService: ReportDownloadService,
    private confirmService: ConfirmationService,
  ) {}

  ngOnInit(): void {
    this.columns = [
      { field: 'procedureNumber', label: 'Mã quy trình', type: ColumnDataType.text, class: 'w-2' },
      { field: 'procedureStatusName', label: 'Trạng thái', type: ColumnDataType.text, class: 'w-1' },
      { field: 'date', label: 'Thời gian', type: ColumnDataType.date, class: 'w-1' },
      { field: 'content', label: 'Ghi chú', type: ColumnDataType.text, class: 'w-2' },
      { field: 'quantity', label: 'SL-Thành tiền', type: ColumnDataType.template, class: 'w-2' },
      { field: 'uploadImage', label: 'Ảnh', type: ColumnDataType.template, class: 'w-2' },
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
    this.exportProcessService.getByPage(params).subscribe(
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
    this.exportProcessService.delete(id).subscribe(
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

  onAccept(item: any) {
    this.exportProcessService.accept(item.id).subscribe((item: any) => {
      this.toastService.success('Chuyển tiếp yêu cầu thành công');
      this.onLoad();
    });
  }

  onFilterChange(event: any) {
    this.filter = event;
    this.onLoad();
  }

  onPrint(item: any) {
    this.exportProcessService.export(item.id).subscribe((res: any) => {
      let filePath = this.reportDownloadService.getFolderPathDownload(res.data, 'pdf');
      if (filePath) window.open(filePath);
    });
  }

  onAttackFiles(row: any, event: any) {
    this.confirmService.confirm({
      message: 'Nếu Upload lên là Không xóa được. Bạn cần kiểm tra chứng từ kỹ trước khi Up nhé.',
      accept: () => {
        this.exportProcessService.uploadDocument(row.id, event.target?.files[0]).subscribe((res: any) => {
          this.toastService.success('Cập nhật ảnh thành công');
          this.onLoad();
        });
      },
    });
  }

  onNotAccept(id) {
    this.exportProcessService.notAccept(id).subscribe((res: any) => {
      this.toastService.success('Từ chối thành công');
      this.onLoad();
    });
  }

  ngAfterContentInit(): void {
    this.columns.forEach((col) => {
      if (col.field === 'quantity') {
        col.template = this.quantity;
      }
      if (col.field === 'uploadImage') {
        col.template = this.uploadImage;
      }
    });
  }
}
