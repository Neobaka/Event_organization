import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {HeaderComponent} from './common-ui/header/header.component';
import {SearchBarComponent} from './common-ui/search-bar/search-bar.component';
import {EventCardBlockComponent} from './layout/event-card-block/event-card-block.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent, SearchBarComponent, EventCardBlockComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'Event_organization';
}
