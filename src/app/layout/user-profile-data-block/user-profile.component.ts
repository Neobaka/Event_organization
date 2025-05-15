import { Component, OnInit, OnDestroy } from '@angular/core';
import { Auth2Service, UserDetails } from '../../auth/auth2.service';
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
  isLoading: boolean = true;
  error: string | null = null;
  private userSubscription: Subscription | undefined;

  constructor(public authService: Auth2Service) { }

  ngOnInit() {
    console.log('Инициализация компонента профиля пользователя');

    // Подписываемся на данные пользователя из сервиса
    this.userSubscription = this.authService.userData$.subscribe({
      next: (user) => {
        this.userData = user;
        this.isLoading = false;
        console.log('Данные пользователя загружены в компоненте:', user);
      },
      error: (err) => {
        this.error = 'Ошибка загрузки данных пользователя';
        this.isLoading = false;
        console.error('Ошибка загрузки данных пользователя в компоненте:', err);
      }
    });

    // Если пользователь авторизован, но данные еще не загружены
    if (this.authService.isAuth && !this.userData) {
      console.log('Пользователь авторизован, загружаем профиль');
      this.loadUserData();
    } else if (!this.authService.isAuth) {
      // Если пользователь не авторизован, перенаправляем на страницу логина
      this.error = 'Для просмотра профиля необходимо авторизоваться';
      this.isLoading = false;
      console.log('Пользователь не авторизован');
    }
  }

  loadUserData() {
    this.isLoading = true;
    this.error = null;
    console.log('Запрос на загрузку данных пользователя из компонента');

    // Принудительно запрашиваем данные профиля
    this.authService.loadUserProfile();
  }

  // Метод для редактирования данных пользователя
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
