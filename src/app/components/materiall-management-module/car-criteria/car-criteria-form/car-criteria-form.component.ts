import {
  Component,
  EventEmitter,
  HostListener,
  Input,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { MessageService } from 'primeng/api';
import { CarFieldService } from 'src/app/service/car-field.service';
import AppUtil from 'src/app/utilities/app-util';

@Component({
  selector: 'app-car-criteria-form',
  templateUrl: './car-criteria-form.component.html',
  styleUrls: ['./car-criteria-form.component.scss'],
})
export class CarCriteriaFormComponent implements OnInit {
  @Input('formData') formData: any = {};
  @Input('isReset') isReset: boolean = false;
  @Input('isEdit') isEdit: boolean = false;
  @Input('display') display: boolean = false;
  @Input('licensePlates') licensePlates: any[] = [];
  @Output() onCancel = new EventEmitter();
  title = '';

  carForm: FormGroup = this.fb.group({
    id: [0],
    carId: [0],
    order: [0],
    name: [''],
  });

  carIds: any;

  selectedFile = null;
  fileName = null;
  constructor(
    private fb: FormBuilder,
    private translateService: TranslateService,
    private messageService: MessageService,
    private readonly carFieldService: CarFieldService,
  ) {}

  ngOnInit(): void {}

  onReset() {
    this.carForm = this.fb.group({
      id: [0],
      carId: [0],
      order: [0],
      name: [''],
    });
  }

  getDetail(id) {
    this.carFieldService.getDetailCarField(id).subscribe((res) => {
      this.carForm.patchValue({
        id: res.id,
        carId: res.carId,
        order: res.order,
        name: res.name,
      });
    });
  }

  onSubmit() {
    if (this.carForm.invalid) {
      this.messageService.add({
        severity: 'error',
        detail: AppUtil.translate(
          this.translateService,
          'info.please_check_again',
        ),
      });
      return;
    }
    const newData = this.carForm.getRawValue();

    if (this.carIds) {
      this.carIds.forEach((x) => {
        newData.carId = x;
        // Insert or update action
        let doAction = this.isEdit
          ? this.carFieldService.updateCarField(newData.id, newData)
          : this.carFieldService.createCarField(newData);

        doAction.subscribe((res: any) => {
          this.messageService.add({
            severity: 'success',
            detail: `${this.isEdit ? 'Cập nhật' : 'Thêm mới'} thành công`,
          });
          this.onCancel.emit({});
        });
      });
    }
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
