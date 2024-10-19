import { ColumnDataType } from '@app/core/enum';
import { TableColumModel } from '@app/models/common/table-colum.model';

export const WAREHOUSE_FLOOR_COLUMNS : TableColumModel[] = [
  {
    field: 'id',
    class: 'w-1',
    label: 'label.number_order',
    type: ColumnDataType.order,
  },
  {
    field: 'code',
    class: 'w-1',
    label: 'label.code',
    type: ColumnDataType.text,
  },
  {
    field: 'name',
    class: 'w-2',
    label: 'label.name',
    type: ColumnDataType.text,
  },
  {
    field: 'positions',
    class: 'w-5',
    label: 'label.location',
    type: ColumnDataType.text,
  },
  {
    field: 'note',
    class: 'w-1',
    label: 'label.note',
    type: ColumnDataType.text,
  },
]
