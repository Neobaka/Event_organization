import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { EventModel } from './event-model';

@Injectable({
    providedIn: 'root'
})
export class EventService {

    private apiUrl = 'http://188.226.91.215:43546/api/v1/events';

    constructor(private http: HttpClient) {}

    /**
     *
     */
    public getEvents(page: number, size: number): Observable<EventModel[]> {
        return this.http.get<{ content: EventModel[] }>(`${this.apiUrl}?page=${page}&size=${size}`)
            .pipe(map(response => response.content));
    }

    /**
     *
     */
    public createEvent(event: Partial<EventModel>): Observable<any> {
        return this.http.post(this.apiUrl, event);
    }

    /**
     *
     */
    public getEventById(id: number): Observable<EventModel> {
        return this.http.get<EventModel>(`${this.apiUrl}/${id}`);
    }

    /**
     *
     */
    public addEventToFavorites(eventId: number): Observable<any> {
        return this.http.post(`${this.apiUrl}/favorite/${eventId}`, {});
    }

    /**
     *
     */
    public deleteEventFromFavorites(eventId: number): Observable<any> {
        return this.http.delete(`${this.apiUrl}/favorite/${eventId}`);
    }

    /**
     *
     */
    public addEventToPlanned(eventId: number): Observable<any> {
        return this.http.post(`${this.apiUrl}/planned/${eventId}`, {});
    }

    /**
     *
     */
    public deleteEventFromPlanned({ eventId }: { eventId: number; }): Observable<any> {
        return this.http.delete(`${this.apiUrl}/planned/${eventId}`);
    }

    /**
     *
     */
    public getEventsByCreator() : Observable<EventModel[]> {
        return this.http.get<{ content: EventModel[] }>(`${this.apiUrl}/byCreator/`)
            .pipe(map(response => response.content));
    }

    /**
     *
     */
    public deleteEventById({ eventId }: { eventId: number; }): Observable<any> {
        return this.http.delete(`${this.apiUrl}/${eventId}`);
    }
}
