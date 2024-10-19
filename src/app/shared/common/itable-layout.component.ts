import { Directive } from '@angular/core';
import { TableColumModel } from '@app/models/common/table-colum.model';
import { ToastService } from '@app/service/toast.service';
import { CommonHelper } from '@app/shared/common/helper/common.helper';
import { ICrudService } from '@app/shared/common/service/crud.service';
import { SortType } from '@app/shared/common/enums/sort.type';
import { FilterModel } from '@app/shared/common/model/filter.model';
import { PagingResponseModel, ResponseModel } from '@app/shared/common/model/response.model';
import { SortModel } from '@app/shared/common/model/sort.model';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmationService } from 'primeng/api';

@Directive()
export abstract class ITableLayoutComponent {
  protected dataSource: any[] = [];
  abstract columns: TableColumModel[];
  protected pageIndex = 0;
  protected pageSize = 10;
  protected totalItems = 0;
  abstract filter: FilterModel;
  abstract sort: SortModel;
  showForm = false;
  selectedItem: any;

  protected constructor(
    protected crudService: ICrudService,
    protected toastService: ToastService,
    protected translateService: TranslateService,
    protected confirmService: ConfirmationService,
  ) {}

  onCreate() {
    this.selectedItem = undefined;
    this.showForm = true;
  }

  onKeyword() {
    this.pageIndex = 0;
    this.getByPage();
  }

  getByPage(event: any = null) {
    if (event) {
      this.pageIndex = event.first / event.rows;
      this.pageSize = event.rows;
      this.sort.field = event.sortField;
      this.sort.type = event.sortOrder == 1 ? SortType.ASC : SortType.DESC;
    }

    this.crudService.getPage(this.pageIndex, this.pageSize, this.filter, this.sort).subscribe(
      (res: PagingResponseModel) => {
        if (res.success) {
          this.dataSource = res.data.data.map((item: any) => this.toTableModel(item));
          this.totalItems = res.data.total;
          return;
        }
        this.toastService.error(res.messages.join('\n'));
      },
      (error) => {
        this.toastService.error(CommonHelper.getObsValue(this.translateService.get('common.internal_error')));
      },
    );
  }

  abstract toTableModel(item: any): any;

  onEdit(id: number) {
    this.crudService.get(id).subscribe((res: ResponseModel) => {
      if (res.success) {
        this.selectedItem = res.data;
        this.showForm = true;
        return;
      }
      this.toastService.error(res.messages.join('\n'));
    });
  }

  onDelete(id: number) {
    this.confirmService.confirm({
      ...CommonHelper.confirmOpts(this.translateService, 'confirm.delete'),
      accept: () => {
        this.crudService.delete(id).subscribe((res: ResponseModel) => {
          if (res.success) {
            this.toastService.success('Xóa thành công');
            this.getByPage();
            return;
          }
          this.toastService.error(res.messages.join('\n'));
        });
      },
    });
  }
}
