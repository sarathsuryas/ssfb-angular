import { Routes } from '@angular/router';

import { authGuard } from '@core/auth/auth.guard';

/** Full paths, spread into the root route table (the auth pages own their layout). */
export const AUTH_ROUTES: Routes = [
  {
    path: 'login',
    title: 'Sign in · SSFB',
    loadComponent: () =>
      import('./login-page/login-page').then((m) => m.LoginPage),
  },
  {
    path: 'change-password',
    title: 'Change password · SSFB',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./change-password-page/change-password-page').then(
        (m) => m.ChangePasswordPage,
      ),
  },
];
