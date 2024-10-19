import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '@app/service/auth.service';
import { DepartmentService } from '@app/service/department.service';
import { ExpenditurePlanService } from '@app/service/expenditure-plan.service';
import { NotificationService } from '@app/service/notification.service';
import { RequestEquipmentService } from '@app/service/request-equipment.service';
import { ToastService } from '@app/service/toast.service';
import { UserService } from '@app/service/user.service';
import { WebsiteOrdersService } from '@app/service/website-orders.service';
import { ProcedureCodeType } from '@app/shared/common/enums/procedure-code.type';
import { FileUpload } from '@app/shared/common/model/file-upload';
import { BaseDetailComponent } from '@app/shared/components/base-detail.component';
import { ImportProcessService } from '@components/procedure-module/import-process/import-process.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-requesting-equipment-form',
  templateUrl: './requesting-equipment-form.component.html',
  styleUrls: ['./requesting-equipment-form.component.scss'],
})
export class RequestingEquipmentFormComponent extends BaseDetailComponent implements OnInit {
  paymentMethods: any[];
  @Input() dialog: boolean = false;
  departments: any[];
  users: any[];
  goodTypes: any[];
  isCheckAll = false;
  item: any;
  canSave = true;
  fileLink: FileUpload[] = [];
  showProcedureForm = false;
  procedureForm: FormGroup;
  produceProductsExistList: any[] = [];
  cars: any[] = [];
  detail: any;
  constructor(
    private fb: FormBuilder,
    protected readonly notificationService: NotificationService,
    private readonly userService: UserService,
    private readonly authService: AuthService,
    private readonly requestEquipmentService: RequestEquipmentService,
    private readonly departmentService: DepartmentService,
    private expenditurePlanService: ExpenditurePlanService,
    private websiteOrdersService: WebsiteOrdersService,
    private toastService: ToastService,
    private importProcessService: ImportProcessService,
  ) {
    super(requestEquipmentService, notificationService);
    this.procedureForm = this.fb.group({
      produceProductsName: [null],
      planningProduceProductId: [null],
      isSpecialOrder: [],
      carId: [null],
    });
    this.getCars(null);
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
    this.onReset();
    this.loadCategories();
    this.websiteOrdersService.getAllProductionOrder(ProcedureCodeType.IMPORT_PROCESS).subscribe((res) => {
      this.produceProductsExistList = res;
    });
  }

  initForm(data: any = null): void {
    this.item = data;
    if (data) {
      this.canSave = data?.isSave;
    }
    this.detailForm = this.fb.group({
      id: new FormControl(data?.id ?? 0, Validators.required),
      procedureNumber: new FormControl({ value: data?.procedureNumber, disabled: true }, Validators.required),
      date: new FormControl(data?.date ? new Date(data.date) : new Date(), Validators.required),
      note: new FormControl(data?.note),
      userId: new FormControl(data?.userId ?? this.authService.user.id, Validators.required),
      departmentId: new FormControl(data?.departmentId, Validators.required),
      items: this.fb.array(
        (data?.items ?? []).map((item: any) =>
          this.fb.group({
            ...item,
            checked: new FormControl(false),
          }),
        ),
      ),
      files: new FormControl(data?.files),
    });
    if (data?.files) {
      this.fileLink = data.files;
    }
    if (!data) {
      this.requestEquipmentService.getProcedureNumber().subscribe((res: any) => {
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
        checked: new FormControl(false),
        goodName: new FormControl(''),
        goodCategory: new FormControl(''),
        goodProducer: new FormControl(''),
        goodCatalog: new FormControl(''),
        goodUnit: new FormControl(''),
        quantity: new FormControl(0),
        date: new FormControl(new Date(), Validators.required),
        goodType: new FormControl(null),
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
    });
  }

  onBack() {
    super.onBack();
    this.fileLink = [];
  }

  submit(): void {
    if (!this.canSave) {
      this.toggleVisible();
    }
    this.validateRows();
    this.onSubmit()?.subscribe((res) => {
      this.notificationService.success(this.isEdit ? 'success.update' : 'success.create');
      this.onFormClosing.emit(true);
      this.fileLink = [];
      this.toggleVisible();
    });
  }

  loadCategories() {
    forkJoin([
      this.userService.getAllUserActive1(),
      this.requestEquipmentService.getGoodType(),
      this.departmentService.getAllDepartment(),
    ]).subscribe(([users, goodTypes, departments]) => {
      this.users = users.data;
      this.departments = departments.data;
      this.goodTypes = goodTypes.data as any[];
    });
  }

  onToggleCheckAll() {
    this.rows.controls.forEach((item: FormGroup) => {
      item.patchValue({ checked: this.isCheckAll });
    });
  }

  get canCreateExpenditurePlan() {
    if (!this.item?.isFinished) {
      return false;
    }
    return !this.rows.controls.some((item: FormGroup) => !item.get('id')?.value);
  }

  onCreateExpenditurePlan() {
    const items = this.getItems();
    if (items.length === 0) {
      this.notificationService.error('Chưa chọn mặt hàng');
      return;
    }
    const body = {
      date: this.getCorrectDate(new Date()).toISOString(),
      note: this.detailForm.get('note')?.value,
      userId: this.item.userId || this.authService.user.id,
      isFinished: true,
      procedureNumber: this.item.procedureNumber,
      procedureStatusName: this.item.procedureStatusName,
      items,
    };
    this.expenditurePlanService.create(body).subscribe((res) => {
      this.notificationService.success('Tạo kế hoạch dự chi thành công');
    });
  }

  private getItems() {
    const checkedItem = this.rows.controls.filter((item: FormGroup) => {
      return item.get('checked')?.value;
    });
    return checkedItem.map((item: FormGroup) => {
      return {
        id: item.get('id')?.value,
        goodName: item.get('goodName')?.value,
        goodType: item.get('goodType')?.value,
        expenditurePlanAmount: item.get('quantity')?.value,
        note: item.get('note')?.value,
      };
    });
  }

  private getCorrectDate(date: Date): Date {
    const timestamp = date.getTime() + date.getTimezoneOffset() * 60000;
    return new Date(timestamp);
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
      this.requestEquipmentService.uploadFile(formData).subscribe((res: any) => {
        if (this.fileLink.length < 4) {
          this.fileLink.push(res);
        }
      });
    }
    this.detailForm.patchValue({ files: this.fileLink });
  }

  getFormValue(rowIndex: any, goodName: string) {
    return this.rows.at(rowIndex)?.get(goodName)?.value;
  }

  onCreateProcedureProcedure() {
    this.showProcedureForm = true;
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

  onSaveProcedure() {
    const items = this.rows.controls
      .filter((x: FormGroup) => x.controls['checked']?.value)
      .filter((x: FormGroup) => x.controls['id']?.value)
      .map((x: FormGroup) => ({ id: x.controls['id']?.value }));
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

  onCancelCreateProcedure() {
    this.showProcedureForm = false;
  }
}
