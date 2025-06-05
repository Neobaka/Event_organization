import { Component, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { HeaderComponent } from '../../common-ui/header/header.component';
import { NgForOf, NgIf, SlicePipe, NgClass } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { EventService } from '../../events_data/event.service';
import { Auth2Service } from '../../auth/services/auth2.service';
import { CATEGORY } from '../../events_data/event-category';
import { GENRE } from '../../events_data/event-genre';
import { EventModel } from '../../events_data/event-model';
import { Subject } from 'rxjs';
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
    ],
    templateUrl: './created-event-page.component.html',
    styleUrl: './created-event-page.component.scss'
})
export class CreatedEventPageComponent implements OnInit, OnDestroy {

    public allEvents: EventModel[] = [];
    public filteredEvents: EventModel[] = [];
    public upcomingEvents: EventModel[] = [];
    public pastEvents: EventModel[] = [];

    public page = 0;
    public size = 100;

    public selectedFilter: 'all' | 'upcoming' | 'past' = 'all';
    public searchQuery = '';
    public isLoading = false;

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
    ) { }

    public ngOnInit(): void {
        this.loadMyEvents();
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
    public loadMyEvents(): void {
        this.isLoading = true;

        const user: any = this._auth2Service.currentUser;
        if (user && user.role === 'ROLE_ADMIN') {
            // Админ — получаем все мероприятия
            this._eventService.getEvents(this.page, this.size)
                .pipe(takeUntil(this._destroy$))
                .subscribe({
                    next: (events: EventModel[]) => {
                        this.allEvents = events;
                        this.categorizeEvents();
                        this.applyFilters();
                        this.isLoading = false;
                    },
                    error: (err: any) => {
                        console.error('Ошибка загрузки мероприятий:', err);
                        this.isLoading = false;
                    }
                });
        } else {
            // Креатор — только свои мероприятия
            this._eventService.getEventsByCreator()
                .pipe(takeUntil(this._destroy$))
                .subscribe({
                    next: (events: EventModel[]) => {
                        this.allEvents = events;
                        this.categorizeEvents();
                        this.applyFilters();
                        this.isLoading = false;
                    },
                    error: (err: any) => {
                        console.error('Ошибка загрузки мероприятий:', err);
                        this.isLoading = false;
                    }
                });
        }
    }

    /**
   * Категоризирует мероприятия по времени
   */
    public categorizeEvents(): void {
        const now: Date = new Date();

        this.upcomingEvents = this.allEvents.filter((event: EventModel) =>
            new Date(event.dateStart) > now
        );

        this.pastEvents = this.allEvents.filter((event: EventModel) =>
            new Date(event.dateEnd) < now
        );
    }

    /**
   * Устанавливает фильтр для мероприятий
   */
    public setFilter(filter: 'all' | 'upcoming' | 'past'): void {
        this.selectedFilter = filter;
        this.applyFilters();
    }

    /**
   * Обработчик изменения поискового запроса
   */
    public onSearchChange(): void {
        this.applyFilters();
    }

    /**
   * Применяет фильтры к мероприятиям
   */
    public applyFilters(): void {
        let events: EventModel[] = [];

        // Фильтрация по типу
        switch (this.selectedFilter) {
            case 'all':
                events = [...this.allEvents];
                break;
            case 'upcoming':
                events = [...this.upcomingEvents];
                break;
            case 'past':
                events = [...this.pastEvents];
                break;
        }

        // Поискфильтр
        if (this.searchQuery.trim()) {
            const query: string = this.searchQuery.toLowerCase().trim();
            events = events.filter((event: EventModel) =>
                event.eventName.toLowerCase().includes(query) ||
        event.eventDescription.toLowerCase().includes(query) ||
        event.place.toLowerCase().includes(query)
            );
        }

        this.filteredEvents = events;
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

        if (now < startDate) { return 'upcoming'; }
        if (now > endDate) { return 'past'; }

        return 'active';
    }

    /**
   * Получает текст статуса мероприятия
   */
    public getEventStatusText(event: EventModel): string {
        const status: string = this.getEventStatus(event);
        switch (status) {
            case 'upcoming': return 'Предстоящее';
            case 'active': return 'Активное';
            case 'past': return 'Завершено';
            default: return '';
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
    public deleteEvent(): void {
        if (!this.eventToDelete) { return; }
        this.isLoading = true;
        this._eventService.deleteEventById(this.eventToDelete.id)
            .pipe(takeUntil(this._destroy$))
            .subscribe({
                next: () => {
                    // Удаляем из локального массива
                    this.allEvents = this.allEvents.filter((e: EventModel) => e.id !== this.eventToDelete!.id);
                    this.categorizeEvents();
                    this.applyFilters();
                    this.cancelDelete();
                    this.isLoading = false;
                },
                error: (err: any) => {
                    console.error('Ошибка удаления мероприятия:', err);
                    this.isLoading = false;
                }
            });
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
    public getEmptyStateTitle(): string {
        switch (this.selectedFilter) {
            case 'upcoming': return 'Нет предстоящих мероприятий';
            case 'past': return 'Нет завершенных мероприятий';
            default: return 'У вас пока нет мероприятий';
        }
    }

    /**
   * Получает сообщение для пустого состояния
   */
    public getEmptyStateMessage(): string {
        if (this.searchQuery.trim()) {
            return `По запросу "${this.searchQuery}" ничего не найдено`;
        }

        switch (this.selectedFilter) {
            case 'upcoming': return 'Создайте новое мероприятие, чтобы оно появилось в этом разделе';
            case 'past': return 'Здесь будут отображаться завершенные мероприятия';
            default: return 'Создайте свое первое мероприятие, чтобы начать!';
        }
    }
}
