import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from "primeng/table";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ConfirmDialogModule } from "primeng/confirmdialog";
import { TranslateModule } from "@ngx-translate/core";
import { DropdownModule } from "primeng/dropdown";
import { ConfirmPopupModule } from "primeng/confirmpopup";
import { MessageModule } from "primeng/message";
import { DynamicDialogModule } from "primeng/dynamicdialog";
import { InputMaskModule } from "primeng/inputmask";
import { InputNumberModule } from "primeng/inputnumber";
import { InputSwitchModule } from "primeng/inputswitch";
import { InputTextModule } from "primeng/inputtext";
import { InputTextareaModule } from "primeng/inputtextarea";
import { DialogModule } from "primeng/dialog";
import { ToastModule } from "primeng/toast";
import { ToggleButtonModule } from "primeng/togglebutton";
import { ToolbarModule } from "primeng/toolbar";
import { TooltipModule } from "primeng/tooltip";
import { ButtonModule } from "primeng/button";
import { VirtualScrollerModule } from "primeng/virtualscroller";
import { RadioButtonModule } from 'primeng/radiobutton';
import { TreeSelectModule } from 'primeng/treeselect';
import { PanelModule } from 'primeng/panel';
import { CheckboxModule } from 'primeng/checkbox';
import { ListboxModule } from 'primeng/listbox';
import { CalendarModule } from "primeng/calendar";
import { EditorModule } from 'primeng/editor';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { DataViewModule } from 'primeng/dataview';
import { SplitButtonModule } from 'primeng/splitbutton';
import { TabViewModule } from 'primeng/tabview';
import { SidebarModule } from 'primeng/sidebar';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { SpeedDialModule } from 'primeng/speeddial';
import { SharedModule } from 'src/app/shared/shared/shared.module';
import { RoomTypesComponent } from './room-types/room-types.component';
import { RoomTypesFormComponent } from './room-types/room-types-form/room-types-form.component';
import { RoomTypesAddFormComponent } from './room-types/room-types-add-form/room-types-add-form.component';
import { RoomConfigTypesComponent } from './room-config-types/room-config-types.component';
import { RoomConfigTypeFormComponent } from './room-config-types/room-config-type-form/room-config-type-form.component';
import { RoomPricesNewComponent } from './room-prices-new/room-prices-new.component';



@NgModule({
    declarations: [
      RoomTypesComponent,
      RoomTypesFormComponent,
      RoomTypesAddFormComponent,
      RoomConfigTypesComponent,
      RoomConfigTypeFormComponent,
      RoomPricesNewComponent
    ],
    imports: [
        RadioButtonModule,
        TranslateModule,
        ConfirmDialogModule,
        ConfirmPopupModule,
        MessageModule,
        DynamicDialogModule,
        DropdownModule,
        InputMaskModule,
        InputNumberModule,
        InputSwitchModule,
        InputTextModule,
        InputTextareaModule,
        DialogModule,
        FormsModule,
        ReactiveFormsModule,
        CommonModule,
        TableModule,
        ToastModule,
        ToggleButtonModule,
        ToolbarModule,
        TooltipModule,
        ButtonModule,
        VirtualScrollerModule,
        PanelModule,
        CheckboxModule,
        ListboxModule,
        CalendarModule,
        EditorModule,
        InputNumberModule,
        AutoCompleteModule,
        SharedModule,
        DataViewModule,
        SplitButtonModule,
        TabViewModule,
        SidebarModule,
        ConfirmDialogModule,
        DialogModule,
        BreadcrumbModule,
        SpeedDialModule



    ]
})
export class HotelModule { }
