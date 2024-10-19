import { Component, OnInit } from '@angular/core';
import { ColumnDataType } from '@app/core/enum';
import { TableColumModel } from '@app/models/common/table-colum.model';
import { ReportDownloadService } from '@app/service/report-download';
import { ToastService } from '@app/service/toast.service';
import { TranslationService } from '@app/service/translation.service';
import { DateTimeHelper } from '@app/shared/helper/date-time.helper';
import { CarLocationService } from '@components/procedure-module/car-location/car-location.service';
import { TabStatus } from '@utilities/app-enum';

@Component({
  selector: 'app-car-location',
  templateUrl: './car-location.component.html',
  styleUrls: ['./car-location.component.scss'],
})
export class CarLocationComponent implements OnInit {
  showForm = false;
  tabMenuList = [
    {
      label: this.translationService.translate('label.pending_approval'),
      icon: 'pi pi-clock',
      value: TabStatus.Pending,
    },
    {
      label: this.translationService.translate('label.approved'),
      icon: 'pi pi-check-circle',
      value: TabStatus.Approved,
    },
    {
      label: this.translationService.translate('label.done'),
      icon: 'pi pi-check-circle',
      value: TabStatus.Done,
    },
    {
      label: this.translationService.translate('label.all'),
      icon: 'pi pi-th-large',
      value: TabStatus.All,
    },
  ];
  selectedTab: any = TabStatus.Pending;
  selectedItem: any;
  loading = false;
  data: any[] = [];
  columns: TableColumModel[] = [];
  pageIndex = 0;
  pageSize = 10;
  totalItem = 0;
  filter = {
    fromAt: DateTimeHelper.firstDayOfCurrentMonth(),
    toAt: new Date(),
    searchText: '',
    userId: null,
  };

  constructor(
    private translationService: TranslationService,
    private carLocationService: CarLocationService,
    private reportDownloadService: ReportDownloadService,
    private toastService: ToastService,
  ) {}

  ngOnInit(): void {
    this.columns = [
      { field: 'procedureNumber', label: 'Mã ', type: ColumnDataType.text, class: 'w-2' },
      { field: 'procedureStatusName', label: 'Trạng thái', type: ColumnDataType.text, class: 'w-2' },
      { field: 'date', label: 'Thời gian', type: ColumnDataType.date, class: 'w-3' },
      { field: 'note', label: 'Ghi chú', type: ColumnDataType.text, class: 'w-3' },
    ];
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
      StatusTab: this.selectedTab,
      FromAt: this.filter?.fromAt ? this.filter.fromAt.toISOString() : null,
      ToAt: this.filter?.toAt ? this.filter.toAt.toISOString() : null,
      SearchText: this.filter.searchText,
      UserId: this.filter.userId,
    };
    for (let key in params) {
      if (params[key] === null || params[key] === '') {
        delete params[key];
      }
    }
    this.carLocationService.getByPage(params).subscribe(
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
    this.carLocationService.delete(id).subscribe(
      (res: any) => {
        this.toastService.success('Xóa thành công');
        this.onLoad();
      },
      (error) => {
        console.log(error);
      },
    );
  }

  onAccept(id) {
    this.carLocationService.accept(id).subscribe((res: any) => {
      this.toastService.success('Duyệt thành công');
      this.onLoad();
    });
  }

  onNotAccept(id) {
    this.carLocationService.notAccept(id).subscribe((res: any) => {
      this.toastService.success('Từ chối thành công');
      this.onLoad();
    });
  }

  onExport(id: number): void {
    this.carLocationService.export(id).subscribe((res) => {
      this.openDownloadFile(res.data, 'pdf');
    });
  }

  openDownloadFile(fileName: string, filetype: string) {
    try {
      const filePath = this.reportDownloadService.getFolderPathDownload(fileName, filetype);

      if (filePath) window.open(filePath);
    } catch (ex) {}
  }
}
