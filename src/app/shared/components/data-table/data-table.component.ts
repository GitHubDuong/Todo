import { Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { ColumnDataType } from '@app/core/enum';
import { Column, IAction } from '@app/models/table/column';
import appConstant from '@utilities/app-constants';
import AppUtil from '@utilities/app-util';

@Component({
  selector: 'app-data-table',
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.scss'],
})
export class DataTableComponent implements OnInit {
  appUtil = AppUtil;
  @Input() dataSource: any[] = [];
  @Input() columns: Column[] = [];
  @Input() headerActions: IAction[] = [];
  @Input() filterParams: any = {};
  @Input() showSearch = true;
  @Output() filterParamsChange = new EventEmitter<any>();
  @Output() onLoad = new EventEmitter<any>();

  protected readonly appConstant = appConstant;
  protected readonly ColumnDataType = ColumnDataType;
  @Input() paginator: any;
  isMobile = window.innerWidth < 1200;

  @HostListener('window:resize', ['$event'])
  onWindowResize(_$event?: Event) {
    this.isMobile = window.innerWidth < 1200;
  }

  ngOnInit() {}

  onSearch($event: KeyboardEvent) {
    if ($event.key === 'Enter') {
      this.noticeFilterChange();
    }
  }

  onPage($event: any) {
    this.filterParams.page = $event ? $event.first / $event.rows + 1 : this.paginator.currentPage;
    this.filterParams.pageSize = $event ? $event.rows : this.paginator.pageSize;
    this.noticeFilterChange();
  }

  private noticeFilterChange() {
    this.filterParamsChange.emit(this.filterParams);
    this.onLoad.emit();
  }

  protected readonly columDataType = ColumnDataType;
}
