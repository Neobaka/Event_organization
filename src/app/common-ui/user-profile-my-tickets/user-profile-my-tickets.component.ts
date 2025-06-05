import {Component, inject, Input, signal, computed, effect} from '@angular/core';
import { RouterLink } from '@angular/router';
import { Auth2Service } from '../../auth/services/auth2.service';
import { EventService } from '../../events_data/event.service';
import { EventCardComponent } from '../event-card/event-card.component';
import { NgForOf, NgIf } from '@angular/common';
import { EventModel } from '../../events_data/event-model';
import {forkJoin} from 'rxjs';

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
export class UserProfileMyTicketsComponent {
    plannedEvents: EventModel[] = [];
  filteredEvents = computed(() => {
    return this.allEvents().filter(e =>
      e.eventName.toLowerCase().includes(this._searchQuery())
    );
  });
  isLoading = signal(true);
  allEvents = signal<EventModel[]>([]);

  private _searchQuery = signal<string>('');
  @Input()
  set searchQuery(value: string) {
    this._searchQuery.set(value?.toLowerCase() ?? '');
  }

  private authService = inject(Auth2Service);
  private eventService = inject(EventService);

  constructor() {
    effect(() => {
      this.isLoading.set(true);
      this.authService.userData$.subscribe(user => {
        if (!user) {
          this.allEvents.set([]);
          this.isLoading.set(false);
          return;
        }
        if (user.plannedEvents && user.plannedEvents.length > 0) {
          forkJoin(user.plannedEvents.map(id =>
            this.eventService.getEventById(id)
          )).subscribe(events => {
            this.allEvents.set(events.filter(e => !!e));
            this.isLoading.set(false);
          });
        } else {
          this.allEvents.set([]);
          this.isLoading.set(false);
        }
      });
    });
  }
}
