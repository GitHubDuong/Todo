import { ColumnDataType } from "@app/core/enum";
import { MENU_ACTION } from "@app/shared/directives/has-access.directive";
import { TabStatus } from "@utilities/app-enum";

export interface Column {
  header: string;
  field?: string;
  fieldChild?: string;
  classHeader?: string;
  classBody?: string;
  slot?: string;
  style?: {
    width?: any;
  };
  width?: any;
  template?: any;
  columnType?: ColumnDataType
  actions?: IAction[]
  isCheckAll?: boolean
}

export interface IAction {
  actionType: ControlType,
  label: string,
  styleClass?: string,
  command?: Function,
  icon?: string,
  hasAccess?: MENU_ACTION,
  visibleCondition?: (rowData: any) => boolean
}

export interface IFilter {
  searchText?: string;
  page: number;
  pageSize: number;
  statusTab: TabStatus,
  fromAt?: Date;
  toAt?: Date;
  userId?: number;
}

export enum ControlType {
  Button,
  Dropdown,
  InputNumber,
  InputText
}


