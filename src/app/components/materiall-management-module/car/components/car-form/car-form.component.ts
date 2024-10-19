import { Component, EventEmitter, HostListener, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import * as moment from 'moment';
import { MessageService } from 'primeng/api';
import { CarListService } from 'src/app/service/car-list.service';
import AppConstant from 'src/app/utilities/app-constants';
import AppUtil from 'src/app/utilities/app-util';

@Component({
  selector: 'app-car-form',
  templateUrl: './car-form.component.html',
  styleUrls: ['./car-form.component.scss'],
})
export class CarFormComponent implements OnInit {
  @Input('formData') formData: any = {};
  @Input('isReset') isReset: boolean = false;
  @Input('isEdit') isEdit: boolean = false;
  @Input('display') display: boolean = false;
  @Output() onCancel = new EventEmitter();
  title = '';

  carForm: FormGroup = this.fb.group({
    id: [0],
    licensePlates: [''],
    km: [0],
    capacity: [0],
    registrationAt: [''],
    insuranceAt: [''],
    note: [''],
    fileUrl: [''],
    file: [''],
  });

  selectedFile = null;
  fileName = null;

  constructor(
    private fb: FormBuilder,
    private translateService: TranslateService,
    private messageService: MessageService,
    private readonly carListService: CarListService,
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (this.isEdit && this.formData && Object.keys(this.formData).length > 0) {
      this.carForm.patchValue({
        id: this.formData.id,
        licensePlates: this.formData.licensePlates,
        km: this.formData.km,
        capacity: this.formData.capacity,
        registrationAt:
          this.formData.registrationAt && this.formData.registrationAt != 'Invalid date'
            ? moment(this.formData.registrationAt).format(AppConstant.FORMAT_DATE.VN_DATE_PIPE_SHORT_DATE)
            : '',
        insuranceAt:
          this.formData.insuranceAt && this.formData.insuranceAt != 'Invalid date'
            ? moment(this.formData.insuranceAt).format(AppConstant.FORMAT_DATE.VN_DATE_PIPE_SHORT_DATE)
            : '',
        note: this.formData.note,
        fileUrl: this.formData.fileUrl,
        file: this.formData.file,
      });
      this.fileName = this.formData.file;
    }
  }

  ngOnInit(): void {}

  onReset() {
    this.carForm.reset();
    this.fileName = null;
    this.selectedFile = null;
  }

  checkValidValidator(fieldName: string) {
    return (this.carForm.controls[fieldName].dirty || this.carForm.controls[fieldName].touched) && this.carForm.controls[fieldName].invalid //||
      ? /*(this.isInvalidForm &&
                this.carForm.controls[fieldName].invalid)*/
        'ng-invalid ng-dirty'
      : '';
  }

  onSubmit() {
    if (this.carForm.invalid) {
      this.messageService.add({
        severity: 'error',
        detail: AppUtil.translate(this.translateService, 'info.please_check_again'),
      });
      return;
    }

    let registrationAt =
      this.carForm.value.registrationAt && this.carForm.value.registrationAt != 'Invalid date'
        ? moment(AppUtil.adjustDateOffset(this.carForm.value.registrationAt)).format('YYYY-MM-DD')
        : '';
    let insuranceAt =
      this.carForm.value.insuranceAt && this.carForm.value.insuranceAt != 'Invalid date'
        ? moment(AppUtil.adjustDateOffset(this.carForm.value.insuranceAt)).format('YYYY-MM-DD')
        : '';

    const newData = this.carForm.getRawValue();
    const formData = new FormData();
    if (this.isEdit) {
      formData.append('id', newData.id);

      if (newData.file != null && newData.file.length > 0) {
        newData.file.forEach((x) => {
          formData.append('file', this.createFileObject(x));
        });
      }
    }

    formData.append('licensePlates', newData.licensePlates ?? '');
    formData.append('km', newData.km ?? 0);
    formData.append('capacity', newData.capacity ?? 0);
    formData.append('registrationAt', registrationAt ?? '');
    formData.append('insuranceAt', insuranceAt ?? '');
    formData.append('note', newData.note ?? '');
    formData.append('fileUrl', newData.fileUrl ?? '');

    // Append file attached`
    if (this.selectedFile) {
      this.selectedFile.forEach((x) => {
        formData.append('file', x);
      });
    }

    // Insert or update action
    let doAction = this.isEdit ? this.carListService.updateCar(this.carForm.value.id, formData) : this.carListService.createCar(formData);

    doAction.subscribe((res: any) => {
      this.messageService.add({
        severity: 'success',
        detail: `${this.isEdit ? 'Cập nhật' : 'Thêm mới'} thành công`,
      });
      this.onCancel.emit({});
    });
  }

  doAttachFile(event: any): void {
    if (event) {
      this.selectedFile = [];
      for (var i = 0; i <= event.target.files.length - 1; i++) {
        var file = event.target.files[i];
        this.selectedFile.push(file);
      }
    }
  }

  createFileObject(fileData: any): File {
    // Create an empty File object with the specified file name
    const file = new File([], fileData.fileUrl, {
      type: 'application/octet-stream',
    });
    // Add a 'url' property to simulate the file's URL
    Object.defineProperty(file, 'url', {
      value: fileData.fileName,
      writable: false,
      enumerable: true,
      configurable: true,
    });
    return file;
  }

  removeFile(index: any, listFile: any) {
    listFile.splice(index, 1);
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
