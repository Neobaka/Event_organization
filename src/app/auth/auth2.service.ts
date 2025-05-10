import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {RegisterPayload} from './register-payload';
import {TokenResponse} from './token-response';
import {BehaviorSubject, catchError, Observable, shareReplay, tap, throwError} from 'rxjs';
import { LoginPayload } from './login-payload';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat/app';
import {TokenService} from './token.service';


//Поскольку используем compat API, везде, где есть ссылака на User, нужно использовать тип из firebase/compat/app
type User = firebase.User;

@Injectable({
  providedIn: 'root'
})

export class Auth2Service {
  // Ключ для хранения токена в localStorage
  private readonly ACCESS_TOKEN_KEY = 'access_token';
  private readonly apiUrl = 'http://188.226.91.215:43546/api/v1/';
  private userProfile$?: Observable<any>;
  private loggedInSubject = new BehaviorSubject<boolean>(this.hasToken());
  private userDataSubject = new BehaviorSubject<any>(null);

  public loggedIn$ = this.loggedInSubject.asObservable();
  public userData$ = this.userDataSubject.asObservable();
  public user$: Observable<User | null>;

  http = inject(HttpClient);
  router = inject(Router);

  constructor(
    private afAuth: AngularFireAuth,
    private tokenService: TokenService
  ) {
    this.user$ = this.afAuth.authState;

    if (this.hasToken()) {
      this.getUserProfileFromApi().subscribe(); // загргузка профиля при инициализации
    }
  }

  // Проверка наличия токена в localStorage
  private hasToken(): boolean {
    return !!localStorage.getItem(this.ACCESS_TOKEN_KEY);
  }


  getCurrentUser(): Promise<User | null> {
    return this.afAuth.currentUser;
  }

  // Получение профиля с кэшированием
  getUserProfileFromApi(): Observable<any> {
    if (!this.userProfile$) {
      this.userProfile$ = this.http.get(`${this.apiUrl}users/user_details`).pipe(
        tap(profile => this.userDataSubject.next(profile)),
        shareReplay(1)
      );
    }
    return this.userProfile$;
  }

  // Сброс кэша профиля
  private resetUserProfileCache() {
    this.userProfile$ = undefined;
  }

  // Обновлено: вход через Google
  signInWithGoogle(): Promise<any> {
    const provider = new firebase.auth.GoogleAuthProvider();
    return this.afAuth.signInWithPopup(provider)
      .then(result => result.user?.getIdToken().then(idToken =>
        this.http.post<TokenResponse>(`${this.apiUrl}users/google-auth`, { idToken }).pipe(
          tap(response => this.handleAuthSuccess(response.AccessToken)),
          catchError(error => this.handleAuthError(error))
        ).toPromise()
      ));
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
    return this.http.post<TokenResponse>(`${this.apiUrl}users/login`, payload).pipe(
      tap(response => this.handleAuthSuccess(response.AccessToken)),
      catchError(error => this.handleAuthError(error))
    );
  }

  // Общая обработка успешной аутентификации
  private handleAuthSuccess(token: string) {
    this.saveToken(token);
    this.loggedInSubject.next(true);
    this.resetUserProfileCache();
    this.getUserProfileFromApi().subscribe();
  }

  // Общая обработка ошибок аутентификации
  private handleAuthError(error: any) {
    this.clearToken();
    this.loggedInSubject.next(false);
    return throwError(() => error);
  }

  // Метод для выхода
  logout() {
    this.clearToken();
    this.loggedInSubject.next(false);
    this.resetUserProfileCache();
    this.router.navigate(['/']);
  }

  // Сохранение токена в localStorage
  private saveToken(token: string) {
    this.tokenService.saveToken(token);
  }

  // Удаление токена
  private clearToken() {
    this.tokenService.clearToken();
  }

  // Получение токена
  getAccessToken(): string | null {
    return this.tokenService.getAccessToken();
  }

  // Реактивная проверка авторизации
  isLoggedIn(): Observable<boolean> {
    return this.loggedIn$;
  }
}
