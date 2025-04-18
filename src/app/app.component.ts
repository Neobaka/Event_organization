import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {EventCardComponent} from './common-ui/event-card/event-card.component';
import { HeaderComponent } from './common-ui/header/header.component';
import { EventPageComponent } from './pages/event-page/event-page.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, EventCardComponent, HeaderComponent, EventPageComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'Event_organization';
}
