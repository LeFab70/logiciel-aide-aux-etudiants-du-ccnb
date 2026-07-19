import { Routes } from '@angular/router';
import { authGuard } from './core/auth.guard';
import { roleGuard } from './core/role.guard';

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
    path: 'auth/verify-email',
    loadComponent: () => import('./auth/verify-email/verify-email').then((m) => m.VerifyEmail),
  },
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () => import('./shell/app-shell').then((m) => m.AppShell),
    children: [
      {
        path: '',
        loadComponent: () => import('./home/home').then((m) => m.Home),
      },
      {
        path: 'faq',
        loadComponent: () => import('./campus-info/faq/faq-list').then((m) => m.FaqList),
      },
      {
        path: 'directory',
        loadComponent: () =>
          import('./campus-info/directory/directory-list').then((m) => m.DirectoryList),
      },
      {
        path: 'campus-plan',
        loadComponent: () =>
          import('./campus-info/campus-plan/campus-plan-view').then((m) => m.CampusPlanView),
      },
      {
        path: 'admin',
        canActivate: [roleGuard('ADMIN')],
        children: [
          {
            path: '',
            loadComponent: () => import('./admin/admin-home').then((m) => m.AdminHome),
          },
          {
            path: 'faq',
            loadComponent: () => import('./admin/faq-admin/faq-admin').then((m) => m.FaqAdmin),
          },
          {
            path: 'directory',
            loadComponent: () =>
              import('./admin/directory-admin/directory-admin').then((m) => m.DirectoryAdmin),
          },
          {
            path: 'campus-plan',
            loadComponent: () =>
              import('./admin/campus-plan-admin/campus-plan-admin').then((m) => m.CampusPlanAdmin),
          },
        ],
      },
    ],
  },
];
