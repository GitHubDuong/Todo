import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NotificationService } from '@app/service/notification.service';
import { PlanningProduceProductsService } from '@app/service/planning-produce-products.service';
import { environment } from '@env/environment';
import AppUtil from '@utilities/app-util';

@Component({
  selector: 'app-car-delivery-form',
  templateUrl: './car-delivery-form.component.html',
  styleUrls: ['./car-delivery-form.component.scss'],
})
export class CarDeliveryFormComponent implements OnInit {
  protected car: any = {};
  private _visible: boolean;
  private selectedImages: any = [];
  serverImg = environment.serverURLImage + '/';
  showImageDetail = false;
  selectedImage: any;

  @Input()
  set visible(value: boolean) {
    this._visible = value;
    this.visibleChange.emit(value);
    if (!value) {
      this.form.reset();
      this.isSubmit = false;
    }
  }

  get visible(): boolean {
    return this._visible;
  }

  @Output() visibleChange: EventEmitter<boolean> = new EventEmitter();
  @Output() onSuccess: EventEmitter<boolean> = new EventEmitter();
  form: FormGroup;
  isSubmit: boolean = false;
  planningProduceProductId: number = 0;
  fileLink: any[] = [];

  constructor(
    private planningProduceProductsService: PlanningProduceProductsService,
    private notificationService: NotificationService,
  ) {}

  ngOnInit(): void {}

  onSubmit() {
    this.isSubmit = true;
    if (this.form.invalid) {
      this.notificationService.warning('warning.invalid_data');
      return;
    }
    const request = this.form.value;
    this.planningProduceProductsService.updateCarDelivery(request, this.planningProduceProductId).subscribe((res) => {
      this.notificationService.success('update.success');
      this.visible = false;
      this.onSuccess.emit(true);
    });
  }

  edit(carId: number, carName: string, planningProduceProductId: number) {
    this.planningProduceProductId = planningProduceProductId;
    this.planningProduceProductsService.getCarDelivery(carId, carName, planningProduceProductId).subscribe((res: any) => {
      this.initForm(res);
      this.visible = true;
    });
  }

  initForm(data: any) {
    this.form = new FormGroup({
      id: new FormControl(data?.id ?? 0, Validators.required),
      carId: new FormControl(data?.carId),
      carName: new FormControl(data?.carName, Validators.required),
      licensePlates: new FormControl(data?.licensePlates || data?.carName),
      driver: new FormControl(data?.driver),
      phoneNumber: new FormControl(data?.phoneNumber),
      note: new FormControl(data?.note),
      fileLinks: new FormControl(data?.fileLinks),
    });
    if (data?.fileLinks) {
      this.fileLink = data?.fileLinks;
    }
  }

  checkInvalidField(field: string): boolean {
    return this.isSubmit && this.form.controls[field].errors?.required;
  }

  onRemoveImages() {
    this.fileLink = this.fileLink.filter((x) => !this.selectedImages.includes(x.fileName));
    this.form.patchValue({ fileLinks: this.fileLink });
  }

  doAttachFile(event: any): void {
    if (this.fileLink.length >= 6 || event.target?.files.length > 6 || event.target?.files.length + this.fileLink.length > 6) {
      return;
    }

    for (let i = 0; i < event.target?.files.length; i++) {
      const formData = new FormData();
      formData.append('file', event.target?.files[i]);
      this.planningProduceProductsService.uploadFile(formData).subscribe((res: any) => {
        if (this.fileLink.length < 6) {
          this.fileLink.push(res);
        }
      });
    }
    this.form.patchValue({ fileLinks: this.fileLink });
  }

  isImageExtension(fileName: string): boolean {
    return AppUtil.isImageFile(fileName);
  }

  onImageClick(url: any) {
    const fileName = url.fileName;
    // remove or add class name style_prev_kit (css hover)
    let image = document.getElementById(fileName);
    let isUsingClass = image.classList.contains('style_prev_kit');
    if (isUsingClass) {
      image.classList.remove('style_prev_kit');
      image.classList.add('opacity-custom');
      this.selectedImages = [...this.selectedImages, fileName];
    } else {
      image.classList.add('style_prev_kit');
      image.classList.remove('opacity-custom');
      this.selectedImages = this.selectedImages.filter((x) => x !== fileName);
    }
    this.showImageDetail = true;
    this.selectedImage = url;
  }
}
