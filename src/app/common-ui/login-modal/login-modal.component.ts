import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Auth2Service } from '../../auth/services/auth2.service';
import { Router } from '@angular/router';
import { MatIcon } from '@angular/material/icon';

@Component({
    selector: 'app-login-modal',
    standalone: true,
    imports: [ReactiveFormsModule, CommonModule, MatIcon],
    templateUrl: './login-modal.component.html',
    styleUrls: ['./login-modal.component.scss']
})
export class LoginModalComponent {
  @Input() isOpen = false;
  @Output() close = new EventEmitter<void>();
  @Output() forgotPassword = new EventEmitter<void>();
  @Output() register = new EventEmitter<void>();
  loginForm: FormGroup;
  errorMessage = '';
  loading = false;
  router: any =inject(Router);

  constructor(
    private fb: FormBuilder,
    private authService: Auth2Service
  ) {
      this.loginForm = this.fb.group({
          email: ['', [Validators.required, Validators.email]],
          password: ['', Validators.required]
      });
  }

  /**
   *
   */
  closeModal(): void {
      this.close.emit();
      this.errorMessage = '';
      this.loginForm.reset();
  }

  /**
   *
   */
  onOverlayClick(event: MouseEvent): void {
      if ((event.target as HTMLElement).className === 'modal-overlay') {
          this.closeModal();
      }
  }

  /**
   *
   */
  onForgotPassword(): void {
      this.forgotPassword.emit();
  }

  /**
   *
   */
  onRegister(): void {
      this.register.emit();
  }

  /**
   *
   */
  onSubmit(): void {
      if (this.loginForm.valid) {
          this.loading = true;
          this.errorMessage = '';

          const { email, password } = this.loginForm.value;

          // Формируем payload, используя интерфейс который мы создали
          const loginPayload = {
              EmailId: email,
              Password: password
          };

          this.authService.login(loginPayload).subscribe({
              next: (user) => {
                  console.log('User logged in successfully:', user);
                  this.loading = false;
                  this.closeModal();
                  this.router.navigate(['/']);
              },
              error: (error) => {
                  console.error('Login error:', error);
                  this.loading = false;
                  this.handleLoginError(error);
              }
          });
      } else {
      // Пометить все поля как затронутые для показа ошибок валидации
          Object.keys(this.loginForm.controls).forEach(key => {
              this.loginForm.get(key)?.markAsTouched();
          });
      }
  }

  /**
   *
   */
  private handleLoginError(error: any): void {
      console.error('Login error:', error);

      // Обработка ошибок Firebase Authentication
      const errorCode = error.code;
      switch (errorCode) {
          case 'auth/invalid-email':
              this.errorMessage = 'Неверный формат электронной почты';
              break;
          case 'auth/user-disabled':
              this.errorMessage = 'Пользователь отключен';
              break;
          case 'auth/user-not-found':
              this.errorMessage = 'Пользователь не найден';
              break;
          case 'auth/wrong-password':
              this.errorMessage = 'Неверный пароль';
              break;
          case 'auth/too-many-requests':
              this.errorMessage = 'Слишком много запросов. Попробуйте позже';
              break;
          default:
              this.errorMessage = 'Произошла ошибка при входе';
              break;
      }
  }

  /**
   *
   */
  signInWithGoogle(): void {
      this.loading = true;
      this.errorMessage = '';

      this.authService.signInWithGoogle()
          .then(user => {
              console.log('Успешный вход через Google:', user);
              this.loading = false;
              this.closeModal();
              this.router.navigate(['/profile']);
          })
          .catch(error => {
              console.error('Google login error:', error);
              this.loading = false;

              // Обработка ошибок авторизации через Google
              if (error.code === 'auth/popup-closed-by-user') {
                  this.errorMessage = 'Окно входа было закрыто пользователем';
              } else if (error.code === 'auth/popup-blocked') {
                  this.errorMessage = 'Всплывающее окно заблокировано браузером';
              } else {
                  this.errorMessage = 'Ошибка при входе через Google';
              }
          });
  }
}
