import { Component, EventEmitter, Input, OnInit, Output, ViewChild, ViewContainerRef } from '@angular/core';
import { AppMainComponent } from '@app/layouts/app.main.component';
import { IBillPromotion } from '@app/models/goods-promotion.model';
import { BillPdfGeneratorService } from '@app/service/bill-pdf-generator.service';
import { CustomerService } from '@app/service/customer.service';
import { GoodsService } from '@app/service/goods.service';
import { CashierMediatorService } from '@app/service/mediators/cashier-mediator.service';
import { TaxRatesService } from '@app/service/tax-rates.service';
import { BillPromotionComponent } from '@components/sell-module/components/bill-discount/bill-promotion.component';
import { TranslateService } from '@ngx-translate/core';
import { BillStatus, BillType, DiscountTypeEnum, PaymentType } from '@utilities/app-enum';
import { MessageService } from 'primeng/api';
import { ProductModel } from 'src/app/models/cashier.model';
import { Company } from 'src/app/models/company.model';
import { Goods } from 'src/app/models/goods.model';
import { AuthService } from 'src/app/service/auth.service';
import { CompanyService } from 'src/app/service/company.service';
import AppUtil from 'src/app/utilities/app-util';
import { environment } from 'src/environments/environment';
import AppConstants from '../../../../utilities/app-constants';
import { PrintBillComponent } from '../../cashier/components/print-bill/print-bill.component';

@Component({
  selector: 'app-bill-table',
  templateUrl: './bill-table.component.html',
  styleUrls: ['bill-table.component.scss'],
})
export class BillTableComponent implements OnInit {
  billTypes = BillType;
  appConstant = AppConstants;
  appUtil = AppUtil;
  @Input('customers') customers: any[] = [];
  @Input('billTab') billTab: any = {};
  @Input('isSeller') isSeller: boolean = false;
  @Input('isMarketingStaff') isMarketingStaff: boolean = false;
  @Input('selectedUser') selectedUser: string = '';
  @Input('selectedCustomer') selectedCustomer: string = '';
  @Input('users') users: any[] = [];
  @Input('surchargeData') surchargeData: any = {};
  @Input('labelSendCashier') labelSendCashier: string = 'Gửi thu ngân';

  @Output() closeBillTab = new EventEmitter<any>();
  @Output() onShowSplitMerge = new EventEmitter();
  @Output() onShowPayment = new EventEmitter<any>();
  @Output() onSendToCashier = new EventEmitter<any>();
  @Output() onSendToChef = new EventEmitter<any>();
  @Output() onSaveTemp = new EventEmitter<any>();
  @Output() onSaveTempXK = new EventEmitter<any>();
  @Output() onSaveTempXD = new EventEmitter<any>();
  @Output() onSaveTempPX = new EventEmitter<any>();
  @Output() onChangeFilterCustomer = new EventEmitter<any>();
  @Output() updateAccountant = new EventEmitter<any>();
  @ViewChild('printBillComponent') printBillComponent: PrintBillComponent;
  @ViewChild('billPromotionComponent') billPromotionComponent: BillPromotionComponent;

  taxes: any[] = [];
  typePays: any[] = [];
  printMenuItems: any[] = [];
  displayDiscountPrice: boolean = false;
  displayDept: boolean = false;
  displayVat: boolean = false;
  selectedProduct: any = {};
  selectedTab: any = {};
  defaultPrintCommand: any;
  displayDesc = false;
  desc = '';
  showNoteDialog = false;

  constructor(
    private messageService: MessageService,
    private translateService: TranslateService,
    private customerService: CustomerService,
    private companyService: CompanyService,
    public appMain: AppMainComponent,
    private readonly authService: AuthService,
    private billPdfGeneratorService: BillPdfGeneratorService,
    private mediatorService: CashierMediatorService,
    private goodService: GoodsService,
    private readonly taxRatesService: TaxRatesService,
    viewContainerRef: ViewContainerRef,
  ) {
    this.billPdfGeneratorService.setup(viewContainerRef);
    this.subscribeEvents();
  }

  onShowDesc(): void {
    this.desc = 'Text note example';
    this.displayDesc = true;
  }

  onEditDesc(): void {
    this.displayDesc = false;
  }

  private subscribeEvents() {
    // Bill tab change on cashier screen event
    this.mediatorService.$selectedTabChanged.subscribe((selectedTab) => (this.selectedTab = selectedTab));

    // Price code change on cashier screen event
    this.mediatorService.$priceCodeChanged.subscribe((priceCode) => this.onPriceCodeChange(priceCode));
  }

