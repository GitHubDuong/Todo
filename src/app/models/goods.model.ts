export interface Goods {
  id?: number;
  qrCode?: string;
  goodsCode?: string;
  goodsName?: string;
  menuType?: string;
  priceList?: string;
  menuWeb?: any;
  goodsType?: string;
  salePrice?: number;
  price?: number;
  discountPrice?: number;
  inventory?: number;
  position?: string;
  delivery?: string;
  minStockLevel?: number;
  maxStockLevel?: number;
  status?: number;
  account?: string;
  accountName?: string;
  warehouse?: string;
  warehouseName?: string;
  detail1?: string;
  detailName1?: string;
  detail2?: string;
  detailName2?: string;
  image1?: string;
  image2?: string;
  image3?: string;
  image4?: string;
  image5?: string;
  isDeleted?: boolean;
  webGoodNameVietNam?: string;
  webPriceVietNam?: number;
  webDiscountVietNam?: number;
  titleVietNam?: string;
  contentVietNam?: string;
  webGoodNameKorea?: string;
  webPriceKorea?: number;
  webDiscountKorea?: number;
  titleKorea?: string;
  contentKorea?: string;
  webGoodNameEnglish?: string;
  webPriceEnglish?: number;
  webDiscountEnglish?: number;
  titleEnglish?: string;
  contentEnglish?: string;
  taxVat?: number;
  isPromotion?: boolean;
  qrCodes?: string[];
  openingStockQuantityNb?: number;
}