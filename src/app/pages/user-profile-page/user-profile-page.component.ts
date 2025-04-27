import { Component } from '@angular/core';
import {HeaderComponent} from '../../common-ui/header/header.component';
import {UserProfileDataBlockComponent} from '../../layout/user-profile-data-block/user-profile-data-block.component';

@Component({
  selector: 'app-user-profile-page',
  imports: [
    HeaderComponent,
    UserProfileDataBlockComponent
  ],
  templateUrl: './user-profile-page.component.html',
  styleUrl: './user-profile-page.component.scss'
})
export class UserProfilePageComponent {

}
