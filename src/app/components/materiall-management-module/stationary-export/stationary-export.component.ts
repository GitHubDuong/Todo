import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DepartmentService } from 'src/app/service/department.service';
import { StationaryExportService } from 'src/app/service/stationary-export.service';
import { UserService } from 'src/app/service/user.service';
import AppConstant from 'src/app/utilities/app-constants';
import AppUtil from 'src/app/utilities/app-util';
import { StationaryExportFormComponent } from './stationary-export-form/stationary-export-form.component';
import { OfficeService } from 'src/app/service/office.service';

@Component({
  selector: 'app-stationary-export',
  templateUrl: './stationary-export.component.html',
  styleUrls: ['./stationary-export.component.scss'],
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
      :host ::ng-deep .p-button {
        height: 40px;
      }
      :host ::ng-deep .flex-show-web {
        display: flex;
        justify-content: center;
      }
    `,
  ],
})
export class StationaryExportComponent implements OnInit {
  @ViewChild('stationeryExportFrom')
  stationeryExportFrom: StationaryExportFormComponent;

  public appConstant = AppConstant;
  public getParams = {
    Page: 0,
    PageSize: 10,
    SortField: 'id',
    isSort: true,
    SearchText: '',
  };
  public totalRecords = 0;
  public totalPages = 0;

  public isLoading: boolean = false;
  public listStationeries: any[] = [];

  loading = true;
  first = 0;
  isMobile = screen.width <= 1199;
  display = false;

  formData: any = {};
  isEdit: boolean = false;
  isReset: boolean = false;

  pendingRequest: any;
  listUser: any[] = [];
  listDepartment: any[] = [];
  listAllStationer: any[] = [];
  constructor(
    private messageService: MessageService,
    private readonly translateService: TranslateService,
    private readonly confirmationService: ConfirmationService,
    private readonly stationaryExportService: StationaryExportService,
    private readonly departmentService: DepartmentService,
    private readonly userService: UserService,
    private readonly officeService: OfficeService,
  ) {}

  ngOnInit(): void {
    this.userService.getAllUserActive().subscribe((res: any) => {
      this.listUser = res.data;
    });
    this.departmentService.getAllDepartment().subscribe((res) => {
      this.listDepartment = res.data;
    });
    this.getAllStationer();
  }

  onGetStationeryExport(event?: any, isExport: boolean = false): void {
    if (this.pendingRequest) {
      this.pendingRequest.unsubscribe();
    }
    this.loading = true;
    if (event) {
      this.getParams.Page = event.first / event.rows;
      this.getParams.PageSize = event.rows;
    }
    // remove undefined value
    Object.keys(this.getParams).forEach(
      (k) => this.getParams[k] == null && delete this.getParams[k],
    );
    this.pendingRequest = this.stationaryExportService
      .getListStationaryExports(this.getParams)
      .subscribe((response) => {
        AppUtil.scrollToTop();
        this.listStationeries = response.data;
        this.totalRecords = response.totalItems || 0;
        this.totalPages = response.totalItems / response.pageSize + 1;
        this.loading = false;
      });
  }

  onAdd() {
    this.isEdit = false;
    this.stationeryExportFrom.onReset();
    this.display = true;
  }

  getAllStationer() {
    this.officeService.getAllStationer().subscribe((res) => {
      if (res?.data?.length > 0) {
        this.listAllStationer = res.data;
      }
    });
  }

  getDetail(id) {
    this.isEdit = true;
    this.stationeryExportFrom.getDetail(id);
    this.display = true;
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
        this.stationaryExportService.deleteStationaryExport(id).subscribe(
          (res) => {
            AppUtil.scrollToTop();
            this.messageService.add({
              severity: 'success',
              detail: 'Xóa thành công',
            });
            this.onGetStationeryExport();
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

  @HostListener('document:keydown', ['$event'])
  async handleKeyboardEvent(event: KeyboardEvent) {
    switch (event.key) {
      case 'F7':
        event.preventDefault();
        await this.onAdd();
        break;
    }
  }
}
