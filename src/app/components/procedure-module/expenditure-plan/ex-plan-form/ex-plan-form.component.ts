import { Component, EventEmitter, HostListener, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { ActionButtonModel } from '@app/models/common/action-button.model';
import { ExpenditurePlanService } from '@app/service/expenditure-plan.service';
import { ReportDownloadService } from '@app/service/report-download';
import { ToastService } from '@app/service/toast.service';
import * as _ from 'lodash';
import { BehaviorSubject, map } from 'rxjs';

@Component({
  selector: 'app-ex-plan-form',
  templateUrl: './ex-plan-form.component.html',
  styleUrls: ['./ex-plan-form.component.scss'],
})
export class ExPlanFormComponent implements OnInit, OnChanges {
  @Input() visible: boolean = false;
  @Input() item: any;
  @Input() userList: any[] = [];
  @Output() visibleChange = new EventEmitter<boolean>();
  detail: any;
  fileLink: any[] = [];
  isMobile = window.innerWidth < 1200;
  actionList: ActionButtonModel[] = [
    {
      icon: 'pi-download',
      label: 'In quyết toán',
      class: 'p-button-success',
      command: () => {
        this.onExportAdvance();
      },
    },
    {
      icon: 'pi-times',
      label: 'button.backF6',
      class: 'p-button-outlined',
      command: () => {
        this.onBack();
      },
    },
    {
      icon: 'pi-check',
      label: 'button.saveF8',
      class: '',
      command: () => {
        this.onSave();
      },
    },
  ];

  paidOptions = [
    { label: 'Chưa chi', value: 'Unspent' },
    { label: 'Chi một phần', value: 'PartiallyPaid' },
    { label: 'Hoàn thành', value: 'FullyPaid' },
  ];
  private readonly confirmUploadFile$ = new BehaviorSubject<{ row: any; files: File[] } | undefined>(undefined);
  selectedItem: any;
  cloneSelected: any;
  showPriceDialog: boolean = false;

  get showConfirmUploadFile$() {
    return this.confirmUploadFile$.asObservable().pipe(map((x) => !!x?.row && x?.files?.length));
  }

  @HostListener('window:resize', ['$event'])
  onWindowResize(_$event?: Event) {
    this.isMobile = window.innerWidth < 1200;
  }

  get totalAmount() {
    return this.getItems().reduce((total: number, item: any) => total + item.expenditurePlanAmount, 0);
  }

  constructor(
    private expenditurePlanService: ExpenditurePlanService,
    private toastService: ToastService,
    private reportDownloadService: ReportDownloadService,
  ) {}

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges): void {
    const { item } = changes;
    if (item && item.currentValue) {
      this.expenditurePlanService.getById(this.item.id).subscribe((res: any) => {
        this.detail = {
          ...res,
          date: new Date(res.date),
          user: this.userList.find((x) => x.id === res.userId)?.fullName,
        };
      });
    }
  }

  onBack() {
    this.visibleChange.emit(false);
  }

  onSave() {
    this.expenditurePlanService
      .updateExpenditurePlan(this.item.id, {
        ...this.detail,
        files: this.fileLink,
      })
      .subscribe((res) => {
        this.toastService.success('Cập nhật thành công');
      });
  }

  getItems() {
    return this.detail?.items || [];
  }

  onAttachFile(row: any, event: any) {
    this.selectedItem = row;
    if (row?.files?.length >= 4 || event.target?.files.length > 4 || event.target?.files.length + row?.files?.length > 4) {
      return;
    }
    this.confirmUploadFile$.next({ row, files: event.target?.files });
  }

  onRemove(idx: any) {
    this.detail?.items.splice(idx, 1);
  }

  onUploadFiles() {
    const { row, files } = this.confirmUploadFile$.value;
    for (let i = 0; i < files.length; i++) {
      const formData = new FormData();
      formData.append('file', files[i]);
      this.expenditurePlanService.uploadFile(formData).subscribe((res: any) => {
        if (!row.files) {
          row.files = [];
        }
        if (row.files?.length < 4) {
          row.files.push(res);
        }
        row.status = this.selectedItem.status;
        this.confirmUploadFile$.next(undefined);
      });
    }
  }

  onCancelUploadFiles() {
    this.confirmUploadFile$.next(undefined);
  }

  onExportAdvance(): void {
    this.expenditurePlanService.exportAdvance(this.item.id).subscribe((res) => {
      this.openDownloadFile(res.data, 'pdf');
    });
  }

  openDownloadFile(fileName: string, filetype: string) {
    try {
      const filePath = this.reportDownloadService.getFolderPathDownload(fileName, filetype);

      if (filePath) window.open(filePath);
    } catch (ex) {}
  }

  getStatus(status: string) {
    return this.paidOptions.find((x) => x.value === status)?.label;
  }

  onOpenPriceDialog(item: any) {
    console.log(item);
    this.selectedItem = item;
    this.cloneSelected = _.cloneDeep(item);
    this.showPriceDialog = true;
  }

  onSavePrice() {
    (this.detail?.items || []).forEach((item: any) => {
      if (item.id == this.cloneSelected.id) {
        item.approveAmount = this.cloneSelected.approveAmount;
        item.note = this.cloneSelected.note;
      }
    });
    this.showPriceDialog = false;
  }

  onCancelPrice() {
    this.showPriceDialog = false;
  }

  onAttachFileStatuses(item: any, event: any) {
    if (event.target?.files.length > 4) {
      return;
    }
    for (let i = 0; i < event.target?.files.length; i++) {
      const formData = new FormData();
      formData.append('file', event.target?.files[i]);
      this.expenditurePlanService.uploadFile(formData).subscribe((res: any) => {
        if (!item.fileStatuses) {
          item.fileStatuses = [];
        }
        if (item.fileStatuses?.length < 4) {
          item.fileStatuses.push(res);
        }
      });
    }
  }
}
