import { NgModule } from '@angular/core';
import { SafeHtmlPipe } from '@app/shared/pipes/safe-html.pipe';
import { DoubleInStringPipe } from './double-in-string.pipe';
import { DatePipe } from './date.pipe';
import { SanitizerPipe } from './sanitizer.pipe';
import { TransformPipe } from './transform.pipe';
import { GroupByPipe } from './group-by.pipe';

@NgModule({
  declarations: [DoubleInStringPipe, DatePipe, SanitizerPipe, TransformPipe, GroupByPipe, SafeHtmlPipe],
  providers: [DoubleInStringPipe],
  exports: [DoubleInStringPipe, DatePipe, SanitizerPipe, TransformPipe, GroupByPipe, SafeHtmlPipe],
})
export class PipesModule {}
