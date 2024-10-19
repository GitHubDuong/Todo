import {
  Component,
  EventEmitter,
  HostListener,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { FurloughService } from '../../../../service/furlough.service';
import { MessageService } from 'primeng/api';
import AppUtil from '../../../../utilities/app-util';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from '../../../../service/auth.service';
import * as moment from 'moment';
import AppConstant from '../../../../utilities/app-constants';

@Component({
  selector: 'app-furlough-form',
  templateUrl: './furlough-form.component.html',
  styleUrls: [],
})
export class FurloughFormComponent implements OnInit, OnChanges {
  @Input() display = false;
  @Input() formData;
  @Output() onCancel = new EventEmitter();

  furloughForm = new FormGroup({
    procedureNumber: new FormControl(null, { nonNullable: true }),
    fromDate: new FormControl(new Date(), {
      nonNullable: true,
      validators: Validators.compose([
        Validators.required,
        this.maxDateValidator(),
      ]),
    }),
    toDate: new FormControl(null, {
      nonNullable: true,
      validators: Validators.compose([
        Validators.required,
        this.minDateValidator(),
      ]),
    }),
    isLicensed: new FormControl(true, { nonNullable: true }),
    reason: new FormControl(null, { nonNullable: true }),
    name: new FormControl(null, { nonNullable: true }),
  });

  get f() {
    return this.furloughForm.controls;
  }

  constructor(
    private readonly furloughService: FurloughService,
    private readonly messageService: MessageService,
    private readonly translateService: TranslateService,
    private readonly authService: AuthService,
  ) {}

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges): void {
    const { formData } = changes;
    if (formData) {
      this.formData?.id
        ? this.furloughForm.patchValue({
            procedureNumber: this.formData.procedureNumber,
            fromDate: this.formData.fromdt
              ? moment.utc(this.formData.fromdt).toDate()
              : null,
            toDate: this.formData.todt
              ? moment.utc(this.formData.todt).toDate()
              : null,
            isLicensed: this.formData.isLicensed,
            reason: this.formData.reason,
            name: this.formData.name,
          })
        : this.furloughForm.reset({ fromDate: new Date() });
    }
  }

  minDateValidator() {
    return (control: AbstractControl): { [key: string]: any } => {
      const value = control.value;
      const minControl = this.furloughForm?.controls.fromDate;
      if (!value || !minControl?.value) {
        return null;
      }

      const minDate = new Date(minControl.value);
      minDate.setSeconds(0);
      minDate.setMilliseconds(0);

      const currentDate = new Date(value);
      currentDate.setSeconds(0);
      currentDate.setMilliseconds(0);

      if (minDate.getTime() > currentDate.getTime()) {
        return { minDate: true };
      }
      return null;
    };
  }

  maxDateValidator() {
    return (control: AbstractControl): { [key: string]: any } => {
      const value = control.value;
      const maxControl = this.furloughForm?.controls.toDate;
      if (!value || !maxControl?.value) {
        return null;
      }

      const maxDate = new Date(maxControl.value);
      maxDate.setSeconds(0);
      maxDate.setMilliseconds(0);

      const currentDate = new Date(value);
      currentDate.setSeconds(0);
      currentDate.setMilliseconds(0);

      if (maxDate.getTime() < currentDate.getTime()) {
        return { maxDate: true };
      }
      return null;
    };
  }

  onDelete(): void {
    this.furloughService.deleteFurlough(this.formData?.id).subscribe(
      (res) => {
        this.messageService.add({
          severity: 'success',
          detail: AppUtil.translate(this.translateService, 'success.delete'),
        });
        this.onCancel.emit({});
      },
      (err) => {
        this.messageService.add({
          severity: 'error',
          detail: AppUtil.translate(this.translateService, 'error.0'),
        });
      },
    );
  }

  onSave(): void {
    if (this.furloughForm.invalid) {
      for (const control of Object.values(this.f)) {
        control.markAsDirty();
        control.markAsTouched();
        control.updateValueAndValidity();
      }
      return;
    }
    const request = {
      id: this.formData?.id || 0,
      procedureNumber: this.furloughForm.value.procedureNumber,
      name: this.furloughForm.value.name,
      fromdt: this.furloughForm.value.fromDate,
      todt: this.furloughForm.value.toDate,
      isLicensed: this.furloughForm.value.isLicensed,
      p_ProcedureStatusId: this.formData?.pProcedureStatusId || 0,
      p_ProcedureStatusName: this.formData?.pProcedureStatusName || '',
      userCreated: this.formData?.id
        ? this.formData?.userCreated
        : this.authService.user?.id,
      userUpdated: this.authService.user?.id || this.formData?.userUpdated,
      reason: this.furloughForm.value.reason,
    };
    if (this.formData?.id)
      this.furloughService.updateFurlough(request, this.formData.id).subscribe(
        (res) => {
          this.messageService.add({
            severity: 'success',
            detail: AppUtil.translate(this.translateService, 'success.update'),
          });
          this.onCancel.emit({});
        },
        (err) => {
          this.messageService.add({
            severity: 'error',
            detail: AppUtil.translate(this.translateService, 'error.0'),
          });
        },
      );
    else
      this.furloughService.createFurlough(request).subscribe(
        (res) => {
          this.messageService.add({
            severity: 'success',
            detail: AppUtil.translate(this.translateService, 'success.create'),
          });
          this.onCancel.emit({});
        },
        (err) => {
          this.messageService.add({
            severity: 'error',
            detail: AppUtil.translate(this.translateService, 'error.0'),
          });
        },
      );
  }

  onForward(): void {}
  @HostListener('document:keydown', ['$event'])
  async handleKeyboardEvent(event: KeyboardEvent) {
    switch (event.key) {
      case 'F8':
        event.preventDefault();
        await this.onSave();
        break;
      case 'F6':
        event.preventDefault();
        this.onCancel.emit({});
        break;
      case 'F11':
        event.preventDefault();
        this.onDelete();
        break;
      case 'F10':
        event.preventDefault();
        this.onForward();
        break;
    }
  }

  protected readonly AppConstant = AppConstant;
}
