import { Component, OnInit, ViewChild } from '@angular/core';
import { OfficeService } from '../../../service/office.service';
import { Page, TypeData } from '../../../models/common.model';
import { Stationerie } from '../../../models/office';
import { MessageService } from 'primeng/api';
import AppConstant from '../../../utilities/app-constants';
import { OfficeAddFormComponent } from './office-add-form/office-add-form.component';
import AppUtil from '../../../utilities/app-util';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-office-add',
  templateUrl: './office-add.component.html',
  styleUrls: ['../../../../assets/demo/badges.scss'],
})
export class OfficeAddComponent implements OnInit {
  public appConstant = AppConstant;
  @ViewChild('officeAddFormComponent') officeAddFormComponent:
    | OfficeAddFormComponent
    | undefined;
  result: TypeData<Stationerie> = {
    data: [],
    currentPage: 0,
    nextStt: 0,
    pageSize: 20,
    totalItems: 0,
  };
  param: Page = {
    page: 0,
    pageSize: 20,
  };
  loading: boolean = false;
  isMobile = screen.width <= 1199;
  isEdit: boolean = false;
  isReset: boolean = false;
  display: boolean = false;
  formData = {};
  constructor(
    private officeService: OfficeService,
    private readonly messageService: MessageService,
    private translateService: TranslateService,
  ) {}
  ngOnInit() {}

  getListStationeies(event?: any) {
    if (event) {
      this.param.page = event.first / event.rows;
      this.param.pageSize = event.rows;
    } else {
      this.param.page = 0;
      this.param.pageSize = 10;
    }
    this.officeService.getListStationerie(this.param).subscribe((res) => {
      if (res && res.data.length > 0) {
        this.result = res;
      } else {
        this.messageService.add({
          severity: 'error',
          detail: 'Lỗi lấy dữ liệu',
        });
      }
    });
  }

  showDialog() {
    this.isEdit = false;
    this.officeAddFormComponent.onReset();
    this.display = true;
  }

  onEditStationeie(item) {
    this.display = true;
    this.formData = item;
  }
  onDeleteStationeie(item) {
    this.officeService.deleteSationerie(item).subscribe((res) => {
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
        this.getListStationeies();
      }
    });
  }

  protected readonly AppConstant = AppConstant;
  protected readonly event = event;
}
