import { Component, inject, OnInit, OnDestroy, DestroyRef } from '@angular/core';
import { HeaderComponent } from '../../common-ui/header/header.component';
import { NgClass } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { EventMapComponent } from './event-map.comonent';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { EventModel } from '../../events_data/event-model';
import { ActivatedRoute, Router } from '@angular/router';
import { EventService } from '../../events_data/event.service';
import { ImageService } from '../../images_data/image.service';
import { combineLatest, Subject, Subscription, take, takeUntil } from 'rxjs';
import { Auth2Service, UserDetails } from '../../auth/services/auth2.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
    selector: 'app-event-page',
    imports: [HeaderComponent, NgClass, MatIcon, EventMapComponent], // Добавлен NgIf
    templateUrl: './event-page.component.html',
    styleUrl: './event-page.component.scss'
})
export class EventPageComponent implements OnInit, OnDestroy {


    isLiked = false;
    event?: EventModel;
    imageUrl?: SafeUrl;
    private imageSub?: Subscription;
    private destroy$ = new Subject<void>();
    isAdded = false;

    private authService = inject(Auth2Service);
    private route = inject(ActivatedRoute);
    private eventService = inject(EventService);
    private imageService = inject(ImageService);
    private sanitizer = inject(DomSanitizer);
    private router = inject(Router);
    protected readonly destroyRef: DestroyRef = inject(DestroyRef);

    ngOnInit() {
        const id = Number(this.route.snapshot.paramMap.get('id'));

        combineLatest([
            this.eventService.getEventById(id),
            this.authService.userData$
        ]).pipe(takeUntil(this.destroy$))
            .subscribe(([event, user]) => {
                this.event = event;
                this.updateImage(event);
                this.updateAddedStatus(user);
            });

        // Реакция на изменения авторизации
        this.authService.isLoggedIn()
            .pipe(takeUntil(this.destroy$))
            .subscribe(() => {
                this.authService.userData$
                    .pipe(take(1))
                    .subscribe(user => this.updateAddedStatus(user));
            });
    }

    /**
     *
     */
    private updateImage(event: EventModel) {
        if (event?.fileName) {
            this.imageSub = this.imageService.getImage(event.fileName)
                .pipe(
                    takeUntilDestroyed(this.destroyRef)
                )
                .subscribe({
                    next: (blob) => {
                        const url = URL.createObjectURL(blob);
                        this.imageUrl = this.sanitizer.bypassSecurityTrustUrl(url);
                    },
                    error: () => this.imageUrl = undefined
                });
        }
    }

    /**
     *
     */
    private updateAddedStatus(user: UserDetails | null) {
        this.isAdded = !!user?.plannedEvents?.includes(this.event?.id!);
    }

    ngOnDestroy() {
        if (this.imageSub) {
            this.imageSub.unsubscribe();
        }
        this.destroy$.next();
        this.destroy$.complete();
    }

    /**
     *
     */
    toggleLike(event: MouseEvent) {
        event.stopPropagation();
        event.preventDefault();
        this.isLiked = !this.isLiked;
    }

    /**
     *
     */
    toggleAdd(event: MouseEvent) {
        event.stopPropagation();
        event.preventDefault();

        if (!this.authService.isAuth) {
            this.router.navigate([], {
                queryParams: { showLoginModal: 'true' },
                queryParamsHandling: 'merge'
            });

            return;
        }
        const action = this.isAdded
            ? this.eventService.deleteEventFromPlanned(this.event!.id)
            : this.eventService.addEventToPlanned(this.event!.id);

        action.subscribe({
            next: () => {
                this.isAdded = !this.isAdded;
                this.authService.updatePlannedEvents(this.event!.id, this.isAdded);
            },
            error: () => {}
        });
    }
}
