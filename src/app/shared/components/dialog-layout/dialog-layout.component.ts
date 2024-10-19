import { AfterContentInit, Component, ContentChildren, EventEmitter, Input, OnInit, Output, QueryList, TemplateRef } from '@angular/core';
import { ActionButtonModel } from '@app/models/common/action-button.model';
import { AppTemplate } from '@app/shared/directives/app-template';

@Component({
  selector: 'app-dialog-layout',
  templateUrl: './dialog-layout.component.html',
  styleUrls: ['./dialog-layout.component.scss'],
})
export class DialogLayoutComponent implements OnInit, AfterContentInit {
  @Input() header = '';
  @Input() visible = false;
  @Input() width = '50%';
  @Input() actionList: ActionButtonModel[] = [
    {
      label: 'Hủy',
      icon: 'pi pi-times',
      class: 'p-button-outlined',
      command: () => this.onCancel(),
    },
    {
      label: 'Lưu',
      icon: 'pi pi-check',
      class: 'primary',
      command: () => this.onSave(),
    },
  ];

  @Output() save = new EventEmitter();
  @Output() cancel = new EventEmitter();
  contentTemplate: TemplateRef<any>;

  @ContentChildren(AppTemplate) templates: QueryList<AppTemplate>;

  constructor() {}

  ngOnInit(): void {
    this.contentTemplate = null;
  }

  onCancel() {
    this.cancel.emit();
  }

  onSave() {
    this.save.emit();
  }

  ngAfterContentInit(): void {
    this.templates?.forEach((item: AppTemplate) => {
      switch (item.getType()) {
        case 'content':
          this.contentTemplate = item.template;
          break;
      }
    });
  }

  onHide() {
    this.cancel.emit();
  }
}
