import { AfterContentInit, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ColumnDataType } from '@app/core/enum';
import { FileDeliveredModel } from '@app/models/procedure/procedure-product.model';
import { TabMenuItem } from '@app/models/tab-menu-item';
import { Column, ControlType } from '@app/models/table/column';
import { NotificationService } from '@app/service/notification.service';
import { ReportDownloadService } from '@app/service/report-download';
import { RequestEquipmentService } from '@app/service/request-equipment.service';
import { ToastService } from '@app/service/toast.service';
import { TranslationService } from '@app/service/translation.service';
import { UserService } from '@app/service/user.service';
import { BaseDataTableComponent } from '@app/shared/components/base-data-table.component';
import { TabStatus } from '@utilities/app-enum';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-requesting-equipment',
  templateUrl: './requesting-equipment.component.html',
  styleUrls: ['./requesting-equipment.component.scss'],
})
export class RequestingEquipmentComponent extends BaseDataTableComponent implements OnInit, AfterContentInit {
  columns: Column[];
  tabMenus: TabMenuItem[];
  currentStatus: number = TabStatus.Pending;
  activeItem: MenuItem;
  showImage = false;
  fileList: FileDeliveredModel[] = [];
  userList: any[] = [];
  @ViewChild('dateCol', { static: true }) dateCol: TemplateRef<any>;

  constructor(
    protected readonly requestEquipmentService: RequestEquipmentService,
    protected readonly notificationService: NotificationService,
    private readonly translationService: TranslationService,
    protected reportDownloadService: ReportDownloadService,
    private toastService: ToastService,
    private userService: UserService,
  ) {
    super(requestEquipmentService, notificationService, reportDownloadService);
    this.columns = [
      { header: 'label.requesting_payment_pass_procedure_id', field: 'procedureNumber', width: '20%' },
      { header: 'label.status', field: 'procedureStatusName', width: '15%' },
      { header: 'Ngày tháng', field: 'date', columnType: ColumnDataType.template, width: '25%' },
      { header: 'label.requesting_payment_pass_content', field: 'note', width: '20%' },
      {
        field: 'action',
        header: '',
        width: '20%',
        columnType: ColumnDataType.action,
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
            label: '',
            icon: 'pi pi-angle-double-right',
            actionType: ControlType.Button,
            styleClass: 'p-button-primary',
            command: (_: any, rowData: any) => this.onAccept(rowData.id),
            visibleCondition: (rowData) => this.isPending(),
          },
          {
            label: 'button.edit',
            icon: 'pi pi-pencil',
            actionType: ControlType.Button,
            styleClass: 'p-button-success',
            command: (_: any, rowData: any) => this.onEdit(rowData.id),
          },
          {
            label: '',
            icon: 'pi pi-angle-double-left',
            actionType: ControlType.Button,
            styleClass: 'p-button-primary',
            command: (_: any, rowData: any) => this.onNotAccept(rowData.id),
            visibleCondition: (rowData) => this.isPending() && rowData.shoulNotAccept,
          },
          {
            label: 'button.delete',
            icon: 'pi pi-trash',
            actionType: ControlType.Button,
            styleClass: 'p-button-danger',
            command: (_: any, rowData: any) => this.onDelete(rowData.id),
            visibleCondition: (rowData) => this.isDisplayAction(rowData, 'delete'),
          },
          {
            label: 'button.export',
            icon: 'pi pi-download',
            actionType: ControlType.Button,
            styleClass: 'p-button-info',
            command: (_: any, rowData: any) => this.onExport(rowData.id),
          },
        ],
      },
    ];
    this.tabMenus = [
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
  }

  ngOnInit() {
    super.ngOnInit();
    this.userService.getAllUserActive().subscribe((res) => {
      this.userList = res.data;
    });
  }

  private onAccept(id) {
    this.requestEquipmentService.accept(id).subscribe((res) => {
      this.toastService.success('Chuyển tiếp yêu cầu thành công');
      this.loadData();
    });
  }

  private onNotAccept(id) {
    this.requestEquipmentService.notAccept(id).subscribe((res) => {
      this.toastService.success('Chuyển lại yêu cầu thành công');
      this.loadData();
    });
  }

  private isDisplayAction(item: any, action: string) {
    switch (action) {
      case 'not-accept':
        return this.currentStatus === TabStatus.Pending && item.shoulNotAccept;
      case 'delete':
        return this.currentStatus === TabStatus.Pending && item.shoulDelete;
    }
    return true;
  }

  private hasImage(rowData: any) {
    return rowData.files?.length > 0;
  }

  private onShowImage(rowData: any) {
    this.showImage = true;
    this.fileList = rowData.files;
  }

  private isPending() {
    return this.filterParams.statusTab === TabStatus.Pending;
  }

  ngAfterContentInit(): void {
    this.columns.forEach((col) => {
      if (col.columnType === ColumnDataType.template) {
        col.template = this.dateCol;
      }
    });
  }

  onFilterChange(event: any) {
    this.filterParams = event;
    this.loadData();
  }
}
