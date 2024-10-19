import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  AddEditAccountDetailsComponent
} from 'src/app/components/accounting-module/account-v2/dialogs/add-edit-account-details/add-edit-account-details.component';
import { DialogModule } from 'primeng/dialog';
import { TranslateModule } from '@ngx-translate/core';
import { InputNumberModule } from 'primeng/inputnumber';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { IsDropdownComponent } from '../controls/is-dropdown/is-dropdown.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IsInputComponent } from '../controls/is-input/is-input.component';
import { InputTextModule } from 'primeng/inputtext';
import { TitleCaseInputDirective } from '../directives/titlecase-input.directive';
import { DirectivesModule } from '../directives/directives.module';
import { TooltipModule } from 'primeng/tooltip';
import { PipesModule } from '@app/shared/pipes/pipes.module';
import { FilePreviewComponent } from '@app/shared/components/file-preview/file-preview.component';

const COMPONENTS = [
  AddEditAccountDetailsComponent,
  IsDropdownComponent,
  IsInputComponent,
  FilePreviewComponent
];
const MODULES = [
  CommonModule,
  DialogModule,
  TranslateModule,
  InputNumberModule,
  DropdownModule,
  InputTextModule,
  ButtonModule,
  CheckboxModule,
  FormsModule,
  ReactiveFormsModule,
  DirectivesModule,
  TooltipModule,
  PipesModule
];
const STANDALONE = [
  TitleCaseInputDirective
];

@NgModule({
  imports: [
    ...STANDALONE,
    ...MODULES
  ],
  declarations: [
    ...COMPONENTS
  ],
  exports: [
    ...COMPONENTS,
    ...MODULES
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SharedModule {}
