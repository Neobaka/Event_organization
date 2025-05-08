import { Component } from '@angular/core';
import { RegistrationModalComponent } from '../registration-modal/registration-modal.component';
import { LoginModalComponent } from '../login-modal/login-modal.component';
import {Observable} from 'rxjs';
import {Auth2Service} from '../../auth/auth2.service';

@Component({
  selector: 'app-parent',
  standalone: true,
  imports: [RegistrationModalComponent, LoginModalComponent, CommonModule],
  templateUrl: './parent.component.html',
  styleUrls: ['./parent.component.scss'],
})
export class ParentComponent {
  isLoginModalOpen = false;
  isRegistrationModalOpen = false;
  isLoggedIn$!: Observable<boolean>; // Теперь это Observable

  constructor(private authService: Auth2Service) {
    // Получаем реактивный статус авторизации
    this.isLoggedIn$ = this.authService.isLoggedIn();
  }

  openLoginModal(): void {
    this.isLoginModalOpen = true;
    this.isRegistrationModalOpen = false;
  }

  openRegistrationModal(): void {
    this.isRegistrationModalOpen = true;
    this.isLoginModalOpen = false;
  }

  closeModals(): void {
    this.isLoginModalOpen = false;
    this.isRegistrationModalOpen = false;
  }
  /*
  onForgotPassword(): void {
    const email = prompt('Введите ваш email для сброса пароля:');
    if (email) {
      this.authService.resetPassword(email).subscribe({
        next: () => {
          alert('Инструкции по сбросу пароля отправлены на ваш email');
          this.closeModals();
        },
        error: (error) => {
          console.error('Reset password error:', error);
          alert('Произошла ошибка при отправке запроса на сброс пароля');
        }
      });
    }
  }
  */

  /*
  logout(): void {
    this.authService.logout().subscribe({
      next: () => {
        console.log('Юзер вышел из аккаунта');
      },
      error: (error) => {
        console.error('Ошибка выхода:', error);
      }
    });
  }
  */
}
