import { Component, OnInit } from '@angular/core';
import { DialogService } from 'primeng/dynamicdialog';
import { ContractDeparmentService } from 'src/app/service/contract-department';
import { CrudContractDepartmentComponent } from './crud-contract-department/crud-contract-department.component';
import * as _ from 'lodash';
import { environment } from 'src/environments/environment';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import AppUtil from 'src/app/utilities/app-util';
import AppConstants from '../../utilities/app-constants';

@Component({
  selector: 'app-contract-department',
  templateUrl: './contract-department.component.html',
  styles: [],
  providers: [DialogService],
})
export class ContractDepartmentComponent implements OnInit {
  appConstant = AppConstants;
  templateName = 'Uploads\\Contract\\HopDongThuViec.docx';
  contractDepartmentList: any[];
  isMobile = screen.width <= 1199;
  loading = false;
  first = 0;

  pendingRequest: any;
  public totalRecords = 0;
  public totalPages = 0;
  public getParams: any = {
    page: 1,
    pageSize: 5,
  };

  constructor(
    private contractDeparmentService: ContractDeparmentService,
    private dialogService: DialogService,
    private confirmationService: ConfirmationService,
    private translateService: TranslateService,
    private messageService: MessageService,
  ) {}

  ngOnInit(): void {
    this.getListContract();
  }

  getListContract(event?): void {
    this.loading = true;
    if (this.pendingRequest) {
      this.pendingRequest.unsubscribe();
    }
    this.loading = true;
    if (event) {
      this.getParams.page = event.first / event.rows + 1;
      this.getParams.pageSize = event.rows;
    }
    this.pendingRequest = this.contractDeparmentService
      .getListContractType(this.getParams)
      .subscribe((res: any) => {
        this.contractDepartmentList = res?.data;
        this.totalRecords = res.totalItems;
        this.totalPages = res.totalItems / res.pageSize + 1;
        this.loading = false;
      });
  }

  openFile(fileUrl) {
    window.open(
      `${environment.serverURL}/api/ReportDownload/download-contract-type?linkFile=${fileUrl}`,
    );
  }

  onCrud(data?) {
    const ref = this.dialogService.open(CrudContractDepartmentComponent, {
      data: {
        id: data?.id || 0,
        contractDepartmentList: _.cloneDeep(this.contractDepartmentList),
      },
      width: '40%',
      contentStyle: { overflow: 'auto' },
      baseZIndex: 10000,
      header: !data ? 'Thêm mới mẫu hợp đồng' : 'Sửa mẫu hợp đồng',
    });
    ref.onClose.subscribe((res) => {
      if (res) {
        this.getListContract();
      }
    });
  }

  onRemove(data) {
    this.confirmationService.confirm({
      header: 'Xóa dữ liệu',
      message: `Bạn có chắc chắn muốn xóa ${data.code} hay không ?`,
      acceptLabel: AppUtil.translate(this.translateService, 'label.yes'),
      rejectLabel: AppUtil.translate(this.translateService, 'label.no'),
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.contractDeparmentService.delete(data.id).subscribe((_) => {
          this.getListContract();
          this.messageService.add({
            severity: 'success',
            detail: AppUtil.translate(this.translateService, 'success.delete'),
          });
        });
      },
    });
  }
}
