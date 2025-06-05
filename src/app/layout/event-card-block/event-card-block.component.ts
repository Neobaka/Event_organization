import {
    ChangeDetectorRef,
    Component,
    ElementRef,
    Input,
    OnDestroy,
    OnInit,
    ViewChild,
    ViewEncapsulation,
    ChangeDetectionStrategy
} from '@angular/core';
import { EventModel } from '../../core/events_data/interfaces/event-model';
import { EventService } from '../../core/events_data/services/event.service';
import { EventCardComponent } from '../../common-ui/event-card/component/event-card.component';
import { NgForOf, NgIf } from '@angular/common';
import { CarouselComponent } from '../../common-ui/carousel/component/carousel.component';

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'app-event-card-block',
    templateUrl: './event-card-block.component.html',
    imports: [
        EventCardComponent,
        NgForOf,
        CarouselComponent,
        NgIf
    ],
    encapsulation: ViewEncapsulation.None,
    styleUrls: ['./event-card-block.component.scss']
})
export class EventCardBlockComponent implements OnInit, OnDestroy {
  @Input() public title = '';
  @Input() public events: EventModel[] = [];
  @ViewChild('container', { static: true }) public containerRef!: ElementRef<HTMLDivElement>;
  public slidesToShow = 1;
  public gap: number = this._MIN_GAP;

  private readonly _CARD_WIDTH: number = 410;
  private readonly _MIN_GAP: number = 10;
  private readonly _MAX_GAP: number = 40;

  constructor(
    private _eventService: EventService,
    private _cdr: ChangeDetectorRef
  ) { }

  public ngOnInit(): void {
      this.updateLayout();
      window.addEventListener('resize', this.onResize);
  }

  public ngOnDestroy(): void {
      window.removeEventListener('resize', this.onResize);
  }

  /**
   * Пересчитывает количество карточек и отступ между ними по ширине окна
   */
  public updateLayout(): void {
      // Если контейнер ещё не отрисован — fallback на window.innerWidth
      const containerWidth: number = this.containerRef?.nativeElement?.offsetWidth || window.innerWidth;
      let maxCards: number = Math.floor(containerWidth / this._CARD_WIDTH);
      if (maxCards < 1) {
          maxCards = 1;
      }
      for (let cards: number = maxCards; cards > 0; cards--) {
          const gap: number = cards > 1
              ? (containerWidth - cards * this._CARD_WIDTH) / (cards - 1)
              : 0;
          if (gap >= this._MIN_GAP && gap <= this._MAX_GAP) {
              this.slidesToShow = cards;
              this.gap = Math.round(gap);

              return;
          }
      }
      this.slidesToShow = 1;
      this.gap = this._MIN_GAP;
  }

  // Оборачиваем updateLayout для корректного удаления обработчика
  public onResize = (): void => {
      this.updateLayout();
      this._cdr.detectChanges(); // Явно запускаем детект изменений
  };
}
