import { Component, inject, OnInit, OnDestroy, DestroyRef, ChangeDetectionStrategy } from '@angular/core';
import { HeaderComponent } from '../../common-ui/header/header.component';
import { NgClass } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { EventMapComponent } from './event-map.comonent';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { EventModel } from '../../events_data/event-model';
import { ActivatedRoute, Router } from '@angular/router';
import { EventService } from '../../events_data/event.service';
import { ImageService } from '../../images_data/image.service';
import { combineLatest, Subject, Subscription, take, takeUntil, Observable } from 'rxjs';
import { Auth2Service, UserDetails } from '../../auth/services/auth2.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {UserDetails} from '../../auth/models/user-details';

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'app-event-page',
    imports: [HeaderComponent, NgClass, MatIcon, EventMapComponent],
    templateUrl: './event-page.component.html',
    styleUrl: './event-page.component.scss'
})
export class EventPageComponent implements OnInit, OnDestroy {
    public isLiked = false;
    public event?: EventModel;
    public imageUrl?: SafeUrl;
    public isAdded = false;

    protected readonly destroyRef: DestroyRef = inject(DestroyRef);

    private _imageSub?: Subscription;
    private _destroy$: Subject<void> = new Subject<void>();
    private _authService: Auth2Service = inject(Auth2Service);
    private _route: ActivatedRoute = inject(ActivatedRoute);
    private _eventService: EventService = inject(EventService);
    private _imageService: ImageService = inject(ImageService);
    private _sanitizer: DomSanitizer = inject(DomSanitizer);
    private _router: Router = inject(Router);

    public ngOnInit(): void {
        const id = Number(this._route.snapshot.paramMap.get('id'));

        combineLatest([
            this._eventService.getEventById(id),
            this._authService.userData$
        ]).pipe(takeUntil(this._destroy$))
            .subscribe(([event, user]: [EventModel, UserDetails | null]) => {
                this.event = event;
                this.updateImage({ event });
                this.updateAddedStatus({ user });
            });

        // Реакция на изменения авторизации
        this._authService.isLoggedIn()
            .pipe(takeUntil(this._destroy$))
            .subscribe(() => {
                this._authService.userData$
                    .pipe(take(1))
                    .subscribe((user: UserDetails | null) => this.updateAddedStatus({ user }));
            });
    }

    public ngOnDestroy(): void {
        if (this._imageSub) {
            this._imageSub.unsubscribe();
        }
        this._destroy$.next();
        this._destroy$.complete();
    }


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
    public toggleAdd(event: MouseEvent): void {
        event.stopPropagation();
        event.preventDefault();

        if (!this._authService.isAuth) {
            this._router.navigate([], {
                queryParams: { showLoginModal: 'true' },
                queryParamsHandling: 'merge'
            });

            return;
        }
        const action: Observable<any> = this.isAdded
            ? this._eventService.deleteEventFromPlanned(this.event!.id)
            : this._eventService.addEventToPlanned(this.event!.id);

        action.subscribe({
            next: () => {
                this.isAdded = !this.isAdded;
                this._authService.updatePlannedEvents(this.event!.id, this.isAdded);
            },
            error: (error: any) => {
                console.error('Error updating planned events:', error);
            }
        });
    }

    /**
   *
   */
    private updateImage({ event }: { event: EventModel; }): void {
        if (event?.fileName) {
            this._imageSub = this._imageService.getImage(event.fileName)
                .pipe(
                    takeUntilDestroyed(this.destroyRef)
                )
                .subscribe({
                    next: (blob: Blob) => {
                        const url: string = URL.createObjectURL(blob);
                        this.imageUrl = this._sanitizer.bypassSecurityTrustUrl(url);
                    },
                    error: () => this.imageUrl = undefined
                });
        }
    }

    /**
   *
   */
    private updateAddedStatus({ user }: { user: UserDetails | null; }): void {
        this.isAdded = Boolean(user?.plannedEvents?.includes(this.event?.id || 0));
    }
}
