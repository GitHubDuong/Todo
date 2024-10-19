export interface Company {
  id: number;
  name: string;
  address: string;
  phone: string;
  mst: string;
  email: string;
  fax: string;
  websiteName: string;
  nameOfCeo: string;
  noteOfCeo: string;
  nameOfChiefAccountant: string;
  noteOfChiefAccountant: string;
  nameOfTreasurer: string;
  nameOfStorekeeper: string;
  nameOfChiefSupplier: string;
  noteOfChiefSupplier: string;
  assignPerson: string;
  charterCapital: number;
  fileOfBusinessRegistrationCertificate: string;
  signDate: string;
  fileLogo: string;
  businessType: number;
  accordingAccountingRegime: number;
  methodCalcExportPrice: number;
  userUpdated: number;
  updateAt: string;
  note: string;
  Quantity: number;
  unitCost: number;
  money: number;
  currency: number;
  dayType: string;
  decimalUnit: string;
  decimalRate: string;
  thousandUnit: string;
  signDateUnix: number;
  isShowBarCode: boolean;
}