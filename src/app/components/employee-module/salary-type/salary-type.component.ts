import { Component, OnInit } from '@angular/core';
import { TableColumModel } from '@app/models/common/table-colum.model';
import { PositionDetailService } from '@app/service/position-detail.service';
import { ToastService } from '@app/service/toast.service';
import { SALARY_TYPE_COLUMNS } from '@components/employee-module/salary-type/salary-type.config';
import { SalaryTypeService } from '@components/employee-module/salary-type/salary-type.service';
import * as _ from 'lodash';

@Component({
  selector: 'app-salary-type',
  templateUrl: './salary-type.component.html',
  styleUrls: ['./salary-type.component.scss'],
})
export class SalaryTypeComponent implements OnInit {
  showForm = false;
  selectedItem: any;
  loading = false;
  data: any[] = [];
  columns: TableColumModel[] = [];
  pageIndex = 0;
  pageSize = 10;
  totalItem = 0;
  positionList: any[] = [];

  constructor(
    private salaryTypeService: SalaryTypeService,
    private toastService: ToastService,
    private positionDetailService: PositionDetailService,
  ) {}

  ngOnInit(): void {
    this.columns = SALARY_TYPE_COLUMNS;
    this._getPositionList();
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
    this.salaryTypeService.getByPage({ Page: this.pageIndex, PageSize: this.pageSize }).subscribe(
      (res: any) => {
        this.loading = false;
        this.data = res.data;
        this.totalItem = res.totalItems;
        this.transformData();
      },
      (error) => {
        this.loading = false;
      },
    );
  }

  onDelete(id) {
    this.salaryTypeService.delete(id).subscribe(
      (res: any) => {
        this.toastService.success('Xóa thành công');
        this.onLoad();
      },
      (error) => {
        console.log(error);
      },
    );
  }

  private _getPositionList() {
    this.positionDetailService.getAll().subscribe((res: any) => {
      this.positionList = res.data;
      this.transformData();
    });
  }

  private transformData() {
    if (this.data.length === 0 || this.positionList.length === 0) {
      return;
    }
    const map = _.chain(this.positionList).keyBy('id').mapValues('name').value();
    this.data.forEach((item: any) => {
      item.positionDetail = map[item.positionDetailId];
    });
  }
}
