import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-svg-icon',
  imports: [],
  templateUrl: './svg-icon.component.html',
  styles: [':host{cursor: pointer}']
})
export class SvgIconComponent {
  @Input() name!: string;
  //@Input() size: string = '20';
  //@Input() color: string = '';
  @Input() alt: string = '';

  get iconPath(): string {
    // Формируем путь к SVG-спрайту
    return `assets/svg/${this.name}.svg`;
  }
}
