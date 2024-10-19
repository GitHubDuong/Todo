import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { SalaryAdvanceService } from '@app/service/salary-advance.service';
import { ToastService } from '@app/service/toast.service';
import { TranslateService } from '@ngx-translate/core';
import { RequestOvertimesStatus } from '@utilities/app-enum';
import { ConfirmationService } from 'primeng/api';
import { UserRoleCRUD } from 'src/app/models/user-role.model';
import AppUtil from 'src/app/utilities/app-util';
import { SalaryAdvanceRequestFormComponent } from './components/salary-advance-request-form/salary-advance-request-form.component';

@Component({
  selector: 'app-salary-advance-request',
  templateUrl: './salary-advance-request.component.html',
  styleUrls: ['../../../../assets/demo/badges.scss', 'salary-advance-request.component.scss'],
})
export class SalaryAdvanceRequestComponent implements OnInit {
  @ViewChild('salaryLevelForm') SalaryLevelFormComponent: SalaryAdvanceRequestFormComponent | undefined;
  isInvalidForm = false;
  loading: boolean = true;

  sortFields: any[] = [];
  sortTypes: any[] = [];

  pendingRequest: any;

  first = 0;
  isMobile = screen.width <= 1199;
  salaryAdvanceRequest: any[] = [];

  display: boolean = false;
  formData: any = {};
  isEdit: boolean = false;
  isReset: boolean = false;
  totalRecords: number = 0;
  currentPageRole: UserRoleCRUD;

  cols: any[] = [
    {
      header: 'label.number_order',
      value: 'id',
      width: 'width:8%;',
      display: true,
      classify: 'salary_level',
      optionHide: false,
    },
    {
      header: 'label.name',
      value: 'name',
      width: 'width:20%;',
      display: true,
      classify: 'salary_level',
      optionHide: false,
    },
    {
      header: 'label.status',
      value: 'p_ProcedureStatusName',
      width: 'width:20%;',
      display: true,
      classify: 'salary_level',
      optionHide: false,
    },
    {
      header: 'label.position',
      value: 'positionName',
      width: 'width:20%;',
      display: true,
      classify: 'salary_level',
      optionHide: false,
    },
    {
      header: 'label.amount_number',
      value: 'value',
      width: 'width:20%;',
      display: true,
      classify: 'salary_level',
      optionHide: true,
    },
    {
      header: 'label.note',
      value: 'note',
      width: 'width:30%;',
      display: true,
      classify: 'salary_level',
      optionHide: true,
    },
  ];

  public getParams = {
    page: 1,
    pageSize: 5,
  };

  constructor(
    private readonly salaryAdvanceService: SalaryAdvanceService,
    private readonly translateService: TranslateService,
    private readonly confirmationService: ConfirmationService,
    private readonly toastService: ToastService,
  ) {}

  ngOnInit(): void {
    this.currentPageRole = AppUtil.getMenus('BACLUONG');
  }

  onSearch(event) {
    if (event.key === 'Enter') {
      this.getSalaryAdvanceRequest();
    }
  }

  getSalaryAdvanceRequest(event?: any, isExport: boolean = false) {
    if (event) {
      this.getParams.page = event.first / event.rows + 1;
      this.getParams.pageSize = event.rows;
    }
    this.loading = true;
    this.salaryAdvanceService.getSalaryAdvanceRequest(this.getParams).subscribe((res) => {
      this.salaryAdvanceRequest = res.data;
      this.totalRecords = res.totalItems;
      this.loading = false;
    });
  }

  format1(n) {
    return n.toFixed(0).replace(/./g, function (c, i, a) {
      return i > 0 && c !== '.' && (a.length - i) % 3 === 0 ? ',' + c : c;
    });
  }

  getDetail(salaryLevel) {
    this.formData = salaryLevel;
    this.isEdit = true;
    this.showDialog();
  }

  onAddDecide() {
    this.isEdit = false;
    this.showDialog();
  }

  showDialog() {
    this.SalaryLevelFormComponent.onReset();
    this.display = true;
  }

  onDelete(salaryID) {
    let message;
    let header;
    this.translateService.get('question.delete_salary_level_content').subscribe((res) => {
      message = res;
    });
    this.translateService.get('question.delete_salary_level_header').subscribe((res) => {
      header = res;
    });
    this.confirmationService.confirm({
      header: header,
      message: message,
      accept: () => {
        console.log(salaryID);

        this.salaryAdvanceService.deleteSalaryAdvanceRequest(salaryID).subscribe((response: any) => {
          this.getSalaryAdvanceRequest();
        });
      },
    });
  }

  @HostListener('document:keydown', ['$event'])
  async handleKeyboardEvent(event: KeyboardEvent) {
    switch (event.key) {
      case 'F7':
        event.preventDefault();
        await this.onAddDecide();
        break;
    }
  }

  protected readonly RequestOvertimesStatus = RequestOvertimesStatus;

  onAccept(id) {
    this.salaryAdvanceService.accept(id).subscribe((item: any) => {
      this.toastService.success('Chuyển tiếp yêu cầu thành công');
      this.getSalaryAdvanceRequest();
    });
  }

  onNotAccept(id) {
    this.salaryAdvanceService.notAccept(id).subscribe((item: any) => {
      this.toastService.success('Chuyển lại yêu cầu thành công');
      this.getSalaryAdvanceRequest();
    });
  }
}
