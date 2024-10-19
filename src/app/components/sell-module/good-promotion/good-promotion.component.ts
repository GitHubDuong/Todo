import { Component, OnInit } from '@angular/core';
import { BaseDataTableComponent } from "@app/shared/components/base-data-table.component";
import { Column, IAction } from "@app/models/table/column";
import { NotificationService } from "@app/service/notification.service";
import { ColumnDataType } from "@app/core/enum";
import { PromotionService } from "@app/service/promotion.service";
import { ReportDownloadService } from '@app/service/report-download';

@Component({
  selector: 'app-good-promotion',
  templateUrl: './good-promotion.component.html',
  styleUrls: ['./good-promotion.component.scss']
})

export class GoodPromotionComponent extends BaseDataTableComponent {
  isLoading: boolean = false;
  columns: Column[];
  headerActions: IAction[];
  data: any[];
  constructor(
    protected readonly promotionService: PromotionService,
    protected readonly notificationService: NotificationService,
    protected reportDownloadService: ReportDownloadService

  ) {
    super(promotionService, notificationService, reportDownloadService);
    this.columns = [
      { field: 'code', header: 'Mã KM', width: '10%'},
      { field: 'name', header: 'Tên Chương trình KM', width: '20%' },
      {
        field: 'value',
        header: 'Trị giá tặng thành tiền (dạng chữ)',
        width: '10%',
        columnType: ColumnDataType.number
      },
      { field: 'fromAt', header: 'Từ ngày', width: '15%', columnType: ColumnDataType.date },
      { field: 'toAt', header: 'Đến ngày',  width: '15%', columnType: ColumnDataType.date },
      { field: 'fileLink', header: 'TỆP TIN', width: '10%', columnType: ColumnDataType.file },
      { field: 'customerNote', header: 'Đối tượng KH', width: '15%'},
      { field: 'address', header: 'Tỉnh', width: '20%' },
      { field: 'note', header: 'Ghi chú', width: '20%' },
      this._defaultActionCol,
    ];
  }
}