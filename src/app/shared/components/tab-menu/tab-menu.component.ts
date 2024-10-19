import { Component, EventEmitter, forwardRef, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";
import { TabMenuItem } from "@app/models/tab-menu-item";
import { TranslationService } from "@app/service/translation.service";
import { MenuItem } from "primeng/api";

@Component({
  selector: 'app-tab-menu',
  templateUrl: './tab-menu.component.html',
  styleUrls: ['./tab-menu.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TabMenuComponent),
      multi: true
    }
  ]
})

export class TabMenuComponent implements OnInit, ControlValueAccessor, OnChanges {
  value: any;
  @Input() tabItems: TabMenuItem[] = [];
  @Input() activeIndex: number = 0;
  @Output() onTabChange: EventEmitter<any> = new EventEmitter();
  protected tabs: MenuItem[] = [];

  onChange: any = () => {};
  onTouch: any = () => {};
  activeItem: MenuItem;

  constructor(private readonly translationService: TranslationService) {}

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.tabItems) {
      this.tabs = changes.tabItems.currentValue.map((tab: TabMenuItem) => {
        return {
          label: this.translationService.translate(tab.label),
          icon: tab.icon,
          command: (_event: any) => this.updateValue(tab.value)
        }
      });
      this.activeItem = this.tabs[this.activeIndex];
    }
  }

  writeValue(value: any): void {
    this.value = value;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }

  updateValue(value: any): void {
    this.value = value;
    this.onChange(value);
    this.onTouch();
    this.onTabChange.emit(value)
  }
}
