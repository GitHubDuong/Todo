import { Component, OnInit } from '@angular/core';
import { ColumnDataType } from '@app/core/enum';
import { TableColumModel } from '@app/models/common/table-colum.model';
import { ToastService } from '@app/service/toast.service';
import { PolicePostService } from '@components/materiall-management-module/police-post/police-post.service';

@Component({
  selector: 'app-police-post',
  templateUrl: './police-post.component.html',
  styleUrls: ['./police-post.component.scss'],
})
export class PolicePostComponent implements OnInit {
  showForm = false;
  selectedItem: any;
  loading = false;
  data: any[] = [];
  columns: TableColumModel[] = [];
  pageIndex = 0;
  pageSize = 10;
  totalItem = 0;

  constructor(
    private policePostService: PolicePostService,
    private toastService: ToastService,
  ) {}

  ngOnInit(): void {
    this.columns = [
      { field: 'code', label: 'Mã ', type: ColumnDataType.text, class: 'w-2' },
      { field: 'name', label: 'Tên chốt', type: ColumnDataType.text, class: 'w-4' },
      { field: 'amount', label: 'Số tiền', type: ColumnDataType.number, class: 'w-4' },
    ];
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
    this.policePostService.getByPage({ Page: this.pageIndex, PageSize: this.pageSize }).subscribe(
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

  onDelete(id) {
    this.policePostService.delete(id).subscribe(
      (res: any) => {
        this.toastService.success('Xóa thành công');
        this.onLoad();
      },
      (error) => {
        console.log(error);
      },
    );
  }
}
