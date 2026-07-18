import { Routes } from '@angular/router';
import { authGuard } from './core/auth.guard';

export const routes: Routes = [
  {
    path: 'auth/login',
    loadComponent: () => import('./auth/login/login').then((m) => m.Login),
  },
  {
    path: 'auth/register',
    loadComponent: () => import('./auth/register/register').then((m) => m.Register),
  },
  {
    path: '',
    loadComponent: () => import('./home/home').then((m) => m.Home),
    canActivate: [authGuard],
  },
];
