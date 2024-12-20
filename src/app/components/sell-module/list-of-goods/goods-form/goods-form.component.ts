import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Injector,
  Input,
  OnInit,
  Output,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { MessageService } from 'primeng/api';
import { AutoComplete } from 'primeng/autocomplete';
import { AddEditAccountDetailsComponent } from 'src/app/components/accounting-module/account-v2/dialogs/add-edit-account-details/add-edit-account-details.component';
import { AddEditAccountComponent } from 'src/app/components/accounting-module/account-v2/dialogs/add-edit-account/add-edit-account.component';
import { ChartOfAccountService } from 'src/app/service/chart-of-account.service';
import { GoodsService } from 'src/app/service/goods.service';
import AppConstant from 'src/app/utilities/app-constants';
import AppUtil from 'src/app/utilities/app-util';
import { environment } from 'src/environments/environment';
import {
  AccountType,
  AddAccountDetailType,
} from '../../../accounting-module/account-v2/account.model';
import { Dropdown } from 'primeng/dropdown';
import { BaseAccountComponent } from 'src/app/shared/components/BaseAccountComponent';

@Component({
  selector: 'app-goods-form',
  templateUrl: './goods-form.component.html',
  styleUrls: ['./goods-form.component.scss'],
})
export class GoodsFormComponent extends BaseAccountComponent implements OnInit {
  @ViewChild('debitCodeTmp') debitCodeTmp: AutoComplete;
  @ViewChild('debitDetailCodeFirstTmp') debitDetailCodeFirstTmp: AutoComplete;
  @ViewChild('debitDetailCodeSecondTmp')
  debitDetailCodeSecondTmp: AutoComplete;
  @ViewChild('creditCodeTmp') creditCodeTmp: AutoComplete;
  @ViewChild('creditDetailCodeFirstTmp')
  creditDetailCodeFirstTmp: AutoComplete;
  @ViewChild('creditDetailCodeSecondTmp')
  creditDetailCodeSecondTmp: AutoComplete;

  @ViewChild('addEditAccount', { static: false })
  addEditAccount: AddEditAccountComponent;
  @ViewChild('addEditAccountDetail', { static: false })
  addEditAccountDetail: AddEditAccountDetailsComponent;
  public appConstant = AppConstant;
  public appUtil = AppUtil;
  @Input('formData') formData: any = {};
  @Input('isEdit') isEdit: boolean = false;
  @Input('display') display: boolean = false;
  @Input() isPriceList: boolean = false;

  @Input('types') types: any = {};
  @Output() onCancel = new EventEmitter();

  serverUrl = environment.serverURL;

  goodsForm: FormGroup = new FormGroup({});
  fileListStr: string[] = [];
  selectedImages: string[] = [];

  isSubmitted = false;
  isInvalidForm = false;
  uploading: boolean = false;

  currentAccountType: AccountType = AccountType.NB;
  @Input('taxRates') taxRates: any = [];

  constructor(
    fb: FormBuilder,
    chartOfAccountService: ChartOfAccountService,
    renderer: Renderer2,
    injector: Injector,
    private translateService: TranslateService,
    private messageService: MessageService,
    private readonly goodsService: GoodsService,
  ) {
    super(fb, chartOfAccountService, renderer, injector);
    this.goodsForm = this.fb.group({
      id: [0],
      menuType: [''],
      priceList: [''],
      goodsType: [''],
      salePrice: [0],
      price: [0],
      discountPrice: [0],
      inventory: [1],
      position: [''],
      delivery: [''],
      minStockLevel: [1],
      maxStockLevel: [1],
      status: [1],
      warehouse: [''],
      warehouseName: [''],
      image1: [''],
      image2: [''],
      image3: [''],
      image4: [''],
      image5: [''],
      taxVat: [0],
      dateManufacture: [''],
      dateExpiration: [''],
      documentCode: [''],
      orderNumber: [''],
      costPriceIn: [''],
      taxRateId: [0],
    });
  }

  onReset() {
    this.isInvalidForm = false;
    this.goodsForm.reset();
    this.fileListStr = [];
  }

  ngOnInit() {
    this.form = this.fb.group({
      debitCode: [''],
      debitDetailCodeFirst: [''],
      debitDetailCodeSecond: [''],
      creditCode: [''],
      creditDetailCodeFirst: [''],
      creditDetailCodeSecond: [''],
    });
    this.getAllByDisplayInsert();
    this.getChartOfAccountForGoods();
  }

