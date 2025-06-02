import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterModule } from '@angular/router';
import { RegistrationModalComponent } from '../registration-modal/registration-modal.component';
import { LoginModalComponent } from '../login-modal/login-modal.component';
import { Observable } from 'rxjs';
import { Auth2Service, UserDetails } from '../../auth/services/auth2.service';
import { AsyncPipe, CommonModule } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';
import { MatIcon } from '@angular/material/icon';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-parent',
  standalone: true,
  imports: [RegistrationModalComponent, LoginModalComponent, AsyncPipe, CommonModule, MatIcon, RouterModule],
  templateUrl: './parent.component.html',
  styleUrls: ['./parent.component.scss'],
})
export class ParentComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();


  isLoginModalOpen = false;
  isRegistrationModalOpen = false;
  isLoggedIn$!: Observable<boolean>;
  currentUser: UserDetails | null = null;


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

  ngOnInit(): void {
    // Подписка на данные пользователя для получения роли
    this.authService.userData$
      .pipe(takeUntil(this.destroy$))
      .subscribe(userData => {
        this.currentUser = userData;
        console.log('Current user data in header:', userData);
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // Проверка ролей пользователя
  isAdmin(): boolean {
    return this.authService.currentUser?.role === 'ROLE_ADMIN';
  }

  isEventCreator(): boolean {
    return this.authService.currentUser?.role === 'ROLE_CREATOR';
  }

  // Навигация для кнопок с ролями
  navigateToAdminPanel(): void {
    this.router.navigate(['/admin-panel']);
    console.log('Переход в админ панель');
  }

  navigateToCreateEvent(): void {
    this.router.navigate(['/create-event']);
    console.log('Переход к созданию мероприятия');
  }

  navigateToMyEvents(): void {
    this.router.navigate(['/my-events']);
    console.log('Переход на страницу моих мероприятий')
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
