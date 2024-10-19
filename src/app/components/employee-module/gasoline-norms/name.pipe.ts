import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'name',
})
export class NamePipe implements PipeTransform {
  transform(id: number, List: any[], key: string): any {
    if (List.length > 0 && id) {
      var name = List.find((x) => x.id == id)[key];
      if (name) return name;
      return '';
    }
    return '';
  }
}
