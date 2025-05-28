import { Component } from '@angular/core';
import { RegistrationModalComponent } from '../registration-modal/registration-modal.component';
import { LoginModalComponent } from '../login-modal/login-modal.component';
import {Observable} from 'rxjs';
import {Auth2Service} from '../../auth/auth2.service';
import {AsyncPipe, CommonModule} from '@angular/common';
import {MatIcon} from '@angular/material/icon';
import {Router} from '@angular/router';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-parent',
  standalone: true,
  imports: [RegistrationModalComponent, LoginModalComponent, AsyncPipe, CommonModule, MatIcon],
  templateUrl: './parent.component.html',
  styleUrls: ['./parent.component.scss'],
})
export class ParentComponent {
  isLoginModalOpen = false;
  isRegistrationModalOpen = false;
  isLoggedIn$!: Observable<boolean>; // Теперь это Observable


  constructor(
    private authService: Auth2Service,
    private router: Router,
    private route: ActivatedRoute

  ) {
    // Получаем реактивный статус авторизации
    this.isLoggedIn$ = this.authService.isLoggedIn();

    this.route.queryParams.subscribe(params => {
    if (params['showLoginModal'] === 'true') {
      this.openLoginModal();

      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: {},
        replaceUrl: true
      });
    }
  });
  }

  goToProfile() {
    this.router.navigate(['/profile']);
  }

  logout(): void {
    this.authService.logout();
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
}
