import {Component, ViewEncapsulation} from '@angular/core';
import { CarouselComponent } from 'ngx-carousel-ease';
import { EventModel } from '../../events_data/event-model';
import { EventService } from '../../events_data/event.service';
import {EventCardComponent} from '../../common-ui/event-card/event-card.component';
import {NgForOf, NgIf} from '@angular/common';

@Component({
  selector: 'app-event-card-block',
  templateUrl: './event-card-block.component.html',
  imports: [
    EventCardComponent,
    NgForOf,
    CarouselComponent,
    NgIf
  ],
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./event-card-block.component.scss']
})
export class EventCardBlockComponent {
  events: EventModel[] = [];

  constructor(private eventService: EventService) {}

  ngOnInit(): void {
    this.eventService.getEvents(0, 20).subscribe(events => {
      this.events = events;
    });
  }

}

