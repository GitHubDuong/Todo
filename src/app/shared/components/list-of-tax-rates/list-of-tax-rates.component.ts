import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { BaseControlValueAccessor } from '../BaseControlValueAccessor';
import { Dropdown } from 'primeng/dropdown';

@Component({
  selector: 'app-list-of-tax-rates',
  templateUrl: './list-of-tax-rates.component.html',
  styles: [``],
})
export class ListOfTaxRatesComponent extends BaseControlValueAccessor {
  @Input() taxRates: any[] = [];
  @Output() onChange = new EventEmitter();
  @Output() onClearEmitter = new EventEmitter();
  @Input() disabled = false;
  @Input() isShowFull = false;
  @ViewChild('pDropdown') pDropdown: Dropdown;

  constructor() {
    super();
  }

  onValueChange($event: any) {
    let taxCode = $event.value || '';
    let taxRate = this.taxRates.find((x) => x.code == taxCode);
    this.onChange.emit(taxRate);
  }

  clearValue = () => {
    this.value = null;
    this.pDropdown.updateSelectedOption(null);
  };

  onClear = (event: any) => {
    this.clearValue();
    this.onClearEmitter.emit(event);
  };
}
