import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NotificationService } from '@app/service/notification.service';
import { AdvancedPaymentService } from '@app/service/produces/advanced-payment.service';
import { RequestEquipmentService } from '@app/service/request-equipment.service';
import { RequestingPaymentService } from '@app/service/requesting-payment.service';
import { BaseDetailComponent } from '@app/shared/components/base-detail.component';
import { RequestEquipmentOrderService } from '@components/procedure-module/request-equipment-order/request-equipment-order.service';

@Component({
  selector: 'app-requesting-payment-form',
  templateUrl: './requesting-payment-form.component.html',
  styleUrls: ['./requesting-payment-form.component.scss'],
})
export class RequestingPaymentFormComponent extends BaseDetailComponent implements OnInit {
  paymentMethods: any[];
  @Input() dialog: boolean = false;
  isImmediate = false;
  fileLink: any[] = [];
  advancedPaymentList: any[] = [];
  requestEquipmentList: any[] = [];
  requestEquipmentOrderList: any[] = [];

  constructor(
    private fb: FormBuilder,
    private readonly requestingPaymentService: RequestingPaymentService,
    protected readonly notificationService: NotificationService,
    protected readonly advancedPaymentService: AdvancedPaymentService,
    protected readonly requestEquipmentService: RequestEquipmentService,
    protected readonly requestEquipmentOrderService: RequestEquipmentOrderService,
  ) {
    super(requestingPaymentService, notificationService);
  }

  ngOnInit(): void {
    this.paymentMethods = [
      {
        id: 'CK',
        name: 'Chuyển khoản',
      },
      {
        id: 'TM',
        name: 'Tiền mặt',
      },
    ];
    this.advancedPaymentService.all().subscribe((res: any) => {
      this.advancedPaymentList = res;
    });
    this.requestEquipmentService.all().subscribe((res: any) => {
      this.requestEquipmentList = res;
    });
    this.requestEquipmentOrderService.all().subscribe((res: any) => {
      this.requestEquipmentOrderList = res;
    });
    this.onReset();
  }

  initForm(data: any = null): void {
    this.detailForm = this.fb.group({
      id: new FormControl(data?.id ?? 0, Validators.required),
      isImmediate: new FormControl(data?.isImmediate ?? false),
      procedureNumber: new FormControl({ value: data?.procedureNumber, disabled: true }, Validators.required),
      date: new FormControl(data?.date ? new Date(data.date) : new Date(), Validators.required),
      paymentMethod: new FormControl(data?.paymentMethod || 'TM', Validators.required),
      note: new FormControl(data?.note),
      items: this.fb.array((data?.items ?? []).map((item: any) => this.fb.group(item))),
      advanceAmount: new FormControl(data?.advanceAmount ?? 0, Validators.required),
      refundAmount: new FormControl(data?.refundAmount ?? 0, Validators.required),
      totalAmount: new FormControl(data?.totalAmount ?? 0, Validators.required),
      advancePaymentId: new FormControl(data?.advancePaymentId),
      requestEquipmentId: new FormControl(data?.requestEquipmentId),
      requestEquipmentOrderId: new FormControl(data?.requestEquipmentOrderId),
      files: [[]],
    });
    this.isImmediate = data?.isImmediate ?? false;
    if (data?.files) {
      this.fileLink = data.files;
    }
    if (!data) {
      this.requestingPaymentService.getProcedureNumber().subscribe((res: any) => {
        this.detailForm.patchValue({
          procedureNumber: res.data,
        });
      });
    }
  }

  get rows(): FormArray {
    return this.detailForm.get('items') as FormArray;
  }

  addItem(): void {
    this.rows.push(
      this.fb.group({
        content: new FormControl(null, Validators.required),
        amount: new FormControl(null, Validators.required),
        note: new FormControl(''),
      }),
    );
  }

  deleteItem(index: number): void {
    this.rows.removeAt(index);
  }

  checkInvalidRow(index: number, field: string): boolean {
    const col = this.rows.at(index).get(field);
    return col.hasError('required') && col.touched;
  }

  validateRows(): void {
    this.rows.controls.forEach((item: FormGroup) => {
      item.markAllAsTouched();
      if (!item.valid) {
        console.log('Item is invalid', item);
      }
    });
  }

  submit(): void {
    this.validateRows();
    this.detailForm.patchValue({
      totalAmount: this.totalAmount,
      files: this.fileLink,
    });
    this.onSubmit()?.subscribe((res) => {
      this.notificationService.success(this.isEdit ? 'success.update' : 'success.create');
      this.fileLink = [];
      this.onFormClosing.emit(true);
      this.toggleVisible();
    });
  }

  get sumAmount(): number {
    return this.appUtil.sumArray(this.rows.value, 'amount');
  }

  get totalAmount(): number {
    return this.sumAmount - (this.detailForm.value.advanceAmount || 0) - (this.detailForm.value.refundAmount || 0);
  }

  onChangeImmediate() {
    this.detailForm.patchValue({
      isImmediate: this.isImmediate,
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
      this.requestingPaymentService.uploadFile(formData).subscribe((res: any) => {
        if (this.fileLink.length < 4) {
          this.fileLink.push(res);
        }
      });
    }
    this.detailForm.patchValue({ files: this.fileLink });
  }

  protected onBack() {
    super.onBack();
    this.fileLink = [];
  }
}
