import { ColumnDataType } from '@app/core/enum';
import { TableColumModel } from '@app/models/common/table-colum.model';

export const WAREHOUSE_SHELVES_COLUMNS: TableColumModel[] = [
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
    field: 'orderHorizontal',
    class: 'w-1',
    label: 'label.shortOrderHorizontal',
    type: ColumnDataType.order,
  },
  {
    field: 'orderVertical',
    class: 'w-1',
    label: 'label.shortOrderVertical',
    type: ColumnDataType.order,
  },
  {
    field: 'floors',
    class: 'w-3',
    label: 'label.floors',
    type: ColumnDataType.text,
  },
  {
    field: 'note',
    class: 'w-1',
    label: 'label.note',
    type: ColumnDataType.text,
  },
];
