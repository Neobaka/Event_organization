import { Component, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { HeaderComponent } from '../../common-ui/header/header.component';
import { NgForOf, NgIf, SlicePipe, NgClass, AsyncPipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { EventService } from '../../core/events_data/services/event.service';
import { Auth2Service } from '../../core/auth/services/auth2.service';
import { CATEGORY } from '../../core/events_data/helpers/event-category';
import { GENRE } from '../../core/events_data/helpers/event-genre';
import { EventModel } from '../../core/events_data/interfaces/event-model';
import { BehaviorSubject, combineLatest, map, Observable, startWith, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'app-my-events-page',
    imports: [
        HeaderComponent,
        NgForOf,
        NgIf,
        MatIconModule,
        FormsModule,
        SlicePipe,
        NgClass,
        AsyncPipe,
    ],
    templateUrl: './created-event-page.component.html',
    styleUrl: './created-event-page.component.scss'
})
export class CreatedEventPageComponent implements OnInit, OnDestroy {

    allEvents$ = new BehaviorSubject<EventModel[]>([]);
    public filteredEvents$!: Observable<EventModel[]>;
    upcomingEventsCount$ = this.allEvents$.pipe(
        map(events => events.filter(e => this.getEventStatus(e) === 'upcoming').length)
    );

    pastEventsCount$ = this.allEvents$.pipe(
        map(events => events.filter(e => this.getEventStatus(e) === 'past').length)
    );

    allEventsCount$ = this.allEvents$.pipe(
        map(events => events.length)
    );

    public page = 0;
    public size = 100;

    public isLoading$ = new BehaviorSubject<boolean>(false);
    public searchQuery$ = new BehaviorSubject<string>('');
    public selectedFilter$ = new BehaviorSubject<'all' | 'upcoming' | 'past'>('all');

    // Модальное окно удаления
    public showDeleteModal = false;
    public eventToDelete: EventModel | null = null;

    public categoryOptions: typeof CATEGORY = CATEGORY;
    public genreOptions: typeof GENRE = GENRE;
    public currentUserId = 0;


    private _destroy$: Subject<void> = new Subject<void>();

    constructor(
    private _eventService: EventService,
    private _auth2Service: Auth2Service,
    private _router: Router
    ) {
    }

    ngOnInit(): void {
        this.loadMyEvents();
        this.setupFilteredEventsStream();
    }

    public ngOnDestroy(): void {
        this._destroy$.next();
        this._destroy$.complete();
    }

    /**
   * Загружает текущего пользователя
   */
    public loadCurrentUser(): void {
        this._auth2Service.getUserProfileFromApi()
            .pipe(takeUntil(this._destroy$))
            .subscribe({
                next: (profile: any) => {
                    this.currentUserId = profile.id;
                    this.loadMyEvents();
                },
                error: (err: any) => {
                    console.error('Ошибка получения профиля пользователя', err);
                }
            });
    }

    /**
   * Загружает мероприятия пользователя
   */
    private loadMyEvents(): void {
        this.isLoading$.next(true);

        const user = this._auth2Service.currentUser;
        let events$: Observable<EventModel[]>;

        if (user && user.role === 'ROLE_ADMIN') {
            events$ = this._eventService.getEvents({ page: this.page, size: this.size });
        } else {
            events$ = this._eventService.getEventsByCreator();
        }

        events$.subscribe({
            next: (events) => {
                this.allEvents$.next(events);
                this.isLoading$.next(false);
            },
            error: () => {
                this.isLoading$.next(false);
            }
        });
    }

    /**
   * Устанавливает фильтр для мероприятий
   */
    setFilter(filter: 'all' | 'upcoming' | 'past'): void {
        this.selectedFilter$.next(filter);
    }

    /**
   * Обработчик изменения поискового запроса
   */
    onSearchChange(query: string): void {
        this.searchQuery$.next(query);
    }

    /**
   * Применяет фильтры к мероприятиям
   */
    private setupFilteredEventsStream(): void {
        this.filteredEvents$ = combineLatest([
            this.allEvents$,
            this.selectedFilter$,
            this.searchQuery$.pipe(startWith(''))
        ]).pipe(
            map(([allEvents, selectedFilter, searchQuery]) => {
                let events: EventModel[];
                const now = new Date();

                // Категоризация
                switch (selectedFilter) {
                    case 'upcoming':
                        events = allEvents.filter(e => new Date(e.dateStart) > now);
                        break;
                    case 'past':
                        events = allEvents.filter(e => new Date(e.dateEnd) < now);
                        break;
                    default:
                        events = [...allEvents];
                }

                // Поиск
                if (searchQuery.trim()) {
                    const query = searchQuery.toLowerCase().trim();
                    events = events.filter(event =>
                        event.eventName.toLowerCase().includes(query) ||
            event.eventDescription.toLowerCase().includes(query) ||
            event.place.toLowerCase().includes(query)
                    );
                }

                return events;
            })
        );
    }

    /**
   * Получает URL изображения мероприятия
   */
    public getEventImageUrl(fileName: string): string {
        if (!fileName || fileName === 'default.jpg') {
            return '/assets/images/default-event.jpg';
        }

        return `http://188.226.91.215:43546/api/v1/images/${fileName}`;
    }

    /**
   * Обработчик ошибки загрузки изображения
   */
    public onImageError(event: Event): void {
        const target = event.target as HTMLImageElement;
        target.src = '/assets/images/default-event.jpg';
    }

    /**
   * Получает статус мероприятия
   */
    public getEventStatus(event: EventModel): string {
        const now: Date = new Date();
        const startDate: Date = new Date(event.dateStart);
        const endDate: Date = new Date(event.dateEnd);

        if (now < startDate) {
            return 'upcoming';
        }
        if (now > endDate) {
            return 'past';
        }

        return 'active';
    }

    /**
   * Получает текст статуса мероприятия
   */
    public getEventStatusText(event: EventModel): string {
        const status: string = this.getEventStatus(event);
        switch (status) {
            case 'upcoming':
                return 'Предстоящее';
            case 'active':
                return 'Активное';
            case 'past':
                return 'Завершено';
            default:
                return '';
        }
    }

    /**
   * Форматирует дату
   */
    public formatDate(dateString: string): string {
        const date: Date = new Date(dateString);

        return date.toLocaleDateString('ru-RU', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    }

    /**
   * Удаляет мероприятие
   */
    deleteEvent(eventId?: number): void {
        if (eventId == null) {return;} // Не делать ничего, если id нет
        this.isLoading$.next(true);
        this._eventService.deleteEventById(eventId).subscribe({
            next: () => {
                const updated = this.allEvents$.getValue().filter(e => e.id !== eventId);
                this.allEvents$.next(updated);
                this.isLoading$.next(false);
                this.cancelDelete();
            },
            error: () => {
                this.isLoading$.next(false);
            }
        });
    }

    /**
     *
     */
    updateEvent(updatedEvent: EventModel): void {
        const events = this.allEvents$.getValue();
        const idx = events.findIndex(e => e.id === updatedEvent.id);
        if (idx !== -1) {
            events[idx] = updatedEvent;
            this.allEvents$.next([...events]);
        }
    }

    /**
   * Получает название категории
   */
    public getCategoryName(categoryKey: string): string {
        return this.categoryOptions[categoryKey] || categoryKey;
    }

    /**
   * Получает название жанра
   */
    public getGenreName(genreKey: string): string {
        return this.genreOptions[genreKey] || genreKey;
    }

    /**
   * Переход к просмотру мероприятия
   */
    public viewEvent(eventId: number): void {
        this._router.navigate(['/event', eventId]);
    }

    /**
   * Подтверждение удаления мероприятия
   */
    public confirmDelete(event: EventModel): void {
        this.eventToDelete = event;
        this.showDeleteModal = true;
    }

    /**
   * Отмена удаления мероприятия
   */
    public cancelDelete(): void {
        this.showDeleteModal = false;
        this.eventToDelete = null;
    }

    /**
   * Переход к созданию нового мероприятия
   */
    public createNewEvent(): void {
        this._router.navigate(['/create-event']);
    }

    /**
   * Получает заголовок для пустого состояния
   */
    emptyStateTitle$ = this.selectedFilter$.pipe(
        map(selectedFilter => {
            switch (selectedFilter) {
                case 'upcoming':
                    return 'Нет предстоящих мероприятий';
                case 'past':
                    return 'Нет завершенных мероприятий';
                default:
                    return 'У вас пока нет мероприятий';
            }
        })
    );

    /**
   * Получает сообщение для пустого состояния
   */
    emptyStateMessage$ = combineLatest([this.searchQuery$, this.selectedFilter$]).pipe(
        map(([searchQuery, selectedFilter]) => {
            if (searchQuery.trim()) {
                return `По запросу "${searchQuery}" ничего не найдено`;
            }
            switch (selectedFilter) {
                case 'upcoming':
                    return 'Создайте новое мероприятие, чтобы оно появилось в этом разделе';
                case 'past':
                    return 'Здесь будут отображаться завершенные мероприятия';
                default:
                    return 'Создайте свое первое мероприятие, чтобы начать!';
            }
        })
    );
}
