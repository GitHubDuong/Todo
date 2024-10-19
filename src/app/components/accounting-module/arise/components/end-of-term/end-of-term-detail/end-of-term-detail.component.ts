import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { TableColumModel } from '@app/models/common/table-colum.model';
import { ChartOfAccountService } from '@app/service/chart-of-account.service';
import { EndOfTermEndingService } from '@app/service/end-of-term-ending.service';
import { ToastService } from '@app/service/toast.service';
import { EndOfTermDetailColumns } from '@components/accounting-module/arise/components/end-of-term/end-of-term-detail/end-of-term-detail.config';

@Component({
  selector: 'app-end-of-term-detail',
  templateUrl: './end-of-term-detail.component.html',
  styleUrls: ['./end-of-term-detail.component.scss'],
})
export class EndOfTermDetailComponent implements OnChanges, OnInit {
  @Input() visible: boolean = false;
  @Input() isInternal = -1;
  @Input() itemList: any[] = [];
  @Output() visibleChange = new EventEmitter();
  @Output() transform = new EventEmitter();
  data: any[] = [];
  columns: TableColumModel[] = [];
  loading = false;
  isCheckAll = false;

  constructor(
    private endOfTermService: EndOfTermEndingService,
    private chartOfAccountService: ChartOfAccountService,
    private toastService: ToastService,
  ) {}

  ngOnInit(): void {
    this.columns = EndOfTermDetailColumns;
  }

  onSave() {
    const checked = this.data
      .filter((i) => i.checked)
      .map((item: any) => {
        return {
          ...item,
          creditCodeDetail1: item.creditCodeDetail1?.code,
          creditCodeDetail2: item.creditCodeDetail2?.code,
        };
      });
    this.endOfTermService.saveEndOfTerm(this.isInternal, checked).subscribe((res: any) => {
      this.toastService.success('Lưu thành công');
      this.visibleChange.emit(false);
    });
  }

  cancel() {
    this.visibleChange.emit(false);
  }

  ngOnChanges(changes: SimpleChanges): void {
    const checkedIds = (this.itemList || []).filter((i) => i.checked).map((i) => i.id);
    if (checkedIds?.length === 0) {
      return;
    }
    this.loading = true;
    this.endOfTermService.getDetails(checkedIds).subscribe((res: any) => {
      this.data = (res.data || []).map((item: any) => ({
        ...item,
        creditCodeDetail1: { code: item.creditCodeDetail1 },
        creditCodeDetail2: { code: item.creditCodeDetail2 },
        creditCodeDetail1Suggestion: [],
        creditCodeDetail2Suggestion: [],
      }));
      this.loading = false;
    });
  }

  onSearch(item: any, event: any, parentCode: string, field: string) {
    switch (field) {
      case 'creditCodeDetail1':
        break;
      case 'creditCodeDetail2':
        parentCode = `${parentCode}:${item.creditCodeDetail1.code}`;
        break;
      default:
        break;
    }
    const param = {
      page: 0,
      pageSize: 20,
      parentCode,
      searchText: event.query,
    };
    this.chartOfAccountService.getDetailV2(parentCode, param).subscribe((res: any) => {
      switch (field) {
        case 'creditCodeDetail1':
          item.creditCodeDetail1Suggestion = res.data || [];
          break;
        case 'creditCodeDetail2':
          item.creditCodeDetail2Suggestion = res.data || [];
          break;
        default:
          break;
      }
    });
  }

  onChangeCodeDetail1(event: any, item: any) {
    const parentCode = `${item.creditCode}:${item.creditCodeDetail1.code}`;
    const param = {
      page: 0,
      pageSize: 20,
      parentCode,
      searchText: '',
    };
    this.chartOfAccountService.getDetailV2(parentCode, param).subscribe((res: any) => {
      if (!res?.data?.length) {
        item.creditCodeDetail2.code = null;
      } else {
        item.creditCodeDetail2 = { code: '' };
      }
    });
  }

  onToggleCheckAll() {
    this.data.forEach((item: any) => {
      item.checked = this.isCheckAll;
    });
  }
}
