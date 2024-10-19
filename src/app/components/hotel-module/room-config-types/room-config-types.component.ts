import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { AppComponent } from 'src/app/app.component';
import { Page, TypeData } from 'src/app/models/common.model';
import { ConfigType, RoomConfigType } from 'src/app/models/room-config-type.model';
import { RoomConfigTypesService } from 'src/app/service/room-config-types.service';
import AppUtil from 'src/app/utilities/app-util';
export interface PageRoomConfigType extends Page { }
export enum PanelAction {
  Create = "Create",
  Edit = "Edit",
  Delete = "Delete",
  Show = "Show"
}
@Component({
  selector: 'app-room-config-types',
  templateUrl: './room-config-types.component.html',
  styleUrls: ['./room-config-types.component.scss']
})
export class RoomConfigTypesComponent implements OnInit {
  public appConstant = AppComponent;
  appUtil = AppUtil;
  PanelAction = PanelAction;
  public totalRecords = 0;
  public totalPages = 0;
  isMobile = screen.width <= 1199;
  loading: boolean = true;
  sortFields: any[] = [];
  sortTypes: any[] = [];
  first = 0;
  listRoomConfigTypes: RoomConfigType[];
  listConfigTypes: ConfigType[];
  itemChoiced: RoomConfigType = null;
  action: PanelAction = PanelAction.Show;
  public getParams: PageRoomConfigType = {
    page: 1,
    pageSize: 10,
    sortField: 'id',
    isSort: true,
    searchText: "",
  };
  constructor(
    private roomConfigTypesService: RoomConfigTypesService,
    private readonly translateService: TranslateService,
    private readonly messageService: MessageService,
    private readonly confirmationService: ConfirmationService,
  ) {

  }

  ngOnInit(): void {
    this.loadRoomConfigTypes(this.getParams);
    this.loadConfigTypes();
  }
  loadRoomConfigTypes(params: any) {
    this.loading = true;
    this.roomConfigTypesService.getList(params).subscribe(
      (response: TypeData<RoomConfigType>) => {
        AppUtil.scrollToTop();
        this.listRoomConfigTypes = response.data;
        this.totalRecords = response.totalItems || 0;
        this.totalPages = response.totalItems / response.pageSize + 1;
        this.loading = false;
      }
    )
  }
  loadConfigTypes() {
    this.roomConfigTypesService.getListConfigTypes().subscribe(
      (response: ConfigType[]) => {
        this.listConfigTypes = response;

      }
    )
  }
  onSearch(event) {
    if (event.key === 'Enter') {
      this.loadRoomConfigTypes(this.getParams);
    }
  }
  onPageChange = (event: any) => {
    this.getParams.page = event.first / event.rows + 1;
    this.getParams.pageSize = event.rows;
    this.loadRoomConfigTypes(this.getParams);
  }
  onPanelAction = (action: PanelAction, item: RoomConfigType) => {
    switch (action) {
      case PanelAction.Delete:
        this.confirmationService.confirm({
          message: this.appUtil.translate(
            this.translateService,
            'question.delete_room_config_type',
          ),
          header: this.appUtil.translate(
            this.translateService,
            'question.delete_room_config_type_header',
          ),
          accept: () => {
            this.roomConfigTypesService.delete(item).subscribe((res) => {
              this.loadRoomConfigTypes(this.getParams);
              this.appUtil.scrollToTop();
              this.messageService.add({
                severity: 'success',
                detail: this.appUtil.translate(
                  this.translateService,
                  'success.delete',
                ),
              });
            });
          },
        });
        break;
      default:
        this.action = action;
        this.itemChoiced = item;
    }

  }

}
