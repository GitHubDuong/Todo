import { ColumnDataType } from '@app/core/enum';
import { TableColumModel } from '@app/models/common/table-colum.model';

export const ROLE_COLUMNS: TableColumModel[] = [
  {
    field: 'order',
    class: 'w-1',
    label: 'label.numerical_order',
    type: ColumnDataType.order,
  },
  {
    field: 'code',
    class: 'w-2',
    label: 'label.role_menu_code',
    type: ColumnDataType.text,
  },
  {
    field: 'name',
    class: 'w-2',
    label: 'label.role_menu_name',
    type: ColumnDataType.text,
  },
  {
    field: 'codeParent',
    class: 'w-2',
    label: 'label.role_menu_code_parent',
    type: ColumnDataType.template,
  },
  {
    field: 'roles',
    class: 'w-3',
    label: 'label.role_menu_role_name',
    type: ColumnDataType.text,
  },
];
