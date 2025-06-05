import {
    ChangeDetectorRef,
    Component,
    ElementRef, HostListener,
    Input,
    OnInit,
    ViewChild,
    ViewEncapsulation
} from '@angular/core';
import { EventModel } from '../../core/events_data/interfaces/event-model';
import { EventService } from '../../core/events_data/services/event.service';
import { EventCardComponent } from '../../common-ui/event-card/component/event-card.component';
import { NgForOf, NgIf } from '@angular/common';
import {CarouselComponent} from '../../common-ui/carousel/component/carousel.component';

@Component({
    selector: 'app-event-card-block',
    templateUrl: './event-card-block.component.html',
    imports: [
        EventCardComponent,
        NgForOf,
        NgIf,
        CarouselComponent
    ],
    encapsulation: ViewEncapsulation.None,
    styleUrls: ['./event-card-block.component.scss']
})
export class EventCardBlockComponent implements OnInit {
  @Input() title = '';
  @Input() events: EventModel[] = [];
  private readonly CARD_WIDTH = 410;
  private readonly MIN_GAP = 10;
  private readonly MAX_GAP = 40;
  @ViewChild('container', { static: true }) containerRef!: ElementRef<HTMLDivElement>;
  public slidesToShow = 1;
  public gap = this.MIN_GAP;

  /**
   * Пересчитывает количество карточек и отступ между ними по ширине окна
   */
  updateLayout(): void {
      // Если контейнер ещё не отрисован — fallback на window.innerWidth
      const containerWidth = this.containerRef?.nativeElement?.offsetWidth || window.innerWidth;
      let maxCards = Math.floor(containerWidth / this.CARD_WIDTH);
      if (maxCards < 1) {maxCards = 1;}

      for (let cards = maxCards; cards > 0; cards--) {
          const gap = cards > 1
              ? (containerWidth - cards * this.CARD_WIDTH) / (cards - 1)
              : 0;
          if (gap >= this.MIN_GAP && gap <= this.MAX_GAP) {
              this.slidesToShow = cards;
              this.gap = Math.round(gap);

              return;
          }
      }
      this.slidesToShow = 1;
      this.gap = this.MIN_GAP;
  }


  constructor(
    private eventService: EventService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
      this.updateLayout();
  }

  @HostListener('window:resize')
      onResize = () => {
          this.updateLayout();
          this.cdr.detectChanges();
      };
}