  checkValidValidator(fieldName: string) {
    return ((this.goodsForm.controls[fieldName]?.dirty ||
      this.goodsForm.controls[fieldName]?.touched) &&
      this.goodsForm.controls[fieldName]?.invalid) ||
      (this.isInvalidForm && this.goodsForm.controls[fieldName]?.invalid)
      ? 'ng-invalid ng-dirty'
      : '';
  }

  checkValidMultiValidator(fieldNames: string[]) {
    for (let i = 0; i < fieldNames.length; i++) {
      if (
        ((this.goodsForm.controls[fieldNames[i]]?.dirty ||
          this.goodsForm.controls[fieldNames[i]]?.touched) &&
          this.goodsForm.controls[fieldNames[i]]?.invalid) ||
        (this.isInvalidForm && this.goodsForm.controls[fieldNames[i]]?.invalid)
      ) {
        return true;
      }
    }
    return false;
  }

  getDetail(id) {
    this.onReset();
    this.goodsService.getDetail(id).subscribe((res: any) => {
      this.goodsForm.setValue({
        id: res.id,
        menuType: res.menuType,
        priceList: res.priceList,
        goodsType: res.goodsType,
        salePrice: res.salePrice,
        price: res.price,
        discountPrice: res.discountPrice,
        inventory: res.inventory,
        position: res.position,
        delivery: res.delivery,
        minStockLevel: res.minStockLevel,
        maxStockLevel: res.maxStockLevel,
        status: res.status,
        warehouse: res.warehouse,
        warehouseName: res.warehouseName,
        image1: res.image1,
        image2: res.image2,
        image3: res.image3,
        image4: res.image4,
        image5: res.image5,
        taxVat: res.taxVat,
        dateManufacture: res.dateManufacture,
        dateExpiration: res.dateExpiration,
        documentCode: res.documentCode || '',
        orderNumber: res.orderNumber || '',
        costPriceIn: res.costPriceIn || '',
        taxRateId: res.taxRateId,
      });
      if (res.accountObj) {
        res.accountObj.displaySelected = res.accountObj.code + ' - ' + res.accountObj.name;
      }
      if (res.detailFirstObj) {
        res.detailFirstObj.displaySelected = res.detailFirstObj.code + ' - ' + res.detailFirstObj.name;
      }
      if (res.detailSecondObj) {
        res.detailSecondObj.displaySelected = res.detailSecondObj.code + ' - ' + res.detailSecondObj.name;
      }
      this.form.patchValue({
        debitCode: res.accountObj ?? null,
        debitDetailCodeFirst: res.detailFirstObj ?? null,
        debitDetailCodeSecond: res.detailSecondObj ?? null,
      });
      this.setFileListStr();
    });
  }

  setFileListStr() {
    if (this.goodsForm.value.image1) {
      this.fileListStr.push(this.goodsForm.value.image1);
    }
    if (this.goodsForm.value.image2) {
      this.fileListStr.push(this.goodsForm.value.image2);
    }
    if (this.goodsForm.value.image3) {
      this.fileListStr.push(this.goodsForm.value.image3);
    }
    if (this.goodsForm.value.image4) {
      this.fileListStr.push(this.goodsForm.value.image4);
    }
    if (this.goodsForm.value.image5) {
      this.fileListStr.push(this.goodsForm.value.image5);
    }
  }

  onSubmit() {
    this.isSubmitted = true;
    this.isInvalidForm = false;
    if (this.goodsForm.invalid) {
      this.messageService.add({
        severity: 'error',
        detail: AppUtil.translate(
          this.translateService,
          'info.please_check_again',
        ),
      });
      this.isInvalidForm = true;
      this.isSubmitted = false;
      return;
    }

    let newData = this.cleanObject(AppUtil.cleanObject(this.goodsForm.value));
    newData.floorId = newData?.floorId || 0;
    if (this.isEdit) {
      this.goodsService
        .update(newData, this.goodsForm.value.id)
        .subscribe((res: any) => {
          if (res.status !== 606) {
            this.onCancel.emit({});
            this.messageService.add({
              severity: 'success',
              detail: this.appUtil.translate(
                this.translateService,
                'success.update',
              ),
            });
          }
        });
    } else {
      this.goodsService.create(newData).subscribe((res: any) => {
        if (res.status !== 606) {
          this.onCancel.emit({});
          this.messageService.add({
            severity: 'success',
            detail: this.appUtil.translate(
              this.translateService,
              'success.update',
            ),
          });
        }
      });
    }
  }

