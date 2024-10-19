import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { RouteService } from '@app/service/route.service';
import { ToastService } from '@app/service/toast.service';

@Component({
  selector: 'app-route-form',
  templateUrl: './route-form.component.html',
  styleUrls: ['./route-form.component.scss'],
})
export class RouteFormComponent implements OnChanges, OnInit {
  @Input() isDisplay = false;
  @Input() item: any;
  @Input() policePostList: any[] = [];
  mForm: FormGroup;
  @Output() isDisplayChange = new EventEmitter();

  get code() {
    return this.mForm.get('code') as FormControl;
  }

  get name() {
    return this.mForm.get('name') as FormControl;
  }

  get roadRouteDetail() {
    return this.mForm.get('roadRouteDetail') as FormControl;
  }

  get policeCheckPointIds() {
    return this.mForm.get('policeCheckPointIds') as FormControl;
  }

  get numberOfTrips() {
    return this.mForm.get('numberOfTrips') as FormControl;
  }

  constructor(
    private fb: FormBuilder,
    private routeService: RouteService,
    private toastService: ToastService,
  ) {
    this.mForm = this.fb.group({
      code: [''],
      name: [''],
      policeCheckPointIds: [],
      roadRouteDetail: [''],
      numberOfTrips: [0],
    });
  }

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges): void {
    const { item } = changes;
    if (item && item.currentValue) {
      this.getItemDetail();
      this.mForm.patchValue(item.currentValue);
    }
  }

  onBack() {
    this.isDisplayChange.emit(false);
  }

  onSave() {
    if (!this.item) {
      this.routeService.create(this.mForm.value).subscribe((res) => {
        this.toastService.success('Thêm mới thành công');
        this.isDisplayChange.emit(false);
      });
    } else {
      this.routeService.update(this.item.id, { ...this.mForm.value, id: this.item.id }).subscribe((res) => {
        this.toastService.success('Cập nhật thành công');
        this.isDisplayChange.emit(false);
      });
    }
  }

  private getItemDetail() {
    this.routeService.getById(this.item.id).subscribe((res) => {
      this.mForm.patchValue(res.data);
    });
  }
}
