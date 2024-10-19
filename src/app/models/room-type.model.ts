export interface RoomType {
  id?: number;
  goodNameVn?: string;
  goodNameEn?: string;
  goodNameKo?: string;
  roomTypeRoomConfigureId?: number;
  quantity?: number;
  lengthRoom?: number;
  widthRoom?: number;
  adultQuantity?: number;
  childrenQuantity?: number;
  isExtraBed?: boolean;
  bedTypeRoomConfigureId?: number;
  roomConfigureTypes?: any[];
  description?: string;
  roomBeds?: any[];
}

export interface TypeRoom {
  id?: number;
  code?: string;
  nameVn?: string;
  nameEn?: string;
  nameKo?: string;
}
export interface TypeExtraBed {
  id?: number;
  code?: string;
  nameVn?: string;
  nameEn?: string;
  nameKo?: string;
}