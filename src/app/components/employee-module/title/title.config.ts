import { ColumnDataType } from '@app/core/enum';
import { TableColumModel } from '@app/models/common/table-colum.model';

export const TITLE_COLUMNS: TableColumModel[] = [
  {
    field: 'order',
    class: 'w-1',
    label: 'label.numerical_order',
    type: ColumnDataType.order,
  },
  {
    field: 'code',
    class: 'w-4',
    label: 'label.code',
    type: ColumnDataType.text,
  },
  {
    field: 'name',
    class: 'w-5',
    label: 'label.name',
    type: ColumnDataType.text,
  }
]