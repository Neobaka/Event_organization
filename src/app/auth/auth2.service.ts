import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, catchError, Observable, tap, throwError} from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import {LoginResponse} from './login-response';
import {LoginRequest} from './login-request';
import {RegisterRequest} from './register-request';
import {RegisterResponse} from './register-response';

@Injectable({
  providedIn: 'root'
})

export class Auth2Service {
  private apiUrl = `http://188.226.91.215:43546/api/v1/`;
  private http = inject(HttpClient);
  private cookies = inject(CookieService);

  // Для реактивного отслеживания токена
  private tokenSubject = new BehaviorSubject<string | null>(null);
  public token$ = this.tokenSubject.asObservable();

  constructor() {
    // При создании сервиса проверяем сохранённый токен
    const savedToken = this.cookies.get('access_token');
    if (savedToken) {
      this.tokenSubject.next(savedToken);
    }
  }


  login2(email: string, password: string): Observable<LoginResponse> {
    const body: LoginRequest = { email, password };

    return this.http.post<LoginResponse>(`${this.apiUrl}/users/login`, body).pipe(
      tap(response => {
        // Сохраняем токен в куки
        this.cookies.set('access_token', response.accessToken, {
          path: '/',
          secure: false,
          sameSite: 'Strict'
        });

        // Обновляем реактивное состояние
        this.tokenSubject.next(response.accessToken);
      }),
      catchError(error => {
        return throwError(() => new Error('Неверный email или пароль'));
      })
    );
  }

  register2(userData: RegisterRequest): Observable<RegisterResponse> {
    return this.http.post<RegisterResponse>(`${this.apiUrl}users`, userData).pipe(
      tap(response => {
        this.cookies.set('access_token', response.accessToken, {
          path: '/',
          secure: true,
          sameSite: 'Strict'
        });
        this.tokenSubject.next(response.accessToken);
      })
    );
  }


}
