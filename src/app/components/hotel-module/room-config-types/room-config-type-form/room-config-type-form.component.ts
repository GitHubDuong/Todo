import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { ConfigType, RoomConfigType } from 'src/app/models/room-config-type.model';
import { RoomConfigTypesService } from 'src/app/service/room-config-types.service';

import { PanelAction } from '../room-config-types.component';

@Component({
  selector: 'app-room-config-type-form',
  templateUrl: './room-config-type-form.component.html',
  styleUrls: ['./room-config-type-form.component.scss'],

})
export class RoomConfigTypeFormComponent implements OnInit {
  @Input('item') item?: RoomConfigType;
  @Input('action') action?: PanelAction;
  @Input('listConfigTypes') listConfigTypes?: ConfigType[];
  @Output() onCancel = new EventEmitter();
  form: FormGroup = new FormGroup({});
  formAdd: FormGroup = new FormGroup({});
  isLoading: boolean = true;
  isSubmit: boolean = false;
  isAdd: boolean = false;
  isMobile = screen.width <= 1199;
  constructor(
    private formBuilder: FormBuilder,
    private roomConfigTypesService: RoomConfigTypesService,
    private readonly translateService: TranslateService,
  ) {
    this.formAdd = this.formBuilder.group({
      code: [null, [Validators.required]],
      nameVn: [null, [Validators.required]],
      nameEn: [null, [Validators.required]],
      nameKo: [null, [Validators.required]],
    });
    this.form = this.formBuilder.group({
      code: [null, [Validators.required]],
      nameVn: [null, [Validators.required]],
      nameEn: [null, [Validators.required]],
      nameKo: [null, [Validators.required]],
      type: [null, [Validators.required]],
      note: [""],
      items: [[]],
    })
  }

  ngOnInit(): void {
    if (this.item != null) {
      this.roomConfigTypesService.getByID(this.item.id).subscribe(item => {
        this.form.setValue({
          code: item.code,
          nameVn: item.nameVn,
          nameEn: item.nameEn,
          nameKo: item.nameKo,
          type: item.type,
          note: !item.note ? "" : item.note,
          items: !item.items ? [] : item.items,
        })
      });
    }
  }

  onSubmit = () => {
    this.isSubmit = true;
    if (this.form.valid) {
      switch (this.action) {
        case PanelAction.Create:
          var roomConfigType: RoomConfigType = {
            ...this.form.value,
          }
          this.roomConfigTypesService.create(roomConfigType).subscribe(
            () => {
              this.onCancel.emit({})
            }
          )
          break;
        case PanelAction.Edit:
          var roomConfigType: RoomConfigType = {
            ...this.form.value,
          }
          roomConfigType.id = this.item.id;
          this.roomConfigTypesService.update(roomConfigType).subscribe(
            () => {
              this.onCancel.emit({})
            }
          )
          break;
        default:
          break;
      }
    }
  }
  onAdd = () => {
    this.isAdd = true;
    if (this.formAdd.valid) {
      this.form.value.items.push({
        ...this.formAdd.value
      })
    }
  }
  onDelete = (item) => {
    this.form.value.items = this.form.value.items.filter(i => i !== item);
  }
}
