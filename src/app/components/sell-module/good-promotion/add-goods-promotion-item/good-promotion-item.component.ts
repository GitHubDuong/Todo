import { IGoodsPromotion, IGoodsPromotionItem } from "@app/models/goods-promotion.model";
import { AutoComplete } from "primeng/autocomplete";
import {
  ChangeDetectorRef, Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  Renderer2,
  ViewChild
} from "@angular/core";
import { ConfigAriseEnum } from "@app/models/config-arise.model";
import { UserRoleCRUD } from "@app/models/user-role.model";
import { ChartOfAccount } from "@app/models/case.model";
import { MessageService } from "primeng/api";
import { PromotionService } from "@app/service/promotion.service";
import { ChartOfAccountService } from "@app/service/chart-of-account.service";
import AppUtil from "@utilities/app-util";
import { finalize } from "rxjs/operators";
import { InputNumber } from "primeng/inputnumber";
import { InputMask } from "primeng/inputmask";
import { map } from "rxjs";
import * as _ from 'lodash';

export interface IAccountDetailParams {
  page: number;
  pageSize: number;
  parentCode: string;
  searchText: string;
  totalItems: number;
  isLoading: boolean;
}

@Component({
  selector: 'app-good-promotion-item',
  templateUrl: './good-promotion-item.component.html',
  styleUrls: ['./good-promotion-item.component.scss'],
})

export class GoodPromotionItemComponent implements OnInit {
  @Output() onRemove = new EventEmitter();
  @ViewChild('accountDetail1Ele') private accountDetail1Ele: AutoComplete;
  @ViewChild('accountDetail2Ele') private accountDetail2Ele: AutoComplete;
  @Input()
  // set promotionDetails(detail: IGoodsPromotion) {
  //   if (!detail) {
  //     return;
  //   }
  //
  //   this._promotionDetails = { ...detail };
  // }
  //
  // get promotionDetails(): IGoodsPromotion {
  //   return this._promotionDetails;
  // }

  // @Input() provinces: Province[] = [];
  // @Input() customerTypes: CustomerClassification[] = [];
  // @Input() isEdit = false;
  //
  // @Output() onCancel = new EventEmitter();

  configAriseEnum = ConfigAriseEnum;

  currentPageRole: UserRoleCRUD;
  //
  // promotionItem: IGoodsPromotionItem = {
  //   id: 0,
  //   account: '',
  //   accountName: '',
  //   detail1: '',
  //   detail1Name: '',
  //   detail2: '',
  //   detail2Name: '',
  //   discount: 0,
  //   standard: '',
  //   quantityFrom: 0,
  // };
  //
  chartOfAccounts: ChartOfAccount[] = [];
  accountFilter: any[] = [];
  accountDetail1Filter: any[] = [];
  accountDetail2Filter: any[] = [];
  accountDetail1Page: IAccountDetailParams = {
    page: 1,
    pageSize: 20,
    parentCode: '',
    searchText: '',
    totalItems: -1,
    isLoading: false,
  };
  accountDetail2Page: IAccountDetailParams = {
    page: 1,
    pageSize: 20,
    parentCode: '',
    searchText: '',
    totalItems: -1,
    isLoading: false,
  };
  //
  // totalRecords = 0;
  // totalPages = 0;
  //
  isMobile = screen.width <= 1199;
  //
  // selectedFile: any;
  //
  errors = {
    fromAt: '',
    toAt: '',
    code: '',
    value: '',
    customerNote: '',
    note: '',
    standard: '',
    quantityFrom: '',
    discount: '',
    detail1: '',
    detail2: ''
  };

  // isLoading = false;
  //
  private _promotionDetails?: IGoodsPromotion;


  @Input() rowData: any;
  @Input() rowIndex: number;

  constructor(
    private renderer: Renderer2,
    private chartOfAccountService: ChartOfAccountService,
  ) { }

  ngOnInit(): void {
    this.currentPageRole = AppUtil.getMenus('CHUONGTRINHKHUYENMAI');
    this.getChartOfAccounts();
    console.log(this.rowData);
  }

