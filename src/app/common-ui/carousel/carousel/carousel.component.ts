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
  @ViewChild('viewport', { static: true }) viewportRef!: ElementRef<HTMLDivElement>;
  @Input() gap = 20; // Отступ между слайдами в px
  @ViewChild('track', {static: true}) trackRef!: ElementRef<HTMLDivElement>;

  private wheelTimeout: any = null;
  private wheelLocked = false;

  slideWidthPx = 0;
  currentIndex = 0;
  totalSlides = 0;
  slidesToShow = 0;

  constructor(private cdr: ChangeDetectorRef) {}

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.updateLayout();
      this.cdr.detectChanges();
    });
    window.addEventListener('resize', this.onResize);
  }

  ngOnDestroy(): void {
    window.removeEventListener('resize', this.onResize);
  }

  onResize = () => {
    this.updateLayout();
    this.cdr.detectChanges();
  };

  updateLayout(): void {
    const trackEl = this.trackRef.nativeElement;
    const viewportEl = this.viewportRef.nativeElement;
    this.totalSlides = trackEl.children.length;

    if (this.totalSlides > 0) {
      const firstSlide = trackEl.children[0] as HTMLElement;
      // slideWidthPx = ширина слайда + gap
      this.slideWidthPx = firstSlide.offsetWidth + this.gap;
      // viewportWidth = ширина видимой области
      const viewportWidth = viewportEl.offsetWidth;
      // сколько целых слайдов помещается
      this.slidesToShow = Math.floor(viewportWidth / this.slideWidthPx);
      if (this.slidesToShow < 1) this.slidesToShow = 1;
      if (this.slidesToShow > this.totalSlides) this.slidesToShow = this.totalSlides;
      // сбрасываем currentIndex если он стал слишком большим
      if (this.currentIndex > this.totalSlides - this.slidesToShow) {
        this.currentIndex = Math.max(0, this.totalSlides - this.slidesToShow);
      }
    }
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
    return `translateX(-${this.currentIndex * this.slideWidthPx}px)`;
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
    }

    this.wheelLocked = true;
    setTimeout(() => this.wheelLocked = false, 200);
  }
}

