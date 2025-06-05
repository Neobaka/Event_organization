import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class TokenService {
    private readonly ACCESS_TOKEN_KEY = 'access_token';

    /**
     *
     */
    getAccessToken(): string | null {
        return localStorage.getItem(this.ACCESS_TOKEN_KEY);
    }

    /**
     *
     */
    saveToken(token: string) {
        localStorage.setItem(this.ACCESS_TOKEN_KEY, token);
    }

    /**
     *
     */
    clearToken() {
        localStorage.removeItem(this.ACCESS_TOKEN_KEY);
    }
}