  onPriceCodeChange(priceCode: string) {
    if (this.selectedTab != this.billTab) {
      return;
    }
    let products = this.billTab.data.products;
    let goodCodes = products.map((item: any) => {
      return {
        detail1: item.detail1,
        detail2: item.detail2,
      };
    });

    this.goodService.getGoodPricesByPriceCode(priceCode, goodCodes).subscribe((goods: any[]) => {
      goods
        .filter((good) => good.salePrice > 0)
        .forEach((good) => {
          let product = products.find((item: any) => item.detail2 == good.detail2 && item.detail1 == good.detail1);
          if (product != null) {
            product.salePrice = good.salePrice;
          }
        });
    });
  }

  company: Company;
  isShowQuantityBoxNec: boolean = false;

  getLastInfo() {
    this.companyService.getLastCompanyInfo().subscribe((response: any) => {
      this.company = response.data;
    });
  }

  billPromotions = [];

  ngOnInit(): void {
    this.typePays = this.authService.getConfigurationViewTypePays;
    this.isShowQuantityBoxNec = this.authService.getConfigurationViewQuantityBoxNec;
    this.getTaxes();
    this.getLastInfo();
    this.getItemPrint();
  }

  getItemPrint() {
    let dataPrints = this.authService.getConfigurationViewPrint;

    // Menu name from configuration
    let configurationMenuNames = dataPrints.split(',');

    if (configurationMenuNames?.length == 0) {
      return [];
    }

    // Declare menu items
    let menuItems = [
      {
        id: 'ExporttBill',
        icon: 'pi pi-file-pdf',
        tooltipOptions: {
          tooltipLabel: 'Phiếu xuất kho',
          tooltipPosition: 'bottom',
        },
        command: () => {
          this.generatePdfXK();
        },
      },
      {
        id: 'ExporttBill',
        icon: 'pi pi-file-excel',
        tooltipOptions: {
          tooltipLabel: 'Phiếu xuất kho không đơn giá',
          tooltipPosition: 'bottom',
        },
        command: () => {
          this.generatePdfXK(true);
        },
      },
      {
        id: 'DeliveryBill',
        icon: 'pi pi-file',
        tooltipOptions: {
          tooltipLabel: 'Phiếu giao hàng',
          tooltipPosition: 'bottom',
        },
        command: () => {
          this.generatePdfBilling();
        },
      },
      {
        id: 'BillPrint',
        icon: 'pi pi-shopping-cart',
        tooltipOptions: {
          tooltipLabel: 'In bill nhỏ',
          tooltipPosition: 'bottom',
        },
        command: () => {
          this.printSmallBill();
          this.messageService.add({
            severity: 'info',
            summary: 'In đơn',
            detail: 'In đơn thành công',
          });
        },
      },
    ];

    let menuNames = menuItems.map((item) => item.id);

    // Get configuration valid based on the declared list above
    configurationMenuNames = configurationMenuNames.filter((item) => menuNames.includes(item)) || [];

    // Filter menu items by configuration
    this.printMenuItems = menuItems.filter((item) => configurationMenuNames.includes(item.id)) || [];

    // Set default print bill command when complete bill
    if (configurationMenuNames.length > 0) {
      let firstMenuItem = menuItems.find((item) => item.id == configurationMenuNames[0]) ?? menuItems[0];
      this.defaultPrintCommand = () => firstMenuItem.command();
    }

    return this.printMenuItems;
  }

  printSmallBill() {
    this.printBillComponent.onPrint(this.selectedTab);
  }

  onRemoveProduct(product) {
    this.billTab.data.products = this.billTab.data.products.filter((x) => x.id !== product.id);
    if (this.billTab.data.products.length === 0) {
      this.closeBillTab.emit(this.billTab.tabId);
    }
  }

  onDiscountProduct(product) {
    this.selectedProduct = product;
    if (!this.selectedProduct.discountType) {
      this.selectedProduct.discountType = 'money';
    }
    this.displayDiscountPrice = true;
  }

  onVatRateChange(vat: number) {
    this.selectedProduct.taxVat = Math.floor((this.selectedProduct.salePrice * vat) / 100);
  }

  get isPaid(): boolean {
    return this.billTab?.data?.status?.includes(BillStatus.Paid);
  }

  getAccountCode(data: Goods) {
    if (data.goodsCode) {
      return data.goodsCode;
    }
    if (data.detail2) {
      return data.detail2;
    }
    if (data.detail1) {
      return data.detail1.split('_')[0];
    }
    return data.account;
  }

  getAccountName(data: Goods) {
    if (data.goodsName) {
      return data.goodsName;
    }
    if (data.detail2) {
      return data.detailName2;
    }
    if (data.detail1) {
      return data.detailName1;
    }
    return data.accountName;
  }

