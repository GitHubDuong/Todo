import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { MessageService } from 'primeng/api';
import { ProcedureStatusStepsService } from 'src/app/service/procedure-status-steps.service';
import { ProcedureService } from 'src/app/service/procedure.service';

@Component({
  selector: 'app-process-step-mng-form',
  templateUrl: './process-step-mng-form.component.html',
  styleUrls: ['./process-step-mng-form.component.scss'],
  styles: [
    `
      :host ::ng-deep {
        p-inputNumber .p-inputnumber-input {
          text-align: left;
        }
      }
    `,
  ],
})
export class ProcessStepMngFormComponent implements OnInit {
  @Input('formData') formData: any = {};
  @Input('isReset') isReset: boolean = false;
  @Input('isEdit') isEdit: boolean = false;
  @Input('display') display: boolean = false;

  @Output() onCancel = new EventEmitter();
  title = '';

  list: any[] = [];

  selectedFile = null;

  items = {
    order: 0,
    note: '',
    procedureStatusIdFrom: 0,
    procedureStatusIdTo: 0,
    procedureConditionId : 0
  };

  procedure = {
    id: 0,
    name: '',
  };

  listStatus: any[] = [];
  listCondition: any[] = [];
  constructor(
    private fb: FormBuilder,
    private translateService: TranslateService,
    private messageService: MessageService,
    private readonly procedureStatusStepService: ProcedureStatusStepsService,
    private readonly procedureService: ProcedureService,
  ) {}

  ngOnInit(): void {}

  getDetail(id: any) {
    this.procedureStatusStepService.getListStatus(id).subscribe((status) => {
      this.listStatus = status;
    });

   

    this.procedureService.getProcedureDetail(id).subscribe((data) => {
      this.procedure = data;
      this.procedureStatusStepService.getListCondition(data.code).subscribe((condition) => {
        this.listCondition = condition;
      });
    });
    this.procedureStatusStepService
      .getProcedureStepDetail(id)
      .subscribe((res) => {
        if (res) {
          this.list = res;
        }
      });
  }

  onAdd() {
    var items = this.list;
    if(this.list.length > 0)
    {
      this.items.order = this.list[this.list.length -1].order + 1;
    }
    items.push({ ...this.items });
    this.list = this.updateIdsInArray(items);
  }

  onDelete(rowIndex) {
    var items = this.list;

    items.splice(rowIndex, 1);
    this.list = this.updateIdsInArray(items);
  }

  updateIdsInArray(objects: any[]): any[] {
    // Sắp xếp mảng theo giá trị ID hiện tại
    objects.sort((a, b) => a.order - b.order);
    // Cập nhật giá trị theo thứ tự tăng dần từ 1
    for (let i = 0; i < objects.length; i++) {
      objects[i].order = i + 1;
    }
    return objects;
  }

  onSubmit() {
    this.procedureStatusStepService
      .createProcedureStep(this.procedure.id, this.list)
      .subscribe((res) => {
        if (res?.code === 400) {
          this.messageService.add({
            severity: 'error',
            detail: res?.msg || '',
          });
          return;
        } else {
          this.onCancel.emit({});
          this.messageService.add({
            severity: 'success',
            detail: 'Cập nhật thành công',
          });
        }
      });
  }
}
