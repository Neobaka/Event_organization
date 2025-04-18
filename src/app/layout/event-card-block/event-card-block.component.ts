import { Component } from '@angular/core';
import {EventCardComponent} from '../../common-ui/event-card/event-card.component';

@Component({
  selector: 'app-event-card-block',
  imports: [
    EventCardComponent
  ],
  templateUrl: './event-card-block.component.html',
  styleUrl: './event-card-block.component.scss'
})
export class EventCardBlockComponent {

}
