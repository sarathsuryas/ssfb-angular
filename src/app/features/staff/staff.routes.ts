import { Routes } from '@angular/router';

import { StaffCustomersService } from './services/staff-customers.service';

export const STAFF_ROUTES: Routes = [
  {
    path: '',
    providers: [StaffCustomersService],
    children: [
      {
        path: '',
        title: 'Staff · SSFB',
        loadComponent: () =>
          import('./pages/staff-home-page/staff-home-page').then(
            (m) => m.StaffHomePage,
          ),
      },
      {
        path: 'customers/new',
        title: 'Create customer · SSFB',
        loadComponent: () =>
          import('./pages/create-customer-page/create-customer-page').then(
            (m) => m.CreateCustomerPage,
          ),
      },
    ],
  },
];
