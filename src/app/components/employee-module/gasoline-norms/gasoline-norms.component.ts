import { Component, OnInit, ViewChild } from '@angular/core';
import { DriverRouterService } from '@app/service/driver-router.service';
import { RouteService } from '@app/service/route.service';
import { ToastService } from '@app/service/toast.service';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { TypeData } from 'src/app/models/common.model';
import { PetrolConsumptions } from 'src/app/models/gasoline-norms.model';
import { CarListService } from 'src/app/service/car-list.service';
import { GasolineNormsService } from 'src/app/service/gasoline-norms.service';
import { UserService } from 'src/app/service/user.service';
import AppConstant from 'src/app/utilities/app-constants';
import AppUtil from 'src/app/utilities/app-util';
import { GasolineNormsFormComponent } from './components/gasoline-norms-form/gasoline-norms-form.component';

@Component({
  selector: 'app-gasoline-norms',
  templateUrl: './gasoline-norms.component.html',
  styleUrls: ['../../../../assets/demo/badges.scss', 'gasoline-norms.component.scss'],
})
export class GasolineNormsComponent implements OnInit {
  public appConstant = AppConstant;
  @ViewChild('gasForm') GasolineNormsFormComponent: GasolineNormsFormComponent | undefined;

  loading: boolean = true;

  public getParams = {
    page: 0,
    pageSize: 10,
    searchText: '',
  };
  public totalRecords = 0;
  public totalPages = 0;

  public isLoading: boolean = false;
  public listPetro: PetrolConsumptions[] = [];

  first = 0;
  isMobile = screen.width <= 1199;

  formData: any = {};
  isEdit: boolean = false;
  isReset: boolean = false;

  display: boolean = false;
  pendingRequest: any;
  cols: any[] = [
    {
      header: 'label.date',
      value: 'date',
      width: 'width:10%;',
      display: true,
      classify: 'personal_info',
      optionHide: false,
    },
    {
      header: 'label.car_recipient',
      value: 'userId',
      width: 'width:20%;',
      display: true,
      classify: 'personal_info',
      optionHide: false,
    },
    {
      header: 'label.car',
      value: 'carId',
      width: 'width:10%;',
      display: true,
      classify: 'personal_info',
      optionHide: false,
    },

    {
      header: 'label.gas_price',
      value: 'petroPrice',
      width: 'width:10%;',
      display: true,
      classify: 'personal_info',
      optionHide: false,
    },
    {
      header: 'label.number_km_delivery',
      value: 'kmFrom',
      width: 'width:15%;',
      display: true,
      classify: 'personal_info',
      optionHide: false,
    },
    {
      header: 'label.number_km_receive',
      value: 'kmTo',
      width: 'width:15%;',
      display: true,
      classify: 'personal_info',
      optionHide: true,
    },

    {
      header: 'label.location_from',
      value: 'locationFrom',
      width: 'width:15%;',
      display: true,
      classify: 'personal_info',
      optionHide: true,
    },
    {
      header: 'label.location_to',
      value: 'locationTo',
      width: 'width:15%;',
      display: true,
      classify: 'personal_info',
      optionHide: true,
    },
    {
      header: 'label.advance_amount',
      value: 'advanceAmount',
      width: 'width:10%;',
      display: true,
      classify: 'personal_info',
      optionHide: true,
    },
    {
      header: 'label.note',
      value: 'note',
      width: 'width:15%;',
      display: true,
      classify: 'personal_info',
      optionHide: true,
    },
  ];

  employees: any[] = [];
  cars: any[] = [];
  roadRouteList: any[] = [];

  constructor(
    private messageService: MessageService,
    private readonly translateService: TranslateService,
    private readonly confirmationService: ConfirmationService,
    private readonly userService: UserService,
    private readonly gasolineNormsService: GasolineNormsService,
    private readonly carListService: CarListService,
    private routeService: RouteService,
    private driverRouterService: DriverRouterService,
    private toastService: ToastService,
  ) {}

  ngOnInit(): void {
    this.userService.getAllUserActive().subscribe((res: any) => {
      this.employees = res.data;
    });

    this.carListService.getListCars().subscribe((res) => {
      this.cars = res.data;
    });
    this.routeService.getAll().subscribe((res) => {
      this.roadRouteList = res?.data?.data || [];
    });
  }

  onGetPetro(event?: any, isExport: boolean = false): void {
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
    this.pendingRequest = this.gasolineNormsService
      .getPetroConsumptions(this.getParams)
      .subscribe((response: TypeData<PetrolConsumptions>) => {
        AppUtil.scrollToTop();
        this.listPetro = response.data;

        this.listPetro.map((x) => {
          x.petroPrice = this.formatNumber(x.petroPrice);
          x.kmFrom = this.formatNumber(x.kmFrom);
          x.kmTo = this.formatNumber(x.kmTo);
          x.advanceAmount = this.formatNumber(x.advanceAmount);
        });
        this.totalRecords = response.totalItems || 0;
        this.totalPages = response.totalItems / response.pageSize + 1;
        this.loading = false;
      });
  }

  onSearch(event) {
    if (event.key === 'Enter') {
      this.onGetPetro();
    }
  }

  showDialog() {
    this.GasolineNormsFormComponent.onReset();
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
    this.translateService.get('question.delete_gas_header').subscribe((res) => {
      header = res;
    });
    this.confirmationService.confirm({
      message: message,
      header: header,
      accept: () => {
        this.gasolineNormsService.deletePetrolConsumptions(id).subscribe(
          (res) => {
            AppUtil.scrollToTop();
            this.messageService.add({
              severity: 'success',
              detail: 'Xóa thành công',
            });
            this.onGetPetro();
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

  getDetail(petro) {
    this.gasolineNormsService.getDetail(petro.id).subscribe((response: PetrolConsumptions) => {
      this.formData = response;
      this.isEdit = true;
      this.showDialog();
    });
  }

  formatNumber(n) {
    return n.toFixed(0).replace(/./g, function (c, i, a) {
      return i > 0 && c !== '.' && (a.length - i) % 3 === 0 ? ',' + c : c;
    });
  }

  onStart(id) {
    this.driverRouterService.start(id).subscribe((res) => {
      this.toastService.success('Bắt đầu lộ trình thành công');
    });
  }

  onFinish(id) {
    this.driverRouterService.stop(id).subscribe((res) => {
      this.toastService.success('Kết thúc lộ trình thành công');
    });
  }
}
