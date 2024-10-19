import { ColumnDataType } from '@app/core/enum';
import { TableColumModel } from '@app/models/common/table-colum.model';

export const WAREHOUSE_POSITION_COLUMNS: TableColumModel[] = [
  {
    field: 'id',
    class: 'w-1',
    label: 'label.number_order',
    type: ColumnDataType.order,
  },
  {
    field: 'code',
    class: 'w-2',
    label: 'label.code',
    type: ColumnDataType.text,
  },
  {
    field: 'name',
    class: 'w-3',
    label: 'label.name',
    type: ColumnDataType.text,
  },
  {
    field: 'managerName',
    class: 'w-4',
    label: 'label.note',
    type: ColumnDataType.text,
  },
];
