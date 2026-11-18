import { Routes } from '@angular/router';

export const CUSTOMER_ROUTES: Routes = [
  {
    path: '',
    title: 'Customer · SSFB',
    loadComponent: () =>
      import('./customer-home-page/customer-home-page').then(
        (m) => m.CustomerHomePage,
      ),
  },
];
