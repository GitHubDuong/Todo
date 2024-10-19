import { Component, OnInit, ViewChild } from '@angular/core';
import { BaseClass } from '@app/core/base';
import { StandardFormApplicationComponent } from './standard-form-application/standard-form-application.component';
import AppUtil from '@app/utilities/app-util';
import { StandardFormService } from '@app/service/standard-form.service';

@Component({
  selector: 'app-standard-form',
  templateUrl: './standard-form.component.html',
  styleUrls: ['./standard-form.component.scss']
})
export class StandardFormComponent extends BaseClass implements OnInit {

  @ViewChild('standardForm') standardForm: StandardFormApplicationComponent | undefined;

  listStandardForm: any[] = [];
  pendingRequest: any;
  public totalRecords = 0;
  public totalPages = 0;

  public isLoading: boolean = false;
  isEdit: boolean = false;
  isReset: boolean = false;
  first = 0;
  isMobile = screen.width <= 1199;

  public getParams = {
    page: 0,
    pageSize: 10,
    searchText: '',
  };

  formData: any = {};

  constructor(
    private standardFormService: StandardFormService
  ) {
    super();
    this.dataColumns = [
      {header: 'label.standard_form_index', value: 'id', width: '5%', minHeight: "50px"},
      {header: 'label.standard_form_code', value: 'code', width: '20%', minHeight: "50px"},
      {header: 'label.standard_form_name', value: 'name', width: '20%', minHeight: "50px"},
      {header: 'label.standard_form_note', value: 'note', width: '55%', minHeight: "50px"},
    ]
  }

  ngOnInit(): void {
  }

  getStandardForm(event?: any) {
    if (this.pendingRequest) {
      this.pendingRequest.unsubscribe();
    }
    this.loading = true;
    if (event) {
      this.getParams.page = event.first / event.rows;
      this.getParams.pageSize = event.rows;
    }
    // remove undefined value
    Object.keys(this.getParams).forEach(
      (k) => this.getParams[k] == null && delete this.getParams[k],
    );
    this.pendingRequest = this.standardFormService
      .getIntroduceType(this.getParams)
      .subscribe((response: any) => {
        console.log(response);
        if (response) {
          AppUtil.scrollToTop();
          this.listStandardForm = response.data;
          this.totalRecords = response.totalItems || 0;
          this.totalPages = response.totalItems / response.pageSize + 1;
        }
        this.loading = false;
      });
  }

  onAddNewStandardForm() {
    this.isEdit = false;
    this.display = true;
    this.standardForm.onReset();
  }

  onSearch(event) {
    if (event.key === 'Enter') {
      this.getStandardForm();
    }
  }

}
