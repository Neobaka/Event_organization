import { Component } from '@angular/core';
import { ParentComponent } from '../app-parent/parent.component';

@Component({
  selector: 'app-header',
  imports: [ ParentComponent ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {

}
