import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sortCategories',
  pure: false
})
export class SortCategoriesPipe implements PipeTransform {
  // sorts categories so that the active is always on top
  transform(value: any): any {
    return JSON.parse(JSON.stringify(value)).sort((a,b) => {
      if (a.active == true){
        return -1;
      } else if (b.active == true){
        return 1;
      }
      else return 0
    });
  }
}
