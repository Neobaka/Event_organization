import { Component } from '@angular/core';
import {SvgIconComponent} from '../../helpers/svg-icon/svg-icon.component';
import {MatIcon} from '@angular/material/icon';
import {NgClass} from '@angular/common';


@Component({
  selector: 'app-event-card',
  imports: [
    SvgIconComponent,
    MatIcon,
    NgClass
  ],
  templateUrl: './event-card.component.html',
  styleUrl: './event-card.component.scss'
})
export class EventCardComponent {
  isLiked = false;

  toggleLike(event: MouseEvent) {
    event.stopPropagation();
    event.preventDefault();
    this.isLiked = !this.isLiked;
  }
}
