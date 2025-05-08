import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {RegisterPayload} from './register-payload';
import {TokenResponse} from './token-response';
import {BehaviorSubject, catchError, Observable, tap, throwError} from 'rxjs';
import {LoginPayload} from './login-payload';

@Injectable({
  providedIn: 'root'
})

export class Auth2Service {
  // Ключ для хранения токена в localStorage
  private readonly ACCESS_TOKEN_KEY = 'access_token';
  private readonly apiUrl = 'http://188.226.91.215:43546/api/v1/';

  http = inject(HttpClient);
  router = inject(Router);

  // BehaviorSubject для хранения состояния авторизации
  private loggedInSubject = new BehaviorSubject<boolean>(this.hasToken());
  public loggedIn$ = this.loggedInSubject.asObservable();

  // Проверка наличия токена в localStorage
  private hasToken(): boolean {
    return !!localStorage.getItem(this.ACCESS_TOKEN_KEY);
  }

  // Геттер для синхронной проверки
  get isAuth(): boolean {
    return this.hasToken();
  }

  //регистрация
  register(payload: RegisterPayload){
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
      tap(response => {
        this.saveToken(response.AccessToken);
        this.loggedInSubject.next(true); //обновляем состояние после логина
      }),

      // При ошибке:
      catchError(error => {
        this.clearToken(); // Очищаем токен
        this.loggedInSubject.next(false); // Обновляем состояние
        return throwError(() => error); // Пробрасываем ошибку дальше
      })
    );
  }

  // Метод для выхода
  logout() {
    this.clearToken(); // Удаляем токен
    this.loggedInSubject.next(false); // Обновляем состояние
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

  // Реактивная проверка авторизации
  isLoggedIn(): Observable<boolean> {
    return this.loggedIn$;
  }
}
