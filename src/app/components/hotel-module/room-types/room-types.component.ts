import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { TypeData } from 'src/app/models/common.model';
import { RoomType, TypeExtraBed, TypeRoom } from 'src/app/models/room-type.model';
import { PageRoomType, RoomTypesService } from 'src/app/service/room-types.service';
import AppConstant from 'src/app/utilities/app-constants';
import AppUtil from 'src/app/utilities/app-util';
export enum PanelAction {
  Create = "Create",
  Edit = "Edit",
  Delete = "Delete",
  Show = "Show"
}
@Component({
  selector: 'app-room-types',
  templateUrl: './room-types.component.html',
  styleUrls: ['./room-types.component.scss']
})
export class RoomTypesComponent implements OnInit {
  public appConstant = AppConstant;
  PanelAction = PanelAction
  public totalRecords = 0;
  public totalPages = 0;
  public getParams: PageRoomType = {
    page: 1,
    pageSize: 10,
    sortField: 'id',
    isSort: true,
    searchText: "",
  };
  showDialogAdd: boolean = false;
  typeRooms: TypeRoom[] = [];
  typeExtraBeds: TypeExtraBed[] = [];
  amenityTypes: any[] = [];
  isMobile = screen.width <= 1199;
  action: PanelAction = PanelAction.Show;
  loading: boolean = true;
  sortFields: any[] = [];
  sortTypes: any[] = [];
  roomTypes: RoomType[];
  itemChoiced: RoomType = null;
  constructor(
    private roomTypesService: RoomTypesService,
    private readonly translateService: TranslateService,
  ) { }

  ngOnInit(): void {
    this.roomTypesService.syncAccountGood().subscribe()
    this.loadRoomTypes(this.getParams);
    this.loadTypeRooms();
    this.loadExtraBed();
    this.loadAmenityTypes();
  }
  loadRoomTypes(params: any) {
    this.loading = true;
    this.roomTypesService.getList(params).subscribe(
      (response: TypeData<RoomType>) => {
        AppUtil.scrollToTop();
        this.roomTypes = response.data;
        this.totalRecords = response.totalItems || 0;
        this.totalPages = response.totalItems / response.pageSize + 1;
        this.loading = false;
      }
    )
  }
  onSearch(event) {
    if (event.key === 'Enter') {
      this.loadRoomTypes(this.getParams);
    }
  }
  loadTypeRooms() {
    this.roomTypesService.getListType().subscribe(
      (response: TypeRoom[]) => {
        this.typeRooms = response;

      }
    )
  }
  loadExtraBed() {
    this.roomTypesService.getListExtraBed().subscribe(
      (response: TypeExtraBed[]) => {
        this.typeExtraBeds = response;
      }
    )
  }
  loadAmenityTypes() {
    this.roomTypesService.getListAmenityType().subscribe(
      (response: any[]) => {
        this.amenityTypes = response;
      }
    )
  }
  loadNameTypeRoom = (item: RoomType) => {
    let typeRoom = this.typeRooms.find(e => e.id == item.roomTypeRoomConfigureId)
    return typeRoom?.[this.loadName()] ?? "";
  }
  loadNameTypeExtraBed = (item: RoomType) => {
    let typeExtraBed = this.typeExtraBeds.find(e => e.id == item.bedTypeRoomConfigureId)
    return typeExtraBed?.[this.loadName()] ?? "";


  }
  loadNameRoomType(item: RoomType) {
    switch (this.translateService.currentLang) {
      case "en":
        return item.goodNameEn
      case "ko":
        return item.goodNameKo
      default:
        return item.goodNameVn
    }
  }
  loadName() {
    switch (this.translateService.currentLang) {
      case "en":
        return "nameEn"
      case "ko":
        return "nameKo"
      default:
        return "nameVn"
    }
  }
  onHide = () => {
    this.showDialogAdd = false;
    this.loadRoomTypes(this.getParams);
  }
  onPageChange = (event: any) => {
    this.getParams.page = event.first / event.rows + 1;
    this.getParams.pageSize = event.rows;
    this.loadRoomTypes(this.getParams);
  }
  onAdd = () => {
    this.loadRoomTypes(this.getParams);
    this.onHide()
  }
  onPanelAction = (action: PanelAction, item: RoomType) => {
    this.action = action;
    this.itemChoiced = item;
  }

}
