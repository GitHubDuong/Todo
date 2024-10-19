import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import * as moment from 'moment';
import { MessageService } from 'primeng/api';
import { ShiftService } from 'src/app/service/shift.service';

@Component({
  selector: 'app-working-hours-form',
  templateUrl: './working-hours-form.component.html',
  styleUrls: ['./working-hours-form.component.scss'],
})
export class WorkingHoursFormComponent implements OnInit {
  @Input('formData') formData: any = {};
  @Input('isReset') isReset: boolean = false;
  @Input('isEdit') isEdit: boolean = false;
  @Input('display') display: boolean = false;
  @Input('listSymbol') listSymbol: any[] = [];
  @Output() onCancel = new EventEmitter();

  shiftForm: FormGroup = new FormGroup({});
  timeIn: any;
  timeOut: any;
  constructor(
    private fb: FormBuilder,
    private translateService: TranslateService,
    private messageService: MessageService,
    private readonly shiftService: ShiftService,
  ) {
    this.shiftForm = this.fb.group({
      id: [0],
      symbolId: [0],
      timeIn: [''],
      timeOut: [''],
    });
  }

  ngOnInit(): void {}

  getDetail(id) {
    this.shiftService.getShiftDetail(id).subscribe((res) => {
      this.shiftForm.patchValue(res);
      this.timeIn = this.convertTimeSpanToDate(res.timeIn);
      this.timeOut = this.convertTimeSpanToDate(res.timeOut);
    });
  }

  onReset() {
    this.shiftForm = this.fb.group({
      id: [0],
      symbolId: [0],
      timeIn: [''],
      timeOut: [''],
    });
    this.timeIn = null;
    this.timeOut = null;
  }

  checkValidValidator(fieldName: string) {
    return ((this.shiftForm.controls[fieldName].dirty ||
      this.shiftForm.controls[fieldName].touched) &&
      (this.shiftForm.controls[fieldName].value == null ||
        this.shiftForm.controls[fieldName].value == '')) ||
      this.timeIn == null ||
      this.timeOut == null
      ? 'ng-invalid ng-dirty'
      : '';
  }

  onSubmit() {
    var newData = this.shiftForm.getRawValue();

    newData.timeIn = this.createTimeSpanFromDate(this.timeIn);
    newData.timeOut = this.createTimeSpanFromDate(this.timeOut);

    if (this.isEdit) {
      this.shiftService.updateShift(newData.id, newData).subscribe((res) => {
        if (res?.code === 400) {
          this.messageService.add({
            severity: 'error',
            detail: res?.msg || '',
          });
          return;
        } else {
          this.onCancel.emit({});
          this.messageService.add({
            severity: 'success',
            detail: 'Cập nhật thành công',
          });
        }
      });
    } else {
      this.shiftService.createShift(newData).subscribe((res) => {
        if (res?.code === 400) {
          this.messageService.add({
            severity: 'error',
            detail: res?.msg || '',
          });
          return;
        } else {
          this.onCancel.emit({});
          this.messageService.add({
            severity: 'success',
            detail: 'Thêm mới thành công',
          });
        }
      });
    }
  }

  createTimeSpanFromDate(date: Date): any {
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return `${hours}:${minutes}:${seconds}`;
  }

  convertTimeSpanToDate(timeSpan: any): Date {
    const [hours, minutes, seconds] = timeSpan.split(':').map(Number);

    // Tạo một đối tượng Date với giờ, phút và giây tương ứng
    const date = new Date();
    date.setHours(hours);
    date.setMinutes(minutes);
    date.setSeconds(seconds);

    return date;
  }
}
