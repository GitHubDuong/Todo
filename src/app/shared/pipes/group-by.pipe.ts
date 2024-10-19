import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'groupBy'
})
export class GroupByPipe implements PipeTransform {
  transform(collection: any[], properties: string[], setIndex = false): any {
    if (!collection || !properties || properties.length === 0) {
      return null;
    }

    collection.forEach((item: any, index: number) => item.originIndex = index);

    const groupedCollection = collection.reduce((previous, current) => {
      const groupKey = properties.map(prop => current[prop]).join('-');

      if (!previous[groupKey]) {
        previous[groupKey] = [current];
      } else {
        previous[groupKey].push(current);
      }
      return previous;
    }, {});

    let index = 0;
    return Object.keys(groupedCollection).map(key => {
      const keyParts = key.split('-');

      groupedCollection[key].forEach((item: any) => item.index = index++);

      const group = { key: {}, value: groupedCollection[key] };
      properties.forEach((prop, index) => {
        group.key[prop] = keyParts[index];
      });
      console.log(group);
      return group;
    });
  }
}
