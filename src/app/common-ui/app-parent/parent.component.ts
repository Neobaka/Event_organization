import { Component } from '@angular/core';
import { RegistrationModalComponent } from '../registration-modal/registration-modal.component';
import { LoginModalComponent } from '../login-modal/login-modal.component';
import { AuthService } from '../../auth/auth.service';

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
  isLoggedIn = false;

  constructor(private authService: AuthService) {
    this.authService.isLoggedIn().subscribe(loggedIn => {
      this.isLoggedIn = loggedIn;
    });
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
}
