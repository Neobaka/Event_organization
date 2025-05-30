import {Component, inject} from '@angular/core';
import {EventCardBlockComponent} from '../../layout/event-card-block/event-card-block.component';
import {HeaderComponent} from '../../common-ui/header/header.component';
import {SearchBarComponent} from '../../common-ui/search-bar/search-bar.component';
import {EventModel} from '../../auth/auth2.service';
import {EventService} from '../../events_data/event.service';
import {FliterByCategoryPipe} from '../../events_data/fliter-by-category.pipe';

@Component({
  selector: 'app-main-page',
  imports: [
    EventCardBlockComponent,
    HeaderComponent,
    SearchBarComponent,
    FliterByCategoryPipe,
  ],
  templateUrl: './main-page.component.html',
  styleUrl: './main-page.component.scss'
})
export class MainPageComponent {
  allEvents: EventModel[] = [];

  private eventService = inject(EventService)

  ngOnInit() {
    this.eventService.getEvents(0, 100).subscribe(events => {
      this.allEvents = events;
    });
  }
}
