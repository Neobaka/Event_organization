import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { UserDetails } from '../auth/models/user-details';

@Injectable({
    providedIn: 'root'
})
export class AdminService {

    private _apiUrl = 'http://188.226.91.215:43546/api/v1/users';

    private _http = inject(HttpClient);

    /**
     *
     */
    getAllUsers(page = 0, size = 10): Observable<UserDetails[]> {
        return this._http.get<{ content: UserDetails[] }>(`${this._apiUrl}?page=${page}&size=${size}`)
            .pipe(map(response => response.content));
    }

    /**
     *
     */
    updateUser(userId: number, data: { FileName?: string; DisplayName: string; Role: string }): Observable<any> {
        return this._http.put(`${this._apiUrl}/${userId}`, data);
    }
}
