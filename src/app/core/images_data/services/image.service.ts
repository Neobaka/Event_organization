import {inject, Injectable} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {ApiConfigService} from '../../api-config/services/api-config.service';

@Injectable({
    providedIn: 'root'
})
export class ImageService {
    private apiUrl = inject(ApiConfigService).baseUrl + 'images';

    constructor(private http: HttpClient) {}

    /**
     *
     */
    uploadImage(file: File): Observable<{ fileName: string }> {
        const formData = new FormData();
        formData.append('file', file);

        return this.http.post<{ fileName: string }>(`${this.apiUrl}/upload`, formData);
    }

    /**
     *
     */
    getImage(fileName: string): Observable<Blob> {
        return this.http.get(`${this.apiUrl}/${fileName}`, { responseType: 'blob' });
    }
}
