import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ToastService } from '@app/service/toast.service';
import { SalaryTypeService } from '@components/employee-module/salary-type/salary-type.service';

@Component({
  selector: 'app-salary-type-form',
  templateUrl: './salary-type-form.component.html',
  styleUrls: ['./salary-type-form.component.scss'],
})
export class SalaryTypeFormComponent implements OnInit, OnChanges {
  @Input() isDisplay = false;
  @Input() item: any;
  mForm: FormGroup;
  @Output() isDisplayChange = new EventEmitter();

  get name() {
    return this.mForm.get('name') as FormControl;
  }

  get code() {
    return this.mForm.get('code') as FormControl;
  }

  get amountSpent() {
    return this.mForm.get('amountSpent') as FormControl;
  }

  get amountSpentMonthly() {
    return this.mForm.get('amountSpentMonthly') as FormControl;
  }

  get amountAtTheEndYear() {
    return this.mForm.get('amountAtTheEndYear') as FormControl;
  }

  get note() {
    return this.mForm.get('note') as FormControl;
  }

  constructor(
    private fb: FormBuilder,
    private salaryTypeService: SalaryTypeService,
    private toastService: ToastService,
  ) {
    this.mForm = this.fb.group({
      name: [''],
      code: [''],
      amountSpent: [''],
      amountSpentMonthly: [''],
      amountAtTheEndYear: [''],
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
      this.salaryTypeService.create(this.mForm.value).subscribe((res) => {
        this.toastService.success('Thêm mới thành công');
        this.isDisplayChange.emit(false);
      });
    } else {
      this.salaryTypeService.update(this.item.id, { ...this.mForm.value, id: this.item.id }).subscribe((res) => {
        this.toastService.success('Cập nhật thành công');
        this.isDisplayChange.emit(false);
      });
    }
  }
}
