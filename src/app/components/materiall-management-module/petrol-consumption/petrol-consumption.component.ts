import { Component, OnInit } from '@angular/core';
import { FileDeliveredModel } from '@app/models/procedure/procedure-product.model';
import { CarListService } from '@app/service/car-list.service';
import { PetrolConsumptionService } from '@app/service/petrol-consumption.service';
import { ToastService } from '@app/service/toast.service';
import * as moment from 'moment';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-petrol-consumption',
  templateUrl: './petrol-consumption.component.html',
  styleUrls: ['./petrol-consumption.component.scss']
})
export class PetrolConsumptionComponent implements OnInit {
  loading: boolean = false;
  showImage: boolean = false;

  fileList: FileDeliveredModel[] = [];

  isMobile = screen.width <= 1199;
  dataList: any[] = [];

  cars: any[] = [];

  startDate = new Date();
  endDate = new Date();
  cols: any[] = [
    {
      header: 'NGÀY',
      width: 'width:10%',
    },
    {
      header: 'THÁNG',
      width: 'width:7%',
    },
    {
      header: 'DIỄN GIẢI',
      width: 'width:25%',
    },
    {
      header: 'TẠM ỨNG',
      width: 'width:11%',
    },
    {
      header: 'NGÀY VỀ',
      width: 'width:10%',
    },
    {
      header: 'SỐ TIỀN CHI',
      width: 'width:10%',
    },
    {
      header: 'CÒN LẠI',
      width: 'width:10%',
    },
    {
      header: 'LỜI/LỖ',
      width: 'width:10%',
    },
    {
      header: 'TỆP TIN',
      width: 'width:7%',
    }
  ];

  public getParams = {
    carId: '',
    fromAt: '',
    toAt: ''
  };

  constructor(
    private readonly petrolConsumptionService: PetrolConsumptionService,
    private readonly carListService: CarListService,
    private readonly toastService: ToastService
  ) { }

  ngOnInit(): void {
    this.startDate.setDate(1);
    this.startDate.setFullYear(2021);
    this.getAllCars();
  }

  getAllCars() {
    this.carListService
      .getAllCars()
      .subscribe((res: any) => {
        this.cars = res.data;
        if (!this.getParams.carId && this.cars.length > 0) {
          this.getParams.carId = this.cars[0].id;
          this.getReport();
        }
        else {
          this.dataList = [];
        }
      });
  }

  getReport() {
    if (this.loading) {
      return;
    }

    this.getParams.fromAt = moment(this.startDate).format('YYYY-MM-DD');
    this.getParams.toAt = moment(this.endDate).format('YYYY-MM-DD');
    this.getParams.carId = this.getParams.carId ?? "";

    this.loading = true;

    this.petrolConsumptionService.getReport(this.getParams)
      .pipe(finalize(() => this.loading = false))
      .subscribe((res) => {
        this.dataList = res as unknown as any[] ?? [];
        this.dataList = this.dataList.map((data) => {
          data.profitLossAmount = 0;
          return data;
        });
      });
  }

  onShowImage(rowData: any) {
    if (!rowData?.files || rowData?.files.length === 0) {
      this.toastService.error("Không tệp nào được đính kèm")
      this.fileList = [];
      this.showImage = false;
      return;
    }

    this.fileList = rowData.files;
    this.showImage = true;
  }
}
