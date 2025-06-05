import { Component, computed, effect, inject, Input, signal } from '@angular/core';
import { EventCardComponent } from '../event-card/component/event-card.component';
import { Auth2Service } from '../../core/auth/services/auth2.service';
import { EventService } from '../../core/events_data/services/event.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { EventModel } from '../../core/events_data/interfaces/event-model';
import {
    BehaviorSubject,
    forkJoin,
    tap
} from 'rxjs';

@Component({
    selector: 'app-user-profile-favorite-events',
    imports: [
        CommonModule,
        EventCardComponent,
        RouterModule,
    ],
    templateUrl: './user-profile-favorite-events.component.html',
    styleUrl: './user-profile-favorite-events.component.scss'
})
export class UserProfileFavoriteEventsComponent {

    private _searchQuery = signal<string>('');
  /**
   *
   */
  @Input()
    set searchQuery(value: string) {
        this._searchQuery.set(value?.toLowerCase() ?? '');
    }

  private authService = inject(Auth2Service);
  private eventService = inject(EventService);
  private refreshSubj$ = new BehaviorSubject<void>(void 0);

  filteredEvents = computed(() => {
      return this.allEvents().filter(e =>
          e.eventName.toLowerCase().includes(this._searchQuery())
      );
  });

  isLoading = signal(true);
  allEvents = signal<EventModel[]>([]);

  constructor() {
      // Реактивная загрузка данных
      effect(() => {
          this.isLoading.set(true);
          this.authService.userData$.pipe(
              tap(user => {
                  if (!user) {return;}

                  forkJoin(
                      user.favoriteEvents.map(id =>
                          this.eventService.getEventById(id)
                      )
                  ).subscribe(events => {
                      this.allEvents.set(events);
                      this.isLoading.set(false);
                  });
              })
          ).subscribe();
      });

      // Обновление при ручном refresh
      effect(() => {
          this.refreshSubj$.subscribe(() => {
              this.authService.userData$.pipe(
                  tap(user => {
                      if (!user) {return;}
                      this.isLoading.set(true);

                      forkJoin(
                          user.favoriteEvents.map(id =>
                              this.eventService.getEventById(id)
                          )
                      ).subscribe(events => {
                          this.allEvents.set(events);
                          this.isLoading.set(false);
                      });
                  })
              ).subscribe();
          });
      });
  }

  /**
   *
   */
  protected updateList(): void {
      this.refreshSubj$.next();
  }
}
