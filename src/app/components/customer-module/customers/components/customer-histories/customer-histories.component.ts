import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import * as moment from 'moment';
import { AppMainComponent } from 'src/app/layouts/app.main.component';
import { TypeData } from 'src/app/models/common.model';
import { CustomerContactHistory } from 'src/app/models/customer-contact-history.model';
import { Customer } from 'src/app/models/customer.model';
import {
  CustomerContactHistoryService,
  PageFilterCustomerContactHistory,
} from 'src/app/service/customer-contact-history.service';
import { CustomerJobService } from 'src/app/service/customer-job.service';
import AppConstant from 'src/app/utilities/app-constants';
import { environment } from 'src/environments/environment';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmationService } from 'primeng/api';
import { Router } from '@angular/router';
import { ContactHistoryFormComponent } from '../contact-history-form/contact-history-form.component';
import { CustomerService } from '../../../../../service/customer.service';

@Component({
  selector: 'app-customer-histories',
  templateUrl: './customer-histories.component.html',
  styles: [
    `
      :host ::ng-deep {
        .p-datatable .p-datatable-thead > tr > th,
        .field > label,
        .p-column-title {
          min-width: 8rem;
        }
        .p-dropdown .p-dropdown-panel {
          max-width: unset;
        }

        .p-calendar .p-datepicker {
          min-width: 300px;
        }

        .card-table {
          min-height: auto !important;
        }

        .p-paginator {
          height: auto !important;
        }

        .p-disabled {
          background-color: inherit !important;
        }

        .p-button,
        .p-button .p-button-icon-left,
        .p-datatable-scrollable-both .p-datatable-tbody > tr > td {
          font-size: 0.875rem !important;
        }

        .p-datatable-tbody {
          min-height: auto !important;
        }

        .card {
          padding: 0 !important;
        }

        .field {
          margin-bottom: 0 !important;
        }

        p-badge,
        .p-badge {
          width: 100% !important;
        }

        .p-badge {
          text-overflow: ellipsis !important;
          overflow: hidden !important;
          white-space: nowrap !important;
        }

        @media screen and (max-width: 768px) {
          p-badge {
            text-align: right;
          }
        }
      }
    `,
  ],
})
export class CustomerHistoriesComponent implements OnInit {
  @Input('customer') customer: Customer;
  @Input('customerStatus') customerStatus: any[];
  @Input('customerJobs') customerJobs: any[];
  @Output() onCancel = new EventEmitter();
  @ViewChild('contactForm') contactForm: ContactHistoryFormComponent;

  isMobile = this.appMain.isMobile();
  serverURLImage = environment.serverURLImage;

  public appConstant = AppConstant;
  public getParams: PageFilterCustomerContactHistory = {
    customerId: 0,
    page: 0,
    pageSize: 5,
    sortField: 'id',
    isSort: true,
    searchText: '',
    jobId: 0,
    status: 0,
    fromDate: new Date(),
    toDate: new Date(),
  };

  pendingRequest: any;

  customers: CustomerContactHistory[] = [];
  public totalRecords = 0;
  public totalPages = 0;
  public loading = false;
  first = 0;

  formData: any = {};
  isEdit: boolean = false;
  display = false;

  constructor(
    private customerContactHistoryService: CustomerContactHistoryService,
    private readonly customerService: CustomerService,
    private appMain: AppMainComponent,
    private translateService: TranslateService,
    private confirmService: ConfirmationService,
    private readonly customerJobService: CustomerJobService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.getParams.fromDate = moment().date(1).toDate();
    this.getJobsAndStatus();
  }

  onSearch(event) {
    if (event.key === 'Enter') {
      this.getDescs(null);
    }
  }

  getDescs(event?: any) {
    let body = { ...this.getParams };
    if (this.pendingRequest) {
      this.pendingRequest.unsubscribe();
    }
    this.loading = true;
    if (event) {
      body.page = event.first / event.rows;
      body.pageSize = event.rows;
    }
    body.customerId = this.customer.id;

    if (body.jobId === 0) {
      delete body.jobId;
    }

    if (body.status === 0) {
      delete body.status;
    }

    Object.keys(body).forEach((key) => {
      if (
        (typeof body[key] === 'string' && !body[key]?.trim()?.length) ||
        body[key] === null
      ) {
        delete body[key];
      }
      if (body[key] && ['fromDate', 'toDate'].includes(key)) {
        body[key] = new Date(body[key]).toISOString();
      }
    });
    this.pendingRequest = this.customerContactHistoryService
      .getCustomerContactHistoryByCustomer(body)
      .subscribe((response: TypeData<CustomerContactHistory>) => {
        this.customers = response.data;
        this.totalRecords = response.totalItems || 0;
        this.totalPages = response.totalItems / response.pageSize + 1;
        this.loading = false;
      });
  }

  getJobsAndStatus() {
    this.customerJobService
      .getJobAndStatusExistingInCustomerHistories(this.customer.id)
      .subscribe((res) => {
        this.customerJobs = res.jobs;
        this.customerStatus = res.statuses;
      });
  }

  contactTemp;
  getDetail(userId, data) {
    this.formData = data;
    this.isEdit = true;
    this.display = true;
    this.customerContactHistoryService
      .getCustomerContactHistoryDetail(userId)
      .subscribe((res) => {
        this.contactTemp = res;
        this.customerService
          .getCustomerDetail(res.customerId)
          .subscribe((response: any) => {
            this.contactForm.onReset(response.data, res);
          });
      });
  }

  onDelete(userId) {
    let message;
    this.translateService
      .get('question.delete_contact_history_content')
      .subscribe((res) => {
        message = res;
      });
    this.confirmService.confirm({
      message: message,
      accept: () => {
        this.customerContactHistoryService
          .deleteCustomerHistory(userId)
          .subscribe(() => {
            this.first = 0;
            this.getDescs(null);
          });
      },
    });
  }

  getCurrentMenu() {
    switch (this.router.url) {
      case '/uikit/suppliers': {
        return this.appConstant.MENU_TYPE.DANHSACHNHACUNGCAP;
      }
      case '/uikit/web-customers': {
        return this.appConstant.MENU_TYPE.DANHSACHKHACHHANGWEB;
      }
      default:
        return this.appConstant.MENU_TYPE.DANHSACHKHACHHANG;
    }
  }
}
