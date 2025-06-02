import {Component, EventEmitter, inject, Input, Output} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {Auth2Service} from '../../auth/services/auth2.service';
import {RegisterPayload} from '../../auth/models/register-payload';
import {switchMap} from 'rxjs';
import {Router} from '@angular/router';
import {MatIcon} from '@angular/material/icon';

@Component({
  selector: 'app-registration-modal',
  imports: [ReactiveFormsModule, CommonModule, MatIcon],
  templateUrl: './registration-modal.component.html',
  styleUrls: ['./registration-modal.component.scss']
})

export class RegistrationModalComponent {
  @Input() isOpen = false;
  @Output() close = new EventEmitter<void>();

  registrationForm: FormGroup;
  errorMessage: string = '';
  loading: boolean = false;
  router: any = inject(Router);

  constructor(
    private fb: FormBuilder,
    private authService: Auth2Service
  ) {
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
      // Формируем payload, используя интерфейс который мы создали
      const registerPayload: RegisterPayload = {
        Email: email,
        PhoneNumber: phone,
        DisplayName: `${firstName} ${lastName}`,
        Password: password
      };

      this.authService.register(registerPayload).pipe(
        // После успешной регистрации выполняем автоматический вход
        switchMap(() => this.authService.login({
          EmailId: email,
          Password: password
        }))
        ).subscribe({
        next: (user) => {
          console.log('User registered successfully:', user);
          this.loading = false;
          this.closeModal();
          this.router.navigate(['/profile']);
          // можно добавить еще логику при успехе (РЕДИРЕКТ)
        },
        error: (error) => {
          this.handleRegistrationError(error);
          this.loading = false;
        }
      });
    } else {
      // Отметить все поля как затронутые для отображения ошибок валидации
      Object.keys(this.registrationForm.controls).forEach(key => {
        this.registrationForm.get(key)?.markAsTouched();
      });
    }
  }

  private handleRegistrationError(error: any): void {
    console.error('Registration error:', error);

    // обработка ошибок
    if (error.status === 409) {
      this.errorMessage = 'User account with provided email-id already exists';
    } else if (error.status === 400) {
      this.errorMessage = 'Invalid request body';
    } else {
      this.errorMessage = 'Ошибка регистрации. Попробуйте снова';
    }
  }
}
