import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment/moment';

@Pipe({ name: 'utcDate' })
export class DatePipe implements PipeTransform {
  transform(value: string | undefined | null, format = 'DD/MM/YYYY') {
    return value ? moment.utc(value).local().format(format) : '';
  }
}
