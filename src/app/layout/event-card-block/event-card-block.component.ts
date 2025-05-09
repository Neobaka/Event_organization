import { Component } from '@angular/core';
import {EventCardComponent} from '../../common-ui/event-card/event-card.component';
import {ScrollingModule} from '@angular/cdk/scrolling';
import { Router } from '@angular/router';

@Component({
  selector: 'app-event-card-block',
  imports: [
    EventCardComponent,
    ScrollingModule
  ],
  templateUrl: './event-card-block.component.html',
  styleUrl: './event-card-block.component.scss'
})
export class EventCardBlockComponent {

}
