import { DecimalPipe } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IBillPromotion, IGoodPromotionForSale } from '@app/models/goods-promotion.model';
import { PromotionService } from '@app/service/promotion.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Symbol } from 'src/app/models/symbol.model';
import { PageFilterUser } from 'src/app/service/user.service';
import AppConstant from 'src/app/utilities/app-constants';

@Component({
  selector: 'app-bill-promotion',
  templateUrl: './bill-promotion.component.html',
  providers: [MessageService, ConfirmationService, DecimalPipe],
  styleUrls: ['./bill-promotion.component.scss'],
})
export class BillPromotionComponent implements OnInit {
  @Input() billPromotions: IBillPromotion[] = [];
  @Output() onSuccess = new EventEmitter<IBillPromotion[]>();

  display: boolean = false;
  public appConstant = AppConstant;
  loading: boolean = true;
  sortFields: any[] = [];
  sortTypes: any[] = [];
  first = 0;

  public getParams: PageFilterUser = {
    page: 1,
    pageSize: 5,
    sortField: 'id',
    isSort: true,
    searchText: '',
    dateTimeKeep: new Date(),
  };
  public totalPages = 0;
  public myTarget: number;
  public isLoading: boolean = false;
  isMobile = screen.width <= 1199;
  pendingRequest: any;
  roles: any[] = [];
  listSymbol: Symbol[] = [];

  promotions: IGoodPromotionForSale[] = [];

  constructor(
    private readonly promotionService: PromotionService,
    private decimalPipe: DecimalPipe,
  ) {}

  ngOnInit(): void {
    this.getPromotions();
  }

  getPromotions(): void {
    this.promotionService.forSalePromotions().subscribe((promotions) => {
      this.promotions = promotions;
    });
  }

  appendItem(): void {
    this.billPromotions.push({
      id: 0,
      code: '',
      name: '',
      note: '',
      amount: 0,
      standard: '',
    });
  }

  removeItem(index: number): void {
    this.billPromotions.splice(index, 1);
  }

  onSubmit(): void {
    this.toggleDisplay();
    this.onSuccess.emit(this.billPromotions);
  }

  toggleDisplay = () => (this.display = !this.display);

  get promotionNames(): string {
    if (this.billPromotions == null) {
      return '';
    }
    const names = this.billPromotions.map((item) => item.standard + ' - ' + this.decimalPipe.transform(item.amount || 0));
    return names.join(', ');
  }

  get promotionDisplay(): string {
    if (this.billPromotions == null) {
      return '';
    }
    const names = this.billPromotions.map((item) => item.note + ' - ' + this.decimalPipe.transform(item.amount || 0));
    return names.join('; ');
  }

  get promotionDiscountAmount(): number {
    if (this.billPromotions == null) {
      return 0;
    }
    return this.billPromotions.reduce((total, billPromotion) => total + billPromotion.amount, 0);
  }

  onChangePromotion($event: any, billPromotion: IBillPromotion) {
    const promotionId = $event.value;
    const promotion = this.promotions.find((x) => x.id == promotionId);
    billPromotion.code = promotion?.code || '';
    billPromotion.name = promotion?.name || '';
    billPromotion.note = promotion?.note || '';
    billPromotion.standard = promotion?.standard || '';
    billPromotion.discount = promotion?.discount;
    billPromotion.qty = promotion?.qty || 0;
    billPromotion.unit = promotion.unit || '';
    if (billPromotion.discount && billPromotion.qty) {
      billPromotion.amount = billPromotion.discount * billPromotion.qty;
    } else {
      billPromotion.amount = 0;
    }
  }

  onCalcAmount(promotion: IBillPromotion) {
    promotion.amount = promotion?.qty * promotion?.discount || 0;
  }

  get sumAmount(): number {
    return this.billPromotions.reduce((total, billPromotion) => total + billPromotion.amount, 0);
  }
}
