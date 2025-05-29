import {Component, inject} from '@angular/core';
import {EventCardComponent} from '../event-card/event-card.component';
import {Auth2Service, EventModel} from '../../auth/auth2.service';
import {EventService} from '../../events_data/event.service';
import {NgForOf, NgIf} from '@angular/common';

@Component({
  selector: 'app-user-profile-favorite-events',
  imports: [
    EventCardComponent,
    NgIf,
    NgForOf
  ],
  templateUrl: './user-profile-planned-events.component.html',
  styleUrl: './user-profile-planned-events.component.scss'
})
export class UserProfilePlannedEventsComponent {
  favoriteEvents: EventModel[] = [];
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
          this.isLoading = false;
        });
      } else {
        this.favoriteEvents = [];
        this.isLoading = false;
      }
    });
  }
}
