import {Component, inject, Input} from '@angular/core';
import {UserProfileMyTicketsComponent} from '../../common-ui/user-profile-my-tickets/user-profile-my-tickets.component';
import {
  UserProfileFavoriteEventsComponent
} from '../../common-ui/user-profile-favorite-events/user-profile-favorite-events.component';
import {
  UserProfileFavoritePlacesComponent
} from '../../common-ui/user-profile-favorite-places/user-profile-favorite-places.component';
import {FormsModule} from '@angular/forms';
import {Router} from '@angular/router';

//это parent
@Component({
  selector: 'app-user-profile-my-afisha-block',
  imports: [
    UserProfileMyTicketsComponent,
    UserProfileFavoriteEventsComponent,
    UserProfileFavoritePlacesComponent,
    FormsModule
  ],
  templateUrl: './user-profile-my-afisha-block.component.html',
  styleUrl: './user-profile-my-afisha-block.component.scss'
})
export class UserProfileMyAfishaBlockComponent {
  activeComponent: string = 'user-profile-my-tickets';
  searchQuery: string = '';
  @Input() initialSection: string = 'user-profile-my-tickets';

  private router = inject(Router);

  ngOnInit() {
    this.activeComponent = this.initialSection;
  }

  showUserPageFilterComponent(componentName: string) {
    this.activeComponent = componentName;
    this.searchQuery = '';
    this.router.navigate([], {
      queryParams: { section: componentName },
      queryParamsHandling: 'merge'
    });
  }

  isActive(componentName: string): boolean {
    return this.activeComponent === componentName;
  }
}
