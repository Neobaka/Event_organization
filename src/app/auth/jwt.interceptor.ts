import {HttpInterceptorFn} from '@angular/common/http';
import {inject} from '@angular/core';
import {Auth2Service} from './auth2.service';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(Auth2Service);
  const token = auth.getAccessToken();

  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }
  return next(req);
};
