import { Component } from '@angular/core';
import {EventCardComponent} from '../event-card/event-card.component';

@Component({
  selector: 'app-user-profile-planned-events',
  imports: [
    EventCardComponent
  ],
  templateUrl: './user-profile-planned-events.component.html',
  styleUrl: './user-profile-planned-events.component.scss'
})
export class UserProfilePlannedEventsComponent {

}
