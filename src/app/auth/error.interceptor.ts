import {HttpErrorResponse, HttpInterceptorFn} from '@angular/common/http';
import {Auth2Service} from './auth2.service';
import {inject} from '@angular/core';
import {Router} from '@angular/router';
import {catchError, throwError} from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(Auth2Service);
  const router = inject(Router);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        authService.logout();
        router.navigate(['/']);
      }
      return throwError(() => error);
    })
  );
};
