import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CustomerStatusService } from '@app/service/customer-status.service';
import { ToastService } from '@app/service/toast.service';
import { TranslateService } from '@ngx-translate/core';
import { MessageService, SelectItem } from 'primeng/api';
import { RoomTable } from 'src/app/models/room-table.model';
import {
  PageFilterRoomTable,
  RoomTableService,
} from 'src/app/service/room-table.service';
import AppUtil from 'src/app/utilities/app-util';
@Component({
  selector: 'app-desk-table',
  templateUrl: './desk-table.component.html',
  styleUrls: ['desk-table.component.scss'],
})
export class DeskTableComponent implements OnInit {
  @Input('floorTabs') floorTabs: any[] = [];
  @Input('isSeller') isSeller: boolean = false;

  @Output('addBill') addBill = new EventEmitter();
  selectedFloorId: number = 0;

  first = 0;

  public deskFloors: RoomTable[] = [];
  pendingRequest: any;
  loading: boolean = false;

  public getParams: PageFilterRoomTable = {
    page: 1,
    pageSize: 8,
    sortField: 'id',
    isSort: true,
    floorId: 0,
    isFloor: 'true',
    searchText: '',
  };
  sortOptions: SelectItem[];
  sortOrder: number;
  sortField: string;
  public totalRecords = 0;
  public totalPages = 0;
  statusList: any[] = [];
  constructor(
    private roomTableService: RoomTableService,
    private messageService: MessageService,
    private translateService: TranslateService,
    private customerStatusService: CustomerStatusService,
    private roomTableServices: RoomTableService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.sortOptions = [
      { label: 'Price High to Low', value: '!price' },
      { label: 'Price Low to High', value: 'price' },
    ];
    this.selectedFloorId = this.floorTabs[0]?.id ?? 0;
    this.getRoomTable();
    this.customerStatusService.getAllCustomerStatus(2).subscribe((res) => {
      this.statusList = res.data;
    });
  }

  onChangeFloorTab(event) {
    this.selectedFloorId = this.floorTabs[event.index].id;
    this.getRoomTable();
  }

  onSortChange(event) {
    let value = event.value;

    if (value.indexOf('!') === 0) {
      this.sortOrder = -1;
      this.sortField = value.substring(1, value.length);
    } else {
      this.sortOrder = 1;
      this.sortField = value;
    }
  }

  getRoomTable(event?: any): void {
    if (this.pendingRequest) {
      this.pendingRequest.unsubscribe();
    }
    this.loading = true;
    let params = Object.assign({}, this.getParams);
    if (event) {
      params.page = event.first / event.rows + 1;
      params.pageSize = event.rows;
    }
    params.isFloor = 'false';
    if (this.selectedFloorId) params.floorId = this.selectedFloorId;
    this.pendingRequest = this.roomTableService
      .getList(params)
      .subscribe((response: any) => {
        AppUtil.scrollToTop();
        this.deskFloors = response.data;
        this.totalRecords = response.totalItems || 0;
        this.totalPages = response.totalItems / response.pageSize + 1;
        this.loading = false;
      });
  }

  onSelectDesk(desk) {
    if (!desk.isChoose) {
      desk.deskName = this.deskFloors.find((x) => x.id === desk.id).name;
      // check exist desk selected
      if (desk.isChoose) {
        this.messageService.add({
          severity: 'info',
          detail: AppUtil.translate(this.translateService, 'Bàn đã được chọn'),
        });
      }
      // create new bill temp

      // active tab bill
      this.addBill.emit(desk);
    }
  }

  displayEditDesc = false;
  selectedDesc: any = {};
  onEditDesc(desk) {
    this.selectedDesc = desk;
    this.displayEditDesc = true;
    // show dialog edit desc
  }

  onSuccessEditDesc() {
    this.roomTableService
      .update(this.selectedDesc, this.selectedDesc.id)
      .subscribe((res) => {
        this.messageService.add({
          severity: 'success',
          detail: AppUtil.translate(this.translateService, 'success.update'),
        });
      });
    this.displayEditDesc = false;
  }

  onChangeStatus(event: any, product: any) {
    const statusId = event.value;
    console.log(event, product);
    this.roomTableService.updateTableStatus(product.id, statusId).subscribe(
      (res) => {
        this.toastService.success('Cập nhật trạng thái thành công');
      }
    );
  }
}
