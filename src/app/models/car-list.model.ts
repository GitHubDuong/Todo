export interface CarList {
  id: number;
  licensePlates?: string;
  km: number;
  capacity: number;
  registrationAt?: Date;
  insuranceAt?: Date;
  note?: string;
  fileUrl?: string;
  file?: any;
}
