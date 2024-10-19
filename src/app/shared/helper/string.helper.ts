export class StringHelper {
  static applyThousandSeparator(value: string | number): string {
    if (!value) {
      return '0';
    }
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  static capitalizeFirstLetter(str: string) {
    if (!str) {
      return '';
    }
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
}
