import { Component, inject, DestroyRef, ChangeDetectionStrategy } from '@angular/core';
import { HeaderComponent } from '../../common-ui/header/header.component';
import { AsyncPipe, NgClass, NgIf } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { EventMapComponent } from './event-map.comonent';
import { DomSanitizer } from '@angular/platform-browser';
import { EventModel } from '../../events_data/event-model';
import { ActivatedRoute, Router } from '@angular/router';
import { EventService } from '../../events_data/event.service';
import { ImageService } from '../../images_data/image.service';
import { combineLatest, map, switchMap, catchError, of } from 'rxjs';
import { Auth2Service } from '../../auth/services/auth2.service';

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'app-event-page',
    imports: [HeaderComponent, NgClass, MatIcon, EventMapComponent, AsyncPipe, NgIf],
    templateUrl: './event-page.component.html',
    styleUrl: './event-page.component.scss'
})
export class EventPageComponent {
    public isLiked = false;

    protected readonly destroyRef: DestroyRef = inject(DestroyRef);

    private _authService: Auth2Service = inject(Auth2Service);
    private _route: ActivatedRoute = inject(ActivatedRoute);
    private _eventService: EventService = inject(EventService);
    private _imageService: ImageService = inject(ImageService);
    private _sanitizer: DomSanitizer = inject(DomSanitizer);
    private _router: Router = inject(Router);

    public eventId = Number(this._route.snapshot.paramMap.get('id'));

    public event$ = this._eventService.getEventById(this.eventId);

    public user$ = this._authService.userData$;

    public isAdded$ = combineLatest([this.event$, this.user$]).pipe(
        map(([event, user]) => {
            if (!event) {return false;}
            if (!user) {return false;}

            return (user.plannedEvents || []).map(Number).includes(Number(event.id));
        })
    );


    public imageUrl$ = this.event$.pipe(
        switchMap(event =>
            event?.fileName
                ? this._imageService.getImage(event.fileName).pipe(
                    map(blob => this._sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(blob))),
                    catchError(() => of(undefined))
                )
                : of(undefined)
        )
    );


    /**
   *
   */
    public toggleLike(event: MouseEvent): void {
        event.stopPropagation();
        event.preventDefault();
        this.isLiked = !this.isLiked;
    }


    /**
   *
   */
    toggleAdd(event: EventModel | undefined, isAdded: null | boolean, mouseEvent: MouseEvent): void {
        mouseEvent.stopPropagation();
        mouseEvent.preventDefault();
        if (!event) {return;}

        if (!this._authService.isAuth) {
            this._router.navigate([], {
                queryParams: { showLoginModal: 'true' },
                queryParamsHandling: 'merge'
            });

            return;
        }

        const action$ = isAdded
            ? this._eventService.deleteEventFromPlanned(event.id)
            : this._eventService.addEventToPlanned(event.id);

        action$.subscribe({
            next: () => {
                this._authService.loadUserProfile();
                this._authService.updatePlannedEvents(event.id, !isAdded);
            },
            error: (error: any) => {
                console.error('Error updating planned events:', error);
            }
        });
    }
}
