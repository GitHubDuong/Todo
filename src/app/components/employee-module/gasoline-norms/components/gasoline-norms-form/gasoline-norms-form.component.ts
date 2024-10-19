import { Component, EventEmitter, HostListener, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DateTimeHelper } from '@app/shared/helper/date-time.helper';
import { TranslateService } from '@ngx-translate/core';
import { MessageService } from 'primeng/api';
import { CarListService } from 'src/app/service/car-list.service';
import { GasolineNormsService } from 'src/app/service/gasoline-norms.service';
import { UserService } from 'src/app/service/user.service';
import AppUtil from 'src/app/utilities/app-util';

@Component({
  selector: 'app-gasoline-norms-form',
  templateUrl: './gasoline-norms-form.component.html',
  styleUrls: ['./gasoline-norms-form.component.scss'],
})
export class GasolineNormsFormComponent implements OnInit {
  @Input('formData') formData: any = {};
  @Input('isReset') isReset: boolean = false;
  @Input('isEdit') isEdit: boolean = false;
  @Input('display') display: boolean = false;
  @Input('employees') employees: any = [];
  @Input('cars') cars: any = [];
  @Input() routerList: any[] = [];
  @Output() onCancel = new EventEmitter();
  title = '';

  gasForm: FormGroup = this.fb.group({
    id: [0],
    date: [''],
    userId: [0],
    carId: [0],
    petroPrice: [0],
    kmFrom: [0],
    kmTo: [0],
    locationFrom: [''],
    locationTo: [''],
    note: [''],
    advanceAmount: [0],
    roadRouteId: [],
  });

  selectedFile = null;

  constructor(
    private fb: FormBuilder,
    private translateService: TranslateService,
    private messageService: MessageService,
    private readonly userService: UserService,
    private readonly gasolineNormService: GasolineNormsService,
    private readonly carListService: CarListService,
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    this.getAllUserActive();
    this.getAllCar();
    if (this.isEdit && this.formData && Object.keys(this.formData).length > 0) {
      this.gasForm.patchValue({
        id: this.formData.id,
        date: new Date(this.formData.date),
        userId: this.employees.filter((data) => {
          return this.formData.userId == data.id;
        })[0],
        carId: this.cars.filter((data) => {
          return this.formData.carId == data.id;
        })[0],
        petroPrice: this.formData.petroPrice,
        kmFrom: this.formData.kmFrom,
        kmTo: this.formData.kmTo,
        locationFrom: this.formData.locationFrom,
        locationTo: this.formData.locationTo,
        note: this.formData.note,
        advanceAmount: this.formData.advanceAmount,
        roadRouteId: this.formData.roadRouteId,
      });
    }
  }

  ngOnInit(): void {}

  getAllUserActive() {
    this.userService.getAllUserActive().subscribe((res: any) => {
      this.employees = res.data;
    });
  }

  getAllCar() {
    this.carListService.getListCars().subscribe((res) => {
      this.cars = res.data;
    });
  }

  onReset() {
    this.gasForm.reset();
  }

  checkValidValidator(fieldName: string) {
    return (this.gasForm.controls[fieldName].dirty || this.gasForm.controls[fieldName].touched) && this.gasForm.controls[fieldName].invalid //||
      ? /*(this.isInvalidForm &&
                this.gasForm.controls[fieldName].invalid)*/
        'ng-invalid ng-dirty'
      : '';
  }

  onSubmit() {
    if (this.gasForm.invalid) {
      this.messageService.add({
        severity: 'error',
        detail: AppUtil.translate(this.translateService, 'info.please_check_again'),
      });
      return;
    }

    let date = this.gasForm.value.date ? DateTimeHelper.toIOSString(this.gasForm.value.date) : '';

    const newData = this.gasForm.getRawValue();
    newData.userId = this.gasForm.value.userId.id;
    newData.carId = this.gasForm.value.carId.id;
    newData.licensePlates = this.gasForm.value.licensePlates || '';
    newData.petroPrice = Number(this.gasForm.value.petroPrice) ?? 0;
    newData.kmFrom = Number(this.gasForm.value.kmFrom) ?? 0;
    newData.kmTo = Number(this.gasForm.value.kmTo) ?? 0;
    newData.advanceAmount = Number(this.gasForm.value.advanceAmount) ?? 0;
    newData.note = this.gasForm.value.note || '';
    newData.locationFrom = this.gasForm.value.locationFrom || '';
    newData.locationTo = this.gasForm.value.locationTo || '';
    newData.date = date;
    newData.roadRouteId = this.gasForm.value.roadRouteId;
    if (!this.isEdit) {
      delete newData.id;
    }
    // Insert or update action
    let doAction = this.isEdit
      ? this.gasolineNormService.updatePetrolConsumptions(this.gasForm.value.id, newData)
      : this.gasolineNormService.createPetroConsumptions(newData);

    doAction.subscribe((res: any) => {
      this.messageService.add({
        severity: 'success',
        detail: `${this.isEdit ? 'Cập nhật' : 'Thêm mới'} thành công`,
      });
      this.onCancel.emit({});
    });
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
