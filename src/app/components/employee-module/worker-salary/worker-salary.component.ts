import { Component, OnInit } from '@angular/core';
import { TableColumModel } from '@app/models/common/table-colum.model';
import { ProductionDepartmentService } from '@app/service/production-department.service';
import { ToastService } from '@app/service/toast.service';
import { UserService } from '@app/service/user.service';
import { SalaryTypeService } from '@components/employee-module/salary-type/salary-type.service';
import { WORKER_SALARY_COLUMNS } from '@components/employee-module/worker-salary/worker-salary.config';
import { WorkerSalaryService } from '@components/employee-module/worker-salary/worker-salary.service';
import * as _ from 'lodash';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-worker-salary',
  templateUrl: './worker-salary.component.html',
  styleUrls: ['./worker-salary.component.scss'],
})
export class WorkerSalaryComponent implements OnInit {
  showForm = false;
  selectedItem: any;
  loading = false;
  data: any[] = [];
  columns: TableColumModel[] = [];
  pageIndex = 0;
  pageSize = 10;
  totalItem = 0;
  procedureList: any[] = [];
  salaryTypeList: any[] = [];
  userList: any[] = [];

  constructor(
    private workerSalaryService: WorkerSalaryService,
    private salaryTypeService: SalaryTypeService,
    private userService: UserService,
    private toastService: ToastService,
    private productionDepartmentService: ProductionDepartmentService,
  ) {}

  ngOnInit(): void {
    this.columns = WORKER_SALARY_COLUMNS;
    this._getData();
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
    this.workerSalaryService.getByPage({ Page: this.pageIndex, PageSize: this.pageSize }).subscribe(
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
    this.workerSalaryService.delete(id).subscribe(
      (res: any) => {
        this.toastService.success('Xóa thành công');
        this.onLoad();
      },
      (error) => {
        console.log(error);
      },
    );
  }

  private _getData() {
    forkJoin([this.productionDepartmentService.getAll(), this.userService.getAllUserActive(), this.salaryTypeService.getAll()]).subscribe(
      ([departmentResult, userListResult, salaryTypeResult]) => {
        this.procedureList = departmentResult.data;
        this.userList = userListResult.data;
        this.salaryTypeList = salaryTypeResult.data;
        this.transformData();
      },
    );
  }

  private transformData() {
    if (this.data.length === 0 || this.salaryTypeList.length === 0) {
      return;
    }
    const mapSalary = _.chain(this.salaryTypeList).keyBy('id').mapValues('name').value();
    this.data.forEach((item: any) => {
      item.salaryType = mapSalary[item.salaryTypeId];
    });
  }
}
