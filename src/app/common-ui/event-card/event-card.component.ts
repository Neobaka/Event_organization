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
  }

  toggleLike(event: MouseEvent) {
    event.stopPropagation();
    event.preventDefault();
    this.isLiked = !this.isLiked;
  }

  openEvent() {
    if (this.event) {
      this.router.navigate(['/event', this.event.id]);
    }
  }
}
