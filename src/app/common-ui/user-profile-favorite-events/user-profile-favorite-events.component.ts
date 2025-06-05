import { Component, inject, Input, input, InputSignal } from '@angular/core';
import { EventCardComponent } from '../event-card/event-card.component';
import { Auth2Service } from '../../auth/services/auth2.service';
import { EventService } from '../../events_data/event.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { EventModel } from '../../events_data/event-model';
import {
    BehaviorSubject,
    combineLatest,
    filter,
    forkJoin,
    map,
    Observable,
    of,
    startWith,
    switchMap
} from 'rxjs';
import { toObservable } from '@angular/core/rxjs-interop';
import {UserDetails} from '../../auth/models/user-details';

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

    protected readonly favoriteEvents$: Observable<EventModel[]>;
    protected readonly refreshSubj$: BehaviorSubject<void> = new BehaviorSubject<void>(void 0);

    /**
     *
     */
    @Input()
    public set alternative(value: string): void {
        this.searchQuery$.next(value);
    }

    public searchQuery: InputSignal<string | undefined> = input<string>();

    filteredEvents: EventModel[] = [];
    isLoading = true;

    private authService = inject(Auth2Service);
    private eventService = inject(EventService);

    constructor() {
        this.favoriteEvents$ = combineLatest([
            toObservable(this.searchQuery).pipe(startWith('')),
            this.refreshSubj$,
        ])
            .pipe(
                switchMap(([searchQuery, refresh]: [string | undefined, void]) => {
                    return combineLatest([
                        of(searchQuery || ''),
                        this.authService.userData$.pipe(filter((user: UserDetails | null) => !!user))
                    ]);
                }),
                switchMap(([searchQuery, user]: [string, UserDetails]) => {
                    return forkJoin([searchQuery, forkJoin(
                        user.favoriteEvents.map((id: number) => this.eventService.getEventById(id))
                    )]);
                }),
                map(([searchQuery, events]: [string, EventModel[]]) => {
                    if (!searchQuery) {
                        return events;
                    }

                    return events.filter((e: EventModel) =>
                        e.eventName.toLowerCase().includes(searchQuery)
                    );
                })
            );
    }

    /**
     *
     */
    protected updateList(): void {
        this.refreshSubj$.next();
    }
}
