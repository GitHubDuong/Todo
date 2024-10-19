import * as moment from 'moment';

export class DateTimeHelper {
  static DATE_TIME_FORMAT = 'DD/MM/yyyy HH:mm';
  static DATE_FORMAT = 'DD/MM/yyyy';
  static DATA_FORMAT_I = 'yyyy-MM-DD';

  static formatDateTime(value: string | Date): string {
    if (!value) {
      return '';
    }
    return moment(value).format(this.DATE_TIME_FORMAT);
  }

  static formatDate(value: string | Date): string {
    if (!value) {
      return '';
    }
    return moment(value).format(this.DATE_FORMAT);
  }

  static formatDateI(value: string | Date): string {
    if (!value) {
      return '';
    }
    return moment(value).format(this.DATA_FORMAT_I);
  }

  static isSameDate(date1: Date, date2: Date): boolean {
    console.log(date1, date2);
    return moment(date1).isSame(date2, 'day');
  }

  static firstDayOfCurrentMonth() {
    const date = new Date();
    return new Date(date.getFullYear(), date.getMonth(), 1);
  }

  static toIOSString(date: Date) {
    let tzOffset = new Date().getTimezoneOffset() * 60000; //offset in milliseconds
    let localISOTime = new Date(date.getTime() - tzOffset).toISOString();
    return localISOTime;
  }
}
