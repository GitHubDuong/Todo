import { Component, OnInit, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ProcedureService } from 'src/app/service/procedure.service';
import AppConstant from 'src/app/utilities/app-constants';
import AppUtil from 'src/app/utilities/app-util';
import { ProcessManagementFormComponent } from './process-management-form/process-management-form.component';
import { UserRoleService } from 'src/app/service/user-role.service';
import { UserService } from 'src/app/service/user.service';

@Component({
  selector: 'app-process-management',
  templateUrl: './process-management.component.html',
  styleUrls: ['./process-management.component.scss'],
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

      :host ::ng-deep .group-td {
        float: left;
        display: flex;
        flex-direction: row;
        align-items: center;
        width: 50%;
      }
    `,
  ],
})
export class ProcessManagementComponent implements OnInit {
  @ViewChild('processForm') ProcessManagementFormComponent:
    | ProcessManagementFormComponent
    | undefined;

  public appConstant = AppConstant;
  loading: boolean = true;

  public getParams = {
    page: 0,
    pageSize: 10,
    searchText: '',
  };
  public totalRecords = 0;
  public totalPages = 0;

  public isLoading: boolean = false;
  public listProcedure: any[] = [];

  first = 0;
  isMobile = screen.width <= 1199;

  formData: any = {};
  isEdit: boolean = false;
  isReset: boolean = false;

  display: boolean = false;
  pendingRequest: any;
  cols: any[] = [
    {
      header: 'label.numerical_order',
      value: 'id',
      width: 'width:10%;',
      display: true,
      classify: 'personal_info',
      optionHide: false,
    },
    {
      header: 'label.code',
      value: 'code',
      width: 'width:20%;',
      display: true,
      classify: 'personal_info',
      optionHide: false,
    },
    {
      header: 'label.name',
      value: 'name',
      width: 'width:60%;',
      display: true,
      classify: 'personal_info',
      optionHide: false,
    },
  ];
  employees: any[] = [];
  roles: any[] = [];
  constructor(
    private messageService: MessageService,
    private readonly translateService: TranslateService,
    private readonly confirmationService: ConfirmationService,
    private readonly procedureService: ProcedureService,
    private readonly userRoleService: UserRoleService,
    private readonly userService: UserService,
  ) {}

  ngOnInit(): void {
    this.getListRole();
    this.getAllUserActive();
  }

  getListRole() {
    this.userRoleService.getAllUserRole().subscribe((response: any) => {
      this.roles = response.data;
    });
  }

  getAllUserActive() {
    this.userService.getAllUserActive().subscribe((res: any) => {
      this.employees = res.data;
    });
  }

  onGetProcedure(event?: any, isExport: boolean = false): void {
    if (this.pendingRequest) {
      this.pendingRequest.unsubscribe();
    }
    this.loading = true;
    if (event) {
      this.getParams.page = event.first / event.rows;
      this.getParams.pageSize = event.rows;
    }
    // remove undefined value
    Object.keys(this.getParams).forEach(
      (k) => this.getParams[k] == null && delete this.getParams[k],
    );
    this.pendingRequest = this.procedureService
      .getProcedures(this.getParams)
      .subscribe((response: any) => {
        AppUtil.scrollToTop();
        this.listProcedure = response.data;
        this.totalRecords = response.totalItems || 0;
        this.totalPages = response.totalItems / response.pageSize + 1;
        this.loading = false;
      });
  }

  onSearch(event) {
    if (event.key === 'Enter') {
      this.onGetProcedure();
    }
  }

  showDialog() {
    this.ProcessManagementFormComponent.onReset();
    this.display = true;
  }

  onAdd() {
    this.isEdit = false;
    this.showDialog();
  }

  onDelete(id) {
    let message;
    let header;
    this.translateService.get('question.delete_content').subscribe((res) => {
      message = res;
    });
    this.translateService.get('question.delete_header').subscribe((res) => {
      header = res;
    });
    this.confirmationService.confirm({
      message: message,
      header: header,
      accept: () => {
        this.procedureService.deleteProcedure(id).subscribe(
          (res) => {
            AppUtil.scrollToTop();
            this.messageService.add({
              severity: 'success',
              detail: 'Xóa thành công',
            });
            this.onGetProcedure();
          },
          (error) => {
            this.messageService.add({
              severity: 'error',
              detail: 'Lỗi lấy dữ liệu',
            });
          },
        );
      },
    });
  }

  getDetail(id) {
    this.isEdit = true;
    this.ProcessManagementFormComponent.getDetail(id);
    this.display = true;
  }
}
