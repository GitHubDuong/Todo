import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ToastService } from '@app/service/toast.service';
import { SaleDiscountService } from '@components/sell-module/sale-discount/sale-discount.service';

@Component({
  selector: 'app-sale-discount-form',
  templateUrl: './sale-discount-form.component.html',
  styleUrls: ['./sale-discount-form.component.scss'],
})
export class SaleDiscountFormComponent implements OnInit, OnChanges {
  @Input() isDisplay = false;
  @Input() item: any;
  @Input() positionList: any[] = [];
  mForm: FormGroup;
  @Output() isDisplayChange = new EventEmitter();

  get positionDetailId() {
    return this.mForm.get('positionDetailId') as FormControl;
  }

  get discountReceivedMonth() {
    return this.mForm.get('discountReceivedMonth') as FormControl;
  }

  get discountReceivedYear() {
    return this.mForm.get('discountReceivedYear') as FormControl;
  }

  get percentAdvanceDiscountMonth() {
    return this.mForm.get('percentAdvanceDiscountMonth') as FormControl;
  }

  get note() {
    return this.mForm.get('note') as FormControl;
  }

  constructor(
    private fb: FormBuilder,
    private saleDiscountService: SaleDiscountService,
    private toastService: ToastService,
  ) {
    this.mForm = this.fb.group({
      positionDetailId: [''],
      discountReceivedMonth: [''],
      discountReceivedYear: [''],
      percentAdvanceDiscountMonth: [''],
      note: [''],
    });
  }

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges): void {
    const { item } = changes;
    if (item && item.currentValue) {
      this.mForm.patchValue(item.currentValue);
    }
  }

  onBack() {
    this.isDisplayChange.emit(false);
  }

  onSave() {
    if (!this.item) {
      this.saleDiscountService.create(this.mForm.value).subscribe((res) => {
        this.toastService.success('Thêm mới thành công');
        this.isDisplayChange.emit(false);
      });
    } else {
      this.saleDiscountService.update(this.item.id, { ...this.mForm.value, id: this.item.id }).subscribe((res) => {
        this.toastService.success('Cập nhật thành công');
        this.isDisplayChange.emit(false);
      });
    }
  }
}
