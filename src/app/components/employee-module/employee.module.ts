import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { MultiSelectModule } from 'primeng/multiselect';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { DirectivesModule } from '../../shared/directives/directives.module';
import { SalaryAdvanceRequestFormComponent } from './salary-advance-request/components/salary-advance-request-form/salary-advance-request-form.component';
import { SalaryAdvanceRequestComponent } from './salary-advance-request/salary-advance-request.component';
import { SalaryHistoryFormComponent } from './salary-history/components/salary-history-form/salary-history-form.component';
import { SalaryHistoryComponent } from './salary-history/salary-history.component';
import { ShiftBulkSettingComponent } from './shift-setting/shift-bulk-setting/shift-bulk-setting.component';

@NgModule({
  declarations: [
    SalaryAdvanceRequestComponent,
    SalaryAdvanceRequestFormComponent,
    SalaryHistoryComponent,
    SalaryHistoryFormComponent,
    ShiftBulkSettingComponent,
  ],
  imports: [
    CommonModule,
    TableModule,
    FormsModule,
    ButtonModule,
    InputTextModule,
    TranslateModule,
    CalendarModule,
    InputNumberModule,
    ReactiveFormsModule,
    DropdownModule,
    DirectivesModule,
    ToastModule,
    InputTextareaModule,
    DialogModule,
    MultiSelectModule,
  ],
  exports: [ShiftBulkSettingComponent],
})
export class EmployeeModule {}
