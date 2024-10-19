import { NgModule } from '@angular/core';
import { AutofocusDirective } from './autofocus.directive';
import { IsTemplateDirective } from './is-template.directive';
import { UpperCaseInputDirective } from './uppercase-input.directive';
import { HasAccessDirective } from './has-access.directive';
import { HotkeyDirective } from './hotkey.directive';

@NgModule({
  declarations: [
    IsTemplateDirective,
    AutofocusDirective,
    UpperCaseInputDirective,
    HasAccessDirective,
    HotkeyDirective,
  ],
  providers: [
    IsTemplateDirective,
    AutofocusDirective,
    UpperCaseInputDirective,
    HasAccessDirective,
  ],
  exports: [
    IsTemplateDirective,
    AutofocusDirective,
    UpperCaseInputDirective,
    HasAccessDirective,
    HotkeyDirective,
  ],
})
export class DirectivesModule {}
