import { DecimalPipe } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActionButtonModel } from '@app/models/common/action-button.model';
import { DriverRouterService } from '@app/service/driver-router.service';
import { ToastService } from '@app/service/toast.service';
import { DateTimeHelper } from '@app/shared/helper/date-time.helper';

@Component({
  selector: 'app-driver-form',
  templateUrl: './driver-form.component.html',
  styleUrls: ['./driver-form.component.scss'],
  providers: [DecimalPipe],
})
export class DriverFormComponent implements OnInit, OnChanges {
  @Input() visible = false;
  @Input() item: any;
  @Input() gasolineList: any[] = [];
  mForm: FormGroup;
  @Output() visibleChange = new EventEmitter();
  detail: any;
  policePostList: any[] = [];
  selectedPolicePost: any;
  location = '';
  amount = 0;
  note = '';
  actionList: ActionButtonModel[] = [
    {
      icon: 'pi-times',
      label: 'button.backF6',
      class: 'p-button-outlined',
      command: () => {
        this.onBack();
      },
    },
  ];

  constructor(
    private driverRouteService: DriverRouterService,
    private toastService: ToastService,
    private decimalPipe: DecimalPipe,
  ) {}

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges): void {
    const { item } = changes;
    if (item && item.currentValue) {
      this.getData();
    }
  }

  get itemDetail() {
    const items = this.detail?.items || [];
    items.forEach((item: any) => {
      item.location = item.location ? item.location : this.policePostList.find((x) => x.id === item.policeCheckPointId)?.name;
    });
    return this.detail?.items;
  }

  onBack() {
    this.visibleChange.emit(false);
  }

  onSave() {
    this.visibleChange.emit(false);
  }

  getData() {
    this.driverRouteService.getById(this.item.id).subscribe((res: any) => {
      this.detail = res;
    });
    this.driverRouteService.getListPolicePoint(this.item.id).subscribe((res: any) => {
      this.policePostList = (res || []).map((item: any) => {
        return {
          ...item,
          label: `${item.name} - ${this.decimalPipe.transform(item.amount)}`,
        };
      });
    });
  }

  onAddPolicePost() {
    const body = {
      ...this.detail,
      items: [
        ...this.detail.items,
        {
          policeCheckPointId: this.selectedPolicePost?.id,
          location: this.location,
          amount: this.amount,
          note: this.note,
          date: new Date().toISOString(),
        },
      ],
    };
    this.driverRouteService.update(this.item.id, body).subscribe((res: any) => {
      this.toastService.success('Thêm chốt công an thành công');
      this.getData();
    });
  }

  get header() {
    if (!this.item || !this.detail) {
      return '';
    }
    return this.item.roadRouteName + ' - ' + DateTimeHelper.formatDate(this.detail.date);
  }

  get totalAmount(){
    return this.itemDetail?.reduce((acc, item) => acc + item.amount, 0);
  }
  onChangePolicePost() {
    if (!this.selectedPolicePost) {
      this.location = null;
      this.amount = null;
    }
    this.location = this.selectedPolicePost.name;
    this.amount = this.selectedPolicePost.amount;
  }
}
