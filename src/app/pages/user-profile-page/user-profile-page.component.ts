import {Component, inject} from '@angular/core';
import {HeaderComponent} from '../../common-ui/header/header.component';
import {UserProfileDataBlockComponent} from '../../layout/user-profile-data-block/user-profile-data-block.component';
import {UserProfileMyAfishaBlockComponent} from '../../layout/user-profile-my-afisha-block/user-profile-my-afisha-block.component';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-user-profile-page',
  imports: [
    HeaderComponent,
    UserProfileDataBlockComponent,
    UserProfileMyAfishaBlockComponent,
  ],
  templateUrl: './user-profile-page.component.html',
  styleUrl: './user-profile-page.component.scss'
})
export class UserProfilePageComponent {
  private router = inject(Router);
  private route = inject(ActivatedRoute);



  navigateToMainPage(){
    this.router.navigate(['']);
  }

  initialSection = 'user-profile-my-tickets';
  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params['section'] === 'favorite-events') {
        this.initialSection = 'user-profile-favorite-events';
      }
    });
  }
}
