import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-svg-icon',
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
  get iconPath(): string {
      return `assets/svg/${this.name}.svg`;
  }
}
