import { AfterContentInit, Component, TemplateRef, ViewChild } from '@angular/core';
import { ColumnDataType } from '@app/core/enum';
import { TabMenuItem } from '@app/models/tab-menu-item';
import { Column, ControlType, IAction } from '@app/models/table/column';
import { NotificationService } from '@app/service/notification.service';
import { GatePassService } from '@app/service/produces/gate-pass.service';
import { ReportDownloadService } from '@app/service/report-download';
import { TranslationService } from '@app/service/translation.service';
import { BaseProduceDataTableComponent } from '@app/shared/components/base-produce-data-table.component';
import { TabStatus } from '@app/utilities/app-enum';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-gate-pass',
  templateUrl: './gate-pass.component.html',
  styleUrls: ['./gate-pass.component.scss'],
})
export class GatePassComponent extends BaseProduceDataTableComponent implements AfterContentInit {
  isLoading: boolean = false;
  columns: Column[];
  headerActions: IAction[];
  data: any[];
  tabMenus: TabMenuItem[];
  @ViewChild('special', { static: true }) special: TemplateRef<any>;

  constructor(
    protected readonly gatePassService: GatePassService,
    protected readonly notificationService: NotificationService,
    protected readonly translationService: TranslationService,
    protected reportDownloadService: ReportDownloadService,
    protected messageService: MessageService,
  ) {
    super(gatePassService, notificationService, messageService, translationService, reportDownloadService);
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

  ngAfterContentInit(): void {
    this.columns = [
      {
        field: 'isSpecial',
        header: 'label.gate_is_special',
        width: '8%',
        columnType: ColumnDataType.template,
        template: this.special,
      },
      { field: 'procedureNumber', header: 'label.gate_pass_code', width: '15%' },
      { field: 'procedureStatusName', header: 'label.status', width: '10%' },
      { field: 'local', header: 'label.gate_pass_approval', width: '15%' },
      { field: 'date', header: 'label.gate_pass_time', width: '15%', columnType: ColumnDataType.date_time },
      { field: 'carName', header: 'label.gate_pass_plate_number', width: '10%' },
      { field: 'note', header: 'label.gate_pass_reason', width: '17%' },
      {
        ...this.defaultActionCol,
        actions: [
          {
            label: 'button.accept',
            icon: 'pi pi-angle-double-right',
            actionType: ControlType.Button,
            styleClass: 'p-button-success',
            command: (_: any, rowData: any) => this.accept(rowData.id),
            visibleCondition: (rowData: any) => this.isPending(),
          },
          this.actions.edit,
          {
            label: 'button.accept',
            icon: 'pi pi-angle-double-left',
            actionType: ControlType.Button,
            styleClass: 'p-button-danger',
            command: (_: any, rowData: any) => this.notAccept(rowData.id),
            visibleCondition: (rowData: any) => this.isPending() && rowData.shoulNotAccept,
          },
          this.actions.delete,
          this.actions.export,
        ],
      },
    ];
  }

  private isPending() {
    return this.filterParams.statusTab === TabStatus.Pending;
  }

  onFilterChange(event: any) {
    this.filterParams = event;
    this.loadData();
  }
}
