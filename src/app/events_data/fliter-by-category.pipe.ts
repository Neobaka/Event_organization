import { Pipe, PipeTransform } from '@angular/core';
import { EventModel } from './event-model';

@Pipe({
    name: 'fliterByCategory'
})
export class FliterByCategoryPipe implements PipeTransform {

    /**
     *
     */
    transform(events: EventModel[], category: string): EventModel[] {
        if (!events) {return [];}

        return events.filter(e => e.category === category);
    }

}
