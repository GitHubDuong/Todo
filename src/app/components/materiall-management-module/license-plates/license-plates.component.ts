import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { CarListService } from 'src/app/service/car-list.service';
import AppConstant from 'src/app/utilities/app-constants';
import AppUtil from 'src/app/utilities/app-util';
import { LicensePlatesFormComponent } from './license-plates-form/license-plates-form.component';

@Component({
  selector: 'app-license-plates',
  templateUrl: './license-plates.component.html',
  styleUrls: ['./license-plates.component.scss'],
})
export class LicensePlatesComponent implements OnInit {
  @ViewChild('CarForm') CarFormComponent: LicensePlatesFormComponent | undefined;

  public appConstant = AppConstant;

  loading: boolean = true;

  public getParams = {
    page: 0,
    pageSize: 10,
    searchText: '',
  };
  public totalRecords = 0;
  public totalPages = 0;

  public listCar: any[] = [];

  first = 0;
  isMobile = screen.width <= 1199;

  formData: any = {};
  isEdit: boolean = false;
  isReset: boolean = false;

  display: boolean = false;
  pendingRequest: any;
  cols: any[] = [
    {
      header: 'label.stt',
      value: 'id',
      width: 'width:10%;',
      display: true,
      classify: 'personal_info',
      optionHide: false,
    },
    {
      header: 'label.license_plate',
      value: 'licensePlates',
      width: 'width:10%;',
      display: true,
      classify: 'personal_info',
      optionHide: false,
    },
    {
      header: 'label.note',
      value: 'note',
      width: 'width:25%;',
      display: true,
      classify: 'personal_info',
      optionHide: true,
    },
    {
      header: 'Định mức 100km',
      value: 'mileageAllowance',
      width: 'width:15%;',
      display: true,
      classify: 'personal_info',
      optionHide: true,
    },
    {
      header: 'Nội dung',
      value: 'content',
      width: 'width:15%;',
      display: true,
      classify: 'personal_info',
      optionHide: true,
    },
    {
      header: 'label.file',
      value: 'file',
      width: 'width:15%;',
      display: true,
      classify: 'personal_info',
      optionHide: true,
    },
  ];

  constructor(
    private messageService: MessageService,
    private readonly translateService: TranslateService,
    private readonly confirmationService: ConfirmationService,
    private readonly carListService: CarListService,
  ) {}

  ngOnInit(): void {}

  onGetCars(event?: any): void {
    if (this.pendingRequest) {
      this.pendingRequest.unsubscribe();
    }
    this.loading = true;
    if (event) {
      this.getParams.page = event.first / event.rows;
      this.getParams.pageSize = event.rows;
    }
    // remove undefined value
    Object.keys(this.getParams).forEach((k) => this.getParams[k] == null && delete this.getParams[k]);
    this.pendingRequest = this.carListService.getListCars(this.getParams).subscribe((response) => {
      AppUtil.scrollToTop();
      this.listCar = response.data;
      this.totalRecords = response.totalItems || 0;
      this.totalPages = response.totalItems / response.pageSize + 1;
      this.loading = false;
    });
  }

  onAdd() {
    this.isEdit = false;
    this.CarFormComponent.onReset();
    this.display = true;
  }

  getDetail(id) {
    this.isEdit = true;
    this.CarFormComponent.getDetail(id);
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
        this.carListService.deleteCar(id).subscribe(
          (res) => {
            AppUtil.scrollToTop();
            this.messageService.add({
              severity: 'success',
              detail: 'Xóa thành công',
            });
            this.onGetCars();
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
