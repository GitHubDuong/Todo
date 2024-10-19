import { FormGroup } from "@angular/forms";
import { ColumnDataType } from "./enum";

export class BaseClass {
  loading
  isMobile = screen.width <= 1199
  display: boolean = false
  filterForm!: FormGroup
  paginator = {
    totalRecords: 0,
    currentPage: 0,
    pageSize: 20
  }
  filterParam: any = {
    page: 0,
    pageSize: 20
  }
  dataSource = []
  dataColumns = []
  ColumnDataType = ColumnDataType

  constructor() {
  }
}