import { ColumnDataType } from '@app/core/enum';

export const WORKER_SALARY_COLUMNS = [
  {
    field: 'createdAt',
    class: 'w-2',
    label: 'Ngày tạo',
    type: ColumnDataType.date,
  },
  {
    field: 'produceProductCode',
    class: 'w-3',
    label: 'Mã lệnh sản xuất',
    type: ColumnDataType.text,
  },
  {
    field: 'salaryType',
    class: 'w-2',
    label: 'Loại lương khoán',
    type: ColumnDataType.text,
  },
  {
    field: 'quantity',
    class: 'w-2',
    label: 'Số lượng',
    type: ColumnDataType.number,
  },
  {
    field: 'users',
    class: 'w-3',
    label: 'Nhân viên',
    type: ColumnDataType.text,
  },
  {
    field: 'note',
    class: 'w-3',
    label: 'Ghi chú',
    type: ColumnDataType.text,
  },
];
