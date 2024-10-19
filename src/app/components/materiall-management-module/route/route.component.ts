import { Component, OnInit } from '@angular/core';
import { ColumnDataType } from '@app/core/enum';
import { TableColumModel } from '@app/models/common/table-colum.model';
import { RouteService } from '@app/service/route.service';
import { ToastService } from '@app/service/toast.service';
import { PolicePostService } from '@components/materiall-management-module/police-post/police-post.service';

@Component({
  selector: 'app-route',
  templateUrl: './route.component.html',
  styleUrls: ['./route.component.scss'],
})
export class RouteComponent implements OnInit {
  showForm = false;
  selectedItem: any;
  loading = false;
  data: any[] = [];
  columns: TableColumModel[] = [];
  pageIndex = 0;
  pageSize = 10;
  totalItem = 0;
  policePostList: any[] = [];

  constructor(
    private routeService: RouteService,
    private policePostService: PolicePostService,
    private toastService: ToastService,
  ) {}

  ngOnInit(): void {
    this.columns = [
      { field: 'code', label: 'Mã lộ trình', type: ColumnDataType.text, class: 'w-2' },
      { field: 'name', label: 'Tên lộ trình', type: ColumnDataType.text, class: 'w-2' },
      { field: 'roadRouteDetail', label: 'Chi tiết', type: ColumnDataType.text, class: 'w-2' },
      { field: 'policeCheckPoint', label: 'Chốt công an', type: ColumnDataType.text, class: 'w-2' },
      { field: 'numberOfTrips', label: 'Lương chuyến', type: ColumnDataType.number, class: 'w-2' },
    ];
    this.getData();
  }

  onShowForm(item: any = undefined) {
    this.showForm = true;
    this.selectedItem = item;
  }

  onLoad(event: any = null) {
    this.loading = true;
    if (event) {
      this.pageIndex = event.first / event.rows;
      this.pageSize = event.rows;
    }
    this.routeService.getByPage({ Page: this.pageIndex, PageSize: this.pageSize }).subscribe(
      (res: any) => {
        this.loading = false;
        this.data = res.data.data;
        this.totalItem = res.data.totalItems;
      },
      (error) => {
        this.loading = false;
      },
    );
  }

  onDelete(id: number) {
    this.routeService.delete(id).subscribe(
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
    this.policePostService.getAll().subscribe((res) => {
      this.policePostList = res?.data || [];
    });
  }
}
