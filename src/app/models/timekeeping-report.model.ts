export interface TimekeepingReportModel {
  fullName: string;
  code: any;
  userId: number;
  departmentName: string;
  totalWorkingDay: number;
  totalPaidLeave: number;
  totalUnPaidLeave: number;
  totalPaid: number;
  totalWorkingHours: number;
  totalOverTimeWorkingHours: number;
  histories?: WorkHoursModel[]
}

export interface WorkHoursModel {
  date: string;
  workingHours: number;
  overtimeHours: number;
  isDisplaySymbol: boolean;
}