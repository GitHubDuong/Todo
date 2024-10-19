import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ToastService } from '@app/service/toast.service';
import { PolicePostService } from '@components/materiall-management-module/police-post/police-post.service';

@Component({
  selector: 'app-police-post-form',
  templateUrl: './police-post-form.component.html',
  styleUrls: ['./police-post-form.component.scss'],
})
export class PolicePostFormComponent implements OnChanges, OnInit {
  @Input() isDisplay = false;
  @Input() item: any;
  mForm: FormGroup;
  @Output() isDisplayChange = new EventEmitter();

  get code() {
    return this.mForm.get('code') as FormControl;
  }

  get name() {
    return this.mForm.get('name') as FormControl;
  }

  get amount() {
    return this.mForm.get('amount') as FormControl;
  }

  constructor(
    private fb: FormBuilder,
    private policePostService: PolicePostService,
    private toastService: ToastService,
  ) {
    this.mForm = this.fb.group({
      code: [''],
      name: [''],
      amount: [''],
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
      this.policePostService.create(this.mForm.value).subscribe((res) => {
        this.toastService.success('Thêm mới thành công');
        this.isDisplayChange.emit(false);
      });
    } else {
      this.policePostService.update(this.item.id, { ...this.mForm.value, id: this.item.id }).subscribe((res) => {
        this.toastService.success('Cập nhật thành công');
        this.isDisplayChange.emit(false);
      });
    }
  }
}
