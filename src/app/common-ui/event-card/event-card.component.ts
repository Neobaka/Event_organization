import {Component, Input} from '@angular/core';
import {SvgIconComponent} from '../../helpers/svg-icon/svg-icon.component';
import {MatIcon} from '@angular/material/icon';
import {DatePipe, NgClass} from '@angular/common';
import {EventModel} from '../../events_data/event-model';
import {EnumTranslatorPipe} from '../../events_data/enum-translator.pipe';


@Component({
  selector: 'app-event-card',
  imports: [
    SvgIconComponent,
    MatIcon,
    NgClass,
    DatePipe,
    EnumTranslatorPipe
  ],
  templateUrl: './event-card.component.html',
  styleUrl: './event-card.component.scss'
})
export class EventCardComponent {
  @Input() event!: EventModel;

  isLiked = false;

  toggleLike(event: MouseEvent) {
    event.stopPropagation();
    event.preventDefault();
    this.isLiked = !this.isLiked;
  }
}
