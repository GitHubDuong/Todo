import { Column, ControlType, IAction, IFilter } from "@app/models/table/column";
import { Directive, OnInit, ViewChild } from "@angular/core";
import { NotificationService } from "@app/service/notification.service";
import { BaseDetailComponent } from "@app/shared/components/base-detail.component";
import { ColumnDataType } from "@app/core/enum";
import { DateTimeHelper } from '@app/shared/helper/date-time.helper';
import { TabStatus } from "@utilities/app-enum";
import { ReportDownloadService } from "@app/service/report-download";
import { BaseProduceService } from "@app/service/produces/base-produce.service";
import AppUtil from "@utilities/app-util";
import { MessageService } from "primeng/api";
import { TranslationService } from "@app/service/translation.service";

@Directive()
export abstract class BaseProduceDataTableComponent implements OnInit {
  @ViewChild('detailFormComponent') detailFormComponent: BaseDetailComponent | undefined;
  protected dataSource: any[] = [];
  abstract columns: Column[];
  protected headerActions: IAction[];
  protected isDetailVisible: boolean = false;
  protected isLoading: boolean = true;
  protected actions = {
    notAccept: {
      label: 'button.accept',
      icon: "pi pi-angle-double-left",
      actionType: ControlType.Button,
      styleClass: 'p-button-danger',
      command: (_: any, rowData: any) => this.notAccept(rowData.id),
      visibleCondition: (rowData: any) => rowData.shoulNotAccept == true
    },
    accept: {
      label: 'button.accept',
      icon: "pi pi-angle-double-right",
      actionType: ControlType.Button,
      styleClass: 'p-button-success',
      command: (_: any, rowData: any) => this.accept(rowData.id),
    },
    edit: {
      label: 'button.edit',
      icon: "pi pi-pencil",
      actionType: ControlType.Button,
      styleClass: 'p-button-success',
      command: (_: any, rowData: any) => this.onEdit(rowData.id)
    },
    detail: {
      label: 'button.edit',
      icon: "pi pi-search-plus",
      actionType: ControlType.Button,
      command: (_: any, rowData: any) => this.onEdit(rowData.id)
    },
    delete: {
      label: 'button.delete',
      icon: "pi pi-trash",
      actionType: ControlType.Button,
      styleClass: 'p-button-danger',
      command: (_: any, rowData: any) => this.onDelete(rowData.id),
      visibleCondition: (rowData: any) => rowData.shoulDelete == true
    },
    export: {
      label: 'button.export',
      icon: "pi pi-download",
      actionType: ControlType.Button,
      styleClass: 'p-button-info',
      command: (_: any, rowData: any) => this.onExport(rowData.id)
    }
  }
  protected readonly defaultActionCol: Column = {
    field: 'action',
    header: '',
    width: "20%",
    columnType: ColumnDataType.action,
    actions: [
      this.actions.accept,
      this.actions.edit,
      this.actions.delete,
      this.actions.export,
    ]
  }

  protected filterParams: Partial<IFilter> = {
    searchText: '',
    page: 0,
    pageSize: 20,
    statusTab: TabStatus.Pending,
    fromAt: DateTimeHelper.firstDayOfCurrentMonth(),
    toAt: new Date(),
    userId: null
  };

  protected paginator: any = {
    totalRecords: 0,
    currentPage: 0,
    pageSize: 20
  };

  protected constructor(
    protected produceService: BaseProduceService,
    protected notificationService: NotificationService,
    protected messageService: MessageService,
    protected translationService: TranslationService,
    protected reportDownloadService: ReportDownloadService = null,
  ) {
    // Setup default header action
    this.headerActions = [
      {
        label: "button.add",
        actionType: ControlType.Button,
        icon: "pi pi-plus",
        styleClass: "p-button-success",
        command: () => this.onAddNew()
      }
    ]
  }

  ngOnInit(): void {
    this.loadData();
  }

  onEdit(id: number): void {
    this.detailFormComponent.onEdit(id);
  }

  onDelete(id: number): void {
    this.produceService.delete(id).subscribe(res => {
      this.notificationService.success('success.delete')
      this.loadData();
    })
  }

  onExport(id: number): void {
    this.produceService.export(id).subscribe(res => {
      this.openDownloadFile(res.data, 'pdf');
    });
  }

  openDownloadFile(fileName: string, filetype: string) {
    try {
      const filePath = this.reportDownloadService.getFolderPathDownload(fileName, filetype);

      if (filePath)
        window.open(filePath);

    } catch (ex) { }
  }

  onAddNew(): void {
    this.detailFormComponent.toggleVisible();
  }

  accept(orderId: number): void {
    this.produceService.accept(orderId).subscribe((res: any) => {
      AppUtil.scrollToTop();
      this.messageService.add({
        severity: 'success',
        detail: this.translationService.translate('success.approved_request'),
      });
      this.loadData(null);
    });
  }

  notAccept(orderId: number): void {
    this.produceService.notAccept(orderId).subscribe((res: any) => {
      AppUtil.scrollToTop();
      this.messageService.add({
        severity: 'success',
        detail: this.translationService.translate('success.approved_request'),
      });
      this.loadData(null);
    });
  }

  onFormClosing(submitSuccess: boolean): void {
    if (submitSuccess)
      this.loadData();
  }

  loadData($event: any = null) {
    this.produceService.getAll(this.filterParams).subscribe(res => {
      this.dataSource = res.data;
      this.paginator.totalRecords = res.totalRecords;
      this.paginator.totalRecords = res.totalItems;
      this.paginator.pageSize = res.pageSize;
    })
  }

}
