import { authGuard } from '@core/auth/auth.guard';
import { roleGuard } from '@core/auth/role.guard';
import { MainLayout } from '@layout/main-layout/main-layout';
import { Routes } from '@angular/router';

import { AUTH_ROUTES } from './features/auth/auth.routes';

export const routes: Routes = [
  ...AUTH_ROUTES,
  {
    path: '',
    component: MainLayout,
    canActivate: [authGuard],
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'home' },
      {
        path: 'home',
        loadChildren: () =>
          import('./features/home/home.routes').then((m) => m.HOME_ROUTES),
      },
      {
        path: 'admin',
        canActivate: [roleGuard(['ADMIN'])],
        loadChildren: () =>
          import('./features/admin/admin.routes').then((m) => m.ADMIN_ROUTES),
      },
      {
        path: 'staff',
        canActivate: [roleGuard(['ADMIN', 'STAFF'])],
        loadChildren: () =>
          import('./features/staff/staff.routes').then((m) => m.STAFF_ROUTES),
      },
      {
        path: 'customer',
        canActivate: [roleGuard(['CUSTOMER'])],
        loadChildren: () =>
          import('./features/customer/customer.routes').then(
            (m) => m.CUSTOMER_ROUTES,
          ),
      },
    ],
  },
  { path: '**', redirectTo: 'home' },
];
