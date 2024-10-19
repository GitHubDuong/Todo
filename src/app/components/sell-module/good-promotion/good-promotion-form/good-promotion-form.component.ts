import { Component, OnInit } from '@angular/core';
import { BaseDetailComponent } from "@app/shared/components/base-detail.component";
import { FormBuilder, FormControl, Validators } from "@angular/forms";
import { NotificationService } from "@app/service/notification.service";
import { PromotionService } from "@app/service/promotion.service";
import { CustomerClassificationService } from "@app/service/customer-classification.service";
import { ProvinceService } from "@app/service/province.service";
import { forkJoin } from "rxjs";
import AppConstant from "@utilities/app-constants";
import * as moment from 'moment/moment';
import { ChartOfAccount } from "@app/models/case.model";
import AppUtil from "@utilities/app-util";

@Component({
  selector: 'app-good-promotion-form',
  templateUrl: './good-promotion-form.component.html',
  styleUrls: ['./good-promotion-form.component.scss']
})
export class GoodPromotionFormComponent extends BaseDetailComponent implements OnInit {
  protected cars: any[] = [];
  customerTypes: any[] = [];
  provinces: any[] = [];
  selectedFile: any;
  promotionGoods: any[] = [];

  constructor(
    private fb: FormBuilder,
    protected readonly promotionService: PromotionService,
    protected readonly notificationService: NotificationService,
    private readonly customerClassificationService: CustomerClassificationService,
    private readonly provinceService: ProvinceService
  ) {
    super(promotionService, notificationService);
  }

  initForm(data: any = null): void {
    this.promotionGoods = (data?.items ?? []).map((item: any) => {
      let account = item.accountObj;
      if(account) {
        account.displaySelected = `${ account.code } - ${ account.name }`
      }

      let detail1 = item.detail1Obj;
      if(detail1) {
        detail1.displaySelected = `${ detail1.code } - ${ detail1.name }`
      }

      let detail2 = item.detail2Obj;
      if(detail2) {
        detail2.displaySelected = `${ detail2.code } - ${ detail2.name }`
      }

      return {
        ...item,
        detail1,
        detail2,
        account,
      }
    });

    this.detailForm = this.fb.group({
      id: new FormControl(data?.id ?? 0, Validators.required),
      fromAt: new FormControl(data ? moment(data.fromAt).format(AppConstant.FORMAT_DATE.VN_DATE_PIPE_SHORT_DATE) : null, Validators.required),
      toAt: new FormControl(data ? moment(data.toAt).format(AppConstant.FORMAT_DATE.VN_DATE_PIPE_SHORT_DATE): null, Validators.required),
      code: new FormControl(data?.code, Validators.required),
      name: new FormControl(data?.name, Validators.required),
      value: new FormControl(data?.value ?? 0),
      customerNote: new FormControl(data?.customerNote),
      address: new FormControl(data?.address),
      note: new FormControl(data?.note),
    })
  }

  ngOnInit(): void {
    forkJoin({
      customerTypes: this.customerClassificationService.getAllCustomerClassification(),
      provinces: this.provinceService.getListProvince()
    }).subscribe(res => {
      this.customerTypes = res.customerTypes.data;
      this.provinces = res.provinces;
    });
  }

  submit() {
    let request = this.detailForm.value;
    request.items = this.promotionGoods.map((item: any) => {
      const account = item.account as ChartOfAccount;
      const detail1 = item.detail1 as ChartOfAccount;
      const detail2 = item.detail2 as ChartOfAccount;
      return {
        ...item,
        account: account?.code,
        accountName: account?.name,
        detail1: detail1?.code,
        detail1Name: detail1?.name,
        detail2: detail2?.code,
        detail2Name: detail2?.name,
      };
    });

    request.fromAt = AppUtil.formatLocalTimezone(
      moment(request.fromAt, AppConstant.FORMAT_DATE.VN_DATE_PIPE_SHORT_DATE).format(AppConstant.FORMAT_DATE.T_DATE),
    );

    request.toAt = AppUtil.formatLocalTimezone(
      moment(request.toAt, AppConstant.FORMAT_DATE.VN_DATE_PIPE_SHORT_DATE).format(AppConstant.FORMAT_DATE.T_DATE),
    );

    this.onSubmit(request)?.subscribe(res => {
      this.notificationService.success(this.isEdit ? 'success.update' : 'success.create');
      this.toggleVisible()
      this.onFormClosing.emit(true);
    })
  }

  addItem() {
    this.promotionGoods.push({
      id: 0,
      account: '',
      accountName: '',
      detail1: '',
      detail1Name: '',
      detail2: '',
      detail2Name: '',
      discount: 0,
      standard: '',
      quantityFrom: 0,
    });
  }

  deleteItem(index: number) {
    this.promotionGoods.splice(index, 1);
  }
}