import { ColumnDataType } from '@app/core/enum';
import { TableColumModel } from '@app/models/common/table-colum.model';

export const JOB_TITLE_DETAILS_COLUMNS: TableColumModel[] = [
  {
    field: 'id',
    class: 'w-1',
    label: 'label.number_order',
    type: ColumnDataType.order,
  },
  {
    field: 'positionName',
    class: 'w-4',
    label: 'label.position',
    type: ColumnDataType.text,
  },
  {
    field: 'name',
    class: 'w-3',
    label: 'label.name',
    type: ColumnDataType.text,
  },
  {
    field: 'levelManager',
    class: 'w-2',
    label: 'label.level_manager',
    type: ColumnDataType.text,
  },
]