import { Component, OnInit, ViewChild } from '@angular/core';
import { Column, ControlType, IAction, } from "@app/models/table/column";
import { ColumnDataType } from "@app/core/enum";
import { GoodsQuotaStepsService } from "@app/service/goods-quota-steps.service";
import {
  GoodQuotaStepFormComponent
} from "@components/sell-module/setup-module/good-quota-step/good-quota-step-form/good-quota-step-form.component";
import { MessageService } from "primeng/api";
import { TranslationService } from "@app/service/translation.service";
import { DataTableComponent } from "@app/shared/components/data-table/data-table.component";

@Component({
  selector: 'app-good-quota-step',
  templateUrl: './good-quota-step.component.html',
  styleUrls: ['./good-quota-step.component.scss']
})
export class GoodQuotaStepComponent implements OnInit  {
  columns: Column[] = [];
  headerActions: IAction[] = []
  @ViewChild("goodQuotaStepFormComponent") goodQuotaStepFormComponent: GoodQuotaStepFormComponent;
  @ViewChild("dataTableComponent") dataTableComponent: DataTableComponent;

  constructor(
    readonly goodsQuotaStepsService:GoodsQuotaStepsService,
    private readonly messageService: MessageService,
    private readonly translationService: TranslationService
  ) {
  }

  ngOnInit(): void {
    // Setup header action
    this.headerActions = [
      {
        label: "button.add",
        actionType: ControlType.Button,
        icon: "pi pi-plus",
        styleClass: "p-button-success",
        command: () => this.goodQuotaStepFormComponent.toggleDisplay()
      }
    ]

    // Setup columns
    this.columns = [
      { field: 'code', header: "label.good_quota_step_code", width: "30%" },
      { field: 'name', header:"label.good_quota_step_name", width: "50%" },
      {
        field: 'action',
        header: '',
        width: "20%",
        columnType: ColumnDataType.action,
        actions: [
          {
            label: 'button.edit',
            icon: "pi pi-pencil",
            actionType: ControlType.Button,
            styleClass: 'p-button-success',
            command: (_: any, rowData: any) => this.goodQuotaStepFormComponent.edit(rowData.id)
          },
          {
            label: 'button.delete',
            icon: "pi pi-trash" ,
            actionType: ControlType.Button,
            styleClass: 'p-button-danger',
            command: (_: any, rowData: any) => this.onDelete(rowData.id)
          },
        ] },
    ];
  }

  private onDelete(id: number): void {
    this.goodsQuotaStepsService.delete(id).subscribe(res => {
      this.messageService.add({
        severity: 'success',
        detail: this.translationService.translate('success.delete')
      });
    })
  }

  loadData = () => this.goodsQuotaStepsService.getAll(this.dataTableComponent?.filterParams)
}
