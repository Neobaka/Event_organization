import { Routes } from '@angular/router';
import { authGuard } from './auth/access.guard';

export const routes: Routes = [
  {
    path: 'profile',
    loadComponent: () => import('./pages/user-profile-page/user-profile-page.component').then(m => m.UserProfilePageComponent),
    canActivate: [authGuard],
  },
  {
    path: '',
    loadComponent: () => import('./pages/main-page/main-page.component').then(m => m.MainPageComponent),
  },
  {
    path: 'event/:id',
    loadComponent: () => import('./pages/event-page/event-page.component').then(m => m.EventPageComponent),
  },
  {
    path: 'create',
    loadComponent: () => import('./pages/create-event-page/create-event-page.component').then(m => m.CreateEventPageComponent),
  }
];
