import { Routes } from '@angular/router';

import { AdminUsersService } from './services/admin-users.service';

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    providers: [AdminUsersService],
    children: [
      {
        path: '',
        title: 'Admin · SSFB',
        loadComponent: () =>
          import('./pages/admin-home-page/admin-home-page').then(
            (m) => m.AdminHomePage,
          ),
      },
      {
        path: 'users',
        title: 'Users · SSFB',
        loadComponent: () =>
          import('./pages/users-page/users-page').then((m) => m.UsersPage),
      },
      {
        path: 'staff/new',
        title: 'Create staff · SSFB',
        data: { role: 'STAFF' },
        loadComponent: () =>
          import('./pages/create-user-page/create-user-page').then(
            (m) => m.CreateUserPage,
          ),
      },
      {
        path: 'customers/new',
        title: 'Create customer · SSFB',
        data: { role: 'CUSTOMER' },
        loadComponent: () =>
          import('./pages/create-user-page/create-user-page').then(
            (m) => m.CreateUserPage,
          ),
      },
    ],
  },
];
