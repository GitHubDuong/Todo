import { ColumnDataType } from '@app/core/enum';

export const EndOfTermDetailColumns = [
  {
    field: 'debitCode',
    label: 'TK',
    type: ColumnDataType.text,
    class: 'w--10 cl-blue',
    style: 'color: white !important',
  },
  {
    field: 'debitCodeDetail1',
    label: 'Chi tiết 1',
    type: ColumnDataType.text,
    class: 'w--5 cl-blue',
    style: 'color: white !important',
  },
  {
    field: 'debitCodeDetail2',
    label: 'Chi tiết 2',
    type: ColumnDataType.text,
    class: 'w--5 cl-blue',
    style: 'color: white !important',
  },
  {
    field: 'creditCode',
    label: 'TK Đối ứng',
    type: ColumnDataType.text,
    class: 'w--10 cl-green',
    style: 'color: white !important',
  },
  {
    field: 'creditCodeDetail1',
    label: 'Chi tiết 1',
    type: ColumnDataType.text,
    class: 'w--15 cl-green',
    style: 'color: white !important',
  },
  {
    field: 'creditCodeDetail2',
    label: 'Chi tiết 2',
    type: ColumnDataType.text,
    class: 'w--15 cl-green',
    style: 'color: white !important',
  },
  {
    field: 'amount',
    label: 'Số dư',
    type: ColumnDataType.number,
    class: 'w--10',
  },
  {
    field: 'percentRatio',
    label: '%',
    type: ColumnDataType.number,
    class: 'w--5',
  },
  {
    field: '',
    label: 'Tổng tiền',
    type: ColumnDataType.number,
    class: 'w--10 cl-yellow',
    style: 'color: white !important',
  },
  {
    field: '',
    label: 'Ghi chú',
    type: ColumnDataType.number,
    class: 'w--10',
  },
];
