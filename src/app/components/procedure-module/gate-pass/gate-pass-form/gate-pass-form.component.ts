import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { AuthService } from '@app/service/auth.service';
import { CarListService } from '@app/service/car-list.service';
import { NotificationService } from '@app/service/notification.service';
import { GatePassService } from '@app/service/produces/gate-pass.service';
import { BaseDetailComponent } from '@app/shared/components/base-detail.component';
import { environment } from '@env/environment';
import AppUtil from '@utilities/app-util';

@Component({
  selector: 'app-gate-pass-form',
  templateUrl: './gate-pass-form.component.html',
  styleUrls: ['./gate-pass-form.component.scss'],
})
export class GatePassFormComponent extends BaseDetailComponent implements OnInit {
  protected cars: any[] = [];
  fileLink: any[] = [];
  serverImg = environment.serverURLImage + '/';

  constructor(
    private fb: FormBuilder,
    protected readonly gatePassService: GatePassService,
    protected readonly notificationService: NotificationService,
    private readonly carService: CarListService,
    private authService: AuthService,
  ) {
    super(gatePassService, notificationService);
  }

  initForm(data: any = null): void {
    this.detailForm = this.fb.group({
      id: new FormControl(data?.id ?? 0, Validators.required),
      procedureNumber: new FormControl({ value: data?.procedureNumber, disabled: true }, Validators.required),
      date: new FormControl(data?.date ? new Date(data.date) : new Date(), Validators.required),
      local: new FormControl(data?.local || this.authService.user.fullname, Validators.required),
      note: new FormControl(data?.note),
      carName: new FormControl(data?.carName, Validators.required),
      isSpecial: new FormControl(data?.isSpecial ?? false),
      files: [[]],
    });
    if (data?.files) {
      this.fileLink = data.files;
    }
    if (!data) {
      this.gatePassService.getProcedureNumber().subscribe((res: any) => {
        this.detailForm?.patchValue({
          procedureNumber: res.data,
        });
      });
    }
  }

  ngOnInit(): void {
    this.carService.getAllCars().subscribe((response) => {
      this.cars = response.data;
    });
  }

  submit() {
    this.onSubmit()?.subscribe((res) => {
      this.notificationService.success(this.isEdit ? 'success.update' : 'success.create');
      this.onFormClosing.emit(true);
      this.toggleVisible();
      this.fileLink = [];
    });
  }

  onFileLinkChange(event: any) {
    this.fileLink = event;
    this.detailForm.patchValue({ files: this.fileLink });
  }

  onAttachFile(event: any) {
    if (this.fileLink.length >= 4 || event.target?.files.length > 4 || event.target?.files.length + this.fileLink.length > 4) {
      return;
    }

    for (let i = 0; i < event.target?.files.length; i++) {
      const formData = new FormData();
      formData.append('file', event.target?.files[i]);
      this.gatePassService.uploadFile(formData).subscribe((res: any) => {
        if (this.fileLink.length < 4) {
          this.fileLink.push(res);
        }
      });
    }
    this.detailForm.patchValue({ files: this.fileLink });
  }

  isImageExtension(fileName: string): boolean {
    return AppUtil.isImageFile(fileName);
  }

  protected onBack() {
    super.onBack();
    this.fileLink = [];
  }
}
