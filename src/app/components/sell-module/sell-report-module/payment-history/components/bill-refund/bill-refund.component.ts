import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { IBillPromotion } from '@app/models/goods-promotion.model';
import { BillPromotionComponent } from '@components/sell-module/components/bill-discount/bill-promotion.component';
import { BillDetailService } from '../../../../../../service/bill-detail.service';

@Component({
  selector: 'app-bill-refund',
  templateUrl: './bill-refund.component.html',
})
export class BillRefundComponent implements OnInit {
  display: boolean = false;
  billDetails: any[] = [];
  billPromotions: any[] = [];
  billId: number;
  @Input() isMobile = false;
  @ViewChild('billPromotionComponent') billPromotionComponent: BillPromotionComponent;
  constructor(private readonly billDetailService: BillDetailService) {}

  ngOnInit(): void {}

  onAdjustBillDetail(billId: number, data: any) {
    this.display = true;
    this.billId = billId;
    this.billDetails = data.billDetail;
    this.billPromotions = data.promotions;
  }

  onSubmit() {
    let request = this.billDetails.map((item: any) => {
      return {
        id: item.id,
        billId: this.billId,
        goodsId: item.goodsId,
        quantityRefund: item.quantityRefund,
        noteRefund: item.noteRefund,
      };
    });
    const body = {
      billDetails: request,
      promotion: this.billPromotions,
    }
    this.billDetailService
      .BillGoodsRefund(this.billId, body)
      .subscribe((res: any) => {
        this.display = false;
      });
  }

  onSelectPromotionSuccess($event: IBillPromotion[], b: boolean) {
    this.billPromotions = $event;
  }
}
