import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { ProductionDepartmentService } from '@app/service/production-department.service';
import { ToastService } from '@app/service/toast.service';
import { SalaryTypeService } from '@components/employee-module/salary-type/salary-type.service';
import { WorkerSalaryService } from '@components/employee-module/worker-salary/worker-salary.service';

@Component({
  selector: 'app-production-department-form',
  templateUrl: './production-department-form.component.html',
  styleUrls: ['./production-department-form.component.scss'],
})
export class ProductionDepartmentFormComponent implements OnChanges, OnInit {
  @Input() display = false;
  @Input() formData: any;
  @Output() onCancel = new EventEmitter();
  data: any;
  isMobile = screen.width < 1200;
  selectAll = false;
  showDialog = false;
  salaryTypeList: any[] = [];
  items: { selectedSalaryType: number; quantity: number }[] = [];

  constructor(
    private salaryTypeService: SalaryTypeService,
    private workerSalaryService: WorkerSalaryService,
    private productionDepartmentService: ProductionDepartmentService,
    private toastService: ToastService,
  ) {}

  get itemDetail() {
    return this.data?.items;
  }

  ngOnInit(): void {
    this.salaryTypeService.getAll().subscribe((res: any) => {
      this.salaryTypeList = res.data;
    });
    this.items.push({ selectedSalaryType: null, quantity: 0 });
  }

  onSave() {
    this.productionDepartmentService.update(this.data).subscribe(
      () => {
        this.toastService.success('Cập nhật bộ phận sản xuất thành công');
      },
      () => {
        this.toastService.error('Cập nhật bộ phận sản xuất thất bại');
      },
    );
  }

  onBack() {
    this.onCancel.emit();
  }

  ngOnChanges(changes: SimpleChanges): void {
    const { formData } = changes;
    if (formData && formData.currentValue) {
      this.getDetail();
    }
  }

  private getDetail() {
    this.productionDepartmentService.getById(this.formData.id).subscribe((res: any) => {
      this.data = res;
    });
  }

  onSaveFinishedProduct() {
    this.showDialog = true;
  }

  saveFinishedProduct() {
    this.productionDepartmentService.ledgerImport(this.data.id).subscribe(() => {
      this.toastService.success('Lưu nhập kho thành phẩm thành công');
      this.items = [];
      this.items.push({ selectedSalaryType: null, quantity: 0 });
      this.showDialog = false;
    });
  }

  onExportRawMaterial() {
    this.productionDepartmentService.ledgerExport(this.data.id).subscribe(() => {
      this.toastService.success('Lưu xuất kho nguyên liệu thành công');
    });
  }

  onToggleSelectAll() {
    (this.data?.items || []).forEach((item: any) => {
      item.checked = this.selectAll;
    });
  }

  onCancelSaveFinishedProduct() {
    this.items = [];
    this.items.push({ selectedSalaryType: null, quantity: 0 });
    this.showDialog = false;
  }

  onSaveWorkerSalaryAndFinishedProduct() {
    this.items.forEach((item) => {
      if (item.selectedSalaryType && item.quantity) {
        this.createWorkerSalary(item);
      }
    });
    this.saveFinishedProduct();
  }

  createWorkerSalary(item: any) {
    const body = {
      produceProductId: this.data.id,
      produceProductCode: this.data.procedureNumber,
      salaryTypeId: item.selectedSalaryType,
      quantity: item.quantity,
      userIds: [],
    };
    this.workerSalaryService.create(body).subscribe((res) => {});
  }

  onAddItem(idx: number) {
    this.items.push({ selectedSalaryType: null, quantity: 0 });
  }

  onDeleteItem(idx: number) {
    this.items.splice(idx, 1);
  }
}
