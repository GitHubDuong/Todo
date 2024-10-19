export interface ResponseModel {
  success: boolean;
  messages: string[];
  data: any | any[];
}

export interface PagingDataModel {
  pageIndex: number;
  pageSize: number;
  total: number;
  data: any[];
}

export interface PagingResponseModel {
  success: boolean;
  messages: string[];
  data: PagingDataModel;
}
