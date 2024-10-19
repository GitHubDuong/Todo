import { Component, EventEmitter, HostListener, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from '@app/models/user.model';
import { UserTaskFileModel, UserTaskModel, UserTaskModeList } from '@app/models/workflow.model';
import { AuthService } from '@app/service/auth.service';
import { CustomerService } from '@app/service/customer.service';
import { DepartmentService } from '@app/service/department.service';
import { UserTaskCommentService } from '@app/service/user-task-comment.service';
import { UserService } from '@app/service/user.service';
import { WorkflowService } from '@app/service/workflow.service';
import { StringHelper } from '@app/shared/helper/string.helper';
import { environment } from '@env/environment';
import { TranslateService } from '@ngx-translate/core';
import { UserTaskRole, UserTaskStatus } from '@utilities/app-enum';
import * as moment from 'moment/moment';
import { ConfirmationService, MessageService } from 'primeng/api';
import { debounceTime, Subject } from 'rxjs';
import { WorkTypeService } from 'src/app/service/work-type.service';
import AppUtil from 'src/app/utilities/app-util';
import AppConstant from '../../../../utilities/app-constants';

@Component({
  providers: [MessageService, ConfirmationService],
  selector: 'app-workflow-form',
  templateUrl: './workflow-form.component.html',
  styleUrls: ['./workflow-form.component.scss'],
})
export class WorkflowFormComponent implements OnInit, OnChanges {
  appUtil = AppUtil;
  @Input() display = false;
  @Input() readonly = false;

  @Input() set formData(value) {
    this.userTypesSelected = [];
    if (value?.id) {
      const taskRoles = value.taskRole.map((item) => {
        return {
          ...item,
          id: item.userId,
        };
      });
      this.isEdit = true;
      this.workflowModel = {
        ...value,
        fileLink: value?.fileLink || [],
        dueTime: value.dueDate,
      };

      this.userTypeOptions.forEach((item) => {
        const users = taskRoles.filter((x) => x.userTaskRoleId == item.value);
        if (users.length > 0) {
          this.userTypesSelected.push(item.value);
        }
      });

      const responsibleUser = taskRoles.find((x) => x.userTaskRoleId == 1);
      this.workflowModel.responsiblePerson = responsibleUser ? responsibleUser.id : this.authService.user.id;

      const joinedUserIds = taskRoles.filter((x) => x.userTaskRoleId == 2).map((x) => x.userId);
      this.workflowModel.joinedPersons = this.users.filter((item) => joinedUserIds.includes(item.id));

      const viewedUserIds = taskRoles.filter((x) => x.userTaskRoleId == 3).map((x) => x.userId);
      this.workflowModel.viewedPersons = this.users.filter((item) => viewedUserIds.includes(item.id));
    } else {
      this.isEdit = false;
      this.workflowModel = {
        id: 0,
        dueDate: null,
        responsiblePerson: this.authService.user.id,
        joinedPersons: [],
        viewedPersons: [],
        checkList: [],
        fileLink: value?.fileLink || [],
        name: value?.name || '',
        description: value?.description || '',
        userCreateName: value?.userCreateName || this.authService.user?.fullname,
        typeWorkId: 0,
        point: 0,
        isProject: false,
        departmentId: -1,
      };
    }
  }

  @Output() onCancel = new EventEmitter();
  @Output() onSuccess = new EventEmitter();

  serverImage = environment.serverURLImage + '/';
  workflowModel: any = {};
  itemCheckList = '';
  isEdit = false;
  users: User[] = [];
  departments: any = [];
  subjectDept = new Subject<string>();
  subjectUser = new Subject<string>();
  parentProjects: UserTaskModeList[] = [];
  serverImg = environment.serverURLImage + '/Uploads/usertask/';
  userTypeOptions = [
    {
      name: 'Tạo bởi',
      value: 4,
    },
    {
      name: 'Tham gia',
      value: 2,
    },
    {
      name: 'Quan sát',
      value: 3,
    },
  ];
  userTypesSelected: any = [];
  fileUpload: UserTaskFileModel;
  workTypes = [];
  selectedImages: any[] = [];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private readonly messageService: MessageService,
    private readonly translateService: TranslateService,
    private readonly userService: UserService,
    private readonly departmentService: DepartmentService,
    private readonly authService: AuthService,
    private customerService: CustomerService,
    private readonly workflowService: WorkflowService,
    private readonly userTaskCommentService: UserTaskCommentService,
    private sanitizer: DomSanitizer,
    private readonly workTypeService: WorkTypeService,
  ) {}

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges): void {
    this.getUsers();
    this.getDepartments();
    this.getParentList();
    this.getListCustomer();
    this.subjectDept.pipe(debounceTime(500)).subscribe(() => {
      this.getDepartments();
    });
    this.subjectUser.pipe(debounceTime(500)).subscribe(() => {
      this.getUsers();
    });
    this.workflowModel = {
      ...this.workflowModel,
      userCreateName: this.authService.user.fullname,
    };
    this.getWorkType();
  }

  filterCustomerName(event) {
    this.getListCustomer(event.query.toLowerCase());
  }

  getListCustomer(searchText: string = '') {
    this.customerService.getAllCustomer(searchText).subscribe((res: any) => {
      this.customers = res.data;
      this.filteredCustomers = res.data.map((item) => `${item.code} | ${item.name}`);
      if (AppUtil.getStorage('customerIdPassing')) {
        let customer = this.customers.find((item) => item.id == AppUtil.getStorage('customerIdPassing'));
        if (customer && customer.code) {
          this.workflowModel.customerName = customer.code + ' | ' + customer.name;
          this.onCustomerNameSelect(this.workflowModel.customerName);
          AppUtil.removeStorage('customerIdPassing');
        }
      }
    });
  }

  customers: any[] = [];
  filteredCustomers: any[] = [];

  onCustomerNameSelect(event) {
    if (event) {
      let customer = this.customers.find((x) => x.code === event.split('|')[0].trim());
      if (customer) {
        this.workflowModel.customerId = customer.id;
        return;
      }
    }
  }

  onBack() {
    this.router.navigate(['/uikit/workflow']).then();
  }

  onAddCheckList() {
    if (this.itemCheckList?.trim()?.length > 0) {
      this.workflowModel.checkList.push({
        id: 0,
        userTaskId: 0,
        fileLink: '',
        name: this.itemCheckList,
        status: false,
      });
      this.itemCheckList = '';
    }
  }

  removeChecklist(item) {
    const indexItem = this.workflowModel?.checkList?.indexOf(item);
    this.workflowModel?.checkList?.splice(indexItem, 1);
  }

  getUsers() {
    this.userService.getAllUserActive1().subscribe({
      next: (res) => {
        this.users =
          res?.data?.map((user) => {
            return {
              ...user,
              avatar: this.serverImage + user.avatar,
            };
          }) || [];
      },
      error: () => {
        this.users = [];
      },
    });
  }

  getDepartments() {
    this.departmentService.getAllDepartment().subscribe({
      next: (res) => {
        this.departments = [
          {
            name: 'Những cá nhân liên quan',
            id: -1,
          },
          {
            name: 'Toàn công ty',
            id: -2,
          },
        ];
        this.departments = this.departments.concat(res?.data || []);
      },
      error: () => {
        this.departments = [];
      },
    });
  }

  onFilterDepartment(event: any) {
    if (event) this.subjectDept.next(event.filter);
  }

  onFilterUser(event: any) {
    if (event) this.subjectUser.next(event.filter);
  }

  getParentList() {
    this.workflowService.getParentList().subscribe({
      next: (res) => {
        this.parentProjects = res || [];
      },
      error: () => {
        this.departments = [];
      },
    });
  }

  onSave() {
    const taskRoles = [
      {
        id: 0,
        userTaskId: this.workflowModel?.id || 0,
        userTaskRoleId: UserTaskRole.RESPONSIBLE,
        userId: this.workflowModel?.responsiblePerson,
      },
    ];
    if (this.workflowModel?.joinedPersons && this.workflowModel.joinedPersons.length > 0) {
      taskRoles.push(
        ...this.workflowModel?.joinedPersons?.map((person) => {
          return {
            id: 0,
            userTaskId: this.workflowModel?.id || 0,
            userTaskRoleId: UserTaskRole.JOINED,
            userId: person?.id,
          };
        }),
      );
    }
    if (this.workflowModel?.viewedPersons && this.workflowModel?.viewedPersons.length > 0) {
      taskRoles.push(
        ...this.workflowModel?.viewedPersons?.map((person) => {
          return {
            id: 0,
            userTaskId: this.workflowModel?.id || 0,
            userTaskRoleId: UserTaskRole.VIEWER,
            userId: person?.id,
          };
        }),
      );
    }
    delete this.workflowModel.responsiblePerson;
    delete this.workflowModel.joinedPersons;
    delete this.workflowModel.viewedPersons;
    delete this.workflowModel.userCreateName;
    if (!this.workflowModel.dueDate || this.workflowModel.dueDate === 'Invalid date') {
      delete this.workflowModel.dueDate;
      delete this.workflowModel.dueTime;
    } else if (this.workflowModel.dueTime) {
      this.workflowModel.dueDate.setMinutes(this.workflowModel.dueTime.getMinutes());
      this.workflowModel.dueDate.setHours(this.workflowModel.dueTime.getHours());
      this.workflowModel.dueDate = moment(this.workflowModel.dueDate).format(AppConstant.FORMAT_DATE.T_DATE);
    }

    if (this.workflowModel.typeWorkId == null) {
      this.workflowModel.typeWorkId = 0;
    }

    if (!this.workflowModel?.id) {
      const request: UserTaskModel = {
        ...this.workflowModel,
        userCreated: this.authService.user?.id,
        createdDate: new Date(),
        status: UserTaskStatus.OPENING,
        isDeleted: false,
        taskRole: taskRoles,
        childTask: null,
      };
      this.workflowService.add(request).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            detail: AppUtil.translate(this.translateService, 'success.create'),
          });
          this.submitSuccess();
          this.getParentList();
        },
        error: () => {
          this.messageService.add({
            severity: 'error',
            detail: AppUtil.translate(this.translateService, 'error.0'),
          });
        },
      });
    } else {
      const request: UserTaskModel = {
        ...this.workflowModel,
        isDeleted: false,
        taskRole: taskRoles,
        childTask: null,
      };
      this.workflowService.update(this.workflowModel.id, request).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            detail: AppUtil.translate(this.translateService, 'success.update'),
          });
          this.submitSuccess();
        },
        error: () => {
          this.messageService.add({
            severity: 'error',
            detail: AppUtil.translate(this.translateService, 'error.0'),
          });
        },
      });
    }
  }

  submitSuccess() {
    this.onCancel.emit({});
    this.onSuccess.emit({});
  }

  onChangeWorkTypes(event) {
    if (event && event.value) {
      this.workflowModel.point = this.workTypes.find((x) => x.id === event.value).point;
    }
  }

  doAttachFile(event: any): void {
    if (
      this.workflowModel.fileLink.length >= 4 ||
      event.target?.files.length > 4 ||
      event.target?.files.length + this.workflowModel.fileLink.length > 4
    ) {
      return;
    }
    for (let i = 0; i < event.target?.files.length; i++) {
      const formData = new FormData();
      formData.append('file', event.target?.files[i]);
      this.userTaskCommentService.uploadFile(formData).subscribe((res: any) => {
        if (this.workflowModel.fileLink.length < 4) {
          this.workflowModel.fileLink.push(res);
        }
      });
    }
  }

  onRemoveImages() {
    this.workflowModel.fileLink = this.workflowModel.fileLink.filter((x) => !this.selectedImages.includes(x.fileId));
  }

  onImageClick(id: any) {
    // remove or add class name style_prev_kit (css hover)
    let image = document.getElementById(id);
    let isUsingClass = image.classList.contains('style_prev_kit');
    if (isUsingClass) {
      image.classList.remove('style_prev_kit');
      image.classList.add('opacity-custom');
      this.selectedImages = [...this.selectedImages, id];
    } else {
      image.classList.add('style_prev_kit');
      image.classList.remove('opacity-custom');
      this.selectedImages = this.selectedImages.filter((x) => x !== id);
    }
  }

  onUploadFile(event) {
    if (this.workflowModel.fileLink.length + event.currentFiles.length > 5) {
      this.messageService.add({
        severity: 'info',
        detail: 'Chọn tối đa 5 hình ảnh',
      });
      return;
    }
    for (let i = 0; i < event.currentFiles.length; i++) {
      const file = event.currentFiles[i];
      const formData = new FormData();
      formData.append('file', file);
      this.userTaskCommentService.uploadFile(formData).subscribe({
        next: (res: any) => {
          if (res) {
            this.fileUpload = res;
            this.workflowModel.fileLink.push(res);
          }
        },
        error: () => {
          this.messageService.add({
            severity: 'error',
            detail: AppUtil.translate(this.translateService, 'error.0'),
          });
        },
      });
    }
  }

  generateDescription() {
    let htmlContent = '<ol>';
    this.workflowModel.checkList.forEach(function (item) {
      console.log(item);
      htmlContent += '<li>' + item.name + '</li>';
    });
    htmlContent += '</ol>';

    this.workflowModel.description = htmlContent;
  }

  @HostListener('document:keydown', ['$event'])
  async handleKeyboardEvent(event: KeyboardEvent) {
    if (!this.display) {
      return;
    }

    switch (event.key) {
      case 'F8':
        event.preventDefault();
        await this.onSave();
        break;
      case 'F6':
        event.preventDefault();
        this.onCancel.emit({});
        break;
    }
  }

  getWorkType() {
    this.workTypeService.getAllWorkTYpe().subscribe({
      next: (res) => {
        if (res) {
          this.workTypes = res.data;
        }
      },
      error: () => {
        this.workTypes = [];
      },
    });
  }

  isImageExtension(fileName: string): boolean {
    return this.appUtil.isImageFile(fileName);
  }

  onChangeName() {
    this.workflowModel.name = StringHelper.capitalizeFirstLetter(this.workflowModel.name);
  }
}
