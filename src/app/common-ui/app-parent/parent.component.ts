import { Component } from '@angular/core';
import { RegistrationModalComponent } from '../registration-modal/registration-modal.component';

@Component({
  selector: 'app-parent',
  standalone: true, 
  imports: [RegistrationModalComponent],
  templateUrl: './parent.component.html',
  styleUrls: ['./parent.component.scss'],
})
export class ParentComponent {
  isModalOpen = false;

  openModal(): void {
    console.log('Модальное окро открыто');
    this.isModalOpen = true;
  }

  closeModal(): void {
    console.log('Модальное окно закрыто');
    this.isModalOpen = false;
  }
}
