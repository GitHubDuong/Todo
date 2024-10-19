import { Component, EventEmitter, HostListener, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';
import { MessageService } from 'primeng/api';
import { Dropdown } from 'primeng/dropdown';
import { ChartOfAccountService } from 'src/app/service/chart-of-account.service';
import { GoodsQuotaRecipeService } from 'src/app/service/goods-quota-recipe.service';
import { GoodsQuotaService } from 'src/app/service/goods-quota.service';
import AppConstant from 'src/app/utilities/app-constants';
import AppUtil from 'src/app/utilities/app-util';

@Component({
  selector: 'app-goods-quota-form',
  templateUrl: './goods-quota-form.component.html',
  styleUrls: ['./goods-quota-form.component.scss'],
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
export class GoodsQuotaFormComponent implements OnInit {
  public appConstant = AppConstant;
  public appUtil = AppUtil;
  @Input('formData') formData: any = {};
  @Input('isEdit') isEdit: boolean = false;
  @Input('display') display: boolean = false;
  @Input('creditAccounts') creditAccounts;
  @Input('listQuotaSelection') listQuotaSelection;
  @Input('listQuotaRecipes') listQuotaRecipes;
  @Output() onCancel = new EventEmitter();
  @ViewChild('creditDetailCodeFirst') creditDetailCodeFirst: Dropdown;
  @ViewChild('creditDetailCodeSecond') creditDetailCodeSecond: Dropdown;

  goodsQuotaForm: FormGroup = new FormGroup({});

  goodsQuotaItem = {
    id: 1,
    goodsQuotaId: 0,
    account: '',
    accountName: '',
    detail1: '',
    detailName1: '',
    detail2: '',
    detailName2: '',
    warehouse: '',
    quantity: 0,
  };

  listQuota: any[] = [];
  account: any;
  quota: any;
  detail1: any;
  detail2: any;
  detailName1: any;
  detailName2: any;
  listDetail1: any[] = [];
  listDetail2: any[] = [];
  codeDetail1: any;
  codeDetail2: any;
  quotaSelected: any;

  constructor(
    private fb: FormBuilder,
    private readonly messageService: MessageService,
    private readonly goodQuotaRecipeService: GoodsQuotaRecipeService,
    private readonly goodQuotaService: GoodsQuotaService,
    private readonly chartOfAccount: ChartOfAccountService,
  ) {
    this.goodsQuotaForm = this.fb.group({
      id: 0,
      date: [new Date(), Validators.required],
      code: [''],
      name: ['', Validators.required],
      goodsQuotaRecipeId: [0, Validators.required],
      items: [[]],
    });
  }

  ngOnInit(): void {}

  onReset() {
    this.goodsQuotaForm = this.fb.group({
      id: 0,
      date: [new Date(), Validators.required],
      code: [''],
      name: ['', Validators.required],
      goodsQuotaRecipeId: [0, Validators.required],
      items: [[]],
    });
    this.listQuota = [];
    this.quotaSelected = null;
    this.quota = null;
    this.account = null;
    this.onResetField();
    this.listDetail1 = [];
    this.listDetail2 = [];
  }

  getDetail(data) {
    this.quotaSelected = null;
    this.account = null;
    this.onResetField();
    this.listDetail1 = [];
    this.listDetail2 = [];

    this.goodQuotaService.getGoodsQuotaDetail(data.id).subscribe((res) => {
      this.goodsQuotaForm.patchValue({
        id: res.id,
        date:
          res.date && res.date != 'Invalid date' ? moment(res.date).format(AppConstant.FORMAT_DATE.VN_DATE_PIPE_SHORT_DATE) : new Date(),
        code: res.code ?? '',
        name: res.name,
        goodsQuotaRecipeId: res.goodsQuotaRecipeId,
        items: res.items ?? [],
      });

      if (res.items && res.items.length > 0) {
        this.quota = res.items[0].goodsQuotaId;
      }
      this.listQuota = res.items ?? [];
    });
  }

  chooseCreditCode(event) {
    if (!event.value) {
      return;
    }
    var items = this.creditAccounts.find((item) => item.id == event.value);
    this.chartOfAccount.getDetail(items.code).subscribe((res) => {
      this.listDetail1 = (res.data || []).map((item: any) => {
        return {
          ...item,
          label: `${item.code} - ${item.name}`,
        };
      });
      this.onResetField();
      if (this.listDetail1.length > 0) {
        setTimeout(() => {
          this.creditDetailCodeFirst.focus();
          this.creditDetailCodeFirst.show();
        }, 100);
      }
    });
  }

  clearCreditCode(event) {
    this.listDetail1 = [];
    this.listDetail2 = [];
  }

  onResetField() {
    this.detail1 = null;
    this.detailName1 = null;
    this.detail2 = null;
    this.detailName2 = null;
  }

  chooseDetail1(event) {
    if (!event.value) {
      return;
    }
    var items = this.creditAccounts.find((item) => item.id == this.account);
    var detail = this.listDetail1.find((x) => x.code == event.value);
    this.detail1 = detail?.code;
    this.detailName1 = detail?.name;
    const id = items?.code + ':' + event.value;
    this.chartOfAccount.getDetail(id).subscribe((res) => {
      console.log(res.data);
      this.listDetail2 = (res.data || []).map((item: any) => {
        return {
          ...item,
          label: `${item.code} - ${item.name}`,
        };
      });
      if (this.listDetail2.length > 0) {
        setTimeout(() => {
          this.creditDetailCodeSecond.focus();
          this.creditDetailCodeSecond.show();
        }, 100);
      }
    });
  }

  clearDetail1(event) {
    this.listDetail2 = [];
  }

  chooseDetail2(event) {
    if (!event.value) {
      return;
    }
    var detail = this.listDetail2.find((x) => x.code == event.value);
    this.detail2 = detail?.code;
    this.detailName2 = detail?.name;
  }

  checkValidValidator(fieldName: string) {
    return false;
    /*(this.goodsQuotaForm.controls[fieldName].dirty ||
      this.goodsQuotaForm.controls[fieldName].touched) &&
      (this.goodsQuotaForm.controls[fieldName].value == null ||
        this.goodsQuotaForm.controls[fieldName].value == '')
      ? 'ng-invalid ng-dirty'
      : '';
      */
  }

  SelectGoods($event: any) {
    if ($event.value) {
      this.quotaSelected = this.listQuotaSelection.find((x) => x.id == $event.value);
    } else {
      this.quotaSelected = null;
    }
  }

  onDelete(rowIndex) {
    var items = this.listQuota;
    items.splice(rowIndex, 1);
    this.listQuota = this.updateIdsInArray(items);
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

  addQuota() {
    let account;
    if (this.account) {
      account = this.creditAccounts.find((item) => item.id == this.account);
    }
    var quota = {
      id: (this.listQuota?.length || 0) + 1,
      goodsQuotaId: 0,
      account: account ? account.code : '',
      accountName: account ? account.name : '',
      detail1: this.detail1,
      detailName1: this.detailName1,
      detail2: this.detail2,
      detailName2: this.detailName2,
      warehouse: '',
      quantity: '',
    };
    var items = this.listQuota;
    items.push({ ...quota });
    this.listQuota = this.updateIdsInArray(items);
  }

  onSubmit() {
    var newData = this.goodsQuotaForm.getRawValue();

    let date = this.isValidDateFormat(this.goodsQuotaForm.value.date)
      ? this.formatDate(this.goodsQuotaForm.value.date)
      : this.goodsQuotaForm.value.date && this.goodsQuotaForm.value.date != 'Invalid date'
      ? moment(AppUtil.adjustDateOffset(this.goodsQuotaForm.value.date)).format('YYYY-MM-DD')
      : '';
    newData.date = date;
    this.listQuota.map((x) => {
      x.warehouse = x.warehouse.toString();
    });

    newData.items = this.listQuota;

    if (this.isEdit) {
      this.goodQuotaService.updateGoodsQuota(newData.id, newData).subscribe((res) => {
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
      this.goodQuotaService.createGoodsQuota(newData).subscribe((res) => {
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

  getCode(item) {
    let dataDisplay = '';
    if (item?.account) {
      dataDisplay = item.account;
    }
    if (item?.detail1) {
      dataDisplay = item.detail1;
    }
    if (item?.detail2) {
      dataDisplay = item.detail2;
    }
    return dataDisplay;
  }

  getName(item) {
    let dataDisplay;
    if (item.accountName) {
      dataDisplay = item.accountName;
    }
    if (item?.detailName1) {
      dataDisplay = item.detailName1;
    }
    if (item?.detailName2) {
      dataDisplay = item.detailName2;
    }
    return dataDisplay;
  }

  formatNumber(n) {
    return n.toFixed(0).replace(/./g, function (c, i, a) {
      return i > 0 && c !== '.' && (a.length - i) % 3 === 0 ? ',' + c : c;
    });
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

  totalQuantity() {
    return (this.listQuota || []).reduce((acc, item) => acc + item.quantity, 0);
  }

  totalValue() {
    return (this.listQuota || []).reduce((acc, item) => acc + item.quantity * item.warehouse, 0);
  }
}
