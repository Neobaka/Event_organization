import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { UserDetails } from '../../auth/interfaces/user-details';
import {ApiConfigService} from '../../api-config/services/api-config.service';

@Injectable({
    providedIn: 'root'
})
export class AdminService {

    private _apiUrl = inject(ApiConfigService).baseUrl + 'users';

    private _http = inject(HttpClient);

    /**
     *
     */
    public getAllUsers(page = 0, size = 10): Observable<UserDetails[]> {
        return this._http.get<{ content: UserDetails[] }>(`${this._apiUrl}?page=${page}&size=${size}`)
            .pipe(map(response => response.content));
    }

    /**
     *
     */
    public updateUser(userId: number, data: { FileName?: string; DisplayName: string; Role: string }): Observable<any> {
        return this._http.put(`${this._apiUrl}/${userId}`, data);
    }
}
