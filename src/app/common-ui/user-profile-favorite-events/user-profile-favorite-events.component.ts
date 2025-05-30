import {Component, inject, Input, SimpleChanges} from '@angular/core';
import {EventCardComponent} from '../event-card/event-card.component';
import {Auth2Service} from '../../auth/auth2.service';
import {EventService} from '../../events_data/event.service';
import {NgForOf, NgIf} from '@angular/common';
import {RouterLink} from '@angular/router';
import {EventModel} from '../../events_data/event-model';

@Component({
  selector: 'app-user-profile-favorite-events',
  imports: [
    EventCardComponent,
    NgIf,
    NgForOf,
    RouterLink
  ],
  templateUrl: './user-profile-favorite-events.component.html',
  styleUrl: './user-profile-favorite-events.component.scss'
})
export class UserProfileFavoriteEventsComponent {
  favoriteEvents: EventModel[] = [];
  @Input() searchQuery: string = '';
  filteredEvents: EventModel[] = [];
  isLoading = true;

  private authService = inject(Auth2Service);
  private eventService = inject(EventService);

  ngOnInit() {
    this.authService.userData$.subscribe(user => {
      if (user && user.favoriteEvents && user.favoriteEvents.length > 0) {
        this.isLoading = true;
        Promise.all(
          user.favoriteEvents.map(id =>
            this.eventService.getEventById(id).toPromise()
          )
        ).then(events => {
          this.favoriteEvents = events.filter(e => !!e);
          this.filterEvents();
          this.isLoading = false;
        });
      } else {
        this.favoriteEvents = [];
        this.isLoading = false;
        this.filterEvents();
      }
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if ('searchQuery' in changes) {
      this.filterEvents();
    }
  }

  filterEvents() {
    if (!this.searchQuery) {
      this.filteredEvents = this.favoriteEvents;
    } else {
      const query = this.searchQuery.trim().toLowerCase();
      this.filteredEvents = this.favoriteEvents.filter(e =>
        e.eventName.toLowerCase().includes(query)
      );
    }
  }
}
