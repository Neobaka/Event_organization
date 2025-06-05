import { NgOptimizedImage } from '@angular/common';
import { Component, inject, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { Auth2Service } from '../../auth/services/auth2.service';
import firebase from 'firebase/compat/app';
import { UserProfileComponent } from '../../layout/user-profile-data-block/user-profile.component';
import { Subscription } from 'rxjs';
import { UserDetails } from '../../auth/models/user-details';


//Поскольку используем compat API, везде, где есть ссылака на User, нужно использовать тип из firebase/compat/app
type User = firebase.User;

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,selector: 'app-user-profile-data-block',
    imports: [
        NgOptimizedImage, UserProfileComponent
    ],
    templateUrl: './user-profile-data-block.component.html',
    styleUrl: './user-profile-data-block.component.scss'
})
export class UserProfileDataBlockComponent implements OnInit, OnDestroy {
    private authService = inject(Auth2Service);

    public userData: UserDetails | null = null;
    private subscription = new Subscription();

    public ngOnInit(): void {
        this.subscription = this.authService.userData$.subscribe({
            next: (data): void => {
                this.userData = data;
            },
            error: (err): void => {
                console.error('Ошибка при получении данных профиля:', err);
            }
        });
    }

    public ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }
}
