import { Component, inject, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { HeaderComponent } from '../../common-ui/header/header.component';
import { UserProfileDataBlockComponent } from '../../layout/user-profile-data-block/user-profile-parent/user-profile-data-block.component';
import {
    UserProfileMyAfishaBlockComponent
} from '../../layout/user-profile-my-afisha-block/user-profile-my-afisha-block.component';
import { ActivatedRoute, Router, Params } from '@angular/router';

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'app-user-profile-page',
    imports: [
        HeaderComponent,
        UserProfileDataBlockComponent,
        UserProfileMyAfishaBlockComponent,
    ],
    templateUrl: './user-profile-page.component.html',
    styleUrl: './user-profile-page.component.scss'
})
export class UserProfilePageComponent implements OnInit {
    public initialSection = 'user-profile-my-tickets';

    private _router: Router = inject(Router);
    private _route: ActivatedRoute = inject(ActivatedRoute);

    public ngOnInit(): void {
        this._route.queryParams.subscribe((params: Params) => {
            const allowedSections: string[] = [
                'user-profile-my-tickets',
                'user-profile-favorite-events',
                'user-profile-favorite-places'
            ];
            if (params['section'] && allowedSections.includes(params['section'])) {
                this.initialSection = params['section'];
            } else {
                this.initialSection = 'user-profile-my-tickets';
            }
        });
    }

    /**
   * Navigates to the main page
   */
    public navigateToMainPage(): void {
        this._router.navigate(['']);
    }
}
