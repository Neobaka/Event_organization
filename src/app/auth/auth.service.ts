import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';
import firebase from 'firebase/compat/app';

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  currentUser$: Observable<firebase.User | null>;

  constructor(private afAuth: AngularFireAuth) {
    this.currentUser$ = this.afAuth.authState;
  }

  // Регистрация пользователя
  register(email: string, password: string, userData: any): Observable<any> {
    return from(
      this.afAuth.createUserWithEmailAndPassword(email, password)
        .then(async (result) => {
          if (result.user) {
            // Здесь можно сохранить дополнительную информацию о пользователе в Firebase Firestore
            // Например: await this.saveUserData(result.user.uid, userData);
            return result.user;
          }
          return null;
        })
    );
  }

  // Вход пользователя
  login(email: string, password: string): Observable<any> {
    return from(
      this.afAuth.signInWithEmailAndPassword(email, password)
        .then((result) => {
          return result.user;
        })
    );
  }

  // Выход пользователя
  logout(): Observable<void> {
    return from(this.afAuth.signOut());
  }

  // Сброс пароля
  resetPassword(email: string): Observable<void> {
    return from(this.afAuth.sendPasswordResetEmail(email));
  }

  // Проверка, авторизован ли пользователь
  isLoggedIn(): Observable<boolean> {
    return this.currentUser$.pipe(
      map(user => !!user)
    );
  }
}
