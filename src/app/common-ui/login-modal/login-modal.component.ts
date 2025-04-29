import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login-modal',
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
  
  constructor(private fb: FormBuilder) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }
  
  closeModal(): void {
    this.close.emit();
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
      console.log('Login form submitted:', this.loginForm.value);
      // Здесь можно добавить логику отправки данных на бэкенд
      // this.authService.login(this.loginForm.value).subscribe(...);
    } else {
      // Пометить все поля как затронутые для показа ошибок валидации
      Object.keys(this.loginForm.controls).forEach(key => {
        const control = this.loginForm.get(key);
        control?.markAsTouched();
      });
    }
  }
}
