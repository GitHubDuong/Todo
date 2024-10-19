import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { RoomType, TypeExtraBed, TypeRoom } from 'src/app/models/room-type.model';
import { RoomTypesService } from 'src/app/service/room-types.service';
import AppUtil from 'src/app/utilities/app-util';

@Component({
  selector: 'app-room-types-form',
  templateUrl: './room-types-form.component.html',
  styleUrls: ['./room-types-form.component.scss']
})
export class RoomTypesFormComponent implements OnInit {
  listQuestIsBed: any[] = [
    {
      label: AppUtil.translate(
        this.translateService,
        "label.room_types_option_label_yes",
      ),
      value: true,
    },
    {
      label: AppUtil.translate(
        this.translateService,
        "label.room_types_option_label_no",
      ),
      value: false,
    },
  ];
  @Input('item') item?: RoomType
  @Input('typeRooms') typeRooms: TypeRoom[] = [];
  @Input('typeExtraBeds') typeExtraBeds: TypeExtraBed[] = [];
  @Input('amenityTypes') amenityTypes: any[] = [];
  @Output() onCancel = new EventEmitter();
  isMobile = screen.width <= 1199;
  form: FormGroup = new FormGroup({});
  formAdd: FormGroup = new FormGroup({});
  isLoading: boolean = true;
  isSubmit: boolean = false;
  amenityChoiced: any = null;
  bedTypeRoomConfigureQuantities: any[] = [
    {
      quantity: null,
      bedTypeRoomConfigureId: null,
    }
  ]
  constructor(
    private formBuilder: FormBuilder,
    private roomTypesService: RoomTypesService,
    private readonly translateService: TranslateService,
  ) {
    this.form = this.formBuilder.group({
      name: [null, [Validators.required]],
      roomTypeRoomConfigureId: [null, [Validators.required]],
      quantity: [null, [Validators.required]],
      lengthRoom: [null, [Validators.required]],
      widthRoom: [null],
      adultQuantity: [null, [Validators.required]],
      childrenQuantity: [null, [Validators.required]],
      isExtraBed: [false],
      bedTypeRoomConfigureId: [null],
      roomConfigureTypes: [[]],
      description: [null],
      roomBeds: [[]],
    })
  }

  ngOnInit(): void {
    this.loadInfo();
    this.isLoading = false;
  }

  loadInfo = () => {
    this.roomTypesService.getByID(this.item.id).subscribe(
      (response: RoomType) => {
        this.form.setValue({
          name: response[this.loadNameRoomType()],
          roomTypeRoomConfigureId: response.roomTypeRoomConfigureId,
          quantity: response.quantity,
          lengthRoom: response.lengthRoom,
          widthRoom: response.widthRoom,
          adultQuantity: response.adultQuantity,
          childrenQuantity: response.childrenQuantity,
          isExtraBed: response.isExtraBed ? true : false,
          bedTypeRoomConfigureId: response.bedTypeRoomConfigureId,
          roomConfigureTypes: response.roomConfigureTypes ? response.roomConfigureTypes : [],
          description: response.description,
          roomBeds: !response.roomBeds ? [] : response.roomBeds,

        })
        this.amenityChoiced = {}
        for (let i = 0; i < this.amenityTypes.length; i++) {
          var amenity = this.amenityTypes[i];
          this.amenityChoiced[amenity.code] = { ...amenity };
          this.amenityChoiced[amenity.code].items = [];
          amenity.items.forEach((element) => element.roomConfigureTypeId = 0);
        }
        if (response.roomConfigureTypes) {
          for (let i = 0; i < response.roomConfigureTypes.length; i++) {
            this.amenityChoiced[response.roomConfigureTypes[i].code] = response.roomConfigureTypes[i]

          }
        }
      }
    )
  }
  onChange = (data: any) => {
    let item = { ...data.value }
    item.amenities = []
    if (data.value != null && !this.amenityChoiced[item.code]) {
      this.amenityChoiced[item.code] = item;
    }
  }
  onChangeCheckBox = (event: any) => {

  }
  onSubmit = () => {
    this.isSubmit = true;
    if (this.form.valid) {
      let body: RoomType = { ...this.form.value }
      body.id = this.item.id;
      body[this.loadNameRoomType()] = this.form.value.name;
      for (let x in this.amenityChoiced) {
        body.roomConfigureTypes.push(this.amenityChoiced[x])
      }
      this.roomTypesService.update(body).subscribe(() => {
        this.onCancel.emit({})
      })
    }
  }
  loadNameRoomType() {
    switch (this.translateService.currentLang) {
      case "en":
        return "goodNameEn"
      case "ko":
        return "goodNameKo"
      default:
        return "goodNameVn"
    }
  }
  onAddbedTypeRoomConfigureId = () => {
    this.bedTypeRoomConfigureQuantities.push({
      quantity: null,
      bedTypeRoomConfigureId: null,
    })
  }
  onAddRoomBed = () => {
    this.form.value.roomBeds.push({
      bedTypeRoomConfigureQuantities: this.bedTypeRoomConfigureQuantities,
    })
    this.bedTypeRoomConfigureQuantities = [{
      quantity: null,
      bedTypeRoomConfigureId: null,
    }];
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
  loadNameRoomBed = (item: any) => {
    var result = [];
    for (let i = 0; i < item.bedTypeRoomConfigureQuantities.length; i++) {
      let bedType = item.bedTypeRoomConfigureQuantities[i]
      let extrabed = this.typeExtraBeds.find(el => {
        if (el.id == bedType.bedTypeRoomConfigureId) {
          return el
        }
        return null;
      }
      )
      if (extrabed != null) {
        result.push(`${bedType.quantity ?? 1} ${extrabed[this.loadName()]}`)
      }
    }
    return result.toString()
  }
  loadQuantityRoomBed = (item: any) => {
    return this.form.value.adultQuantity
  }
  onDeleteRoomBed = (item: any) => {
    this.form.value.roomBeds = this.form.value.roomBeds.filter(i => i !== item);
  }
}
