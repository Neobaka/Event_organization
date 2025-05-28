import {Component, Input} from '@angular/core';
import {UserProfileMyTicketsComponent} from '../../common-ui/user-profile-my-tickets/user-profile-my-tickets.component';
import {
  UserProfilePlannedEventsComponent
} from '../../common-ui/user-profile-planned-events/user-profile-planned-events.component';
import {
  UserProfileFavoritePlacesComponent
} from '../../common-ui/user-profile-favorite-places/user-profile-favorite-places.component';

//это parent
@Component({
  selector: 'app-user-profile-my-afisha-block',
  imports: [
    UserProfileMyTicketsComponent,
    UserProfilePlannedEventsComponent,
    UserProfileFavoritePlacesComponent
  ],
  templateUrl: './user-profile-my-afisha-block.component.html',
  styleUrl: './user-profile-my-afisha-block.component.scss'
})
export class UserProfileMyAfishaBlockComponent {
  activeComponent: string = 'user-profile-my-tickets';
  @Input() initialSection: string = 'user-profile-my-tickets';

  ngOnInit() {
    this.activeComponent = this.initialSection;
  }

  showUserPageFilterComponent(componentName: string) {
    this.activeComponent = componentName;
  }

  isActive(componentName: string) : boolean {
    return this.activeComponent === componentName;
  }
}
