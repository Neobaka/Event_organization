import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
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
    template: '<router-outlet></router-outlet>',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit {
    public title = 'Event_organization';
    public isModalOpen = false;

    constructor(private _auth: Auth2Service, private _router: Router) { }

    public ngOnInit(): void {
        const token: string | null = this._auth.getAccessToken();
        if (this._auth.isTokenExpired(token)) {
            this._auth.logout(); // logout уже делает navigate(['/'])
        }
    }

    /**
   * Opens the modal
   */
    public openModal(): void {
        this.isModalOpen = true;
    }

    /**
   * Closes the modal
   */
    public closeModal(): void {
        this.isModalOpen = false;
    }
}
