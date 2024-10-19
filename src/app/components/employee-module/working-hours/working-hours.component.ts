import { Component, OnInit, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ShiftService } from 'src/app/service/shift.service';
import { SymbolService } from 'src/app/service/symbol.service';
import AppConstant from 'src/app/utilities/app-constants';
import AppUtil from 'src/app/utilities/app-util';
import { WorkingHoursFormComponent } from './working-hours-form/working-hours-form.component';

@Component({
  selector: 'app-working-hours',
  templateUrl: './working-hours.component.html',
  styleUrls: ['./working-hours.component.scss'],
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
    `,
  ],
})
export class WorkingHoursComponent implements OnInit {
  @ViewChild('shiftForm') WorkingHoursFormComponent:
    | WorkingHoursFormComponent
    | undefined;
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

  public lstShifts: any[] = [];

  display: boolean = false;

  isMobile = screen.width <= 1199;

  formData: any = {};
  isEdit: boolean = false;
  isReset: boolean = false;

  pendingRequest: any;
  roles: any[] = [];
  listSymbol: any[] = [];

  constructor(
    private readonly SymbolService: SymbolService,
    private readonly translateService: TranslateService,
    private readonly confirmationService: ConfirmationService,
    private readonly shiftService: ShiftService,
    private readonly messageService: MessageService,
  ) {}

  ngOnInit() {
    this.SymbolService.getAllSymbol().subscribe((res) => {
      this.listSymbol = res.data;
    });
  }

  getShifts(event?: any, isExport: boolean = false): void {
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
    this.pendingRequest = this.shiftService
      .getShifts(this.getParams)
      .subscribe((response: any) => {
        AppUtil.scrollToTop();
        this.lstShifts = response.data;
        this.totalRecords = response.totalItems || 0;
        this.totalPages = response.totalItems / response.pageSize + 1;
        this.loading = false;
      });
  }

  onSearch(event) {
    if (event.key === 'Enter') {
      this.getShifts();
    }
  }

  showDialog() {
    this.WorkingHoursFormComponent.onReset();
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
        this.shiftService.deleteShift(id).subscribe(
          (res) => {
            AppUtil.scrollToTop();
            this.messageService.add({
              severity: 'success',
              detail: 'Xóa thành công',
            });
            this.getShifts();
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
    this.WorkingHoursFormComponent.getDetail(id);
    this.display = true;
  }

  convertTimeSpanToDate(timeSpan: any): Date {
    const [hours, minutes, seconds] = timeSpan.split(':').map(Number);

    // Tạo một đối tượng Date với giờ, phút và giây tương ứng
    const date = new Date();
    date.setHours(hours);
    date.setMinutes(minutes);
    date.setSeconds(seconds);

    return date;
  }
}
