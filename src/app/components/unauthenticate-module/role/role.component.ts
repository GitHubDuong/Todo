import { AfterContentInit, Component, HostListener, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { TypeData } from '@app/models/common.model';
import { TableColumModel } from '@app/models/common/table-colum.model';
import { MenuRoleModel } from '@app/models/role.model';
import { UserRole, UserRoleCRUD } from '@app/models/user-role.model';
import { PageFilterRole, RoleService } from '@app/service/role.service';
import { ROLE_COLUMNS } from '@components/unauthenticate-module/role/role.config';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Subject, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { AppMainComponent } from 'src/app/layouts/app.main.component';
import { ConfigService } from 'src/app/service/system-setting/app.config.service';
import AppConstant from 'src/app/utilities/app-constants';
import AppUtil from '../../../utilities/app-util';

@Component({
  selector: 'app-role',
  templateUrl: './role.component.html',
  styleUrls: ['./role.component.scss'],
  providers: [ConfirmationService],
})
export class RoleComponent implements OnInit, OnDestroy, AfterContentInit {
  private searchSubject = new Subject<string>();
  private readonly debounceTimeMs = 500; // 500ms
  appConstant = AppConstant;
  appUtil = AppUtil;
  display: boolean = false;
  formData = {};
  result: TypeData<any> = {
    data: [],
    currentPage: 0,
    nextStt: 0,
    pageSize: 10,
    totalItems: 0,
  };
  getParams: PageFilterRole = {
    page: 0,
    pageSize: 10,
    codeParent: '',
    isParent: false,
  };
  getParamsTemp: PageFilterRole = {
    page: 0,
    pageSize: 10,
    codeParent: '',
    isParent: false,
  };
  roles: UserRole[] = [];
  currentPageRole: UserRoleCRUD = {};
  codeParents: MenuRoleModel[] = [];
  subscription: Subscription;
  first = 0;
  isMobile = screen.width <= 1199;
  columns: TableColumModel[] = [];

  @ViewChild('parentCode', { static: true }) parentCodeTpl: TemplateRef<any>;

  constructor(
    public appMain: AppMainComponent,
    private readonly messageService: MessageService,
    private readonly roleService: RoleService,
    private readonly translateService: TranslateService,
    private readonly confirmationService: ConfirmationService,
    private readonly configService: ConfigService,
  ) {}

  ngOnInit(): void {
    this.currentPageRole = this.appUtil.getMenus('PHANQUYEN');
    this.getMenuParents();
    this.subscription = this.configService.configUpdate$.subscribe((config) => this.getMenuParents(config.dark));

    this.searchSubject.pipe(debounceTime(this.debounceTimeMs)).subscribe((searchValue) => {
      this.getMenuRole();
    });
  }

  ngAfterContentInit(): void {
    this.columns = ROLE_COLUMNS.map((item: TableColumModel) => {
      if (item.field === 'codeParent') {
        return {
          ...item,
          template: this.parentCodeTpl,
        };
      }
      return item;
    });
  }

  ngOnDestroy() {
    this.searchSubject.complete();
  }

  onSearch() {
    this.searchSubject.next(null);
  }

  getMenuParents(isDark: boolean = false) {
    this.roleService.getRoles({ isParent: true }).subscribe((res) => {
      this.codeParents = res.data;
      this.codeParents.forEach((parent) => {
        parent.colorRandom = isDark ? AppUtil.generateLightColorHex() : AppUtil.generateDarkColorHex();
      });
    });
  }

  getMenuRole(event?: any) {
    this.getParamsTemp = this.getParams;
    if (event) {
      this.getParams.page = event.first / event.rows;
      this.getParams.pageSize = event.rows;
    } else {
      this.getParams.page = 0;
      this.getParams.pageSize = 10;
    }
    if (AppUtil.getStorage(AppConstant.DATA_TEMP)) {
      this.getParams = AppUtil.getStorage(AppConstant.DATA_TEMP);
      this.first = this.getParams.page * 10;
      AppUtil.removeStorage(AppConstant.DATA_TEMP);
    }
    let params = Object.assign({}, this.getParams);
    if (!params.codeParent) {
      delete params.codeParent;
    }
    this.roleService.getPagingRole(params).subscribe((res) => {
      this.appUtil.scrollToTop();
      this.result = res;
    });
  }

  onAddRole() {
    AppUtil.setStorage(AppConstant.DATA_TEMP, JSON.stringify(this.getParams));
    this.display = true;
    this.formData = {};
  }

  onEditRole(item) {
    AppUtil.setStorage(AppConstant.DATA_TEMP, JSON.stringify(this.getParams));
    this.roleService.getDetail(item.id).subscribe((res) => {
      this.formData = res;
      this.display = true;
    });
  }

  onDeleteRole(id) {
    this.confirmationService.confirm({
      message: this.appUtil.translate(this.translateService, 'question.delete_role_content'),
      header: this.appUtil.translate(this.translateService, 'question.delete_role_header'),
      accept: () => {
        this.roleService.deleteRole(id).subscribe((res) => {
          this.appUtil.scrollToTop();
          this.getMenuRole();
          this.messageService.add({
            severity: 'success',
            detail: this.appUtil.translate(this.translateService, 'success.delete'),
          });
        });
      },
    });
  }

  onCancelForm(event) {
    this.getMenuParents();
    this.display = false;
    this.formData = {};
  }

  getParentColor(codeParent) {
    let parent = this.codeParents.find((x) => x.code === codeParent);
    return parent ? parent.colorRandom : 'var(--primary-color)';
  }

  @HostListener('document:keydown', ['$event'])
  async handleKeyboardEvent(event: KeyboardEvent) {
    switch (event.key) {
      case 'F7':
        event.preventDefault();
        await this.onAddRole();
        break;
    }
  }
}
