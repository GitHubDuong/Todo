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
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { MessageService } from 'primeng/api';
import AppConstant from 'src/app/utilities/app-constants';
import AppData from 'src/app/utilities/app-data';
import AppUtil from 'src/app/utilities/app-util';
import { SymbolService } from 'src/app/service/symbol.service';
import * as moment from 'moment';
import appUtil from 'src/app/utilities/app-util';

@Component({
  selector: 'app-shift-form',
  templateUrl: './shift-form.component.html',
  styles: [
    `
      :host ::ng-deep {
        #phonePrefix .p-dropdown {
          width: 93px;
        }
        .p-calendar {
          width: 100%;
        }
      }
    `,
  ],
})
export class ShiftFormComponent implements OnInit, OnChanges {
  public appConstant = AppConstant;
  public appUtil = appUtil;
  @Input('formData') formData: any = {};
  @Input('isReset') isReset: boolean = false;
  @Input('isEdit') isEdit: boolean = false;
  @Input('display') display: boolean = false;
  @Output() onCancel = new EventEmitter();
  title: string = '';

  symbolForm: FormGroup = new FormGroup({});

  optionCountries = AppData.COUNTRIES;
  countryCodes: any[] = [];

  isSubmitted = false;
  isInvalidForm = false;
  failPassword: boolean = false;

  constructor(
    private fb: FormBuilder,
    private translateService: TranslateService,
    private messageService: MessageService,
    private SymbolService: SymbolService,
  ) {
    this.symbolForm = this.fb.group({
      id: [''],
      code: ['', [Validators.required]],
      name: ['', [Validators.required]],
      timeIn: [''],
      timeOut: [''],
      shiftStartAt: [''],
      shiftEndAt: [''],
      timeTotal: [''],
      checkInTimeThreshold: [''],
      checkOutTimeThreshold: [''],
      note: [''],
      status: [true],
    });
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (this.isEdit && this.formData && Object.keys(this.formData).length > 0) {
      this.title = AppUtil.translate(
        this.translateService,
        'label.shift_update',
      );
      this.symbolForm.setValue({
        id: this.formData.id,
        code: this.formData.code,
        name: this.formData.name,
        timeIn: new Date(
          moment(this.formData.timeIn).format(
            this.appConstant.FORMAT_DATE.T_DATE,
          ),
        ),
        timeOut: new Date(
          moment(this.formData.timeOut).format(
            this.appConstant.FORMAT_DATE.T_DATE,
          ),
        ),
        shiftStartAt: new Date(
          moment(this.formData.shiftStartAt).format(
            this.appConstant.FORMAT_DATE.T_DATE,
          ),
        ),
        shiftEndAt: new Date(
          moment(this.formData.shiftEndAt).format(
            this.appConstant.FORMAT_DATE.T_DATE,
          ),
        ),
        timeTotal: this.formData.timeTotal,
        note: this.formData.note,
        status: this.formData.status,
        checkInTimeThreshold: this.formData.checkInTimeThreshold,
        checkOutTimeThreshold: this.formData.checkOutTimeThreshold,
      });
    } else {
      this.title = AppUtil.translate(this.translateService, 'label.shift_add');
    }
  }

  onReset() {
    this.isInvalidForm = false;
    this.symbolForm.reset();
  }

  ngOnInit() {}

  checkValidValidator(fieldName: string) {
    return ((this.symbolForm.controls[fieldName].dirty ||
      this.symbolForm.controls[fieldName].touched) &&
      this.symbolForm.controls[fieldName].invalid) ||
      (this.isInvalidForm && this.symbolForm.controls[fieldName].invalid)
      ? 'ng-invalid ng-dirty'
      : '';
  }

  checkValidMultiValidator(fieldNames: string[]) {
    for (let i = 0; i < fieldNames.length; i++) {
      if (
        ((this.symbolForm.controls[fieldNames[i]].dirty ||
          this.symbolForm.controls[fieldNames[i]].touched) &&
          this.symbolForm.controls[fieldNames[i]].invalid) ||
        (this.isInvalidForm && this.symbolForm.controls[fieldNames[i]].invalid)
      ) {
        return true;
      }
    }
    return false;
  }

  onSubmit() {
    this.isSubmitted = true;
    this.isInvalidForm = false;
    if (this.symbolForm.invalid) {
      this.messageService.add({
        severity: 'error',
        detail: AppUtil.translate(
          this.translateService,
          'info.please_check_again',
        ),
      });
      this.isInvalidForm = true;
      this.isSubmitted = false;
      return;
    }

    const shiftStartAt = moment(this.symbolForm.value.shiftStartAt).format(
      this.appConstant.FORMAT_DATE.T_DATE,
    )

    const shiftEndAt = moment(this.symbolForm.value.shiftEndAt).format(
      this.appConstant.FORMAT_DATE.T_DATE,
    )

    console.log(shiftStartAt, shiftEndAt)

    let requestBody = this.cleanObject(AppUtil.cleanObject(this.symbolForm.value));
    this.onCancel.emit({});

    // format date keep current time zone on local machine
    requestBody = {
      ...requestBody,
      shiftStartAt,
      shiftEndAt,
    }

    if (this.isEdit) {
      this.SymbolService.updateSymbol(requestBody, this.formData.id).subscribe(
        (res) => {
          this.onCancel.emit({});
        },
      );
    } else {
      this.SymbolService.createSymbol(requestBody).subscribe((res) => {
        this.onCancel.emit({});
      });
    }
  }

  cleanObject(data) {
    let newData = Object.assign({}, data);
    if (!(newData.id > 0)) {
      newData.id = 0;
    }
    newData.timeIn =
      this.appUtil.formatLocalTimezone(
        moment(newData.timeIn).format(this.appConstant.FORMAT_DATE.T_DATE),
      ) || null;
    newData.timeOut =
      this.appUtil.formatLocalTimezone(
        moment(newData.timeOut).format(this.appConstant.FORMAT_DATE.T_DATE),
      ) || null;

    return newData;
  }

  onBack() {
    this.onCancel.emit({});
  }
  @HostListener('document:keydown', ['$event'])
  async handleKeyboardEvent(event: KeyboardEvent) {
    switch (event.key) {
      case 'F8':
        event.preventDefault();
        await this.onSubmit();
        break;
      case 'F6':
        event.preventDefault();
        this.onCancel.emit({});
        break;
    }
  }
}
