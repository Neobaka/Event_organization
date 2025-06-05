import { Component, Input, ChangeDetectionStrategy } from '@angular/core';

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,selector: 'app-svg-icon',
    imports: [],
    templateUrl: './svg-icon.component.html',
    styles: [':host{cursor: pointer}']
})
export class SvgIconComponent {
  @Input() name!: string;
  @Input() alt = '';

  /**
   *
   */
  public get iconPath(): string {
      // Формируем путь к SVG-спрайту
      return `assets/svg/${this.name}.svg`;
  }
}
