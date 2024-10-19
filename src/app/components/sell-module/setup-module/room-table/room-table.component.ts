import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { RoomTable } from 'src/app/models/room-table.model';
import { PageFilterRoomTable, RoomTableService } from 'src/app/service/room-table.service';
import AppUtil from 'src/app/utilities/app-util';
import { environment } from 'src/environments/environment';
import { RoomTableFormComponent } from './component/room-table-form/room-table-form.component';
import { TableQrGeneratorComponent } from './component/table-qr-generator/table-qr-generator.component';

@Component({
  selector: 'app-room-table',
  templateUrl: './room-table.component.html',
  providers: [MessageService, ConfirmationService],
  styleUrls: ['./room-table.component.scss'],
})
export class RoomTableComponent implements OnInit {
  @ViewChild('roomTableForm') roomTableForm: RoomTableFormComponent;
  @ViewChild('tableQrGeneratorComponent') tableQrGeneratorComponent: TableQrGeneratorComponent;

  loading: boolean = true;

  sortFields: any[] = [];
  sortTypes: any[] = [];

  first = 0;

  public getParams: PageFilterRoomTable = {
    page: 1,
    pageSize: 5,
    sortField: 'id',
    isSort: true,
    floorId: 0,
    isFloor: 'true',
    searchText: '',
  };
  public totalRecords = 0;
  public totalPages = 0;

  public isLoading: boolean = false;

  public deskFloors: RoomTable[] = [];

  display: boolean = false;

  isMobile = screen.width <= 1199;

  formData: any = {};
  isEdit: boolean = false;
  isReset: boolean = false;

  floors: RoomTable[];

  pendingRequest: any;
  tableCodes: string[] = [];

  constructor(
    private readonly translateService: TranslateService,
    private readonly confirmationService: ConfirmationService,
    private readonly roomTableServices: RoomTableService,
  ) {}

  ngOnInit() {
    AppUtil.getRoomTableSortTypes(this.translateService).subscribe((res) => {
      this.sortFields = res;
    });
    AppUtil.getSortTypes(this.translateService).subscribe((res) => {
      this.sortTypes = res;
    });
    this.getFloors();
  }

  onSearch(event) {
    if (event.key === 'Enter') {
      this.getRoomTable();
    }
  }

  onChangeSort(event, type) {
    if (type === 'sortType') {
      this.getParams.isSort = event.value;
    }
    this.getRoomTable();
  }

  getFloors() {
    this.roomTableServices.getListNoQuery().subscribe((res) => {
      this.floors = res.data.filter((item) => item.floorId === 0) || [];
    });
  }

  getRoomTable(event?: any, isExport: boolean = false): void {
    if (this.pendingRequest) {
      this.pendingRequest.unsubscribe();
    }
    this.loading = true;
    if (event) {
      this.getParams.page = event.first / event.rows + 1;
      this.getParams.pageSize = event.rows;
    }
    Object.keys(this.getParams).forEach((k) => this.getParams[k] == null && delete this.getParams[k]);
    this.pendingRequest = this.roomTableServices.getList(this.getParams).subscribe((response: any) => {
      AppUtil.scrollToTop();
      this.deskFloors = response.data;
      this.totalRecords = response.totalItems || 0;
      this.totalPages = response.totalItems / response.pageSize + 1;
      this.loading = false;
    });
  }

  getDetail(id) {
    this.roomTableForm.getDetail(id);
    this.roomTableForm.getFloor();
    this.display = true;
    this.isEdit = true;
  }

  onAddRoomTable() {
    this.isEdit = false;
    this.roomTableForm.onReset();
    this.display = true;
    this.roomTableForm.getFloor();
  }

  onDelete(id) {
    let message;
    this.translateService.get('question.delete_room_table').subscribe((res) => {
      message = res;
    });
    this.confirmationService.confirm({
      message: message,
      accept: () => {
        this.roomTableServices.deleteRoomTable(id).subscribe((response: any) => {
          this.getRoomTable();
        });
      },
    });
  }

  baseUrlImage(image) {
    return `${environment.serverURL}/${image}`;
  }

  checkCodeRequired(deskFloor) {
    return deskFloor.code === 'Floor' || deskFloor.code === 'Live';
  }

  @HostListener('document:keydown', ['$event'])
  async handleKeyboardEvent(event: KeyboardEvent) {
    switch (event.key) {
      case 'F7':
        event.preventDefault();
        await this.onAddRoomTable();
        break;
    }
  }

  generateQR(codes = []): void {
    if (codes.length > 0) {
      console.log(codes);
      this.tableQrGeneratorComponent.generateQRCodes(codes);
      return;
    }
    // If not, get all codes
    this.roomTableServices.getListNoQuery().subscribe((res) => {
      let desks = res.data.filter((item) => item.floorId !== 0) || [];
      let tableCodes = desks.map((item) => item.code);
      this.tableQrGeneratorComponent.generateQRCodes(tableCodes);
    });
  }
}
