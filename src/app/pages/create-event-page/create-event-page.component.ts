import { Component, ChangeDetectionStrategy, inject, signal, DestroyRef } from '@angular/core';
import { HeaderComponent } from '../../common-ui/header/header.component';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CATEGORY } from '../../core/events_data/helpers/event-category';
import { GENRE } from '../../core/events_data/helpers/event-genre';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { EventService } from '../../core/events_data/services/event.service';
import { Router } from '@angular/router';
import { Auth2Service } from '../../core/auth/services/auth2.service';
import { ImageService } from '../../core/images_data/services/image.service';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import {CreateEventPayload} from '../../core/events_data/interfaces/create-event-payload';


@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'app-create-event-page',
    imports: [
        HeaderComponent,
        ReactiveFormsModule,
        CommonModule,
        MatFormFieldModule,
        MatSelectModule,
        MatIconModule,
    ],
    templateUrl: './create-event-page.component.html',
    styleUrl: './create-event-page.component.scss'
})
export class CreateEventPageComponent {
    private _fb = inject(FormBuilder);
    private _eventService = inject(EventService);
    private _router = inject(Router);
    private _auth2Service = inject(Auth2Service);
    private _imageService = inject(ImageService);
    private destroyRef = inject(DestroyRef);


    isUploaded = signal(false);
    filePreviewUrl = signal<string | null>(null);
    submitted = signal(false);
    fileName = signal<string | null>(null);
    selectedFile = signal<File | null>(null);
    showCategoryDropdown = signal(false);
    showGenreDropdown = signal(false);
    selectedCategory = signal<string | null>(null);
    selectedGenre = signal<string | null>(null);
    error = signal<string | null>(null);

    userProfile = toSignal(this._auth2Service.getUserProfileFromApi(), { initialValue: null });

    categoryOptions: typeof CATEGORY = CATEGORY;
    genreOptions: typeof GENRE = GENRE;

    form: FormGroup;

    constructor(
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
    this.form.get('category')!.valueChanges
        .pipe(takeUntilDestroyed())
        .subscribe(val => this.selectedCategory.set(val));
    this.form.get('genre')!.valueChanges
        .pipe(takeUntilDestroyed())
        .subscribe(val => this.selectedGenre.set(val));
    }

    /**
     *
     */
    get selectedGenreLabel(): string {
        return this.selectedGenre() ? this.genreOptions[this.selectedGenre()!] : 'Выберите жанр мероприятия';
    }

    /**
   *
   */
    toggleCategoryDropdown(): void {
        this.showCategoryDropdown.set(!this.showCategoryDropdown());
        if (this.showCategoryDropdown()) {this.showGenreDropdown.set(false);}
    }



    /**
   *
   */
    toggleGenreDropdown(): void {
        this.showGenreDropdown.set(!this.showGenreDropdown());
        if (this.showGenreDropdown()) {this.showCategoryDropdown.set(false);}
    }

    /**
   *
   */
    selectCategory(key: string): void {
        this.selectedCategory.set(key);
        this.form.controls['category'].setValue(key);
        this.showCategoryDropdown.set(false);
    }

    /**
   *
   */
    selectGenre(key: string): void {
        this.selectedGenre.set(key);
        this.form.controls['genre'].setValue(key);
        this.showGenreDropdown.set(false);
    }

    /**
   *
   */
    onFileSelected(event: Event): void {
        const input: HTMLInputElement = event.target as HTMLInputElement;
        if (input.files && input.files.length > 0) {
            const file = input.files[0];
            this.selectedFile.set(file);
            this.fileName.set(file.name);

            const reader: FileReader = new FileReader();
            reader.onload = (e: ProgressEvent<FileReader>) => {
                this.filePreviewUrl.set(e.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
    }

    /**
   *
   */
    uploadImage(): void {
      const file = this.selectedFile();
      if (!file) return;

      this._imageService.uploadImage(file)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: (res) => {
            this.isUploaded.set(true);
            this.form.patchValue({ fileName: res.fileName });
          },
          error: () => {
            this.error.set('Ошибка загрузки файла');
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
    async onSubmit(): Promise<void> {
        this.submitted.set(true);
        if (this.form.invalid) {return;}

        // Если файл выбран, загружаем его
        if (this.selectedFile()) {
            try {
                const res = await this._imageService.uploadImage(this.selectedFile()!).toPromise();
                if (res) {
                    this.form.patchValue({ fileName: res.fileName });
                }
            } catch (error) {
                this.error.set('Ошибка загрузки изображения');

                return;
            }
        }

        // Собираем payload
        const user = this.userProfile();
        if (!user) {
            this.error.set('Не удалось получить пользователя');

            return;
        }

        const payload: CreateEventPayload = {
            fileName: this.form.value.fileName || 'default.jpg',
            cost: Number(this.form.value.cost),
            creatorId: user.id,
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
                this.error.set('Ошибка при создании мероприятия');
            }
        });
    }
}
