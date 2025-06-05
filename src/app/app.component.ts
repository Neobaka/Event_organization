import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { HeaderComponent } from './common-ui/header/header.component';
import { SearchBarComponent } from './common-ui/search-bar/search-bar.component';
import { EventCardBlockComponent } from './layout/event-card-block/event-card-block.component';
import { EventPageComponent } from './pages/event-page/event-page.component';
import { RegistrationModalComponent } from './common-ui/registration-modal/registration-modal.component';
import { ParentComponent } from './common-ui/app-parent/parent.component';
import { LoginModalComponent } from './common-ui/login-modal/login-modal.component';
import { Auth2Service } from './auth/services/auth2.service';




@Component({
    selector: 'app-root',
    imports: [RouterOutlet, HeaderComponent, SearchBarComponent, EventCardBlockComponent, LoginModalComponent, ParentComponent, RegistrationModalComponent, EventPageComponent],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss',
    template: '<router-outlet></router-outlet>'
})
export class AppComponent implements OnInit {
    constructor(private auth: Auth2Service, private router: Router) {}
    title = 'Event_organization';

    ngOnInit() {
        const token = this.auth.getAccessToken();
        if (this.auth.isTokenExpired(token)) {
            this.auth.logout(); // logout уже делает navigate(['/'])
        }
    }

    isModalOpen = false;

    /**
     *
     */
    openModal() {
        this.isModalOpen = true;
    }

    /**
     *
     */
    closeModal() {
        this.isModalOpen = false;
    }
}


