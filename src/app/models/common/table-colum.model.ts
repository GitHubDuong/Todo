import { ColumnDataType } from '@app/core/enum';

export interface TableColumModel {
  field: string;
  label: string;
  type: ColumnDataType;
  class?: string;
  style?: string;
  width?: string;
  template?: any;
}
