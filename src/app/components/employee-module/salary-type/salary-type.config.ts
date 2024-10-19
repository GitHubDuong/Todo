import { ColumnDataType } from '@app/core/enum';

export const SALARY_TYPE_COLUMNS = [
  {
    field: 'name',
    class: 'w-2',
    label: 'Tên',
    type: ColumnDataType.text,
  },
  {
    field: 'code',
    class: 'w-1',
    label: 'Mã',
    type: ColumnDataType.text,
  },
  {
    field: 'amountSpent',
    class: 'w-2',
    label: 'Số tiền chi',
    type: ColumnDataType.number,
  },
  {
    field: 'amountSpentMonthly',
    class: 'w-2',
    label: 'Số tiền chi hàng tháng',
    type: ColumnDataType.number,
  },
  {
    field: 'amountAtTheEndYear',
    class: 'w-2',
    label: 'Số tiền giữ lại',
    type: ColumnDataType.number,
  },
  {
    field: 'note',
    class: 'w-1',
    label: 'Ghi chú',
    type: ColumnDataType.text,
  },
];
