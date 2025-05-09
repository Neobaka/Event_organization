import { NgOptimizedImage } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Auth2Service } from '../../auth/auth2.service';
import firebase from 'firebase/compat/app';
import { AngularFireAuth } from '@angular/fire/compat/auth';


//Поскольку используем compat API, везде, где есть ссылака на User, нужно использовать тип из firebase/compat/app
type User = firebase.User;

@Component({
  selector: 'app-user-profile-data-block',
  imports: [
    NgOptimizedImage
  ],
  templateUrl: './user-profile-data-block.component.html',
  styleUrl: './user-profile-data-block.component.scss'
})
export class UserProfileDataBlockComponent implements OnInit {
  userData: any = null;

  constructor(private authService: Auth2Service) { }

  ngOnInit(): void {
    this.authService.getUserProfileFromApi().subscribe({
      next: (data) => {
        this.userData = data;
      },
      error: (err) => {
        console.error('Ошибка при получении данных профиля:', err);
      }
    });
  }
}
