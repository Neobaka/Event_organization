import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-login-modal',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login-modal.component.html',
  styleUrls: ['./login-modal.component.scss']
})
export class LoginModalComponent {
  @Input() isOpen = false;
  @Output() close = new EventEmitter<void>();
  @Output() forgotPassword = new EventEmitter<void>();
  @Output() register = new EventEmitter<void>();

  loginForm: FormGroup;
  errorMessage: string = '';
  loading: boolean = false;

  constructor(private fb: FormBuilder, private authService: AuthService) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  closeModal(): void {
    this.close.emit();
    this.errorMessage = '';
    this.loginForm.reset();
  }

  onOverlayClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).className === 'modal-overlay') {
      this.closeModal();
    }
  }

  onForgotPassword(): void {
    this.forgotPassword.emit();
  }

  onRegister(): void {
    this.register.emit();
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.loading = true;
      this.errorMessage = '';

      const { email, password } = this.loginForm.value;

      this.authService.login(email, password).subscribe({
        next: (user) => {
          console.log('User logged in successfully:', user);
          this.loading = false;
          this.closeModal();
        },
        error: (error) => {
          console.error('Login error:', error);
          this.loading = false;

          switch (error.code) {
            case 'auth/user-not-found':
              this.errorMessage = 'Пользователь с таким email не найден';
              break;
            case 'auth/wrong-password':
              this.errorMessage = 'Неверный пароль';
              break;
            case 'auth/too-many-requests':
              this.errorMessage = 'Слишком много попыток. Попробуйте позже';
              break;
            default:
              this.errorMessage = 'Произошла ошибка при входе. Попробуйте снова';
          }
        }
      });
    } else {
      // Пометить все поля как затронутые для показа ошибок валидации
      Object.keys(this.loginForm.controls).forEach(key => {
        const control = this.loginForm.get(key);
        control?.markAsTouched();
      });
    }
  }
}
