import { Component, EventEmitter, Output } from '@angular/core';
import { FormArray, FormBuilder, FormControl, Validators } from '@angular/forms';
import { ResponseModel } from '@app/models/common/response.model';
import { NotificationService } from '@app/service/notification.service';
import { AdvancedPaymentService } from '@app/service/produces/advanced-payment.service';
import { BaseDetailComponent } from '@app/shared/components/base-detail.component';
import { ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-advanced-payment-form',
  templateUrl: './advanced-payment-form.component.html',
  styleUrls: ['./advanced-payment-form.component.scss'],
})
export class AdvancedPaymentFormComponent extends BaseDetailComponent {
  isInvalidForm: boolean = false;
  fileLink: any[] = [];
  settlementFile: any[] = [];
  @Output() onCancel = new EventEmitter();

  constructor(
    private fb: FormBuilder,
    protected advancedPaymentService: AdvancedPaymentService,
    protected readonly notificationService: NotificationService,
    private confirmService: ConfirmationService,
  ) {
    super(advancedPaymentService, notificationService);
  }

  get items() {
    return this.detailForm.get('items') as FormArray;
  }

  get isFinished() {
    return this.detailForm.get('isFinished') as FormControl;
  }

  initForm(data: any): void {
    this.detailForm = this.fb.group({
      id: data?.id || 0,
      procedureNumber: data?.procedureNumber || null,
      amount: data?.amount || null,
      note: data?.note || null,
      datePayment: data?.datePayment ? new Date(data.datePayment) : new Date(),
      items: this.fb.array((data?.items ?? []).map((item: any) => this.fb.group(item))),
      isImmediate: data?.isImmediate || false,
      files: [data?.files],
      settlementFile: [data?.settlementFile],
      isFinished: data?.isFinished || false,
    });
    if (data?.files) {
      this.fileLink = data.files;
    }
    if (data?.settlementFile) {
      this.settlementFile = [data.settlementFile];
    }
    if (!data) {
      this._getProcedureCode();
    }
  }

  submit() {
    this.onSubmit()?.subscribe((res) => {
      this.notificationService.success(this.isEdit ? 'success.update' : 'success.create');
      this.onFormClosing.emit(true);
      this.toggleVisible();
      this.fileLink = [];
      this.onCancel.emit();
    });
  }

  private _getProcedureCode() {
    this.advancedPaymentService.getProcedureNumber().subscribe((res: ResponseModel) => {
      if (res.data) {
        this.detailForm.patchValue({
          procedureNumber: res?.data,
        });
      }
    });
  }

  protected onBack() {
    super.onBack();
    this.fileLink = [];
    this.settlementFile = [];
    this.onCancel.emit();
  }

  addItem() {
    this.items.push(
      this.fb.group({
        note: new FormControl(null, Validators.required),
        amount: new FormControl(null, Validators.required),
      }),
    );
  }

  checkInvalidRow(rowIndex: any, field: string) {
    const col = this.items.at(rowIndex).get(field);
    return col.hasError('required') && col.touched;
  }

  deleteItem(rowIndex: any) {
    this.items.removeAt(rowIndex);
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
      this.advancedPaymentService.uploadFile(formData).subscribe((res: any) => {
        if (this.fileLink.length < 4) {
          this.fileLink.push(res);
        }
      });
    }
    this.detailForm.patchValue({ files: this.fileLink });
  }

  onSettlementFileLinkChange(event: any) {
    this.settlementFile = event;
    this.detailForm.patchValue({ settlementFile: this.settlementFile?.[0] });
  }

  onSettlementAttachFile(event: any) {
    this.confirmService.confirm({
      message: 'Upload lên sẽ không xóa được, bạn cần kiểm tra kỹ chứng từ trước khi up nhé.',
      accept: () => {
        if (
          this.settlementFile.length >= 1 ||
          event.target?.files.length > 1 ||
          event.target?.files.length + this.settlementFile.length > 1
        ) {
          return;
        }

        for (let i = 0; i < event.target?.files.length; i++) {
          const formData = new FormData();
          formData.append('file', event.target?.files[i]);
          this.advancedPaymentService.uploadFile(formData).subscribe((res: any) => {
            if (this.settlementFile.length < 1) {
              this.settlementFile.push(res);
              this.detailForm.patchValue({ settlementFile: this.settlementFile?.[0] });
            }
          });
        }
      },
    });
  }

  get sumAmount(): number {
    const amount = this.appUtil.sumArray(this.items.value, 'amount');
    this.detailForm.patchValue({ amount });
    return amount;
  }
}
