import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { finalize } from 'rxjs';
import { SellReportServiceService } from 'src/app/service/sell-report-service.service';

@Component({
  selector: 'app-sale-department-salary-report',
  templateUrl: './sale-department-salary-report.component.html',
  styles: [],
})
export class SaleDepartmentSalaryReportComponent implements OnInit {
  loading: boolean = false;

  isMobile = screen.width <= 1199;
  dataList: any[] = [];
  summaryData: any = {};

  employees: any[] = [];

  startDate = new Date();
  endDate = new Date();
  cols: any[] = [
    {
      header: 'TÊN KHÁCH HÀNG',
      value: 'customerName',
      width: 'width:15%',
      display: true,
      classify: 'salary_level',
      optionHide: false,
      specType: '',
    },
    {
      header: 'DS CÒN LẠI',
      value: 'quantityRemaining',
      width: 'width:10%',
      display: true,
      classify: 'salary_level',
      optionHide: false,
      specType: '',
    },
    {
      header: 'THÀNH TIỀN CÒN LẠI',
      value: 'amountRemaining',
      width: 'width:15%',
      display: true,
      classify: 'salary_level',
      optionHide: false,
      specType: '',
    },
    {
      header: 'HÀNG XUẤT BÁN',
      value: 'quantitySold',
      width: 'width:12%',
      display: true,
      classify: 'salary_level',
      optionHide: false,
    },
    {
      header: 'T.TIỀN XUẤT BÁN',
      value: 'amountSold',
      width: 'width:12%',
      display: true,
      classify: 'salary_level',
      optionHide: false,
    },
    {
      header: 'HÀNG TRẢ VỀ',
      value: 'quantityRefund',
      width: 'width:12%',
      display: true,
      classify: 'salary_level',
      optionHide: false,
      specType: 'number',
    },
    {
      header: 'T.TIỀN TRẢ VỀ',
      value: 'amountRefund',
      width: 'width:12%',
      display: true,
      classify: 'salary_level',
      optionHide: true,
      specType: 'number',
    },
    {
      header: 'T.TIỀN THU VỀ',
      value: 'totalAmount',
      width: 'width:12%',
      display: true,
      classify: 'salary_level',
      optionHide: true,
      specType: 'number',
    }
  ];

  public getParams = {
    userId: '',
    fromAt: '',
    toAt: ''
  };

  constructor(
    private readonly sellReportService: SellReportServiceService,
  ) { }

  ngOnInit(): void {
    this.startDate.setDate(1);
    this.getAllUserActive();
  }

  getAllUserActive() {
    this.getParams['startDate'] = moment(this.startDate).format('YYYY-MM-DD');
    this.getParams['endDate'] = moment(this.endDate).format('YYYY-MM-DD');

    this.sellReportService
      .getUserForReportBill(this.getParams)
      .subscribe((res: any) => {
        this.employees = res.data;
        if (!this.getParams.userId && this.employees.length > 0) {
          this.getParams.userId = this.employees[0].id;
          this.getReport();
        }
        else {
          this.dataList = [];
          this.summaryData = {};
        }
      });
  }

  getReport() {
    if (this.loading) {
      return;
    }

    this.getParams.fromAt = moment(this.startDate).format('YYYY-MM-DD');
    this.getParams.toAt = moment(this.endDate).format('YYYY-MM-DD');
    this.loading = true;

    this.sellReportService.getSaleDepartmentSalary(this.getParams)
      .pipe(finalize(() => this.loading = false))
      .subscribe((res) => {
        if (res === null || res.data === null) {
          this.dataList = [];
          this.summaryData = [];
        }

        this.dataList = res.data.items ?? [];

        this.summaryData = {
          averageUnitPrice: res.data.averageUnitPrice ?? 0,
          tonsCollected: res.data.tonsCollected ?? 0,
          totalQuantity: res.data.totalQuantity ?? 0,
          amountBonus: res.data.amountBonus ?? 0,
          receiveBonus: res.data.receiveBonus ?? 0,
          toTalAmount: res.data.toTalAmount ?? 0,
          totalQuantityRemaining: 0,
          totalAmountRemaining: 0,
          totalQuantitySold: 0,
          totalAmountSold: 0,
          totalQuantityRefund: 0,
          totalAmountRefund: 0,
          totalTotalAmount: 0,
        };

        this.dataList.forEach((item) => {
          this.summaryData.totalQuantityRemaining += item.quantityRemaining;
          this.summaryData.totalAmountRemaining += item.amountRemaining;
          this.summaryData.totalQuantitySold += item.quantitySold;
          this.summaryData.totalAmountSold += item.amountSold;
          this.summaryData.totalQuantityRefund += item.quantityRefund;
          this.summaryData.totalAmountRefund += item.amountRefund;
          this.summaryData.totalTotalAmount += item.totalAmount;
        });
      });
  }
}