  getAccountDetail(params: IAccountDetailParams) {
    return this.chartOfAccountService
    .getDetailV2(params.parentCode, params)
    .pipe(
      map(({ data, ...res }) => ({
        data: data.map(item => ({ ...item, displaySelected: `${ item.code } - ${ item.name }` })),
        ...res
      }))
    );
  }

  checkValidValidator(fieldName: string) {
    return fieldName in this.errors
      ? !!this.errors[fieldName] ? 'ng-invalid ng-dirty' : ''
      : '';
  }

  getChartOfAccounts(): void {
    this.chartOfAccountService
    .getAllByDisplayInsert()
    .pipe(
      map(res => res.map(item => ({
            ...item,
            displaySelected: `${ item.code } - ${ item.name }`
          })
        )
      )
    )
    .subscribe((res: any) => {
      this.chartOfAccounts = res;
    });
  }

  filterAccount(event: any, item: any): void {
    if (!event) {
      this.accountFilter = [];
      return;
    }
    event.query = event.query || '';

    if (item.account instanceof String) {
      event.query = item.account || '';
    } else if (item.account instanceof Object) {
      event.query = item.account?.code || '';
      this.accountFilter = [_.cloneDeep(item.account)];
      return;
    }

    this.accountFilter = _.filter(_.cloneDeep(this.chartOfAccounts), (item) => {
      return (
        item.name &&
        item.name !== '' &&
        item.code.toLowerCase().startsWith(event.query.toLowerCase())
      );
    });
  }

  filterAccountDetail1(event: any, item: any) {
    if (!event) {
      this.accountDetail1Filter = [];
      return;
    }

    if (!item.account) {
      this.accountDetail1Filter = [];
      return;
    }
    event.query = event.query || '';
    if (item.detail1 instanceof String) {
      event.query = item.detail1 || '';
    } else if (item.detail1 instanceof Object) {
      this.accountDetail1Filter = [item.detail1];
      return;
    }

    this.accountDetail1Page = {
      ...this.accountDetail1Page,
      searchText: event.query,
      parentCode: item.account?.code,
      page: 1,
      totalItems: -1,
    };

    const callBack = () => {
      setTimeout(() => {
        const autocompletePanel = this.accountDetail1Ele.el.nativeElement.querySelector('.p-autocomplete-panel');

        if (autocompletePanel && this.accountDetail1Filter.length > 0) {
          this.renderer.listen(autocompletePanel, 'scroll', event => {
            if (event.target.scrollHeight - event.target.clientHeight === event.target.scrollTop) {
              this.getAccountDetail1(null);
            }
          });
        }
      }, 1000);
    };

    this.getAccountDetail1(callBack);
  }

  filterAccountDetail2(event: any, item: any) {
    if (!event) {
      this.accountDetail2Filter = [];
      return;
    }

    if (!item.detail1) {
      this.accountDetail2Filter = [];
      return;
    }

    event.query = event.query || '';

    if (item.detail2 instanceof String) {
      event.query = item.detail2 || '';
    } else if (item.detail2 instanceof Object) {
      this.accountDetail2Filter = [item.detail2];

      return;
    }

    this.accountDetail2Page = {
      ...this.accountDetail2Page,
      searchText: event.query,
      parentCode: `${item.account?.code}:${item.detail1?.code}`,
      page: 1,
      totalItems: -1,
    };

    const callBack = () => {
      setTimeout(() => {
        const autocompletePanel = this.accountDetail2Ele.el.nativeElement.querySelector('.p-autocomplete-panel');

        if (autocompletePanel && this.accountDetail2Filter.length > 0) {
          this.renderer.listen(autocompletePanel, 'scroll', event => {
            if (event.target.scrollHeight - event.target.clientHeight === event.target.scrollTop) {
              this.getAccountDetail2(null);
            }
          });
        }
      }, 1000);
    };

    this.getAccountDetail2(callBack);
  }

  onSelectAccount(event: any, item: IGoodsPromotionItem, detail1ElementId: string) {
    item.account = event;
    const nextFocusedEle = document.getElementById(detail1ElementId) as HTMLInputElement;
    this.focusInput(nextFocusedEle);
  }