  doAttachFile(event: any): void {
    if (
      this.fileListStr.length >= 5 ||
      event.target?.files.length > 5 ||
      event.target?.files.length + this.fileListStr.length > 5
    ) {
      this.messageService.add({
        severity: 'error',
        detail: this.appUtil.translate(
          this.translateService,
          'The number of uploads has exceeded the allowed amount',
        ),
      });
      return;
    }
    for (let i = 0; i < event.target?.files.length; i++) {
      this.uploading = true;
      const formData = new FormData();
      formData.append('file', event.target?.files[i]);
      this.goodsService.uploadFiles(formData).subscribe((response: any) => {
        if (
          response.body &&
          response.body.imageUrl &&
          this.fileListStr.length < 5
        ) {
          this.fileListStr.push(response.body.imageUrl);
        }
        this.uploading = false;
      });
    }
  }

  onImageClick(id: any) {
    // remove or add class name style_prev_kit (css hover)
    let image = document.getElementById(id);
    let isUsingClass = image.classList.contains('style_prev_kit');
    if (isUsingClass) {
      image.classList.remove('style_prev_kit');
      image.classList.add('opacity-custom');
      this.selectedImages = [...this.selectedImages, id];
    } else {
      image.classList.add('style_prev_kit');
      image.classList.remove('opacity-custom');
      this.selectedImages = this.selectedImages.filter((x) => x !== id);
    }
  }

  onRemoveImages() {
    if (this.selectedImages.length > 0) {
      this.fileListStr = this.fileListStr.filter(
        (item) => !this.selectedImages.includes(item),
      );
      this.goodsService
        .deleteFiles(this.selectedImages)
        .subscribe((url: string) => {
          this.messageService.add({
            severity: 'success',
            detail: this.appUtil.translate(
              this.translateService,
              'success.delete',
            ),
          });
        });
      this.selectedImages = [];
    }
  }

  cleanObject(data) {
    let newData = Object.assign({}, data);
    if (!(newData.id > 0)) {
      newData.id = 0;
    }

    newData.image1 =
      this.fileListStr.length > 0 && this.fileListStr[0]
        ? this.fileListStr[0]
        : '';
    newData.image2 =
      this.fileListStr.length > 0 && this.fileListStr[1]
        ? this.fileListStr[1]
        : '';
    newData.image3 =
      this.fileListStr.length > 0 && this.fileListStr[2]
        ? this.fileListStr[2]
        : '';
    newData.image4 =
      this.fileListStr.length > 0 && this.fileListStr[3]
        ? this.fileListStr[3]
        : '';
    newData.image5 =
      this.fileListStr.length > 0 && this.fileListStr[4]
        ? this.fileListStr[4]
        : '';
    let warehouse = this.types.warehouse.find(
      (x) => x.code === newData.warehouse,
    );
    newData.warehouseName = warehouse ? warehouse.name : '';

    return {
      ...newData,
      account: this.fc['debitCode']?.value?.code || '',
      accountName: this.fc['debitCode']?.value?.name || '',
      detail1: this.fc['debitDetailCodeFirst'].value?.code || '',
      detailName1: this.fc['debitDetailCodeFirst'].value?.name || '',
      detail2: this.fc['debitDetailCodeSecond']?.value?.code || '',
      detailName2: this.fc['debitDetailCodeSecond']?.value?.name || '',
    };
  }

  // ------------------- Chart of account events ------------------
  filteredDebitNames: any[] = [];
  debits1: any[] = [];
  filteredDebit1Names: any[] = [];
  debits2: any[] = [];
  filteredDebit2Names: any[] = [];

  selectedDebit: any = {};
  selectedDebit1: any = {};
  selectedDebit2: any = {};

  @ViewChild('debit') public vcDebit: AutoComplete;
  @ViewChild('debit1') vcDebit1: AutoComplete;
  @ViewChild('debit2') vcDebit2: AutoComplete;

  setEmptyData(columnName) {
    this.goodsForm.controls[columnName].setValue('');
  }

  onAddEditAccountDetail(isDebit1?: boolean) {
    this.addEditAccountDetail.tabIndex = -1;
    this.addEditAccountDetail.show(
      AddAccountDetailType.CT1,
      isDebit1
        ? this.form?.value?.debitCode
        : this.form?.value?.debitDetailCodeFirst,
    );
  }

  onAddEditAccountSuccess() {}

  onAddEditFirstChildAccountSuccess() {}
  @ViewChild('dropdownRef') dropdownRef: Dropdown;
  @HostListener('document:keydown', ['$event'])
  async handleKeyboardEvent(event: KeyboardEvent) {
    if (!this.display) return;

    switch (event.key) {
      case 'F8':
        this.dropdownRef.focus();
        await this.onSubmit();
        break;
      case 'F6':
        event.preventDefault();
        this.onCancel.emit({});
        break;
    }
  }
}
