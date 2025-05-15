import { Pipe, PipeTransform } from '@angular/core';
import {GENRE} from './event-genre';
import {CATEGORY} from './event-category';

@Pipe({
  name: 'enumTranslator'
})
export class EnumTranslatorPipe implements PipeTransform {

  transform(value: string, type: 'genre' | 'category'): string {
    if (type === 'genre') {
      return GENRE[value] || 'Неизвестно';
    }
    if (type === 'category') {
      return CATEGORY[value] || 'Неизвестно';
    }
    return value;
  }

}
