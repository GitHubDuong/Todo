import { Component, HostListener, OnInit } from '@angular/core';
import { Page } from '@app/models/common.model';
import { TableColumModel } from '@app/models/common/table-colum.model';
import { UserRole } from '@app/models/user-role.model';
import { ToastService } from '@app/service/toast.service';
import { UserRoleService } from '@app/service/user-role.service';
import { USER_ROLE_COLUMNS } from '@components/unauthenticate-module/user-role/user-role.config';
import { TranslateService } from '@ngx-translate/core';
import appConstant from '@utilities/app-constants';
import { ConfirmationService, MessageService } from 'primeng/api';
import AppConstant from '../../../utilities/app-constants';
import AppUtil from '../../../utilities/app-util';

@Component({
  selector: 'app-user-role',
  templateUrl: './user-role.component.html',
  styleUrls: ['./user-role.component.scss'],
  providers: [ConfirmationService, MessageService],
})
export class UserRoleComponent implements OnInit {
  appConstant = AppConstant;
  showForm: boolean = false;
  selectedData?: UserRole;
  loading: boolean = false;
  data: UserRole[] = [];
  columns: TableColumModel[] = [];
  totalItems = 0;
  param: Page = {
    page: 0,
    pageSize: 10,
  };

  constructor(
    private readonly translateService: TranslateService,
    private readonly confirmationService: ConfirmationService,
    private readonly userRoleService: UserRoleService,
    private toastService: ToastService,
  ) {}

  ngOnInit(): void {
    this.init();
    this.getUserRoles();
  }

  init() {
    this.columns = USER_ROLE_COLUMNS;
  }

  getUserRoles(event?: any) {
    if (event) {
      this.param.page = event.first / event.rows;
      this.param.pageSize = event.rows;
    }
    this.userRoleService.getPagingUserRole({ ...this.param, page: this.param.page + 1 }).subscribe(
      (res) => {
        AppUtil.scrollToTop();
        this.data = res.data || [];
        this.totalItems = res.totalItems;
      },
      (error) => {
        this.toastService.error('Lỗi lấy dữ liệu');
      },
    );
  }

  onAddUserRole() {
    this.showForm = true;
    this.selectedData = undefined;
  }

  onEditUserRole(item: UserRole) {
    this.showForm = true;
    this.selectedData = item;
  }

  onCancelForm(event) {
    this.showForm = false;
    this.selectedData = undefined;
  }

  onDeleteUserRole(id) {
    this.confirmationService.confirm({
      message: AppUtil.translate(this.translateService, 'question.delete_user_role_content'),
      header: AppUtil.translate(this.translateService, 'question.delete_user_role_header'),
      accept: () => {
        this.userRoleService.deleteUserRole(id).subscribe(
          (res) => {
            AppUtil.scrollToTop();
            this.toastService.success(AppUtil.translate(this.translateService, 'success.delete'));
            this.getUserRoles();
          },
          (error) => {
            this.toastService.error(AppUtil.translate(this.translateService, 'error.0'));
          },
        );
      },
    });
  }

  @HostListener('document:keydown', ['$event'])
  async handleKeyboardEvent(event: KeyboardEvent) {
    switch (event.key) {
      case 'F7':
        event.preventDefault();
        await this.onAddUserRole();
        break;
    }
  }
}
