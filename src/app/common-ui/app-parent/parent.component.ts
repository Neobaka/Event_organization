import { Component } from '@angular/core';
import { RegistrationModalComponent } from '../registration-modal/registration-modal.component';
import { LoginModalComponent } from '../login-modal/login-modal.component';

@Component({
  selector: 'app-parent',
  standalone: true, 
  imports: [RegistrationModalComponent, LoginModalComponent],
  templateUrl: './parent.component.html',
  styleUrls: ['./parent.component.scss']
})
export class ParentComponent {
  isLoginModalOpen = false;
  isRegistrationModalOpen = false;

 

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
    console.log('Забыл пароль');
  }
}
