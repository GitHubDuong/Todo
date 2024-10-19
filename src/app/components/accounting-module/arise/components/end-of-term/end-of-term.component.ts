import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { AutoComplete } from 'primeng/autocomplete';
import { TypeData } from 'src/app/models/common.model';
import { EndOfTermEnding } from 'src/app/models/end-of-term-ending';
import { EndOfTermEndingService } from 'src/app/service/end-of-term-ending.service';
import AppUtil from 'src/app/utilities/app-util';
import { ChartOfAccountService } from '../../../../../service/chart-of-account.service';
import AppConstant from '../../../../../utilities/app-constants';

@Component({
  selector: 'app-end-of-term',
  templateUrl: './end-of-term.component.html',
  styleUrls: ['./end-of-term.component.scss'],
})
export class EndOfTermComponent implements OnInit {
  @Input() isInternal = -1;
  @ViewChild('debit') public vcDebit: AutoComplete;
  @ViewChild('credit') vcCredit: AutoComplete;

  @Output() onCancel = new EventEmitter();
  showDetail = false;
  appUtil = AppUtil;
  appConstant = AppConstant;
  loading: boolean = false;
  totalRecords = 0;
  totalPages = 0;
  first = 0;

  endOfTermEndingForm: FormGroup = new FormGroup({});

  chartOfAccounts: any[] = [];
  filteredDebitNames: any[] = [];
  filteredCreditNames: any[] = [];

  endOfTerms = [];
  endOfTermSelected = false;
  getParams: any = {};

  listType: any[] = [
    {
      value: 'debitToCredit',
      label: 'Kết chuyển Nợ qua Có',
    },
    {
      value: 'creditToDebit',
      label: 'Kết chuyển Có qua Nợ',
    },
  ];

  constructor(
    private fb: FormBuilder,
    private endOfTermEndingService: EndOfTermEndingService,
    private chartOfAccountService: ChartOfAccountService,
    private translateService: TranslateService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
  ) {
    this.endOfTermEndingForm = this.fb.group({
      id: [0],
      creditCode: ['', [Validators.required]],
      debitCode: ['', [Validators.required]],
      isDelete: false,
      percentRatio: [100, [Validators.required]],
      type: ['debitToCredit', [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.getChartOfAccounts();
  }

  onReset() {
    this.endOfTermEndingForm.reset();
    this.getEnOfTerms();
  }

  getChartOfAccounts() {
    this.chartOfAccountService.getAllByDisplayInsert().subscribe((res: any) => {
      this.chartOfAccounts = res;
    });
  }

  pendingRequest: any;

  getEnOfTerms(event?: any): void {
    if (this.pendingRequest) {
      this.pendingRequest.unsubscribe();
    }
    this.loading = true;
    if (event) {
      this.getParams.page = event.first / event.rows + 1;
      this.getParams.pageSize = event.rows;
    }
    // remove undefined value
    Object.keys(this.getParams).forEach((k) => this.getParams[k] == null && delete this.getParams[k]);
    this.pendingRequest = this.endOfTermEndingService
      .getListEndOfTermEnding(this.getParams)
      .subscribe((response: TypeData<EndOfTermEnding>) => {
        AppUtil.scrollToTop();
        this.endOfTerms = response.data.map((item: any) => ({ ...item, checked: false }));
        this.totalRecords = response.totalItems || 0;
        this.totalPages = response.totalItems / response.pageSize + 1;
        this.loading = false;
      });
  }

  onEdit(id) {
    this.endOfTermEndingService.getEndOfTermEndingByID(id).subscribe((res: any) => {
      this.endOfTermEndingForm.patchValue({
        id: res.data.id,
        creditCode: res.data.creditCode,
        debitCode: res.data.debitCode,
        percentRatio: res.data.percentRatio,
        type: res.data.type,
      });
    });
  }

  onDelete(id) {
    let message;
    let header;
    this.translateService.get('question.delete_end_of_term_ending_content').subscribe((res) => {
      message = res;
    });
    this.translateService.get('question.delete_end_of_term_ending_header').subscribe((res) => {
      header = res;
    });
    this.confirmationService.confirm({
      header: header,
      message: message,
      accept: () => {
        this.endOfTermEndingService.deleteEndOfTermEnding(id).subscribe((response: any) => {
          this.onReset();
        });
      },
    });
  }

  onSave() {
    if (this.endOfTermEndingForm.invalid) {
      this.messageService.add({
        severity: 'error',
        detail: AppUtil.translate(this.translateService, 'info.please_check_again'),
      });
      return;
    }

    let newData = this.cleanObject(AppUtil.cleanObject(this.endOfTermEndingForm.value));
    newData.isDelete = false;
    if (this.endOfTermEndingForm.value.id > 0) {
      this.endOfTermEndingService.updateEndOfTermEnding(this.endOfTermEndingForm.value.id, newData).subscribe((res: any) => {
        this.messageService.add({
          severity: 'success',
          detail: AppUtil.translate(this.translateService, 'success.update'),
        });
        this.onReset();
      });
    } else {
      this.endOfTermEndingService.createEndOfTermEnding(newData).subscribe((res: any) => {
        this.messageService.add({
          severity: 'success',
          detail: AppUtil.translate(this.translateService, 'success.create'),
        });
        this.onReset();
      });
    }
  }

  onEndAndTransform() {
    this.showDetail = true;
  }

  //#endregion

  cancel() {
    this.onCancel.emit({});
  }

  cleanObject(data) {
    let newData = Object.assign({}, data);
    if (!(newData.id > 0)) {
      newData.id = 0;
    }
    return newData;
  }

  onTransform() {
    let newData = this.cleanObject(AppUtil.cleanObject(this.endOfTermEndingForm.value));
    newData.isDelete = false;
    if (this.endOfTermEndingForm.value.id > 0) {
      this.endOfTermEndingService.updateEndOfTermEnding(this.endOfTermEndingForm.value.id, newData).subscribe((res: any) => {
        this.messageService.add({
          severity: 'success',
          detail: AppUtil.translate(this.translateService, 'success.update'),
        });
        this.onReset();
      });
    } else {
      this.endOfTermEndingService.createEndOfTermEnding(newData).subscribe((res: any) => {
        this.messageService.add({
          severity: 'success',
          detail: AppUtil.translate(this.translateService, 'success.create'),
        });
        this.onReset();
      });
    }
  }
}
