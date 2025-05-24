import { Component } from '@angular/core';
import {HeaderComponent} from '../../common-ui/header/header.component';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {KeyValuePipe, NgForOf, NgIf} from '@angular/common';
import {CATEGORY} from '../../events_data/event-category';
import {GENRE} from '../../events_data/event-genre';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import {EventService} from '../../events_data/event.service';
import {Router} from '@angular/router';
import {Auth2Service} from '../../auth/auth2.service';
import {ImageService} from '../../images_data/image.service';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-create-event-page',
  imports: [
    HeaderComponent,
    ReactiveFormsModule,
    NgIf,
    NgForOf,
    KeyValuePipe,
    MatFormFieldModule,
    MatSelectModule,
    MatIconModule
  ],
  templateUrl: './create-event-page.component.html',
  styleUrl: './create-event-page.component.scss'
})
export class CreateEventPageComponent {
  filePreviewUrl: string | null = null;
  form: FormGroup;
  submitted = false;
  categoryOptions = CATEGORY;
  genreOptions = GENRE;
  currentUserId: number = 0;
  fileName:string | null  = null;
  selectedFile: File | null = null;

  showCategoryDropdown = false;
  showGenreDropdown = false;

  selectedCategory: string | null = null;
  selectedGenre: string | null = null;

  toggleCategoryDropdown() {
    this.showCategoryDropdown = !this.showCategoryDropdown;
    if (this.showCategoryDropdown) this.showGenreDropdown = false;
  }

  toggleGenreDropdown() {
    this.showGenreDropdown = !this.showGenreDropdown;
    if (this.showGenreDropdown) this.showCategoryDropdown = false;
  }

  selectCategory(key: string) {
    this.selectedCategory = key;
    this.form.controls['category'].setValue(key);
    this.showCategoryDropdown = false;
  }

  selectGenre(key: string) {
    this.selectedGenre = key;
    this.form.controls['genre'].setValue(key);
    this.showGenreDropdown = false; // закроем после выбора
  }

  constructor(
    private fb: FormBuilder,
    private eventService: EventService,
    private router: Router,
    private auth2Service: Auth2Service,
    private imageService: ImageService,
    private http: HttpClient,
  ) {
    this.form = this.fb.group({
      title: ['', Validators.required],
      category: ['', Validators.required],
      genre: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      description: ['', Validators.required],
      cost: ['', Validators.required],
      address: ['', Validators.required],
      organization: ['', Validators.required],
      website: ['', Validators.required],
      fileName: ['', Validators.required],
    });
    this.auth2Service.getUserProfileFromApi().subscribe({
      next: (profile) => {
        this.currentUserId = profile.id;
      },
      error: (err) => {
        // обработать ошибку
        console.error('Ошибка получения профиля пользователя', err);
      }
    });
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      this.fileName = this.selectedFile.name;

      // Создаём превью
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.filePreviewUrl = e.target.result;
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  uploadImage() {
    if (!this.selectedFile) return;

    const formData = new FormData();
    formData.append('file', this.selectedFile); // <-- ключ 'file' обязателен!

    this.http.post<{ fileName: string }>(
      'http://188.226.91.215:43546/api/v1/images/upload',
      formData
    ).subscribe({
      next: res => {
        // res.fileName - имя файла для карточки
        this.form.patchValue({ fileName: res.fileName });
      },
      error: err => {
        console.error('Ошибка загрузки файла:', err.status, err.error);
      }
    });
  }

  onGenresChange(event: Event) {
    const select = event.target as HTMLSelectElement;
    const selected = Array.from(select.selectedOptions).map(opt => opt.value);
    this.form.controls['genres'].setValue(selected);
    this.form.controls['genres'].markAsTouched();
  }

  get selectedGenreLabel(): string {
    return this.selectedGenre ? this.genreOptions[this.selectedGenre] : 'Выберите жанр мероприятия';
  }

  async onSubmit() {
    this.submitted = true;
    if (this.form.invalid) return;

    // Если файл выбран, загружаем его
    if (this.selectedFile) {
      try {
        const res = await this.imageService.uploadImage(this.selectedFile).toPromise();
        if (res) {
          this.form.patchValue({ fileName: res.fileName });
        }
      } catch (err) {
        alert('Ошибка загрузки изображения');
        return;
      }
    }

    // Собираем payload для бэка
    const payload = {
      fileName: this.form.value.fileName || 'default.jpg', // заготовка для файла
      cost: this.form.value.cost,
      creatorId: this.currentUserId,
      eventName: this.form.value.title,
      eventDescription: this.form.value.description,
      dateStart: this.form.value.startDate.split('T')[0],
      dateEnd: this.form.value.endDate.split('T')[0],
      place: this.form.value.address,
      organizerName: this.form.value.organization,
      organizerSite: this.form.value.website,
      category: this.form.value.category,
      genre: this.form.value.genre,
    };

    this.eventService.createEvent(payload).subscribe({
      next: () => {
        alert('Мероприятие успешно создано!');
        this.router.navigate(['/']);
      },
      error: (err) => {
        // err - это HttpErrorResponse
        console.error('Ошибка при создании мероприятия:');
        console.error('Status code:', err.status); // HTTP статус
        console.error('Error body:', err.error);   // Тело ответа с ошибкой
        if (err.status === 400) {
          alert('Некорректное тело запроса. Проверьте форму.');
        } else if (err.status === 401) {
          alert('Неверный Access Token!');
        } else if (err.status === 500) {
          alert('Ошибка сервера. Попробуйте позже.');
        } else {
          alert('Неизвестная ошибка. Подробности в консоли.');
        }
      }
    });
  }
}
