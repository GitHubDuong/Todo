import {
  AfterContentInit,
  Component,
  ContentChildren,
  EventEmitter,
  HostListener,
  Input,
  OnInit,
  Output,
  QueryList,
  TemplateRef,
} from '@angular/core';
import { ColumnDataType } from '@app/core/enum';
import { TableColumModel } from '@app/models/common/table-colum.model';
import { AppTemplate } from '@app/shared/directives/app-template';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
})
export class TableComponent implements OnInit, AfterContentInit {
  @Input() data: any[] = [];
  @Input() columns: TableColumModel[] = [];
  @Input() actionClass = 'w-2';
  @Input() loading = true;
  @Input() pageIndex = 0;
  @Input() pageSize = 10;
  @Input() totalRecords = 0;
  @Input() paging = true;
  @Input() action = true;
  isMobile = window.innerWidth < 1200;
  columDataType = ColumnDataType;
  actionTemplate: TemplateRef<any>;
  mobileTemplate: TemplateRef<any>;

  @ContentChildren(AppTemplate) templates?: QueryList<AppTemplate>;

  @HostListener('window:resize', ['$event'])
  onWindowResize(_$event?: Event) {
    this.isMobile = window.innerWidth < 1200;
  }

  @Output() load = new EventEmitter();

  constructor() {}

  ngOnInit(): void {}

  onload(event: any) {
    this.load.emit(event);
  }

  ngAfterContentInit(): void {
    this.templates?.forEach((item: AppTemplate) => {
      switch (item.getType()) {
        case 'action':
          this.actionTemplate = item.template;
          break;
        case 'mobile':
          this.mobileTemplate = item.template;
          break;
      }
    });
  }

  getFirst() {
    return this.pageIndex * this.pageSize;
  }
}
