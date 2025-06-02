import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {RegisterPayload} from './register-payload';
import {TokenResponse} from './token-response';
import {BehaviorSubject, catchError, Observable, tap, throwError, EMPTY} from 'rxjs';
import {LoginPayload} from './login-payload';
import {AngularFireAuth} from '@angular/fire/compat/auth';
import firebase from 'firebase/compat/app';
import {TokenService} from './token.service';


//Поскольку используем compat API, везде, где есть ссылака на User, нужно использовать тип из firebase/compat/app
type User = firebase.User;

export interface UserDetails {
  id: number;
  firebaseId: string;
  email: string;
  phoneNumber: string;
  displayName: string;
  role: string;
  favoriteEvents: number[];
  plannedEvents: number[];
  fileName: string;
}

@Injectable({
  providedIn: 'root'
})

export class Auth2Service {
  // Ключ для хранения токена в localStorage
  private readonly ACCESS_TOKEN_KEY = 'access_token';
  private readonly apiUrl = 'http://188.226.91.215:43546/api/v1/';
  private userProfile$?: Observable<any>;
  private loggedInSubject: BehaviorSubject<boolean>
  private userDataSubject = new BehaviorSubject<UserDetails | null>(null);

  private http = inject(HttpClient);
  private router = inject(Router);
  private afAuth = inject(AngularFireAuth);
  private tokenService = inject(TokenService);

  public get loggedIn$(): Observable<boolean> {
    return this.loggedInSubject.asObservable();
  }

  public get userData$(): Observable<UserDetails | null> {
    return this.userDataSubject.asObservable();
  }

  public readonly user$: Observable<User | null>;

  constructor() {
    this.loggedInSubject = new BehaviorSubject<boolean>(this.hasToken());
    this.user$ = this.afAuth.authState;

    if (this.hasToken()) {
      this.loadUserProfile();
    }
  }

  private hasToken(): boolean {
    return !!this.tokenService.getAccessToken();
  }

  public get currentUser(): UserDetails | null {
    return this.userDataSubject.value;
  }

  updateFavoriteEvents(eventId: number, add: boolean) {
    const current = this.userDataSubject.value;
    if (!current) return;
    let updatedFavorites: number[];
    if (add) {
      updatedFavorites = [...current.favoriteEvents, eventId];
    } else {
      updatedFavorites = current.favoriteEvents.filter(id => id !== eventId);
    }
    // Обновляем userDataSubject с новым массивом избранного
    this.userDataSubject.next({
      ...current,
      favoriteEvents: updatedFavorites
    });
  }

  updatePlannedEvents(eventId: number, add: boolean) {
    const current = this.userDataSubject.value;
    if (!current) return;
    let updatedPlanned: number[];
    if (add) {
      updatedPlanned = [...current.plannedEvents, eventId];
    } else {
      updatedPlanned = current.plannedEvents.filter(id => id !== eventId);
    }

    this.userDataSubject.next({
      ...current,
      plannedEvents: updatedPlanned
    })
  }

  getCurrentUser(): Promise<User | null> {
    return this.afAuth.currentUser;
  }

  getUserProfileFromApi(): Observable<UserDetails> {
    console.log('Отправка запроса на получение данных пользователя');
    return this.http.get<UserDetails>(`${this.apiUrl}users/user_details`);
  }

  // Загрузка профиля пользователя и обновление userDataSubject
  loadUserProfile(): void {
    console.log('Загрузка профиля пользователя...');

    this.getUserProfileFromApi().pipe(
      catchError(error => {
        console.error('Ошибка загрузки профиля пользователя:', error);

        // Если ошибка 401 (Unauthorized), возможно токен истек
        if (error.status === 401) {
          console.log('Токен авторизации истек или некорректен');
          this.clearToken();
          this.loggedInSubject.next(false);
          this.router.navigate(['/login']);
        }

        return EMPTY;
      })
    ).subscribe(profile => {
      if (profile) {
        console.log('Профиль пользователя успешно загружен:', profile);
        this.userDataSubject.next(profile);
      } else {
        console.log('Не удалось загрузить профиль пользователя');
      }
    });
  }

  // Сброс кэша профиля
  private resetUserProfileCache() {
    this.userProfile$ = undefined;
  }

  // Вход через Google
  async signInWithGoogle(): Promise<any> {
    const provider = new firebase.auth.GoogleAuthProvider();
    provider.addScope('email');
    provider.addScope('profile');

    try {
      const result = await this.afAuth.signInWithPopup(provider);

      if (!result.user) {
        return null;
      }

      const idToken = await result.user.getIdToken();
      console.log('ID Token получен:', idToken.substring(0, 50) + '...'); // Логируем начало токена

      const response = await this.http.post<TokenResponse>(
        `${this.apiUrl}users/google-auth`,
        { idToken }
      ).pipe(
        tap(response => {
          console.log('Успешный ответ от сервера:', response);
          this.saveToken(response.AccessToken);
          this.loggedInSubject.next(true);
          this.getUserProfileFromApi().subscribe(profile => {
            this.userDataSubject.next(profile);
          });
        }),
        catchError(error => {
          console.error('Детали ошибки:', error);
          console.error('Статус:', error.status);
          console.error('Тело ответа:', error.error);
          return throwError(() => error);
        })
      ).toPromise();

      return response;

    } catch (error) {
      console.error('Ошибка при входе через Google:', error);
      throw error;
    }
  }


  // Геттер для синхронной проверки
  get isAuth(): boolean {
    return this.hasToken();
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

  login(payload: LoginPayload) {
    return this.http.post<TokenResponse>(`${this.apiUrl}users/login`, payload).pipe(
      tap(response => {
        this.handleAuthSuccess(response.AccessToken);
        this.loadUserProfile();
      }),
      catchError(error => {
        this.clearToken();
        return throwError(() => error);
      })
    );
  }

  // Общая обработка успешной аутентификации
  private handleAuthSuccess(token: string) {
    this.saveToken(token);
    this.loggedInSubject.next(true);
    this.resetUserProfileCache();
    this.loadUserProfile();
  }

  // Общая обработка ошибок аутентификации
  private handleAuthError(error: any) {
    this.clearToken();
    this.loggedInSubject.next(false);
    return throwError(() => error);
  }

  isTokenExpired(token: string | null): boolean {
    if (!token) return true;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      // exp - время истечения в секундах
      return Math.floor(Date.now() / 1000) >= payload.exp;
    } catch (e) {
      return true; // если токен некорректный - считаем его истёкшим
    }
  }

  // Метод для выхода
  logout() {
    this.clearToken();
    this.loggedInSubject.next(false);
    this.resetUserProfileCache();
    this.userDataSubject.next(null);
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
