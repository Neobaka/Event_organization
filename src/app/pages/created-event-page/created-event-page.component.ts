import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../../common-ui/header/header.component';
import { NgForOf, NgIf, SlicePipe, DatePipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { EventService } from '../../events_data/event.service';
import { Auth2Service } from '../../auth/auth2.service';
import { CATEGORY } from '../../events_data/event-category';
import { GENRE } from '../../events_data/event-genre';

interface MyEvent {
  id: number;
  eventName: string;
  eventDescription: string;
  dateStart: string;
  dateEnd: string;
  place: string;
  organizerName: string;
  organizerSite: string;
  cost: number;
  fileName: string;
  category: string;
  genre: string;
  creatorId: number;
  createdAt?: string;
  views?: number;
  participants?: number;
}

@Component({
  selector: 'app-my-events-page',
  imports: [
    HeaderComponent,
    NgForOf,
    NgIf,
    MatIconModule,
    FormsModule,
    SlicePipe,
    DatePipe
  ],
  templateUrl: './created-event-page.component.html',
  styleUrl: './created-event-page.component.scss'
})
export class CreatedEventPageComponent implements OnInit {
  allEvents: MyEvent[] = [];
  filteredEvents: MyEvent[] = [];
  upcomingEvents: MyEvent[] = [];
  pastEvents: MyEvent[] = [];

  selectedFilter: 'all' | 'upcoming' | 'past' = 'all';
  searchQuery: string = '';
  isLoading: boolean = false;

  // Модальное окно удаления
  showDeleteModal: boolean = false;
  eventToDelete: MyEvent | null = null;

  categoryOptions = CATEGORY;
  genreOptions = GENRE;
  currentUserId: number = 0;

  constructor(
    private eventService: EventService,
    private auth2Service: Auth2Service,
    private router: Router
  ) { }

  ngOnInit() {
    this.loadCurrentUser();
    this.loadMyEvents();
  }

  loadCurrentUser() {
    this.auth2Service.getUserProfileFromApi().subscribe({
      next: (profile) => {
        this.currentUserId = profile.id;
        this.loadMyEvents();
      },
      error: (err) => {
        console.error('Ошибка получения профиля пользователя', err);
      }
    });
  }

  loadMyEvents() {
    if (!this.currentUserId) return;

    this.isLoading = true;

    // Получаем все события и фильтруем по создателю
    this.eventService.getEvents(1, 1000).subscribe({
      next: (events: any[]) => {
        // Фильтруем события по создателю
        this.allEvents = events.filter(event => event.creatorId === this.currentUserId);
        this.categorizeEvents();
        this.applyFilters();
        this.isLoading = false;
      },
      error: (err: any) => {
        console.error('Ошибка загрузки мероприятий:', err);
        this.isLoading = false;
        // Показать уведомление об ошибке
      }
    });
  }

  categorizeEvents() {
    const now = new Date();

    this.upcomingEvents = this.allEvents.filter(event =>
      new Date(event.dateStart) > now
    );

    this.pastEvents = this.allEvents.filter(event =>
      new Date(event.dateEnd) < now
    );
  }

  setFilter(filter: 'all' | 'upcoming' | 'past') {
    this.selectedFilter = filter;
    this.applyFilters();
  }

  onSearchChange() {
    this.applyFilters();
  }

  applyFilters() {
    let events: MyEvent[] = [];

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
      const query = this.searchQuery.toLowerCase().trim();
      events = events.filter(event =>
        event.eventName.toLowerCase().includes(query) ||
        event.eventDescription.toLowerCase().includes(query) ||
        event.place.toLowerCase().includes(query)
      );
    }

    this.filteredEvents = events;
  }

  getEventImageUrl(fileName: string): string {
    if (!fileName || fileName === 'default.jpg') {
      return '/assets/images/default-event.jpg';
    }
    return `http://188.226.91.215:43546/api/v1/images/${fileName}`;
  }

  onImageError(event: any) {
    event.target.src = '/assets/images/default-event.jpg';
  }

  getEventStatus(event: MyEvent): string {
    const now = new Date();
    const startDate = new Date(event.dateStart);
    const endDate = new Date(event.dateEnd);

    if (now < startDate) return 'upcoming';
    if (now > endDate) return 'past';
    return 'active';
  }

  getEventStatusText(event: MyEvent): string {
    const status = this.getEventStatus(event);
    switch (status) {
      case 'upcoming': return 'Предстоящее';
      case 'active': return 'Активное';
      case 'past': return 'Завершено';
      default: return '';
    }
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }

  formatCreatedDate(dateString?: string): string {
    if (!dateString) return 'Неизвестно';
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }

  getCategoryName(categoryKey: string): string {
    return this.categoryOptions[categoryKey] || categoryKey;
  }

  getGenreName(genreKey: string): string {
    return this.genreOptions[genreKey] || genreKey;
  }

  editEvent(eventId: number) {
    this.router.navigate(['/edit-event', eventId]);
  }

  viewEvent(eventId: number) {
    this.router.navigate(['/event', eventId]);
  }

  confirmDelete(event: MyEvent) {
    this.eventToDelete = event;
    this.showDeleteModal = true;
  }

  cancelDelete() {
    this.showDeleteModal = false;
    this.eventToDelete = null;
  }

  deleteEvent() {
    if (!this.eventToDelete) return;
    this.auth2Service.deleteEvent(this.eventToDelete.id).subscribe({
      next: () => {
        // Удаляем из локального массива
        this.allEvents = this.allEvents.filter(e => e.id !== this.eventToDelete!.id);
        this.categorizeEvents();
        this.applyFilters();
        
        // Закрываем модальное окно
        this.cancelDelete();
        
        // Показываем уведомление
        alert('Мероприятие успешно удалено!');
      },
      error: (err: any) => {
        console.error('Ошибка удаления мероприятия:', err);
        alert('Ошибка при удалении мероприятия');
      }
    });

    // Удаляем только из локального массива
    this.allEvents = this.allEvents.filter(e => e.id !== this.eventToDelete!.id);
    this.categorizeEvents();
    this.applyFilters();
    this.cancelDelete();
    alert('Мероприятие удалено из списка (временно - только локально)');
  }

  createNewEvent() {
    this.router.navigate(['/create-event']);
  }

  getEmptyStateTitle(): string {
    switch (this.selectedFilter) {
      case 'upcoming': return 'Нет предстоящих мероприятий';
      case 'past': return 'Нет завершенных мероприятий';
      default: return 'У вас пока нет мероприятий';
    }
  }

  getEmptyStateMessage(): string {
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
