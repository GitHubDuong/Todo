import { ColumnDataType } from '@app/core/enum';

export const USER_ROLE_COLUMNS = [
  {
    field: 'code',
    class: 'w-2',
    label: 'label.user_role_code',
    type: ColumnDataType.text,
  },
  {
    field: 'title',
    class: 'w-3',
    label: 'label.user_role_title',
    type: ColumnDataType.text,
  },
  {
    field: 'note',
    class: 'w-4',
    label: 'label.user_role_note',
    type: ColumnDataType.text,
  },
  {
    field: 'order',
    class: 'w-1',
    label: 'label.user_role_order',
    type: ColumnDataType.order,
  },
];
