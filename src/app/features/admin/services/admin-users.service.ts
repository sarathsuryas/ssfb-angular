import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ApiService } from '@core/api/api.service';
import { CreateUserRequest, ManagedUser } from '@core/models/user-management.model';

/** Scoped to the admin area via providers on the admin parent route. */
@Injectable()
export class AdminUsersService {
  private readonly api = inject(ApiService);

  listUsers(): Observable<ManagedUser[]> {
    return this.api.get<ManagedUser[]>('/users');
  }

  createStaff(request: CreateUserRequest): Observable<ManagedUser> {
    return this.api.post<ManagedUser>('/admin/staff', request);
  }

  createCustomer(request: CreateUserRequest): Observable<ManagedUser> {
    return this.api.post<ManagedUser>('/staff/customers', request);
  }
}
