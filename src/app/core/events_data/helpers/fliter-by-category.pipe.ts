import { Pipe, PipeTransform } from '@angular/core';
import { EventModel } from '../interfaces/event-model';

@Pipe({
    name: 'fliterByCategory'
})
export class FliterByCategoryPipe implements PipeTransform {

    /**
     *
     */
    public transform(events: EventModel[], category: string): EventModel[] {
        if (!events) {return [];}

        return events.filter(e => e.category === category);
    }

}
