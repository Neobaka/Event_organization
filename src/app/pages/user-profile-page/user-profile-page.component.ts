import { Component, inject, OnInit } from '@angular/core';
import { HeaderComponent } from '../../common-ui/header/header.component';
import { UserProfileDataBlockComponent } from '../../layout/user-profile-data-block/user-profile-data-block.component';
import {
    UserProfileMyAfishaBlockComponent
} from '../../layout/user-profile-my-afisha-block/user-profile-my-afisha-block.component';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
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
    private router = inject(Router);
    private route = inject(ActivatedRoute);

    initialSection = 'user-profile-my-tickets';

    ngOnInit() {
        this.route.queryParams.subscribe(params => {
            const allowedSections = [
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
     *
     */
    navigateToMainPage() {
        this.router.navigate(['']);
    }
}
