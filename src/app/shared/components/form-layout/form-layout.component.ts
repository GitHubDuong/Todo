import { AfterContentInit, Component, ContentChildren, EventEmitter, Input, Output, QueryList, TemplateRef } from '@angular/core';
import { ActionButtonModel } from '@app/models/common/action-button.model';
import { AppTemplate } from '@app/shared/directives/app-template';

@Component({
  selector: 'app-form-layout',
  templateUrl: './form-layout.component.html',
  styleUrls: ['./form-layout.component.scss'],
})
export class FormLayoutComponent implements AfterContentInit {
  @Input() isDisplay = false;
  @Input() header = '';
  @Input() backLabel = 'button.backF6';
  @Input() saveLabel = 'button.saveF8';
  @Input() actionList: ActionButtonModel[] = [
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
  @Output() back = new EventEmitter();
  @Output() save = new EventEmitter();

  @ContentChildren(AppTemplate) templates?: QueryList<any>;
  bodyTemplate: TemplateRef<any>;

  constructor() {
    this.bodyTemplate = null;
  }

  ngOnInit(): void {}

  onBack() {
    this.back.emit();
  }

  onSave() {
    this.save.emit();
  }

  ngAfterContentInit(): void {
    this.templates?.forEach((item: AppTemplate) => {
      switch (item.getType()) {
        case 'body':
          this.bodyTemplate = item.template;
          break;
      }
    });
  }
}
