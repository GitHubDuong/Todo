import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { TableColumModel } from '@app/models/common/table-colum.model';
import { WarehousePositionsService } from '@app/service/warehouse-positions.service';
import { WAREHOUSE_POSITION_COLUMNS } from '@components/sell-module/good-warehouse-positions/good-warehouse-positions.config';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Branch } from 'src/app/models/branch.model';
import { TypeData } from 'src/app/models/common.model';
import { BranchService, PageFilterBranch } from 'src/app/service/branch.service';
import { DecideService } from 'src/app/service/decide.service';
import AppConstant from 'src/app/utilities/app-constants';
import AppUtil from 'src/app/utilities/app-util';
import { environment } from 'src/environments/environment';
import { GoodWarehousePositionsFormComponent } from './components/good-warehouse-positions-form/good-warehouse-positions-form.component';

@Component({
  templateUrl: './good-warehouse-positions.component.html',
  providers: [MessageService, ConfirmationService],
  styleUrls: ['good-warehouse-positions.component.scss'],
})
export class WarehousePositionsComponent implements OnInit {
  get floors(): any[] {
    return this._floors;
  }

  set floors(value: any[]) {
    this._floors = value;
  }

  public appConstant = AppConstant;
  @ViewChild('editForm') formComponent: GoodWarehousePositionsFormComponent | undefined;

  loading: boolean = true;

  sortFields: any[] = [];
  sortTypes: any[] = [];

  first = 0;

  public params: PageFilterBranch = {
    page: 1,
    pageSize: 10,
    searchText: '',
  };
  public totalRecords = 0;
  public totalPages = 0;

  public isLoading: boolean = false;

  private _floors: any[] = [];

  display: boolean = false;

  isMobile = screen.width <= 1199;

  formData: any = {};
  isEdit: boolean = false;
  isReset: boolean = false;
  pendingRequest: any;
  columns: TableColumModel[] = [];

  constructor(
    private messageService: MessageService,
    private readonly branchService: BranchService,
    private readonly decideService: DecideService,
    private readonly translateService: TranslateService,
    private readonly confirmationService: ConfirmationService,
    private readonly warehousePositionsService: WarehousePositionsService,
    private router: Router,
  ) {}

  ngOnInit() {
    AppUtil.getUserSortTypes(this.translateService).subscribe((res) => {
      this.sortFields = res;
    });
    AppUtil.getSortTypes(this.translateService).subscribe((res) => {
      this.sortTypes = res;
    });
    this.columns = WAREHOUSE_POSITION_COLUMNS;
  }

  onSearch(event) {
    if (event.key === 'Enter') {
      this.getPosition();
    }
  }

  onChangeSort(event, type) {
    if (type === 'sortType') {
      this.params.isSort = event.value;
    }
    this.getPosition();
  }

  getPosition(event?: any, isExport: boolean = false): void {
    if (event) {
      this.params.page = event.first / event.rows + 1;
      this.params.pageSize = event.rows;
    }

    this.pendingRequest = this.warehousePositionsService
      .getWareHousePositionsPaging(this.params)
      .subscribe((response: TypeData<Branch>) => {
        AppUtil.scrollToTop();
        this._floors = response.data;
        this.totalRecords = response.totalItems || 0;
        this.totalPages = response.totalItems / response.pageSize + 1;
        this.loading = false;
      });
  }

  getDetail(id) {
    this.warehousePositionsService.getWareHousePositionsDetail(id).subscribe((response: any) => {
      this.formData = response;
      this.isEdit = true;
      this.showDialog();
    });
  }

  onAddBranch() {
    this.isEdit = false;
    this.showDialog();
  }

  onDelete(decideId) {
    let message;
    let header;
    this.translateService.get('question.delete_content').subscribe((res) => {
      message = res;
    });
    this.translateService.get('question.confirm_header').subscribe((res) => {
      header = res;
    });
    this.confirmationService.confirm({
      header: header,
      message: message,
      accept: () => {
        this.warehousePositionsService.deletePositions(decideId).subscribe((response: any) => {
          this.getPosition();
        });
      },
    });
  }

  baseUrlImage(image) {
    return `${environment.serverURL}/${image}`;
  }

  showDialog() {
    this.formComponent.onReset();
    this.display = true;
  }

  @HostListener('document:keydown', ['$event'])
  async handleKeyboardEvent(event: KeyboardEvent) {
    switch (event.key) {
      case 'F7':
        event.preventDefault();
        await this.onAddBranch();
        break;
    }
  }
}
