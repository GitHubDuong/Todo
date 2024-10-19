import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'workingDay',
})
export class WorkingDayPipe implements PipeTransform {
  transform(listKey: any[]): any {
    var days = '';
    for (var i = 0; i < listKey.length; i++) {
      var name = '';
      switch (listKey[i]) {
        case 'monday':
          name = 'Thứ hai';
          break;
        case 'tuesday':
          name = 'Thứ ba';
          break;
        case 'wednesday':
          name = 'Thứ tư';
          break;
        case 'thursday':
          name = 'Thứ năm';
          break;
        case 'friday':
          name = 'Thứ sáu';
          break;
        case 'saturday':
          name = 'Thứ bảy';
          break;
        case 'sunday':
          name = 'Chủ nhật';
          break;
      }
      days += name;
      if (i < listKey.length - 1) {
        days += ', ';
      }
    }

    return days;
  }
}
