import { Component } from '@angular/core';
import {SvgIconComponent} from '../../helpers/svg-icon/svg-icon.component';
import {NgClass} from '@angular/common';

@Component({
  selector: 'app-event-card',
  imports: [
    SvgIconComponent,
    NgClass
  ],
  templateUrl: './event-card.component.html',
  styleUrl: './event-card.component.scss'
})
export class EventCardComponent {
  isLiked = false;

  toggleLike() {
    this.isLiked = !this.isLiked;
  }
}
