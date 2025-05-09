import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { RegisterPayload } from './register-payload';
import { TokenResponse } from './token-response';
import { catchError, tap, throwError } from 'rxjs';
import { LoginPayload } from './login-payload';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat/app';
import { Observable } from 'rxjs';

//Поскольку используем compat API, везде, где есть ссылака на User, нужно использовать тип из firebase/compat/app
type User = firebase.User;

@Injectable({
  providedIn: 'root'
})

export class Auth2Service {
  // Ключ для хранения токена в localStorage
  private readonly ACCESS_TOKEN_KEY = 'access_token';
  private readonly apiUrl = 'http://188.226.91.215:43546/api/v1/';

  http = inject(HttpClient);
  router = inject(Router);


  user$: Observable<User | null>;

  constructor(private afAuth: AngularFireAuth) {
    this.user$ = this.afAuth.authState;
  }

  getCurrentUser(): Promise<User | null> {
    return this.afAuth.currentUser;
  }


  //проверка авторизации
  get isAuth(): boolean {
    return !!localStorage.getItem(this.ACCESS_TOKEN_KEY);
  }

  //регистрация
  register(payload: RegisterPayload) {
    return this.http.post<void>(
      `${this.apiUrl}users`,
      payload
    ).pipe(
      catchError(error => {
        this.clearToken();
        return throwError(() => error);
      })
    )
  }

  // Метод для входа пользователя
  login(payload: LoginPayload) {
    return this.http.post<TokenResponse>(
      `${this.apiUrl}users/login`,
      payload // Данные пользователя
    ).pipe(
      // При успешном ответе:
      tap(response => this.saveToken(response.AccessToken)),

      // При ошибке:
      catchError(error => {
        this.clearToken(); // Очищаем токен
        return throwError(() => error); // Пробрасываем ошибку дальше
      })
    );
  }

  // Метод для выхода
  logout() {
    this.clearToken(); // Удаляем токен
    this.router.navigate(['/']); // Перенаправляем на страницу входа
  }

  // Сохранение токена в localStorage
  private saveToken(token: string) {
    localStorage.setItem(this.ACCESS_TOKEN_KEY, token);
  }

  // Удаление токена
  private clearToken() {
    localStorage.removeItem(this.ACCESS_TOKEN_KEY);
  }

  // Получение токена (для jwt.interceptor)
  getAccessToken(): string | null {
    return localStorage.getItem(this.ACCESS_TOKEN_KEY);
  }
}
