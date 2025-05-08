import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-registration-modal',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './registration-modal.component.html',
  styleUrls: ['./registration-modal.component.scss']
})
export class RegistrationModalComponent {
  @Input() isOpen = false;
  @Output() close = new EventEmitter<void>();

  registrationForm: FormGroup;
  errorMessage: string = '';
  loading: boolean = false;

  constructor(private fb: FormBuilder, private authService: AuthService) {
    this.registrationForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      phone: ['', [Validators.required, Validators.pattern(/^\+7\d{10}$/)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(formGroup: FormGroup) {
    const password = formGroup.get('password')?.value;
    const confirmPassword = formGroup.get('confirmPassword')?.value;

    if (password !== confirmPassword) {
      formGroup.get('confirmPassword')?.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    } else {
      return null;
    }
  }

  closeModal(): void {
    this.close.emit();
    this.errorMessage = '';
    this.registrationForm.reset();
  }

  onOverlayClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).className === 'modal-overlay') {
      this.closeModal();
    }
  }

  onSubmit(): void {
    if (this.registrationForm.valid) {
      this.loading = true;
      this.errorMessage = '';

      const { email, password, firstName, lastName, phone } = this.registrationForm.value;
      const userData = {
        firstName,
        lastName,
        phone,
        email
      };

      this.authService.register(email, password, userData).subscribe({
        next: (user) => {
          console.log('User registered successfully:', user);
          this.loading = false;
          this.closeModal();
        },
        error: (error) => {
          console.error('Registration error:', error);
          this.loading = false;

          switch (error.code) {
            case 'auth/email-already-in-use':
              this.errorMessage = 'Этот email уже используется';
              break;
            case 'auth/weak-password':
              this.errorMessage = 'Пароль слишком простой';
              break;
            default:
              this.errorMessage = 'Произошла ошибка при регистрации. Попробуйте снова';
          }
        }
      });
    } else {
      // Отметить все поля как затронутые для отображения ошибок валидации
      Object.keys(this.registrationForm.controls).forEach(key => {
        const control = this.registrationForm.get(key);
        control?.markAsTouched();
      });
    }
  }
}
