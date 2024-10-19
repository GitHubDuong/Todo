import { AfterContentInit, Component, TemplateRef, ViewChild } from '@angular/core';
import { ColumnDataType } from '@app/core/enum';
import { FileDeliveredModel } from '@app/models/procedure/procedure-product.model';
import { Column, ControlType } from '@app/models/table/column';
import { NotificationService } from '@app/service/notification.service';
import { AdvancedPaymentService } from '@app/service/produces/advanced-payment.service';
import { ReportDownloadService } from '@app/service/report-download';
import { TranslationService } from '@app/service/translation.service';
import { UserService } from '@app/service/user.service';
import { BaseProduceDataTableComponent } from '@app/shared/components/base-produce-data-table.component';
import { TabStatus } from '@utilities/app-enum';
import * as _ from 'lodash';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-advanced-payment-pass',
  templateUrl: './advanced-payment-pass.component.html',
  styleUrls: ['./advanced-payment-pass.component.scss'],
})
export class AdvancedPaymentPassComponent extends BaseProduceDataTableComponent implements AfterContentInit {
  columns: Column[] = [
    {
      header: '',
      field: 'checked',
      width: '5%',
      columnType: ColumnDataType.template,
      isCheckAll: true,
    },
    {
      header: 'label.advanced_payment_pass_procedure_id',
      field: 'procedureNumber',
      width: '20%',
      columnType: ColumnDataType.text,
    },
    { header: 'label.status', field: 'procedureStatusName', width: '10%', columnType: ColumnDataType.text },
    {
      header: 'label.advanced_payment_pass_advanced_reason',
      field: 'note',
      width: '15%',
      columnType: ColumnDataType.text,
    },
    {
      header: 'label.advanced_payment_pass_advanced_cash',
      field: 'amount',
      width: '15%',
      columnType: ColumnDataType.template,
    },
    {
      header: 'label.advanced_payment_pass_payment_time',
      field: 'datePayment',
      width: '15%',
      columnType: ColumnDataType.date,
    },
    {
      ...this.defaultActionCol,
      actions: [
        {
          label: 'button.accept',
          icon: 'pi pi-image',
          actionType: ControlType.Button,
          styleClass: 'p-button-warning',
          command: (_: any, rowData: any) => this.onShowImage(rowData),
          visibleCondition: (rowData: any) => this.hasImage(rowData),
        },
        {
          label: 'button.accept',
          icon: 'pi pi-angle-double-right',
          actionType: ControlType.Button,
          styleClass: 'p-button-success',
          command: (_: any, rowData: any) => this.accept(rowData.id),
          visibleCondition: (rowData: any) => this.isPending(),
        },
        this.actions.detail,
        {
          label: 'button.accept',
          icon: 'pi pi-angle-double-left',
          actionType: ControlType.Button,
          styleClass: 'p-button-success',
          command: (_: any, rowData: any) => this.notAccept(rowData.id),
          visibleCondition: (rowData: any) => this.isPending(),
        },
        this.actions.delete,
        {
          ...this.actions.export,
          visibleCondition: (rowData: any) => this.isFinished(rowData),
        },
      ],
    },
  ];

  tabList = [
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
      label: 'Kết thúc',
      icon: 'pi pi-check-circle',
      value: TabStatus.End,
    },
    {
      label: this.translationService.translate('label.all'),
      icon: 'pi pi-th-large',
      value: TabStatus.All,
    },
  ];
  userList: any[] = [];
  showImage = false;
  fileList: FileDeliveredModel[] = [];
  showExpenditureForm = false;
  selectedIds: number[] = [];
  @ViewChild('userAndMoney', { static: true }) userAndMoney: TemplateRef<any>;
  @ViewChild('cb', { static: true }) cb: TemplateRef<any>;

  constructor(
    protected advancedPaymentService: AdvancedPaymentService,
    protected translationService: TranslationService,
    protected notificationService: NotificationService,
    protected messageService: MessageService,
    private userService: UserService,
    protected reportDownloadService: ReportDownloadService,
  ) {
    super(advancedPaymentService, notificationService, messageService, translationService, reportDownloadService);
  }

  private isPending() {
    return this.filterParams.statusTab === TabStatus.Pending;
  }

  ngOnInit() {
    super.ngOnInit();
    this.getAllUser();
  }

  loadData($event: any = null) {
    this.produceService.getAll(this.filterParams).subscribe((res) => {
      this.dataSource = res.data;
      this.paginator.totalRecords = res.totalRecords;
      this.paginator.totalRecords = res.totalItems;
      this.paginator.pageSize = res.pageSize;
      this.mapData();
    });
  }

  private getAllUser() {
    this.userService.getAllUserActive().subscribe((res) => {
      this.userList = res.data;
      this.mapData();
    });
  }

  private mapData() {
    if (this.dataSource?.length === 0 || this.userList?.length === 0) {
      return;
    }
    const mapUser = _.chain(this.userList).keyBy('id').mapValues('fullName').value();
    this.dataSource = this.dataSource.map((data) => {
      return {
        ...data,
        user: mapUser[data.userId],
      };
    });
  }

  ngAfterContentInit(): void {
    this.columns.forEach((item: Column) => {
      if (item.field === 'amount') {
        item.template = this.userAndMoney;
      }
      if (item.field === 'checked') {
        item.template = this.cb;
      }
    });
  }

  private hasImage(rowData: any) {
    return rowData.files?.length > 0;
  }

  private onShowImage(rowData: any) {
    this.showImage = true;
    this.fileList = rowData.files;
  }

  private isFinished(row) {
    return row.isFinished;
  }

  get tabStatus() {
    return TabStatus;
  }

  onCreateExpenditurePlan() {
    this.selectedIds = (this.dataSource.filter((item: any) => item.checked) || []).map((item: any) => item.id);
    this.showExpenditureForm = true;
  }

  onFilterChange(event: any) {
    this.filterParams = event;
    this.loadData();
  }
}
