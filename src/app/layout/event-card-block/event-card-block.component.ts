import {Component, OnInit} from '@angular/core';
import {EventCardComponent} from '../../common-ui/event-card/event-card.component';
import {ScrollingModule} from '@angular/cdk/scrolling';
import {EventModel} from '../../events_data/event-model';
import {EventService} from '../../events_data/event.service';
import {NgForOf} from '@angular/common';

@Component({
  selector: 'app-event-card-block',
  imports: [
    EventCardComponent,
    ScrollingModule,
    NgForOf
  ],
  templateUrl: './event-card-block.component.html',
  styleUrl: './event-card-block.component.scss'
})
export class EventCardBlockComponent implements OnInit {

  events: EventModel[] = [];

  constructor(private eventService: EventService) {}

  ngOnInit() {
    this.eventService.getEvents().subscribe(events => {
      this.events = events;
    });
  }
}
