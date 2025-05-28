import { Component } from '@angular/core';
import {Router, RouterOutlet} from '@angular/router';
import {HeaderComponent} from './common-ui/header/header.component';
import {SearchBarComponent} from './common-ui/search-bar/search-bar.component';
import { EventCardBlockComponent } from './layout/event-card-block/event-card-block.component';
import { EventPageComponent } from './pages/event-page/event-page.component';
import { RegistrationModalComponent } from './common-ui/registration-modal/registration-modal.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ParentComponent } from './common-ui/app-parent/parent.component';
import { CreateEventPageComponent } from './pages/create-event-page/create-event-page.component';
import { LoginModalComponent } from './common-ui/login-modal/login-modal.component';
import { Auth2Service } from './auth/auth2.service';




@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent, SearchBarComponent, EventCardBlockComponent, LoginModalComponent, ParentComponent, RegistrationModalComponent, EventPageComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  template: '<router-outlet></router-outlet>'
})
export class AppComponent {
  constructor(private auth: Auth2Service, private router: Router) {}
  title = 'Event_organization';

  ngOnInit() {
    const token = this.auth.getAccessToken();
    if (this.auth.isTokenExpired(token)) {
      this.auth.logout(); // logout уже делает navigate(['/'])
    }
  }

  isModalOpen = false;

  openModal() {
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }
}


