export interface SalaryReport {
  username: string | null;
  fullName: string | null;
  bankName: string | null;
  bankAccountNumber: string | null;
  numberOfWorkingDays: number | null;
  salary: number | null;
  contractualSalary: number | null;
  allowanceAmount: number | null;
  deduceMealCost: number | null;
  remainingAmount: number | null;
  saleCommission: number | null;
}