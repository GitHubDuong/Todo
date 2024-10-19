import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { cloneDeep } from 'lodash';
import { UserRoleCRUD } from 'src/app/models/user-role.model';
import AppConstant from 'src/app/utilities/app-constants';
import AppUtil from 'src/app/utilities/app-util';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Page, TypeData } from '../../../../models/common.model';
import { OfficeForm } from '../../../../models/office';
import { OfficeControlService } from '../../../../service/office-control.service';
import * as moment from 'moment/moment';
import { MessageService } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-office-form',
  templateUrl: './office-form.component.html',
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
export class OfficeFormComponent implements OnInit, OnChanges {
  public appConstant = AppConstant;
  public appUtil = AppUtil;
  @Input('isReset') isReset: boolean = false;
  @Input('isEdit') isEdit: boolean = false;
  @Input('display') display: boolean = false;
  @Input('hiddenTitle') hiddenTitle: boolean = false;
  @Input('type') type = 0;
  @Output() onCancel = new EventEmitter();
  @Input() formData;
  @Input() listAllStationer = [];
  @Input() lengthListOffice = 0;
  error = {};

  isInvalidForm = false;
  officeForm: FormGroup = new FormGroup({});
  isSubmitted = false;
  isMobile = screen.width <= 1199;
  currentPageRole: UserRoleCRUD;
  loading: boolean = false;
  dateNow = moment(Date()).format('DD/MM/YYYY');
  result: TypeData<OfficeForm> = {
    data: [],
    currentPage: 0,
    nextStt: 0,
    pageSize: 20,
    totalItems: 0,
  };
  listStationerDetail = {
    items: [],
  };

  //  listStationerOriginal = [];
  public totalRecords = 0;

  param: Page = {
    page: 1,
    pageSize: 10,
  };

  officeItem = {
    id: 0,
    stationeryImportId: 0,
    stationeryId: 0,
    quantity: 0,
    unitPrice: 0,
  };

  constructor(
    private fb: FormBuilder,
    private officeControlService: OfficeControlService,
    private readonly messageService: MessageService,
    private translateService: TranslateService,
  ) {}

  ngOnInit() {
    this.currentPageRole = AppUtil.getMenus('QUANLYNHAPVANPHONGPHAM');
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes.formData && this.formData?.id) {
      this.listStationerDetail.items = this.formData?.items;
      this.dateNow = this.formData?.date;
      this.isEdit = true;
    }
  }

  onReset() {
    this.dateNow = moment(Date()).format('DD/MM/YYYY');
    this.listStationerDetail.items = [];
    this.officeForm = this.fb.group({
      id: [''],
      stationeryId: ['', [Validators.required]],
      quantity: ['', [Validators.required]],
      unitPrice: ['', [Validators.required]],
    });
    this.listStationerDetail.items.push({ ...this.officeItem });
  }
  checkValidValidator(fieldName: string) {
    return this.error[fieldName] != undefined && this.error[fieldName]
      ? 'ng-invalid ng-dirty'
      : '';
  }
  getNameById(inputId) {
    const foundObject = this.listAllStationer?.find(
      (item) => item.id === inputId,
    );
    return foundObject ? foundObject.name : null;
  }
  onChange(value: any, key: string, rowIndex: number) {
    if (value == null) {
      return;
    }
    if (key == 'stationeryId') {
      this.listStationerDetail.items[rowIndex]['nameStationerie'] =
        this.getNameById(value);
      this.listStationerDetail.items[rowIndex]['stationeryImportId'] = value;
    }
    let originIndex = (this.param.page - 1) * this.param.pageSize;
    this.listStationerDetail.items[rowIndex - originIndex][key] = value;
    this.listStationerDetail.items[rowIndex][key] = value;
  }
  onSubmit() {
    this.isEdit &&
      this.listStationerDetail?.items?.forEach((item, index) => {
        this.listStationerDetail.items[index]['nameStationerie'] =
          this.getNameById(item?.stationeryId);
        this.listStationerDetail.items[index]['stationeryImportId'] =
          item?.stationeryId;
      });
    const uniqueNameSet = new Set(
      this.listStationerDetail?.items?.map((item) => item.nameStationerie),
    );
    const uniqueNameArray = Array.from(uniqueNameSet);
    const resultString = uniqueNameArray.join(', ');
    const bodyAddOffice = {
      id: this.isEdit ? this.formData?.id : 0,
      procedureNumber: resultString,
      date: moment().format(AppConstant.FORMAT_DATE.MOMENT_T_DATE),
      items: this.listStationerDetail?.items,
    };
    if (this.isEdit) {
      this.onUpdate(bodyAddOffice);
    } else {
      this.onCreate(bodyAddOffice);
    }
  }

  onCreate(bodyCreate) {
    this.officeControlService.addOffice(bodyCreate).subscribe((res) => {
      if (res?.data) {
        this.messageService.add({
          severity: 'error',
          detail: AppUtil.translate(this.translateService, 'error.create'),
        });
      } else {
        this.messageService.add({
          severity: 'success',
          detail: AppUtil.translate(this.translateService, 'success.create'),
        });
        this.onCancel.emit({});
      }
    });
  }

  onUpdate(bodyUpdate) {
    this.officeControlService.updateOffice(bodyUpdate).subscribe((res) => {
      if (res?.data) {
        this.messageService.add({
          severity: 'error',
          detail: AppUtil.translate(this.translateService, 'error.update'),
        });
      } else {
        this.messageService.add({
          severity: 'success',
          detail: AppUtil.translate(this.translateService, 'success.update'),
        });
        this.onCancel.emit({});
      }
    });
  }
  onAdd() {
    this.listStationerDetail.items.push({ ...this.officeItem });
  }
  onDelete(rowIndex) {
    const item = cloneDeep(this.result.data);
    item.splice(rowIndex, 1);
    this.result.data = item;
  }
  protected readonly Date = Date;
}
