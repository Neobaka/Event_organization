import {
  Component,
  Input,
  ContentChildren,
  QueryList,
  AfterViewInit,
  ElementRef,
  ViewChild,
  SimpleChanges, ChangeDetectorRef
} from '@angular/core';
import {NgStyle} from '@angular/common';

@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.scss'],
  imports: [
    NgStyle
  ],
  standalone: true
})
export class CarouselComponent implements AfterViewInit {
  @Input() slidesToShow = 4; // Количество видимых слайдов
  @Input() gap = 20; // Отступ между слайдами в px
  @ViewChild('track', {static: true}) trackRef!: ElementRef<HTMLDivElement>;

  private wheelTimeout: any = null;
  private wheelLocked = false;


  currentIndex = 0;
  totalSlides = 0;

  constructor(private cdr: ChangeDetectorRef) {
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.totalSlides = this.trackRef.nativeElement.children.length;
      this.cdr.detectChanges();
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['slidesToShow'] || changes['gap']) {
      setTimeout(() => {
        this.currentIndex = 0;
        this.totalSlides = this.trackRef.nativeElement.children.length;
        this.cdr.detectChanges();
      });
    }
  }


  prev(): void {
    if (this.currentIndex > 0) {
      this.currentIndex--;
    }
  }

  next(): void {
    if (this.currentIndex < this.totalSlides - this.slidesToShow) {
      this.currentIndex++;
    }
  }

  get canGoPrev(): boolean {
    return this.currentIndex > 0;
  }

  get canGoNext(): boolean {
    return this.currentIndex < this.totalSlides - this.slidesToShow;
  }


  getTransform(): string {
    // Рассчитываем смещение для track
    const slideWidth = 100 / this.slidesToShow;
    return `translateX(-${this.currentIndex * slideWidth}%)`;
  }

  getSlideStyle(): object {
    return {
      'min-width': `calc(${100 / this.slidesToShow}% - ${this.gap}px)`,
      'margin-right': `${this.gap}px`
    };
  }


  onWheel(event: WheelEvent): void {
    event.preventDefault();

    if (this.wheelLocked) return;

    // Для тачпада и горизонтального скролла
    if (Math.abs(event.deltaX) > Math.abs(event.deltaY)) {
      if (event.deltaX > 0) {
        this.next();
      } else if (event.deltaX < 0) {
        this.prev();
      }
    } else {
      // Обычный вертикальный скролл
      if (event.deltaY > 0) {
        this.next();
      } else if (event.deltaY < 0) {
        this.prev();
      }
    }

    this.wheelLocked = true;
    setTimeout(() => this.wheelLocked = false, 200);
  }
}

