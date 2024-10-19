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
import AppConstant from '../../../../utilities/app-constants';
import AppUtil from '../../../../utilities/app-util';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { OfficeService } from '../../../../service/office.service';
import { Stationerie } from '../../../../models/office';
import { MessageService } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-office-add-form',
  templateUrl: './office-add-form.component.html',
})
export class OfficeAddFormComponent implements OnInit, OnChanges {
  public appConstant = AppConstant;
  public appUtil = AppUtil;
  @Input('isReset') isReset: boolean = false;
  @Input('isEdit') isEdit: boolean = false;
  @Input('display') display: boolean = false;
  @Input('hiddenTitle') hiddenTitle: boolean = false;
  @Input('type') type = 0;
  @Output() onCancel = new EventEmitter();
  @Input() formData;

  isInvalidForm = false;
  officeAddForm: FormGroup = new FormGroup({});
  isSubmitted = false;
  officeAddFormModel: Stationerie = {};

  constructor(
    private fb: FormBuilder,
    private officeService: OfficeService,
    private readonly messageService: MessageService,
    private translateService: TranslateService,
  ) {
    this.officeAddForm = this.fb.group({
      id: [''],
      name: ['', [Validators.required]],
      code: ['', [Validators.required]],
      unit: ['', [Validators.required]],
    });
  }
  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes && changes.formData && this.formData?.id) {
      this.officeAddForm = new FormGroup({
        id: new FormControl(this.formData.id),
        name: new FormControl(this.formData.name),
        code: new FormControl(this.formData.code),
        unit: new FormControl(this.formData.unit),
      });
      this.isEdit = true;
    }
  }

  onReset() {
    this.isInvalidForm = false;
    this.officeAddForm.reset();
  }
  checkValidValidator(fieldName: string) {
    return ((this.officeAddForm.controls[fieldName].dirty ||
      this.officeAddForm.controls[fieldName].touched) &&
      this.officeAddForm.controls[fieldName].invalid) ||
      (this.isInvalidForm && this.officeAddForm.controls[fieldName].invalid)
      ? 'ng-invalid ng-dirty'
      : '';
  }
  onSubmit() {
    this.isSubmitted = true;
    if (this.officeAddForm.invalid) {
      return;
    }
    this.isInvalidForm = false;
    let newData = this.cleanObject(
      AppUtil.cleanObject(this.officeAddForm.value),
    );
    if (this.isEdit) {
      this.officeService.saveSationerie(newData).subscribe((res) => {
        if (res) {
          this.messageService.add({
            severity: 'error',
            detail: AppUtil.translate(this.translateService, 'error.update'),
          });
        } else {
          this.messageService.add({
            severity: 'success',
            detail: AppUtil.translate(this.translateService, 'success.update'),
          });
        }
        this.onCancel.emit({});
      });
    } else {
      this.officeService.addStationerie(newData).subscribe((res) => {
        if (res) {
          this.messageService.add({
            severity: 'error',
            detail: AppUtil.translate(this.translateService, 'error.create'),
          });
        } else {
          this.messageService.add({
            severity: 'success',
            detail: AppUtil.translate(this.translateService, 'success.create'),
          });
          this.onCancel.emit({});
        }
        this.onCancel.emit({});
      });
    }
  }

  cleanObject(data) {
    let newData = Object.assign({}, data);
    if (!(newData.id > 0)) {
      newData.id = 0;
    }
    return newData;
  }

  onForward(): void {}
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
