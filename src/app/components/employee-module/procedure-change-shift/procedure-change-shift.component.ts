import { Component, OnInit, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { map } from 'rxjs';
import { ProcedureRequestOvertimesService } from 'src/app/service/procedure-request-overtimes.service';
import { ProcedureService } from 'src/app/service/procedure.service';
import { UserService } from 'src/app/service/user.service';
import AppConstant from 'src/app/utilities/app-constants';
import AppUtil from 'src/app/utilities/app-util';
import { ProcedureChangeShiftFormComponent } from './procedure-change-shift-form/procedure-change-shift-form.component';
import { ProcedureChangeShiftService } from 'src/app/service/procedure-change-shift.service';

@Component({
  selector: 'app-procedure-change-shift',
  templateUrl: './procedure-change-shift.component.html',
  styleUrls: ['./procedure-change-shift.component.scss']
})
export class ProcedureChangeShiftComponent implements OnInit {
  @ViewChild('procedureChangeShiftForm') procedureChangeShiftComponent: ProcedureChangeShiftFormComponent
  public appConstant = AppConstant;

  loading: boolean = true;

  sortFields: any[] = [];
  sortTypes: any[] = [];

  first = 0;

  public getParams = {
    page: 1,
    pageSize: 5,
    sortField: 'id',
    isSort: true,
    searchText: '',
  };
  public totalRecords = 0;
  public totalPages = 0;

  public isLoading: boolean = false;

  public listRequest: any[] = [];

  display: boolean = false;

  isMobile = screen.width <= 1199;

  formData: any = {};
  isEdit: boolean = false;
  isReset: boolean = false;

  pendingRequest: any;
  roles: any[] = [];
  procedureNumber: any;
  employees: any[] = [];

  constructor(
    private readonly changeShiftService: ProcedureChangeShiftService,
    private readonly translateService: TranslateService,
    private readonly confirmationService: ConfirmationService,
    private readonly messageService: MessageService,
    private readonly userService: UserService,
  ) { }

  ngOnInit() {
    this.changeShiftService.getProcedureNumber().pipe(
      map(res => res.toString())
    ).subscribe((res) => {
      this.procedureNumber = res;
    });
    this.userService.getAllUserActive().subscribe((res: any) => {
      this.employees = res.data;
    });

  }

  getRequests(event?: any, isExport: boolean = false): void {
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
    this.pendingRequest = this.changeShiftService
      .getProcedureChangeShifts(this.getParams)
      .subscribe((response: any) => {
        AppUtil.scrollToTop();
        this.listRequest = response.data;
        this.totalRecords = response.totalItems || 0;
        this.totalPages = response.totalItems / response.pageSize + 1;
        this.loading = false;
      });
  }

  onSearch(event) {
    if (event.key === 'Enter') {
      this.getRequests();
    }
  }

  showDialog() {
    this.procedureChangeShiftComponent.onReset();
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
        this.changeShiftService
          .deleteProcedureChangeShift(id)
          .subscribe(
            (res) => {
              AppUtil.scrollToTop();
              this.messageService.add({
                severity: 'success',
                detail: 'Xóa thành công',
              });
              this.getRequests();
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
    this.procedureChangeShiftComponent.getDetail(id);
    this.display = true;
  }

}
