import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { TargetService } from '@app/service/target.service';
import { ToastService } from '@app/service/toast.service';
import { WorkerSalaryService } from '@components/employee-module/worker-salary/worker-salary.service';

@Component({
  selector: 'app-worker-salary-form',
  templateUrl: './worker-salary-form.component.html',
  styleUrls: ['./worker-salary-form.component.scss'],
})
export class WorkerSalaryFormComponent implements OnInit {
  @Input() isDisplay = false;
  @Input() item: any;
  @Input() procedureList: any[] = [];
  _userList: any[] = [];
  @Input() set userList(userList: any[]) {
    this._userList = userList;
    this.filterUserList = userList;
  }

  @Input() salaryTypeList: any[] = [];
  @Output() isDisplayChange = new EventEmitter();
  mForm: FormGroup;
  targetList: any[] = [];
  selectedTarget: any;
  filterUserList: any[] = [];

  get produceProductCode() {
    return this.mForm.get('produceProductCode') as FormControl;
  }

  get salaryTypeId() {
    return this.mForm.get('salaryTypeId') as FormControl;
  }

  get quantity() {
    return this.mForm.get('quantity') as FormControl;
  }

  get userIds() {
    return this.mForm.get('userIds') as FormControl;
  }

  get note() {
    return this.mForm.get('note') as FormControl;
  }

  get items() {
    return this.mForm.get('items') as FormArray;
  }

  constructor(
    private fb: FormBuilder,
    private targetService: TargetService,
    private workerSalaryService: WorkerSalaryService,
    private toastService: ToastService,
  ) {
    this.mForm = this.fb.group({
      produceProductId: [null],
      produceProductCode: [{ value: null, disabled: true }],
      salaryTypeId: ['', Validators.required],
      quantity: [''],
      note: [''],
      items: this.fb.array([]),
    });
  }

  ngOnInit(): void {
    this.targetService.getAllTarget().subscribe((res) => {
      this.targetList = res.data;
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    const { item } = changes;
    if (item && item.currentValue) {
      this.getItemDetail();
    }
  }

  getItemDetail() {
    this.workerSalaryService.getById(this.item.id).subscribe((res) => {
      this.mForm.patchValue(res);
      this.items.clear();
      this.fb.array((res?.items ?? []).map((item: any) => this.items.push(this.fb.group(item))));
    });
  }

  onBack() {
    this.isDisplayChange.emit(false);
  }

  onSave() {
    if (this.mForm.invalid) {
      return;
    }
    const body = this.mForm.value;
    for (let key in body) {
      if (body[key] === null || body[key] === undefined) {
        delete body[key];
      }
    }
    const items = this.items.value.map((user: any) => {
      return {
        salaryTypeProduceProductId: this.item?.id,
        targetId: this.selectedTarget,
        quantity: this.item?.quantity,
        ...user,
      };
    });
    if (!this.item) {
      this.workerSalaryService
        .create({
          ...body,
          items,
        })
        .subscribe((res) => {
          this.toastService.success('Thêm mới thành công');
          this.isDisplayChange.emit(false);
        });
    } else {
      this.workerSalaryService
        .update(this.item.id, {
          ...body,
          id: this.item.id,
          items,
        })
        .subscribe((res) => {
          this.toastService.success('Cập nhật thành công');
          this.isDisplayChange.emit(false);
        });
    }
  }

  addItem() {
    this.items.push(
      this.fb.group({
        userId: [],
        percent: [100],
        note: [],
      }),
    );
  }

  deleteItem(rowIndex: any) {
    this.items.removeAt(rowIndex);
  }

  onChangeTarget() {
    this.filterUserList = this._userList.filter((user) => user.targetId === this.selectedTarget);
  }
}
