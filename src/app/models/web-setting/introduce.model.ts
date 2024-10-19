import { LanguageType } from '../../utilities/app-enum';

export enum IntroduceType {
  Post = 1, // Bài viết
  Leader = 2, // Lãnh đạo
  PaymentType = 3, // Phương thức thanh toán
  Warranty = 4, // Bảo hành
  Return = 5, // Đổi trả
  Support = 6, // Trung tâm hỗ trợ
  Transport = 7, // Vận chuyển
  Policy = 8, // Chính sách
  Payment = 9, // Phương thức thanh toán
  MoneyBack = 10, // Đảm bảo lại tiền
  ProductBack = 11, // Trả lại sản phẩm
  Terms = 12, // Chính sách và điều khoản
}

export interface IntroduceModel {
  id?: number;
  title?: string;
  summary?: string;
  name?: string;
  type?: LanguageType;
  typeName?: string;
  content?: string;
  iframeYoutube?: string;
  introduceTypeId?: IntroduceType;
  introduceTypeName?: string;
}