  getSurchargeLabel() {
    return (
      'Tên phụ thu: ' +
      this.surchargeData.name +
      '\nGhi chú: ' +
      this.surchargeData.note +
      '\nGiá trị: ' +
      (this.surchargeData.type === 'percent' ? this.surchargeData.value + '%' : this.appUtil.formatCurrencyVND(this.surchargeData.value))
    );
  }

  baseUrlImage(image) {
    return `${environment.serverURL}/${image}`;
  }

  onChangeCustomer(customer: any) {
    if (this.billTab && this.billTab.data && !AppUtil.isEmpty(customer)) {
      this.billTab.data.customerId = customer.id;
      this.billTab.data.customerCode = customer.code;
      this.billTab.data.customerName = `${customer.code} | ${customer.name}`;
      this.billTab.data.customerAddress = customer.address;
      this.billTab.data.customerTaxCode = customer.taxCode;
      this.billTab.data.debitCode = customer.debit?.code;
      this.billTab.data.debitDetailCodeFirst = customer.debitDetailFirst?.code;
      this.billTab.data.debitDetailCodeSecond = customer.debitDetailSecond?.code;

      // add customer to billTab.data.products (select customer after select product)
      if (!AppUtil.isEmpty(this.billTab.data.products)) {
        this.billTab.data.products.forEach((product: any) => {
          product.customerId = customer.id;
          product.customerCode = customer.code;
          product.customerName = `${customer.code} | ${customer.name}`;
          product.customerAddress = customer.address;
          product.customerTaxCode = customer.taxCode;
          product.debitCode = customer.debit?.code;
          product.debitDetailCodeFirst = customer.debitDetailFirst?.code;
          product.debitDetailCodeSecond = customer.debitDetailSecond?.code;
        });
      }
    } else if (!AppUtil.isEmpty(this.billTab.data.products)) {
      this.billTab.data.products.forEach((product) => {
        product.customerId = null;
        product.customerCode = null;
        product.customerName = null;
        product.customerAddress = null;
        product.customerTaxCode = null;
        product.debitCode = null;
        product.debitDetailCodeFirst = null;
        product.debitDetailCodeSecond = null;
      });
    }
  }

  getDiscountMoney(product: ProductModel, discountTemp: number) {
    let realPrice = product.salePrice + product.taxVat;
    if (product.discountType === 'percent') {
      return realPrice - (realPrice / 100) * discountTemp;
    }
    return realPrice - discountTemp;
  }

  onPayment() {
    if (this.billTab.data.typePay === PaymentType.Debt && (!this.billTab.data.debitCode || !this.billTab.data.debitDetailCodeFirst)) {
      this.displayDept = true;
      return;
    }

    // Update bill include: vat, discount, surcharge ,total amount
    this.billTab.data.totalQuantity = this.totalQuantity;
    this.billTab.data.originalAmount = this.originalAmount;
    this.billTab.data.vatAmount = this.vatAmount;
    this.billTab.data.discountPrice = this.discountAmount;
    this.billTab.data.totalAmount = this.totalAmount;
    this.billTab.data.surchargeAmount = this.surchargeAmount;
    this.onShowPayment.emit(this.billTab);
  }

  onSendCashier(): void {
    if (this.isMarketingStaff) {
      this.onSendCashierMarketingStaff();
      return;
    }
    this.onSendToCashier.emit(this.billTab);
  }

  onSendCashierMarketingStaff() {
    this.billTab.billPromotions = this.billPromotions;
    this.onSendToCashier.emit({ isMarketing: true, data: this.billTab });
  }

  onSendChef() {
    this.onSendToChef.emit(this.billTab);
  }

  onTemp(type: string) {
    switch (type) {
      case 'XK':
        {
          this.onSaveTempXK.emit(this.billTab);
        }
        break;
      case 'XD':
        {
          this.onSaveTempXD.emit(this.billTab);
        }
        break;
      case 'saveTemp':
        {
          console.log(this.billTab);
          this.onSaveTemp.emit(this.billTab);
        }
        break;
      case 'PX':
        {
          this.onSaveTempPX.emit(this.billTab);
        }
        break;
    }
  }

  setRealBill(bill) {
    this.billTab.data.id = bill.data.id;
    this.billTab.data.status = bill.data.status;
    this.billTab.data.createdDate = bill.data.createdDate;
    this.billTab.data.isRealId = true;
  }

  getTaxes() {
    this.taxRatesService.getAllTaxRateForRs().subscribe((res) => {
      this.taxes = res.data;
    });
  }

  generatePdfBilling() {
    this.billPdfGeneratorService.prepareAndGenerate(this.billTab.data.id);
  }

  generatePdfXK(isNonPrice: boolean = false) {
    this.billPdfGeneratorService.prepareAndGenerateXK(this.billTab.data.id, isNonPrice);
  }

