export interface Stationerie {
  id?: number;
  code?: string;
  name?: string;
  unit?: string;
}

export interface OfficeForm {
  stationeryId?: number;
  quantity?: number;
  unitPrice?: string;
}
