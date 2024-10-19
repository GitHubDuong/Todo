import { ColumnDataType } from '@app/core/enum';
import { TableColumModel } from '@app/models/common/table-colum.model';

export const SALE_DISCOUNT_COLUMNS: TableColumModel[] = [
  {
    field: 'positionDetail',
    class: 'w-2',
    label: 'Chức vụ',
    type: ColumnDataType.text,
  },
  {
    field: 'discountReceivedMonth',
    class: 'w-2',
    label: 'Chiết khấu trong tháng',
    type: ColumnDataType.number,
  },
  {
    field: 'discountReceivedYear',
    class: 'w-2',
    label: 'Chiết khấu trong năm',
    type: ColumnDataType.number,
  },
  {
    field: 'percentAdvanceDiscountMonth',
    class: 'w-2',
    label: 'Tỷ lệ trong tháng',
    type: ColumnDataType.number,
  },
  {
    field: 'note',
    class: 'w-2',
    label: 'Ghi chú',
    type: ColumnDataType.text,
  },
];
