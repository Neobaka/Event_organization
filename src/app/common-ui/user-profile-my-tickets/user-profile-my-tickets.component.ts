import { Component, inject, Input, SimpleChanges, OnInit, OnChanges } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Auth2Service } from '../../auth/auth2.service';
import { EventService } from '../../events_data/event.service';
import { EventCardComponent } from '../event-card/event-card.component';
import { NgForOf, NgIf } from '@angular/common';
import { EventModel } from '../../events_data/event-model';

@Component({
    selector: 'app-user-profile-my-tickets',
    imports: [
        RouterLink,
        EventCardComponent,
        NgIf,
        NgForOf
    ],
    templateUrl: './user-profile-my-tickets.component.html',
    styleUrl: './user-profile-my-tickets.component.scss'
})
export class UserProfileMyTicketsComponent implements OnInit, OnChanges {
    plannedEvents: EventModel[] = [];
    filteredEvents: EventModel[] = [];
    isLoading = true;

  @Input() searchQuery = '';

  private authService = inject(Auth2Service);
  private eventService = inject(EventService);

  ngOnInit() {
      this.authService.userData$.subscribe(user => {
          if (user && user.plannedEvents && user.plannedEvents.length > 0) {
              this.isLoading = true;
              Promise.all(
                  user.plannedEvents.map(id =>
                      this.eventService.getEventById(id).toPromise()
                  )
              ).then(events => {
                  this.plannedEvents = events.filter(e => !!e);
                  this.filterEvents();
                  this.isLoading = false;
              });
          } else {
              this.plannedEvents = [];
              this.filterEvents();
              this.isLoading = false;
          }
      });
  }

  ngOnChanges(changes: SimpleChanges) {
      if ('searchQuery' in changes) {
          this.filterEvents();
      }
  }

  /**
   *
   */
  filterEvents() {
      if (!this.searchQuery) {
          this.filteredEvents = this.plannedEvents;
      } else {
          const query = this.searchQuery.trim().toLowerCase();
          this.filteredEvents = this.plannedEvents.filter(e =>
              e.eventName.toLowerCase().includes(query)
          );
      }
  }
}
