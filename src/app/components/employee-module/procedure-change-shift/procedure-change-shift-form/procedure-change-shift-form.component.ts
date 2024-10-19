import { ProcedureChangeShiftService } from './../../../../service/procedure-change-shift.service';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import * as moment from 'moment';
import { MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { ProcedureRequestOvertimesService } from 'src/app/service/procedure-request-overtimes.service';
import AppConstant from 'src/app/utilities/app-constants';
import AppUtil from 'src/app/utilities/app-util';

@Component({
  selector: 'app-procedure-change-shift-form',
  templateUrl: './procedure-change-shift-form.component.html',
  styleUrls: ['./procedure-change-shift-form.component.scss'],
})
export class ProcedureChangeShiftFormComponent implements OnInit {
  @Input('formData') formData: any = {};
  @Input('isReset') isReset: boolean = false;
  @Input('isEdit') isEdit: boolean = false;
  @Input('display') display: boolean = false;
  @Input('employees') employees: any[] = [];
  @Input('procedureNumber') procedureNumber: any;
  @Output() onCancel = new EventEmitter();

  form: FormGroup = new FormGroup({});

  public appConstant = AppConstant;
  public appUtil = AppUtil;
  today: Date = new Date();
  private _subscription = new Subscription();

  constructor(
    private fb: FormBuilder,
    private translateService: TranslateService,
    private messageService: MessageService,
    private readonly changeShiftService: ProcedureChangeShiftService,
  ) {
    this.form = this.fb.group({
      id: [0],
      procedureNumber: [this.procedureNumber],
      fromUserId: [0],
      toUserId: [0],
      procedureStatusId: [0],
      procedureStatusName: [''],
      fromAt: [this.today],
      toAt: [this.today],
      note: [''],
      isFinish: false,
    });
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this._subscription.unsubscribe();
  }

  getDetail(id) {
    this.changeShiftService
      .getProcedureChangeShiftDetail(id)
      .subscribe((res) => {
        this.form.patchValue({
          id: res.id,
          procedureNumber: res.procedureNumber,
          name: res.name,
          fromAt: new Date(res.fromAt),
          toAt: new Date(res.toAt),
          userId: res.userId,
          procedureStatusName: res.procedureStatusName,
          isFinish: res.isFinish,
        });
      });
  }

  onReset() {
    this.changeShiftService.getProcedureNumber().subscribe((res) => {
      this.isEdit = false;
      this.form = this.fb.group({
        id: [0],
        procedureNumber: [this.procedureNumber],
        fromUserId: [0],
        toUserId: [0],
        procedureStatusId: [0],
        procedureStatusName: [''],
        fromAt: [this.today],
        toAt: [this.today],
        note: [''],
        isFinish: false,
      });
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
    var newData = this.form.getRawValue();
    newData.fromAt = this.appUtil.formatLocalTimezone(
      moment(
        newData.fromAt && newData.fromAt !== 'Invalid date'
          ? newData.fromAt
          : new Date(),
        this.appConstant.FORMAT_DATE.VN_DATE_PIPE_SHORT_DATE,
      ).format(this.appConstant.FORMAT_DATE.T_DATE),
    );

    newData.toAt = this.appUtil.formatLocalTimezone(
      moment(
        newData.toAt && newData.toAt !== 'Invalid date'
          ? newData.toAt
          : new Date(),
        this.appConstant.FORMAT_DATE.VN_DATE_PIPE_SHORT_DATE,
      ).format(this.appConstant.FORMAT_DATE.T_DATE),
    );
    newData.procedureNumber = this.procedureNumber;

    if (this.isEdit) {
      this.changeShiftService
        .updateProcedureChangeShift(newData.id, newData)
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
      this.changeShiftService
        .createProcedureChangeShift(newData)
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
              detail: 'Thêm mới thành công',
            });
          }
        });
    }
  }

  onSubmitAndContinue() {
    var newData = this.form.getRawValue();

    newData.fromAt = this.appUtil.formatLocalTimezone(
      moment(
        newData.fromAt && newData.fromAt !== 'Invalid date'
          ? newData.fromAt
          : new Date(),
        this.appConstant.FORMAT_DATE.VN_DATE_PIPE_SHORT_DATE,
      ).format(this.appConstant.FORMAT_DATE.T_DATE),
    );

    newData.toAt = this.appUtil.formatLocalTimezone(
      moment(
        newData.toAt && newData.toAt !== 'Invalid date'
          ? newData.toAt
          : new Date(),
        this.appConstant.FORMAT_DATE.VN_DATE_PIPE_SHORT_DATE,
      ).format(this.appConstant.FORMAT_DATE.T_DATE),
    );
    newData.procedureNumber = this.procedureNumber;

    if (this.isEdit) {
      this.changeShiftService
        .updateProcedureChangeShift(newData.id, newData)
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
      this.changeShiftService
        .createProcedureChangeShift(newData)
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
              detail: 'Thêm mới thành công',
            });
          }
        });
    }
  }
}
