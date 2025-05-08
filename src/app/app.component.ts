import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {HeaderComponent} from './common-ui/header/header.component';
import {SearchBarComponent} from './common-ui/search-bar/search-bar.component';
import { EventCardBlockComponent } from './layout/event-card-block/event-card-block.component';
import { EventPageComponent } from './pages/event-page/event-page.component';
import { RegistrationModalComponent } from './common-ui/registration-modal/registration-modal.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ParentComponent } from './common-ui/app-parent/parent.component';
import { CreateEventPageComponent } from './pages/create-event-page/create-event-page.component';
import { LoginModalComponent } from './common-ui/login-modal/login-modal.component';




@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent, SearchBarComponent, EventCardBlockComponent, LoginModalComponent, ParentComponent, RegistrationModalComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'Event_organization';

  isModalOpen = false;

  openModal() {
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }
}


