import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

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
  
  constructor(private fb: FormBuilder) {
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
  }
  
  onOverlayClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).className === 'modal-overlay') {
      this.closeModal();
    }
  }
  
  onSubmit(): void {
    if (this.registrationForm.valid) {
      console.log('Registration form submitted:', this.registrationForm.value);
      // Здесь надо будет добавить логику для отправки данных на бэк (пример внизу)
      // this.authService.register(this.registrationForm.value).subscribe(...);
      this.closeModal();
    } else {
      // Ошибоки валидации
      Object.keys(this.registrationForm.controls).forEach(key => {
        const control = this.registrationForm.get(key);
        control?.markAsTouched();
      });
    }
  }
}

///ВЫзов в главную компоненту
///  <button class="button" (click)="openModal()">Открыть модальное окно</button>
//<app-registration - modal[isOpen]="isModalOpen"
//  (close) = "closeModal()" >
//  </app-registration-modal>

