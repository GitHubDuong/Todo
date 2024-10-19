import { AfterContentInit, Component, ContentChildren, Input, QueryList, TemplateRef } from '@angular/core';
import { AppTemplate } from '@app/shared/directives/app-template';

@Component({
  selector: 'app-table-layout',
  templateUrl: './table-layout.component.html',
  styleUrls: ['./table-layout.component.scss'],
})
export class TableLayoutComponent implements AfterContentInit {
  @Input() pageTitle = '';
  actionLeftTemplate: TemplateRef<any>;
  actionRightTemplate: TemplateRef<any>;
  contentTemplate: TemplateRef<any>;
  menuTemplate: TemplateRef<any>;
  @ContentChildren(AppTemplate) templates?: QueryList<any>;

  constructor() {
    this.actionLeftTemplate = null;
    this.actionRightTemplate = null;
    this.contentTemplate = null;
  }

  ngAfterContentInit(): void {
    this.templates?.forEach((item: AppTemplate) => {
      switch (item.getType()) {
        case 'menu':
          this.menuTemplate = item.template;
          break;
        case 'action_left':
          this.actionLeftTemplate = item.template;
          break;
        case 'action_right':
          this.actionRightTemplate = item.template;
          break;
        case 'content':
          this.contentTemplate = item.template;
      }
    });
  }
}
