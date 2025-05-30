import {Component, inject} from '@angular/core';
import { HeaderComponent } from '../../common-ui/header/header.component';
import { NgClass } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { EventMapComponent } from './event-map.comonent';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { EventModel } from '../../events_data/event-model';
import {ActivatedRoute, Router} from '@angular/router';
import { EventService } from '../../events_data/event.service';
import { ImageService } from '../../images_data/image.service';
import {combineLatest, Subscription} from 'rxjs';
import {Auth2Service} from '../../auth/auth2.service';

@Component({
  selector: 'app-event-page',
  imports: [HeaderComponent, NgClass, MatIcon, EventMapComponent], // Добавлен NgIf
  templateUrl: './event-page.component.html',
  styleUrl: './event-page.component.scss'
})
export class EventPageComponent {
  isLiked = false;
  event?: EventModel;
  imageUrl?: SafeUrl;
  private imageSub?: Subscription;
  isAdded = false;

  private authService = inject(Auth2Service);
  private route = inject(ActivatedRoute);
  private eventService = inject(EventService);
  private imageService = inject(ImageService);
  private sanitizer = inject(DomSanitizer);
  private router = inject(Router);

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    // Получаем событие и пользователя одновременно
    combineLatest([
      this.eventService.getEventById(id),
      this.authService.userData$
    ]).subscribe(([event, user]) => {
      this.event = event;
      if (event?.fileName) {
        this.imageSub = this.imageService.getImage(event.fileName)
          .subscribe({
            next: (blob) => {
              const objectURL = URL.createObjectURL(blob);
              this.imageUrl = this.sanitizer.bypassSecurityTrustUrl(objectURL);
            },
            error: () => {
              this.imageUrl = undefined;
            }
          });
      }
      this.isAdded = !!(user && user.plannedEvents && event && user.plannedEvents.includes(event.id));
    });
  }

  ngOnDestroy() {
    if (this.imageSub) {
      this.imageSub.unsubscribe();
    }
  }

  toggleLike(event: MouseEvent) {
    event.stopPropagation();
    event.preventDefault();
    this.isLiked = !this.isLiked;
  }

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

    if (!this.isAdded) {
      this.eventService.addEventToPlanned(this.event!.id).subscribe({
        next: () => {
          this.isAdded = true;
          this.authService.updatePlannedEvents(this.event!.id, true);
        },
        error: () => { }
      });
    } else {
      this.eventService.deleteEventFromPlanned(this.event!.id).subscribe({
        next: () => {
          this.isAdded = false;
          this.authService.updatePlannedEvents(this.event!.id, false);
        },
        error: () => { }
      });
    }
  }
}
