import { Routes } from '@angular/router';
import {UserProfilePageComponent} from './pages/user-profile-page/user-profile-page.component';
import {MainPageComponent} from './pages/main-page/main-page.component';
import {EventPageComponent} from './pages/event-page/event-page.component';

export const routes: Routes = [
  {path: `profile`, component: UserProfilePageComponent},
  {path: ``, component: MainPageComponent},
  {path: `event`, component: EventPageComponent},
]
