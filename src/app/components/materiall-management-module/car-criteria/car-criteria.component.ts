import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { CarFieldService } from 'src/app/service/car-field.service';
import AppConstant from 'src/app/utilities/app-constants';
import AppUtil from 'src/app/utilities/app-util';
import { CarCriteriaFormComponent } from './car-criteria-form/car-criteria-form.component';
import { CarListService } from 'src/app/service/car-list.service';

@Component({
  selector: 'app-car-criteria',
  templateUrl: './car-criteria.component.html',
  styleUrls: ['./car-criteria.component.scss'],
})
export class CarCriteriaComponent implements OnInit {
  @ViewChild('carCriteriaFrom') carCriteriaFrom: CarCriteriaFormComponent;

  public appConstant = AppConstant;

  loading: boolean = true;

  public getParams = {
    Page: 0,
    PageSize: 10,
    SortField: 'id',
    isSort: true,
    SearchText: '',
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
      value: 'order',
      width: 'width:25%;',
      display: true,
      classify: 'personal_info',
      optionHide: false,
    },
    {
      header: 'label.license_plate_car',
      value: 'licensePlates',
      width: 'width:25%;',
      display: true,
      classify: 'personal_info',
      optionHide: false,
    },
    {
      header: 'label.name',
      value: 'name',
      width: 'width:35%;',
      display: true,
      classify: 'personal_info',
      optionHide: false,
    },
  ];

  carName = null;
  licensePlates: any[] = [];
  constructor(
    private messageService: MessageService,
    private readonly translateService: TranslateService,
    private readonly confirmationService: ConfirmationService,
    private readonly carFieldService: CarFieldService,
    private readonly carListService: CarListService,
  ) {}

  ngOnInit(): void {
    this.carListService.getAllCars().subscribe((res) => {
      this.licensePlates = res.data;
    });
  }

  onGetCars(event?: any): void {
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
    this.pendingRequest = this.carFieldService
      .getCarFields(this.getParams)
      .subscribe((response) => {
        AppUtil.scrollToTop();
        this.listCar = response.data;
        if (this.carName != null) {
          this.listCar = this.listCar.filter(
            (x) => x.licensePlates === this.carName,
          );
        }
        this.totalRecords = response.totalItems || 0;
        this.totalPages = response.totalItems / response.pageSize + 1;
        this.loading = false;
      });
  }

  onAdd() {
    this.isEdit = false;
    this.carCriteriaFrom.onReset();
    this.display = true;
  }

  getDetail(id) {
    this.isEdit = true;
    this.carCriteriaFrom.getDetail(id);
    this.display = true;
  }

  onSearch(event) {
    if (event.key === 'Enter') {
      this.onGetCars();
    }
  }

  onReplication(id) {
    this.isEdit = false;
    this.carCriteriaFrom.getDetail(id);
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
        this.carFieldService.deleteCarField(id).subscribe(
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
