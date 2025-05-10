import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {map, Observable} from 'rxjs';
import {EventModel} from './event-model';

@Injectable({
  providedIn: 'root'
})
export class EventService {

  private apiUrl = 'http://188.226.91.215:43546/api/v1/events';

  constructor(private http: HttpClient) {}

  getEvents(page: number, size: number): Observable<EventModel[]> {
    return this.http.get<{ content: EventModel[] }>(`${this.apiUrl}?page=${page}&size=${size}`)
        .pipe(map(response => response.content));
  }

  createEvent(event: Partial<EventModel>): Observable<any> {
    return this.http.post(this.apiUrl, event);
  }
}
