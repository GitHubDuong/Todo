import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Branch } from '../../../models/branch.model';
import { TypeData } from '../../../models/common.model';
import { SalaryUserVersionModel } from '../../../models/salary-user-version.model';
import { PageFilterSalaryHistory, SalaryHistoryService } from '../../../service/salary-history.service';
import AppConstant from '../../../utilities/app-constants';
import AppUtil from '../../../utilities/app-util';
import { SalaryHistoryFormComponent } from './components/salary-history-form/salary-history-form.component';

@Component({
  selector: 'app-salary-history',
  templateUrl: './salary-history.component.html',
  styleUrls: ['./salary-history.component.scss'],
})
export class SalaryHistoryComponent implements OnInit {
  public appConstant = AppConstant;
  @ViewChild('decideForm') SalaryHistoryFormComponent: SalaryHistoryFormComponent | undefined;

  loading: boolean = true;

  sortFields: any[] = [];
  sortTypes: any[] = [];

  first = 0;

  public getParams: PageFilterSalaryHistory = {
    page: 0,
    pageSize: 10,
    searchText: '',
  };
  public totalRecords = 0;
  public totalPages = 0;

  public isLoading: boolean = false;

  public lstSalaryHistory: Branch[] = [];

  display: boolean = false;

  isMobile = screen.width <= 1199;

  formData: any = {};
  isEdit: boolean = false;
  isReset: boolean = false;
  itemSelected = null;

  pendingRequest: any;
  cols: any[] = [
    {
      header: 'label.salary_history_code',
      value: 'code',
      width: 'width:8%;',
      display: true,
      classify: 'personal_info',
      optionHide: false,
      type: 'string',
    },
    {
      header: 'label.salary_history_fullname',
      value: `userFullName`,
      width: 'width:15%;',
      display: true,
      classify: 'personal_info',
      optionHide: false,
      type: 'string',
    },
    {
      header: 'label.salary_history_contract_type',
      value: 'contractTypeName',
      width: 'width:15%;',
      display: true,
      classify: 'personal_info',
      optionHide: false,
      type: 'string',
    },

    {
      header: 'label.salary_history_effective_from',
      value: `effectiveFrom`,
      width: 'width:15%;',
      display: true,
      classify: 'personal_info',
      optionHide: false,
      type: 'date',
    },
    {
      header: 'label.salary_history_effective_to',
      value: `effectiveTo`,
      width: 'width:15%;',
      display: true,
      classify: 'personal_info',
      optionHide: false,
      type: 'date',
    },
    {
      header: 'label.salary_history_basic_salary',
      value: `socialInsuranceSalary`,
      width: 'width:15%;',
      display: true,
      classify: 'personal_info',
      optionHide: false,
      type: 'number',
    },
    {
      header: 'label.salary_history_net_salary',
      value: 'salaryTo',
      width: 'width:15%;',
      display: true,
      classify: 'personal_info',
      optionHide: true,
      type: 'number',
    },
    {
      header: 'label.salary_history_net_percentage',
      value: 'percentage',
      width: 'width: 10rem;',
      display: true,
      classify: 'personal_info',
      optionHide: true,
      type: 'number',
    },
    {
      header: 'label.salary_history_note',
      value: 'note',
      width: 'width: 10rem;',
      display: true,
      classify: 'personal_info',
      optionHide: true,
      type: 'string',
    },
  ];

  constructor(
    private messageService: MessageService,
    private readonly translateService: TranslateService,
    private readonly confirmationService: ConfirmationService,
    private readonly salaryHistoryService: SalaryHistoryService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.getSalaryHistories();
  }

  getSalaryHistories(event?: any): void {
    this.loading = true;
    if (event) {
      this.getParams.page = event.first / event.rows;
      this.getParams.pageSize = event.rows;
    }
    Object.keys(this.getParams).forEach((k) => this.getParams[k] == null && delete this.getParams[k]);
    this.salaryHistoryService.getListSalaryHistory(this.getParams).subscribe((response: TypeData<SalaryUserVersionModel>) => {
      AppUtil.scrollToTop();
      this.lstSalaryHistory =
        response.data?.reduce((arr, curr) => {
          arr.push({
            ...curr,
            percentage: curr.salaryFrom ? Math.floor((curr.salaryTo / (curr.salaryFrom || 1)) * 100) : 0,
          });
          return arr;
        }, []) || [];
      this.totalRecords = response.totalItems || 0;
      this.totalPages = response.totalItems / response.pageSize + 1;
      this.loading = false;
    });
  }

  onAddSalaryHistory() {
    this.display = true;
  }

  onUpdateSalaryHistory(item) {
    this.itemSelected = item;
    this.display = true;
  }

  onDeleteSalaryHistory(itemDelete) {
    let message;
    let header;
    this.translateService.get('question.delete_decide_content').subscribe((res) => {
      message = res;
    });
    this.translateService.get('question.delete_decide_header').subscribe((res) => {
      header = res;
    });
    this.confirmationService.confirm({
      header: header,
      message: message,
      accept: () => {
        this.salaryHistoryService.deleteSalaryHistory(itemDelete.id).subscribe((response: any) => {
          this.getSalaryHistories();
        });
      },
    });
  }

  onCancel(event) {
    this.display = false;
    this.itemSelected = null;
    this.getSalaryHistories();
  }
}
