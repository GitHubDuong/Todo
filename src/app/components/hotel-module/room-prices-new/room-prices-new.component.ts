import { Component, HostListener, OnInit } from '@angular/core';
import { RoomPricesService } from "../../../service/room-prices.service";
import { RoomPrice } from "../../../models/room-price.model";
import * as moment from "moment/moment";
import AppUtil from 'src/app/utilities/app-util';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'app-room-prices-new',
    templateUrl: './room-prices-new.component.html',
    styles: [`
    :host ::ng-deep {
        .input-error {
           .p-inputtext{
            border-color:red;
           }
           .p-dropdown{
            border-color:red;
           }
        }
        .block {
            min-width: 100px;
            background-color: var(--primary-color);
            border-radius: 4px;

            &-price {
                padding: 0 4px;
                text-align: right;
                font-size: 13px;
            }
        }
        @media screen and (max-width: 768px) {
            .block {
                min-width: 80px !important;
            }
        }
        .modal-content{
           min-height:400px;
        }
        .p-calendar {
            width: 100% !important;
        }
        .p-inputnumber-input {
            text-align: left !important;
        }
        .item {

            &-month {
                background:#f8f9fa;
                padding: 8px 0;
                font-size: 20px;
            }
            &-wrap {

            }

            &-price {

                cursor:pointer;
                min-width:70px;
                align-items:center;
                padding:4px;
                flex-flow: row wrap;
                border: 1px solid #dee2e6;
                gap:5px;
                &:hover{
                    background: #dee2e6;
                }
                &-quantity {
                    height:32px;
                    width:100%;
                    color:white;
                    display:flex;
                    font-weight: bold;
                    justify-content:space-around;
                    background: var(--primary-color);
                    align-items:center;
                }
            }

        }

        @media screen and (max-width: 768px) {
            .item {
              width: 54px;
            }
        }
    }

    `]
})

export class RoomPricesNewComponent implements OnInit {
    startDate = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    endDate = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0);
    roomPrices: RoomPrice[] = [];
    dayChoice = {
        fromAt: null,
        toAt: null,
        roomTypeId: null,
        priceShow: null,
        discount: null,
        price: null,
        date: null,
        isHaveBreakfast: false,
    };
    dialogShow: boolean = false;
    dialogDay: boolean = false;
    constructor(
        private roomTypeService: RoomPricesService,
        private readonly translateService: TranslateService,
    ) {
    }
    listQuestIsBreakfast: any[] = [
        {
            label: AppUtil.translate(
                this.translateService,
                "label.breakfast_option_yes",
            ),
            value: true,
        },
        {
            label: AppUtil.translate(
                this.translateService,
                "label.breakfast_option_no",
            ),
            value: false,
        },
    ];
    roomType?: any ;
    weekday = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];
    roomTypes: any[] = [];
    inValid = false;
    itemAdd: any = {
        fromAt: null,
        toAt: null,
        roomTypeId: null,
        priceShow: null,
        discount: null,
        price: null,
        isHaveBreakfast: false,
    }
    isSubmit = false;
    ngOnInit(): void {
        this.getData();
        this.loadRoomTypes();
    }
    groupBy = function (arr: any[]) {
        return arr.reduce(function (rv, item) {

            var key = moment(item.date).format(
                'YYYY-MM',
            );
            (rv[key] = rv[key] || []).push(item);
            return rv;
        }, {});
    };
    loadDay = (date: string) => {
        return this.weekday[moment(date).day()]
    }

    thousandConverter = (num: number) => {
        var str = num <= 999 ? num : (0.1 * Math.floor(num / 100)).toFixed(1).replace('.0', '') + 'K'
        return str.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.")
    }
    getData() {
        const params = {
            fromAt: moment(this.startDate).format(
                'YYYY-MM-DD',
            ),
            toAt: moment(this.endDate).format('YYYY-MM-DD'),
        }
        if (this.roomType) {
            params["RoomTypeIds"] = this.roomType
        }
        this.roomTypeService.getList(params).subscribe({
            next: (res): void => {
                res.map((v, i) => {
                    v.prices = this.groupBy(v.prices)
                })
                this.roomPrices = res;
            },
            error: (): void => {

            }
        })
    }
    loadRoomTypes = () => {
        this.roomTypeService.getListRoomType().subscribe({
            next: (res): void => {
                this.roomTypes = res;

            },
            error: (): void => {

            }
        })
    }
    onCancel = () => {
        this.dialogShow = false;
        this.dialogDay = false;
        this.onReset()
        this.getData()
    }
    validate = () => {
        if (this.itemAdd.fromAt != null && this.itemAdd.toAt != null && this.itemAdd.roomTypeId != null && this.itemAdd.price != null) {
            this.inValid = false;
            return true;
        }
        this.inValid = true;
        return false
    }
    validateDay = () => {
        if (this.dayChoice.price != null) {
            this.inValid = false;
            return true;
        }
        this.inValid = true;
        return false
    }
    onSubmit = () => {
        this.isSubmit = true;
        if (this.validate()) {
            var body = { ...this.itemAdd }
            body.priceShow = body.price;
            body.discount = 0;
            body.fromAt = moment(body.fromAt).format('YYYY-MM-DD');
            body.toAt = moment(body.toAt).format('YYYY-MM-DD');
            this.roomTypeService.create(body).subscribe({
                next: (res): void => {
                    this.isSubmit = false;
                    this.onReset()
                    this.onCancel()
                },
                error: (err): void => {
                    console.log(err)
                }
            })
        }
    }
    onSubmitDay = () => {
        this.isSubmit = true;
        if (this.validateDay()) {
            var body = { ...this.dayChoice }
            body.priceShow = body.price;
            body.discount = 0;
            body.fromAt = moment(body.date).format('YYYY-MM-DD');
            body.toAt = moment(body.date).format('YYYY-MM-DD');
            this.roomTypeService.create(body).subscribe({
                next: (res): void => {
                    this.isSubmit = false;
                    this.onReset()
                    this.onCancel()
                },
                error: (err): void => {
                    console.log(err)
                }
            })
        }
    }
    onDayClick = (item: any) => {
        this.dialogDay = true;
        this.dayChoice = item;
    }
    onReset = () => {
        this.itemAdd = {
            fromAt: null,
            toAt: null,
            roomTypeId: null,
            priceShow: null,
            discount: null,
            price: null,
            isHaveBreakfast: false,
        }
        this.dayChoice = {
            fromAt: null,
            toAt: null,
            roomTypeId: null,
            priceShow: null,
            discount: null,
            price: null,
            date: null,
            isHaveBreakfast: false,
        }
    }
    onContine = () => {
        this.isSubmit = true;
        if (this.validate()) {
            this.isSubmit = true;
            var body = { ...this.itemAdd }
            body.priceShow = body.price;
            body.discount = 0;
            body.fromAt = moment(body.fromAt).format('YYYY-MM-DD');
            body.toAt = moment(body.toAt).format('YYYY-MM-DD');
            this.roomTypeService.create(body).subscribe(() => {
                this.onReset()
                this.isSubmit = false;
            })
        }
    }
    @HostListener('document:keydown', ['$event'])
    async handleKeyboardEvent(event: KeyboardEvent) {
        switch (event.key) {
            case 'F8':
                event.preventDefault();
                if (this.dialogDay) {
                    this.onSubmitDay()
                } else {
                    this.onSubmit();
                }
                break;
            case 'F7':
                event.preventDefault();
                this.onCancel()
                break;
            case 'F6':
                event.preventDefault();
                this.onContine()
                break;
        }
    }
}
