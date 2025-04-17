import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {EventCardComponent} from './common-ui/event-card/event-card.component';
import {HeaderComponent} from './common-ui/header/header.component';
import {SearchBarComponent} from './common-ui/search-bar/search-bar.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, EventCardComponent, HeaderComponent, SearchBarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'Event_organization';
}
