import {HttpErrorResponse, HttpInterceptorFn} from '@angular/common/http';
import {Auth2Service} from '../services/auth2.service';
import {inject, Injector} from '@angular/core';
import {Router} from '@angular/router';
import {catchError, throwError} from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const injector = inject(Injector);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        const authService = injector.get(Auth2Service);
        authService.logout();
        router.navigate(['/']);
      }
      return throwError(() => error);
    })
  );
};
