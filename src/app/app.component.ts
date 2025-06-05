import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { Auth2Service } from './core/auth/services/auth2.service';

@Component({
    selector: 'app-root',
    imports: [RouterOutlet],
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
