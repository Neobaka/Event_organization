import { Component, inject, Input, SimpleChanges, OnInit, OnChanges } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Auth2Service } from '../../auth/services/auth2.service';
import { EventService } from '../../events_data/event.service';
import { EventCardComponent } from '../event-card/event-card.component';
import { NgForOf, NgIf } from '@angular/common';
import { EventModel } from '../../events_data/event-model';
import {forkJoin, of, switchMap, tap} from 'rxjs';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';

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
    this.authService.userData$.pipe(
      tap(() => this.isLoading = true),
      switchMap(user => {
        if (user && user.plannedEvents && user.plannedEvents.length > 0) {
          return forkJoin(user.plannedEvents.map(id =>
            this.eventService.getEventById(id)
          ));
        } else {
          return of([]);
        }
      }),
      takeUntilDestroyed() // <-- автоматическая отписка!
    ).subscribe(events => {
      this.plannedEvents = events.filter(e => !!e);
      this.filterEvents();
      this.isLoading = false;
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
