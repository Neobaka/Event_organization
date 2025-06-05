import { Component, OnInit, OnDestroy } from '@angular/core';
import { Auth2Service, UserDetails } from '../../auth/services/auth2.service';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-user-profile',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './user-profile.component.html',
    styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit, OnDestroy {
    userData: UserDetails | null = null;
    isLoading = true;
    error: string | null = null;
    private userSubscription: Subscription | undefined;

    constructor(public authService: Auth2Service) {
    }

    ngOnInit() {
        console.log('Инициализация компонента профиля пользователя');

        // Подписываемся на данные пользователя из сервиса
        this.userSubscription = this.authService.userData$.subscribe({
            next: (user) => {
                this.userData = user;
                this.isLoading = false;
                if (!user && this.authService.isAuth) {
                    this.isLoading = true;
                }
                if (!user && !this.authService.isAuth) {
                    this.error = 'Для просмотра профиля необходимо авторизоваться';
                    this.isLoading = false;
                }
                console.log('Данные пользователя загружены в компоненте:', user);
            },
            error: (err) => {
                this.error = 'Ошибка загрузки данных пользователя';
                this.isLoading = false;
                console.error('Ошибка загрузки данных пользователя в компоненте:', err);
            }
        });
    }

    // Метод для редактирования данных пользователя
    /**
     *
     */
    editUserData() {
    // Здесь будет логика редактирования данных пользователя
        console.log('Нажата кнопка редактирования данных');
    // Например, открытие модального окна с формой редактирования
    }

    ngOnDestroy() {
    // Отписываемся, чтобы избежать утечек памяти
        if (this.userSubscription) {
            this.userSubscription.unsubscribe();
        }
    }
}