  sendQuoteViewPdf(customerId: number, customerQuoteId: number) {
    const param = {
      customerQuoteId,
      type: 'pdf',
      customerId,
    };
    this.customerService.reportCustomerQuoteDetail(param).subscribe((res) => {
      AppUtil.openDownloadFile(res.data, 'pdf');
    });
  }

  sendQuote(): void {
    const products = [];
    this.billTab.data?.products?.map((product) => {
      products.push({
        id: product.id || 0,
        billId: this.billTab.data?.id || 0,
        goodsId: product.id,
        quantity: product.billQuantity,
        unitPrice: product.salePrice,
        discountPrice: product.discountPrice,
        taxVAT: product.taxVat,
        discountType: product.discountType,
        note: '',
        dateManufacture: product.dateManufacture,
        dateExpiration: product.dateExpiration,
      });
    });
    this.customerService.createQuoteCustomer(this.billTab.data.customerId, products).subscribe(
      (res) => {
        if (res) {
          this.messageService.add({
            severity: 'success',
            detail: 'Gửi báo giá thành công',
          });
          this.sendQuoteViewPdf(this.billTab.data.customerId, res.id);
        }
      },
      (err) => {},
    );
  }

  // Amount getter
  get vatAmount() {
    let billVatRate = this.billTab.data.vat;

    if (billVatRate > 0) {
      let amount = this.originalAmount - this.discountAmount;
      return (amount * billVatRate) / 100;
    }

    return this.billTab.data.products.reduce((sum, product) => {
      let vatAmount = product.billQuantity * product.taxVat;
      return sum + vatAmount;
    }, 0);
  }

  get surchargeAmount() {
    // Surcharge is specify amount
    let surcharge = this.surchargeData?.value || 0;
    if (this.surchargeData && this.surchargeData.type === 'percent') {
      surcharge = (this.originalAmount * this.surchargeData.value) / 100;
    }
    return surcharge;
  }

  get originalAmount() {
    return this.billTab.data.products.reduce((sum: number, product: any) => {
      let priceIncludeDiscount = product.salePrice - this.calculateDiscountPrice(product);
      if (priceIncludeDiscount < 0) {
        priceIncludeDiscount = 0;
      }
      return sum + product.billQuantity * priceIncludeDiscount;
    }, 0);
  }

  calculateOriginalAmount(product: any) {
    let priceIncludeDiscount = product.salePrice - this.calculateDiscountPrice(product);
    if (priceIncludeDiscount < 0) {
      priceIncludeDiscount = 0;
    }
    return product.billQuantity * priceIncludeDiscount;
  }

  get totalQuantity() {
    return this.billTab.data.products.reduce((sum: number, product: any) => {
      return sum + product.billQuantity;
    }, 0);
  }

  get totalAmount() {
    return this.originalAmount + this.vatAmount - this.discountAmount + this.surchargeAmount;
  }

  get discountAmount(): number {
    const { discountType, discountPrice } = this.billTab.data;

    if (discountPrice == 0) {
      return this.billPromotionComponent?.promotionDiscountAmount;
    }

    let discountAmount = 0;
    if (discountType === 'percent') {
      // Discount based on specific percentage
      discountAmount = (this.originalAmount * discountPrice) / 100;
    } else {
      // Discount based on Specific discount amount
      discountAmount = discountPrice ?? 0;
    }
    return discountAmount;
  }

  get isVatDisable() {
    return this.billTab.data.type != this.billTypes.HasBill || this.isPaid;
  }

  onTaxRateChange($event: any) {
    let taxCode = $event.value || '';
    let tax = this.taxes.find((x) => x.code == taxCode);
    this.billTab.data.vat = tax?.percent;
  }

  calculateDiscountPrice(product: any) {
    // Percent discount
    if (product.discountType == DiscountTypeEnum.Percent) {
      return (product.salePrice * product.discountPrice) / 100;
    }
    return product.discountPrice;
  }

  reCalculateProductQuantity(product: any, changeType: string, changeVal: number) {
    let billBox = product.billBox;
    let billNec = product.billNec;

    if (changeType == 'billBox') {
      billBox = changeVal;
    }

    if (changeType == 'billNec') {
      billNec = changeVal;
    }

    product.billQuantity = Math.max(billBox * billNec, 1);
  }

  onSelectPromotionSuccess($event: IBillPromotion[]) {
    this.billPromotions = $event;
  }

  toggleNoteDialog() {
    this.showNoteDialog = !this.showNoteDialog;
  }

  onUpdateAccountant(event: any) {
    this.billTab.data.debitCode = event.debitCode;
    this.billTab.data.debitDetailCodeFirst = event.debitDetailCodeFirst;
    this.updateAccountant.emit({
      tabId: this.billTab.tabId,
      debitCode: event.debitCode,
      debitDetailCodeFirst: event.debitDetailCodeFirst,
    });
  }
}
