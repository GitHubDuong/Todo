import {
  Component,
  EventEmitter,
  HostListener,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { cloneDeep } from 'lodash';
import * as moment from 'moment';
import { MessageService } from 'primeng/api';
import { DepartmentService } from 'src/app/service/department.service';
import { StationaryExportService } from 'src/app/service/stationary-export.service';
import { UserService } from 'src/app/service/user.service';
import AppConstant from 'src/app/utilities/app-constants';
import AppUtil from 'src/app/utilities/app-util';

@Component({
  selector: 'app-stationary-export-form',
  templateUrl: './stationary-export-form.component.html',
  styleUrls: ['./stationary-export-form.component.scss'],
  styles: [
    `
      :host ::ng-deep .p-frozen-column {
        font-weight: bold;
      }

      :host ::ng-deep .p-datatable-frozen-tbody {
        font-weight: bold;
      }

      :host ::ng-deep .p-progressbar {
        height: 0.5rem;
      }
      :host ::ng-deep .p-datepicker-group-container {
        width: 18rem;
      }
      :host ::ng-deep .dropdown-table {
        height: 100%;
        width: 100%;
        .p-dropdown {
          height: 100%;
          width: 100%;
        }
      }
      :host ::ng-deep .dropdown-custom {
        height: 100%;
        width: 100%;
        .p-dropdown {
          height: fit-content;
          width: 100%;
        }
        .p-dropdown-label {
          height: 2.7rem;
        }
      }
      .full-w {
        width: 100%;
      }
      .m-left-20rem {
        margin-left: 20rem;
      }
      .d-flex {
        display: flex;
      }
      .center-text {
        padding-top: 1rem;
        text-align: center;
        margin-right: 1rem;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .p-left-2rem {
        padding-left: 2rem;
      }
      .f-normal {
        font-weight: normal;
      }
    `,
  ],
})
export class StationaryExportFormComponent implements OnInit {
  public appConstant = AppConstant;
  public appUtil = AppUtil;
  @Input('formData') formData: any = {};
  @Input('isEdit') isEdit: boolean = false;
  @Input('display') display: boolean = false;
  @Input('listAllStationer') listAllStationer: any[] = [];
  @Output() onCancel = new EventEmitter();

  stationaryExportForm: FormGroup = new FormGroup({});
  listUser: any[] = [];
  listDepartment: any[] = [];

  officeItem = {
    id: 1,
    stationeryImportId: 0,
    stationeryId: 0,
    quantity: 0,
    unitPrice: 0,
  };

  constructor(
    private fb: FormBuilder,
    private stationeryExportService: StationaryExportService,
    private readonly messageService: MessageService,
    private readonly departmentService: DepartmentService,
    private readonly userService: UserService,
  ) {
    this.stationaryExportForm = this.fb.group({
      id: 0,
      date: ['', Validators.required],
      procedureNumber: ['', Validators.required],
      departmentId: [0, Validators.required],
      userId: [0, Validators.required],
      items: [[]],
    });
  }

  ngOnInit(): void {
    this.userService.getAllUserActive().subscribe((res: any) => {
      this.listUser = res.data;
    });
    this.departmentService.getAllDepartment().subscribe((res) => {
      this.listDepartment = res.data;
    });
  }

  onReset() {
    this.stationaryExportForm = this.fb.group({
      id: 0,
      date: [new Date()],
      procedureNumber: [''],
      departmentId: 0,
      userId: 0,
      items: [[]],
    });
  }

  onAdd() {
    var items = this.stationaryExportForm.get('items')?.value;
    items.push({ ...this.officeItem });

    this.stationaryExportForm
      .get('items')
      ?.setValue(this.updateIdsInArray(items));
  }

  onDelete(rowIndex) {
    var items = this.stationaryExportForm.get('items')?.value;
    items.splice(rowIndex, 1);
    this.stationaryExportForm
      .get('items')
      ?.setValue(this.updateIdsInArray(items));
  }

  updateIdsInArray(objects: any[]): any[] {
    // Sắp xếp mảng theo giá trị ID hiện tại
    objects.sort((a, b) => a.id - b.id);
    // Cập nhật giá trị ID theo thứ tự tăng dần từ 1
    for (let i = 0; i < objects.length; i++) {
      objects[i].id = i + 1;
    }
    return objects;
  }

  onSubmit() {
    this.stationaryExportForm.controls['date'].markAsDirty();
    this.stationaryExportForm.controls['procedureNumber'].markAsDirty();
    this.stationaryExportForm.controls['departmentId'].markAsDirty();
    this.stationaryExportForm.controls['userId'].markAsDirty();

    var newData = this.stationaryExportForm.getRawValue();

    let date = this.isValidDateFormat(this.stationaryExportForm.value.date)
      ? this.formatDate(this.stationaryExportForm.value.date)
      : this.stationaryExportForm.value.date &&
        this.stationaryExportForm.value.date != 'Invalid date'
      ? moment(
          AppUtil.adjustDateOffset(this.stationaryExportForm.value.date),
        ).format('YYYY-MM-DD')
      : '';
    newData.date = date;

    if (this.isEdit) {
      this.stationeryExportService
        .updateStationaryExport(newData.id, newData)
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
    } else {
      this.stationeryExportService
        .createStationaryExport(newData)
        .subscribe((res) => {
          console.log(res);
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
          }
        });
    }
  }

  getDetail(id) {
    this.stationeryExportService.getStationaryExport(id).subscribe((res) => {
      this.stationaryExportForm.patchValue({
        id: res.id,
        date:
          res.date && res.date != 'Invalid date'
            ? moment(res.date).format(
                AppConstant.FORMAT_DATE.VN_DATE_PIPE_SHORT_DATE,
              )
            : '',
        procedureNumber: res.procedureNumber,
        departmentId: res.departmentId,
        userId: res.userId,
        items: res.items,
      });
    });
  }

  checkValidValidator(fieldName: string) {
    return (this.stationaryExportForm.controls[fieldName].dirty ||
      this.stationaryExportForm.controls[fieldName].touched) &&
      (this.stationaryExportForm.controls[fieldName].value == null ||
        this.stationaryExportForm.controls[fieldName].value == '')
      ? 'ng-invalid ng-dirty'
      : '';
  }

  formatDate(inputDateStr: string): string {
    // Parse the input date string using the original format
    const parsedDate = moment(inputDateStr, 'DD/MM/YYYY');
    // Format the date in the desired format
    const formattedDate = parsedDate.format('YYYY-MM-DD');
    return formattedDate;
  }

  isValidDateFormat(dateString: string): boolean {
    // Define a regular expression for the "DD/MM/YYYY" format
    const regex = /^\d{2}\/\d{2}\/\d{4}$/;

    // Test if the input string matches the regular expression
    return regex.test(dateString);
  }

  @HostListener('document:keydown', ['$event'])
  async handleKeyboardEvent(event: KeyboardEvent) {
    if (!this.display) return;
    switch (event.key) {
      case 'F8':
        event.preventDefault();
        await this.onSubmit();
        break;
      case 'F6':
        event.preventDefault();
        this.onCancel.emit({});
        break;
    }
  }
}
