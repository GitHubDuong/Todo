import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { TypeData } from '../../../models/common.model';
import { PageFilterSalaryHistory, SalaryHistoryService } from '../../../service/salary-history.service';
import AppConstant from '../../../utilities/app-constants';
import AppUtil from '../../../utilities/app-util';
import { SalaryCalculateService } from '@app/service/salary-calculate.service';
import { SalaryReport } from '@app/models/salary-report.model';
import { NotificationService } from '@app/service/notification.service';

@Component({
  selector: 'app-salary-calculate',
  templateUrl: './salary-calculate.component.html',
  styleUrls: ['./salary-calculate.component.scss'],
})
export class SalaryCalculateComponent implements OnInit {
  public appConstant = AppConstant;

  loading: boolean = true;

  sortFields: any[] = [];
  sortTypes: any[] = [];

  first = 0;

  public getParams = {
    page: 0,
    pageSize: 10,
    searchText: '',
  };

  selectedMonth: Date = new Date();
  public totalRecords = 0;
  public totalPages = 0;

  public isLoading: boolean = false;

  public salariesReports: SalaryReport[] = [];

  display: boolean = false;

  isMobile = screen.width <= 1199;

  formData: any = {};
  isEdit: boolean = false;
  isReset: boolean = false;
  itemSelected = null;

  pendingRequest: any;
  cols: any[] = [
    {
      header: 'label.salary_username',
      value: `username`,
      width: 'width:15%;',
      display: true,
      classify: 'personal_info',
      optionHide: false,
      type: 'string',
    },
    {
      header: 'label.salary_fullname',
      value: 'fullName',
      width: 'width:15%;',
      display: true,
      classify: 'personal_info',
      optionHide: false,
      type: 'string',
    },

    {
      header: 'label.salary_bank_number',
      value: `bankAccountNumber`,
      width: 'width:10%;',
      display: true,
      classify: 'personal_info',
      optionHide: false,
      type: 'string',
    },
    {
      header: 'label.salary_bank_name',
      value: `bankName`,
      width: 'width:10%;',
      display: true,
      classify: 'personal_info',
      optionHide: false,
      type: 'string',
    },
    {
      header: 'label.salary_number_working_days',
      value: `numberOfWorkingDays`,
      width: 'width: 8rem;',
      display: true,
      classify: 'personal_info',
      optionHide: false,
      type: 'number',
    },
    {
      header: 'label.salary_salary_amount',
      value: 'salary',
      width: 'width: 8rem;',
      display: true,
      classify: 'personal_info',
      optionHide: true,
      type: 'number',
    },
    {
      header: 'label.salary_contractual_salary',
      value: 'contractualSalary',
      width: 'width: 8rem;',
      display: true,
      classify: 'personal_info',
      optionHide: true,
      type: 'number',
    },
    {
      header: 'label.salary_allowance_amount',
      value: 'allowanceAmount',
      width: 'width: 8rem;',
      display: true,
      classify: 'personal_info',
      optionHide: true,
      type: 'string',
    },
    {
      header: 'label.salary_sale_commission',
      value: 'saleCommission',
      width: 'width: 8rem;',
      display: true,
      classify: 'personal_info',
      optionHide: true,
      type: 'number',
    },
    {
      header: 'label.salary_deduce_meal_cost',
      value: 'deduceMealCost',
      width: 'width: 10rem;',
      display: true,
      classify: 'personal_info',
      optionHide: true,
      type: 'number',
    },
    {
      header: 'label.salary_remaining_amount',
      value: 'remainingAmount',
      width: 'width: 8rem;',
      display: true,
      classify: 'personal_info',
      optionHide: true,
      type: 'number',
    },
  ];

  constructor(
    private messageService: MessageService,
    private readonly translateService: TranslateService,
    private readonly confirmationService: ConfirmationService,
    private readonly salaryHistoryService: SalaryHistoryService,
    private readonly salaryCalculateService: SalaryCalculateService,
    private readonly notificationService: NotificationService,
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
    console.log(this.selectedMonth);
    let params = {
      ...this.getParams,
      month: this.selectedMonth.getMonth(),
      year: this.selectedMonth.getFullYear()
    }

    this.salaryCalculateService.getListSalary(params).subscribe((response: TypeData<SalaryReport>) => {
      AppUtil.scrollToTop();
      this.salariesReports = response.data;
      this.totalRecords = response.totalItems || 0;
      this.totalPages = response.totalItems / response.pageSize + 1;
      this.loading = false;
      console.log(this.salariesReports);
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

  onCalculateSalary() {
    let params = {
      ...this.getParams,
      month: this.selectedMonth.getMonth(),
      year: this.selectedMonth.getFullYear()
    }
    this.salaryCalculateService.calculateSalary(params).subscribe(res => {
      this.notificationService.success(`Đã tính lương cho tháng ${params.month}/${params.year}`)
    })
  }

  onExportExcel(): void {
    let params = {
      ...this.getParams,
      month: this.selectedMonth.getMonth(),
      year: this.selectedMonth.getFullYear()
    }
    this.salaryCalculateService.exportExcel(params).subscribe((res) => {
      this.openDownloadFile(res.data, 'excel');
    });
  }

  onExportPdf(): void {
    let params = {
      ...this.getParams,
      month: this.selectedMonth.getMonth(),
      year: this.selectedMonth.getFullYear()
    }
    this.salaryCalculateService.exportPdf(params).subscribe((res) => {
      this.openDownloadFile(res.data, 'pdf');
    });
  }

  openDownloadFile(fileName: string, filetype: string) {
    try {
      const filePath = this.salaryCalculateService.getFolderPathDownload(fileName, filetype);

      if (filePath) window.open(filePath);
    } catch (ex) {}
  }
}
