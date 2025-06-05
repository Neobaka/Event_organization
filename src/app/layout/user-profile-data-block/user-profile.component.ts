import { Component, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { Auth2Service } from '../../auth/services/auth2.service';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import {UserDetails} from '../../auth/models/user-details';

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,selector: 'app-user-profile',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './user-profile.component.html',
    styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit, OnDestroy {
    public userData: UserDetails | null = null;
    public isLoading = true;
    public error: string | null = null;
    private userSubscription: Subscription | undefined;

    constructor(public authService: Auth2Service) {
    }

    public ngOnInit(): void {
        console.log('Инициализация компонента профиля пользователя');

        // Подписываемся на данные пользователя из сервиса
        this.userSubscription = this.authService.userData$.subscribe({
            next: (user): void => {
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
            error: (err): void => {
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
    public editUserData(): void {
    // Здесь будет логика редактирования данных пользователя
        console.log('Нажата кнопка редактирования данных');
    // Например, открытие модального окна с формой редактирования
    }

    public ngOnDestroy(): void {
    // Отписываемся, чтобы избежать утечек памяти
        if (this.userSubscription) {
            this.userSubscription.unsubscribe();
        }
    }
}
