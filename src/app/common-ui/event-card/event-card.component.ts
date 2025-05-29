import {Component, DestroyRef, inject, Input, OnInit} from '@angular/core';
import {SvgIconComponent} from '../../helpers/svg-icon/svg-icon.component';
import {MatIcon} from '@angular/material/icon';
import {DatePipe, NgClass, NgIf} from '@angular/common';
import {EventModel} from '../../events_data/event-model';
import {EnumTranslatorPipe} from '../../events_data/enum-translator.pipe';
import {DomSanitizer, SafeUrl} from '@angular/platform-browser';
import {ImageService} from '../../images_data/image.service';
import {Router} from '@angular/router';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {EventService} from '../../events_data/event.service';
import {Auth2Service} from '../../auth/auth2.service';


@Component({
  selector: 'app-event-card',
  imports: [
    SvgIconComponent,
    MatIcon,
    NgClass,
    DatePipe,
    EnumTranslatorPipe,
    NgIf
  ],
  templateUrl: './event-card.component.html',
  styleUrl: './event-card.component.scss'
})
export class EventCardComponent implements OnInit {
  @Input() event!: EventModel;
  imageUrl?: SafeUrl;
  isLiked = false;

  private imageService = inject(ImageService);
  private sanitizer = inject(DomSanitizer);
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);
  private eventService = inject(EventService);
  private authService = inject(Auth2Service);

  ngOnInit() {
    if (this.event?.fileName) {
      this.imageService.getImage(this.event.fileName)
        .pipe(takeUntilDestroyed(this.destroyRef))
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
    this.authService.userData$.subscribe(user => {
      if (user && user.favoriteEvents) {
        this.isLiked = user.favoriteEvents.includes(this.event.id);
      }
    });
  }

  toggleLike(event: MouseEvent) {
    event.stopPropagation();
    event.preventDefault();
    if (!this.isLiked) {
      this.eventService.addEventToFavorites(this.event.id).subscribe({
        next: () => {
          this.isLiked = true
          this.authService.updateFavoriteEvents(this.event.id, true);
        },
        error: () => { /* обработка ошибки */ }
      });
    } else {
      this.eventService.deleteEventFromFavorites(this.event.id).subscribe({
        next: () => {
          this.isLiked = false
          this.authService.updateFavoriteEvents(this.event.id, false);
        },
        error: () => { /* обработка ошибки */ }
      });
    }
  }

  openEvent() {
    if (this.event) {
      this.router.navigate(['/event', this.event.id]);
    }
  }
}
