import { Directive, OnInit, ViewChild } from '@angular/core';
import { ColumnDataType } from '@app/core/enum';
import { ICrudMethod } from '@app/models/crud-method.model';
import { Column, ControlType, IAction, IFilter } from '@app/models/table/column';
import { NotificationService } from '@app/service/notification.service';
import { ReportDownloadService } from '@app/service/report-download';
import { BaseDetailComponent } from '@app/shared/components/base-detail.component';
import { DateTimeHelper } from '@app/shared/helper/date-time.helper';
import { TabStatus } from '@utilities/app-enum';

@Directive()
export abstract class BaseDataTableComponent implements OnInit {
  @ViewChild('detailFormComponent') detailFormComponent: BaseDetailComponent | undefined;
  protected dataSource: any[] = [];
  abstract columns: Column[];
  protected headerActions: IAction[];
  protected isDetailVisible: boolean = false;
  protected isLoading: boolean = true;
  protected readonly _defaultActionCol: Column = {
    field: 'action',
    header: '',
    width: '10%',
    columnType: ColumnDataType.action,
    actions: [
      {
        label: 'button.edit',
        icon: 'pi pi-pencil',
        actionType: ControlType.Button,
        styleClass: 'p-button-success',
        command: (_: any, rowData: any) => this.onEdit(rowData.id),
      },
      {
        label: 'button.delete',
        icon: 'pi pi-trash',
        actionType: ControlType.Button,
        styleClass: 'p-button-danger',
        command: (_: any, rowData: any) => this.onDelete(rowData.id),
      },
      {
        label: 'button.export',
        icon: 'pi pi-download',
        actionType: ControlType.Button,
        styleClass: 'p-button-info',
        command: (_: any, rowData: any) => this.onExport(rowData.id),
      },
    ],
  };

  protected filterParams: Partial<IFilter> = {
    searchText: '',
    page: 0,
    pageSize: 20,
    statusTab: TabStatus.Pending,
    fromAt: DateTimeHelper.firstDayOfCurrentMonth(),
    toAt: new Date(),
  };

  protected paginator: any = {
    totalRecords: 0,
    currentPage: 0,
    pageSize: 20,
  };

  protected constructor(
    protected crudMethodService: ICrudMethod,
    protected notificationService: NotificationService,
    protected reportDownloadService: ReportDownloadService,
  ) {
    // Setup default header action
    this.headerActions = [
      {
        label: 'button.add',
        actionType: ControlType.Button,
        icon: 'pi pi-plus',
        styleClass: 'p-button-success',
        command: () => this.onAddNew(),
      },
    ];
  }

  ngOnInit(): void {
    this.loadData();
  }

  onEdit(id: number): void {
    this.detailFormComponent.onEdit(id);
  }

  onDelete(id: number): void {
    this.crudMethodService.delete(id).subscribe((res) => {
      this.notificationService.success('success.delete');
      this.loadData();
    });
  }

  onExport(id: number): void {
    this.crudMethodService.export(id).subscribe((res) => {
      this.openDownloadFile(res.data, 'pdf');
    });
  }

  openDownloadFile(fileName, filetype: string) {
    try {
      var _l = this.reportDownloadService.getFolderPathDownload(fileName, filetype);
      if (_l) window.open(_l);
    } catch (ex) {
      // this.notificationService.error('Lỗi', 'Không thể download file');
    }
  }

  onAddNew(): void {
    this.detailFormComponent.toggleVisible();
  }

  onFormClosing(submitSuccess: boolean): void {
    if (submitSuccess) this.loadData();
  }

  loadData($event: any = null) {
    this.crudMethodService.getAll(this.filterParams).subscribe((res) => {
      this.dataSource = res.data;
      this.paginator.totalRecords = res.totalRecords;
      this.paginator.totalRecords = res.totalItems;
      this.paginator.pageSize = res.pageSize;
    });
  }
}
