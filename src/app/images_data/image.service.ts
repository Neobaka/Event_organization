import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ImageService {
  private apiUrl = 'http://188.226.91.215:43546/api/v1/images';

  constructor(private http: HttpClient) {}

  uploadImage(file: File): Observable<{ fileName: string }> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<{ fileName: string }>(`${this.apiUrl}/upload`, formData);
  }

  getImage(fileName: string): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/${fileName}`, { responseType: 'blob' });
  }
}
