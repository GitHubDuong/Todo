import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@app/shared/pipes/date.pipe';
import { ColumnDataType } from '@app/shared/enums';

@Pipe({ name: 'transform' })
export class TransformPipe implements PipeTransform {
  transform(value: string, colType: string): unknown {
    switch (colType) {
      case ColumnDataType.DATE:
        return new DatePipe().transform(value);
      default:
        return value;
    }
  }
}
