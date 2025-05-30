import { Component, Input, AfterViewInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

declare const ymaps: any;

@Component({
  selector: 'app-event-map',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div id="yandex-map" style="width: 100%; height: 400px;">
      <div *ngIf="isLoading" style="display: flex; align-items: center; justify-content: center; height: 100%; background: #f0f0f0;">
        Загрузка карты...
      </div>
    </div>
  `
})
export class EventMapComponent implements AfterViewInit, OnChanges {
  @Input() latitude?: number;
  @Input() longitude?: number;
  @Input() place?: string; // Новый input для названия места
  @Input() apiKey?: string; // API ключ для геокодирования (опционально)

  private map: any;
  private placemark: any;
  isLoading = true;

  // Координаты по умолчанию (Екатеринбург)
  private defaultLatitude = 56.8519;
  private defaultLongitude = 60.6122;

  ngAfterViewInit(): void {
    this.initializeMap();
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Если изменилось место или координаты, обновляем карту
    if (changes['place'] || changes['latitude'] || changes['longitude']) {
      if (this.map) {
        this.updateMapLocation();
      }
    }
  }

  private initializeMap(): void {
    if (typeof ymaps !== 'undefined') {
      ymaps.ready(() => {
        setTimeout(() => {
          this.createMap();
          this.updateMapLocation();
        }, 100);
      });
    } else {
      console.error('Яндекс.Карты не загружены');
      this.isLoading = false;
    }
  }

  private createMap(): void {
    this.map = new ymaps.Map('yandex-map', {
      center: [this.defaultLatitude, this.defaultLongitude],
      zoom: 16,
      controls: ['zoomControl', 'fullscreenControl']
    });

    this.isLoading = false;
  }

  private updateMapLocation(): void {
    if (!this.map) return;

    // Если есть точные координаты, используем их
    if (this.latitude && this.longitude) {
      this.setMapLocation(this.latitude, this.longitude, this.place || 'Место проведения мероприятия');
      return;
    }

    // Если есть название места, ищем его через геокодирование
    if (this.place && this.place.trim()) {
      this.geocodePlace(this.place.trim());
    } else {
      // Используем координаты по умолчанию
      this.setMapLocation(this.defaultLatitude, this.defaultLongitude, 'Место не указано');
    }
  }

  private geocodePlace(placeName: string): void {
    this.isLoading = true;

    // Используем геокодер Яндекс.Карт
    ymaps.geocode(placeName, {
      results: 1, // Получаем только первый результат
      boundedBy: [[56.7, 60.4], [57.0, 60.8]] // Ограничиваем поиск Екатеринбургом
    }).then((result: any) => {
      const firstGeoObject = result.geoObjects.get(0);

      if (firstGeoObject) {
        const coordinates = firstGeoObject.geometry.getCoordinates();
        const foundAddress = firstGeoObject.getAddressLine();

        this.setMapLocation(
          coordinates[0],
          coordinates[1],
          `${placeName}\n${foundAddress}`
        );
      } else {
        console.warn(`Место "${placeName}" не найдено`);
        this.setMapLocation(
          this.defaultLatitude,
          this.defaultLongitude,
          `${placeName}\n(координаты не найдены)`
        );
      }

      this.isLoading = false;
    }).catch((error: any) => {
      console.error('Ошибка геокодирования:', error);
      this.setMapLocation(
        this.defaultLatitude,
        this.defaultLongitude,
        `${placeName}\n(ошибка поиска)`
      );
      this.isLoading = false;
    });
  }

  private setMapLocation(lat: number, lng: number, balloonText: string): void {
    if (!this.map) return;

    // Удаляем предыдущую метку
    if (this.placemark) {
      this.map.geoObjects.remove(this.placemark);
    }

    // Создаем новую метку
    this.placemark = new ymaps.Placemark([lat, lng], {
      balloonContent: balloonText,
      hintContent: balloonText.split('\n')[0] // Показываем только название в подсказке
    }, {
      preset: 'islands#redDotIcon' // Красная метка
    });

    // Добавляем метку на карту
    this.map.geoObjects.add(this.placemark);

    // Центрируем карту на метке
    this.map.setCenter([lat, lng], 16, {
      checkZoomRange: true
    });
  }
}
