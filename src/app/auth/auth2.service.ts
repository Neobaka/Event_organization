import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {RegisterPayload} from './register-payload';
import {TokenResponse} from './token-response';
import {BehaviorSubject, catchError, Observable, tap, throwError} from 'rxjs';
import { LoginPayload } from './login-payload';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat/app';


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

  // BehaviorSubject для хранения состояния авторизации
  private loggedInSubject = new BehaviorSubject<boolean>(this.hasToken());
  public loggedIn$ = this.loggedInSubject.asObservable();

  // Проверка наличия токена в localStorage
  private hasToken(): boolean {
    return !!localStorage.getItem(this.ACCESS_TOKEN_KEY);
  }

  user$: Observable<User | null>;

  private userDataSubject = new BehaviorSubject<any>(null);
  public userData$ = this.userDataSubject.asObservable();

  constructor(private afAuth: AngularFireAuth) {
    this.user$ = this.afAuth.authState;

    if (this.hasToken()) {
      this.getUserProfileFromApi().subscribe(profile => {
        this.userDataSubject.next(profile);
      });
    }
  }

  getCurrentUser(): Promise<User | null> {
    return this.afAuth.currentUser;
  }

  getUserProfileFromApi(): Observable<any> {
    return this.http.get(`${this.apiUrl}users/me`);
  }

  signInWithGoogle(): Promise<any> {
    const provider = new firebase.auth.GoogleAuthProvider();
    return this.afAuth.signInWithPopup(provider)
      .then(result => {
        // После успешной аутентификации через Google
        if (result.user) {
          // Здесь можно отправить данные на ваш бэкенд для создания JWT токена
          // Например, обмен Firebase ID token на ваш собственный токен
          return result.user.getIdToken().then(idToken => {
            return this.http.post<TokenResponse>(
              `${this.apiUrl}users/google-auth`,
              { idToken }
            ).pipe(
              tap(response => {
                this.saveToken(response.AccessToken);
                this.loggedInSubject.next(true);

                // Загружаем профиль пользователя
                this.getUserProfileFromApi().subscribe(profile => {
                  this.userDataSubject.next(profile);
                });
              })
            ).toPromise();
          });
        }
        return null;
      });
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

  login(payload: LoginPayload) {
  return this.http.post<TokenResponse>(
    `${this.apiUrl}users/login`,
    payload
  ).pipe(
    tap(response => {
      this.saveToken(response.AccessToken);
      this.loggedInSubject.next(true);

      // Загружаем профиль пользователя после логина
      this.getUserProfileFromApi().subscribe(profile => {
        this.userDataSubject.next(profile);
      });
    }),
    catchError(error => {
      this.clearToken(); // Очищаем токен
      this.loggedInSubject.next(false);
      return throwError(() => error);
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
