import { Component } from '@angular/core';
import { HeaderComponent } from '../../common-ui/header/header.component';
import { NgClass, NgIf } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { EventMapComponent } from './event-map.comonent';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { EventModel } from '../../events_data/event-model';
import { ActivatedRoute } from '@angular/router';
import { EventService } from '../../events_data/event.service';
import { ImageService } from '../../images_data/image.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-event-page',
  imports: [HeaderComponent, NgClass, NgIf, MatIcon, EventMapComponent], // Добавлен NgIf
  templateUrl: './event-page.component.html',
  styleUrl: './event-page.component.scss'
})
export class EventPageComponent {
  isLiked = false;
  event?: EventModel;
  imageUrl?: SafeUrl;
  private imageSub?: Subscription;

  constructor(
    private route: ActivatedRoute,
    private eventService: EventService,
    private imageService: ImageService,
    private sanitizer: DomSanitizer,
  ) { }

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.eventService.getEventById(id).subscribe(event => {
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
}
