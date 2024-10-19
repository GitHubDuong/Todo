export interface PetrolConsumptions {
  id: number;
  date: string | Date;
  userId: number;
  carId: number;
  petroPrice: number;
  kmFrom: number;
  kmTo: number;
  locationFrom?: string;
  locationTo?: string;
  advanceAmount: number;
  note?: string;
  fullName?: string;
  car?: string;
}
