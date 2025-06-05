import { Component } from '@angular/core';
import { ParentComponent } from '../app-parent/parent.component';
import { Router } from '@angular/router';

@Component({
    selector: 'app-header',
    imports: [ ParentComponent ],
    templateUrl: './header.component.html',
    styleUrl: './header.component.scss'
})

export class HeaderComponent {
    constructor(private router: Router) {}

    goToFavoritePlaces(event: MouseEvent) {
        event.preventDefault(); // чтобы не было перехода по href="#"
        this.router.navigate(['/profile'], { queryParams: { section: 'user-profile-favorite-events' } });
    }

    goToMyTickets(event: MouseEvent) {
        event.preventDefault();
        this.router.navigate(['/profile'], { queryParams: { section: 'user-profile-my-tickets' } });
    }
}
