import { Component } from '@angular/core';
import { HeaderComponent } from '../../common-ui/header/header.component';
import { NgClass } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { EventMapComponent } from '../../pages/event-page/event-map.comonent';

@Component({
  selector: 'app-event-page',
  imports: [HeaderComponent, NgClass, MatIcon, EventMapComponent],
  templateUrl: './event-page.component.html',
  styleUrl: './event-page.component.scss'
})
export class EventPageComponent {
  isLiked = false;

  toggleLike(event: MouseEvent) {
    event.stopPropagation();
    event.preventDefault();
    this.isLiked = !this.isLiked;
  }
}
