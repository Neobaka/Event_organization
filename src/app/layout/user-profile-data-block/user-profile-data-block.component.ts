import { NgOptimizedImage } from '@angular/common';
import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { Auth2Service, UserDetails } from '../../auth/auth2.service';
import firebase from 'firebase/compat/app';
import { UserProfileComponent } from '../../layout/user-profile-data-block/user-profile.component';
import { Subscription } from 'rxjs';


//Поскольку используем compat API, везде, где есть ссылака на User, нужно использовать тип из firebase/compat/app
type User = firebase.User;

@Component({
    selector: 'app-user-profile-data-block',
    imports: [
        NgOptimizedImage, UserProfileComponent
    ],
    templateUrl: './user-profile-data-block.component.html',
    styleUrl: './user-profile-data-block.component.scss'
})
export class UserProfileDataBlockComponent implements OnInit, OnDestroy {
    private authService = inject(Auth2Service);

    userData: UserDetails | null = null;
    private subscription = new Subscription();

    ngOnInit(): void {
        this.subscription = this.authService.userData$.subscribe({
            next: (data) => {
                this.userData = data;
            },
            error: (err) => {
                console.error('Ошибка при получении данных профиля:', err);
            }
        });
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }
}
