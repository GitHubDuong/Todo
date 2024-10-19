import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { CustomerService } from '@app/service/customer.service';
import { ToastService } from '@app/service/toast.service';
import { RequestEquipmentOrderService } from '@components/procedure-module/request-equipment-order/request-equipment-order.service';

@Component({
  selector: 'app-request-equipment-order-form',
  templateUrl: './request-equipment-order-form.component.html',
  styleUrls: ['./request-equipment-order-form.component.scss'],
})
export class RequestEquipmentOrderFormComponent implements OnChanges, OnInit {
  @Input() isDisplay = false;
  @Input() item: any;
  customers: any[] = [];
  mForm: FormGroup;
  @Output() isDisplayChange = new EventEmitter();
  detail: any;
  fileLink: any[] = [];

  get code() {
    return this.mForm.get('code') as FormControl;
  }

  get name() {
    return this.mForm.get('name') as FormControl;
  }

  get amount() {
    return this.mForm.get('amount') as FormControl;
  }

  constructor(
    private fb: FormBuilder,
    private requestEquipmentOrderService: RequestEquipmentOrderService,
    private toastService: ToastService,
    private customerService: CustomerService,

  ) {
    this.mForm = this.fb.group({
      code: [{ value: '', disabled: true }],
      name: [''],
      amount: [''],
      customerId: [0]
    });
  }

  ngOnInit(): void {
    this.getListCustomer(null);
  }

  ngOnChanges(changes: SimpleChanges): void {
    const { item } = changes;
    if (item && item.currentValue) {
      this.requestEquipmentOrderService.getById(this.item.id).subscribe((res) => {
        this.detail = {
          ...res,
          date: new Date(res.date),
          items: res.items.map((item: any) => {
            return {
              ...item,
              amount: item.quantity * item.unitPrice || 0,
            };
          }),
        };
        if (res.files) {
          this.fileLink = res.files;
        }
      });
    }
  }

  onBack() {
    this.isDisplayChange.emit(false);
  }

  onSave() {
    this.requestEquipmentOrderService
      .update(this.item.id, {
        ...this.detail,
        date: new Date(),
        files: this.fileLink,
      })
      .subscribe((res) => {
        this.toastService.success('Cập nhật thành công');
        this.isDisplayChange.emit(false);
      });
  }

  getItems() {
    return this.detail?.items || [];
  }

  onFileLinkChange(event: any) {
    this.fileLink = event;
  }

  onAttachFile(event: any) {
    if (this.fileLink.length >= 4 || event.target?.files.length > 4 || event.target?.files.length + this.fileLink.length > 4) {
      return;
    }

    for (let i = 0; i < event.target?.files.length; i++) {
      const formData = new FormData();
      formData.append('file', event.target?.files[i]);
      this.requestEquipmentOrderService.uploadFile(formData).subscribe((res: any) => {
        if (this.fileLink.length < 4) {
          this.fileLink.push(res);
        }
      });
    }
  }

  getAmount(item: any) {
    if (item.quantity || item.unitPrice) {
      item.amount = 0;
    }
    item.amount = item.quantity * item.unitPrice;
  }

  getListCustomer(event) {
    let searchText = '';
    if(event != null){
      searchText = event.filter;
    }
    let typeSupplier = 1;
    this.customerService.getAllCustomer(searchText, typeSupplier).subscribe((res: any) => {
      this.customers = res.data;
    });
  }
}
