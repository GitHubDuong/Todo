import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ColumnDataType } from '@app/core/enum';
import { ActionButtonModel } from '@app/models/common/action-button.model';
import { TableColumModel } from '@app/models/common/table-colum.model';
import { ToastService } from '@app/service/toast.service';
import { WebsiteOrdersService } from '@app/service/website-orders.service';
import { ProcedureCodeType } from '@app/shared/common/enums/procedure-code.type';
import { ImportProcessService } from '@components/procedure-module/import-process/import-process.service';

@Component({
  selector: 'app-import-process-form',
  templateUrl: './import-process-form.component.html',
  styleUrls: ['./import-process-form.component.scss'],
})
export class ImportProcessFormComponent implements OnChanges, OnInit {
  @Input() isDisplay = false;
  @Input() item: any;
  mForm: FormGroup;
  procedureForm: FormGroup;
  detail: any;
  @Output() isDisplayChange = new EventEmitter();
  actionList: ActionButtonModel[] = [
    {
      icon: 'pi-times',
      label: 'button.backF6',
      class: 'p-button-outlined',
      command: () => {
        this.onBack();
      },
    },
    {
      icon: 'pi-check',
      label: 'Tạo kế hoạch',
      class: '',
      command: () => {
        this.onCreateProcedure();
      },
    },
  ];
  columns: TableColumModel[] = [
    { field: 'checked', label: '', type: ColumnDataType.checkbox, class: 'w-1' },
    { field: 'debitDetailCodeFirstName', label: 'Nguyên liệu', type: ColumnDataType.text, class: 'w-2' },
    { field: 'orginalDescription', label: 'Mô tả', type: ColumnDataType.text, class: 'w-2' },
    { field: 'orginalCompanyName', label: 'Công ty', type: ColumnDataType.text, class: 'w-2' },
    { field: 'unitPrice', label: 'Đơn giá', type: ColumnDataType.number, class: 'w-2' },
    { field: 'quantity', label: 'Số lượng', type: ColumnDataType.number, class: 'w-1' },
    { field: 'amount', label: 'Thành tiền', type: ColumnDataType.number, class: 'w-2' },
  ];
  showProcedure = false;
  produceProductsExistList: any[] = [];
  cars: any[] = [];

  constructor(
    private fb: FormBuilder,
    private importProcessService: ImportProcessService,
    private websiteOrdersService: WebsiteOrdersService,
    private toastService: ToastService,
  ) {
    this.mForm = this.fb.group({});
    this.procedureForm = this.fb.group({
      produceProductsName: [null],
      planningProduceProductId: [null],
      isSpecialOrder: [],
      carId: [null],
    });
    this.getCars(null);
  }

  ngOnInit(): void {
    this.websiteOrdersService.getAllProductionOrder(ProcedureCodeType.IMPORT_PROCESS).subscribe((res) => {
      this.produceProductsExistList = res;
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    const { item } = changes;
    if (item && item.currentValue) {
      this.importProcessService.getById(this.item.id).subscribe((res) => {
        this.detail = {
          ...res,
          items: res.items.map((x) => ({ ...x, checked: false })),
        };
      });
    }
  }

  getCars(event) {
    let id = 0;
    if (event != null) {
      id = event.value;
      const item = this.produceProductsExistList.find((item: any) => item.id == id);
      if (item) {
        this.procedureForm.patchValue({
          produceProductsName: item.note,
        });
      }
    }
    this.websiteOrdersService.getAllCars(id).subscribe((response) => {
      this.cars = response;
    });
  }

  onBack() {
    this.isDisplayChange.emit(false);
  }

  onSave() {
    return;
  }

  private onCreateProcedure() {
    this.showProcedure = true;
  }

  onSaveProcedure() {
    const items = this.detail.items.filter((x) => x.checked).map((x) => ({ id: x.id }));
    if (items.length === 0) {
      this.toastService.error('Cần chọn ít nhất 1 sản phẩm để tạo lệnh sản xuất');
      return;
    }
    const body: any = {
      note: this.procedureForm.value.produceProductsName,
      items,
    };
    if (this.procedureForm.value.planningProduceProductId) {
      body.id = this.procedureForm.value.planningProduceProductId;
    }
    this.importProcessService.createProcedure(body).subscribe((res) => {
      this.toastService.success('Tạo kế hoạch thành công');
    });
  }
}
