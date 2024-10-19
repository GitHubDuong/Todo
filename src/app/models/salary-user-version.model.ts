export interface SalaryUserVersionModel {
  id: number;
  code: string;
  userId: string;
  userFullName: string;
  contractTypeName: string;
  contractTypeId: number;
  salaryFrom: number;
  salaryTo: number;
  socialInsuranceSalary: number;
  date: Date
  effectiveFrom: Date
  effectiveTo?: Date
  note: string;
  percent: number;

}