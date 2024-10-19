import { Component, OnInit } from '@angular/core';
import { ColumnDataType } from '@app/core/enum';
import { TableColumModel } from '@app/models/common/table-colum.model';
import { DriverRouterService } from '@app/service/driver-router.service';
import { GasolineNormsService } from '@app/service/gasoline-norms.service';
import { ToastService } from '@app/service/toast.service';

@Component({
  selector: 'app-driver',
  templateUrl: './driver.component.html',
  styleUrls: ['./driver.component.scss'],
})
export class DriverComponent implements OnInit {
  showForm = false;
  selectedItem: any;
  loading = false;
  data: any[] = [];
  columns: TableColumModel[] = [];
  pageIndex = 0;
  pageSize = 10;
  totalItem = 0;
  gasolineList: any[] = [];

  constructor(
    private driverRouteService: DriverRouterService,
    private readonly gasolineNormsService: GasolineNormsService,
    private toastService: ToastService,
  ) {}

  ngOnInit(): void {
    this.columns = [
      { field: 'date', label: 'Thời gian ', type: ColumnDataType.date, class: 'w-2' },
      { field: 'driver', label: 'Nhận xe', type: ColumnDataType.text, class: 'w-2' },
      { field: 'roadRouteName', label: 'Lộ trình', type: ColumnDataType.text, class: 'w-2' },
      { field: 'kmFrom', label: 'Km bắt đầu', type: ColumnDataType.number, class: 'w-1' },
      { field: 'kmTo', label: 'Km kết thúc', type: ColumnDataType.number, class: 'w-1' },
      { field: 'amount', label: 'Tổng tiền', type: ColumnDataType.number, class: 'w-2' },
    ];
    this.getData();
  }

  onShowForm(item: any = undefined) {
    this.showForm = true;
    this.selectedItem = item;
  }

  onLoad(event: any = undefined) {
    this.loading = true;
    if (event) {
      this.pageIndex = event.first / event.rows;
      this.pageSize = event.rows;
    }
    this.driverRouteService.getByPage({ Page: this.pageIndex, PageSize: this.pageSize }).subscribe(
      (res: any) => {
        this.loading = false;
        this.data = res.data;
        this.totalItem = res.totalItems;
      },
      (error) => {
        this.loading = false;
      },
    );
  }

  onDelete(id) {
    this.driverRouteService.delete(id).subscribe(
      (res: any) => {
        this.toastService.success('Xóa thành công');
        this.onLoad();
      },
      (error) => {
        console.log(error);
      },
    );
  }

  private getData() {
    this.gasolineNormsService.getAll().subscribe((res: any) => {
      this.gasolineList = res.data;
    });
  }
}
