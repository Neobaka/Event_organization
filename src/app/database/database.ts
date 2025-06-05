import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class UserService {
    constructor(private db: AngularFireDatabase) { }

    // Сохранение данных пользователя
    /**
     *
     */
    public saveUserData(uid: string, data: any): Promise<void> {
        return this.db.object(`/users/${uid}`).set(data);
    }

    // Получение данных пользователя
    /**
     *
     */
    public getUserData(uid: string): Observable<any> {
        return this.db.object(`/users/${uid}`).valueChanges();
    }
}
