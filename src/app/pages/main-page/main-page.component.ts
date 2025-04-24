import { Component } from '@angular/core';
import {EventCardBlockComponent} from '../../layout/event-card-block/event-card-block.component';
import {HeaderComponent} from '../../common-ui/header/header.component';
import {SearchBarComponent} from '../../common-ui/search-bar/search-bar.component';

@Component({
  selector: 'app-main-page',
  imports: [
    EventCardBlockComponent,
    HeaderComponent,
    SearchBarComponent
  ],
  templateUrl: './main-page.component.html',
  styleUrl: './main-page.component.scss'
})
export class MainPageComponent {

}
