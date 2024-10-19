import { AfterContentInit, Component, TemplateRef, ViewChild } from '@angular/core';
import { ColumnDataType } from '@app/core/enum';
import { FileDeliveredModel } from '@app/models/procedure/procedure-product.model';
import { TabMenuItem } from '@app/models/tab-menu-item';
import { Column, ControlType } from '@app/models/table/column';
import { NotificationService } from '@app/service/notification.service';
import { ReportDownloadService } from '@app/service/report-download';
import { RequestingPaymentService } from '@app/service/requesting-payment.service';
import { TranslationService } from '@app/service/translation.service';
import { BaseProduceDataTableComponent } from '@app/shared/components/base-produce-data-table.component';
import { PaymentPassStatus, TabStatus } from '@utilities/app-enum';
import { MenuItem, MessageService } from 'primeng/api';

@Component({
  selector: 'app-requesting-payment-pass',
  templateUrl: './requesting-payment-pass.component.html',
  styleUrls: ['./requesting-payment-pass.component.scss'],
})
export class RequestingPaymentPassComponent extends BaseProduceDataTableComponent implements AfterContentInit {
  columns: Column[];
  tabMenus: TabMenuItem[];
  currentStatus: number = TabStatus.Pending;
  activeItem: MenuItem;
  showExpenditureForm = false;
  selectedIds: number[] = [];
  showImage = false;
  fileList: FileDeliveredModel[] = [];
  @ViewChild('codeCol', { static: true }) codeCol: TemplateRef<any>;

  constructor(
    protected readonly requestingPaymentService: RequestingPaymentService,
    protected readonly notificationService: NotificationService,
    protected readonly translationService: TranslationService,
    protected reportDownloadService: ReportDownloadService,
    protected messageService: MessageService,
  ) {
    super(requestingPaymentService, notificationService, messageService, translationService, reportDownloadService);
    this.columns = [
      {
        header: '',
        field: 'checked',
        width: '5%',
        columnType: ColumnDataType.checkbox,
        isCheckAll: true,
      },
      {
        header: 'label.requesting_payment_pass_procedure_id',
        field: 'procedureNumber',
        width: '20%',
        columnType: ColumnDataType.template,
      },
      { header: 'label.status', field: 'procedureStatusName', width: '10%', columnType: ColumnDataType.text },
      { header: 'label.requesting_payment_pass_content', field: 'note', width: '15%', columnType: ColumnDataType.text },
      {
        header: 'label.requesting_payment_pass_advanced_mount',
        field: 'advanceAmount',
        width: '10%',
        columnType: ColumnDataType.number,
      },
      {
        header: 'label.requesting_payment_pass_refund_mount',
        field: 'refundAmount',
        width: '10%',
        columnType: ColumnDataType.number,
      },
      {
        header: 'label.requesting_payment_pass_additional_mount',
        field: 'totalAmount',
        width: '10%',
        columnType: ColumnDataType.number,
      },
      {
        ...this.defaultActionCol,
        width: '20%',
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
          this.actions.export,
        ],
      },
    ];
    this.tabMenus = [
      {
        label: this.translationService.translate('label.pending_approval'),
        icon: 'pi pi-clock',
        value: PaymentPassStatus.Pending,
      },
      {
        label: this.translationService.translate('label.approved'),
        icon: 'pi pi-check-circle',
        value: PaymentPassStatus.Approved,
      },
      {
        label: this.translationService.translate('label.done'),
        icon: 'pi pi-check-circle',
        value: PaymentPassStatus.Done,
      },
      {
        label: 'Đang làm',
        icon: 'pi pi-clock',
        value: PaymentPassStatus.InProgress,
      },
      {
        label: 'Chi một phần',
        icon: 'pi pi-check-circle',
        value: PaymentPassStatus.Half,
      },
      {
        label: 'Kết thúc',
        icon: 'pi pi-th-large',
        value: PaymentPassStatus.End,
      },
      {
        label: this.translationService.translate('label.all'),
        icon: 'pi pi-th-large',
        value: PaymentPassStatus.All,
      },
    ];
  }

  private isPending() {
    return this.filterParams.statusTab === TabStatus.Pending;
  }

  onCreateExpenditurePlan() {
    this.selectedIds = (this.dataSource.filter((item: any) => item.checked) || []).map((item: any) => item.id);
    console.log(this.selectedIds);
    this.showExpenditureForm = true;
  }

  get tabStatus() {
    return TabStatus;
  }

  private hasImage(rowData: any) {
    return rowData.files?.length > 0;
  }

  private onShowImage(rowData: any) {
    this.showImage = true;
    this.fileList = rowData.files;
  }

  onFilterChange(event: any) {
    this.filterParams = event;
    this.loadData();
  }

  ngAfterContentInit(): void {
    this.columns.forEach((col) => {
      if (col.columnType === ColumnDataType.template) {
        col.template = this.codeCol;
      }
    });
  }

  protected readonly PaymentPassStatus = PaymentPassStatus;
}