  onSelectAccountDetail1(event: any, item: any, detail2ElementId: string): void {
    if (!(item.detail1 instanceof Object && event.code === item.detail1?.code)) {
      item.detail1 = event;
      item.detail2 = '';
    }

    if (item.detail1 && item.detail1?.hasDetails) {
      const nextFocusedEle = document.getElementById(detail2ElementId) as HTMLInputElement;
      this.focusInput(nextFocusedEle);
    }
  }

  onSelectAccountDetail2($event: any, item: any) {
    if (!(item.detail instanceof Object && $event.code === item.detail2.code)) {
      item.detail2 = $event;
    }
  }

  setAccountValue(value: string, item: IGoodsPromotionItem) {
    item.account = value;
  }

  setAccountDetail1(value: string, item: IGoodsPromotionItem) {
    item.detail1 = value;
  }

  setAccountDetail2(value: string, item: IGoodsPromotionItem) {
    item.detail2 = value;
  }

  onClearAccount(item: IGoodsPromotionItem) {
    item.account = '';
    item.detail1 = '';
    item.detail2 = '';
  }

  onClearAccountDetail1(item: IGoodsPromotionItem, detail1ElementId: string) {
    const nextFocusedEle = document.getElementById(detail1ElementId) as HTMLInputElement;
    item.detail1 = '';
    item.detail2 = '';
    this.focusInput(nextFocusedEle);
  }

  onClearAccountDetail2(item: IGoodsPromotionItem, detail2ElementId: string, focusInput = true) {
    item.detail2 = '';

    if (focusInput) {
      const nextFocusedEle = document.getElementById(detail2ElementId) as HTMLInputElement;
      this.focusInput(nextFocusedEle);
    }
  }

  focusInput(input: InputMask | InputNumber | AutoComplete | ElementRef | HTMLInputElement): void {
    setTimeout(() => {
      switch (true) {
        case input instanceof InputMask:
          (input as InputMask)?.focus();
          break;
        case input instanceof InputNumber:
          (input as InputNumber)?.input?.nativeElement?.focus();
          break;
        case input instanceof ElementRef:
          (input as ElementRef)?.nativeElement?.focus();
          break;
        case input instanceof AutoComplete:
          (input as AutoComplete)?.focusInput();
          break;
        default:
          (input as HTMLInputElement)?.focus();
          break;
      }
    }, 150);
  }

  onKeyUpAutoCompleteLazyLoading($event: any) {
    if ($event.event.key !== 'ArrowDown') {
      return;
    }

    const key = $event.key;

    try {
      const autocompletePanel = this[`${ ConfigAriseEnum[key] }Tmp`].el.nativeElement.querySelector('.p-autocomplete-panel');

      if (autocompletePanel && this[`${ ConfigAriseEnum[key] }Filter`].length > 0) {
        if (autocompletePanel.scrollHeight - autocompletePanel.clientHeight - 10 <= autocompletePanel.scrollTop) {
          const str = ConfigAriseEnum[key].charAt(0).toUpperCase() + ConfigAriseEnum[key].slice(1);
          this[`get${ str }`](null);
        }
      }
    } catch {}
  }

