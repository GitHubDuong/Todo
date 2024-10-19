import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { Page, TypeData } from '../../../models/common.model';
import { AllowanceUserService } from '../../../service/allowance-user.service';
import { UserService } from '../../../service/user.service';
import AppConstants from '../../../utilities/app-constants';
import { AllowanceUserDialogComponent } from './allowance-user-dialog/allowance-user-dialog.component';

@Component({
  selector: 'app-allowance-user',
  templateUrl: './allowance-user.component.html',
  styleUrls: [],
  providers: [MessageService, ConfirmationService],
})
export class AllowanceUserComponent implements OnInit {
  appConstant = AppConstants;
  display: boolean = false;
  formData = {};
  loading: boolean = false;
  result: TypeData<any> = {
    data: [],
    currentPage: 0,
    nextStt: 0,
    pageSize: 20,
    totalItems: 0,
  };
  param: Page = {
    page: 1,
    pageSize: 20,
    searchText: '',
  };
  isMobile = screen.width <= 1199;

  constructor(
    private readonly messageService: MessageService,
    private readonly translateService: TranslateService,
    private readonly confirmationService: ConfirmationService,
    private readonly allowanceUserService: AllowanceUserService,
    private readonly userService: UserService,
    private dialogService: DialogService,
  ) {}

  ngOnInit(): void {}

  getUsers(event?: any): void {
    this.param.page = Number(event?.first || 0) / Number(event?.rows || 1) + 1;
    this.param.pageSize = Number(event?.rows || 10);
    this.userService.getPagingUser(this.param).subscribe((res) => {
      this.result = res;
    });
  }

  getAllowanceUsers(event?: any): void {
    this.param.page = Math.floor(Number(event?.first || 0) / Number(event?.rows || 1));
    this.param.pageSize = Number(event?.rows || 20);
    this.allowanceUserService.getPagingAllowanceUsers(this.param).subscribe(
      (res) => {
        console.log(res);
        this.result = res;
      },
      (error) => {
        this.messageService.add({
          severity: 'error',
          detail: 'Lỗi lấy dữ liệu',
        });
      },
    );
  }

  onAddAllowanceUser() {
    this.display = true;
    this.formData = {};
  }

  getAllowanceUserDetail(item) {
    // this.display = true
    // this.formData = item
    const ref = this.dialogService.open(AllowanceUserDialogComponent, {
      header: `Chỉnh sửa phụ cấp cho người dùng: ${item.fullName}`,
      width: '60%',
      data: item,
    });
    ref.onClose.subscribe((res) => {
      this.getAllowanceUsers();
    });
  }

  onCancelForm(event) {
    this.display = false;
    this.formData = {};
    this.getAllowanceUsers();
  }

  protected readonly AppConstants = AppConstants;
}
