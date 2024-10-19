import { AfterViewInit, Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { Calendar, CalendarOptions, FullCalendarComponent } from '@fullcalendar/angular';
import { TranslateService } from '@ngx-translate/core';
import {
  addDays,
  addHours,
  addWeeks,
  compareAsc,
  endOfDay,
  endOfMonth,
  endOfWeek,
  format,
  startOfDay,
  startOfMonth,
  startOfWeek,
  startOfYear,
} from 'date-fns';
import { saveAs } from 'file-saver';
import * as _ from 'lodash';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { debounceTime, Subject } from 'rxjs';
import { AppMainComponent } from 'src/app/layouts/app.main.component';
import { CustomerStatusService } from 'src/app/service/customer-status.service';
import { UserTaskCommentService } from 'src/app/service/user-task-comment.service';
import { environment } from '../../../../environments/environment';
import { TypeData } from '../../../models/common.model';
import { Department } from '../../../models/department.model';
import { User } from '../../../models/user.model';
import { ExpiredModel, KanbanModel, UserTaskModeList, UserTaskRequestModel } from '../../../models/workflow.model';
import { AuthService } from '../../../service/auth.service';
import { CustomerService } from '../../../service/customer.service';
import { DepartmentService } from '../../../service/department.service';
import { UserService } from '../../../service/user.service';
import { WorkflowService } from '../../../service/workflow.service';
import AppConstants from '../../../utilities/app-constants';
import { UserTaskRole, UserTaskStatus } from '../../../utilities/app-enum';
import AppUtil from '../../../utilities/app-util';

@Component({
  selector: 'app-workflow',
  templateUrl: './workflow.component.html',
  styleUrls: ['./workflow.component.scss'],
  providers: [ConfirmationService],
})
export class WorkflowComponent implements OnInit, AfterViewInit {
  appConstant = AppConstants;
  appUtil = AppUtil;
  display: boolean = false;
  showFormDialog: boolean = false;
  activeDialog = 0;
  formData = {};
  @ViewChild('op', { static: false }) overlayPanel: any;
  serverImg = environment.serverURLImage + '/';
  UserTaskStatusEnum = UserTaskStatus;
  isShowInfo = false;
  selectedItem: any = {};
  items: MenuItem[] = [
    {
      id: '1',
      label: this.appMain.isDesktop() ? 'Danh sách' : '',
      icon: 'pi pi-fw pi-book',
      command: (event) => {
        this.activeItem = event.item;
        this.getWorkList();
      },
    },
    {
      id: '4',
      label: this.appMain.isDesktop() ? 'Kanban' : '',
      icon: 'pi pi-fw pi-chart-line',
      command: (event) => {
        this.activeItem = event.item;
        this.getWorkListKanban();
      },
    },
    {
      id: '5',
      label: this.appMain.isDesktop() ? 'Dự án' : '',
      icon: 'pi pi-fw pi-briefcase',
      command: (event) => {
        this.activeItem = event.item;
        this.getListProjectParent();
      },
    },
    {
      id: '2',
      label: this.appMain.isDesktop() ? 'Hạn chót' : '',
      icon: 'pi pi-fw pi-clock',
      command: (event) => {
        this.activeItem = event.item;
        this.getWorkListExpired();
      },
    },
    {
      id: '3',
      label: this.appMain.isDesktop() ? 'Lịch' : '',
      icon: 'pi pi-fw pi-calendar',
      command: (event) => {
        this.activeItem = event.item;
        this.calendarOption.height = 'auto';
        this.getWorkListCalendar();
      },
    },
  ];

  reviewStatusItems: any = [
    { value: 1, label: 'Chưa duyệt' },
    { value: 2, label: 'Cần làm lại' },
    { value: 3, label: 'Đã duyệt' },
  ];

  activeItem: MenuItem;
  actions = [
    { id: 1, name: 'Ghim' },
    { id: 2, name: 'Hoàn thành' },
    { id: 3, name: 'Bắt đầu công việc' },
    { id: 4, name: 'Hoãn lại' },
    { id: 5, name: 'Sao chép' },
    { id: 6, name: 'Xóa' },
  ];

  taskItemItems: any = [
    { value: 2, label: 'Công việc' },
    { value: 1, label: 'Dự án' },
  ];

  loading: boolean = false;
  sortFields: any[] = [];
  sortTypes: any[] = [];
  selectedJob: UserTaskModeList;
  selectedImages: any[] = [];
  result: TypeData<UserTaskModeList> = {
    data: [],
    currentPage: 0,
    nextStt: 0,
    pageSize: 10,
    totalItems: 0,
  };

  parentProjectResult: TypeData<UserTaskModeList> = {
    data: [],
    currentPage: 0,
    nextStt: 0,
    pageSize: 10,
    totalItems: 0,
  };
  param: UserTaskRequestModel = {
    page: 1,
    pageSize: 10,
  };
  exportParam: UserTaskRequestModel = {
    startDate: startOfYear(new Date()),
    endDate: endOfMonth(new Date()),
    status: null,
    departmentId: null,
    parentProjectId: null,
    isStatusForManager: null,
    taskType: null,
  };
  status = [];
  departments: Department[] = [];
  subjectDept = new Subject<string>();
  userTaskImg = environment.serverURLImage + '/Uploads/usertask/';

  expiredWork: ExpiredModel = {
    month: new Date(),
    expired: [],
    expiredToday: [],
    expiredCurrentWeek: [],
    expiredNextWeek: [],
    notExpired: [],
  };
  kanbanWorks: KanbanModel[] = [];
  draggedJob: UserTaskModeList;

  employees: User[] = [];

  events: any[] = [];
  calendarOption: CalendarOptions;
  calendarApi: Calendar;
  users: User[] = [];
  statusItems: any[] = [];
  @ViewChild('calendar') calendarComponent: FullCalendarComponent;

  customers: any[] = [];
  filteredCustomers: any[] = [];

  queryParam;
  userLogged;

  constructor(
    public appMain: AppMainComponent,
    private workflowService: WorkflowService,
    private messageService: MessageService,
    private translateService: TranslateService,
    private readonly departmentService: DepartmentService,
    private readonly userService: UserService,
    private sanitizer: DomSanitizer,
    private confirmationService: ConfirmationService,
    private customerService: CustomerService,
    private readonly authService: AuthService,
    private userTaskCommentService: UserTaskCommentService,
    private readonly customerStatusService: CustomerStatusService,
    private router: ActivatedRoute,
  ) {}

  ngAfterViewInit(): void {
    this.calendarApi = this.calendarComponent?.getApi();
    this.calendarOption.height = '0';
  }

  getUsers() {
    this.userService.getAllUserActive().subscribe({
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

  onCustomerNameSelect(event) {
    if (event) {
      let customer = this.customers.find((x) => x.code === event.split('|')[0].trim());
      if (customer) {
        this.exportParam.customerId = customer.id;
        this.exportParam.customerName = `${customer.code} | ${customer.name}`;
        this.onSearchUserTask();
      }
    } else {
      this.exportParam.customerId = null;
      this.exportParam.customerName = '';
      this.getWorkList();
    }
  }

  filterCustomerName(event) {
    let keyword = event.query.toLowerCase();
    this.getListCustomer(keyword.includes('|') ? keyword.split(' | ')[0] : '');
  }

  getListCustomer(searchText: string = '') {
    this.customerService.getAllCustomer(searchText).subscribe((res: any) => {
      const filteredCustomers = res.data;
      this.filteredCustomers = filteredCustomers.map((item) => `${item.code} | ${item.name}`);
    });
  }

  getUserById(id: number) {
    return this.users.find((x) => x.id === id);
  }

  ngOnInit(): void {
    this.userLogged = this.authService.user;
    this.getUsers();
    this.customerService.getAllCustomer().subscribe((res: any) => {
      this.customers = res.data;
    });
    this.getStatus();
    this.activeItem = this.items[0];
    this.status = [
      {
        value: UserTaskStatus.OPENING,
        name: 'Mới tạo',
      },
      {
        value: UserTaskStatus.DOING,
        name: 'Đang làm',
      },
      {
        value: UserTaskStatus.PAUSE,
        name: 'Tạm dừng',
      },
      {
        value: UserTaskStatus.REVIEWING,
        name: 'Chờ đánh giá',
      },
      {
        value: UserTaskStatus.COMPLETE,
        name: 'Hoàn thành',
      },
    ];
    // @ts-ignore
    this.exportParam?.status = [UserTaskStatus.OPENING, UserTaskStatus.DOING, UserTaskStatus.PAUSE, UserTaskStatus.REVIEWING];

    // Set defaul task type
    this.exportParam.taskType = 2;

    // this.getWorkList();
    this.getDepartments();
    this.subjectDept.pipe(debounceTime(500)).subscribe((value) => {
      this.getDepartments(value);
    });
    this.calendarOption = {
      initialDate: new Date(),
      initialView: 'dayGridMonth',
      headerToolbar: {
        left: 'prev,next today',
        center: 'title',
        right: 'dayGridMonth,dayGridWeek,dayGridDay',
      },
      buttonText: {
        today: 'Hôm nay',
        month: 'Tháng',
        week: 'Tuần',
        day: 'Ngày',
      },
      titleFormat: {
        month: '2-digit',
        year: 'numeric',
      },
      editable: true,
      selectable: true,
      selectMirror: true,
      dayMaxEvents: true,
      events: this.events,
      eventsSet: (_) => {
        // this.onChangeCalendar()
        // this.loadEventCalendar()
      },
    };
    // this.getListProjectParent();
    this.getAllUserActive();
    this.router.queryParams.subscribe((res) => {
      this.queryParam = res;
      if (res && res['customer-name'] && res['customer-id']) {
        this.exportParam.customerName = res['customer-name']?.trim();
        this.exportParam.customerId = res['customer-id']?.trim();
        this.getWorkList(this.exportParam);
      } else this.getWorkList();
      this.getListProjectParent();
      if (res?.status == 'addJobs') {
        this.onAddWorkflow();
      }
    });
  }

  getStatus() {
    this.customerStatusService.getAllCustomerStatus(1).subscribe((res: any) => {
      this.statusItems = res.data;
    });
  }

  getAllUserActive() {
    this.userService.getAllUserActive().subscribe((res: any) => {
      this.employees = res.data;
    });
  }

  first = 0;
  isShowForm = false;

  getWorkList(event?: any) {
    this.loading = true;
    const _param = {
      page: event ? parseInt((Number(event?.first || 0) / Number(event?.rows || 1) + 1).toString()) : 1,
      pageSize: event?.rows || 10,
      startDate: this.exportParam?.startDate?.toISOString(),
      endDate: this.exportParam?.endDate?.toISOString(),
      statuses: this.exportParam?.status,
      departmentId: this.exportParam?.departmentId,
      parentProjectId: this.exportParam?.parentProjectId || 0,
      UserCreatedId: this.exportParam?.UserCreatedId || 0,
      isStatusForManager: this.exportParam?.isStatusForManager || 0,
      customerId: this.exportParam.customerId || '',
      searchText: this.exportParam?.searchText,
      taskType: this.exportParam?.taskType || 0,
    };
    if (this.isShowForm) {
      this.isShowForm = false;
      _param.page = this.param.page;
      _param.pageSize = this.param.pageSize;
      this.first = this.result.totalItems;
    } else {
      this.param.page = _param.page;
      this.param.pageSize = _param.pageSize;
    }

    if ([undefined, null].includes(this.exportParam?.status)) delete _param.statuses;
    if (!this.exportParam?.departmentId) delete _param.departmentId;
    this.workflowService.getListMode(AppUtil.cleanObject(_param)).subscribe(
      (response) => {
        this.loading = false;
        this.result = response;
        this.result.data = this.initBgColor(response?.data);
      },
      (err) => {
        this.loading = false;
        this.messageService.add({
          severity: 'error',
          detail: AppUtil.translate(this.translateService, 'error.0'),
        });
      },
    );
  }

  initBgColor(data) {
    return (
      data.reduce((arr, item) => {
        let bgName = '';
        switch (item.status) {
          case UserTaskStatus.DOING:
            bgName = 'bg-green-400';
            break;
          case UserTaskStatus.PAUSE:
            bgName = 'bg-orange-400';
            break;
          case UserTaskStatus.COMPLETE:
            bgName = 'bg-blue-400';
            break;
          case UserTaskStatus.REVIEWING:
            bgName = 'bg-pink-400';
            break;
          default:
            bgName = 'surface-400';
            break;
        }
        let bgDueDate = 'bg-bluegray-400';
        if (compareAsc(new Date(item.dueDate), startOfDay(new Date())) === -1) bgDueDate = 'bg-pink-400';

        if (compareAsc(startOfDay(new Date(item.dueDate)), startOfDay(new Date())) === 0) bgDueDate = 'bg-yellow-400';

        if (
          compareAsc(startOfDay(new Date(item.dueDate)), startOfDay(addDays(new Date(), 1))) > -1 &&
          compareAsc(startOfDay(new Date(item.dueDate)), endOfWeek(new Date())) < 1
        )
          bgDueDate = 'bg-green-400';

        if (
          compareAsc(startOfDay(new Date(item.dueDate)), startOfWeek(addWeeks(new Date(), 1))) > -1 &&
          compareAsc(startOfDay(new Date(item.dueDate)), endOfWeek(addWeeks(new Date(), 1))) < 1
        )
          bgDueDate = 'bg-teal-400';
        if (!item.dueDate) bgDueDate = 'bg-white';
        arr.push({
          ...item,
          bgName: bgName,
          bgDueDate: bgDueDate,
        });
        return arr;
      }, []) || []
    );
  }

  getWorkListExpired(event?: any) {
    this.loading = true;
    const _param = {
      page: 1,
      pageSize: event?.first || 0 + event?.rows || 0 || 10,
      startDate: this.exportParam?.startDate?.toISOString(),
      endDate: this.exportParam?.endDate?.toISOString(),
      status: this.exportParam?.status,
      departmentId: this.exportParam?.departmentId,
      customerId: this.exportParam?.customerId || '',
      isExpired: true,
    };
    if ([undefined, null].includes(this.exportParam?.status)) delete _param.status;
    if (!this.exportParam?.departmentId) delete _param.departmentId;
    this.workflowService.getListMode(_param).subscribe(
      (response) => {
        this.loading = false;
        const _expired = [];
        const _expiredToday = [];
        const _expiredCurrentWeek = [];
        const _expiredNextWeek = [];
        const _notExpired = [];
        response?.data?.map((item) => {
          if (!item.dueDate) {
            _notExpired.push({
              ...item,
              responsibleUserCreated: {
                ...item.responsibleUserCreated,
                avatar: this.serverImg + item.responsibleUserCreated?.avatar,
              },
            });
          } else {
            if (compareAsc(new Date(item.dueDate), startOfDay(new Date())) === -1)
              _expired.push({
                ...item,
                responsibleUserCreated: {
                  ...item.responsibleUserCreated,
                  avatar: this.serverImg + item.responsibleUserCreated?.avatar,
                },
              });

            if (compareAsc(startOfDay(new Date(item.dueDate)), startOfDay(new Date())) === 0)
              _expiredToday.push({
                ...item,
                responsibleUserCreated: {
                  ...item.responsibleUserCreated,
                  avatar: this.serverImg + item.responsibleUserCreated?.avatar,
                },
              });

            if (
              compareAsc(startOfDay(new Date(item.dueDate)), startOfDay(addDays(new Date(), 1))) > -1 &&
              compareAsc(startOfDay(new Date(item.dueDate)), endOfWeek(new Date())) < 1
            )
              _expiredCurrentWeek.push({
                ...item,
                responsibleUserCreated: {
                  ...item.responsibleUserCreated,
                  avatar: this.serverImg + item.responsibleUserCreated?.avatar,
                },
              });

            if (
              compareAsc(startOfDay(new Date(item.dueDate)), startOfWeek(addWeeks(new Date(), 1))) > -1 &&
              compareAsc(startOfDay(new Date(item.dueDate)), endOfWeek(addWeeks(new Date(), 1))) < 1
            )
              _expiredNextWeek.push({
                ...item,
                responsibleUserCreated: {
                  ...item.responsibleUserCreated,
                  avatar: this.serverImg + item.responsibleUserCreated?.avatar,
                },
              });
          }
          this.expiredWork.expired = this.initBgColor(_expired);
          this.expiredWork.expiredToday = this.initBgColor(_expiredToday);
          this.expiredWork.expiredCurrentWeek = this.initBgColor(_expiredCurrentWeek);
          this.expiredWork.expiredNextWeek = this.initBgColor(_expiredNextWeek);
          this.expiredWork.notExpired = this.initBgColor(_notExpired);
        });
      },
      (err) => {},
    );
  }

  eventColors: string[] = ['blue', 'green', 'cyan', 'pink', 'indigo', 'teal', 'orange', 'bluegray', 'purple', 'gray', 'primary'];

  getWorkListCalendar(param?: UserTaskRequestModel) {
    this.loading = true;
    const _param = {
      page: 0,
      startDate: param?.startDate?.toISOString() || this.exportParam?.startDate?.toISOString(),
      endDate: param?.endDate?.toISOString() || this.exportParam?.endDate?.toISOString(),
      status: this.exportParam?.status || null,
      customerId: this.exportParam?.customerId || '',
      departmentId: this.exportParam?.departmentId || null,
    };
    if ([undefined, null].includes(this.exportParam?.status)) delete _param.status;
    if (!this.exportParam?.departmentId) delete _param.departmentId;

    let color = 0;

    this.workflowService.getListMode(_param).subscribe((response) => {
      this.loading = false;
      const _events = [];
      response?.data?.map((item) => {
        _events.push({
          id: item.id,
          title: item.name,
          start: addHours(new Date(item.createdDate), -1 * Number(item.actualHours | 0)),
          end: new Date(item.dueDate || Date.now()),
          backgroundColor: this.eventColors[color],
        });

        color++;
        if (color == this.eventColors.length) {
          color = 0;
        }
      });

      this.calendarOption.events = _events;
    });
  }

  getWorkListKanban(event?: any) {
    this.loading = true;
    const _param = {
      page: event ? Math.floor(Number(event?.first || 0) / Number(event?.rows | 1)) || 1 : 1,
      pageSize: event?.rows || 10,
      startDate: this.exportParam?.startDate?.toISOString(),
      endDate: this.exportParam?.endDate?.toISOString(),
      status: this.exportParam?.status,
      departmentId: this.exportParam?.departmentId,
      customerId: this.exportParam.customerId || '',
    };
    if ([undefined, null].includes(this.exportParam?.status)) delete _param.status;
    if (!this.exportParam?.departmentId) delete _param.departmentId;
    this.workflowService.getListMode(_param).subscribe((response) => {
      this.loading = false;
      const data = _.groupBy(response.data, 'userCreated');
      const _kanbanWorks = [];
      Object.keys(data)?.map((key) => {
        const values = data[key] as UserTaskModeList[];
        _kanbanWorks.push({
          user: {
            ...values?.[0]?.responsibleUserCreated,
            avatar: this.serverImg + values?.[0]?.responsibleUserCreated?.avatar,
            isActive: this.userLogged?.id?.toString() === key,
          },
          todo: this.initBgColor(values?.filter((item) => [UserTaskStatus.OPENING, UserTaskStatus.PAUSE].includes(item.status)) || []),
          inProgress: this.initBgColor(values?.filter((item) => item.status === UserTaskStatus.DOING) || []),
          done: this.initBgColor(values?.filter((item) => item.status === UserTaskStatus.COMPLETE) || []),
        });
      });
      if (!this.kanbanWorks?.length) this.kanbanWorks = _kanbanWorks;
      else
        this.kanbanWorks?.map((kanban) => {
          const newValue = _kanbanWorks?.find((kb) => kb.user?.fullName === kanban?.user.fullName);
          const todoIds = kanban?.todo?.map((item) => {
            return item.id;
          });
          const inProgressIds = kanban?.inProgress?.map((item) => {
            return item.id;
          });
          const doneIds = kanban?.done?.map((item) => {
            return item.id;
          });
          kanban.todo = [...kanban?.todo, ...(newValue?.todo?.filter((x) => !todoIds.includes(x.id)) || [])];
          kanban.inProgress = [...kanban?.inProgress, ...(newValue?.inProgress?.filter((x) => !inProgressIds.includes(x.id)) || [])];
          kanban.done = [...kanban?.done, ...(newValue?.done?.filter((x) => !doneIds.includes(x.id)) || [])];
        });
    });
  }

  getListProjectParent(event?: any) {
    const param = {
      page: event ? Number(event?.first || 0) / Number(event?.rows || 1) + 1 : 1,
      pageSize: event?.rows || 10,
      startDate: this.exportParam?.startDate?.toISOString(),
      endDate: this.exportParam?.endDate?.toISOString(),
      statuses: this.exportParam?.status,
      departmentId: this.exportParam?.departmentId,
      parentProjectId: this.exportParam?.parentProjectId || 0,
      UserCreatedId: this.exportParam?.UserCreatedId || 0,
      isStatusForManager: this.exportParam?.isStatusForManager || 0,
      customerId: this.exportParam.customerId || '',
      searchText: this.exportParam?.searchText,
    };
    this.workflowService.getListProjectParent(AppUtil.cleanObject(param)).subscribe(
      (res) => {
        this.parentProjectResult = res;
        const data = res.data?.map((item, index) => {
          return {
            no: (param.page - 1) * param.pageSize + index + 1,
            ...item,
            children: [],
          };
        });
        this.parentProjectResult.data = data;
      },
      (err) => {},
    );
  }

  getChildren(expanded: boolean, item: any): void {
    if (expanded) return;
    const param = {
      parentId: item.id,
      startDate: this.exportParam?.startDate?.toISOString(),
      endDate: this.exportParam?.endDate?.toISOString(),
      statuses: this.exportParam?.status,
      departmentId: this.exportParam?.departmentId,
      parentProjectId: this.exportParam?.parentProjectId || 0,
      UserCreatedId: this.exportParam?.UserCreatedId || 0,
      isStatusForManager: this.exportParam?.isStatusForManager || 0,
      customerId: this.exportParam.customerId || '',
      searchText: this.exportParam?.searchText,
    };
    this.workflowService.getListProjectChildren(AppUtil.cleanObject(param)).subscribe((res) => {
      const data =
        res?.map((child, index) => {
          return {
            no: index + 1,
            ...child,
          };
        }) || [];
      item.children = this.initBgColor(data);
    });
  }

  onAddWorkflow() {
    this.display = true;
    this.isShowForm = true;
    this.formData = {};
  }

  dragStartTodo(job: UserTaskModeList) {
    this.draggedJob = job;
  }

  dragEndTodo() {
    // this.draggedJob = null
  }

  dropTodo(event) {
    if (this.draggedJob && this.draggedJob.status !== UserTaskStatus.OPENING) {
      this.loading = true;
      this.workflowService
        .statusTask({
          userTaskId: this.draggedJob.id,
          status: UserTaskStatus.PAUSE,
        })
        .subscribe(
          (res) => {
            this.loading = false;
            if (res) {
              const kanbanWork = this.kanbanWorks.find((kb) => kb.user?.fullName === this.draggedJob?.responsibleUserCreated?.fullName);
              const kanbanWorkIndex = this.kanbanWorks.indexOf(kanbanWork);
              kanbanWork.todo = [
                ...(kanbanWork.todo || []),
                {
                  ...this.draggedJob,
                  status: UserTaskStatus.PAUSE,
                },
              ];
              switch (this.draggedJob?.status) {
                case UserTaskStatus.DOING:
                  kanbanWork.inProgress = kanbanWork.inProgress.filter((x) => x.id !== this.draggedJob.id);
                  break;
                case UserTaskStatus.COMPLETE:
                  kanbanWork.done = kanbanWork.done.filter((x) => x.id !== this.draggedJob.id);
                  break;
              }
              this.kanbanWorks[kanbanWorkIndex] = kanbanWork;
            }
            this.draggedJob = null;
          },
          (err) => {
            this.loading = false;
            this.messageService.add({
              severity: 'error',
              detail: err,
            });
            this.draggedJob = null;
          },
        );
    }
  }

  dragStartInProgress(job: UserTaskModeList) {
    this.draggedJob = job;
  }

  dragEndInProgress() {
    // this.draggedJob = null
  }

  dropInProgress(event) {
    if (this.draggedJob && this.draggedJob.status !== UserTaskStatus.DOING) {
      this.loading = true;
      this.workflowService
        .statusTask({
          userTaskId: this.draggedJob.id,
          status: UserTaskStatus.DOING,
        })
        .subscribe(
          (res) => {
            this.loading = false;
            if (res) {
              const kanbanWork = this.kanbanWorks.find((kb) => kb.user?.fullName === this.draggedJob?.responsibleUserCreated?.fullName);
              const kanbanWorkIndex = this.kanbanWorks.indexOf(kanbanWork);
              kanbanWork.inProgress = [
                ...(kanbanWork.inProgress || []),
                {
                  ...this.draggedJob,
                  status: UserTaskStatus.DOING,
                },
              ];
              switch (this.draggedJob?.status) {
                case UserTaskStatus.OPENING:
                case UserTaskStatus.PAUSE:
                  kanbanWork.todo = kanbanWork.todo.filter((x) => x.id !== this.draggedJob.id);
                  break;
                case UserTaskStatus.COMPLETE:
                  kanbanWork.done = kanbanWork.done.filter((x) => x.id !== this.draggedJob.id);
                  break;
              }
              this.kanbanWorks[kanbanWorkIndex] = kanbanWork;
            }
            this.draggedJob = null;
          },
          (err) => {
            this.loading = false;
            this.messageService.add({
              severity: 'error',
              detail: err,
            });
            this.draggedJob = null;
          },
        );
    }
  }

  dragStartDone(job: UserTaskModeList) {
    this.draggedJob = job;
  }

  dragEndDone() {
    // this.draggedJob = null
  }

  dropDone(event) {
    if (this.draggedJob && this.draggedJob.status === UserTaskStatus.DOING) {
      this.loading = true;
      this.workflowService
        .statusTask({
          userTaskId: this.draggedJob.id,
          status: UserTaskStatus.COMPLETE,
        })
        .subscribe(
          (res) => {
            this.loading = false;
            if (res) {
              const kanbanWork = this.kanbanWorks.find((kb) => kb.user?.fullName === this.draggedJob?.responsibleUserCreated?.fullName);
              const kanbanWorkIndex = this.kanbanWorks.indexOf(kanbanWork);
              kanbanWork.done = [
                ...(kanbanWork.done || []),
                {
                  ...this.draggedJob,
                  status: UserTaskStatus.COMPLETE,
                },
              ];
              kanbanWork.inProgress = kanbanWork.inProgress.filter((x) => x.id !== this.draggedJob.id);
              this.kanbanWorks[kanbanWorkIndex] = kanbanWork;
            }
            this.draggedJob = null;
          },
          (err) => {
            this.loading = false;
            this.messageService.add({
              severity: 'error',
              detail: err,
            });
            this.draggedJob = null;
          },
        );
    }
  }

  getDepartments(keyword?: string) {
    this.departmentService.getAllDepartmentForTask().subscribe(
      (res) => {
        this.departments = res?.data || [];
      },
      (error) => {
        this.departments = [];
      },
    );
  }

  onFilterDepartment(event: any) {
    if (event) this.subjectDept.next(event.filter);
  }

  exportData() {
    this.loading = true;
    this.workflowService.export(this.exportParam).subscribe(
      (res) => {
        this.loading = false;
        saveAs(res, `Danh_sach_cong_viec_${format(new Date(), 'ddMMyyHHmm')}`);
      },
      (err) => {
        this.loading = false;
        this.messageService.add({
          severity: 'error',
          detail: AppUtil.translate(this.translateService, 'error.0'),
        });
      },
    );
  }

  onCancelForm() {
    this.display = false;
  }

  onDeleteWorkflow() {
    this.confirmationService.confirm({
      target: event.target,
      message: 'Bạn có muốn xóa công việc này?',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Có',
      rejectLabel: 'Không',
      accept: () => {
        this.loading = true;
        this.workflowService.delete(this.selectedJob.id).subscribe(
          (res) => {
            this.loading = false;
            this.messageService.add({
              severity: 'success',
              detail: 'Xóa thành công',
            });
            this.getWorkList();
          },
          (error) => {
            this.loading = false;
            this.messageService.add({
              severity: 'error',
              detail: 'Xóa thất bại',
            });
          },
        );
      },
      reject: () => {},
    });
  }

  onEditWorkflow(isShowForm = true) {
    if (isShowForm) {
      this.loading = true;
    }
    this.workflowService.getById(this.selectedJob.id).subscribe(
      (res) => {
        if (res) {
          const userIds =
            [
              res.userCreated,
              ...(res.taskRole?.map((item) => {
                return item.userId;
              }) || []),
            ] || [];
          this.userService
            .getPagingUser({
              page: 1,
              pageSize: userIds.length,
              ids: userIds,
            })
            .subscribe(
              (userResponse) => {
                this.loading = false;
                const responsiblePersonIds =
                  res.taskRole?.filter((item) => item.userTaskRoleId === UserTaskRole.RESPONSIBLE)?.map((per) => per.id) || [];
                const joinedPersonIds =
                  res.taskRole?.filter((item) => item.userTaskRoleId === UserTaskRole.JOINED)?.map((per) => per.id) || [];
                const viewedPersonIds =
                  res.taskRole?.filter((item) => item.userTaskRoleId === UserTaskRole.VIEWER)?.map((per) => per.id) || [];
                if (res.dueDate != null) {
                  res.dueDate = new Date(res.dueDate);
                }
                this.formData = {
                  ...res,
                  userCreateName: userResponse?.data?.find((per) => per.id === res.userCreated)?.fullName,
                  responsiblePerson:
                    userResponse?.data
                      ?.filter((per) => responsiblePersonIds.includes(per.id))
                      ?.map((item) => {
                        return {
                          ...item,
                          avatar: this.serverImg + item.avatar,
                        };
                      }) || [],
                  joinedPersons:
                    userResponse?.data
                      ?.filter((per) => joinedPersonIds.includes(per.id))
                      ?.map((item) => {
                        return {
                          ...item,
                          avatar: this.serverImg + item.avatar,
                        };
                      }) || [],
                  viewedPersons:
                    userResponse?.data
                      ?.filter((per) => viewedPersonIds.includes(per.id))
                      ?.map((item) => {
                        return {
                          ...item,
                          avatar: this.serverImg + item.avatar,
                        };
                      }) || [],
                };
                if (isShowForm) {
                  this.display = true;
                  this.isShowForm = true;
                }
                this.overlayPanel.hide();
              },
              (err) => {
                this.loading = false;
                this.messageService.add({
                  severity: 'error',
                  detail: 'error.0',
                });
              },
            );
        }
      },
      (err) => {
        this.loading = false;
        this.messageService.add({
          severity: 'error',
          detail: 'error.0',
        });
      },
    );
  }

  onPinWorkflow() {
    this.loading = true;
    this.workflowService.pinTask(this.selectedJob.id).subscribe(
      (res) => {
        this.loading = false;
        this.messageService.add({
          severity: 'success',
          detail: 'success.pin',
        });
        this.getWorkList();
      },
      (err) => {
        this.loading = false;
        this.messageService.add({
          severity: 'error',
          detail: 'error.0',
        });
      },
    );
  }

  onChangeStatusWorkflow(status: UserTaskStatus) {
    switch (this.selectedJob.status) {
      case UserTaskStatus.OPENING:
        if ([UserTaskStatus.COMPLETE, UserTaskStatus.PAUSE, UserTaskStatus.OPENING].includes(status)) return;
        break;
      case UserTaskStatus.DOING:
        if ([UserTaskStatus.DOING, UserTaskStatus.OPENING].includes(status)) return;
        break;
      case UserTaskStatus.PAUSE:
        if ([UserTaskStatus.PAUSE, UserTaskStatus.OPENING].includes(status)) return;
        break;
      case UserTaskStatus.COMPLETE:
        if ([UserTaskStatus.COMPLETE, UserTaskStatus.OPENING].includes(status)) return;
        break;
    }
    this.loading = true;
    this.workflowService
      .statusTask({
        userTaskId: this.selectedJob.id,
        status: status,
      })
      .subscribe(
        (res) => {
          this.loading = false;
          this.messageService.add({
            severity: 'success',
            detail: this.translateService.instant('success.update_status'),
          });
          this.getWorkList();
          this.overlayPanel.hide();
        },
        (err) => {
          this.loading = false;
          this.messageService.add({ severity: 'error', detail: err });
          this.overlayPanel.hide();
        },
      );
  }

  onCopyWorkflow() {
    this.confirmationService.confirm({
      target: event.target,
      message: 'Bạn có muốn copy công việc này?',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Có',
      rejectLabel: 'Không',
      accept: () => {
        this.loading = true;
        this.workflowService.copy(this.selectedJob.id).subscribe(
          (res) => {
            this.loading = false;
            this.messageService.add({
              severity: 'success',
              detail: 'success.copy',
            });
          },
          (err) => {
            this.loading = false;
            this.messageService.add({
              severity: 'error',
              detail: 'error.0',
            });
          },
        );
      },
      reject: () => {},
    });
  }

  onChangeCalendar() {
    if (this.calendarApi) {
      let startDate;
      let endDate;
      switch (this.calendarApi.currentData?.currentViewType) {
        case 'dayGridMonth':
          startDate = startOfMonth(this.calendarApi.currentData?.currentDate);
          endDate = endOfMonth(startDate);
          break;
        case 'dayGridWeek':
          startDate = startOfWeek(this.calendarApi.currentData?.currentDate);
          endDate = endOfWeek(startDate);
          break;
        case 'dayGridDay':
          startDate = startOfDay(this.calendarApi.currentData?.currentDate);
          endDate = endOfDay(startDate);
          break;
      }

      this.getWorkListCalendar({
        startDate: startDate,
        endDate: endDate,
      });
    }
  }

  onSearchUserTask(event?: any) {
    switch (this.activeItem.id) {
      case '1':
        this.getWorkList(this.exportParam);
        break;
      case '2':
        break;
      case '3':
        this.onChangeCalendar();
        break;
      case '4':
        break;
      case '5':
        this.getListProjectParent();
        break;
    }
  }

  @HostListener('document:keydown', ['$event'])
  async handleKeyboardEvent(event: KeyboardEvent) {
    switch (event.key) {
      case 'F7':
        event.preventDefault();
        await this.onAddWorkflow();
        break;
    }
  }

  fileLinks: any[] = [];
  serverUserTaskImg = environment.serverURLImage + '/Uploads/usertask/';

  doAttachFile(event: any): void {
    if (this.fileLinks.length >= 4 || event.target?.files.length > 4 || event.target?.files.length + this.fileLinks.length > 4) {
      return;
    }
    for (let i = 0; i < event.target?.files.length; i++) {
      const formData = new FormData();
      formData.append('file', event.target?.files[i]);
      this.userTaskCommentService.uploadFile(formData).subscribe((res: any) => {
        if (this.fileLinks.length < 4) {
          this.fileLinks.push(res);
        }
      });
    }
  }

  onRemoveImages() {
    this.fileLinks = this.fileLinks.filter((x) => !this.selectedImages.includes(x.fileId));
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

  newComment: any;
  newCommentImage: any;
  serverImage = `${environment.serverURLImage}/`;
  comments: any[] = [];

  onChangeEditor(event) {
    this.newComment = event.htmlValue;
    event?.delta?.ops?.map((item) => {
      if (item?.insert?.image) {
        const image = item?.insert?.image;
        const formData = new FormData();
        formData.append('file', new Blob([image.split(',')[1]], { type: 'image/png' }));
        this.userTaskCommentService.uploadFile(formData).subscribe(
          (res) => {
            if (res) {
              this.newCommentImage.push({
                oldText: image,
                newLink: this.serverImage + res.fileName,
              });
            }
          },
          (err) => {
            this.messageService.add({
              severity: 'error',
              detail: AppUtil.translate(this.translateService, 'error.0'),
            });
          },
        );
      }
    });
  }

  isGetComments = false;

  onGetComments(task) {
    this.isGetComments = true;
    this.workflowService.getById(task.id).subscribe({
      next: (res): void => {
        this.selectedItem = res;
        this.userTaskCommentService.getByTask({ id: task.id }).subscribe(
          (res) => {
            this.comments = res?.map((cmt) => {
              return {
                ...cmt,
                commentHTML: this.sanitizer.bypassSecurityTrustHtml(cmt.comment || ''),
              };
            });
            this.isGetComments = false;
          },
          (err) => {
            this.messageService.add({
              severity: 'error',
              detail: AppUtil.translate(this.translateService, 'error.0'),
            });
            this.isGetComments = false;
          },
        );
      },
    });
  }

  onAddComment() {
    if (this.newCommentImage?.length) {
      this.newCommentImage?.map((cmtImg) => {
        this.newComment.replace(cmtImg.oldText, cmtImg.newLink);
      });
    }
    this.userTaskCommentService
      .add({
        id: 0,
        userTaskId: this.selectedItem.id,
        userId: this.authService.user.id,
        type: 'edit',
        comment: this.newComment,
        parentId: 0,
        createdDate: new Date(),
        fileLink: this.fileLinks,
        nameOfUser: this.authService.user.fullname,
        isAllowEdit: true,
        taskRole: [],
      })
      .subscribe(
        (res) => {
          if (res) {
            this.newComment = '';
            this.fileLinks = [];
            this.onGetComments(this.selectedItem);
          }
        },
        (err) => {
          this.messageService.add({
            severity: 'error',
            detail: AppUtil.translate(this.translateService, 'error.0'),
          });
        },
      );
  }

  allowShowEditPopup(item) {
    return item['responsiblePerson'].map((x) => x.userId).includes(this.authService.user.id);
  }
}
