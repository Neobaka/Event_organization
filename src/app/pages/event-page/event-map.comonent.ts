import { Component, Input, AfterViewInit } from '@angular/core';

declare const ymaps: any;

@Component({
  selector: 'app-event-map',
  template: '<div id="yandex-map" style="width: 100%; height: 400px;"></div>'
})
export class EventMapComponent implements AfterViewInit {
  @Input() latitude: number = 56.8519;
  @Input() longitude: number = 60.6122;

  ngAfterViewInit(): void {
    if (typeof ymaps !== 'undefined') {
      ymaps.ready(() => {
        setTimeout(() => {
          const map = new ymaps.Map('yandex-map', {
            center: [this.latitude, this.longitude],
            zoom: 16,
            controls: ['zoomControl']
          });

          const placemark = new ymaps.Placemark([this.latitude, this.longitude], {
            balloonContent: 'Место проведения мероприятия'
          });

          map.geoObjects.add(placemark);
        }, 0); // можно увеличить задержку до 100 мс, если всё ещё не видно
      });
    }
  }
}
