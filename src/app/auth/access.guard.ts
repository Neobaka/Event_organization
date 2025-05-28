import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Auth2Service } from './auth2.service';

export const authGuard: CanActivateFn = () => {
  const authService = inject(Auth2Service);
  const router = inject(Router);

  if (authService.isAuth) {
    return true;
  } else {

    // Передаем маркер в query params
    router.navigate([''], { queryParams: { showLoginModal: 'true' } });
    return false;
  }
};
