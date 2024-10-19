import { Component, OnInit, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ProcedureStatusStepsService } from 'src/app/service/procedure-status-steps.service';
import { ProcedureService } from 'src/app/service/procedure.service';
import AppConstant from 'src/app/utilities/app-constants';
import AppUtil from 'src/app/utilities/app-util';
import { ProcessStepMngFormComponent } from './process-step-mng-form/process-step-mng-form.component';

@Component({
  selector: 'app-process-step-management',
  templateUrl: './process-step-management.component.html',
  styleUrls: ['./process-step-management.component.scss']
})
export class ProcessStepManagementComponent implements OnInit {
  @ViewChild('processForm') ProcessManagementFormComponent:
    | ProcessStepMngFormComponent
    | undefined;

  public appConstant = AppConstant;
  loading: boolean = true;

  public getParams = {
    page: 0,
    pageSize: 10,
    searchText: '',
  };
  public totalRecords = 0;
  public totalPages = 0;

  public isLoading: boolean = false;
  public listProcedure: any[] = [];

  first = 0;
  isMobile = screen.width <= 1199;

  formData: any = {};
  isEdit: boolean = false;
  isReset: boolean = false;

  display: boolean = false;
  pendingRequest: any;
  cols: any[] = [
    {
      header: 'label.numerical_order',
      value: 'id',
      width: 'width:10%;',
      display: true,
      classify: 'personal_info',
      optionHide: false,
    },
    {
      header: 'label.code',
      value: 'code',
      width: 'width:30%;',
      display: true,
      classify: 'personal_info',
      optionHide: false,
    },
    {
      header: 'label.name',
      value: 'name',
      width: 'width:40%;',
      display: true,
      classify: 'personal_info',
      optionHide: false,
    },
  ];
  employees: any[] = [];
  roles: any[] = [];
  constructor(
    private messageService: MessageService,
    private readonly translateService: TranslateService,
    private readonly confirmationService: ConfirmationService,
    private readonly procedureService: ProcedureService,
    private readonly procedureStatusStepService: ProcedureStatusStepsService,
  ) {}

  ngOnInit(): void {}

  onGetProcedure(event?: any, isExport: boolean = false): void {
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
    this.pendingRequest = this.procedureService
      .getProcedures(this.getParams)
      .subscribe((response: any) => {
        AppUtil.scrollToTop();
        this.listProcedure = response.data;
        this.totalRecords = response.totalItems || 0;
        this.totalPages = response.totalItems / response.pageSize + 1;
        this.loading = false;
      });
  }

  onSearch(event) {
    if (event.key === 'Enter') {
      this.onGetProcedure();
    }
  }

  getDetail(id) {
    this.isEdit = true;
    this.ProcessManagementFormComponent.getDetail(id);
    this.display = true;
  }
}
