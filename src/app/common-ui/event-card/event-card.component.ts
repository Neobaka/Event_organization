import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {SvgIconComponent} from '../../helpers/svg-icon/svg-icon.component';
import {MatIcon} from '@angular/material/icon';
import {DatePipe, NgClass, NgIf} from '@angular/common';
import {EventModel} from '../../events_data/event-model';
import {EnumTranslatorPipe} from '../../events_data/enum-translator.pipe';
import {DomSanitizer, SafeUrl} from '@angular/platform-browser';
import {Subscription} from 'rxjs';
import {ImageService} from '../../images_data/image.service';
import {Router} from '@angular/router';


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
export class EventCardComponent implements OnInit, OnDestroy {
  @Input() event!: EventModel;
  imageUrl?: SafeUrl;
  private imageSub?: Subscription;

  isLiked = false;

  constructor(
    private imageService: ImageService,
    private sanitizer: DomSanitizer,
    private router: Router,
  ) {}

  ngOnInit() {
    if (this.event?.fileName) {
      this.imageSub = this.imageService.getImage(this.event.fileName)
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

  openEvent() {
    if (this.event) {
      this.router.navigate(['/event', this.event.id]);
    }
  }
}
