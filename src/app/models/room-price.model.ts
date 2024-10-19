export interface RoomPrice {
  roomTypeId?: number;
  prices?: PriceItem[];
}

export interface PriceItem {
  id?: number;
  roomTypeId?: number;
  date?: string;
  price?: number;
  quantity?: number;
}