  // addItem() {
  //   this.promotionDetails.items.push({ ...this.promotionItem });
  //   this.totalRecords = this.promotionDetails.items.length || 0;
  //   this.totalPages = this.promotionDetails.items.length / (10 + 1);
  // }
  //
  // deleteItem(index: number) {
  //   if (this.promotionDetails.items.length === 1) {
  //     this.promotionDetails.items = [{ ...this.promotionItem }];
  //   } else {
  //     const items = cloneDeep(this.promotionDetails.items);
  //     items.splice(index, 1);
  //     this.promotionDetails.items = items;
  //   }
  // }
  //
  // createPromotion(data: any) {
  //   this.promotionService.create(data)
  //   .pipe(
  //     catchError(error => {
  //       this.messageService.add({
  //         severity: 'error',
  //         detail: 'Đã xảy ra lỗi. Vui lòng thử lại sau.',
  //       });
  //       return EMPTY;
  //     }),
  //     finalize(() => this.isLoading = false)
  //   )
  //   .subscribe(res => {
  //     this.messageService.add({
  //       severity: 'success',
  //       detail: 'Tạo thành công',
  //     });
  //     this.onCancel.emit();
  //   });
  // }
  //
  // updatePromotion(data: any) {
  //   this.promotionService.update(this.promotionDetails.id, data)
  //   .pipe(
  //     catchError(error => {
  //       this.messageService.add({
  //         severity: 'error',
  //         detail: 'Đã xảy ra lỗi. Vui lòng thử lại sau.',
  //       });
  //       return EMPTY;
  //     }),
  //     finalize(() => this.isLoading = false)
  //   )
  //   .subscribe(res => {
  //     this.messageService.add({
  //       severity: 'success',
  //       detail: 'Cập nhật thành công',
  //     });
  //     this.onCancel.emit();
  //   });
  // }
  //
  // onSubmit() {
  //   const error = Object.values(this.errors).filter(error => !!error);
  //
  //   if (error.length) {
  //     this.messageService.add({
  //       severity: 'info',
  //       detail: 'Vui lòng kiểm tra lại thông tin đã nhập.',
  //     });
  //
  //     return;
  //   }
  //
  //   this.isLoading = true;
  //
  //   Object.entries(this.promotionDetails).forEach(([key, value]) => {
  //     if (key === 'fromAt' || key === 'toAt') {
  //       value = AppUtil.formatLocalTimezone(
  //         moment(value, AppConstant.FORMAT_DATE.VN_DATE_PIPE_SHORT_DATE).format(AppConstant.FORMAT_DATE.T_DATE),
  //       );
  //     }
  //
  //     this.promotionDetails[key] = value;
  //   });
  //
  //   this.promotionDetails.items = this.promotionDetails.items.map(item => {
  //     return {
  //       ...item,
  //       account: (item.account as ChartOfAccount)?.code,
  //       accountName: (item.account as ChartOfAccount)?.name,
  //       detail1: (item.detail1 as ChartOfAccount)?.code,
  //       detail1Name: (item.detail1 as ChartOfAccount)?.name,
  //       detail2: (item.detail2 as ChartOfAccount)?.code,
  //       detail2Name: (item.detail2 as ChartOfAccount)?.name,
  //     };
  //   });
  //
  //   this.promotionDetails.id > 0
  //     ? this.updatePromotion(this.promotionDetails)
  //     : this.createPromotion(this.promotionDetails);
  // }
  //

  private getAccountDetail1(callBack): void {
    if (
      this.accountDetail1Page.isLoading ||
      this.accountDetail1Page.totalItems === this.accountDetail1Filter.length
    ) {
      return;
    }

    this.accountDetail1Page.isLoading = true;

    const params = _.cloneDeep(this.accountDetail1Page);

    delete params.isLoading;
    delete params.totalItems;

    this
    .getAccountDetail(params)
    .subscribe(({ data, totalItems }) => {
      if (this.accountDetail1Page.page === 1) {
        this.accountDetail1Filter = [];
      }

      this.accountDetail1Filter = this.accountDetail1Filter.concat(data);
      this.accountDetail1Page.page++;
      this.accountDetail1Page = {
        ...this.accountDetail1Page,
        totalItems,
        isLoading: false,
      };

      if (callBack) {
        callBack();
      }
    });
  }

  private getAccountDetail2(callBack) {
    if (
      this.accountDetail2Page.isLoading ||
      this.accountDetail2Page.totalItems === this.accountDetail2Filter.length
    ) {
      return;
    }

    this.accountDetail2Page.isLoading = true;

    const params = _.cloneDeep(this.accountDetail2Page);

    delete params.isLoading;
    delete params.totalItems;

    this
    .getAccountDetail(params)
    .subscribe(({ data, totalItems }) => {
      if (this.accountDetail2Page.page === 1) {
        this.accountDetail2Filter = [];
      }
      this.accountDetail2Filter = this.accountDetail2Filter.concat(data);
      this.accountDetail2Page.page++;
      this.accountDetail2Page = {
        ...this.accountDetail2Page,
        totalItems,
        isLoading: false,
      };

      if (callBack) {
        callBack();
      }
    });
  }
}
