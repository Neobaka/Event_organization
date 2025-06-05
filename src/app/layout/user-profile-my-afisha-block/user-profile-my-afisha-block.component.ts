import { Component, inject, Input, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { UserProfileMyTicketsComponent } from '../../common-ui/user-profile-my-tickets/user-profile-my-tickets.component';
import {
    UserProfileFavoriteEventsComponent
} from '../../common-ui/user-profile-favorite-events/user-profile-favorite-events.component';
import {
    UserProfileFavoritePlacesComponent
} from '../../common-ui/user-profile-favorite-places/user-profile-favorite-places.component';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,selector: 'app-user-profile-my-afisha-block',
    imports: [
        UserProfileMyTicketsComponent,
        UserProfileFavoriteEventsComponent,
        UserProfileFavoritePlacesComponent,
        FormsModule
    ],
    templateUrl: './user-profile-my-afisha-block.component.html',
    styleUrl: './user-profile-my-afisha-block.component.scss'
})
export class UserProfileMyAfishaBlockComponent implements OnInit {
    public activeComponent = 'user-profile-my-tickets';
    public searchQuery = '';
  @Input() public initialSection = 'user-profile-my-tickets';

  private router = inject(Router);

  public ngOnInit(): void {
      this.activeComponent = this.initialSection;
  }

  /**
   *
   */
  public showUserPageFilterComponent(componentName: string): void {
      this.activeComponent = componentName;
      this.searchQuery = '';
      this.router.navigate([], {
          queryParams: { section: componentName },
          queryParamsHandling: 'merge'
      });
  }

  /**
   *
   */
  public isActive(componentName: string): boolean {
      return this.activeComponent === componentName;
  }
}
