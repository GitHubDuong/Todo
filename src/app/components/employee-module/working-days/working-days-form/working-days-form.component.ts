import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import * as moment from 'moment';
import { MessageService } from 'primeng/api';
import { WorkingDaysService } from 'src/app/service/working-days.service';
import AppConstant from 'src/app/utilities/app-constants';
import AppUtil from 'src/app/utilities/app-util';

@Component({
  selector: 'app-working-days-form',
  templateUrl: './working-days-form.component.html',
  styleUrls: ['./working-days-form.component.scss'],
})
export class WorkingDaysFormComponent implements OnInit {
  @Input('formData') formData: any = {};
  @Input('isReset') isReset: boolean = false;
  @Input('isEdit') isEdit: boolean = false;
  @Input('display') display: boolean = false;
  @Input('years') years: any[] = [];
  @Output() onCancel = new EventEmitter();

  form: FormGroup = new FormGroup({});

  days = [
    { val: 'Thứ hai', key: 'monday' },
    { val: 'Thứ ba', key: 'tuesday' },
    { val: 'Thứ tư', key: 'wednesday' },
    { val: 'Thứ năm', key: 'thursday' },
    { val: 'Thứ sáu', key: 'friday' },
    { val: 'Thứ bảy', key: 'saturday' },
    { val: 'Chủ nhật', key: 'sunday' },
  ];
  year = new Date().getFullYear();
  public appConstant = AppConstant;
  public appUtil = AppUtil;
  constructor(
    private fb: FormBuilder,
    private translateService: TranslateService,
    private messageService: MessageService,
    private readonly workingDaysService: WorkingDaysService,
  ) {
    this.form = this.fb.group({
      id: [0],
      days: [[]],

      holidays: [[]],
      year: 0,
    });
  }

  ngOnInit(): void {}

  getDetail(id) {
    this.workingDaysService.getWorkingDayDetail(id).subscribe((res) => {
      var lstDays = [];
      if (res.holidays.length > 0) {
        res.holidays.forEach((day) => {
          lstDays.push(new Date(day));
        });
      }
      this.form.patchValue({
        id: res.id ?? 0,
        days: res.days,
        holidays: lstDays,
        year: res.year,
      });
    });
  }

  onReset() {
    this.isEdit = false;
    this.form = this.fb.group({
      id: [0],
      days: [[]],
      holidays: [[]],
      year: 0,
    });
  }

  checkValidValidator(fieldName: string) {
    return (this.form.controls[fieldName].dirty ||
      this.form.controls[fieldName].touched) &&
      (this.form.controls[fieldName].value == null ||
        this.form.controls[fieldName].value == '')
      ? 'ng-invalid ng-dirty'
      : '';
  }

  onSubmit() {
    var lstDays = [];
    var newData = this.form.getRawValue();
    newData.holidays.forEach((day) => {
      lstDays.push(
        this.appUtil.formatLocalTimezone(
          moment(
            day && day !== 'Invalid date' ? day : new Date(),
            this.appConstant.FORMAT_DATE.VN_DATE_PIPE_SHORT_DATE,
          ).format(this.appConstant.FORMAT_DATE.T_DATE),
        ),
      );
    });

    newData.holidays = lstDays;
    if (this.isEdit) {
      this.workingDaysService
        .updateWorkingDay(newData.id, newData)
        .subscribe((res) => {
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
      this.workingDaysService.createWorkingDay(newData).subscribe((res) => {
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

  onSubmitAndContinue() {
    var lstDays = [];
    var newData = this.form.getRawValue();
    newData.holidays.forEach((day) => {
      lstDays.push(
        this.appUtil.formatLocalTimezone(
          moment(
            day && day !== 'Invalid date' ? day : new Date(),
            this.appConstant.FORMAT_DATE.VN_DATE_PIPE_SHORT_DATE,
          ).format(this.appConstant.FORMAT_DATE.T_DATE),
        ),
      );
    });

    newData.holidays = lstDays;
    if (this.isEdit) {
      this.workingDaysService
        .updateWorkingDay(newData.id, newData)
        .subscribe((res) => {
          if (res?.code === 400) {
            this.messageService.add({
              severity: 'error',
              detail: res?.msg || '',
            });
            return;
          } else {
            this.onReset();
            this.messageService.add({
              severity: 'success',
              detail: 'Cập nhật thành công',
            });
          }
        });
    } else {
      this.workingDaysService.createWorkingDay(newData).subscribe((res) => {
        if (res?.code === 400) {
          this.messageService.add({
            severity: 'error',
            detail: res?.msg || '',
          });
          return;
        } else {
          this.onReset();
          this.messageService.add({
            severity: 'success',
            detail: 'Thêm mới thành công',
          });
        }
      });
    }
  }
}
