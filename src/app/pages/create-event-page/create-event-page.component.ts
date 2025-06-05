import { Component, ChangeDetectionStrategy } from '@angular/core';
import { HeaderComponent } from '../../common-ui/header/header.component';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { KeyValuePipe, NgClass, NgForOf, NgIf } from '@angular/common';
import { CATEGORY } from '../../events_data/event-category';
import { GENRE } from '../../events_data/event-genre';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { EventService } from '../../events_data/event.service';
import { Router } from '@angular/router';
import { Auth2Service } from '../../auth/services/auth2.service';
import { ImageService } from '../../images_data/image.service';
import { HttpClient } from '@angular/common/http';

interface UserProfile {
  id: number;
}

interface UploadResponse {
  fileName: string;
}

interface EventPayload {
  fileName: string;
  cost: number;
  creatorId: number;
  eventName: string;
  eventDescription: string;
  dateStart: string;
  dateEnd: string;
  place: string;
  organizerName: string;
  organizerSite: string;
  category: string;
  genre: string;
}

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'app-create-event-page',
    imports: [
        HeaderComponent,
        ReactiveFormsModule,
        NgIf,
        NgForOf,
        KeyValuePipe,
        MatFormFieldModule,
        MatSelectModule,
        MatIconModule,
        NgClass
    ],
    templateUrl: './create-event-page.component.html',
    styleUrl: './create-event-page.component.scss'
})
export class CreateEventPageComponent {
    public isUploaded = false;
    public filePreviewUrl: string | null = null;
    public form: FormGroup;
    public submitted = false;
    public categoryOptions: typeof CATEGORY = CATEGORY;
    public genreOptions: typeof GENRE = GENRE;
    public currentUserId = 0;
    public fileName: string | null = null;
    public selectedFile: File | null = null;
    public showCategoryDropdown = false;
    public showGenreDropdown = false;
    public selectedCategory: string | null = null;
    public selectedGenre: string | null = null;


    /**
   *
   */
    public get selectedGenreLabel(): string {
        return this.selectedGenre ? this.genreOptions[this.selectedGenre] : 'Выберите жанр мероприятия';
    }

    constructor(
    private _fb: FormBuilder,
    private _eventService: EventService,
    private _router: Router,
    private _auth2Service: Auth2Service,
    private _imageService: ImageService,
    private _http: HttpClient,
    ) {
        this.form = this._fb.group({
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
        this._auth2Service.getUserProfileFromApi().subscribe({
            next: (profile: UserProfile) => {
                this.currentUserId = profile.id;
            },
            error: (err: unknown) => {
                // обработать ошибку
                console.error('Ошибка получения профиля пользователя', err);
            }
        });
    }

    /**
   *
   */
    public toggleCategoryDropdown(): void {
        this.showCategoryDropdown = !this.showCategoryDropdown;
        if (this.showCategoryDropdown) {
            this.showGenreDropdown = false;
        }
    }

    /**
   *
   */
    public toggleGenreDropdown(): void {
        this.showGenreDropdown = !this.showGenreDropdown;
        if (this.showGenreDropdown) {
            this.showCategoryDropdown = false;
        }
    }

    /**
   *
   */
    public selectCategory(key: string): void {
        this.selectedCategory = key;
        this.form.controls['category'].setValue(key);
        this.showCategoryDropdown = false;
    }

    /**
   *
   */
    public selectGenre(key: string): void {
        this.selectedGenre = key;
        this.form.controls['genre'].setValue(key);
        this.showGenreDropdown = false;
    }

    /**
   *
   */
    public onFileSelected(event: Event): void {
        const input: HTMLInputElement = event.target as HTMLInputElement;
        if (input.files && input.files.length > 0) {
            this.selectedFile = input.files[0];
            this.fileName = this.selectedFile.name;

            // Создаём превью
            const reader: FileReader = new FileReader();
            reader.onload = (e: ProgressEvent<FileReader>) => {
                this.filePreviewUrl = e.target?.result as string;
            };
            reader.readAsDataURL(this.selectedFile);
        }
    }

    /**
   *
   */
    public uploadImage(): void {
        if (!this.selectedFile) {
            return;
        }

        const formData: FormData = new FormData();
        formData.append('file', this.selectedFile);

        this._http.post<UploadResponse>(
            'http://188.226.91.215:43546/api/v1/images/upload',
            formData
        ).subscribe({
            next: (res: UploadResponse) => {
                this.isUploaded = true;
                this.form.patchValue({ fileName: res.fileName });
            },
            error: (err: unknown) => {
                console.error('Ошибка загрузки файла:', err);
            }
        });
    }

    /**
   *
   */
    public onGenresChange(event: Event): void {
        const select: HTMLSelectElement = event.target as HTMLSelectElement;
        const selected: string[] = Array.from(select.selectedOptions).map((opt: HTMLOptionElement) => opt.value);
        this.form.controls['genres'].setValue(selected);
        this.form.controls['genres'].markAsTouched();
    }

    /**
   *
   */
    public async onSubmit(): Promise<void> {
        this.submitted = true;
        if (this.form.invalid) {
            return;
        }

        // Если файл выбран, загружаем его
        if (this.selectedFile) {
            try {
                const res: UploadResponse | undefined = await this._imageService.uploadImage(this.selectedFile).toPromise();
                if (res) {
                    this.form.patchValue({ fileName: res.fileName });
                }
            } catch (error) {
                alert('Ошибка загрузки изображения');

                return;
            }
        }

        // Собираем payload для бэка
        const payload: EventPayload = {
            fileName: this.form.value.fileName || 'default.jpg',
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

        this._eventService.createEvent(payload).subscribe({
            next: () => {
                alert('Мероприятие успешно создано!');
                this._router.navigate(['/']);
            },
            error: (err: unknown) => {
                console.error('Ошибка при создании мероприятия:', err);

                if (err && typeof err === 'object' && 'status' in err) {
                    const httpErr = err as { status: number; error: unknown };
                    if (httpErr.status === 400) {
                        alert('Некорректное тело запроса. Проверьте форму.');
                    } else if (httpErr.status === 401) {
                        alert('Неверный Access Token!');
                    } else if (httpErr.status === 500) {
                        alert('Ошибка сервера. Попробуйте позже.');
                    } else {
                        alert('Неизвестная ошибка. Подробности в консоли.');
                    }
                } else {
                    alert('Неизвестная ошибка. Подробности в консоли.');
                }
            }
        });
    }
}
