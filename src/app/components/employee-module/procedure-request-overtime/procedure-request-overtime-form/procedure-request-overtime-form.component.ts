import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AuthService } from '@app/service/auth.service';
import { TranslateService } from '@ngx-translate/core';
import * as moment from 'moment';
import { MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { ProcedureRequestOvertimesService } from 'src/app/service/procedure-request-overtimes.service';
import AppConstant from 'src/app/utilities/app-constants';
import AppUtil from 'src/app/utilities/app-util';

@Component({
  selector: 'app-procedure-request-overtime-form',
  templateUrl: './procedure-request-overtime-form.component.html',
  styleUrls: ['./procedure-request-overtime-form.component.scss'],
})
export class ProcedureRequestOvertimeFormComponent implements OnInit, OnDestroy {
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

  private _subscription = new Subscription();

  constructor(
    private fb: FormBuilder,
    private translateService: TranslateService,
    private messageService: MessageService,
    private authService: AuthService,
    private readonly procedureRequestOvertimeService: ProcedureRequestOvertimesService,
  ) {
    this.form = this.fb.group({
      id: [0],
      procedureNumber: [this.procedureNumber],
      name: [''],
      fromAt: [new Date()],
      toAt: [new Date()],
      userIds: [this.authService?.user?.id ? [this.authService?.user?.id] : []],
      procedureStatusName: [''],
      isFinish: false,
      coefficient: [1],
    });
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this._subscription.unsubscribe();
  }

  getDetail(id) {
    this.procedureRequestOvertimeService.getProcedureRequestOvertimesDetail(id).subscribe((res) => {
      this.form.patchValue({
        id: res.id,
        procedureNumber: res.procedureNumber,
        name: res.name,
        fromAt: new Date(res.fromAt),
        toAt: new Date(res.toAt),
        userIds: res.userIds,
        procedureStatusName: res.procedureStatusName,
        isFinish: res.isFinish,
        coefficient: res.coefficient,
      });
    });
  }

  onReset() {
    this.procedureRequestOvertimeService.getProcedureNumber().subscribe((res) => {
      this.isEdit = false;
      this.form = this.fb.group({
        id: [0],
        procedureNumber: [this.procedureNumber],
        name: [''],
        fromAt: [new Date()],
        toAt: [new Date()],
        userIds: [this.authService?.user?.id ? [this.authService?.user?.id] : []],
        procedureStatusName: [''],
        isFinish: false,
        coefficient: [1],
      });
    });
  }

  checkValidValidator(fieldName: string) {
    return (this.form.controls[fieldName].dirty || this.form.controls[fieldName].touched) &&
      (this.form.controls[fieldName].value == null || this.form.controls[fieldName].value == '')
      ? 'ng-invalid ng-dirty'
      : '';
  }

  onSubmit() {
    var newData = this.form.getRawValue();
    newData.fromAt = this.appUtil.formatLocalTimezone(
      moment(
        newData.fromAt && newData.fromAt !== 'Invalid date' ? newData.fromAt : new Date(),
        this.appConstant.FORMAT_DATE.VN_DATE_PIPE_SHORT_DATE,
      ).format(this.appConstant.FORMAT_DATE.T_DATE),
    );

    newData.toAt = this.appUtil.formatLocalTimezone(
      moment(
        newData.toAt && newData.toAt !== 'Invalid date' ? newData.toAt : new Date(),
        this.appConstant.FORMAT_DATE.VN_DATE_PIPE_SHORT_DATE,
      ).format(this.appConstant.FORMAT_DATE.T_DATE),
    );
    newData.procedureNumber = this.procedureNumber;

    if (this.isEdit) {
      this.procedureRequestOvertimeService.updateProcedureRequestOvertimes(newData.id, newData).subscribe((res) => {
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
      this.procedureRequestOvertimeService.createProcedureRequestOvertimes(newData).subscribe((res) => {
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
        newData.fromAt && newData.fromAt !== 'Invalid date' ? newData.fromAt : new Date(),
        this.appConstant.FORMAT_DATE.VN_DATE_PIPE_SHORT_DATE,
      ).format(this.appConstant.FORMAT_DATE.T_DATE),
    );

    newData.toAt = this.appUtil.formatLocalTimezone(
      moment(
        newData.toAt && newData.toAt !== 'Invalid date' ? newData.toAt : new Date(),
        this.appConstant.FORMAT_DATE.VN_DATE_PIPE_SHORT_DATE,
      ).format(this.appConstant.FORMAT_DATE.T_DATE),
    );
    newData.procedureNumber = this.procedureNumber;

    if (this.isEdit) {
      this.procedureRequestOvertimeService.updateProcedureRequestOvertimes(newData.id, newData).subscribe((res) => {
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
      this.procedureRequestOvertimeService.createProcedureRequestOvertimes(newData).subscribe((res) => {
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
