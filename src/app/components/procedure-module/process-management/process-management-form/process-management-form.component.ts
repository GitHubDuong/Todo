import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { MessageService } from 'primeng/api';
import { ProcedureService } from 'src/app/service/procedure.service';
import * as _ from "lodash";

@Component({
  selector: 'app-process-management-form',
  templateUrl: './process-management-form.component.html',
  styleUrls: ['./process-management-form.component.scss'],
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
export class ProcessManagementFormComponent implements OnInit {
  @Input('formData') formData: any = {};
  @Input('isReset') isReset: boolean = false;
  @Input('isEdit') isEdit: boolean = false;
  @Input('display') display: boolean = false;
  @Input('employees') employees: any[] = [];
  @Input('roles') roles: any[] = [];

  @Output() onCancel = new EventEmitter();
  title = '';

  form: FormGroup = new FormGroup({});

  selectedFile = null;

  items = {
    type: 0,
    name: '',
    note: '',
    roleIds: [],
    userIds: [],
  };
  statusItems = []
  constructor(
    private fb: FormBuilder,
    private translateService: TranslateService,
    private messageService: MessageService,
    private readonly procedureService: ProcedureService,
  ) {
    this.form = this.fb.group({
      id: [0],
      code: [''],
      name: [''],
      note: [''],
      statusItems: [[]],
    });
  }

  ngOnInit(): void {}

  onReset() {
    this.form = this.fb.group({
      id: [0],
      code: [''],
      name: [''],
      note: [''],
      statusItems: [[]],
    });
  }

  getDetail(id: any) {
    this.procedureService.getProcedureDetail(id).subscribe((res) => {
      this.form.patchValue({
        id: res.id,
        name: res.name,
        code: res.code,
        note: res.note,
        statusItems: res.statusItems,
      });
      this.statusItems = _.cloneDeep(res.statusItems)
    });
  }

  onAdd() {
    var items = this.form.get('statusItems')?.value;
    items.push({ ...this.items });

    this.form.get('items')?.setValue(items);
  }

  onDelete(rowIndex) {
    var items = this.form.get('statusItems')?.value;
    items.splice(rowIndex, 1);
    this.form.get('statusItems')?.setValue(items);
  }

  checkValidValidator(fieldName: string) {
    return (this.form.controls[fieldName].dirty ||
      this.form.controls[fieldName].touched) &&
      (this.form.controls[fieldName].value == null ||
        this.form.controls[fieldName].value == '')
      ? 'ng-invalid ng-dirty'
      : '';
  }

  onSubmit() {
    this.form.controls['name'].markAsDirty();
    this.form.controls['code'].markAsDirty();
    var newData = this.form.getRawValue();
    const statusItems = this.form.value.statusItems
    const currStatusItemIds = this.form.value.statusItems?.map((_it) => _it.id)
    this.statusItems?.map((item)=>{
      if (!currStatusItemIds.includes(item.id))
        statusItems.push({
          ...item,
          isDeleted: true
        })
    })
    newData.statusItems = statusItems

    if (this.isEdit) {
      this.procedureService
        .updateProcedure(newData.id, newData)
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
            this.statusItems = []
          }
        });
    } else {
      this.procedureService.createProcedure(newData).subscribe((res) => {
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
            detail: 'Thêm mới thành công',
          });
          this.statusItems = []
        }
      });
    }
  }
}
