import { Routes } from '@angular/router';

export const STAFF_ROUTES: Routes = [
  {
    path: '',
    title: 'Staff · SSFB',
    loadComponent: () =>
      import('./staff-home-page/staff-home-page').then((m) => m.StaffHomePage),
  },
];
