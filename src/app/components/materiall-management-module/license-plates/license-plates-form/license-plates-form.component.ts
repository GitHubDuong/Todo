import { Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { MessageService } from 'primeng/api';
import { CarListService } from 'src/app/service/car-list.service';
import AppUtil from 'src/app/utilities/app-util';

@Component({
  selector: 'app-license-plates-form',
  templateUrl: './license-plates-form.component.html',
  styleUrls: ['./license-plates-form.component.scss'],
  styles: [
    `
      :host ::ng-deep {
        p-inputNumber .p-inputnumber-input {
          text-align: left;
        }
      }
    `,
  ],
})
export class LicensePlatesFormComponent implements OnInit {
  @Input('formData') formData: any = {};
  @Input('isReset') isReset: boolean = false;
  @Input('isEdit') isEdit: boolean = false;
  @Input('display') display: boolean = false;
  @Output() onCancel = new EventEmitter();
  title = '';

  carForm: FormGroup = this.fb.group({
    id: [0],
    licensePlates: [''],
    note: [''],
    mileageAllowance: [],
    content: [''],
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

  ngOnInit(): void {}

  onReset() {
    this.carForm = this.fb.group({
      id: [0],
      licensePlates: [''],
      note: [''],
      mileageAllowance: [],
      content: [''],
      file: [''],
    });
  }

  getDetail(id) {
    this.carListService.getDetail(id).subscribe((res) => {
      this.carForm.patchValue({
        id: res.id,
        licensePlates: res.licensePlates,
        note: res.note,
        mileageAllowance: res.mileageAllowance,
        content: res.content,
        file: res.file,
      });
    });
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

    const formData = this.carForm.getRawValue();

    // Append file attached`

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
