import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { NotificationService } from '@app/service/notification.service';
import { PlanningProduceProductsService } from '@app/service/planning-produce-products.service';
import { AdvancedPaymentService } from '@app/service/produces/advanced-payment.service';
import { RequestEquipmentService } from '@app/service/request-equipment.service';
import { RequestingPaymentService } from '@app/service/requesting-payment.service';
import { RequestEquipmentOrderService } from '@components/procedure-module/request-equipment-order/request-equipment-order.service';
import { RequestingPaymentFormComponent } from '@components/procedure-module/requesting-payment-pass/requesting-payment-form/requesting-payment-form.component';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-produce-planning-requesting-payment-form',
  templateUrl: './requesting-payment-form.component.html',
  styleUrls: ['./requesting-payment-form.component.scss'],
})
export class ProducePlanningRequestingPaymentFormComponent extends RequestingPaymentFormComponent {
  params: any = {};

  constructor(
    fb: FormBuilder,
    requestingPaymentService: RequestingPaymentService,
    protected notificationService: NotificationService,
    private planningProduceProductsService: PlanningProduceProductsService,
    protected advancedPaymentService: AdvancedPaymentService,
    protected requestEquipmentService: RequestEquipmentService,
    protected requestEquipmentOrderService: RequestEquipmentOrderService,
  ) {
    super(fb, requestingPaymentService, notificationService, advancedPaymentService, requestEquipmentService, requestEquipmentOrderService);
  }

  onEdit(id: number, carId: number = null, carName: string = null): void {
    this.params = { id, carId, carName };
    this.planningProduceProductsService.getPaymentProposal(carId, carName, id).subscribe((res: any) => {
      this.toggleVisible(res);
    });
  }

  override onSubmit(request: any = this.detailForm.getRawValue()): Observable<any> | undefined {
    this.isSubmit = true;
    if (this.detailForm.invalid) {
      this.notificationService.warning('warning.invalid_data');
      return undefined;
    }
    return this.planningProduceProductsService.updatePaymentProposal(request, this.params.id, this.params.carId, this.params.carName);
  }

  override submit(): void {
    this.validateRows();
    this.detailForm.patchValue({
      totalAmount: this.totalAmount,
    });
    this.onSubmit()?.subscribe((res) => {
      this.notificationService.success(this.isEdit ? 'success.update' : 'success.create');
      this.toggleVisible();
    });
  }
}
