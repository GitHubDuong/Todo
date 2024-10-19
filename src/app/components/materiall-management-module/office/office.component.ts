import {
  Component,
  ElementRef,
  HostListener,
  OnInit,
  ViewChild,
} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ColumnFilter, Table } from 'primeng/table';
import { Page, TypeData } from 'src/app/models/common.model';
import { PageFilterUser } from 'src/app/service/user.service';
import AppConstant from 'src/app/utilities/app-constants';
import AppUtil from 'src/app/utilities/app-util';
import { environment } from 'src/environments/environment';
import { Symbol } from 'src/app/models/symbol.model';
import { SymbolService } from 'src/app/service/symbol.service';
import { OfficeFormComponent } from './office-form/office-form.component';
import { UserRoleCRUD } from 'src/app/models/user-role.model';
import AppConstants from '../../../utilities/app-constants';
import { OfficeControlService } from '../../../service/office-control.service';
import { Stationerie } from '../../../models/office';
import { OfficeService } from '../../../service/office.service';

@Component({
  selector: 'app-office',
  templateUrl: './office.component.html',
  providers: [MessageService, ConfirmationService],
  styleUrls: ['../../../../assets/demo/badges.scss'],
  styles: [
    `
      :host ::ng-deep .p-frozen-column {
        font-weight: bold;
      }

      :host ::ng-deep .p-datatable-frozen-tbody {
        font-weight: bold;
      }

      :host ::ng-deep .p-progressbar {
        height: 0.5rem;
      }
    `,
  ],
})
export class OfficeComponent implements OnInit {
  public appConstant = AppConstant;
  @ViewChild('officeFormComponent') officeFormComponent:
    | OfficeFormComponent
    | undefined;

  result = {
    data: [],
    currentPage: 0,
    nextStt: 0,
    pageSize: 20,
    totalItems: 0,
  };

  loading: boolean = true;
  sortFields: any[] = [];
  sortTypes: any[] = [];

  first = 0;
  param: Page = {
    page: 0,
    pageSize: 20,
  };
  public totalRecords = 0;
  public totalPages = 0;
  public myTarget: number;

  public isLoading: boolean = false;

  public lstSymbols: Symbol[] = [];

  display: boolean = false;

  isMobile = screen.width <= 1199;

  countImportItem = 1;

  indexHistory = null;

  formData: any = {};
  isEdit: boolean = false;
  isReset: boolean = false;

  pendingRequest: any;
  roles: any[] = [];

  listAllStationer = [];

  constructor(
    private readonly SymbolService: SymbolService,
    private readonly translateService: TranslateService,
    private readonly confirmationService: ConfirmationService,
    private readonly officeControlService: OfficeControlService,
    private readonly messageService: MessageService,
    private readonly officeService: OfficeService,
  ) {}

  ngOnInit() {
    this.getAllStationer();
    this.getProcedureNumber();
  }

  getProcedureNumber() {
    this.officeControlService.getProcedureNumber().subscribe((res) => {
      console.log('getProcedureNumber', res);
    });
  }

  getListOffice(event?: any) {
    if (event) {
      this.param.page = event.first / event.rows;
      this.param.pageSize = event.rows;
    } else {
      this.param.page = 0;
      this.param.pageSize = 10;
    }
    this.officeControlService.getListOffice(this.param).subscribe((res) => {
      if (res && res?.data?.length > 0) {
        this.result = res;
      } else {
        this.messageService.add({
          severity: 'error',
          detail: 'Lỗi lấy dữ liệu',
        });
      }
      this.loading = false;
    });
  }

  getAllStationer() {
    this.officeService.getAllStationer().subscribe((res) => {
      if (res?.data?.length > 0) {
        this.listAllStationer = res.data;
      }
    });
  }
  showDialog() {
    this.officeFormComponent.onReset();
    this.display = true;
  }

  @HostListener('document:keydown', ['$event'])
  async handleKeyboardEvent(event: KeyboardEvent) {
    switch (event.key) {
      case 'F7':
        event.preventDefault();
        this.isEdit = false;
        await this.showDialog();
        break;
    }
  }
  onEditOffice(item, rowIndex) {
    this.indexHistory = rowIndex == 0 ? 1 : rowIndex + 1;
    this.officeControlService.getDetailOffice(item?.id).subscribe((res) => {
      if (res?.items?.length > 0) {
        this.display = true;
        this.formData = res;
      }
    });
  }

  onDeleteOffice(item) {
    this.officeControlService.deleteOffice(item).subscribe((res) => {
      if (res?.data) {
        this.messageService.add({
          severity: 'error',
          detail: AppUtil.translate(this.translateService, 'error.delete'),
        });
      } else {
        this.messageService.add({
          severity: 'success',
          detail: AppUtil.translate(this.translateService, 'success.delete'),
        });
        this.getListOffice();
      }
    });
  }

  protected readonly AppConstants = AppConstants;
}
