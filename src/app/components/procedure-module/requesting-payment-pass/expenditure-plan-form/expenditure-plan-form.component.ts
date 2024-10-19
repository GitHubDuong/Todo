import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ExpenditurePlanService } from '@app/service/expenditure-plan.service';
import { ToastService } from '@app/service/toast.service';

@Component({
  selector: 'app-expenditure-plan-form',
  templateUrl: './expenditure-plan-form.component.html',
  styleUrls: ['./expenditure-plan-form.component.scss'],
})
export class ExpenditurePlanFormComponent implements OnInit {
  @Input() visible: boolean = false;
  @Input() selectedIds: number[] = [];
  @Input() type: 'payment_proposal' | 'advance_payment' = 'payment_proposal';
  @Output() visibleChange = new EventEmitter<boolean>();
  note: string = '';
  expenditurePlanList: any[];
  selectedExpenditurePlan: any;

  constructor(
    private expenditurePlanService: ExpenditurePlanService,
    private toastService: ToastService,
  ) {}

  ngOnInit(): void {
    this.getData();
  }

  private getData() {
    this.expenditurePlanService.getAll().subscribe((res: any) => {
      this.expenditurePlanList = (res.data || []).filter((x: any) => !x.isFinished);
    });
  }

  onCancel() {
    this.visibleChange.emit(false);
  }

  onSave() {
    const body = {
      note: this.note,
      paymentProposalIds: this.type == 'payment_proposal' ? this.selectedIds : [],
      advancePaymentIds: this.type == 'advance_payment' ? this.selectedIds : [],
    };
    if (!this.selectedExpenditurePlan) {
      this.expenditurePlanService.create(body).subscribe(() => {
        this.toastService.success('Tạo kế hoạch dự chi thành công');
        this.visibleChange.emit(false);
      });
    } else {
      this.expenditurePlanService
        .update(this.selectedExpenditurePlan.id, {
          id: this.selectedExpenditurePlan.id,
          ...body,
        })
        .subscribe(() => {
          this.toastService.success('Cập nhật kế hoạch dự chi thành công');
          this.visibleChange.emit(false);
        });
    }
  }

  onChangeExpenditurePlan() {
    if (!this.selectedExpenditurePlan) {
      this.note = '';
      return;
    }
    this.note = this.selectedExpenditurePlan.note;
  }
}
