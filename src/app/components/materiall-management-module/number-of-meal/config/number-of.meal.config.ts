export enum UserType {
  staff = 1,
  customer = 2,
}

export const UserTypeOpts = [
  {
    label: 'Nhân viên',
    value: UserType.staff,
  },
  {
    label: 'Khách hàng',
    value: UserType.customer,
  },
];

export const MealOptions = [
  { label: 'Ăn sáng', value: 'morning' },
  { label: 'Ăn trưa', value: 'lunch' },
  { label: 'Ăn chiều', value: 'afternoon' },
  { label: 'Ăn tối', value: 'dinner' },
];

export const MealSummaryList = [
  {
    icon: 'pi-dollar',
    header: 'Suất ăn sáng',
    color: 'text-green-500',
    bgColor: 'text-green-100',
    type: 'morning',
    num: 0,
  },
  {
    icon: 'pi-book',
    header: 'Suất ăn trưa',
    color: 'text-yellow-500',
    bgColor: 'text-yellow-100',
    type: 'lunch',
    num: 0,
  },
  {
    icon: 'pi-bullseye',
    header: 'Suất ăn chiều',
    color: 'text-cyan-500',
    bgColor: 'text-cyan-100',
    type: 'afternoon',
    num: 0,
  },
  {
    icon: 'pi-compass',
    header: 'Suất ăn tối',
    color: 'text-indigo-500',
    bgColor: 'text-indigo-100',
    type: 'dinner',
    num: 0,
  },
];
