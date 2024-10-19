import { Component, OnInit } from '@angular/core';
import AppConstants from "../../../utilities/app-constants";
import { FormControl, FormGroup } from "@angular/forms";
import { TypeData } from "../../../models/common.model";
import { User } from "../../../models/user.model";
import { PageFilterUser, UserService } from "../../../service/user.service";
import { debounceTime } from "rxjs";
import { DocumentService } from "../../../service/document.service";
import { KpiService } from "../../../service/kpi.service";

@Component({
  selector: 'app-customer-score',
  templateUrl: './customer-score.component.html',
  styles: []
})
export class CustomerScoreComponent implements OnInit {
  appConstant = AppConstants;
  display: boolean = false;
  loading: boolean = false;
  isMobile = screen.width <= 1199;
  first = 0;
  formData: any = {};
  isReset: boolean = false;
  isEdit: boolean = false;
  listData = [];
  pendingRequest: any;
  totalRecords = 0;
  totalPages = 0;
  cols: any[] = [
    {
      header: 'label.kpi_customer_score_user_code',
      value: 'code',
      width: 'w-3',
      display: true,
      classify: 'personal_info',
      optionHide: false,
      type: '',
    },
    {
      header: 'label.kpi_customer_score_user_name',
      value: 'name',
      width: 'w-4',
      display: true,
      classify: 'personal_info',
      optionHide: false,
      type: '',
    },
    {
      header: 'label.kpi_customer_score_total',
      value: 'fromValue',
      width: 'w-5 justify-content-end',
      display: true,
      classify: 'personal_info',
      optionHide: false,
      type: 'number',
    },
  ];
  months = [
    {name: 'Tháng 1', value: 1},
    {name: 'Tháng 2', value: 2},
    {name: 'Tháng 3', value: 3},
    {name: 'Tháng 4', value: 4},
    {name: 'Tháng 5', value: 5},
    {name: 'Tháng 6', value: 6},
    {name: 'Tháng 7', value: 7},
    {name: 'Tháng 8', value: 8},
    {name: 'Tháng 9', value: 9},
    {name: 'Tháng 10', value: 10},
    {name: 'Tháng 11', value: 11},
    {name: 'Tháng 12', value: 12},
  ];
  filterForm!: FormGroup
  departments = []
  employees = []
  cloneEmployees = []
  result = null

  constructor(
    private readonly userService: UserService,
    private readonly documentService: DocumentService,
    private _kpiService: KpiService,
  ) {
  }

  ngOnInit(): void {
    this.filterForm = new FormGroup({
      month: new FormControl(new Date().getMonth() + 1),
      departmentId: new FormControl(null),
      employeeId: new FormControl(null),
      employeeTextSearch: new FormControl(null)
    })
    this.onValueChange()
    this.getUsers()
    this.getListDepartments()
  }

  getUsers(keyword = '') {
    const params: PageFilterUser = {
      page: 1,
      pageSize: 10,
      gender: -1,
      keyword: '',
      departmentId: this.filterForm.value.departmentId || ''
    }
    this.userService
      .getPagingUser(params)
      .subscribe((response: TypeData<User>) => {
        this.employees = response?.data || []
        if (!this.cloneEmployees?.length)
          this.cloneEmployees = response?.data
        this.loading = false;
      });
  }

  getListDepartments() {
    this.documentService.getDepartmentList().subscribe((data) => {
      this.departments = data.data;
    });
  }

  onValueChange() {
    this.filterForm.controls.employeeTextSearch.valueChanges.pipe(debounceTime(300)).subscribe((value) => {
      if (value)
        this.getUsers(value)
      else
        this.employees = this.cloneEmployees
    })
  }

  calculateUserPoint() {
    const params = {
      month: this.filterForm.value.month,
      userId: this.filterForm.value.employeeId || '',
    }
    this._kpiService.pointForUser(params).subscribe((response) => {
      this.result = response
    })
  }
}
